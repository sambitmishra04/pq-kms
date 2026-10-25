"""
Device registry: enrolment codes and device registration (Algorithm 1).
"""
from __future__ import annotations

import hashlib
import secrets

from app.audit.audit import get_audit_logger
from app.config import CTX_REG
from app.crypto.sig import verify as sig_verify
from app.database.db import get_db


def _hash_code(code: str) -> str:
    """SHA-256 hash of an enrolment code (one-way)."""
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def create_enrolment_code(device_id: str, role: str = "device") -> str:
    """
    Algorithm 1, step 1: Admin creates a one-time enrolment code for a device.
    The code hash is stored; the code itself is returned to the admin.

    Returns:
        Cleartext enrolment code (must be securely transmitted to device).
    """
    db = get_db()
    existing = db.get_device(device_id)
    if existing and existing["status"] == "AUTHORIZED":
        raise ValueError(f"Device '{device_id}' is already registered and AUTHORIZED")

    code = secrets.token_urlsafe(24)
    code_hash = _hash_code(code)
    db.create_enrolment_code_record(device_id, code_hash, role)
    get_audit_logger().log(
        actor="admin",
        event_type="ENROLMENT_CODE_CREATED",
        outcome="ACCEPTED",
        device_id=device_id,
    )
    return code


def register_device(
    device_id: str,
    enrolment_code: str,
    kem_public_key: bytes,
    sig_public_key: bytes,
    proof_signature: bytes,
    sig_algorithm: str,
) -> None:
    """
    Algorithm 1, steps 3–7: Register a device.

    Args:
        device_id: The device's unique identifier.
        enrolment_code: The one-time code issued by admin.
        kem_public_key: ML-KEM encapsulation (public) key bytes.
        sig_public_key: ML-DSA verification (public) key bytes.
        proof_signature: Sign_sk(CTX_REG | device_id | kem_pk | sig_pk).
        sig_algorithm: Algorithm used for the proof signature (e.g. "ML-DSA-65").

    Raises:
        ValueError: On any check failure.
    """
    db = get_db()
    audit = get_audit_logger()
    device = db.get_device(device_id)

    # Step 4: Code hash must match and device must be in PENDING state
    if device is None:
        audit.log("device", "REGISTRATION", "REJECTED", device_id, "Unknown device_id")
        raise ValueError("Unknown device_id — no enrolment code issued")

    if device["status"] == "AUTHORIZED":
        audit.log("device", "REGISTRATION", "REJECTED", device_id, "Already registered")
        raise ValueError("Device already registered")

    if device["status"] in ("REVOKED", "DISABLED"):
        audit.log("device", "REGISTRATION", "REJECTED", device_id, f"Device status={device['status']}")
        raise ValueError(f"Device is {device['status']}")

    if device["enrolment_code_hash"] is None:
        audit.log("device", "REGISTRATION", "REJECTED", device_id, "No pending enrolment code")
        raise ValueError("No pending enrolment code for this device")

    if _hash_code(enrolment_code) != device["enrolment_code_hash"]:
        audit.log("device", "REGISTRATION", "REJECTED", device_id, "Invalid enrolment code")
        raise ValueError("Invalid enrolment code")

    # Step 5: Verify proof-of-possession signature
    message = device_id.encode("utf-8") + kem_public_key + sig_public_key
    if not sig_verify(sig_public_key, message, proof_signature, CTX_REG, sig_algorithm):
        audit.log("device", "REGISTRATION", "REJECTED", device_id, "Proof-of-possession signature invalid")
        raise ValueError("Proof-of-possession signature verification failed")

    # Step 6: Store keys, mark AUTHORIZED, consume code
    db.register_device(device_id, kem_public_key, sig_public_key)
    audit.log(
        actor=device_id,
        event_type="REGISTRATION",
        outcome="ACCEPTED",
        device_id=device_id,
        details=f"sig_alg={sig_algorithm} kem_pk_len={len(kem_public_key)} sig_pk_len={len(sig_public_key)}",
    )
