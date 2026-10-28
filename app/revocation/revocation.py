"""
Revocation manager: Algorithm 5.
Revokes devices, builds ML-DSA-signed CRLs, and verifies incoming CRLs.
"""
from __future__ import annotations

import json
import time

from app.audit.audit import get_audit_logger
from app.config import CTX_REV, SIG_ALG
from app.crypto.sig import sign as sig_sign
from app.crypto.sig import verify as sig_verify
from app.database.db import get_db
from app.key_management.lifecycle import get_lifecycle_manager


def _encode_crl(crl_data: dict) -> bytes:
    """Canonical JSON encoding of CRL data for signing."""
    return json.dumps(crl_data, sort_keys=True, separators=(",", ":")).encode("utf-8")


def revoke_device(
    device_id: str,
    server_signing_key: bytes,
    sig_algorithm: str = SIG_ALG,
) -> dict:
    """
    Algorithm 5 (server side): Revoke a device.
    1. Mark device REVOKED.
    2. Compromise and destroy all active sessions.
    3. Build versioned CRL and sign with server ML-DSA key.
    4. Publish the signed CRL.

    Returns:
        The new CRL dict (version, issued_at, device_ids, signature).
    """
    db = get_db()
    audit = get_audit_logger()
    lifecycle = get_lifecycle_manager()

    device = db.get_device(device_id)
    if device is None:
        raise ValueError(f"Device '{device_id}' not found")

    # Mark REVOKED
    db.set_device_status(device_id, "REVOKED")
    audit.log("admin", "DEVICE_REVOKED", "ACCEPTED", device_id)

    # Compromise all sessions → destroy them
    compromised = lifecycle.compromise_device_sessions(device_id)
    audit.log(
        "server",
        "SESSIONS_COMPROMISED",
        "INFO",
        device_id,
        details=f"sessions={compromised}",
    )

    # Build new CRL (version = previous + 1, include ALL revoked devices)
    existing_crl = db.get_latest_revocation_list()
    prev_version = existing_crl["list_version"] if existing_crl else 0
    prev_revoked = existing_crl["device_ids"] if existing_crl else []

    new_version = prev_version + 1
    all_revoked = sorted(set(prev_revoked + [device_id]))

    crl_data = {
        "version": new_version,
        "issued_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "device_ids": all_revoked,
    }
    crl_bytes = _encode_crl(crl_data)
    signature = sig_sign(server_signing_key, crl_bytes, CTX_REV, sig_algorithm)

    db.save_revocation_list(new_version, all_revoked, signature, issued_at=crl_data["issued_at"])
    audit.log(
        "server",
        "CRL_ISSUED",
        "ACCEPTED",
        device_id,
        details=f"version={new_version} revoked_count={len(all_revoked)}",
    )

    return {**crl_data, "signature": signature.hex()}


def get_latest_crl(server_verify_key: bytes, sig_algorithm: str = SIG_ALG) -> dict | None:
    """
    Retrieve the latest signed CRL for distribution.

    Returns:
        CRL dict with signature as hex string, or None if no CRL exists.
    """
    db = get_db()
    crl = db.get_latest_revocation_list()
    if crl is None:
        return None
    crl_data = {
        "version": crl["list_version"],
        "issued_at": crl["issued_at"],
        "device_ids": crl["device_ids"],
    }
    return {**crl_data, "signature": crl["signature"].hex() if isinstance(crl["signature"], bytes) else crl["signature"]}


def verify_crl(
    crl_data: dict,
    signature_hex: str,
    server_verify_key: bytes,
    held_version: int,
    sig_algorithm: str = SIG_ALG,
) -> bool:
    """
    Algorithm 5 (verifier side): Verify a CRL.
    Checks:
    1. ML-DSA signature is valid.
    2. Version > held_version (prevents rollback).

    Returns:
        True if the CRL should replace the held one.

    Raises:
        ValueError: If signature invalid or version not newer.
    """
    audit = get_audit_logger()
    crl_bytes = _encode_crl(
        {k: crl_data[k] for k in ("version", "issued_at", "device_ids")}
    )
    signature = bytes.fromhex(signature_hex)

    if not sig_verify(server_verify_key, crl_bytes, signature, CTX_REV, sig_algorithm):
        audit.log("verifier", "CRL_VERIFY", "REJECTED", details="Invalid CRL signature")
        raise ValueError("CRL signature verification failed")

    if crl_data["version"] <= held_version:
        audit.log(
            "verifier",
            "CRL_VERIFY",
            "REJECTED",
            details=f"Stale CRL version={crl_data['version']} held={held_version}",
        )
        raise ValueError(
            f"CRL version {crl_data['version']} is not newer than held {held_version}"
        )

    audit.log("verifier", "CRL_VERIFY", "ACCEPTED", details=f"version={crl_data['version']}")
    return True
