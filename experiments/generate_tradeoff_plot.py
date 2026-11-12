"""
Generates Figure 24 / Fig 9: Parameter-Set Trade-Off: Overhead Bytes vs Computation Time (E2)
using actual benchmark numbers from E1 and E2 in milliseconds (ms),
with cleanly separated, non-overlapping callout annotation boxes.
"""
from __future__ import annotations

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUT_PATH = BASE_DIR / "results" / "figures" / "fig_parameter_tradeoff_e2.png"

def generate_tradeoff_plot():
    plt.rcParams["font.family"] = "serif"
    plt.rcParams["font.serif"] = ["DejaVu Serif", "Times New Roman"]

    fig, ax = plt.subplots(figsize=(8.5, 5.2), dpi=300)

    # Real project benchmark data in milliseconds (ms):
    # Total computation time is sum of keygen + encap/sign + decap/verify
    # Overhead bytes is sum of public key + ciphertext/signature
    points = [
        {
            "bytes": 160,
            "time": 0.3055,
            "name": "Classical",
            "marker": "s",
            "color": "#ea580c",
            "box": "Classical\n(X25519+Ed25519)\n(160 B, 0.306 ms)",
            "xytext": (25, -20),
            "ha": "left",
            "va": "top"
        },
        {
            "bytes": 5300,
            "time": 0.1505,
            "name": "PQC Level 1/2",
            "marker": "o",
            "color": "#3b82f6",
            "box": "PQC Level 1/2\n(KEM-512+DSA-44)\n(5300 B, 0.151 ms)",
            "xytext": (-45, -45),
            "ha": "right",
            "va": "top"
        },
        {
            "bytes": 7533,
            "time": 0.2298,
            "name": "PQC Level 3",
            "marker": "^",
            "color": "#2563eb",
            "box": "PQC Level 3\n(KEM-768+DSA-65)\n(7533 B, 0.230 ms)",
            "xytext": (-45, 35),
            "ha": "right",
            "va": "bottom"
        },
        {
            "bytes": 10355,
            "time": 0.3039,
            "name": "PQC Level 5",
            "marker": "D",
            "color": "#1d4ed8",
            "box": "PQC Level 5\n(KEM-1024+DSA-87)\n(10355 B, 0.304 ms)",
            "xytext": (25, 15),
            "ha": "left",
            "va": "bottom"
        }
    ]

    sorted_pts = sorted(points, key=lambda p: p["bytes"])
    x_vals = [p["bytes"] for p in sorted_pts]
    y_vals = [p["time"] for p in sorted_pts]

    # Dashed trajectory line
    ax.plot(x_vals, y_vals, linestyle="--", color="#94a3b8", linewidth=1.5, zorder=1)

    for p in points:
        ax.scatter(p["bytes"], p["time"], marker=p["marker"], s=130, color=p["color"],
                   edgecolor="black", linewidth=1.0, zorder=3)
        ax.annotate(
            p["box"],
            xy=(p["bytes"], p["time"]),
            xytext=p["xytext"],
            textcoords="offset points",
            ha=p["ha"],
            va=p["va"],
            fontsize=8.5,
            fontweight="normal",
            bbox=dict(boxstyle="round,pad=0.4", fc="white", ec="#cbd5e1", alpha=0.95, lw=1.0),
            arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=0.1", color="#64748b", lw=0.8)
        )

    ax.set_xscale("log")
    ax.set_xlim(50, 35000)
    ax.set_ylim(0.0, 0.44)

    ax.set_xlabel("Total Public Key & Ciphertext/Signature Overhead (Bytes, log scale)", fontsize=10.5)
    ax.set_ylabel("Total Combined Computation Time (ms)", fontsize=10.5)
    ax.set_title("Parameter-Set Trade-Off: Overhead Bytes vs Computation Time (Experiment E2)", fontsize=11, fontweight="bold", pad=12)

    ax.grid(True, which="both", linestyle=":", alpha=0.4)
    plt.tight_layout()

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(OUT_PATH, dpi=300, bbox_inches="tight")
    plt.close()
    print(f"Generated tradeoff plot at: {OUT_PATH}")

if __name__ == "__main__":
    generate_tradeoff_plot()
