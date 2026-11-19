#!/usr/bin/env python3
"""
PQ-KMS: 2-Page Executive User Interface Report Builder
Generates a concise, strictly 2-page DOCX report featuring the most important
sections of the PQ-KMS user interface with proper figure numbering, captions,
and exact typographic hierarchy.

Formatting Specifications:
- Document Length: Strictly 2 Pages
- Content: Only Figures and Captions (with Heading and Sub-Heading)
- Font Style: Times New Roman (100% strictly enforced across all elements)
- Font Sizes:
    * Headings: 16 pt Bold
    * Sub-Headings: 14 pt Bold
    * Text & Captions: 12 pt (Bold figure number, Italic caption text)
- Figure Numbering: Figure 1 through Figure 6
- Screenshots: High-resolution captures from the latest UI build with subtle borders
"""

import subprocess
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from PIL import Image, ImageOps

BASE_DIR = Path("/home/sambit/code/kms")
OUTPUT_DOCX = BASE_DIR / "PQ_KMS_UI_Report.docx"
OUTPUT_PDF = BASE_DIR / "PQ_KMS_UI_Report.pdf"
SCREENSHOTS_DIR = BASE_DIR / "report_assets" / "screenshots"
FRAMED_DIR = BASE_DIR / "report_assets" / "screenshots_framed"

def build_report():
    print(f"[*] Preparing framed screenshots in {FRAMED_DIR}...")
    FRAMED_DIR.mkdir(parents=True, exist_ok=True)
    
    # Add subtle framing border (0.5 pt equivalent) so white UI cards render crisply on document pages
    for img_path in SCREENSHOTS_DIR.glob("*.png"):
        im = Image.open(img_path)
        im_bordered = ImageOps.expand(im, border=3, fill="#CBD5E1")
        im_bordered.save(FRAMED_DIR / img_path.name)

    print(f"[*] Initialising 2-page Word document...")
    doc = docx.Document()

    # Precise page layout: Letter paper (8.5 x 11.0 in) with balanced 0.35 in vertical margins
    section = doc.sections[0]
    section.top_margin = Inches(0.35)
    section.bottom_margin = Inches(0.35)
    section.left_margin = Inches(0.5)
    section.right_margin = Inches(0.5)
    section.page_width = Inches(8.5)
    section.page_height = Inches(11.0)

    # Base style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)

    # ─── PAGE 1: Executive Operations & Fleet Governance ──────────────────────
    # Heading 1: 16 pt Bold
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    r_title = p_title.add_run("PQ-KMS: Cyber-Physical Security & Telemetry Console")
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(16)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0x00, 0x20, 0x60)

    page_1_figures = [
        (
            "02_dashboard_overview.png",
            "Executive SOC Security Dashboard: Real-time biochip fleet health, active post-quantum sessions, and live audit stream."
        ),
        (
            "03_device_management.png",
            "Edge Biochip Fleet Registry: Hardware node inventory with cryptographic authorization filters and public key thumbprints."
        ),
        (
            "05_session_governance.png",
            "NIST SP 800-57 Key Lifecycle Governance: Active session monitor with live cryptoperiod countdowns and message quotas."
        ),
    ]

    for idx, (filename, caption_text) in enumerate(page_1_figures, start=1):
        # Image
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(1)
        p_img.paragraph_format.line_spacing = 1.0
        r_img = p_img.add_run()
        r_img.add_picture(str(FRAMED_DIR / filename), width=Inches(4.25))

        # Caption (12 pt)
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(1)
        p_cap.paragraph_format.space_after = Pt(2)
        p_cap.paragraph_format.line_spacing = 1.0

        r_num = p_cap.add_run(f"Figure {idx}: ")
        r_num.font.name = "Times New Roman"
        r_num.font.size = Pt(12)
        r_num.font.bold = True

        r_txt = p_cap.add_run(caption_text)
        r_txt.font.name = "Times New Roman"
        r_txt.font.size = Pt(12)
        r_txt.font.italic = True

    # Hard page break to guarantee Page 2 boundary
    doc.add_page_break()

    # ─── PAGE 2: Clinical Diagnostics, Digital Twin & Audit ───────────────────
    # Sub-Heading: 14 pt Bold
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2)
    r_sub = p_sub.add_run("Point-of-Care Diagnostics, Biochip Twin Simulation & Forensic Governance")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(14)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)

    page_2_figures = [
        (
            "07_doctor_portal_telemetry.png",
            "Clinician Diagnostics Portal: Point-of-care patient physiological telemetry with real-time clinical risk stratification."
        ),
        (
            "09_dmfb_twin_simulation.png",
            "Cyber-Physical 2D DMFB Digital Twin: 8×8 EWOD microfluidic droplet routing and optical absorbance sensor simulation."
        ),
        (
            "10_audit_ledger.png",
            "Forensic Audit Ledger: Append-only SHA-256 recursive hash-chained compliance audit trail with 100% verified integrity."
        ),
    ]

    for idx, (filename, caption_text) in enumerate(page_2_figures, start=4):
        # Image
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(1)
        p_img.paragraph_format.space_after = Pt(1)
        p_img.paragraph_format.line_spacing = 1.0
        r_img = p_img.add_run()
        r_img.add_picture(str(FRAMED_DIR / filename), width=Inches(4.25))

        # Caption (12 pt)
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(1)
        p_cap.paragraph_format.space_after = Pt(2)
        p_cap.paragraph_format.line_spacing = 1.0

        r_num = p_cap.add_run(f"Figure {idx}: ")
        r_num.font.name = "Times New Roman"
        r_num.font.size = Pt(12)
        r_num.font.bold = True

        r_txt = p_cap.add_run(caption_text)
        r_txt.font.name = "Times New Roman"
        r_txt.font.size = Pt(12)
        r_txt.font.italic = True

    # Save DOCX
    doc.save(str(OUTPUT_DOCX))
    print(f"[✓] DOCX report saved: {OUTPUT_DOCX}")

    # Convert to companion PDF and verify exact page count
    print(f"[*] Converting to PDF via LibreOffice...")
    subprocess.run(
        ["libreoffice", "--headless", "--convert-to", "pdf", str(OUTPUT_DOCX), "--outdir", str(BASE_DIR)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    pdf_info = subprocess.check_output(f"pdfinfo {OUTPUT_PDF} | grep Pages", shell=True).decode().strip()
    print(f"[✓] PDF generated: {OUTPUT_PDF} ({pdf_info})")

if __name__ == "__main__":
    build_report()
