"""
Script to update both:
1. Parameter_Set_Sensitivity_E2.docx (standalone 1-page document in ms units)
2. PQ_KMS_Report_Chapters_6_to_9.docx (master report document in ms units)
"""
from __future__ import annotations

import os
import sys
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

BASE_DIR = Path("/home/sambit/code/kms")
OUTPUT_STANDALONE_DOCX = BASE_DIR / "Parameter_Set_Sensitivity_E2.docx"
FIG_PATH = BASE_DIR / "results" / "figures" / "fig_parameter_tradeoff_e2.png"

def set_cell_background(cell, fill_hex="D9E1F2"):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_compact_cell_margins(cell, top=40, bottom=40, left=50, right=50):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="B0C4DE", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_standalone():
    doc = docx.Document()
    
    # A4 Page Margins
    s = doc.sections[0]
    s.page_width = Inches(8.27)
    s.page_height = Inches(11.69)
    s.top_margin = Inches(0.8)
    s.bottom_margin = Inches(0.8)
    s.left_margin = Inches(0.9)
    s.right_margin = Inches(0.9)

    # 1. Section Heading
    p_head = doc.add_paragraph()
    p_head.paragraph_format.space_before = Pt(6)
    p_head.paragraph_format.space_after = Pt(4)
    p_head.paragraph_format.keep_with_next = True
    r_head = p_head.add_run("8.10 Parameter-Set Sensitivity and Security Trade-offs (Experiment E2)")
    r_head.font.name = "Times New Roman"
    r_head.font.size = Pt(14)
    r_head.font.bold = True
    r_head.font.color.rgb = RGBColor(0, 0, 0)

    # 2. Introductory Text
    p_intro = doc.add_paragraph()
    p_intro.paragraph_format.space_before = Pt(0)
    p_intro.paragraph_format.space_after = Pt(4)
    p_intro.paragraph_format.line_spacing = 1.15
    p_intro.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_intro = p_intro.add_run(
        "Figure 24 and Table 23 analyze performance sensitivity across NIST Security Categories 1, 3, "
        "and 5 for ML-KEM and Categories 2, 3, and 5 for ML-DSA."
    )
    r_intro.font.name = "Times New Roman"
    r_intro.font.size = Pt(12)
    r_intro.font.color.rgb = RGBColor(0, 0, 0)

    # 3. Figure 24 Image (scaled to fit single page)
    p_img = doc.add_paragraph()
    p_img.paragraph_format.space_before = Pt(2)
    p_img.paragraph_format.space_after = Pt(2)
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(str(FIG_PATH), width=Inches(5.4))

    # 4. Figure Caption
    p_fcap = doc.add_paragraph()
    p_fcap.paragraph_format.space_before = Pt(2)
    p_fcap.paragraph_format.space_after = Pt(8)
    p_fcap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_flbl = p_fcap.add_run("Figure 24: ")
    r_flbl.font.name = "Times New Roman"
    r_flbl.font.size = Pt(10.5)
    r_flbl.font.bold = True
    r_fdesc = p_fcap.add_run("Security category versus execution latency and artifact size trade-offs across ML-KEM and ML-DSA parameter sets.")
    r_fdesc.font.name = "Times New Roman"
    r_fdesc.font.size = Pt(10.5)

    # 5. Table Caption
    p_tcap = doc.add_paragraph()
    p_tcap.paragraph_format.space_before = Pt(6)
    p_tcap.paragraph_format.space_after = Pt(3)
    p_tcap.paragraph_format.keep_with_next = True
    p_tcap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tlbl = p_tcap.add_run("Table 23: ")
    r_tlbl.font.name = "Times New Roman"
    r_tlbl.font.size = Pt(10.5)
    r_tlbl.font.bold = True
    r_tdesc = p_tcap.add_run("Post-quantum parameter sets sensitivity and artifact sizes (Experiment E2).")
    r_tdesc.font.name = "Times New Roman"
    r_tdesc.font.size = Pt(10.5)

    # 6. Table 23 with exact ms units
    headers = [
        "Algorithm", "Security Level", "Keygen (ms)", "Encaps / Sign (ms)",
        "Decaps / Verify (ms)", "Public Key (B)", "CT / Sig (B)", "Total Size (B)"
    ]
    
    t23_data = [
        ["ML-KEM-512", "Level 1", "0.010", "0.011", "0.010", "800", "768", "1568"],
        ["ML-KEM-768", "Level 3", "0.015", "0.016", "0.015", "1184", "1088", "2272"],
        ["ML-KEM-1024", "Level 5", "0.018", "0.020", "0.020", "1568", "1568", "3136"],
        ["ML-DSA-44", "Level 2", "0.025", "0.066", "0.028", "1312", "2420", "3732"],
        ["ML-DSA-65", "Level 3", "0.039", "0.101", "0.043", "1952", "3309", "5261"],
        ["ML-DSA-87", "Level 5", "0.062", "0.124", "0.061", "2592", "4627", "7219"]
    ]

    table = doc.add_table(rows=len(t23_data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)

    col_widths = [1.15, 0.9, 0.75, 0.85, 0.85, 0.75, 0.75, 0.85]

    for i, h_text in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h_text
        set_cell_background(cell, "D9E1F2")
        set_compact_cell_margins(cell, top=40, bottom=40, left=40, right=40)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.0
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5)
            run.font.bold = True

    for r_idx, row_data in enumerate(t23_data):
        row_cells = table.rows[r_idx + 1].cells
        for c_idx, val in enumerate(row_data):
            cell = row_cells[c_idx]
            cell.text = val
            set_compact_cell_margins(cell, top=30, bottom=30, left=40, right=40)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.0
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(9.5)

    for row in table.rows:
        for i, w in enumerate(col_widths):
            row.cells[i].width = Inches(w)

    # 7. Concluding Text with ms units
    p_concl = doc.add_paragraph()
    p_concl.paragraph_format.space_before = Pt(5)
    p_concl.paragraph_format.space_after = Pt(0)
    p_concl.paragraph_format.line_spacing = 1.15
    p_concl.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    
    r_concl = p_concl.add_run(
        "For extremely memory-constrained microcontrollers (e.g. 8-bit or 16-bit biochip nodes with < 32 KB RAM), "
        "ML-KEM-512 and ML-DSA-44 provide a 29.1% reduction in total communication artifact size (3,732 B vs 5,261 B for signatures; "
        "1,568 B vs 2,272 B for KEM) with negligible loss of security margin. For clinical hospital gateways and networked edge servers, "
        "ML-KEM-768 and ML-DSA-65 represent the optimal balance of NIST Category 3 quantum security, low encapsulation latency (0.016 ms), "
        "and lightning-fast verification (0.043 ms)."
    )
    r_concl.font.name = "Times New Roman"
    r_concl.font.size = Pt(11)
    r_concl.font.color.rgb = RGBColor(0, 0, 0)

    doc.save(str(OUTPUT_STANDALONE_DOCX))
    print(f"[Success] Standalone document generated at: {OUTPUT_STANDALONE_DOCX}")

if __name__ == "__main__":
    build_standalone()
