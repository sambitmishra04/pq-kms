"""
Generate Figure 19 (image21) — Wire Communication Overhead (E3).
Stacked bar chart: Session bytes (bottom) + Message bytes (top).
Labels say KiB (not KB). Y-axis: log scale.
Values derived from report text: PQC totals 12.1/13.3/25.3 KiB; Classical 0.8/2.0/14.0 KiB.
Output: results/figures/fig19_new.png  (RGB, 300 DPI, figsize=(10,6))
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

def main():
    plt.rcParams["font.family"] = "serif"
    plt.rcParams["font.serif"] = ["DejaVu Serif", "Times New Roman"]

    # ── Data (from report's stated values, /1024 → KiB) ────────────────────
    # PQC totals (KiB): 12.1 KiB, 13.3 KiB, 25.3 KiB
    # Classical totals (KiB): 0.8 KiB, 2.0 KiB, 14.0 KiB
    PQC_SESSION_B     = 12_150   # B — constant for all payload sizes
    CL_SESSION_B      =    480   # B — constant for all payload sizes

    # Back-compute message bytes from report's stated totals:
    # PQC total (B) = PQC total_KiB * 1024
    pqc_totals_B = np.array([12.1, 13.3, 25.3]) * 1024    # [12390.4, 13619.2, 25907.2]
    cl_totals_B  = np.array([0.8,   2.0, 14.0]) * 1024    # [819.2,  2048.0,  14336.0]

    pqc_msg_B = pqc_totals_B - PQC_SESSION_B               # [240.4, 1469.2, 13757.2]
    cl_msg_B  = cl_totals_B  - CL_SESSION_B                # [339.2, 1568.0, 13856.0]

    # Convert to KiB for plotting
    pqc_session_kib = np.full(3, PQC_SESSION_B / 1024)
    cl_session_kib  = np.full(3, CL_SESSION_B  / 1024)
    pqc_msg_kib     = pqc_msg_B  / 1024
    cl_msg_kib      = cl_msg_B   / 1024
    pqc_total_kib   = pqc_totals_B / 1024
    cl_total_kib    = cl_totals_B  / 1024

    payload_labels = ["128 B", "1 KiB", "10 KiB"]
    x = np.arange(len(payload_labels))
    width = 0.35

    fig, ax = plt.subplots(figsize=(10, 6))
    fig.patch.set_alpha(1.0)

    PQC_COLOR = "#2563eb"
    CL_COLOR  = "#dc2626"

    # PQC bars: session (bottom) + message (top)
    pqc_sess_bars = ax.bar(
        x - width / 2, pqc_session_kib, width,
        label="Session (PQC)", color=PQC_COLOR, alpha=0.85,
        edgecolor="black", linewidth=0.5,
    )
    pqc_msg_bars = ax.bar(
        x - width / 2, pqc_msg_kib, width,
        bottom=pqc_session_kib,
        label="Message (PQC)", color=PQC_COLOR, alpha=0.5,
        edgecolor="black", linewidth=0.5, hatch="//",
    )

    # Classical bars: session (bottom) + message (top)
    cl_sess_bars = ax.bar(
        x + width / 2, cl_session_kib, width,
        label="Session (Classical)", color=CL_COLOR, alpha=0.85,
        edgecolor="black", linewidth=0.5,
    )
    cl_msg_bars = ax.bar(
        x + width / 2, cl_msg_kib, width,
        bottom=cl_session_kib,
        label="Message (Classical)", color=CL_COLOR, alpha=0.5,
        edgecolor="black", linewidth=0.5, hatch="//",
    )

    # Total KiB labels above each bar
    for i, (ptot, ctot) in enumerate(zip(pqc_total_kib, cl_total_kib)):
        ax.text(i - width / 2, ptot * 1.15, f"{ptot:.1f} KiB",
                ha="center", va="bottom", fontsize=8.5, fontweight="bold")
        ax.text(i + width / 2, ctot * 1.15, f"{ctot:.1f} KiB",
                ha="center", va="bottom", fontsize=8.5, fontweight="bold")

    ax.set_yscale("log")
    ax.set_ylim(bottom=0.1, top=45)
    ax.set_ylabel("Wire Bytes (KiB)", fontsize=11)
    ax.set_xlabel("Message Payload Size", fontsize=11)
    ax.set_xticks(x)
    ax.set_xticklabels(payload_labels, fontsize=10)
    ax.set_title("Wire Communication Overhead (E3)", fontsize=13, fontweight="bold")
    ax.legend(fontsize=9, loc="upper left")
    ax.grid(axis="y", alpha=0.3, which="both")

    plt.tight_layout()

    out_path = FIGURES_DIR / "fig19_new.png"
    fig.savefig(out_path, dpi=300, bbox_inches="tight", transparent=False)
    plt.close(fig)

    # Verify output
    from PIL import Image
    img = Image.open(out_path)
    if img.mode == "RGBA":
        img = img.convert("RGB")
        img.save(out_path)
        print(f"  Converted RGBA → RGB")
    print(f"[Fig19] Saved → {out_path}")
    print(f"  Mode: {img.mode}, Size: {img.size[0]}x{img.size[1]} px")
    return out_path


if __name__ == "__main__":
    main()
