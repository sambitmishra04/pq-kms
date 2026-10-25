"""
Cryptographic KEM module: ML-KEM (and classical X25519 baseline).
Wraps liboqs for ML-KEM operations with input validation.
"""
from __future__ import annotations

import oqs

from app.config import KEM_ALG


def get_kem(algorithm: str = KEM_ALG) -> oqs.KeyEncapsulation:
    """Return an oqs.KeyEncapsulation object for the given algorithm."""
    try:
        return oqs.KeyEncapsulation(algorithm)
    except Exception as exc:
        raise RuntimeError(
            f"KEM algorithm '{algorithm}' is not available. "
            f"Available KEMs: {oqs.get_enabled_kem_mechanisms()}"
        ) from exc


def generate_kem_keypair(algorithm: str = KEM_ALG) -> tuple[bytes, oqs.KeyEncapsulation]:
    """
    Generate a KEM key pair.

    Returns:
        (encapsulation_key_bytes, kem_object_with_decap_key)
    The kem object holds the secret decapsulation key internally.
    """
    kem = get_kem(algorithm)
    public_key: bytes = kem.generate_keypair()
    return public_key, kem


def encapsulate(public_key: bytes, algorithm: str = KEM_ALG) -> tuple[bytes, bytes]:
    """
    Encapsulate to a public key.

    Args:
        public_key: The encapsulation (public) key bytes.
        algorithm: KEM algorithm name.

    Returns:
        (ciphertext, shared_secret) — the shared secret is NOT transmitted.

    Raises:
        ValueError: If the public key length is wrong.
    """
    kem = get_kem(algorithm)
    expected_len = kem.details["length_public_key"]
    if len(public_key) != expected_len:
        raise ValueError(
            f"Public key length mismatch: got {len(public_key)}, "
            f"expected {expected_len} for {algorithm}"
        )
    ciphertext, shared_secret = kem.encap_secret(public_key)
    return ciphertext, shared_secret


def decapsulate(kem_obj: oqs.KeyEncapsulation, ciphertext: bytes) -> bytes:
    """
    Decapsulate a ciphertext to recover the shared secret.

    Args:
        kem_obj: The oqs KEM object holding the secret decapsulation key.
        ciphertext: The KEM ciphertext from the server.

    Returns:
        shared_secret bytes (32 bytes for ML-KEM-768)

    Raises:
        ValueError: If ciphertext length is wrong.
    """
    expected_len = kem_obj.details["length_ciphertext"]
    if len(ciphertext) != expected_len:
        raise ValueError(
            f"Ciphertext length mismatch: got {len(ciphertext)}, "
            f"expected {expected_len}"
        )
    return kem_obj.decap_secret(ciphertext)


def kem_details(algorithm: str = KEM_ALG) -> dict:
    """Return size details for the given KEM algorithm."""
    kem = get_kem(algorithm)
    return {
        "algorithm": algorithm,
        "length_public_key": kem.details["length_public_key"],
        "length_secret_key": kem.details["length_secret_key"],
        "length_ciphertext": kem.details["length_ciphertext"],
        "length_shared_secret": kem.details["length_shared_secret"],
    }
