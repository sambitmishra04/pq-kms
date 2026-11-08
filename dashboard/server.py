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
from dataclasses import asdict
from pathlib import Path
from typing import Any, List, Optional

# Ensure liboqs is found
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.config import (
    CTX_REG,
    CTX_REV,
    CTX_SREQ,
    CTX_SRESP,
    DATABASE_PATH,
    KEM_ALG,
    MAX_MESSAGES,
    SERVER_KEY_PATH,
    SESSION_LIFETIME_S,
    SIG_ALG,
    TS_SKEW_S,
)
from app.database.db import Database
from app.simulation.attack_lab import AttackLab
from app.simulation.dmfb_simulator import DMFBBiochip, get_biochip

ROOT_DIR = Path(__file__).parent.parent
TABLES_DIR = ROOT_DIR / "results" / "tables"
FIGURES_DIR = ROOT_DIR / "results" / "figures"
ENV_PATH = ROOT_DIR / "results" / "environment.json"
VITALS_PATH = ROOT_DIR / "data" / "vitals.csv"
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


# ─── Clinical Patient Data Helpers & Endpoints ───────────────────────────────

_cached_patients: Optional[list[dict[str, Any]]] = None
_simulator_steps: list[Any] = []
_simulator_current_step_idx: int = 0
_simulator_patient_glucose: float = 220.0


def _load_patients() -> list[dict[str, Any]]:
    global _cached_patients
    if _cached_patients is not None:
        return _cached_patients

    if not VITALS_PATH.exists():
        return []

    results = []
    with open(VITALS_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            try:
                glucose = float(row.get("Glucose", 0))
                bp = float(row.get("BloodPressure", 0))
                skin = float(row.get("SkinThickness", 0))
                insulin = float(row.get("Insulin", 0))
                bmi = float(row.get("BMI", 0))
                pedigree = float(row.get("DiabetesPedigreeFunction", 0))
                age = int(row.get("Age", 0))
                outcome = int(row.get("Outcome", 0))
                pregnancies = int(row.get("Pregnancies", 0))
            except (ValueError, TypeError):
                continue

            if glucose >= 200.0:
                clinical_status = "DIABETIC"
                risk_label = "Hyperglycemia (High Risk)"
            elif glucose >= 140.0:
                clinical_status = "PRE_DIABETIC"
                risk_label = "Impaired Tolerance"
            elif glucose >= 70.0:
                clinical_status = "NORMAL"
                risk_label = "Euglycemic (Normal)"
            else:
                clinical_status = "HYPOGLYCEMIA"
                risk_label = "Hypoglycemic Alert"

            results.append({
                "id": f"PAT-{idx + 1:04d}",
                "patient_index": idx + 1,
                "pregnancies": pregnancies,
                "glucose": glucose,
                "blood_pressure": bp,
                "skin_thickness": skin,
                "insulin": insulin,
                "bmi": bmi,
                "pedigree": pedigree,
                "age": age,
                "outcome": outcome,
                "clinical_status": clinical_status,
                "risk_label": risk_label,
            })

    _cached_patients = results
    return _cached_patients


@app.get("/api/patients")
def get_patients(
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    search: str = Query(""),
    outcome: str = Query("ALL"),
    risk: str = Query("ALL"),
):
    """Serve paginated clinical patient vitals for medical clinicians."""
    all_patients = _load_patients()
    filtered = all_patients

    if search:
        s = search.strip().lower()
        filtered = [
            p for p in filtered
            if s in p["id"].lower()
            or s in str(p["age"])
            or s in str(p["glucose"])
            or s in p["clinical_status"].lower()
        ]

    if outcome in ("0", "1"):
        outcome_int = int(outcome)
        filtered = [p for p in filtered if p["outcome"] == outcome_int]

    if risk != "ALL":
        filtered = [p for p in filtered if p["clinical_status"] == risk]

    total = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paged = filtered[start_idx:end_idx]

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if page_size > 0 else 1,
        "patients": paged,
    }


@app.get("/api/patients/stats")
def get_patient_stats():
    """Aggregated clinical cohort telemetry and diagnostic distributions."""
    patients = _load_patients()
    if not patients:
        return {
            "total_patients": 0,
            "diabetic_count": 0,
            "non_diabetic_count": 0,
            "diabetic_percent": 0.0,
            "mean_glucose": 0.0,
            "mean_bmi": 0.0,
            "mean_age": 0.0,
            "mean_blood_pressure": 0.0,
            "glucose_distribution": {},
            "age_distribution": {},
            "risk_counts": {},
        }

    total = len(patients)
    diabetic = sum(1 for p in patients if p["outcome"] == 1)
    non_diabetic = total - diabetic

    mean_glucose = sum(p["glucose"] for p in patients) / total
    mean_bmi = sum(p["bmi"] for p in patients) / total
    mean_age = sum(p["age"] for p in patients) / total
    mean_bp = sum(p["blood_pressure"] for p in patients) / total

    under_100 = sum(1 for p in patients if p["glucose"] < 100)
    g_100_139 = sum(1 for p in patients if 100 <= p["glucose"] < 140)
    g_140_199 = sum(1 for p in patients if 140 <= p["glucose"] < 200)
    g_200_plus = sum(1 for p in patients if p["glucose"] >= 200)

    risk_counts = {
        "NORMAL": sum(1 for p in patients if p["clinical_status"] == "NORMAL"),
        "PRE_DIABETIC": sum(1 for p in patients if p["clinical_status"] == "PRE_DIABETIC"),
        "DIABETIC": sum(1 for p in patients if p["clinical_status"] == "DIABETIC"),
        "HYPOGLYCEMIA": sum(1 for p in patients if p["clinical_status"] == "HYPOGLYCEMIA"),
    }

    age_under_30 = sum(1 for p in patients if p["age"] < 30)
    age_30_49 = sum(1 for p in patients if 30 <= p["age"] < 50)
    age_50_plus = sum(1 for p in patients if p["age"] >= 50)

    return {
        "total_patients": total,
        "diabetic_count": diabetic,
        "non_diabetic_count": non_diabetic,
        "diabetic_percent": round((diabetic / total) * 100, 1) if total > 0 else 0.0,
        "mean_glucose": round(mean_glucose, 1),
        "mean_bmi": round(mean_bmi, 1),
        "mean_age": round(mean_age, 1),
        "mean_blood_pressure": round(mean_bp, 1),
        "glucose_distribution": {
            "under_100": under_100,
            "100_to_139": g_100_139,
            "140_to_199": g_140_199,
            "200_plus": g_200_plus,
        },
        "age_distribution": {
            "under_30": age_under_30,
            "30_to_49": age_30_49,
            "50_plus": age_50_plus,
        },
        "risk_counts": risk_counts,
    }


# ─── Cryptographic Inspector Specification API ───────────────────────────────

@app.get("/api/crypto/spec")
def get_crypto_spec():
    """Complete under-the-hood cryptographic parameter specifications."""
    return {
        "kem": {
            "name": "ML-KEM-768",
            "standard": "NIST FIPS 203 (Formerly CRYSTALS-Kyber)",
            "security_category": "Category 3 (192-bit quantum security, equivalent to AES-192)",
            "lattice_family": "Module Learning with Errors (M-LWE)",
            "lattice_rank": 3,
            "public_key_bytes": 1184,
            "private_key_bytes": 2400,
            "ciphertext_bytes": 1088,
            "shared_secret_bytes": 32,
            "purpose": "Post-Quantum Ephemeral Session Key Encapsulation (Algorithm 2)",
        },
        "sig": {
            "name": "ML-DSA-65",
            "standard": "NIST FIPS 204 (Formerly CRYSTALS-Dilithium)",
            "security_category": "Category 3 (192-bit quantum security)",
            "lattice_family": "Module Learning with Rounding / Fiat-Shamir with Aborts",
            "matrix_dimensions": "(k=6, l=5)",
            "public_key_bytes": 1952,
            "secret_key_bytes": 4032,
            "signature_bytes": 3309,
            "signing_mode": "Hedged (private key + message + fresh approved RBG randomness)",
            "purpose": "Mutual Proof-of-Possession & Server Authentication Signatures",
        },
        "kdf": {
            "name": "HKDF-SHA256",
            "standard": "RFC 5869",
            "ikm": "ML-KEM Shared Secret (32 bytes)",
            "salt": "Client Nonce nonce_c (16 cryptographically secure random bytes)",
            "info_pattern": '"PQKMS-v1" || device_id || session_id || "aes256gcm"',
            "derived_length": "32 bytes (256-bit symmetric session key)",
        },
        "aead": {
            "name": "AES-256-GCM",
            "standard": "NIST SP 800-38D",
            "key_size_bits": 256,
            "tag_size_bits": 128,
            "nonce_size_bits": 96,
            "nonce_construction": "role32 (0x00000001 Client / 0x00000002 Server) || counter64 (Monotonic)",
            "aad_binding": "device_id || session_id || message_id || counter",
            "replay_protection": "Strictly monotonic invocation counter checked against in-memory session record",
        },
        "domain_separation": {
            "registration_proof": CTX_REG.decode("utf-8", errors="ignore") if isinstance(CTX_REG, bytes) else str(CTX_REG),
            "session_request": CTX_SREQ.decode("utf-8", errors="ignore") if isinstance(CTX_SREQ, bytes) else str(CTX_SREQ),
            "session_response": CTX_SRESP.decode("utf-8", errors="ignore") if isinstance(CTX_SRESP, bytes) else str(CTX_SRESP),
            "revocation_crl": CTX_REV.decode("utf-8", errors="ignore") if isinstance(CTX_REV, bytes) else str(CTX_REV),
        },
        "key_lifecycle": {
            "standard": "NIST SP 800-57 Part 1 Rev 5",
            "states": ["CREATED", "ACTIVE", "DEACTIVATED", "DESTROYED", "COMPROMISED"],
            "storage_policy": "Zero plaintext key persistence in storage; keys exist solely in-memory",
            "zeroization": "Volatile memory zeroized immediately upon state transition to DESTROYED",
            "default_cryptoperiod_s": SESSION_LIFETIME_S,
            "max_messages_per_key": MAX_MESSAGES,
        },
    }


# ─── Biochip Digital Twin Simulator APIs ─────────────────────────────────────

class SimulatorResetRequest(BaseModel):
    patient_glucose: float = 220.0


@app.get("/api/simulator/state")
def get_simulator_state():
    """Current state of the 8x8 DMFB electrowetting biochip."""
    global _simulator_steps, _simulator_current_step_idx, _simulator_patient_glucose
    chip = get_biochip()
    if not _simulator_steps:
        _simulator_steps = chip.load_glucose_assay(patient_glucose=_simulator_patient_glucose)
        _simulator_current_step_idx = 0

    return {
        "snapshot": chip.get_state_snapshot(),
        "total_steps": len(_simulator_steps),
        "current_step_idx": _simulator_current_step_idx,
        "patient_glucose": _simulator_patient_glucose,
        "steps": [asdict(s) for s in _simulator_steps],
        "sensor_readout": chip.read_optical_sensor(),
    }


@app.post("/api/simulator/reset")
def reset_simulator(req: SimulatorResetRequest):
    """Reset the 8x8 DMFB biochip and load enzymatic glucose assay protocol."""
    global _simulator_steps, _simulator_current_step_idx, _simulator_patient_glucose
    chip = get_biochip()
    _simulator_patient_glucose = float(req.patient_glucose)
    _simulator_steps = chip.load_glucose_assay(patient_glucose=_simulator_patient_glucose)
    _simulator_current_step_idx = 0

    return {
        "status": "RESET_SUCCESS",
        "snapshot": chip.get_state_snapshot(),
        "total_steps": len(_simulator_steps),
        "current_step_idx": _simulator_current_step_idx,
        "patient_glucose": _simulator_patient_glucose,
        "steps": [asdict(s) for s in _simulator_steps],
        "sensor_readout": chip.read_optical_sensor(),
    }


@app.post("/api/simulator/step")
def step_simulator():
    """Execute the next physical electrowetting actuation step."""
    global _simulator_steps, _simulator_current_step_idx
    chip = get_biochip()
    if not _simulator_steps:
        _simulator_steps = chip.load_glucose_assay(patient_glucose=_simulator_patient_glucose)
        _simulator_current_step_idx = 0

    executed_step = None
    if _simulator_current_step_idx < len(_simulator_steps):
        step_to_run = _simulator_steps[_simulator_current_step_idx]
        chip.execute_step(step_to_run)
        executed_step = asdict(step_to_run)
        _simulator_current_step_idx += 1

    return {
        "status": "STEP_EXECUTED" if executed_step else "ASSAY_COMPLETE",
        "snapshot": chip.get_state_snapshot(),
        "current_step_idx": _simulator_current_step_idx,
        "total_steps": len(_simulator_steps),
        "executed_step": executed_step,
        "sensor_readout": chip.read_optical_sensor(),
    }


@app.post("/api/simulator/run-all")
def run_all_simulator():
    """Fast-forward through all remaining actuation steps to optical detection."""
    global _simulator_steps, _simulator_current_step_idx
    chip = get_biochip()
    if not _simulator_steps:
        _simulator_steps = chip.load_glucose_assay(patient_glucose=_simulator_patient_glucose)
        _simulator_current_step_idx = 0

    while _simulator_current_step_idx < len(_simulator_steps):
        step_to_run = _simulator_steps[_simulator_current_step_idx]
        chip.execute_step(step_to_run)
        _simulator_current_step_idx += 1

    return {
        "status": "ASSAY_COMPLETE",
        "snapshot": chip.get_state_snapshot(),
        "current_step_idx": _simulator_current_step_idx,
        "total_steps": len(_simulator_steps),
        "sensor_readout": chip.read_optical_sensor(),
    }


# ─── Cyber-Physical Attack Lab APIs ──────────────────────────────────────────

class TamperAttackRequest(BaseModel):
    true_glucose: float = 220.0
    falsified_glucose: float = 110.0


@app.post("/api/attacks/tamper")
def run_tamper_attack(req: TamperAttackRequest):
    """Execute Ali et al. glucose assay falsification attack simulation."""
    attack_lab = AttackLab()
    result = attack_lab.run_glucose_tamper_attack(
        true_glucose=float(req.true_glucose),
        falsified_glucose=float(req.falsified_glucose),
    )
    return result


@app.post("/api/attacks/replay")
def run_replay_attack():
    """Execute diagnostic message replay attack simulation."""
    attack_lab = AttackLab()
    result = attack_lab.run_replay_attack()
    return result


@app.get("/api/attacks/quantum-threat")
def run_quantum_threat_analysis():
    """Retrieve comparative quantum security threat matrix."""
    attack_lab = AttackLab()
    result = attack_lab.run_quantum_threat_comparison()
    return result


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
            <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
                <h2>PQ-KMS Modern React Dashboard</h2>
                <p>The React UI is building or needs to be built with: <code>npm run build</code> in <code>dashboard/react_ui</code>.</p>
                <p>The backend API is active at <a href="/api/info" style="color: #38bdf8;">/api/info</a>.</p>
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
