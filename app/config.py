"""
PQ-KMS Configuration
All policy parameters in one place; overridable via environment variables.
"""
import os

# ─── Cryptographic algorithm selection ─────────────────────────────────────
KEM_ALG: str = os.environ.get("KEM_ALG", "ML-KEM-768")
SIG_ALG: str = os.environ.get("SIG_ALG", "ML-DSA-65")

# Parameter sets for sensitivity-analysis experiments
KEM_VARIANTS = ["ML-KEM-512", "ML-KEM-768", "ML-KEM-1024"]
SIG_VARIANTS = ["ML-DSA-44", "ML-DSA-65", "ML-DSA-87"]

# ─── Key lifecycle policy ──────────────────────────────────────────────────
SESSION_LIFETIME_S: int = int(os.environ.get("SESSION_LIFETIME_S", "60"))
MAX_MESSAGES: int = int(os.environ.get("MAX_MESSAGES", "1000"))
GRACE_WINDOW_S: int = int(os.environ.get("GRACE_WINDOW_S", "0"))

# ─── Protocol constants ────────────────────────────────────────────────────
TS_SKEW_S: int = int(os.environ.get("TS_SKEW_S", "30"))
NONCE_C_BYTES: int = int(os.environ.get("NONCE_C_BYTES", "16"))
AUDIT_HASH_CHAIN: bool = os.environ.get("AUDIT_HASH_CHAIN", "1") != "0"

# ─── Domain-separation context prefixes (ML-DSA context string) ───────────
CTX_REG: bytes = b"PQKMS-REG"       # Registration proof-of-possession
CTX_SREQ: bytes = b"PQKMS-SREQ"     # Session request
CTX_SRESP: bytes = b"PQKMS-SRESP"   # Session response
CTX_REV: bytes = b"PQKMS-REV"       # Revocation list

# ─── HKDF context binding ─────────────────────────────────────────────────
HKDF_PROTOCOL_LABEL: bytes = b"PQKMS-v1"
HKDF_ALGORITHM_LABEL: bytes = b"aes256gcm"

# ─── AES-GCM IV role identifiers (32 bits) ───────────────────────────────
IV_ROLE_CLIENT: int = 0x00000001
IV_ROLE_SERVER: int = 0x00000002

# ─── Access control ───────────────────────────────────────────────────────
ADMIN_TOKEN: str = os.environ.get("ADMIN_TOKEN", "admin-secret-token-change-in-production")

# ─── Server state ─────────────────────────────────────────────────────────
DATABASE_PATH: str = os.environ.get("DATABASE_PATH", "pqkms.db")
SERVER_KEY_PATH: str = os.environ.get("SERVER_KEY_PATH", "server_keys.json")
SERVER_HOST: str = os.environ.get("SERVER_HOST", "127.0.0.1")
SERVER_PORT: int = int(os.environ.get("SERVER_PORT", "8000"))

# ─── Rotation background task interval ────────────────────────────────────
ROTATION_CHECK_INTERVAL_S: int = int(os.environ.get("ROTATION_CHECK_INTERVAL_S", "10"))

# ─── Benchmark defaults ───────────────────────────────────────────────────
BENCH_WARMUP: int = int(os.environ.get("BENCH_WARMUP", "50"))
BENCH_TRIALS: int = int(os.environ.get("BENCH_TRIALS", "1000"))
BENCH_PAYLOAD_SIZES: list[int] = [128, 1024, 10240]   # bytes
BENCH_SIG_PAYLOAD_SIZES: list[int] = [1024, 10240]    # for signature scaling
