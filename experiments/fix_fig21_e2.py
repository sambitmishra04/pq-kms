"""
Re-run E2 parameter-sensitivity benchmarks (keygen ONLY) using the EXACT same
50-warmup + 1000-trial harness as E1 (time.perf_counter_ns via bench_operation).

Saves results to: results/tables/e2_keygen_rerun.csv
Prints ML-KEM-768 keygen mean in ms for verification.
"""
from __future__ import annotations

import csv
import os
import sys
import time
import uuid
from pathlib import Path

# ── liboqs shared library ────────────────────────────────────────────────────
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH', '')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

import oqs
import numpy as np

from app.config import BENCH_WARMUP, BENCH_TRIALS

RESULTS_DIR = Path(__file__).parent.parent / "results" / "tables"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

SAVE_PATH = RESULTS_DIR / "e2_keygen_rerun.csv"

WARMUP  = BENCH_WARMUP   # 50
TRIALS  = BENCH_TRIALS   # 1000

KEM_ALGS = ["ML-KEM-512", "ML-KEM-768", "ML-KEM-1024"]
SIG_ALGS = ["ML-DSA-44",  "ML-DSA-65",  "ML-DSA-87"]


def ns() -> int:
    return time.perf_counter_ns()


def bench_operation(fn) -> list[int]:
    """50 warm-up + 1000 measured trials, identical to E1 harness."""
    for _ in range(WARMUP):
        fn()
    results = []
    for _ in range(TRIALS):
        t0 = ns()
        fn()
        results.append(ns() - t0)
    return results


def stats(samples: list[int]) -> dict:
    a = np.array(samples, dtype=np.float64)
    return {
        "mean_us":   float(np.mean(a))           / 1000,
        "sd_us":     float(np.std(a))             / 1000,
        "median_us": float(np.median(a))          / 1000,
        "p95_us":    float(np.percentile(a, 95))  / 1000,
        "min_us":    float(np.min(a))             / 1000,
        "max_us":    float(np.max(a))             / 1000,
        "trials":    len(samples),
    }


def bench_kem_keygen(algorithm: str) -> dict:
    print(f"  KEM keygen {algorithm}...", end=" ", flush=True)
    samples = bench_operation(lambda: oqs.KeyEncapsulation(algorithm).generate_keypair())
    s = stats(samples)
    print(f"  mean={s['mean_us']:.3f} µs  sd={s['sd_us']:.3f} µs")
    return s


def bench_sig_keygen(algorithm: str) -> dict:
    print(f"  SIG keygen {algorithm}...", end=" ", flush=True)
    samples = bench_operation(
        lambda: (lambda obj: (obj.generate_keypair(), obj.export_secret_key()))(
            oqs.Signature(algorithm)
        )
    )
    s = stats(samples)
    print(f"  mean={s['mean_us']:.3f} µs  sd={s['sd_us']:.3f} µs")
    return s


def main():
    run_id = str(uuid.uuid4())[:8]
    rows = []

    print("\n=== E2 RE-RUN: keygen only (50 warmup + 1000 trials) ===")

    print("\nML-KEM variants:")
    kem768_mean_ms = None
    for alg in KEM_ALGS:
        s = bench_kem_keygen(alg)
        rows.append({
            "run_id": run_id, "experiment": "E2_rerun",
            "algorithm": alg, "operation": "keygen", **s,
        })
        if alg == "ML-KEM-768":
            kem768_mean_ms = s["mean_us"] / 1000

    print("\nML-DSA variants:")
    for alg in SIG_ALGS:
        s = bench_sig_keygen(alg)
        rows.append({
            "run_id": run_id, "experiment": "E2_rerun",
            "algorithm": alg, "operation": "keygen", **s,
        })

    # ── save CSV ─────────────────────────────────────────────────────────────
    with open(SAVE_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"\n[E2 rerun] Saved → {SAVE_PATH}")

    # ── verification check ───────────────────────────────────────────────────
    print(f"\nML-KEM-768 keygen mean: {kem768_mean_ms:.4f} ms")
    if 0.05 <= kem768_mean_ms <= 0.25:
        print(f"  ✓ In acceptable range [0.05, 0.25] ms")
        print(f"  Reference E1 value: 0.106 ms")
    else:
        print(f"  ✗ OUTSIDE acceptable range [0.05, 0.25] ms — STOPPING")
        sys.exit(1)

    return rows


if __name__ == "__main__":
    main()
