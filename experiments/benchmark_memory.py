"""
E6: Memory footprint measurement (RSS + tracemalloc).
"""
from __future__ import annotations

import csv
import os
import sys
import tracemalloc
from pathlib import Path

_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

import psutil

RESULTS_DIR = Path(__file__).parent.parent / "results" / "tables"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def rss_kb() -> float:
    return psutil.Process().memory_info().rss / 1024


def run_e6() -> list[dict]:
    rows = []

    import oqs
    from app.crypto.classical import x25519_generate_keypair, x25519_agree, ed25519_generate_keypair

    print("\n=== E6: Memory footprint ===")

    # PQC path
    baseline_rss = rss_kb()
    tracemalloc.start()
    snap0 = tracemalloc.take_snapshot()

    kem = oqs.KeyEncapsulation("ML-KEM-768")
    pk = kem.generate_keypair()
    ct, ss = oqs.KeyEncapsulation("ML-KEM-768").encap_secret(pk)
    _ = kem.decap_secret(ct)
    sig = oqs.Signature("ML-DSA-65")
    spk = sig.generate_keypair()
    ssk = sig.export_secret_key()
    _ = oqs.Signature("ML-DSA-65", ssk).sign(b"test message")

    snap1 = tracemalloc.take_snapshot()
    tracemalloc.stop()
    after_rss = rss_kb()

    top_stats = snap1.compare_to(snap0, "lineno")
    tracemalloc_bytes = sum(s.size_diff for s in top_stats if s.size_diff > 0)

    rows.append({
        "experiment": "E6", "path": "PQC",
        "rss_before_kb": baseline_rss,
        "rss_after_kb": after_rss,
        "rss_delta_kb": after_rss - baseline_rss,
        "tracemalloc_bytes": tracemalloc_bytes,
        "note": "tracemalloc does not capture C-library allocations",
    })
    print(f"  PQC: RSS delta={after_rss - baseline_rss:.1f} KiB, tracemalloc={tracemalloc_bytes} B")

    # Classical path
    baseline_rss2 = rss_kb()
    tracemalloc.start()
    snap2 = tracemalloc.take_snapshot()

    pub_a, priv_a = x25519_generate_keypair()
    pub_b, priv_b = x25519_generate_keypair()
    _ = x25519_agree(priv_a, pub_b)
    ed_pub, ed_priv = ed25519_generate_keypair()
    from app.crypto.classical import ed25519_sign
    _ = ed25519_sign(ed_priv, b"test message", b"CTX")

    snap3 = tracemalloc.take_snapshot()
    tracemalloc.stop()
    after_rss2 = rss_kb()

    top_stats2 = snap3.compare_to(snap2, "lineno")
    tracemalloc_bytes2 = sum(s.size_diff for s in top_stats2 if s.size_diff > 0)

    rows.append({
        "experiment": "E6", "path": "Classical",
        "rss_before_kb": baseline_rss2,
        "rss_after_kb": after_rss2,
        "rss_delta_kb": after_rss2 - baseline_rss2,
        "tracemalloc_bytes": tracemalloc_bytes2,
        "note": "tracemalloc does not capture C-library allocations",
    })
    print(f"  Classical: RSS delta={after_rss2 - baseline_rss2:.1f} KiB, tracemalloc={tracemalloc_bytes2} B")

    path = RESULTS_DIR / "e6_memory.csv"
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"[E6] Saved → {path}")
    return rows


if __name__ == "__main__":
    run_e6()
