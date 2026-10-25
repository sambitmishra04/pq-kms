"""
AES-256-GCM authenticated encryption/decryption.
Uses a deterministic 96-bit IV: role32 || counter64 (SP 800-38D §8.2.1).
Associated data (AAD) binds ciphertext to its session context.
"""
from __future__ import annotations

import struct

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.config import IV_ROLE_CLIENT, IV_ROLE_SERVER


def _build_iv(role: int, counter: int) -> bytes:
    """
    Construct a deterministic 96-bit (12-byte) IV.
      Bytes 0-3:  role (32 bits big-endian): client=0x00000001, server=0x00000002
      Bytes 4-11: counter (64 bits big-endian), strictly monotonic per direction.
    """
    return struct.pack(">I", role) + struct.pack(">Q", counter)


def _build_aad(device_id: str, session_id: str, message_id: str, counter: int) -> bytes:
    """
    Build Associated Authenticated Data (AAD).
    Authenticated but not encrypted; binds ciphertext to its session context.
    """
    parts = [
        device_id.encode("utf-8"),
        session_id.encode("utf-8"),
        message_id.encode("utf-8"),
        struct.pack(">Q", counter),
    ]
    # Length-prefix each part so concatenation is unambiguous
    encoded = b""
    for p in parts:
        encoded += struct.pack(">H", len(p)) + p
    return encoded


def encrypt(
    key: bytes,
    plaintext: bytes,
    role: int,
    counter: int,
    device_id: str,
    session_id: str,
    message_id: str,
) -> tuple[bytes, bytes]:
    """
    Encrypt plaintext with AES-256-GCM.

    Args:
        key: 32-byte AES-256 key.
        plaintext: Message bytes to encrypt.
        role: IV_ROLE_CLIENT or IV_ROLE_SERVER.
        counter: Strictly monotonic per-direction counter (starts at 1).
        device_id, session_id, message_id: Context for AAD.

    Returns:
        (ciphertext_with_tag, nonce) — nonce is stored for decryption.
        The ciphertext includes the 16-byte GCM authentication tag appended.
    """
    if len(key) != 32:
        raise ValueError(f"AES-256 key must be 32 bytes, got {len(key)}")
    nonce = _build_iv(role, counter)
    aad = _build_aad(device_id, session_id, message_id, counter)
    aesgcm = AESGCM(key)
    ciphertext_with_tag = aesgcm.encrypt(nonce, plaintext, aad)
    return ciphertext_with_tag, nonce


def decrypt(
    key: bytes,
    ciphertext_with_tag: bytes,
    nonce: bytes,
    device_id: str,
    session_id: str,
    message_id: str,
    counter: int,
) -> bytes:
    """
    Decrypt and authenticate an AES-256-GCM ciphertext.

    Args:
        key: 32-byte AES-256 key.
        ciphertext_with_tag: Ciphertext with appended GCM tag.
        nonce: The 12-byte IV used during encryption.
        device_id, session_id, message_id: Context for AAD (must match encryption).
        counter: Counter value used during encryption (for AAD reconstruction).

    Returns:
        Decrypted plaintext bytes.

    Raises:
        cryptography.exceptions.InvalidTag: If authentication fails (tampered data).
        ValueError: If key length is wrong.
    """
    if len(key) != 32:
        raise ValueError(f"AES-256 key must be 32 bytes, got {len(key)}")
    aad = _build_aad(device_id, session_id, message_id, counter)
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext_with_tag, aad)
