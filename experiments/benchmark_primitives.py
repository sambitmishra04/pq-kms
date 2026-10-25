"""
E1 & E2: Per-operation primitive benchmarks (PQC vs Classical).
Measures: keygen, encap/decap (KEM) or agree (X25519), sign, verify.
50 warm-up + 1000 measured trials per operation (Chapter 7 methodology).
"""
from __future__ import annotations

import csv
import os
import sys
import time
import uuid
from pathlib import Path

# Ensure liboqs is found
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

import oqs
import numpy as np

from app.config import KEM_VARIANTS, SIG_VARIANTS, BENCH_WARMUP, BENCH_TRIALS, BENCH_SIG_PAYLOAD_SIZES
from app.crypto.classical import (
    x25519_generate_keypair, x25519_agree,
    ed25519_generate_keypair, ed25519_sign, ed25519_verify,
)
from app.config import CTX_SREQ

RESULTS_DIR = Path(__file__).parent.parent / "results" / "tables"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def ns() -> int:
    return time.perf_counter_ns()


def bench_operation(fn, warmup: int = BENCH_WARMUP, trials: int = BENCH_TRIALS) -> list[int]:
    """Run fn() warmup+trials times, return only the measured trial durations (ns)."""
    for _ in range(warmup):
        fn()
    results = []
    for _ in range(trials):
        t0 = ns()
        fn()
        results.append(ns() - t0)
    return results


def stats(samples: list[int]) -> dict:
    a = np.array(samples, dtype=np.float64)
    return {
        "mean_us": float(np.mean(a)) / 1000,
        "sd_us": float(np.std(a)) / 1000,
        "median_us": float(np.median(a)) / 1000,
        "p95_us": float(np.percentile(a, 95)) / 1000,
        "min_us": float(np.min(a)) / 1000,
        "max_us": float(np.max(a)) / 1000,
        "trials": len(samples),
    }


def bench_kem(algorithm: str) -> dict[str, dict]:
    """Benchmark ML-KEM keygen, encap, decap for one parameter set."""
    print(f"  KEM {algorithm}...", end=" ", flush=True)
    results = {}

    # keygen
    kem_obj = oqs.KeyEncapsulation(algorithm)
    samples = bench_operation(lambda: oqs.KeyEncapsulation(algorithm).generate_keypair())
    results["keygen"] = stats(samples)

    # encap (need a public key)
    kem_obj = oqs.KeyEncapsulation(algorithm)
    pk = kem_obj.generate_keypair()
    samples = bench_operation(lambda: oqs.KeyEncapsulation(algorithm).encap_secret(pk))
    results["encap"] = stats(samples)

    # decap (need ciphertext)
    kem_server = oqs.KeyEncapsulation(algorithm)
    pk2 = kem_server.generate_keypair()
    ct, _ = oqs.KeyEncapsulation(algorithm).encap_secret(pk2)
    samples = bench_operation(lambda: kem_server.decap_secret(ct))
    results["decap"] = stats(samples)

    print("done")
    return results


def bench_sig(algorithm: str, payload_sizes: list[int] = None) -> dict[str, dict]:
    """Benchmark ML-DSA keygen, sign, verify for one parameter set."""
    if payload_sizes is None:
        payload_sizes = BENCH_SIG_PAYLOAD_SIZES
    print(f"  SIG {algorithm}...", end=" ", flush=True)
    results = {}

    # keygen
    samples = bench_operation(lambda: (lambda s: (s.generate_keypair(), s.export_secret_key()))(oqs.Signature(algorithm)))
    results["keygen"] = stats(samples)

    for size in payload_sizes:
        msg = os.urandom(size)
        ctx = CTX_SREQ
        sig_obj = oqs.Signature(algorithm)
        pk = sig_obj.generate_keypair()
        sk = sig_obj.export_secret_key()
        signed_msg = ctx + len(msg).to_bytes(4, "big") + msg

        # sign
        samples = bench_operation(lambda: oqs.Signature(algorithm, sk).sign(signed_msg))
        results[f"sign_{size}B"] = stats(samples)

        # verify
        signature = oqs.Signature(algorithm, sk).sign(signed_msg)
        samples = bench_operation(lambda: oqs.Signature(algorithm).verify(signed_msg, signature, pk))
        results[f"verify_{size}B"] = stats(samples)

    print("done")
    return results


def bench_x25519() -> dict[str, dict]:
    """Benchmark X25519 keygen and key agreement."""
    print("  X25519...", end=" ", flush=True)
    results = {}

    from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey
    from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

    samples = bench_operation(lambda: X25519PrivateKey.generate())
    results["keygen"] = stats(samples)

    priv_a = X25519PrivateKey.generate()
    priv_b = X25519PrivateKey.generate()
    pub_b_bytes = priv_b.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
    samples = bench_operation(lambda: x25519_agree(priv_a, pub_b_bytes))
    results["agree"] = stats(samples)

    print("done")
    return results


def bench_ed25519(payload_sizes: list[int] = None) -> dict[str, dict]:
    """Benchmark Ed25519 keygen, sign, verify."""
    if payload_sizes is None:
        payload_sizes = BENCH_SIG_PAYLOAD_SIZES
    print("  Ed25519...", end=" ", flush=True)
    results = {}

    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
    samples = bench_operation(lambda: Ed25519PrivateKey.generate())
    results["keygen"] = stats(samples)

    pub_bytes, priv_bytes = ed25519_generate_keypair()
    for size in payload_sizes:
        msg = os.urandom(size)
        ctx = CTX_SREQ
        samples = bench_operation(lambda: ed25519_sign(priv_bytes, msg, ctx))
        results[f"sign_{size}B"] = stats(samples)
        sig = ed25519_sign(priv_bytes, msg, ctx)
        samples = bench_operation(lambda: ed25519_verify(pub_bytes, msg, sig, ctx))
        results[f"verify_{size}B"] = stats(samples)

    print("done")
    return results


def bench_aes_gcm(payload_sizes: list[int] = None) -> dict[str, dict]:
    """Benchmark AES-256-GCM encrypt/decrypt."""
    if payload_sizes is None:
        payload_sizes = [128, 1024, 10240]
    print("  AES-256-GCM...", end=" ", flush=True)
    from app.crypto.aead import encrypt, decrypt
    from app.config import IV_ROLE_CLIENT
    results = {}
    key = os.urandom(32)
    for size in payload_sizes:
        plaintext = os.urandom(size)
        counter_enc = [0]
        def do_encrypt():
            counter_enc[0] += 1
            return encrypt(key, plaintext, IV_ROLE_CLIENT, counter_enc[0], "dev", "sess", "msg")
        samples = bench_operation(do_encrypt)
        results[f"encrypt_{size}B"] = stats(samples)

        ct, nonce = encrypt(key, plaintext, IV_ROLE_CLIENT, 99999, "dev", "sess", "msg")
        samples = bench_operation(lambda: decrypt(key, ct, nonce, "dev", "sess", "msg", 99999))
        results[f"decrypt_{size}B"] = stats(samples)
    print("done")
    return results


def save_csv(rows: list[dict], filename: str) -> None:
    path = RESULTS_DIR / filename
    if not rows:
        return
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"[Bench] Saved → {path}")


def run_e1_e2() -> None:
    """Run experiments E1 (core primitives) and E2 (parameter sensitivity)."""
    print("\n=== E1: Core PQC primitive benchmarks ===")
    rows = []
    run_id = str(uuid.uuid4())[:8]

    # ML-KEM default (E1)
    print("ML-KEM benchmarks:")
    kem_results = bench_kem("ML-KEM-768")
    for op, s in kem_results.items():
        rows.append({"run_id": run_id, "experiment": "E1", "algorithm": "ML-KEM-768",
                     "operation": op, **s})

    # X25519 baseline (E1)
    print("X25519 baseline:")
    x_results = bench_x25519()
    for op, s in x_results.items():
        rows.append({"run_id": run_id, "experiment": "E1", "algorithm": "X25519",
                     "operation": op, **s})

    # ML-DSA default (E1)
    print("ML-DSA benchmarks:")
    dsa_results = bench_sig("ML-DSA-65")
    for op, s in dsa_results.items():
        rows.append({"run_id": run_id, "experiment": "E1", "algorithm": "ML-DSA-65",
                     "operation": op, **s})

    # Ed25519 baseline (E1)
    print("Ed25519 baseline:")
    ed_results = bench_ed25519()
    for op, s in ed_results.items():
        rows.append({"run_id": run_id, "experiment": "E1", "algorithm": "Ed25519",
                     "operation": op, **s})

    # AES-GCM (E1, same for both paths)
    print("AES-256-GCM benchmarks:")
    aes_results = bench_aes_gcm()
    for op, s in aes_results.items():
        rows.append({"run_id": run_id, "experiment": "E1", "algorithm": "AES-256-GCM",
                     "operation": op, **s})

    save_csv(rows, "e1_primitive_benchmarks.csv")

    print("\n=== E2: Parameter-set sensitivity ===")
    rows_e2 = []
    print("KEM variants:")
    for alg in KEM_VARIANTS:
        try:
            r = bench_kem(alg)
            for op, s in r.items():
                rows_e2.append({"run_id": run_id, "experiment": "E2", "algorithm": alg,
                                 "operation": op, **s})
        except Exception as exc:
            print(f"  Skipping {alg}: {exc}")

    print("SIG variants:")
    for alg in SIG_VARIANTS:
        try:
            r = bench_sig(alg)
            for op, s in r.items():
                rows_e2.append({"run_id": run_id, "experiment": "E2", "algorithm": alg,
                                 "operation": op, **s})
        except Exception as exc:
            print(f"  Skipping {alg}: {exc}")

    save_csv(rows_e2, "e2_parameter_sensitivity.csv")
    print("\n[E1/E2] Complete.")
    return rows + rows_e2


if __name__ == "__main__":
    run_e1_e2()
