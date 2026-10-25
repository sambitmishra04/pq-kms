"""
pytest conftest.py — shared fixtures for all test modules.
Starts the FastAPI server in-process and provides registered clients.
"""
from __future__ import annotations

import base64
import json
import os
import time
import uuid
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Set LD_LIBRARY_PATH before importing app modules
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    ld = os.environ.get("LD_LIBRARY_PATH", "")
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{ld}"

# Use a separate test database file
os.environ["DATABASE_PATH"] = "/tmp/test_pqkms.db"
os.environ["SERVER_KEY_PATH"] = "/tmp/test_server_keys.json"
os.environ["SESSION_LIFETIME_S"] = "3600"  # long for tests (override per-test where needed)
os.environ["ADMIN_TOKEN"] = "test-admin-token"

# Clean up any leftover test files
Path("/tmp/test_pqkms.db").unlink(missing_ok=True)
Path("/tmp/test_pqkms.db-wal").unlink(missing_ok=True)
Path("/tmp/test_pqkms.db-shm").unlink(missing_ok=True)
Path("/tmp/test_server_keys.json").unlink(missing_ok=True)

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client():
    """FastAPI test client (shared for the whole session)."""
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="session")
def admin_headers():
    return {"X-Admin-Token": "test-admin-token"}


@pytest.fixture(scope="session")
def server_verify_key_hex(client, admin_headers):
    """Get the server's public verification key."""
    from app.main import get_server_sig_key
    _, vk = get_server_sig_key()
    return vk.hex()


def _enrol_and_register(client, admin_headers, device_id: str | None = None) -> dict:
    """Helper: enrol a device and register it. Returns device info dict."""
    import oqs
    from app.config import KEM_ALG, SIG_ALG, CTX_REG
    from app.crypto.sig import sign as sig_sign

    did = device_id or f"test-device-{uuid.uuid4().hex[:8]}"

    # Enrol
    resp = client.post("/enrol", json={"device_id": did, "role": "device"}, headers=admin_headers)
    assert resp.status_code == 200, resp.text
    code = resp.json()["enrolment_code"]

    # Generate keys
    kem = oqs.KeyEncapsulation(KEM_ALG)
    kem_pk = kem.generate_keypair()
    sig_obj = oqs.Signature(SIG_ALG)
    sig_pk = sig_obj.generate_keypair()
    sig_sk = sig_obj.export_secret_key()

    # Proof of possession
    message = did.encode() + kem_pk + sig_pk
    proof = sig_sign(sig_sk, message, CTX_REG, SIG_ALG)

    # Register
    resp = client.post("/register", json={
        "device_id": did,
        "enrolment_code": code,
        "kem_public_key_b64": base64.b64encode(kem_pk).decode(),
        "sig_public_key_b64": base64.b64encode(sig_pk).decode(),
        "proof_signature_b64": base64.b64encode(proof).decode(),
        "sig_algorithm": SIG_ALG,
    })
    assert resp.status_code == 200, resp.text

    return {
        "device_id": did,
        "kem_pk": kem_pk,
        "kem_obj": kem,
        "sig_pk": sig_pk,
        "sig_sk": sig_sk,
    }


def _establish_session(client, device_info: dict, server_verify_key_hex: str) -> dict:
    """Helper: establish a session for a registered device. Returns session dict."""
    import os
    from app.config import NONCE_C_BYTES, CTX_SREQ, CTX_SRESP, SIG_ALG, KEM_ALG
    from app.crypto.kdf import derive_session_key
    from app.crypto.sig import sign as sig_sign, verify as sig_verify
    from app.crypto.kem import decapsulate

    did = device_info["device_id"]
    nonce_c = os.urandom(NONCE_C_BYTES)
    timestamp = time.time()
    message = did.encode() + nonce_c + str(timestamp).encode()
    sig = sig_sign(device_info["sig_sk"], message, CTX_SREQ, SIG_ALG)

    resp = client.post("/session", json={
        "device_id": did,
        "nonce_c_b64": base64.b64encode(nonce_c).decode(),
        "timestamp": timestamp,
        "signature_b64": base64.b64encode(sig).decode(),
        "sig_algorithm": SIG_ALG,
        "kem_algorithm": KEM_ALG,
    })
    assert resp.status_code == 200, resp.text
    data = resp.json()

    # Verify server signature
    session_id = data["session_id"]
    ct = base64.b64decode(data["ciphertext_b64"])
    srv_sig = base64.b64decode(data["server_signature_b64"])
    server_vk = bytes.fromhex(server_verify_key_hex)
    resp_msg = ct + session_id.encode() + data["expires_at"].encode()
    assert sig_verify(server_vk, resp_msg, srv_sig, CTX_SRESP, SIG_ALG)

    # Decap + derive key
    shared_secret = decapsulate(device_info["kem_obj"], ct)
    session_key = derive_session_key(shared_secret, nonce_c, did, session_id)

    return {
        "session_id": session_id,
        "key_id": data["key_id"],
        "session_key": session_key,
        "nonce_c": nonce_c,
        "expires_at": data["expires_at"],
        "counter": 0,
    }
