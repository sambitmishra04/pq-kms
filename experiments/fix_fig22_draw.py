"""
Generate Figure 22 (image24) — Bandwidth Amortization Curve (corrected).
PQC handshake = 12,150 B, Classical = 480 B.
Overhead per message = handshake_bytes / N + 24 (16 B GCM tag + 8 B counter)
Right panel y = overhead / 1024 * 100 (percent of 1 KiB payload)
Output: results/figures/fig22_new.png  (RGBA, 300 DPI, figsize=(14,5.5))

Annotations:
  - "PQC: ~14% at N = 100"   at (100, 14.21)
  - "PQC: ~3.5% at N = 1000" at (1000, 3.53)
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

FIGURES_DIR = Path(__file__).parent.parent / "results" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

COLORS = {
    "PQC":       "#2563eb",
    "Classical": "#dc2626",
}

def main():
    plt.rcParams["font.family"] = "serif"
    plt.rcParams["font.serif"] = ["DejaVu Serif", "Times New Roman"]

    # Model parameters (corrected)
    handshake_pqc = 12_150   # bytes  (ML-DSA pk + ML-KEM pk + sigs + ct + framing)
    handshake_cl  =    480   # bytes  (X25519 + Ed25519 classical session)
    sym_overhead  =     24   # bytes  (16 GCM tag + 8 counter)

    msg_counts = np.arange(1, 1001)

    # Effective wire overhead per message (bytes)
    overhead_pqc = handshake_pqc / msg_counts + sym_overhead
    overhead_cl  = handshake_cl  / msg_counts + sym_overhead

    # As percentage of 1 KiB (1024 B) payload
    pct_pqc = overhead_pqc / 1024.0 * 100.0
    pct_cl  = overhead_cl  / 1024.0 * 100.0

    # Spot-check values
    pqc_at_100  = handshake_pqc / 100  + sym_overhead          # 145.5 B  → 14.21%
    pqc_at_1000 = handshake_pqc / 1000 + sym_overhead          # 36.15 B  →  3.53%
    print(f"PQC overhead at N=100 : {pqc_at_100:.2f} B  → {pqc_at_100/1024*100:.2f}%")
    print(f"PQC overhead at N=1000: {pqc_at_1000:.2f} B  → {pqc_at_1000/1024*100:.2f}%")

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5.5))
    fig.patch.set_alpha(1.0)

    # ── Left panel: log-scale bytes ──────────────────────────────────────────
    ax1.plot(msg_counts, overhead_pqc, color=COLORS["PQC"],
             linewidth=2, label="PQC Path (ML-KEM + ML-DSA)")
    ax1.plot(msg_counts, overhead_cl, color=COLORS["Classical"],
             linewidth=2, linestyle="--", label="Classical (X25519 + Ed25519)")
    ax1.axhline(sym_overhead, color="gray", linestyle=":",
                label=f"Symmetric Lower Bound ({sym_overhead} B tag+counter)")
    ax1.set_xlabel("Number of Actuation Messages Protected per Session", fontsize=11)
    ax1.set_ylabel("Effective Wire Overhead per Message (Bytes)", fontsize=11)
    ax1.set_yscale("log")
    ax1.set_title("Amortized Wire Overhead per Message", fontsize=12, fontweight="bold")
    ax1.legend(fontsize=9.5)
    ax1.grid(True, alpha=0.3, which="both")

    # ── Right panel: linear percentage 0–25% ────────────────────────────────
    ax2.plot(msg_counts, pct_pqc, color=COLORS["PQC"],
             linewidth=2, label="PQC Path")
    ax2.plot(msg_counts, pct_cl, color=COLORS["Classical"],
             linewidth=2, linestyle="--", label="Classical Path")
    ax2.set_xlabel("Number of Actuation Messages Protected per Session", fontsize=11)
    ax2.set_ylabel("Bandwidth Overhead on 1 KiB Payload (%)", fontsize=11)
    ax2.set_title("Bandwidth Overhead Decay (SP 800-57 Cryptoperiod)", fontsize=12,
                  fontweight="bold")
    ax2.set_ylim(0, 25)

    # Annotation 1: PQC ~14% at N=100
    ax2.annotate(
        "PQC: ~14% at N = 100",
        xy=(100, pct_pqc[99]),           # index 99 → N=100
        xytext=(200, 18),
        arrowprops=dict(facecolor="black", arrowstyle="->", lw=1),
        fontsize=9.5, fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.3", fc="#e0f2fe", ec="#0284c7"),
    )

    # Annotation 2: PQC ~3.5% at N=1000
    ax2.annotate(
        "PQC: ~3.5% at N = 1000",
        xy=(1000, pct_pqc[999]),         # index 999 → N=1000
        xytext=(650, 8),
        arrowprops=dict(facecolor="black", arrowstyle="->", lw=1),
        fontsize=9.5, fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.3", fc="#dcfce7", ec="#16a34a"),
    )

    ax2.legend(fontsize=9.5)
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()

    out_path = FIGURES_DIR / "fig22_new.png"
    fig.savefig(out_path, dpi=300, bbox_inches="tight", transparent=False)
    plt.close(fig)

    # Verify output
    from PIL import Image
    img = Image.open(out_path)
    print(f"[Fig22] Saved → {out_path}")
    print(f"  Mode: {img.mode}, Size: {img.size[0]}x{img.size[1]} px")
    return out_path


if __name__ == "__main__":
    main()
