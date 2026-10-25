"""
Classical cryptographic baseline: X25519 (ECDH) + Ed25519 (signatures).
Provides the same API shape as kem.py and sig.py for fair comparison.
These are used ONLY for benchmarking comparison; they are quantum-vulnerable.
"""
from __future__ import annotations

from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)
from cryptography.hazmat.primitives.asymmetric.x25519 import (
    X25519PrivateKey,
    X25519PublicKey,
)
from cryptography.hazmat.primitives.serialization import (
    Encoding,
    NoEncryption,
    PrivateFormat,
    PublicFormat,
)


# ─── X25519 Key Agreement ─────────────────────────────────────────────────


def x25519_generate_keypair() -> tuple[bytes, X25519PrivateKey]:
    """
    Generate an X25519 keypair.

    Returns:
        (public_key_bytes, private_key_object)
    """
    private_key = X25519PrivateKey.generate()
    public_key_bytes = private_key.public_key().public_bytes(
        encoding=Encoding.Raw, format=PublicFormat.Raw
    )
    return public_key_bytes, private_key


def x25519_agree(private_key: X25519PrivateKey, peer_public_key_bytes: bytes) -> bytes:
    """
    Perform X25519 key agreement.

    Args:
        private_key: Our X25519 private key.
        peer_public_key_bytes: The peer's raw 32-byte public key.

    Returns:
        32-byte shared secret (raw output; use HKDF for key derivation).
    """
    peer_public = X25519PublicKey.from_public_bytes(peer_public_key_bytes)
    return private_key.exchange(peer_public)


def x25519_public_bytes(private_key: X25519PrivateKey) -> bytes:
    """Extract raw public key bytes from an X25519 private key."""
    return private_key.public_key().public_bytes(
        encoding=Encoding.Raw, format=PublicFormat.Raw
    )


# ─── Ed25519 Signatures ───────────────────────────────────────────────────


def ed25519_generate_keypair() -> tuple[bytes, bytes]:
    """
    Generate an Ed25519 keypair.

    Returns:
        (public_key_bytes, private_key_bytes) — both as raw bytes.
    """
    private_key = Ed25519PrivateKey.generate()
    public_key_bytes = private_key.public_key().public_bytes(
        encoding=Encoding.Raw, format=PublicFormat.Raw
    )
    private_key_bytes = private_key.private_bytes(
        encoding=Encoding.Raw,
        format=PrivateFormat.Raw,
        encryption_algorithm=NoEncryption(),
    )
    return public_key_bytes, private_key_bytes


def ed25519_sign(
    private_key_bytes: bytes,
    message: bytes,
    context_prefix: bytes,
) -> bytes:
    """
    Sign a message using Ed25519 with domain separation prefix.

    Args:
        private_key_bytes: Raw 32-byte Ed25519 private key.
        message: Message bytes.
        context_prefix: Domain-separation prefix (must match verify call).

    Returns:
        64-byte Ed25519 signature.
    """
    private_key = Ed25519PrivateKey.from_private_bytes(private_key_bytes)
    signed_bytes = _encode_for_signing(context_prefix, message)
    return private_key.sign(signed_bytes)


def ed25519_verify(
    public_key_bytes: bytes,
    message: bytes,
    signature: bytes,
    context_prefix: bytes,
) -> bool:
    """
    Verify an Ed25519 signature.

    Returns:
        True if valid, False on any failure.
    """
    try:
        from cryptography.exceptions import InvalidSignature
        public_key = Ed25519PublicKey.from_public_bytes(public_key_bytes)
        signed_bytes = _encode_for_signing(context_prefix, message)
        public_key.verify(signature, signed_bytes)
        return True
    except Exception:
        return False


def _encode_for_signing(context_prefix: bytes, message: bytes) -> bytes:
    """Same canonical encoding as sig.py for consistency."""
    return context_prefix + len(message).to_bytes(4, "big") + message


# ─── Size info ────────────────────────────────────────────────────────────

X25519_PUBLIC_KEY_BYTES = 32
X25519_SHARED_SECRET_BYTES = 32
ED25519_PUBLIC_KEY_BYTES = 32
ED25519_PRIVATE_KEY_BYTES = 32
ED25519_SIGNATURE_BYTES = 64
