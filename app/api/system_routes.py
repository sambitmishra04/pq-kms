"""
System info routes: health, config, server status.
"""
from __future__ import annotations

import time
from datetime import datetime, timezone

from fastapi import APIRouter

system_router = APIRouter(prefix="/api/system", tags=["system"])

_start_time = time.time()


@system_router.get("/health")
def get_health():
    from app.config import KEM_ALG, SIG_ALG, SERVER_HOST, SERVER_PORT
    from app.database.db import get_db
    from app.key_management.lifecycle import get_lifecycle_manager

    uptime_s = int(time.time() - _start_time)
    hours = uptime_s // 3600
    minutes = (uptime_s % 3600) // 60
    seconds = uptime_s % 60

    lifecycle = get_lifecycle_manager()
    active_sessions = sum(1 for e in lifecycle.get_all_entries() if e.state == "ACTIVE")

    db = get_db()
    summary = db.get_state_summary()
    total_devices = len(summary["devices"])
    authorized_devices = sum(1 for d in summary["devices"] if d.get("status") == "AUTHORIZED")

    return {
        "status": "operational",
        "server_time": datetime.now(timezone.utc).isoformat(),
        "uptime": f"{hours:02d}:{minutes:02d}:{seconds:02d}",
        "uptime_seconds": uptime_s,
        "algorithms": {
            "kem": KEM_ALG,
            "sig": SIG_ALG,
            "symmetric": "AES-256-GCM",
            "kdf": "HKDF-SHA256",
        },
        "statistics": {
            "total_devices": total_devices,
            "authorized_devices": authorized_devices,
            "active_sessions": active_sessions,
            "latest_crl_version": summary.get("latest_crl_version", 0),
        }
    }


@system_router.get("/config")
def get_config():
    """Return safe-to-display configuration parameters (no secrets)."""
    from app.config import (
        KEM_ALG, SIG_ALG, KEM_VARIANTS, SIG_VARIANTS,
        SESSION_LIFETIME_S, MAX_MESSAGES, GRACE_WINDOW_S,
        TS_SKEW_S, NONCE_C_BYTES, AUDIT_HASH_CHAIN,
        ROTATION_CHECK_INTERVAL_S, DATABASE_PATH,
        BENCH_WARMUP, BENCH_TRIALS, BENCH_PAYLOAD_SIZES,
    )
    return {
        "cryptography": {
            "kem_algorithm": KEM_ALG,
            "sig_algorithm": SIG_ALG,
            "symmetric_cipher": "AES-256-GCM",
            "key_derivation": "HKDF-SHA256",
            "kem_variants": KEM_VARIANTS,
            "sig_variants": SIG_VARIANTS,
        },
        "lifecycle": {
            "session_lifetime_s": SESSION_LIFETIME_S,
            "max_messages_per_session": MAX_MESSAGES,
            "grace_window_s": GRACE_WINDOW_S,
            "rotation_check_interval_s": ROTATION_CHECK_INTERVAL_S,
        },
        "protocol": {
            "timestamp_skew_tolerance_s": TS_SKEW_S,
            "client_nonce_bytes": NONCE_C_BYTES,
            "audit_hash_chain_enabled": AUDIT_HASH_CHAIN,
        },
        "database": {
            "path": DATABASE_PATH,
            "engine": "SQLite WAL",
            "key_material_stored": False,
        },
        "benchmarking": {
            "warmup_cycles": BENCH_WARMUP,
            "trial_count": BENCH_TRIALS,
            "payload_sizes_bytes": BENCH_PAYLOAD_SIZES,
        },
    }
