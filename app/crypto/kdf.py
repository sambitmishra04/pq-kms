"""
HKDF-SHA256 session key derivation (RFC 5869).
Derives a 32-byte AES-256 session key from the ML-KEM shared secret,
binding it to the session context so keys of different sessions are independent.
"""
from __future__ import annotations

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

from app.config import HKDF_ALGORITHM_LABEL, HKDF_PROTOCOL_LABEL


def derive_session_key(
    shared_secret: bytes,
    nonce_c: bytes,
    device_id: str,
    session_id: str,
) -> bytes:
    """
    Derive a 32-byte AES-256 session key.

    SK = HKDF-SHA256(
        IKM  = shared_secret,   (ML-KEM shared secret, 32 bytes)
        salt = nonce_c,         (client nonce, non-secret, 16 bytes)
        info = "PQKMS-v1" || device_id || session_id || "aes256gcm",
        L    = 32
    )

    Args:
        shared_secret: ML-KEM shared secret (32 bytes).
        nonce_c: Client-supplied nonce used as HKDF salt (16 bytes).
        device_id: Device identifier string.
        session_id: Session identifier string.

    Returns:
        32-byte symmetric key for AES-256-GCM.
    """
    info = (
        HKDF_PROTOCOL_LABEL
        + device_id.encode("utf-8")
        + session_id.encode("utf-8")
        + HKDF_ALGORITHM_LABEL
    )
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=nonce_c,
        info=info,
    )
    return hkdf.derive(shared_secret)
