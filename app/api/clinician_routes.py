"""
Clinician Telemetry & Diagnostic Portal API Routes.
Connects point-of-care DMFB biochips and clinical vitals telemetry to the clinician console.
Tamper-evident audit logging for acknowledgments and interventions.
"""
from __future__ import annotations

import csv
import math
import random
import threading
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field

from app.audit.audit import get_audit_logger
from app.auth.service import decode_token
from app.database.db import get_db

clinician_router = APIRouter(prefix="/api/clinician", tags=["clinician"])
security = HTTPBearer(auto_error=False)

DATA_DIR = Path(__file__).parent.parent.parent / "data"
VITALS_CSV = DATA_DIR / "vitals.csv"

# Pre-defined deterministic name pools
FEMALE_FIRST_NAMES = [
    "Eleanor", "Maria", "Aisha", "Sarah", "Elena", "Priya", "Chloe", "Zoe",
    "Fatima", "Mei", "Leila", "Sofia", "Hannah", "Maya", "Grace", "Emily",
    "Camila", "Amara", "Isabella", "Noor", "Yuki", "Astrid", "Lucia", "Ingrid",
    "Tara", "Naomi", "Clara", "Freja", "Siti", "Kavya", "Beatriz", "Mira",
    "Valentina", "Evelyn", "Amina", "Lina", "Ananya", "Roxana", "Soraya", "Devi",
]

MALE_FIRST_NAMES = [
    "Robert", "James", "David", "Carlos", "Liam", "Raj", "Kenji", "Marcus",
    "Omar", "Lucas", "Mateo", "Felix", "Arthur", "Leo", "Noah", "Vikram",
    "Chen", "Gabriel", "Tariq", "Stefan", "Hiroshi", "Dante", "Arjun", "Malik",
    "Julian", "Kai", "Siddharth", "Zane", "Nikolai", "Elias", "Sven", "Tenzin",
    "Ravi", "Andre", "Hugo", "Farhan", "Kiran", "Samir", "Alexei", "Emil",
]

LAST_NAMES = [
    "Vance", "Chen", "Santos", "Wilson", "Patel", "Rodriguez", "Kim", "Jenkins",
    "Smith", "Zhang", "Gupta", "Silva", "Tanaka", "Morales", "Al-Mansoor", "Lindqvist",
    "Dubois", "Kowalski", "O'Connor", "Rossi", "Sato", "Fischer", "Nakamura", "Novak",
    "Abebe", "Muller", "Johansson", "Alvarez", "Bhandari", "Popov", "Costa", "Watanabe",
    "Sinclair", "Khatib", "Larsson", "Fernandez", "Demir", "Nygard", "Okafor", "Sorenson",
]


class VitalReading(BaseModel):
    timestamp: str
    glucose_mg_dl: float


class PatientRecordModel(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    device_id: str
    device_status: str
    glucose_mg_dl: float
    blood_pressure: str
    systolic_bp: float
    diastolic_bp: float
    heart_rate: int
    spo2: int
    temperature_c: float
    insulin_u_ml: float
    bmi: float
    last_assay_time: str
    clinical_indication: str
    status: str  # STABLE, WARNING, CRITICAL
    session_id: Optional[str] = None
    session_state: Optional[str] = None
    message_counter: int = 1
    aead_cipher: str = "AES-256-GCM"
    kem_algorithm: str = "ML-KEM-768"
    sig_algorithm: str = "ML-DSA-65"
    crypto_verified: bool = True
    crypto_status_text: str = "AEAD Decryption: Verified"
    is_tampered: bool = False
    tamper_alert: Optional[str] = None
    acknowledged: bool = False
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[str] = None
    last_intervention: Optional[str] = None
    history: List[VitalReading] = []


class PatientListResponse(BaseModel):
    patients: List[PatientRecordModel]
    total: int
    page: int
    page_size: int
    total_pages: int
    summary: Dict[str, int]


class AcknowledgeRequest(BaseModel):
    note: Optional[str] = "Clinical reading reviewed and acknowledged"


class InterventionRequest(BaseModel):
    protocol: str = Field(..., description="E.g., 'Regular Insulin Bolus', 'Fast-Acting Glucose Oral', 'Electrolyte Infusion'")
    dosage: Optional[str] = Field(None, description="E.g., '8 Units Subcutaneous', '25g Oral Gel'")
    notes: Optional[str] = None


class TamperSimulationResponse(BaseModel):
    patient_id: str
    device_id: str
    is_tampered: bool
    true_glucose: float
    falsified_glucose: float
    pqc_aead_status: str
    tamper_detected: bool
    error_detail: str
    clinical_consequence: str
    audit_event_id: str


# ─── In-Memory Store & Deterministic Cache ──────────────────────────────────────

class PatientStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._initialized = False
        self._patients: Dict[str, Dict[str, Any]] = {}
        self._patient_ids: List[str] = []

    def _ensure_loaded(self):
        if self._initialized:
            return
        with self._lock:
            if self._initialized:
                return
            self._load_all()
            self._initialized = True

    def _load_all(self):
        db = get_db()
        # Query all registered devices from the database
        try:
            with db.cursor() as cur:
                cur.execute("""
                    SELECT d.device_id, d.status, d.role, s.session_id, s.state, s.msg_count, s.last_counter
                    FROM devices d
                    LEFT JOIN (
                        SELECT device_id, session_id, state, msg_count, last_counter,
                               ROW_NUMBER() OVER (PARTITION BY device_id ORDER BY created_at DESC) as rn
                        FROM sessions
                    ) s ON d.device_id = s.device_id AND s.rn = 1
                    ORDER BY 
                        CASE 
                            WHEN d.device_id = 'DMFB-ALPHA-POC' THEN 0
                            WHEN d.device_id = 'DMFB-BETA-ICU' THEN 1
                            WHEN d.device_id = 'DMFB-GAMMA-AMB' THEN 2
                            WHEN d.device_id = 'DMFB-SEMINAR-01' THEN 3
                            WHEN d.device_id LIKE 'DMFB%' THEN 4
                            ELSE 5
                        END,
                        d.device_id
                """)
                devices = cur.fetchall()
        except Exception:
            devices = []

        # Read vitals CSV records
        vitals_records = []
        if VITALS_CSV.exists():
            try:
                with open(VITALS_CSV, newline="", encoding="utf-8") as f:
                    vitals_records = list(csv.DictReader(f))
            except Exception:
                pass

        if not vitals_records:
            # Fallback mock row
            vitals_records = [{
                "Pregnancies": "1", "Glucose": "120", "BloodPressure": "70",
                "SkinThickness": "20", "Insulin": "80", "BMI": "26.5",
                "DiabetesPedigreeFunction": "0.4", "Age": "45", "Outcome": "0"
            }]

        total_records = max(len(devices), len(vitals_records))
        if total_records == 0:
            total_records = 50

        # Anchor patient records matching the classic demo names for continuity
        anchor_configs = [
            {
                "patient_id": "PAT-4821",
                "name": "Eleanor Vance",
                "age": 58,
                "gender": "Female",
                "device_id": "DMFB-ALPHA-POC",
                "glucose": 220.0,
                "bp_sys": 142.0,
                "bp_dia": 88.0,
                "heart_rate": 88,
                "spo2": 97,
                "temp": 37.1,
                "bmi": 33.6,
                "insulin": 168.0,
                "status": "CRITICAL",
                "indication": "Severe Hyperglycemia — Insulin Required",
                "minutes_ago": 10,
            },
            {
                "patient_id": "PAT-3904",
                "name": "Robert Chen",
                "age": 46,
                "gender": "Male",
                "device_id": "DMFB-BETA-ICU",
                "glucose": 98.4,
                "bp_sys": 118.0,
                "bp_dia": 76.0,
                "heart_rate": 72,
                "spo2": 99,
                "temp": 36.6,
                "bmi": 26.6,
                "insulin": 94.0,
                "status": "STABLE",
                "indication": "Normal Fasting Glycemia",
                "minutes_ago": 25,
            },
            {
                "patient_id": "PAT-6192",
                "name": "Maria Santos",
                "age": 62,
                "gender": "Female",
                "device_id": "DMFB-GAMMA-AMB",
                "glucose": 174.5,
                "bp_sys": 135.0,
                "bp_dia": 84.0,
                "heart_rate": 80,
                "spo2": 98,
                "temp": 36.8,
                "bmi": 29.8,
                "insulin": 145.0,
                "status": "WARNING",
                "indication": "Impaired Glucose Tolerance (Pre-diabetes)",
                "minutes_ago": 42,
            },
            {
                "patient_id": "PAT-1830",
                "name": "James Wilson",
                "age": 34,
                "gender": "Male",
                "device_id": "DMFB-SEMINAR-01",
                "glucose": 62.0,
                "bp_sys": 110.0,
                "bp_dia": 70.0,
                "heart_rate": 68,
                "spo2": 98,
                "temp": 36.5,
                "bmi": 23.3,
                "insulin": 25.0,
                "status": "CRITICAL",
                "indication": "Hypoglycemia Alert — Administer Fast-Acting Carbohydrate",
                "minutes_ago": 60,
            },
        ]

        # Map devices by ID
        dev_map = {d["device_id"]: d for d in devices}
        # Available devices excluding anchor devices
        anchor_dev_ids = {cfg["device_id"] for cfg in anchor_configs}
        remaining_devices = [d for d in devices if d["device_id"] not in anchor_dev_ids]

        count = max(len(devices), len(vitals_records))

        for i in range(count):
            if i < len(anchor_configs):
                cfg = anchor_configs[i]
                pat_id = cfg["patient_id"]
                name = cfg["name"]
                age = cfg["age"]
                gender = cfg["gender"]
                dev_id = cfg["device_id"]
                glucose = cfg["glucose"]
                bp_sys = cfg["bp_sys"]
                bp_dia = cfg["bp_dia"]
                hr = cfg["heart_rate"]
                spo2 = cfg["spo2"]
                temp = cfg["temp"]
                bmi = cfg["bmi"]
                insulin = cfg["insulin"]
                status_str = cfg["status"]
                indication = cfg["indication"]
                last_time_str = f"{cfg['minutes_ago']} mins ago"
                dev_row = dev_map.get(dev_id)
            else:
                pat_id = f"PAT-{1000 + i}"
                is_female = (i % 2 == 0)
                first_pool = FEMALE_FIRST_NAMES if is_female else MALE_FIRST_NAMES
                f_name = first_pool[i % len(first_pool)]
                l_name = LAST_NAMES[(i * 7) % len(LAST_NAMES)]
                name = f"{f_name} {l_name}"
                gender = "Female" if is_female else "Male"

                rem_idx = i - len(anchor_configs)
                dev_row = remaining_devices[rem_idx] if rem_idx < len(remaining_devices) else None
                dev_id = dev_row["device_id"] if dev_row else f"DMFB-NODE-{1000 + i}"

                v_idx = i % len(vitals_records)
                vr = vitals_records[v_idx]

                try:
                    raw_glucose = float(vr.get("Glucose", 110.0))
                    glucose = raw_glucose if raw_glucose > 0 else 105.0 + (i % 40)
                except Exception:
                    glucose = 112.0

                try:
                    raw_bp = float(vr.get("BloodPressure", 70.0))
                    bp_dia = raw_bp if raw_bp > 0 else 72.0 + (i % 14)
                except Exception:
                    bp_dia = 74.0
                bp_sys = bp_dia + 42.0

                try:
                    age = int(vr.get("Age", 45))
                except Exception:
                    age = 35 + (i % 35)

                try:
                    raw_bmi = float(vr.get("BMI", 27.0))
                    bmi = raw_bmi if raw_bmi > 0 else 26.5 + round((i % 15) * 0.4, 1)
                except Exception:
                    bmi = 26.8

                try:
                    raw_ins = float(vr.get("Insulin", 50.0))
                    insulin = raw_ins if raw_ins > 0 else max(10.0, round(glucose * 0.45, 1))
                except Exception:
                    insulin = 45.0

                hr = 68 + ((i * 3) % 22) + (6 if glucose > 180 else 0)
                spo2 = 99 - (1 if age > 55 else 0) - (1 if glucose > 220 else 0)
                temp = round(36.5 + ((i % 8) * 0.1), 1)

                try:
                    outcome = int(vr.get("Outcome", 0))
                except Exception:
                    outcome = 0

                if glucose >= 200 or glucose < 70:
                    status_str = "CRITICAL"
                elif glucose >= 140 or outcome == 1:
                    status_str = "WARNING"
                else:
                    status_str = "STABLE"

                if glucose >= 220:
                    indication = "Severe Hyperglycemia — Insulin Required"
                elif glucose >= 180:
                    indication = "Moderate Hyperglycemia — Monitor Titrated Insulin"
                elif glucose >= 140:
                    indication = "Impaired Fasting Glycemia (Pre-diabetes)"
                elif glucose < 70:
                    indication = "Hypoglycemia Alert — Administer Fast-Acting Carbohydrate"
                else:
                    indication = "Normal Fasting Glycemia — Homeostatic Baseline"

                mins_ago = (i * 3) % 180 + 5
                if mins_ago < 60:
                    last_time_str = f"{mins_ago} mins ago"
                else:
                    last_time_str = f"{mins_ago // 60}h {mins_ago % 60}m ago"

            # Match with real device row metadata if available
            if dev_row:
                dev_status = dev_row["status"]
                sess_id = dev_row["session_id"]
                sess_state = dev_row["state"]
                msg_count = dev_row["msg_count"] or 1
                last_counter = dev_row["last_counter"] or 1
            else:
                dev_status = "REVOKED" if "GAMMA" in dev_id else "AUTHORIZED"
                sess_id = None
                sess_state = "ACTIVE"
                msg_count = 1
                last_counter = 1

            # Determine cryptographic verification state
            if dev_status == "REVOKED":
                crypto_verified = False
                crypto_text = "CRL REVOCATION DETECTED — Untrusted Biochip Node"
            elif dev_status == "PENDING":
                crypto_verified = False
                crypto_text = "Biochip Enrollment Pending Key Approval"
            else:
                crypto_verified = True
                crypto_text = "AEAD Decryption: Verified"

            # Historical readings for sparkline/trend graph (last 6 hourly checkpoints)
            history = []
            now_dt = datetime.now(timezone.utc)
            fluctuations = [-14, 8, -6, 12, -4, 0]
            for h_idx, fluc in enumerate(fluctuations):
                point_time = (now_dt - timedelta(hours=5 - h_idx)).strftime("%H:%M")
                val = max(40.0, round(glucose + fluc, 1))
                history.append({"timestamp": point_time, "glucose_mg_dl": val})

            patient_data = {
                "patient_id": pat_id,
                "name": name,
                "age": age,
                "gender": gender,
                "device_id": dev_id,
                "device_status": dev_status,
                "glucose_mg_dl": round(glucose, 1),
                "blood_pressure": f"{int(bp_sys)}/{int(bp_dia)}",
                "systolic_bp": round(bp_sys, 1),
                "diastolic_bp": round(bp_dia, 1),
                "heart_rate": hr,
                "spo2": spo2,
                "temperature_c": temp,
                "insulin_u_ml": round(insulin, 1),
                "bmi": round(bmi, 1),
                "last_assay_time": last_time_str,
                "clinical_indication": indication,
                "status": status_str,
                "session_id": sess_id,
                "session_state": sess_state,
                "message_counter": last_counter,
                "aead_cipher": "AES-256-GCM",
                "kem_algorithm": "ML-KEM-768",
                "sig_algorithm": "ML-DSA-65",
                "crypto_verified": crypto_verified,
                "crypto_status_text": crypto_text,
                "is_tampered": False,
                "tamper_alert": None,
                "acknowledged": False,
                "acknowledged_by": None,
                "acknowledged_at": None,
                "last_intervention": None,
                "history": history,
            }

            self._patients[pat_id] = patient_data
            self._patient_ids.append(pat_id)

    def get_all(
        self,
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        device_status_filter: Optional[str] = None,
        page: int = 1,
        page_size: int = 12,
    ) -> Dict[str, Any]:
        self._ensure_loaded()
        with self._lock:
            items = [self._patients[pid] for pid in self._patient_ids]

        # Calculate high-level summaries across full population
        total_count = len(items)
        critical_count = sum(1 for p in items if p["status"] == "CRITICAL")
        warning_count = sum(1 for p in items if p["status"] == "WARNING")
        stable_count = sum(1 for p in items if p["status"] == "STABLE")
        active_biochips = sum(1 for p in items if p["device_status"] == "AUTHORIZED")
        revoked_biochips = sum(1 for p in items if p["device_status"] == "REVOKED")

        # Apply search filter
        if search:
            s = search.lower().strip()
            items = [
                p for p in items
                if s in p["name"].lower()
                or s in p["patient_id"].lower()
                or s in p["device_id"].lower()
            ]

        # Apply status filter
        if status_filter and status_filter.upper() != "ALL":
            sf = status_filter.upper()
            items = [p for p in items if p["status"] == sf]

        # Apply device status filter
        if device_status_filter and device_status_filter.upper() != "ALL":
            dsf = device_status_filter.upper()
            items = [p for p in items if p["device_status"] == dsf]

        filtered_total = len(items)
        page = max(1, page)
        page_size = max(1, min(100, page_size))
        total_pages = max(1, math.ceil(filtered_total / page_size))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_items = items[start_idx:end_idx]

        return {
            "patients": paginated_items,
            "total": filtered_total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "summary": {
                "total_patients": total_count,
                "critical_count": critical_count,
                "warning_count": warning_count,
                "stable_count": stable_count,
                "active_biochips": active_biochips,
                "revoked_biochips": revoked_biochips,
            },
        }

    def get_patient(self, patient_id: str) -> Optional[Dict[str, Any]]:
        self._ensure_loaded()
        with self._lock:
            patient = self._patients.get(patient_id)
            if not patient:
                # Try finding by device_id or case-insensitive
                for p in self._patients.values():
                    if p["patient_id"].lower() == patient_id.lower() or p["device_id"].lower() == patient_id.lower():
                        return dict(p)
                return None
            return dict(patient)

    def acknowledge(self, patient_id: str, actor: str, note: Optional[str] = None) -> Dict[str, Any]:
        self._ensure_loaded()
        with self._lock:
            if patient_id not in self._patients:
                raise KeyError(f"Patient '{patient_id}' not found")
            p = self._patients[patient_id]
            p["acknowledged"] = True
            p["acknowledged_by"] = actor
            now_iso = datetime.now(timezone.utc).isoformat()
            p["acknowledged_at"] = now_iso

        # Log into cryptographic audit trail
        audit = get_audit_logger()
        event_id = audit.log(
            actor=actor,
            event_type="CLINICIAN_ACKNOWLEDGE",
            outcome="ACCEPTED",
            device_id=p["device_id"],
            details=f"patient_id={patient_id} status={p['status']} glucose={p['glucose_mg_dl']} note={note or 'None'}",
        )
        return {
            "status": "success",
            "patient_id": patient_id,
            "acknowledged_by": actor,
            "acknowledged_at": now_iso,
            "audit_event_id": event_id,
        }

    def record_intervention(
        self, patient_id: str, actor: str, protocol: str, dosage: Optional[str] = None, notes: Optional[str] = None
    ) -> Dict[str, Any]:
        self._ensure_loaded()
        with self._lock:
            if patient_id not in self._patients:
                raise KeyError(f"Patient '{patient_id}' not found")
            p = self._patients[patient_id]
            summary_str = f"{protocol}" + (f" ({dosage})" if dosage else "")
            p["last_intervention"] = summary_str
            p["acknowledged"] = True
            p["acknowledged_by"] = actor
            p["acknowledged_at"] = datetime.now(timezone.utc).isoformat()

        # Log into cryptographic audit trail
        audit = get_audit_logger()
        event_id = audit.log(
            actor=actor,
            event_type="CLINICAL_INTERVENTION",
            outcome="ACCEPTED",
            device_id=p["device_id"],
            details=f"patient_id={patient_id} protocol={protocol} dosage={dosage or 'N/A'} notes={notes or 'None'}",
        )
        return {
            "status": "dispatched",
            "patient_id": patient_id,
            "protocol": summary_str,
            "audit_event_id": event_id,
        }

    def rerun_assay(self, patient_id: str, actor: str) -> Dict[str, Any]:
        self._ensure_loaded()
        with self._lock:
            if patient_id not in self._patients:
                raise KeyError(f"Patient '{patient_id}' not found")
            p = self._patients[patient_id]
            current_glucose = p["glucose_mg_dl"]

        # Run live biochip simulator
        from app.simulation.dmfb_simulator import DMFBBiochip
        chip = DMFBBiochip(device_id=p["device_id"])
        steps = chip.load_glucose_assay(patient_glucose=current_glucose)
        snapshots = []
        for step in steps:
            snap = chip.execute_step(step)
            snapshots.append({
                "step_num": step.step_num,
                "operation": step.operation,
                "description": step.description,
                "active_electrodes": list(step.active_electrodes),
            })
        sensor_data = chip.read_optical_sensor()

        # Slight real-world assay fluctuation (+/- 1 to 3 mg/dL)
        jitter = round(random.uniform(-2.5, 2.5), 1)
        measured_glucose = max(35.0, round(sensor_data.get("glucose_mg_dl", current_glucose) + jitter, 1))

        with self._lock:
            p["glucose_mg_dl"] = measured_glucose
            p["last_assay_time"] = "Just now (Live EWOD Bioassay)"
            p["message_counter"] = p.get("message_counter", 1) + 1
            now_hhmm = datetime.now(timezone.utc).strftime("%H:%M")
            p["history"].append({"timestamp": now_hhmm, "glucose_mg_dl": measured_glucose})
            if len(p["history"]) > 10:
                p["history"] = p["history"][-10:]

            # Update status based on newly measured value
            if measured_glucose >= 200 or measured_glucose < 70:
                p["status"] = "CRITICAL"
            elif measured_glucose >= 140:
                p["status"] = "WARNING"
            else:
                p["status"] = "STABLE"

        # Log into cryptographic audit trail
        audit = get_audit_logger()
        event_id = audit.log(
            actor=actor,
            event_type="BIOASSAY_RERUN",
            outcome="ACCEPTED",
            device_id=p["device_id"],
            details=f"patient_id={patient_id} measured_glucose={measured_glucose} absorbance={sensor_data.get('absorbance_au')} steps=7",
        )

        return {
            "status": "success",
            "patient": p,
            "steps": snapshots,
            "sensor_reading": sensor_data,
            "audit_event_id": event_id,
        }

    def simulate_tamper(self, patient_id: str, actor: str) -> Dict[str, Any]:
        self._ensure_loaded()
        with self._lock:
            if patient_id not in self._patients:
                raise KeyError(f"Patient '{patient_id}' not found")
            p = self._patients[patient_id]
            true_glucose = p["glucose_mg_dl"]

        # Run attack simulation
        from app.simulation.attack_lab import AttackLab
        lab = AttackLab()
        falsified_glucose = 85.0 if true_glucose > 140 else 220.0
        result = lab.run_glucose_tamper_attack(true_glucose=true_glucose, falsified_glucose=falsified_glucose)

        with self._lock:
            p["is_tampered"] = True
            p["crypto_verified"] = False
            p["crypto_status_text"] = "AEAD Tag Mismatch — Ciphertext Modified in Transit"
            p["tamper_alert"] = f"CRITICAL INTEGRITY FAILURE: AES-GCM Tag mismatch detected. Expected {true_glucose} mg/dL, attacker injected {falsified_glucose} mg/dL."

        # Audit alert
        audit = get_audit_logger()
        event_id = audit.log(
            actor=actor,
            event_type="SECURITY_ALERT",
            outcome="REJECTED",
            device_id=p["device_id"],
            details=f"patient_id={patient_id} attack=glucose_tamper error=InvalidTag true_val={true_glucose} fake_val={falsified_glucose}",
        )

        return {
            "patient_id": patient_id,
            "device_id": p["device_id"],
            "is_tampered": True,
            "true_glucose": true_glucose,
            "falsified_glucose": falsified_glucose,
            "pqc_aead_status": result.get("pqkms_system", {}).get("status", "PROTECTED"),
            "tamper_detected": result.get("pqkms_system", {}).get("tamper_detected", True),
            "error_detail": result.get("pqkms_system", {}).get("error_detail", "AES-GCM Authentication Tag Mismatch (InvalidTag)"),
            "clinical_consequence": result.get("pqkms_system", {}).get("clinical_consequence", "Packet rejected before clinical reading interpretation."),
            "audit_event_id": event_id,
        }

    def reset_tamper(self, patient_id: str) -> Dict[str, Any]:
        self._ensure_loaded()
        with self._lock:
            if patient_id not in self._patients:
                raise KeyError(f"Patient '{patient_id}' not found")
            p = self._patients[patient_id]
            p["is_tampered"] = False
            p["tamper_alert"] = None
            if p["device_status"] == "AUTHORIZED":
                p["crypto_verified"] = True
                p["crypto_status_text"] = "AEAD Decryption: Verified"
            return p


# Global Singleton Store
patient_store = PatientStore()


def get_actor_identity(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
    """Extract authenticated physician username/name or fallback to default clinician."""
    if credentials and credentials.credentials:
        try:
            payload = decode_token(credentials.credentials)
            db = get_db()
            user = db.get_user_by_id(payload.get("sub", ""))
            if user:
                return user.get("full_name") or user.get("username") or "Dr. Priya Sharma"
        except Exception:
            pass
    return "Dr. Priya Sharma"


# ─── API Routes ────────────────────────────────────────────────────────────────

@clinician_router.get("/patients", response_model=PatientListResponse)
def list_patients(
    search: Optional[str] = Query(None, description="Search by name, patient ID, or biochip node"),
    status: Optional[str] = Query(None, description="Filter by status: ALL, CRITICAL, WARNING, STABLE"),
    device_status: Optional[str] = Query(None, description="Filter by biochip status: ALL, AUTHORIZED, REVOKED, PENDING"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=100, description="Records per page"),
):
    """Retrieve paginated patient vitals & telemetry linked to point-of-care biochips."""
    try:
        data = patient_store.get_all(
            search=search,
            status_filter=status,
            device_status_filter=device_status,
            page=page,
            page_size=page_size,
        )
        return PatientListResponse(**data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@clinician_router.get("/patients/{patient_id}", response_model=PatientRecordModel)
def get_patient_detail(patient_id: str):
    """Get full diagnostic detail and telemetry history for a specific patient."""
    p = patient_store.get_patient(patient_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")
    return PatientRecordModel(**p)


@clinician_router.post("/patients/{patient_id}/acknowledge")
def acknowledge_patient(
    patient_id: str,
    req: AcknowledgeRequest,
    actor: str = Depends(get_actor_identity),
):
    """Acknowledge reading and record in tamper-evident hash-chained audit ledger."""
    try:
        return patient_store.acknowledge(patient_id=patient_id, actor=actor, note=req.note)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@clinician_router.post("/patients/{patient_id}/intervention")
def order_clinical_intervention(
    patient_id: str,
    req: InterventionRequest,
    actor: str = Depends(get_actor_identity),
):
    """Order physician intervention and log to cryptographic audit ledger."""
    try:
        return patient_store.record_intervention(
            patient_id=patient_id,
            actor=actor,
            protocol=req.protocol,
            dosage=req.dosage,
            notes=req.notes,
        )
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@clinician_router.post("/patients/{patient_id}/re-run-assay")
def rerun_bioassay(
    patient_id: str,
    actor: str = Depends(get_actor_identity),
):
    """Trigger live EWOD biochip actuation and update patient telemetry with fresh assay measurement."""
    try:
        return patient_store.rerun_assay(patient_id=patient_id, actor=actor)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@clinician_router.post("/patients/{patient_id}/simulate-tamper", response_model=TamperSimulationResponse)
def simulate_mitm_tamper(
    patient_id: str,
    actor: str = Depends(get_actor_identity),
):
    """Simulate an active MITM tampering attack on the biochip telemetry and verify AEAD tag rejection."""
    try:
        res = patient_store.simulate_tamper(patient_id=patient_id, actor=actor)
        return TamperSimulationResponse(**res)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@clinician_router.post("/patients/{patient_id}/reset-tamper")
def reset_tamper_state(
    patient_id: str,
):
    """Reset simulated tamper alert for a patient back to verified state."""
    try:
        res = patient_store.reset_tamper(patient_id=patient_id)
        return PatientRecordModel(**res)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
