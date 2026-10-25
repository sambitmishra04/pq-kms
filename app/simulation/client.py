"""
Simulated Biochip Client — full protocol implementation.
Represents the controller side of a networked DMFB (like PortableLab ESP8266+STM32).
"""
from __future__ import annotations

import base64
import os
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path

import httpx

from app.config import (
    CTX_REG,
    CTX_SREQ,
    CTX_SRESP,
    IV_ROLE_CLIENT,
    KEM_ALG,
    NONCE_C_BYTES,
    SIG_ALG,
)
from app.crypto.aead import encrypt as aead_encrypt
from app.crypto.kdf import derive_session_key
from app.crypto.kem import decapsulate, generate_kem_keypair
from app.crypto.sig import sign as sig_sign
from app.crypto.sig import verify as sig_verify
from app.revocation.revocation import verify_crl


# ─── LD_LIBRARY_PATH for liboqs (needed when run standalone) ─────────────────
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    ld = os.environ.get("LD_LIBRARY_PATH", "")
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{ld}"


@dataclass
class ClientSession:
    """Active session state held by the client."""
    session_id: str
    key_bytes: bytes
    counter: int = 0
    expires_at: str = ""
    key_id: str = ""


class BiochipClient:
    """
    Simulated biochip device client implementing the full PQ-KMS protocol.

    Holds its own ML-KEM and ML-DSA keypairs. Communicates with the PQ-KMS
    server via HTTP REST calls.
    """

    def __init__(
        self,
        device_id: str,
        server_url: str,
        server_verify_key_hex: str,
        kem_algorithm: str = KEM_ALG,
        sig_algorithm: str = SIG_ALG,
    ) -> None:
        self.device_id = device_id
        self.server_url = server_url.rstrip("/")
        self.server_verify_key = bytes.fromhex(server_verify_key_hex)
        self.kem_algorithm = kem_algorithm
        self.sig_algorithm = sig_algorithm

        # Generate device keypairs
        self.kem_pk, self._kem_obj = generate_kem_keypair(kem_algorithm)
        self.sig_pk, self.sig_sk = self._generate_sig_keypair()

        self._session: ClientSession | None = None
        self._held_crl_version: int = 0

    def _generate_sig_keypair(self) -> tuple[bytes, bytes]:
        from app.crypto.sig import generate_sig_keypair
        return generate_sig_keypair(self.sig_algorithm)

    # ─── Registration (Algorithm 1) ──────────────────────────────────────────

    def register(self, enrolment_code: str) -> dict:
        """
        Algorithm 1 (client side): Register with proof-of-possession signature.
        """
        # Build proof-of-possession: Sign(CTX_REG | device_id | kem_pk | sig_pk)
        message = (
            self.device_id.encode("utf-8")
            + self.kem_pk
            + self.sig_pk
        )
        proof_sig = sig_sign(self.sig_sk, message, CTX_REG, self.sig_algorithm)

        payload = {
            "device_id": self.device_id,
            "enrolment_code": enrolment_code,
            "kem_public_key_b64": base64.b64encode(self.kem_pk).decode(),
            "sig_public_key_b64": base64.b64encode(self.sig_pk).decode(),
            "proof_signature_b64": base64.b64encode(proof_sig).decode(),
            "sig_algorithm": self.sig_algorithm,
        }
        resp = httpx.post(f"{self.server_url}/register", json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()

    # ─── Session establishment (Algorithm 2) ─────────────────────────────────

    def establish_session(self) -> ClientSession:
        """
        Algorithm 2 (client side): Signed session request → receive ciphertext
        → ML-KEM decap → HKDF key derivation.
        """
        nonce_c = os.urandom(NONCE_C_BYTES)
        timestamp = time.time()

        # Sign the session request
        message = (
            self.device_id.encode("utf-8")
            + nonce_c
            + str(timestamp).encode("utf-8")
        )
        client_sig = sig_sign(self.sig_sk, message, CTX_SREQ, self.sig_algorithm)

        payload = {
            "device_id": self.device_id,
            "nonce_c_b64": base64.b64encode(nonce_c).decode(),
            "timestamp": timestamp,
            "signature_b64": base64.b64encode(client_sig).decode(),
            "sig_algorithm": self.sig_algorithm,
            "kem_algorithm": self.kem_algorithm,
        }
        resp = httpx.post(f"{self.server_url}/session", json=payload, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        session_id = data["session_id"]
        ciphertext = base64.b64decode(data["ciphertext_b64"])
        server_sig = base64.b64decode(data["server_signature_b64"])
        expires_at = data["expires_at"]

        # Step 7: Verify server signature over (ciphertext | session_id | expiry)
        resp_message = (
            ciphertext
            + session_id.encode("utf-8")
            + expires_at.encode("utf-8")
        )
        if not sig_verify(self.server_verify_key, resp_message, server_sig, CTX_SRESP, self.sig_algorithm):
            raise ValueError("Server session response signature verification FAILED")

        # ML-KEM decapsulation → shared secret
        shared_secret = decapsulate(self._kem_obj, ciphertext)

        # HKDF key derivation (client side — same formula as server)
        session_key = derive_session_key(shared_secret, nonce_c, self.device_id, session_id)

        self._session = ClientSession(
            session_id=session_id,
            key_bytes=session_key,
            key_id=data.get("key_id", ""),
            expires_at=expires_at,
        )
        return self._session

    # ─── Send protected message (Algorithm 3) ────────────────────────────────

    def send_message(self, payload: bytes) -> dict:
        """
        Algorithm 3 (client side): AES-256-GCM encrypt and send a message.

        Args:
            payload: Plaintext message bytes (synthetic diagnostic data).

        Returns:
            Server response dict.
        """
        if self._session is None:
            raise RuntimeError("No active session — call establish_session() first")

        self._session.counter += 1
        message_id = str(uuid.uuid4())

        ciphertext_with_tag, nonce = aead_encrypt(
            key=self._session.key_bytes,
            plaintext=payload,
            role=IV_ROLE_CLIENT,
            counter=self._session.counter,
            device_id=self.device_id,
            session_id=self._session.session_id,
            message_id=message_id,
        )

        req_payload = {
            "device_id": self.device_id,
            "session_id": self._session.session_id,
            "message_id": message_id,
            "counter": self._session.counter,
            "ciphertext_b64": base64.b64encode(ciphertext_with_tag).decode(),
            "nonce_b64": base64.b64encode(nonce).decode(),
        }
        resp = httpx.post(f"{self.server_url}/message", json=req_payload, timeout=30)
        resp.raise_for_status()
        return resp.json()

    # ─── CRL fetch and verify ─────────────────────────────────────────────────

    def fetch_and_verify_crl(self) -> dict | None:
        """
        Fetch the latest signed CRL from the server and verify it.
        Returns the CRL if valid and newer than held version.
        """
        resp = httpx.get(f"{self.server_url}/revocations", timeout=10)
        if resp.status_code == 200 and resp.json() is not None:
            crl = resp.json()
            crl_data = {
                "version": crl["version"],
                "issued_at": crl["issued_at"],
                "device_ids": crl["device_ids"],
            }
            try:
                verify_crl(crl_data, crl["signature_hex"], self.server_verify_key, self._held_crl_version, self.sig_algorithm)
                self._held_crl_version = crl["version"]
                return crl
            except ValueError:
                return None
        return None
