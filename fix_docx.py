"""
Rebuild the PQ-KMS report docx with:
  1. New Figure 19 (image21.png) — wire overhead with KiB labels
  2. New Figure 21 (image23.png) — parameter sensitivity (E2)
  3. New Figure 22 (image24.png) — bandwidth amortization (corrected model)
  4. Section 8.6 text: KB → KiB (remove "(1 KB = 1,024 bytes)")
  5. Section 8.9 text: replace with absolute E2 numbers

Images are resized to match the original slot dimensions (LANCZOS resampling).
All other ZIP entries are copied byte-for-byte.

Output: /home/sambit/code/kms/PQ_KMS_Project_Report_Final_FIXED.docx
"""
from __future__ import annotations

import io
import re
import sys
import zipfile
from pathlib import Path

from PIL import Image

# ── Paths ────────────────────────────────────────────────────────────────────
ORIG_DOCX = Path(
    "/home/sambit/.gemini/antigravity/brain/4300eca9-d7f1-4c90-a8b4-06bb4b3f0386"
    "/.user_uploaded/media_1794758816216_8afead27.docx"
)
FIGURES_DIR = Path("/home/sambit/code/kms/results/figures")
OUT_DOCX = Path("/home/sambit/code/kms/PQ_KMS_Project_Report_Final_FIXED.docx")

# New figure sources and their target slot dimensions (W × H in pixels)
FIGURE_REPLACEMENTS = {
    "word/media/image21.png": {
        "new_file": FIGURES_DIR / "fig19_new.png",
        "target_size": (1648, 1025),
        "mode": "RGB",
    },
    "word/media/image23.png": {
        "new_file": FIGURES_DIR / "fig21_new.png",
        "target_size": (4170, 1545),
        "mode": "RGBA",
    },
    "word/media/image24.png": {
        "new_file": FIGURES_DIR / "fig22_new.png",
        "target_size": (4064, 1618),
        "mode": "RGBA",
    },
}

# ── New paragraph texts ───────────────────────────────────────────────────────

# Section 8.9 replacement (old "Taking Category 1..." paragraph)
OLD_89_TEXT = (
    "Taking Category 1 (ML-KEM-512 + ML-DSA-44) as the reference, with a combined "
    "public-key footprint of about 2.1 kB, Category 3 (ML-KEM-768 + ML-DSA-65), the "
    "selected design default, needs roughly 1.5 times the key generation time for both "
    "ML-KEM and ML-DSA, with a footprint of about 3.1 kB. Category 5 (ML-KEM-1024 + "
    "ML-DSA-87) needs roughly 1.8 times (ML-KEM) and 3.4 times (ML-DSA) the Category 1 "
    "time, with about 4.2 kB. The absolute ML-KEM-768 key generation time is the E1 "
    "value of 0.106 \u00b1 0.015 ms reported in Section 8.3; the E2 run is used here only "
    "to compare the parameter sets with one another. Category 3 offers a reasonable "
    "balance between security category and cost, with a modest latency increase over "
    "Category 1."
)

NEW_89_TEXT = (
    "Key generation for Category 1 (ML-KEM-512 + ML-DSA-44) measures 0.033 \u00b1 0.004 ms "
    "and 0.168 \u00b1 0.065 ms respectively, with a combined public-key footprint of about "
    "2.1 kB. Category 3 (ML-KEM-768 + ML-DSA-65), the selected design default, requires "
    "0.098 \u00b1 0.032 ms and 0.075 \u00b1 0.005 ms respectively, with a footprint of about "
    "3.1 kB. Category 5 (ML-KEM-1024 + ML-DSA-87) requires 0.099 \u00b1 0.041 ms and "
    "0.203 \u00b1 0.022 ms, with about 4.2 kB. Category 3 offers a reasonable balance "
    "between security category and cost, with a modest latency increase over Category 1."
)

# Section 8.6: old and new traffic-size sentence fragments
OLD_86_FRAGMENT = (
    "12.1 KB, 13.3 KB and 25.3 KB (1 KB = 1,024 bytes) for the post-quantum path with "
    "128 B, 1 KiB and 10 KiB payloads, against 0.8 KB, 2.0 KB and 14.0 KB for the "
    "classical path"
)
NEW_86_FRAGMENT = (
    "12.1 KiB, 13.3 KiB and 25.3 KiB for the post-quantum path with 128 B, 1 KiB and "
    "10 KiB payloads, against 0.8 KiB, 2.0 KiB and 14.0 KiB for the classical path"
)


def resize_image(src_path: Path, target_size: tuple[int, int], mode: str) -> bytes:
    """Open src, resize to target_size (W×H) using LANCZOS, return PNG bytes in correct mode."""
    img = Image.open(src_path)
    if img.mode != mode:
        img = img.convert(mode)
    if img.size != target_size:
        print(f"  Resizing {src_path.name}: {img.size} → {target_size}")
        img = img.resize(target_size, Image.LANCZOS)
    else:
        print(f"  Size already matches {target_size}")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def patch_xml(xml: str) -> str:
    """Apply all text substitutions to document.xml content."""
    # ── Change A: Section 8.6 KB → KiB ─────────────────────────────────────
    if OLD_86_FRAGMENT in xml:
        xml = xml.replace(OLD_86_FRAGMENT, NEW_86_FRAGMENT)
        print("  [XML] Section 8.6: KB → KiB change applied ✓")
    else:
        print("  [XML] WARNING: Section 8.6 target text NOT found verbatim — trying partial")
        # Fallback: individual replacements
        xml = xml.replace(
            "12.1 KB, 13.3 KB and 25.3 KB (1 KB = 1,024 bytes)",
            "12.1 KiB, 13.3 KiB and 25.3 KiB",
        )
        xml = xml.replace("0.8 KB, 2.0 KB and 14.0 KB", "0.8 KiB, 2.0 KiB and 14.0 KiB")

    # ── Change B: Section 8.9 paragraph ─────────────────────────────────────
    if OLD_89_TEXT in xml:
        xml = xml.replace(OLD_89_TEXT, NEW_89_TEXT)
        print("  [XML] Section 8.9: paragraph replaced ✓")
    else:
        print("  [XML] WARNING: Section 8.9 target text NOT found verbatim")
        # Try to find it with the ± encoded differently
        alt_old = OLD_89_TEXT.replace("\u00b1", "&#xB1;")
        if alt_old in xml:
            xml = xml.replace(alt_old, NEW_89_TEXT)
            print("  [XML] Section 8.9: paragraph replaced (alt encoding) ✓")
        else:
            # Try a broader regex approach
            pattern = re.compile(
                r"Taking Category 1 \(ML-KEM-512.*?modest latency increase over Category 1\.",
                re.DOTALL,
            )
            m = pattern.search(xml)
            if m:
                xml = xml[:m.start()] + NEW_89_TEXT + xml[m.end():]
                print("  [XML] Section 8.9: paragraph replaced (regex) ✓")
            else:
                print("  [XML] ERROR: Could not find Section 8.9 paragraph")

    return xml


def main():
    print(f"[DocxFix] Reading {ORIG_DOCX.name} ...")

    with zipfile.ZipFile(ORIG_DOCX, "r") as zin, \
         zipfile.ZipFile(OUT_DOCX, "w", compression=zipfile.ZIP_DEFLATED) as zout:

        for item in zin.infolist():
            name = item.filename

            if name == "word/document.xml":
                print(f"  Patching {name} ...")
                raw_xml = zin.read(name).decode("utf-8")
                patched_xml = patch_xml(raw_xml)
                zout.writestr(item, patched_xml.encode("utf-8"))

            elif name in FIGURE_REPLACEMENTS:
                spec = FIGURE_REPLACEMENTS[name]
                print(f"  Replacing {name} with {spec['new_file'].name} ...")
                new_png_bytes = resize_image(
                    spec["new_file"], spec["target_size"], spec["mode"]
                )
                zout.writestr(item, new_png_bytes)

            else:
                # Copy byte-for-byte
                zout.writestr(item, zin.read(name))

    print(f"\n[DocxFix] Output → {OUT_DOCX}")
    print(f"  File size: {OUT_DOCX.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
