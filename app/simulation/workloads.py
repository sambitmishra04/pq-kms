"""
Synthetic biomedical data workloads for simulation and benchmarking.

Instead of synthetic noise, we use real patient vitals data from
Kaggle's 'Patient Vitals & Clinical Data' dataset (public domain / CC0).
Fallback to synthetically generated records if data not available.

The data files are pre-downloaded to data/vitals.csv by the setup script.
"""
from __future__ import annotations

import json
import os
import random
import struct
import time
import uuid
from pathlib import Path

import numpy as np

DATA_DIR = Path(__file__).parent.parent.parent / "data"
VITALS_CSV = DATA_DIR / "vitals.csv"

# Fix seed for reproducibility (Chapter 7 requirement)
_rng = random.Random(42)
_np_rng = np.random.default_rng(42)

# Pre-loaded real records (if CSV available)
_real_records: list[dict] = []


def _load_real_data() -> None:
    """Load real patient vitals from the downloaded CSV (if available)."""
    global _real_records
    if not VITALS_CSV.exists():
        return
    try:
        import csv
        with open(VITALS_CSV, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            _real_records = [row for row in reader][:5000]  # cap at 5000
        print(f"[Workloads] Loaded {len(_real_records)} real vitals records from {VITALS_CSV}")
    except Exception as exc:
        print(f"[Workloads] Could not load real data: {exc} — using synthetic")


_load_real_data()


def _make_glucose_assay(record: dict | None = None) -> dict:
    """Generate one glucose-assay result record."""
    if record:
        # Use real vitals fields from Pima Indians clinical dataset
        glucose = float(record.get("Glucose", record.get("glucose", record.get("BloodGlucose", _rng.uniform(70, 300)))))
        bp = float(record.get("BloodPressure", record.get("DiastolicBP", 70)))
        systolic = bp + 40 if bp > 0 else float(_rng.uniform(110, 140))
        diastolic = bp if bp > 0 else float(_rng.uniform(70, 90))
        bmi = float(record.get("BMI", _rng.uniform(20.0, 35.0)))
        insulin = float(record.get("Insulin", _rng.uniform(10.0, 150.0)))
        age = int(record.get("Age", _rng.randint(20, 70)))
        outcome = int(record.get("Outcome", 0))

        return {
            "assay_type": "glucose",
            "sample_id": record.get("PatientID", f"PAT-{_rng.randint(10000, 99999)}"),
            "timestamp": record.get("timestamp", time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())),
            "glucose_mg_dl": round(glucose, 2),
            "systolic_bp": round(systolic, 1),
            "diastolic_bp": round(diastolic, 1),
            "bmi": round(bmi, 2),
            "insulin_u_ml": round(insulin, 1),
            "patient_age": age,
            "clinical_indication": "diabetic" if outcome == 1 or glucose >= 200 else "normal",
            "heart_rate": round(float(record.get("HeartRate", _rng.uniform(60, 95))), 1),
            "temperature_c": round(float(record.get("BodyTemp", _rng.uniform(36.4, 37.4))), 2),
            "spo2": round(float(record.get("SpO2", _rng.uniform(96, 99))), 1),
            "device_id": f"DMFB-{_rng.randint(1000, 9999)}",
        }
    return {
        "assay_type": "glucose",
        "sample_id": str(uuid.uuid4()),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "glucose_mg_dl": round(_rng.uniform(70, 300), 2),
        "systolic_bp": round(_rng.uniform(90, 180), 1),
        "diastolic_bp": round(_rng.uniform(60, 120), 1),
        "heart_rate": round(_rng.uniform(50, 120), 1),
        "temperature_c": round(_rng.uniform(36.0, 38.5), 2),
        "spo2": round(_rng.uniform(94, 100), 1),
        "device_id": f"DMFB-{_rng.randint(1000,9999)}",
    }


def _make_actuation_sequence(steps: int = 20) -> dict:
    """Generate a synthetic DMFB actuation sequence."""
    return {
        "sequence_id": str(uuid.uuid4()),
        "protocol": "glucose_assay_v2",
        "grid_size": [8, 8],
        "steps": [
            {
                "step": i,
                "actuated": [_rng.randint(0, 7), _rng.randint(0, 7)],
                "duration_ms": _rng.randint(50, 200),
                "operation": _rng.choice(["MOVE", "MIX", "SPLIT", "DETECT"]),
            }
            for i in range(steps)
        ],
    }


def generate_payload(target_size: int) -> bytes:
    """
    Generate a realistic JSON diagnostic payload of approximately `target_size` bytes.

    Uses real vitals records if available, otherwise generates synthetic data.
    Pads with extra assay records to reach the target size.

    Args:
        target_size: Target byte count (128, 1024, or 10240).

    Returns:
        JSON-encoded bytes.
    """
    if _real_records:
        idx = _rng.randint(0, len(_real_records) - 1)
        base_record = _make_glucose_assay(_real_records[idx])
    else:
        base_record = _make_glucose_assay()

    payload = {
        "version": "1.0",
        "device_id": f"DMFB-{_rng.randint(1000,9999)}",
        "record": base_record,
        "actuation": _make_actuation_sequence(5),
    }
    encoded = json.dumps(payload, separators=(",", ":")).encode("utf-8")

    # Pad with extra records until target size is reached
    extra_records = []
    while len(encoded) < target_size:
        if _real_records:
            idx = _rng.randint(0, len(_real_records) - 1)
            extra_records.append(_make_glucose_assay(_real_records[idx]))
        else:
            extra_records.append(_make_glucose_assay())
        payload["extra"] = extra_records
        encoded = json.dumps(payload, separators=(",", ":")).encode("utf-8")

    # Trim to exact size if needed (last byte must keep valid JSON — just slice)
    return encoded[:target_size] if len(encoded) > target_size else encoded


def generate_glucose_assay(size: int = 128) -> bytes:
    """Generate a glucose-assay message payload of `size` bytes."""
    return generate_payload(size)


def generate_actuation_sequence(size: int = 128) -> bytes:
    """Generate an actuation-sequence payload of `size` bytes."""
    base = {"version": "1.0", "payload_type": "actuation", "data": _make_actuation_sequence(10)}
    encoded = json.dumps(base, separators=(",", ":")).encode("utf-8")
    while len(encoded) < size:
        base["extra_steps"] = _make_actuation_sequence(5)
        encoded = json.dumps(base, separators=(",", ":")).encode("utf-8")
    return encoded[:size] if len(encoded) > size else encoded
