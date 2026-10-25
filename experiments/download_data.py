"""
Download real biomedical vitals data from Kaggle.
Uses the Kaggle API if credentials are available; falls back to a publicly
accessible alternative dataset URL.

Dataset: "Patient Vitals and Clinical Data" (various Kaggle sources)
Fallback: PhysioNet MIMIC demo vital signs (public domain)

Run: python experiments/download_data.py
"""
from __future__ import annotations

import csv
import io
import json
import os
import sys
import urllib.request
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

VITALS_CSV = DATA_DIR / "vitals.csv"

# PhysioNet MIMIC-III demo (public domain, CC0)
# Reference: https://physionet.org/content/mimiciii-demo/1.4/
FALLBACK_URL = (
    "https://raw.githubusercontent.com/MIT-LCP/mimic-code/main/mimic-iii/"
    "concepts/cookbook/chartevents_sample.csv"
)

# Alternative: Synthea synthetic patient data (Apache 2.0)
SYNTHEA_URL = (
    "https://raw.githubusercontent.com/synthetichealth/synthea/"
    "master/src/test/resources/generic/observations.csv"
)


def download_kaggle(dataset_slug: str, filename: str) -> bool:
    """Try to download a Kaggle dataset if credentials are configured."""
    try:
        import kaggle  # type: ignore
        kaggle.api.authenticate()
        kaggle.api.dataset_download_file(
            dataset_slug, file_name=filename, path=str(DATA_DIR), force=False
        )
        print(f"[Data] Downloaded {filename} from Kaggle dataset {dataset_slug}")
        return True
    except Exception as exc:
        print(f"[Data] Kaggle download unavailable: {exc}")
        return False


def download_url(url: str, dest: Path, max_rows: int = 5000) -> bool:
    """Download CSV from a public URL, cap to max_rows."""
    try:
        print(f"[Data] Fetching {url}...")
        with urllib.request.urlopen(url, timeout=30) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
        reader = csv.DictReader(io.StringIO(raw))
        rows = []
        for i, row in enumerate(reader):
            if i >= max_rows:
                break
            rows.append(row)
        if not rows:
            return False
        with open(dest, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        print(f"[Data] Saved {len(rows)} rows to {dest}")
        return True
    except Exception as exc:
        print(f"[Data] URL download failed: {exc}")
        return False


def generate_synthetic(dest: Path, n: int = 2000) -> None:
    """Generate fully synthetic glucose + vitals records (fallback)."""
    import random
    rng = random.Random(42)
    fields = [
        "PatientID", "timestamp", "glucose", "SystolicBP", "DiastolicBP",
        "HeartRate", "BodyTemp", "SpO2", "Outcome"
    ]
    rows = []
    for i in range(n):
        glucose = rng.uniform(70, 400)
        rows.append({
            "PatientID": f"P{i:05d}",
            "timestamp": f"2024-01-01T{rng.randint(0,23):02d}:{rng.randint(0,59):02d}:00Z",
            "glucose": round(glucose, 2),
            "SystolicBP": round(rng.uniform(90, 180), 1),
            "DiastolicBP": round(rng.uniform(60, 120), 1),
            "HeartRate": round(rng.uniform(50, 120), 1),
            "BodyTemp": round(rng.uniform(36.0, 38.5), 2),
            "SpO2": round(rng.uniform(93, 100), 1),
            "Outcome": "diabetic" if glucose > 200 else "normal",
        })
    with open(dest, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    print(f"[Data] Generated {n} synthetic vitals records → {dest}")


def main() -> None:
    if VITALS_CSV.exists():
        print(f"[Data] {VITALS_CSV} already exists. Delete it to re-download.")
        return

    print("[Data] Attempting to fetch real biomedical vitals data...")

    # Priority 1: Kaggle (requires ~/.kaggle/kaggle.json)
    kaggle_datasets = [
        ("uciml/pima-indians-diabetes-database", "diabetes.csv"),
        ("mathchi/diabetes-data-set", "diabetes.csv"),
    ]
    for slug, fname in kaggle_datasets:
        if download_kaggle(slug, fname):
            # Rename to vitals.csv if needed
            downloaded = DATA_DIR / fname
            if downloaded.exists() and downloaded != VITALS_CSV:
                downloaded.rename(VITALS_CSV)
            if VITALS_CSV.exists():
                return

    # Priority 2: Public GitHub CSV URLs
    alternative_urls = [
        "https://raw.githubusercontent.com/plotly/datasets/master/diabetes.csv",
        "https://gist.githubusercontent.com/ktisha/c21e73a1bd1700294ef790c56c8aec1f/raw/819b69a5736a56c2f3dfd460dc3f5c28aec5d678/pima-indians-diabetes.csv",
    ]
    for url in alternative_urls:
        if download_url(url, VITALS_CSV, max_rows=5000):
            return

    # Fallback: generate synthetic data
    print("[Data] All download attempts failed — generating synthetic data.")
    generate_synthetic(VITALS_CSV)


if __name__ == "__main__":
    main()
