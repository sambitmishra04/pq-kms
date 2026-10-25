"""
ML-DSA (and Ed25519 baseline) signature module.
Domain-separation is enforced via context prefix prepended to the signed message.
"""
from __future__ import annotations

import oqs

from app.config import SIG_ALG


def get_sig(algorithm: str = SIG_ALG) -> oqs.Signature:
    """Return an oqs.Signature object for the given algorithm."""
    try:
        return oqs.Signature(algorithm)
    except Exception as exc:
        raise RuntimeError(
            f"Signature algorithm '{algorithm}' is not available. "
            f"Available: {oqs.get_enabled_sig_mechanisms()}"
        ) from exc


def generate_sig_keypair(algorithm: str = SIG_ALG) -> tuple[bytes, bytes]:
    """
    Generate a signing keypair.

    Returns:
        (public_key_bytes, private_key_bytes)
    """
    sig = get_sig(algorithm)
    public_key: bytes = sig.generate_keypair()
    private_key: bytes = sig.export_secret_key()
    return public_key, private_key


def sign(
    private_key: bytes,
    message: bytes,
    context_prefix: bytes,
    algorithm: str = SIG_ALG,
) -> bytes:
    """
    Sign a message with domain separation.

    The actual signed bytes are: context_prefix + len(message).to_bytes(4,'big') + message
    so that different prefixes cannot produce the same signed bytes.

    Args:
        private_key: The ML-DSA signing key bytes.
        message: The message to sign.
        context_prefix: Domain-separation prefix (e.g. b"PQKMS-REG").
        algorithm: Signature algorithm name.

    Returns:
        Signature bytes.
    """
    sig = get_sig(algorithm)
    sig_obj = oqs.Signature(algorithm, private_key)
    signed_bytes = _encode_for_signing(context_prefix, message)
    return sig_obj.sign(signed_bytes)


def verify(
    public_key: bytes,
    message: bytes,
    signature: bytes,
    context_prefix: bytes,
    algorithm: str = SIG_ALG,
) -> bool:
    """
    Verify a signature.

    Returns:
        True if valid, False otherwise. Never raises on verification failure.
    """
    try:
        sig = get_sig(algorithm)
        sig_obj = oqs.Signature(algorithm)
        signed_bytes = _encode_for_signing(context_prefix, message)
        return sig_obj.verify(signed_bytes, signature, public_key)
    except Exception:
        return False


def _encode_for_signing(context_prefix: bytes, message: bytes) -> bytes:
    """
    Canonical encoding: prefix || len(message, 4 bytes big-endian) || message.
    Prevents different field boundaries from producing the same signed bytes.
    """
    return context_prefix + len(message).to_bytes(4, "big") + message


def sig_details(algorithm: str = SIG_ALG) -> dict:
    """Return size details for the given signature algorithm."""
    sig = get_sig(algorithm)
    return {
        "algorithm": algorithm,
        "length_public_key": sig.details["length_public_key"],
        "length_secret_key": sig.details["length_secret_key"],
        "length_signature": sig.details["length_signature"],
    }
