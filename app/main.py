"""
PQ-KMS server entry point.
Initialises the database, generates the server ML-DSA signing keypair,
starts the background key-rotation task, and mounts the FastAPI app.
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Ensure the liboqs shared library is found
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    ld = os.environ.get("LD_LIBRARY_PATH", "")
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{ld}"

import oqs  # noqa: E402 — must come after LD_LIBRARY_PATH is set

from app.api.routes import router
from app.audit.audit import get_audit_logger
from app.config import (
    KEM_ALG,
    ROTATION_CHECK_INTERVAL_S,
    SERVER_HOST,
    SERVER_KEY_PATH,
    SERVER_PORT,
    SIG_ALG,
)
from app.database.db import get_db
from app.key_management.lifecycle import get_lifecycle_manager

app = FastAPI(
    title="PQ-KMS — Post-Quantum Key Management System",
    description="Quantum-resistant key management for Digital Microfluidic Biochip networks",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

from app.auth.routes import auth_router
from app.api.dmfb_routes import dmfb_router
from app.api.system_routes import system_router

app.include_router(auth_router)
app.include_router(dmfb_router)
app.include_router(system_router)

# Attack Lab is an isolated evaluation suite, excluded from standard hospital production server
if os.environ.get("ENABLE_ATTACK_LAB", "0") == "1":
    from app.api.attack_lab_routes import attack_lab_router
    app.include_router(attack_lab_router)

# ─── Server signing keypair (persisted across restarts for client pinning) ─────
_server_sk: bytes | None = None
_server_vk: bytes | None = None


def get_server_sig_key() -> tuple[bytes, bytes]:
    """Return (signing_key, verify_key). Loaded at startup."""
    if _server_sk is None or _server_vk is None:
        raise RuntimeError("Server signing key not initialised")
    return _server_sk, _server_vk


def _init_server_keys() -> None:
    global _server_sk, _server_vk
    key_path = Path(SERVER_KEY_PATH)
    if key_path.exists():
        data = json.loads(key_path.read_text())
        _server_sk = bytes.fromhex(data["signing_key"])
        _server_vk = bytes.fromhex(data["verify_key"])
        print(f"[PQ-KMS] Loaded server keys from {key_path}")
    else:
        sig = oqs.Signature(SIG_ALG)
        _server_vk = sig.generate_keypair()
        _server_sk = sig.export_secret_key()
        key_path.write_text(
            json.dumps({"signing_key": _server_sk.hex(), "verify_key": _server_vk.hex()})
        )
        print(f"[PQ-KMS] Generated new server {SIG_ALG} keypair → {key_path}")
    print(f"[PQ-KMS] Server verification key (pin this in clients): {_server_vk.hex()[:32]}...")


def _check_algorithms() -> None:
    """Fail loudly if required algorithms are unavailable."""
    enabled_kems = oqs.get_enabled_kem_mechanisms()
    enabled_sigs = oqs.get_enabled_sig_mechanisms()
    missing = []
    if KEM_ALG not in enabled_kems:
        missing.append(f"KEM '{KEM_ALG}'")
    if SIG_ALG not in enabled_sigs:
        missing.append(f"SIG '{SIG_ALG}'")
    if missing:
        print(f"[PQ-KMS] FATAL: Required algorithms not available: {missing}")
        print(f"[PQ-KMS] Available KEMs: {enabled_kems[:5]}...")
        sys.exit(1)
    print(f"[PQ-KMS] Algorithms verified: {KEM_ALG}, {SIG_ALG} ✓")


# ─── Background rotation task ──────────────────────────────────────────────────

async def _rotation_loop() -> None:
    """Periodically run Algorithm 4 (key rotation check)."""
    lifecycle = get_lifecycle_manager()
    while True:
        await asyncio.sleep(ROTATION_CHECK_INTERVAL_S)
        try:
            # Rotation without auto-establishing new sessions (client must re-request)
            rotated = lifecycle.run_rotation_check(session_factory=lambda _: None)
            if rotated:
                print(f"[PQ-KMS] Rotation: deactivated {len(rotated)} session(s)")
        except Exception as exc:
            print(f"[PQ-KMS] Rotation loop error: {exc}")


# ─── Startup / shutdown ────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup() -> None:
    print("[PQ-KMS] Starting up...")
    _check_algorithms()
    _init_server_keys()
    db = get_db()
    audit = get_audit_logger()
    audit.log("server", "SERVER_STARTED", "INFO", details=f"kem={KEM_ALG} sig={SIG_ALG}")
    asyncio.create_task(_rotation_loop())
    print(f"[PQ-KMS] Server ready at http://{SERVER_HOST}:{SERVER_PORT}")


@app.on_event("shutdown")
async def shutdown() -> None:
    get_audit_logger().log("server", "SERVER_STOPPED", "INFO")
    print("[PQ-KMS] Shutdown complete.")


# ─── Serve Built React UI (Production Unified Mode) ──────────────────────────
_frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if _frontend_dist.exists():
    _assets_dir = _frontend_dist / "assets"
    if _assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(_assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Exclude core API endpoints from fallback
        api_prefixes = ("api/", "state", "audit", "metrics", "revocations", "enrol", "register", "session", "message", "revoke", "devices", "docs", "redoc", "openapi.json")
        if any(full_path == p or full_path.startswith(p + "/") for p in api_prefixes):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = _frontend_dist / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(_frontend_dist / "index.html")


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=SERVER_HOST,
        port=SERVER_PORT,
        reload=False,
        log_level="info",
    )
