"""
Generate Figure 18 — End-to-end session establishment and message transaction latency.
Two-panel bar chart:
  Left:  Session Establishment Latency (Linear Scale, 0 to 25 ms)
  Right: Message Processing Latency (Log Scale, 0.005 to 50 ms)
Uses existing benchmark dataset matching Section 8.5 specs and Table 19.
Output: results/figures/figure18_fixed.png (RGBA/RGB, 300 DPI, figsize=(14, 6))
"""
from __future__ import annotations

import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

FIGURES_DIR = Path(__file__).parent.parent / "results" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

def main():
    plt.rcParams["font.family"] = "serif"
    plt.rcParams["font.serif"] = ["DejaVu Serif", "Times New Roman"]

    COLORS = {
        "PQC": "#2563eb",
        "Classical": "#dc2626",
    }

    # Data from existing benchmark run 6f66f466 (exactly matching Section 8.5 text & report tables)
    sizes = ["128 B", "1024 B", "10240 B"]
    
    # Subplot 1: Session Establishment Latency (ms)
    pqc_session_mean = [16.6359, 17.0349, 16.9774]
    pqc_session_sd   = [2.0658, 2.7286, 3.6110]

    cl_session_mean  = [1.0894, 0.7185, 1.1091]
    cl_session_sd    = [0.2547, 0.1158, 0.4205]

    # Subplot 2: Message Processing Latency (ms)
    pqc_msg_mean     = [14.1708, 14.4150, 14.7405]
    pqc_msg_sd       = [2.5282, 2.7102, 3.0531]

    cl_msg_mean      = [0.0487, 0.0204, 0.0718]
    cl_msg_sd        = [0.0294, 0.0111, 0.0433]

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    fig.patch.set_alpha(1.0)

    width = 0.35
    x = np.arange(len(sizes))

    # ── Left Subplot: Session Establishment Latency (Linear Scale) ──
    ax1 = axes[0]
    bars1_pqc = ax1.bar(
        x - width / 2, pqc_session_mean, width,
        yerr=pqc_session_sd, label="PQC",
        color=COLORS["PQC"], capsize=4, alpha=0.85,
        edgecolor="black", linewidth=0.5,
        error_kw={"linewidth": 1.0, "capthick": 1.0},
    )
    bars1_cl = ax1.bar(
        x + width / 2, cl_session_mean, width,
        yerr=cl_session_sd, label="Classical",
        color=COLORS["Classical"], capsize=4, alpha=0.85,
        edgecolor="black", linewidth=0.5,
        error_kw={"linewidth": 1.0, "capthick": 1.0},
    )

    # Annotate bar heights cleanly
    for bar in bars1_pqc:
        h = bar.get_height()
        ax1.annotate(
            f"{h:.2f} ms",
            xy=(bar.get_x() + bar.get_width() / 2, h),
            xytext=(0, 4), textcoords="offset points",
            ha="center", va="bottom", fontsize=9, fontweight="bold",
        )

    for bar in bars1_cl:
        h = bar.get_height()
        ax1.annotate(
            f"{h:.2f} ms",
            xy=(bar.get_x() + bar.get_width() / 2, h),
            xytext=(0, 4), textcoords="offset points",
            ha="center", va="bottom", fontsize=9, fontweight="bold",
        )

    ax1.set_xticks(x)
    ax1.set_xticklabels(sizes, fontsize=10)
    ax1.set_ylabel("Latency (ms)", fontsize=11)
    ax1.set_title("Session Establishment Latency", fontsize=12, fontweight="bold")
    ax1.legend(fontsize=10, loc="upper left")
    ax1.grid(axis="y", alpha=0.3)
    # Scale to 25 ms so bars (~17 ms + error up to ~20.6 ms) appear fully with ample headroom
    ax1.set_ylim(0, 25)

    # ── Right Subplot: Message Processing Latency (Logarithmic Scale) ──
    ax2 = axes[1]
    bars2_pqc = ax2.bar(
        x - width / 2, pqc_msg_mean, width,
        yerr=pqc_msg_sd, label="PQC",
        color=COLORS["PQC"], capsize=4, alpha=0.85,
        edgecolor="black", linewidth=0.5,
        error_kw={"linewidth": 1.0, "capthick": 1.0},
    )
    bars2_cl = ax2.bar(
        x + width / 2, cl_msg_mean, width,
        yerr=cl_msg_sd, label="Classical",
        color=COLORS["Classical"], capsize=4, alpha=0.85,
        edgecolor="black", linewidth=0.5,
        error_kw={"linewidth": 1.0, "capthick": 1.0},
    )

    for bar in bars2_pqc:
        h = bar.get_height()
        ax2.annotate(
            f"{h:.2f} ms",
            xy=(bar.get_x() + bar.get_width() / 2, h),
            xytext=(0, 4), textcoords="offset points",
            ha="center", va="bottom", fontsize=9, fontweight="bold",
        )

    for bar in bars2_cl:
        h = bar.get_height()
        ax2.annotate(
            f"{h:.3f} ms",
            xy=(bar.get_x() + bar.get_width() / 2, h),
            xytext=(0, 4), textcoords="offset points",
            ha="center", va="bottom", fontsize=9, fontweight="bold",
        )

    ax2.set_xticks(x)
    ax2.set_xticklabels(sizes, fontsize=10)
    ax2.set_ylabel("Latency (ms) - Logarithmic Scale", fontsize=11)
    ax2.set_yscale("log")
    ax2.set_title("Message Processing Latency (Log Scale)", fontsize=12, fontweight="bold")
    ax2.legend(fontsize=10, loc="upper right")
    ax2.grid(axis="y", alpha=0.3, which="both")
    ax2.set_ylim(0.005, 50)

    plt.tight_layout()

    out_file = FIGURES_DIR / "figure18_fixed.png"
    fig.savefig(out_file, dpi=300, bbox_inches="tight", transparent=False)
    plt.close(fig)

    # Save a copy to artifact directory as well for immediate user preview & download
    artifact_dir = Path("/home/sambit/.gemini/antigravity/brain/69fd3db2-6a7e-4f58-93cf-1cfa2d90941a")
    if artifact_dir.exists():
        artifact_copy = artifact_dir / "figure18_fixed.png"
        img = Image.open(out_file)
        img.save(artifact_copy)
        print(f"[Artifact Copy] Saved → {artifact_copy}")

    # Also save to current directory as figure18_fixed.png for direct access
    root_copy = Path("/home/sambit/code/kms/figure18_fixed.png")
    img = Image.open(out_file)
    img.save(root_copy)

    print(f"[Fig18] Fixed figure generated successfully → {out_file}")
    print(f"  Dimensions: {img.size[0]}x{img.size[1]} px, Mode: {img.mode}")

if __name__ == "__main__":
    main()
