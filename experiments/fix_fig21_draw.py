"""
Generate Figure 21 (image23) — Parameter-Set Sensitivity Analysis (E2).
Two-panel bar chart: ML-KEM variants (left) + ML-DSA variants (right).
Uses E2 CSV data from e2_parameter_sensitivity.csv (run_id=6a12e24f).
Output: results/figures/fig21_new.png  (RGBA, 300 DPI, figsize=(14,5))
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH', '')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

RESULTS_DIR = Path(__file__).parent.parent / "results"
TABLES_DIR = RESULTS_DIR / "tables"
FIGURES_DIR = RESULTS_DIR / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

COLORS = {
    "ML-KEM-512":  "#16a34a",
    "ML-KEM-768":  "#2563eb",
    "ML-KEM-1024": "#7c3aed",
    "ML-DSA-44":   "#ea580c",
    "ML-DSA-65":   "#0891b2",
    "ML-DSA-87":   "#be185d",
}

def main():
    # Set serif font globally
    plt.rcParams["font.family"] = "serif"
    plt.rcParams["font.serif"] = ["DejaVu Serif", "Times New Roman"]

    csv_path = TABLES_DIR / "e2_parameter_sensitivity.csv"
    df = pd.read_csv(csv_path)

    # Filter to keygen rows
    d = df[(df["experiment"] == "E2") & (df["operation"] == "keygen")]

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.patch.set_alpha(1.0)

    for ax, variants, title in [
        (axes[0], ["ML-KEM-512", "ML-KEM-768", "ML-KEM-1024"], "ML-KEM Parameter Sets"),
        (axes[1], ["ML-DSA-44", "ML-DSA-65", "ML-DSA-87"],     "ML-DSA Parameter Sets"),
    ]:
        data = d[d["algorithm"].isin(variants)].copy()
        # Preserve order
        data = data.set_index("algorithm").reindex(variants).reset_index()

        means_ms = data["mean_us"] / 1000
        errs_ms  = data["sd_us"]   / 1000
        bar_colors = [COLORS.get(a, "#888") for a in data["algorithm"]]

        ax.bar(
            data["algorithm"], means_ms,
            yerr=errs_ms,
            color=bar_colors,
            capsize=5,
            alpha=0.85,
            edgecolor="black",
            linewidth=0.5,
            error_kw={"linewidth": 1.0, "capthick": 1.0},
        )
        ax.set_ylabel("keygen time (ms)", fontsize=10)
        ax.set_title(f"{title}\n(keygen latency, mean ± SD)", fontsize=11)
        ax.grid(axis="y", alpha=0.3)
        ax.tick_params(axis="x", labelsize=9)

    plt.suptitle("Parameter-Set Sensitivity Analysis (E2)", fontsize=13, y=1.02)
    plt.tight_layout()

    out_path = FIGURES_DIR / "fig21_new.png"
    fig.savefig(out_path, dpi=300, bbox_inches="tight", transparent=False)
    plt.close(fig)

    # Verify output mode and size
    from PIL import Image
    img = Image.open(out_path)
    print(f"[Fig21] Saved → {out_path}")
    print(f"  Mode: {img.mode}, Size: {img.size[0]}x{img.size[1]} px")
    return out_path


if __name__ == "__main__":
    main()
