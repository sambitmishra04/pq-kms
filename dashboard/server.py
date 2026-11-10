"""
PQ-KMS Modern React Dashboard Server.
Serves both the REST API providing live state from the database/benchmarks
and the built React SPA frontend.

Run: python -m dashboard.server
or: bash run.sh dashboard-old
"""
from __future__ import annotations

import csv
import json
import os
import sys
from pathlib import Path
from typing import Any

# Ensure liboqs is found
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.config import (
    DATABASE_PATH,
    KEM_ALG,
    MAX_MESSAGES,
    SERVER_KEY_PATH,
    SESSION_LIFETIME_S,
    SIG_ALG,
    TS_SKEW_S,
)
from app.database.db import Database

ROOT_DIR = Path(__file__).parent.parent
TABLES_DIR = ROOT_DIR / "results" / "tables"
FIGURES_DIR = ROOT_DIR / "results" / "figures"
ENV_PATH = ROOT_DIR / "results" / "environment.json"
DIST_DIR = Path(__file__).parent / "react_ui" / "dist"

app = FastAPI(
    title="PQ-KMS Modern Dashboard API",
    description="Backend API powering the modern interactive React dashboard",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_database() -> Database:
    return Database(DATABASE_PATH)


def _read_csv(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    with open(path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)


@app.get("/api/info")
def get_info():
    """System information, algorithm parameters, and environment specs."""
    env = {}
    if ENV_PATH.exists():
        try:
            env = json.loads(ENV_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass

    server_vk_preview = None
    key_path = Path(SERVER_KEY_PATH)
    if key_path.exists():
        try:
            key_data = json.loads(key_path.read_text(encoding="utf-8"))
            vk = key_data.get("verify_key", "")
            server_vk_preview = vk[:32] + "..." if len(vk) > 32 else vk
        except Exception:
            pass

    return {
        "kem_alg": KEM_ALG,
        "sig_alg": SIG_ALG,
        "session_lifetime_s": SESSION_LIFETIME_S,
        "max_messages": MAX_MESSAGES,
        "ts_skew_s": TS_SKEW_S,
        "database_path": str(DATABASE_PATH),
        "server_vk_preview": server_vk_preview,
        "environment": env,
    }


@app.get("/api/devices")
def get_devices():
    """Device registry with sanitized records and status breakdown."""
    db = get_database()
    devices = db.get_all_devices()
    sanitized: list[dict[str, Any]] = []

    status_counts = {"AUTHORIZED": 0, "REVOKED": 0, "PENDING": 0, "DISABLED": 0}
    for dev in devices:
        item = dict(dev)
        # Strip binary key material
        item.pop("kem_public_key", None)
        item.pop("sig_public_key", None)
        item.pop("enrolment_code_hash", None)
        st = item.get("status", "PENDING")
        status_counts[st] = status_counts.get(st, 0) + 1
        sanitized.append(item)

    return {
        "total": len(sanitized),
        "status_counts": status_counts,
        "devices": sanitized,
    }


class ProvisionDeviceRequest(BaseModel):
    device_id: str
    role: str = "BIOCHIP_NODE"


class RevokeDeviceRequest(BaseModel):
    device_id: str
    reason: str = "Quarantined by clinical administrator"


class LoadAssayRequest(BaseModel):
    patient_glucose: float = 220.0


class TamperAttackRequest(BaseModel):
    true_glucose: float = 220.0
    falsified_glucose: float = 110.0


# ─── Biochip Simulation State ────────────────────────────────────────────────
from app.simulation.dmfb_simulator import DMFBBiochip, get_biochip
from app.simulation.attack_lab import AttackLab

_sim_chip: DMFBBiochip = get_biochip()
_sim_steps = []
_sim_step_idx: int = 0
_sim_patient_glucose: float = 220.0


def _build_sim_response() -> dict[str, Any]:
    global _sim_chip, _sim_steps, _sim_step_idx, _sim_patient_glucose
    snap = _sim_chip.get_state_snapshot()
    sensor_data = _sim_chip.read_optical_sensor()

    cur_step = None
    if 0 < _sim_step_idx <= len(_sim_steps):
        s = _sim_steps[_sim_step_idx - 1]
        cur_step = {
            "step_num": s.step_num,
            "operation": s.operation,
            "description": s.description,
            "target_droplets": s.target_droplets,
            "active_electrodes": s.active_electrodes,
        }

    next_step = None
    if _sim_step_idx < len(_sim_steps):
        s = _sim_steps[_sim_step_idx]
        next_step = {
            "step_num": s.step_num,
            "operation": s.operation,
            "description": s.description,
            "target_droplets": s.target_droplets,
            "active_electrodes": s.active_electrodes,
        }

    return {
        **snap,
        "current_step_idx": _sim_step_idx,
        "total_steps": len(_sim_steps),
        "patient_glucose": _sim_patient_glucose,
        "current_step_info": cur_step,
        "next_step_info": next_step,
        "sensor_data": sensor_data,
    }


@app.get("/api/simulator/state")
def get_simulator_state():
    """Current state snapshot of 8x8 DMFB biochip grid, droplets, electrodes, and sensor."""
    global _sim_steps
    if not _sim_steps and _sim_chip.status == "IDLE":
        # Auto-initialize with standard patient glucose assay
        _sim_steps = _sim_chip.load_glucose_assay(patient_glucose=_sim_patient_glucose)
    return _build_sim_response()


@app.post("/api/simulator/load")
def load_simulator_assay(req: LoadAssayRequest):
    """Load new enzymatic glucose assay protocol onto the biochip."""
    global _sim_steps, _sim_step_idx, _sim_patient_glucose
    _sim_patient_glucose = float(req.patient_glucose)
    _sim_steps = _sim_chip.load_glucose_assay(patient_glucose=_sim_patient_glucose)
    _sim_step_idx = 0
    return _build_sim_response()


@app.post("/api/simulator/step")
def step_simulator():
    """Execute next physical electrowetting actuation step."""
    global _sim_steps, _sim_step_idx
    if not _sim_steps:
        _sim_steps = _sim_chip.load_glucose_assay(patient_glucose=_sim_patient_glucose)
        _sim_step_idx = 0
    if _sim_step_idx < len(_sim_steps):
        step = _sim_steps[_sim_step_idx]
        _sim_chip.execute_step(step)
        _sim_step_idx += 1
    return _build_sim_response()


@app.post("/api/simulator/run_all")
def run_all_simulator():
    """Execute all remaining actuation steps through optical absorption biosensing."""
    global _sim_steps, _sim_step_idx
    if not _sim_steps:
        _sim_steps = _sim_chip.load_glucose_assay(patient_glucose=_sim_patient_glucose)
        _sim_step_idx = 0
    while _sim_step_idx < len(_sim_steps):
        step = _sim_steps[_sim_step_idx]
        _sim_chip.execute_step(step)
        _sim_step_idx += 1
    return _build_sim_response()


@app.post("/api/simulator/reset")
def reset_simulator():
    """Reset physical biochip electrodes and droplet state to clean idle baseline."""
    global _sim_steps, _sim_step_idx
    _sim_chip.reset()
    _sim_steps = []
    _sim_step_idx = 0
    return _build_sim_response()


# ─── Cyber-Physical Attack Lab Endpoints ─────────────────────────────────────
@app.post("/api/attack/tamper")
def attack_tamper(req: TamperAttackRequest):
    """Ali et al. in-transit assay result manipulation attack simulation."""
    lab = AttackLab()
    return lab.run_glucose_tamper_attack(req.true_glucose, req.falsified_glucose)


@app.post("/api/attack/replay")
def attack_replay():
    """Guo et al. diagnostic message replay attack simulation."""
    lab = AttackLab()
    return lab.run_replay_attack()


@app.get("/api/attack/quantum")
def attack_quantum():
    """Shor's algorithm harvest-now decrypt-later threat analysis."""
    lab = AttackLab()
    return lab.run_quantum_threat_comparison()


# ─── Device Quarantine / Revocation Endpoint ─────────────────────────────────
@app.post("/api/devices/revoke")
def revoke_device_endpoint(req: RevokeDeviceRequest):
    """Emergency quarantine and revocation of a biochip node with ML-DSA-65 signed CRL."""
    key_path = Path(SERVER_KEY_PATH)
    if not key_path.exists():
        raise HTTPException(status_code=500, detail="Server signing key not found")
    data = json.loads(key_path.read_text(encoding="utf-8"))
    server_sk = bytes.fromhex(data["signing_key"])

    from app.revocation.revocation import revoke_device
    try:
        new_crl = revoke_device(req.device_id, server_sk)
        return {
            "status": "SUCCESS",
            "device_id": req.device_id,
            "message": f"Device {req.device_id} quarantined and revoked. Signed CRL updated.",
            "crl_version": new_crl.get("list_version"),
            "issued_at": new_crl.get("issued_at"),
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/api/devices/provision")
def provision_device_api(req: ProvisionDeviceRequest):
    """Admin/Evaluator provisions a new biochip and generates post-quantum keys (Algorithm 1)."""
    device_id = req.device_id.strip()
    if not device_id:
        raise HTTPException(status_code=400, detail="Device ID cannot be empty")

    from app.config import CTX_REG, KEM_ALG, SIG_ALG
    from app.crypto.kem import generate_kem_keypair
    from app.crypto.sig import generate_sig_keypair, sign as sig_sign
    from app.device_management.registry import create_enrolment_code, register_device

    try:
        code = create_enrolment_code(device_id, role=req.role)
        kem_pk, _ = generate_kem_keypair(KEM_ALG)
        sig_pk, sig_sk = generate_sig_keypair(SIG_ALG)
        msg = device_id.encode("utf-8") + kem_pk + sig_pk
        proof_sig = sig_sign(sig_sk, msg, CTX_REG, SIG_ALG)
        register_device(device_id, code, kem_pk, sig_pk, proof_sig, SIG_ALG)

        dev = get_database().get_device(device_id)
        return {
            "status": "SUCCESS",
            "device_id": device_id,
            "role": req.role,
            "device_status": dev["status"] if dev else "AUTHORIZED",
            "enrolment_code": code,
            "kem_alg": KEM_ALG,
            "kem_pk_preview": kem_pk.hex()[:32] + "...",
            "kem_pk_len": len(kem_pk),
            "sig_alg": SIG_ALG,
            "sig_pk_preview": sig_pk.hex()[:32] + "...",
            "sig_pk_len": len(sig_pk),
            "proof_sig_len": len(proof_sig),
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/api/sessions")
def get_sessions():
    """Session key lifecycle records and state distribution."""
    db = get_database()
    sessions = db.get_all_sessions()
    state_counts: dict[str, int] = {}
    for s in sessions:
        st = s.get("state", "UNKNOWN")
        state_counts[st] = state_counts.get(st, 0) + 1

    return {
        "total": len(sessions),
        "state_counts": state_counts,
        "sessions": sessions,
    }


@app.get("/api/audit")
def get_audit(limit: int = 500):
    """Tamper-evident audit log with cryptographic hash chain integrity status."""
    db = get_database()
    chain_valid, break_idx = db.verify_audit_chain()
    events = db.get_audit_log(limit)

    outcome_counts: dict[str, int] = {}
    for ev in events:
        out = ev.get("outcome", "UNKNOWN")
        outcome_counts[out] = outcome_counts.get(out, 0) + 1

    return {
        "chain_valid": chain_valid,
        "chain_break_index": break_idx,
        "outcome_counts": outcome_counts,
        "total_returned": len(events),
        "events": events,
    }


@app.post("/api/audit/verify")
def verify_audit():
    """Explicit endpoint to recalculate cryptographic hash chain integrity."""
    db = get_database()
    chain_valid, break_idx = db.verify_audit_chain()
    all_events = db.get_audit_log(5000)
    return {
        "chain_valid": chain_valid,
        "chain_break_index": break_idx,
        "total_verified": len(all_events),
        "status": "VALID" if chain_valid else f"CORRUPTED at block #{break_idx}",
    }


@app.get("/api/benchmarks")
def get_benchmarks():
    """Benchmark datasets and publication performance tables."""
    e1_data = _read_csv(TABLES_DIR / "e1_primitive_benchmarks.csv")
    e2_data = _read_csv(TABLES_DIR / "e2_parameter_sensitivity.csv")
    e3_data = _read_csv(TABLES_DIR / "e3_e4_latency.csv")
    e6_data = _read_csv(TABLES_DIR / "e6_memory.csv")

    table20_md = ""
    t20_path = TABLES_DIR / "table20_performance_comparison.md"
    if t20_path.exists():
        table20_md = t20_path.read_text(encoding="utf-8")

    t20_data = _read_csv(TABLES_DIR / "table20_performance_comparison.csv")

    figures = []
    if FIGURES_DIR.exists():
        for p in sorted(FIGURES_DIR.glob("*.png")):
            figures.append({
                "filename": p.name,
                "title": p.stem.replace("_", " ").title(),
                "url": f"/api/figures/{p.name}",
            })

    return {
        "e1_primitive_benchmarks": e1_data,
        "e2_parameter_sensitivity": e2_data,
        "e3_e4_latency": e3_data,
        "e6_memory": e6_data,
        "table20_markdown": table20_md,
        "table20_comparison": t20_data,
        "figures": figures,
    }


@app.get("/api/figures/{filename}")
def get_figure(filename: str):
    """Serve publication figures safely."""
    path = FIGURES_DIR / filename
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="Figure not found")
    return FileResponse(path, media_type="image/png")


@app.get("/api/security")
def get_security():
    """Security test cases, CRL revocation details, and message statistics."""
    db = get_database()
    t15_data = _read_csv(TABLES_DIR / "table15_security_test_cases.csv")
    t18_summary = _read_csv(TABLES_DIR / "table18_test_summary.csv")

    crl = db.get_latest_revocation_list()
    crl_formatted = None
    if crl:
        sig_val = crl.get("signature")
        if isinstance(sig_val, bytes):
            sig_hex = sig_val.hex()
        elif isinstance(sig_val, str):
            sig_hex = sig_val
        else:
            sig_hex = str(sig_val)
        crl_formatted = {
            "list_version": crl.get("list_version"),
            "issued_at": crl.get("issued_at"),
            "device_ids": crl.get("device_ids", []),
            "revoked_count": len(crl.get("device_ids", [])),
            "signature_hex": sig_hex,
            "signature_preview": sig_hex[:40] + "..." if len(sig_hex) > 40 else sig_hex,
        }

    msg_stats = db.get_message_stats()

    return {
        "security_test_cases": t15_data,
        "test_summary": t18_summary,
        "crl": crl_formatted,
        "message_stats": msg_stats,
    }


# Mount built React SPA if available
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Don't shadow API routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        index_file = DIST_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return HTMLResponse("<h1>PQ-KMS Dashboard built files not found.</h1>", status_code=404)
else:
    @app.get("/")
    def serve_notice():
        return HTMLResponse(
            """
            <html>
            <head><title>PQ-KMS React Dashboard</title></head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; padding: 48px; text-align: center;">
                <h2 style="color: #15803d; font-weight: 700;">PQ-KMS Biochip Security Console</h2>
                <p style="color: #64748b;">The React UI bundle is building or needs to be built with: <code>node dashboard/react_ui/build.cjs</code></p>
                <p style="margin-top: 16px;">The backend API is active at <a href="/api/info" style="color: #15803d; font-weight: 600;">/api/info</a>.</p>
            </body>
            </html>
            """
        )


def main():
    import argparse
    import uvicorn

    parser = argparse.ArgumentParser(description="PQ-KMS Modern React Dashboard Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host interface to bind")
    parser.add_argument("--port", type=int, default=int(os.environ.get("REACT_DASHBOARD_PORT", "8502")), help="Port to listen on")
    args = parser.parse_args()

    print(f"================================================================")
    print(f"🚀 PQ-KMS Modern React Dashboard Server")
    print(f"   URL: http://localhost:{args.port}")
    print(f"   API: http://localhost:{args.port}/api/info")
    print(f"================================================================")
    uvicorn.run(app, host=args.host, port=args.port, log_level="info")


if __name__ == "__main__":
    main()
