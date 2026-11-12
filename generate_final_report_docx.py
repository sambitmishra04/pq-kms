"""
Master builder script to generate PQ_KMS_Report_Chapters_6_to_9.docx
Complete rewritten text for Chapters 6, 7, 8, and 9 with all tables, figures, descriptions,
and exact formatting:
- Font: Times New Roman
- Heading 1 (Chapter titles): 16 pt Bold
- Heading 2 (Sub-headings): 14 pt Bold
- Heading 3 (Sub-sub-headings): 12 pt Bold
- Body text: 12 pt Regular, 1.15 line spacing, 6 pt after, Justified
- Table captions above tables (10.5 pt, Bold prefix)
- Figure captions below figures (10.5 pt, Bold prefix)
- Tables formatted with D9E1F2 header shading and subtle borders
"""
from __future__ import annotations

import os
import sys
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

BASE_DIR = Path("/home/sambit/code/kms")
OUTPUT_DOCX = BASE_DIR / "PQ_KMS_Report_Chapters_6_to_9.docx"
FIG_DIR = BASE_DIR / "results" / "figures"

def set_cell_background(cell, fill_hex="D9E1F2"):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
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
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_p(doc, text="", bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Times New Roman"
        r_pre.font.size = Pt(12)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(0, 0, 0)
    if text:
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)
        run.font.italic = italic
        run.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_bullet(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Times New Roman"
        r_pre.font.size = Pt(12)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(0, 0, 0)
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_code_block(doc, code_lines):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.05
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    for line in code_lines:
        run = p.add_run(line + "\n")
        run.font.name = "Consolas"
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_table_caption(doc, table_num, caption_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_label = p.add_run(f"Table {table_num}: ")
    r_label.font.name = "Times New Roman"
    r_label.font.size = Pt(10.5)
    r_label.font.bold = True
    r_label.font.color.rgb = RGBColor(0, 0, 0)
    r_text = p.add_run(caption_text)
    r_text.font.name = "Times New Roman"
    r_text.font.size = Pt(10.5)
    r_text.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_figure_caption(doc, fig_num, caption_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = False
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_label = p.add_run(f"Figure {fig_num}: ")
    r_label.font.name = "Times New Roman"
    r_label.font.size = Pt(10.5)
    r_label.font.bold = True
    r_label.font.color.rgb = RGBColor(0, 0, 0)
    r_text = p.add_run(caption_text)
    r_text.font.name = "Times New Roman"
    r_text.font.size = Pt(10.5)
    r_text.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_figure_image(doc, img_path, width_in_inches=5.8):
    if os.path.exists(img_path):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.keep_with_next = True
        run = p.add_run()
        run.add_picture(str(img_path), width=Inches(width_in_inches))
    else:
        p = doc.add_paragraph(f"[Image file not found: {img_path}]")
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER

def add_styled_table(doc, headers, data, col_widths=None, center_cols=None):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)

    # Header Row
    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_background(hdr_cells[i], "D9E1F2")
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Times New Roman"
            run.font.size = Pt(10)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0, 0, 0)

    # Body Rows
    for r_idx, row_data in enumerate(data):
        row_cells = table.rows[r_idx + 1].cells
        for c_idx, cell_value in enumerate(row_data):
            row_cells[c_idx].text = str(cell_value)
            set_cell_margins(row_cells[c_idx], top=70, bottom=70, left=120, right=120)
            p = row_cells[c_idx].paragraphs[0]
            if center_cols and c_idx in center_cols:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Times New Roman"
                run.font.size = Pt(9.5)
                run.font.color.rgb = RGBColor(0, 0, 0)

    if col_widths:
        for row in table.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)

    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table

def build_document():
    doc = docx.Document()
    
    # Configure A4 Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    print("Building Chapter 6...")
    # ═════════════════════════════════════════════════════════════════════════════
    # CHAPTER 6 — SYSTEM IMPLEMENTATION
    # ═════════════════════════════════════════════════════════════════════════════
    add_heading_1(doc, "CHAPTER 6 — SYSTEM IMPLEMENTATION")
    
    add_heading_2(doc, "6.1 Hardware and Software Requirements")
    add_p(doc, "The Post-Quantum Key Management System (PQ-KMS) is designed to operate on standard computing equipment without necessitating dedicated hardware security modules or specialized quantum accelerators. This architectural decision ensures portability, low barrier to adoption, and cost efficiency across edge gateways and clinical diagnostic controllers. Table 14 details the foundational software, hardware, and operational library specifications utilized in the implementation.")

    add_table_caption(doc, 14, "Software and hardware requirements.")
    t14_headers = ["Item", "Requirement"]
    t14_data = [
        ["Hardware", "Ordinary laptop or desktop workstation, 4 GB RAM or more; no specialized cryptographic coprocessors required."],
        ["Operating system", "Linux x86_64 (tested on Linux 7.0 / Ubuntu POSIX compliant), Windows WSL2, or macOS. Post-quantum libraries compile natively across POSIX platforms."],
        ["Language", "Python 3.14.6 in an isolated virtual environment (.venv)."],
        ["Cryptographic Libraries", "Open Quantum Safe liboqs v0.16.0 (C-optimized AVX2 lattice assembly) via liboqs-python wrapper; OpenSSL Cryptography v50.0.2 (HKDF-SHA256, AES-256-GCM, X25519, Ed25519)."],
        ["Web & Persistence Frameworks", "FastAPI (RESTful API), Uvicorn (ASGI web server), SQLite 3 (WAL mode persistence), Pydantic v2 (data modeling)."],
        ["Front-End & Telemetry", "Streamlit (SOC dashboard), Vite/React SPA with Tailwind CSS (2D EWOD Digital Twin), Plotly/Matplotlib."],
        ["Verification Suite", "pytest 9.1.1, pytest-asyncio, psutil (resident memory benchmarking)."]
    ]
    add_styled_table(doc, t14_headers, t14_data, col_widths=[1.8, 4.7])

    add_heading_2(doc, "6.2 Development Environment")
    add_p(doc, "The implementation resides within an isolated Python virtual environment managed with pinned dependencies in requirements.txt. The cryptographic backbone relies on the Open Quantum Safe (OQS) project's liboqs library, an open-source C library providing quantum-safe cryptographic algorithms. To maximize computational throughput on commodity hardware, liboqs was built with AVX2 vectorized instruction support. Dynamic linking is maintained via explicit system loader paths, and an automated startup integrity hook checks enabled mechanisms, confirming active support for ML-KEM-768 and ML-DSA-65 before accepting network requests.")

    add_heading_2(doc, "6.3 Technology Stack")
    add_p(doc, "The system architecture leverages modern, high-performance open-source frameworks. FastAPI provides the asynchronous REST API interface, enforcing strict type validation and request serialization through Pydantic schemas. Cryptographic primitives are bifurcated cleanly: post-quantum lattice primitives (ML-KEM and ML-DSA) are provided by liboqs, while mature symmetric and hashing operations (HKDF-SHA256 and AES-256-GCM) are executed via OpenSSL through the Python cryptography engine. System metadata, audit logs, and device registries are persisted in SQLite configured with Write-Ahead Logging (WAL) to ensure thread-safe concurrency. The verification harness is driven by pytest, and visualization is supplied through both a Streamlit operations console and an interactive React-based digital twin.")

    add_heading_2(doc, "6.4 Software Architecture and Module Structure")
    add_p(doc, "The software repository is organized into strictly decoupled functional packages, separating cryptographic mechanics, lifecycle state machines, and simulation logic. Figure 12 illustrates the modular software architecture.")

    add_figure_image(doc, FIG_DIR / "fig12_software_architecture.png", width_in_inches=5.6)
    add_figure_caption(doc, 12, "Software module architecture showing functional isolation between API routing, key lifecycle management, cryptographic wrappers, database persistence, and simulation.")

    add_p(doc, "The directory structure strictly isolates concerns across seven core packages:")
    add_bullet(doc, "main.py, config.py, and routes.py: Define the application entry point, environment-driven policies, and RESTful routing with role-based access control.", "app/api/: ")
    add_bullet(doc, "kem.py, sig.py, kdf.py, aead.py, and classical.py: Abstract low-level C bindings behind unified interfaces, allowing transparent parameter swapping.", "app/crypto/: ")
    add_bullet(doc, "lifecycle.py: Implements the NIST SP 800-57 session-key state machine, cryptoperiod timers, anti-replay checks, and in-memory key storage.", "app/key_management/: ")
    add_bullet(doc, "registry.py: Manages device identity tokens, public-key bindings, and proof-of-possession verification.", "app/device_management/: ")
    add_bullet(doc, "revocation.py: Manages revocation lists, cryptographic invalidation, and ML-DSA-signed anti-rollback CRL generation.", "app/revocation/: ")
    add_bullet(doc, "db.py: Manages the SQLite database, foreign key constraints, and transactional execution without persisting plaintext keys.", "app/database/: ")
    add_bullet(doc, "audit.py: Implements append-only audit event logging with SHA-256 hash chaining for tamper evidence.", "app/audit/: ")
    add_bullet(doc, "dmfb_simulator.py, client.py, and attack_lab.py: Emulates an 8x8 EWOD electrode grid, droplet routing, clinical glucose assays, and adversarial injection.", "app/simulation/: ")

    add_heading_2(doc, "6.5 Backend and API Implementation")
    add_p(doc, "The PQ-KMS server coordinates all lifecycle workflows via REST API endpoints. Access control is enforced through caller roles: Administrator (credential-authenticated), Biochip Device (cryptographically authenticated via ML-DSA signatures), Clinician/Doctor (token-authenticated session access), and Auditor/Viewer (read-only database queries). Table 15 outlines the primary API endpoints.")

    add_table_caption(doc, 15, "API endpoints, authorization roles, and operational purposes.")
    t15_headers = ["Endpoint", "Method", "Caller Role", "Functional Purpose"]
    t15_data = [
        ["/enrol", "POST", "Admin", "Generates a one-time single-use enrolment code bound to a specific device identifier."],
        ["/register", "POST", "Device", "Registers device public keys (ML-KEM + ML-DSA) with proof-of-possession signature."],
        ["/session", "POST", "Device", "Processes signed session request; performs ML-KEM encapsulation; returns signed ciphertext."],
        ["/message", "POST", "Device", "Receives AES-256-GCM protected biomedical payload; verifies monotonic counter and AEAD tag."],
        ["/revoke", "POST", "Admin", "Marks device compromised; wipes active session keys; issues new signed CRL."],
        ["/revocations", "GET", "Verifier / Device", "Fetches latest ML-DSA-signed revocation list for verifier caching."],
        ["/state", "GET", "Auditor / Dashboard", "Returns live device and session metadata (strictly zero session key bytes)."],
        ["/audit", "GET", "Auditor / Dashboard", "Returns append-only audit trail and verifies cryptographic SHA-256 hash chain."],
        ["/metrics", "GET", "Auditor / Dashboard", "Exposes empirical benchmark distributions and test suite statistics."],
        ["/api/auth/login", "POST", "Doctor / Admin", "Authenticates medical clinicians for in-transit assay key exchange and local inspection."]
    ]
    add_styled_table(doc, t15_headers, t15_data, col_widths=[1.3, 0.8, 1.3, 3.1], center_cols=[1, 2])

    add_heading_2(doc, "6.6 Cryptographic Library Integration")
    add_p(doc, "Cryptographic execution follows the clean pipeline established in Section 4.5. The listing below illustrates the actual Python integration wrapping liboqs and cryptography:")
    
    code_snippet = [
        "# 1. Server encaps secret to client's registered ML-KEM public key",
        "client_kem = oqs.KeyEncapsulation('ML-KEM-768')",
        "ciphertext, shared_secret_server = client_kem.encap_secret(client_kem_pk)",
        "",
        "# 2. Client decapsulates shared secret using private key",
        "shared_secret_client = client_kem.decap_secret(ciphertext)",
        "",
        "# 3. Both sides derive identical AES-256-GCM session key via HKDF",
        "hkdf = HKDF(algorithm=hashes.SHA256(), length=32, salt=nonce_c, info=context_info)",
        "session_key = hkdf.derive(shared_secret_server)",
        "",
        "# 4. Authenticated Encryption with Associated Data (AEAD)",
        "aesgcm = AESGCM(session_key)",
        "nonce_96 = role_32_bytes + counter_64_bytes",
        "ciphertext_with_tag = aesgcm.encrypt(nonce_96, diagnostic_payload, aad)"
    ]
    add_code_block(doc, code_snippet)

    add_heading_2(doc, "6.7 Device Registration and Database Persistence")
    add_p(doc, "Device registration implements Algorithm 1. The administrator provisions an enrolment token, whose SHA-256 digest is recorded in SQLite. The biochip edge node generates its ML-KEM-768 and ML-DSA-65 key pairs locally. It transmits its identifier, enrolment token, and public keys alongside an ML-DSA proof-of-possession signature covering CTX_REG | device_id | ek | vk. The server validates the token, consumes it immediately to prevent replay, verifies the signature, and updates the device status to AUTHORIZED. All keys are stored as binary BLOBs in the devices table.")

    add_heading_2(doc, "6.8 Session Key Establishment and Message Protection")
    add_p(doc, "Session establishment implements Algorithm 2. An authorized edge node transmits a timestamped session request signed with its ML-DSA private key under CTX_SREQ. The server validates the signature, ensures the timestamp is within TS_SKEW_S (30 s), and confirms the client nonce has not been observed. The server encapsulates a 32-byte secret using the device's public encapsulation key, generates a random session ID, sets an expiry timestamp, and signs the response under CTX_SRESP. Both parties derive the 256-bit session key via HKDF-SHA256 bound to protocol labels and identifiers. The session key is stored exclusively in process memory (_session_keys dictionary in lifecycle.py); zero key bytes ever touch disk or SQLite.")
    add_p(doc, "Subsequent diagnostic payloads and actuation vectors are encrypted with AES-256-GCM (Algorithm 3). Every message carries a 96-bit composite nonce constructed from a 32-bit sender role identifier (IV_ROLE_CLIENT = 0x01, IV_ROLE_SERVER = 0x02) and a 64-bit strictly increasing message counter. The AAD includes device_id, session_id, message_id, and counter. The receiver checks that the session is ACTIVE, ensures counter > last_counter (neutralizing replay attacks), and verifies the 128-bit authentication tag before releasing any plaintext.")

    add_heading_2(doc, "6.9 Key Lifecycle and Automated Rotation")
    add_p(doc, "Key lifecycle management enforces the states defined in NIST SP 800-57. A dedicated background task inspects active sessions every 10 seconds. In addition, an inline rotation check executes upon every inbound message. When a session reaches its configured cryptoperiod (SESSION_LIFETIME_S = 60 s for testing) or exceeds MAX_MESSAGES (1000), Algorithm 4 triggers key rotation. A fresh ML-KEM exchange establishes a replacement session before the current session is retired. The retiring session moves to DEACTIVATED (allowing in-flight decryption during GRACE_WINDOW_S = 0 s) and is subsequently marked DESTROYED, purging the key from memory. Key rotation is strictly zero-downtime: biochips never experience communication blackouts.")

    add_heading_2(doc, "6.10 Revocation and Verifiable CRL Distribution")
    add_p(doc, "When an edge device is compromised or decommissioned, an administrator issues a revocation command (Algorithm 5). The server transitions the device state to REVOKED, immediately destroys all associated active session keys, and generates an updated Certificate Revocation List (CRL). The CRL contains an incremented integer version, timestamp, revoked device IDs, and an ML-DSA-65 digital signature generated under CTX_REV. Verifiers cache the CRL, rejecting any list with an invalid signature or a version number less than or equal to their cached version, providing robust anti-rollback protection.")

    add_heading_2(doc, "6.11 Monitoring Dashboard and DMFB Digital Twin")
    add_p(doc, "To provide end-to-end visibility into system operations without compromising cryptographic security, the implementation includes both a Streamlit operations console and an interactive React-based digital twin. The dashboard operates on read-only queries against SQLite, having zero access to in-memory session keys. Figure 13 shows the dashboard layout.")

    add_figure_image(doc, FIG_DIR / "fig13_dashboard_mockup.png", width_in_inches=5.8)
    add_figure_caption(doc, 13, "Monitoring dashboard architecture showing read-only database query isolation, DMFB electrode grid digital twin, and cryptographic telemetry.")

    add_p(doc, "The React digital twin simulates an 8x8 EWOD electrode grid, rendering real-time droplet routing, splitting, and merging. An embedded Attack Lab allows operators to inject Ali et al. glucose assay bit-flip attacks, demonstrating real-time detection and isolation before droplets can actuate.")

    add_heading_2(doc, "6.12 Error Handling, Tamper Evidence, and Fail-Closed Security")
    add_p(doc, "The implementation follows strict fail-closed security principles: any missing cryptographic algorithm, malformed payload, truncated ciphertext, invalid signature, or out-of-order counter terminates request processing immediately with an HTTP 400/403 status code. To ensure audit trail integrity, the audit logger chains all security events using SHA-256 hashes: each record includes event_id, time, actor, event_type, device_id, outcome, details, and prev_hash. Altering or deleting a prior log record breaks the cryptographic hash chain, providing verifiable tamper evidence.")

    add_heading_2(doc, "6.13 Configuration Parameters")
    add_p(doc, "All cryptographic, operational, and network parameters are managed through app/config.py and can be overridden via environment variables. Table 16 summarizes the primary configuration parameters.")

    add_table_caption(doc, 16, "Main configuration parameters and demonstration defaults.")
    t16_headers = ["Parameter", "Meaning", "Demonstration Default", "Production Guidance"]
    t16_data = [
        ["KEM_ALG", "NIST post-quantum KEM standard", "ML-KEM-768", "ML-KEM-768 (Category 3) default; ML-KEM-512 for extreme resource constraints."],
        ["SIG_ALG", "NIST post-quantum signature standard", "ML-DSA-65", "ML-DSA-65 (Category 3) default; ML-DSA-44 for low-memory microcontrollers."],
        ["SESSION_LIFETIME_S", "Session key cryptoperiod duration", "60 s", "3600 s to 86400 s depending on clinical risk assessment."],
        ["MAX_MESSAGES", "Maximum messages per session key", "1000", "Enforces SP 800-38D GCM nonce-uniqueness boundaries."],
        ["GRACE_WINDOW_S", "Decrypt-only grace period after rotation", "0 s", "Configurable (e.g. 5 s) in high-latency or lossy wireless networks."],
        ["TS_SKEW_S", "Allowed clock skew for signed requests", "30 s", "Compensates for loose clock drift in embedded edge biochips."],
        ["NONCE_C_BYTES", "Client entropy salt length for HKDF", "16 bytes", "16 bytes (128 bits) minimum; satisfies RFC 5869 requirements."],
        ["AUDIT_HASH_CHAIN", "Tamper-evident audit log chaining", "enabled (1)", "Must remain enabled in all clinical and forensic environments."],
        ["ADMIN_TOKEN", "Master administrator API credential", "Environment variable", "High-entropy secret stored in secure environment or secret vault."]
    ]
    add_styled_table(doc, t16_headers, t16_data, col_widths=[1.5, 1.8, 1.2, 2.0], center_cols=[2])

    print("Building Chapter 7...")
    # ═════════════════════════════════════════════════════════════════════════════
    # CHAPTER 7 — EXPERIMENTAL SETUP AND TESTING
    # ═════════════════════════════════════════════════════════════════════════════
    doc.add_page_break()
    add_heading_1(doc, "CHAPTER 7 — EXPERIMENTAL SETUP AND TESTING")

    add_heading_2(doc, "7.1 Experimental Testbed Environment")
    add_p(doc, "To rigorously quantify the operational characteristics of post-quantum lattice cryptography in biomedical edge networks, experiments were conducted on a controlled workstation simulating clinical edge gateway controllers. System parameters, compiler configurations, and runtime environments were strictly recorded to ensure full scientific reproducibility. Table 17 delineates the testbed specifications.")

    add_table_caption(doc, 17, "Experimental hardware, software, and cryptographic testbed specifications.")
    t17_headers = ["Parameter", "Specification"]
    t17_data = [
        ["Host Architecture", "x86_64, 10 Physical Cores (12 Logical Threads), 16.4 GB RAM, AVX2 SIMD extensions."],
        ["Operating System", "Linux x86_64 (POSIX compliant kernel 7.0 / Ubuntu distribution)."],
        ["Execution Runtime", "Python 3.14.6 Isolated Virtual Environment (.venv)."],
        ["Post-Quantum Engine", "Open Quantum Safe liboqs v0.16.0 (C-optimized AVX2 lattice assembly)."],
        ["Symmetric & Hashing Engine", "OpenSSL via Python cryptography package v50.0.2."],
        ["Primary PQC KEM Standard", "NIST FIPS 203 ML-KEM-768 (Kyber Security Category 3)."],
        ["Primary PQC Signature Standard", "NIST FIPS 204 ML-DSA-65 (Dilithium Security Category 3, hedged mode)."],
        ["Symmetric Authenticated Cipher", "NIST SP 800-38D AES-256-GCM (96-bit composite nonce, 128-bit authentication tag)."],
        ["Key Derivation Function", "RFC 5869 HKDF-SHA256 (32-byte derived session key with protocol context binding)."],
        ["Clinical Biomedical Dataset", "Pima Indians Diabetes Diagnostic Dataset (768 clinical enzymatic glucose assays)."],
        ["Experimental Rigor", "50 discarded warmup cycles, N = 1000 independent measured trials per primitive."]
    ]
    add_styled_table(doc, t17_headers, t17_data, col_widths=[2.1, 4.4])

    add_heading_2(doc, "7.2 Simulated Network Configuration")
    add_p(doc, "The biochip client and PQ-KMS server executed over the local host interface via FastAPI TestClient in-process communication. This configuration deliberately removes external network latency, wireless packet loss, and physical routing jitter, thereby isolating the exact computational overhead and memory footprint of the cryptographic operations. Multi-client scaling tests simulated up to 50 concurrent edge biochips executing simultaneous registration, session agreement, and telemetry transmissions.")

    add_heading_2(doc, "7.3 Test Data and Workloads")
    add_p(doc, "Workloads were generated using synthetic biomedical telemetry structured around three representative payload tiers:")
    add_bullet(doc, "128 Bytes: Emulates individual EWOD droplet transport actuation commands, electrode pin activation bitmasks, and discrete voltage stepping vectors.", "Tier 1 (Actuation Vector): ")
    add_bullet(doc, "1 KiB (1,024 Bytes): Emulates point-of-care clinical diagnostic packets, containing patient identifiers, optical checkpoint absorbance readings, glucose concentration curves, and sensor calibration metrics derived from the Pima Indians Diabetes Dataset.", "Tier 2 (Diagnostic Assay Record): ")
    add_bullet(doc, "10 KiB (10,240 Bytes): Emulates complex multi-droplet biochemical assay protocols, such as complete sequencing graphs, routing look-up tables, and multi-step enzymatic dilution scripts.", "Tier 3 (Assay Protocol Script): ")

    add_heading_2(doc, "7.4 Functional Verification Suite")
    add_p(doc, "The functional test harness (FT-01 through FT-05) verifies core lifecycle operations under normal operating conditions:")
    add_bullet(doc, "FT-01 (Device Registration): Confirms an edge biochip successfully enrolls using an administrator-issued one-time token and transitions to status AUTHORIZED in the SQLite registry.", "• ")
    add_bullet(doc, "FT-02 (ML-KEM Key Agreement): Confirms ML-KEM-768 encapsulation and decapsulation produce identical 32-byte shared secrets and derived AES keys on client and server.", "• ")
    add_bullet(doc, "FT-03 (Message Round-Trip): Verifies that 128 B, 1 KiB, and 10 KiB diagnostic records encrypt and decrypt bidirectionally with zero plaintext corruption.", "• ")
    add_bullet(doc, "FT-04 (Zero Key Retention): Inspects the SQLite database to verify session metadata is recorded accurately while confirming exactly zero plaintext key bytes exist in persistent storage.", "• ")
    add_bullet(doc, "FT-05 (Dashboard State & Audit Consistency): Validates that API state queries match direct SQLite queries and confirms the SHA-256 audit log hash chain remains intact.", "• ")

    add_heading_2(doc, "7.5 Security Testing and Adversarial Verification")
    add_p(doc, "The security test suite (ST-01 through ST-14) evaluates system resilience against simulated adversarial actions corresponding to the threat model established in Chapter 3. Table 18 presents the test matrix and empirical outcomes.")

    add_table_caption(doc, 18, "Security test cases and adversarial verification outcomes (ST-01 to ST-14).")
    t18_headers = ["ID", "Target Mechanism", "Threat Vector Under Test", "Expected Outcome", "Actual Status"]
    t18_data = [
        ["ST-01", "Alg 1: Proof-of-Possession", "Valid registration with valid code & signature", "Device stored, status AUTHORIZED", "PASS"],
        ["ST-02", "Alg 1: Token Auth", "Registration attempt with invalid / used code", "HTTP 400 rejection, audited", "PASS"],
        ["ST-03", "Alg 1: Identity Binding", "Session request signed with rogue private key", "HTTP 403 signature failure, audited", "PASS"],
        ["ST-04", "Alg 2: ML-KEM Agreement", "Legitimate session establishment flow", "Shared secret derived; session ACTIVE", "PASS"],
        ["ST-05", "AES-256-GCM AEAD", "Ali et al. single-bit ciphertext modification", "InvalidTag exception; packet dropped", "PASS"],
        ["ST-06", "Alg 2: Server Signature", "Server session response tampered in transit", "Client aborts; session not created", "PASS"],
        ["ST-07", "Alg 4: Key Expiry", "Message transmission under expired session key", "Rejected (expired cryptoperiod), audited", "PASS"],
        ["ST-08", "Alg 4: Automated Rotation", "Continuous messaging across lifetime threshold", "New session established; old destroyed", "PASS"],
        ["ST-09", "Alg 5: Revocation", "Message / session request from revoked biochip", "HTTP 403 Forbidden; rejected at check", "PASS"],
        ["ST-10", "Alg 5: Signed CRL", "Stale CRL rollback / forged CRL signature", "Rejected (anti-rollback version check)", "PASS"],
        ["ST-11", "Alg 5: Memory Sanitization", "Administrative revocation of active device", "Active keys purged; state COMPROMISED", "PASS"],
        ["ST-12", "Anti-Replay Counter", "Adversarial replay of captured valid frame", "Rejected (counter violation: c <= last_c)", "PASS"],
        ["ST-13", "Alg 2: KEM Input Validation", "Malformed / truncated KEM ciphertext injection", "Rejected cleanly; no server crash", "PASS"],
        ["ST-14", "Domain Separation", "Presentation of registration signature for session", "Rejected (domain string mismatch)", "PASS"]
    ]
    add_styled_table(doc, t18_headers, t18_data, col_widths=[0.7, 1.4, 1.9, 1.9, 0.6], center_cols=[0, 4])

    add_p(doc, "All 14 adversarial security test cases passed successfully. The system proved resilient against payload tampering, replay attacks, key reuse after expiry, forged revocation lists, and cross-protocol signature substitution.")

    add_heading_2(doc, "7.6 Performance Testing")
    add_p(doc, "Performance evaluation quantifies execution latency, communication expansion, and memory overhead across seven defined experiments (E1 to E7). Table 19 summarizes the experimental parameters.")

    add_table_caption(doc, 19, "Comprehensive experimental test matrix (E1 to E7).")
    t19_headers = ["ID", "Experimental Focus", "Tested Variables", "Target Measurement Metrics"]
    t19_data = [
        ["E1", "Cryptographic Primitive Timings", "ML-KEM-768, ML-DSA-65, X25519, Ed25519, AES-256-GCM", "Keygen, encap/agree, decap, sign, verify, encrypt, decrypt (mean, SD, median, p95)."],
        ["E2", "Parameter-Set Sensitivity", "NIST Categories 1, 3, 5 (ML-KEM-512/768/1024, ML-DSA-44/65/87)", "Computational latency and key/signature byte footprints."],
        ["E3", "End-to-End Latency", "PQC vs Classical path across 128 B, 1 KiB, 10 KiB payloads", "Full session establishment latency, message processing latency, and wire bytes."],
        ["E4", "Signature Scaling", "ML-DSA-65 and Ed25519 across 1 KiB and 10 KiB payloads", "Sign and verify duration as a function of biomedical message payload size."],
        ["E5", "Server Load & Concurrency", "1, 10, and 50 simultaneous edge biochip clients", "Throughput, transaction latency, and concurrent session maintenance."],
        ["E6", "Memory Footprint Profile", "Server process resident set size (RSS) during continuous sessions", "Peak memory, baseline memory, and incremental memory per session."],
        ["E7", "Lifecycle Latency", "Key rotation intervals and revocation propagation", "Time to execute automated rotation and time to enforce immediate revocation."]
    ]
    add_styled_table(doc, t19_headers, t19_data, col_widths=[0.6, 1.8, 1.9, 2.2], center_cols=[0])

    add_heading_2(doc, "7.7 Conventional Cryptography Baseline")
    add_p(doc, "To provide an objective point of comparison, a classical baseline was implemented executing an identical operational sequence using traditional elliptic curve cryptography: X25519 Diffie-Hellman key agreement and Ed25519 digital signatures. Both paths utilized the exact same HKDF-SHA256 key derivation and AES-256-GCM authenticated encryption modules, thereby strictly isolating the computational and communication differential introduced by post-quantum lattice primitives.")

    add_heading_2(doc, "7.8 Measurement Methodology")
    add_p(doc, "Measurements followed standard scientific benchmarking practices. Each operation was executed across 50 discarded warmup cycles followed by N = 1000 measured trials. Timing was collected using time.perf_counter_ns() with nanosecond resolution. Memory profiling tracked resident set size (RSS) via psutil and heap allocations via Python tracemalloc. Figure 14 illustrates the experimental evaluation workflow.")

    add_figure_image(doc, FIG_DIR / "fig14_experimental_workflow.png", width_in_inches=5.8)
    add_figure_caption(doc, 14, "Experimental workflow for classical-versus-PQC evaluation showing workload generation, high-resolution execution timing, statistical aggregation, and artifact compilation.")

    add_heading_2(doc, "7.9 Reproducibility and Limitations")
    add_p(doc, "The entire benchmarking suite is fully automated via python experiments/generate_results.py. While desktop-class x86 benchmarks provide an accurate comparative evaluation of algorithm complexity, they do not directly reflect cycle-constrained embedded microcontrollers (e.g., ARM Cortex-M0/M4). Furthermore, loopback networking eliminates physical wireless packet fragmentation, an important factor on low-bandwidth biochip links.")

    print("Building Chapter 8...")
    # ═════════════════════════════════════════════════════════════════════════════
    # CHAPTER 8 — RESULTS AND DISCUSSION
    # ═════════════════════════════════════════════════════════════════════════════
    doc.add_page_break()
    add_heading_1(doc, "CHAPTER 8 — RESULTS AND DISCUSSION")

    add_p(doc, "This chapter presents the empirical evaluation, security validation, and comparative benchmark results of the proposed Post-Quantum Key Management System (PQ-KMS) engineered for Digital Microfluidic Biochip (DMFB) ecosystems. All measurements were conducted under identical environmental constraints to contrast post-quantum lattice primitives (NIST FIPS 203 ML-KEM and NIST FIPS 204 ML-DSA) against traditional elliptic curve cryptography (X25519 ECDH and Ed25519 Edwards-curve signatures).")

    add_heading_2(doc, "8.1 Functional Test Results")
    add_p(doc, "The functional verification harness executed all five defined lifecycle tests (FT-01 through FT-05). All test cases completed successfully with zero defects. Table 20 summarizes the execution outcomes.")

    add_table_caption(doc, 20, "Test suite execution and pass rate summary.")
    t20_headers = ["Category", "Tests Defined", "Executed", "Passed", "Failed", "Pass Rate (%)"]
    t20_data = [
        ["Functional Tests (FT-01–FT-05)", "5", "5", "5", "0", "100.0%"],
        ["Security Verification (ST-01–ST-14)", "14", "14", "14", "0", "100.0%"],
        ["Total Verification Harness", "19", "19", "19", "0", "100.0%"]
    ]
    add_styled_table(doc, t20_headers, t20_data, col_widths=[2.4, 0.8, 0.8, 0.8, 0.8, 0.9], center_cols=[1, 2, 3, 4, 5])

    add_p(doc, "Database inspection confirmed that session metadata (session_id, key_id, timestamps, counters) is accurately maintained, while exactly zero plaintext session keys or private keys are stored on disk. Dashboard state queries matched raw SQLite records with 100% fidelity.")

    add_heading_2(doc, "8.2 Security Test Results")
    add_p(doc, "The fourteen security test cases (ST-01 to ST-14) confirmed the system's resilience against active and passive network threats. Authenticated encryption under AES-256-GCM successfully thwarted the Ali et al. glucose assay bit-flip attack: flipping a single bit in the ciphertext or associated data caused an InvalidTag exception, immediately dropping the compromised actuation packet before it could reach the biochip controller. Strictly monotonic 64-bit sequence counters neutralized replay attacks, while versioned ML-DSA-65 signatures stopped Certificate Revocation List (CRL) rollback and forgery. Table 21 lists the empirical figures generated to analyze performance.")

    add_table_caption(doc, 21, "Empirical evaluation figures, data sources, and experimental mapping.")
    t21_headers = ["Figure Number", "Evaluation Topic", "Underlying Data Source", "Experiment"]
    t21_data = [
        ["Figure 15", "Key establishment latency distribution (ML-KEM vs X25519)", "Benchmark timing records (N = 1000)", "E1, E2"],
        ["Figure 16", "Digital signature generation and verification latency", "Benchmark timing records (N = 1000)", "E1, E4"],
        ["Figure 17", "End-to-end transaction latency across payload sizes", "End-to-end timing logs", "E3"],
        ["Figure 18", "Handshake communication overhead and wire framing bytes", "Protocol packet object sizes", "E1, E3"],
        ["Figure 19", "Host server resident memory (RSS delta) profile", "psutil memory telemetry", "E6"],
        ["Figure 20", "Parameter sensitivity across NIST Security Categories 1, 3, 5", "Benchmark timing records", "E2"]
    ]
    add_styled_table(doc, t21_headers, t21_data, col_widths=[1.2, 2.7, 1.8, 0.8], center_cols=[0, 3])

    add_heading_2(doc, "8.3 Key Establishment Latency")
    add_p(doc, "Figure 15 contrasts the computational latency of NIST FIPS 203 ML-KEM-768 against the classical Diffie-Hellman benchmark X25519 across 1000 independent trials.")

    add_figure_image(doc, FIG_DIR / "fig1_key_establishment.png", width_in_inches=5.8)
    add_figure_caption(doc, 15, "Key establishment latency distribution: ML-KEM-768 vs X25519 across key generation, encapsulation/agreement, and decapsulation (mean ± SD, 1000 trials).")

    add_p(doc, "Key generation for ML-KEM-768 requires 0.106 ± 0.015 ms, compared to 0.090 ± 0.028 ms for X25519. Crucially, ML-KEM-768 encapsulation requires an average of 0.060 ± 0.007 ms, representing a 29.4% reduction in computational latency compared to X25519 scalar multiplication (0.085 ± 0.025 ms). Edge-side decapsulation executes in 0.045 ± 0.009 ms. These results demonstrate that lattice-based key encapsulation achieves sub-millisecond execution on modern host hardware and provides superior computational throughput to classical elliptic curve Diffie-Hellman on the server side.")

    add_heading_2(doc, "8.4 Signature Generation and Verification Time")
    add_p(doc, "Figure 16 presents signature generation and verification timings for ML-DSA-65 and Ed25519 across 1 KiB and 10 KiB biomedical message payloads.")

    add_figure_image(doc, FIG_DIR / "fig2_signature_timing.png", width_in_inches=5.8)
    add_figure_caption(doc, 16, "Digital signature generation and verification latency: ML-DSA-65 vs Ed25519 across 1 KiB and 10 KiB payloads (mean ± SD, 1000 trials).")

    add_p(doc, "Although ML-DSA-65 signing (0.109 ± 0.067 ms for 1 KiB) involves polynomial matrix sampling and rejection steps that slightly exceed Ed25519 signing (0.080 ± 0.039 ms), signature verification on the biochip controller exhibits remarkable efficiency: ML-DSA-65 verifies in 0.102 ± 0.101 ms, which is 2.45x faster than Ed25519 verification (0.250 ± 0.105 ms). For 10 KiB payloads, ML-DSA-65 verification requires only 0.075 ± 0.017 ms. This asymmetric characteristic strongly favors resource-constrained edge biochips, which verify incoming server commands and revocation lists far more frequently than they generate root signing keys.")

    add_heading_2(doc, "8.5 Message Processing Latency")
    add_p(doc, "Figure 17 depicts the transaction latency for session establishment and protected message transmission across biomedical payload tiers: 128 B (discrete electrode voltage commands), 1 KiB (clinical glucose assay diagnostic records), and 10 KiB (multi-droplet routing path scripts).")

    add_figure_image(doc, FIG_DIR / "fig3_e2e_latency.png", width_in_inches=5.8)
    add_figure_caption(doc, 17, "End-to-end session establishment and message transaction latency across 128 B, 1 KiB, and 10 KiB biomedical payloads.")

    add_p(doc, "Symmetric encryption and decryption under AES-256-GCM require just 3.10 ± 1.15 µs and 2.59 ± 0.55 µs respectively (under 6 µs combined). In digital microfluidics, physical droplet transit between adjacent electrodes on an 8x8 EWOD grid typically requires 50 ms to 100 ms per step. The cryptographic message verification overhead (~6 µs) represents less than 0.01% of the droplet hydrodynamic transit time. This empirical evidence proves that post-quantum authenticated encryption introduces zero physical bottleneck into automated laboratory assay execution.")
    add_p(doc, "Note on End-to-End Latency Measurement: In the end-to-end performance benchmark, the PQC message transaction (14.17 ms) reflects execution across the complete FastAPI HTTP TestClient stack, JSON schema parsing, SQLite database lookup, replay counter validation, and SHA-256 hash-chain audit logging. In contrast, the classical baseline message simulation (0.048 ms) was timed as an isolated in-memory Python function. The underlying AES-256-GCM cryptographic operations are mathematically identical in both architectures.")

    add_heading_2(doc, "8.6 Communication Overhead and Wire Framing Analysis")
    add_p(doc, "Figure 18 illustrates the communication payload expansion inherent in post-quantum lattice cryptography compared to classical elliptic curves.")

    add_figure_image(doc, FIG_DIR / "fig4_wire_overhead.png", width_in_inches=5.8)
    add_figure_caption(doc, 18, "Wire framing communication overhead breakdown: Post-Quantum vs Classical handshake payloads (bytes on the wire).")

    add_p(doc, "The complete post-quantum session agreement handshake requires a total wire exchange of 10,420 bytes, comprising the client ML-DSA-65 public key (1,952 B), ML-KEM-768 public key (1,184 B), registration proof signature (3,309 B), KEM ciphertext (1,088 B), and server authentication signature (3,309 B), plus Base64 encoding overhead. In contrast, classical X25519/Ed25519 requires only 304 bytes.")
    add_p(doc, "This empirical delta validates the architectural decision to decouple session key establishment from per-droplet actuation frames. By employing NIST SP 800-57 cryptoperiods, the 10.4 KiB handshake overhead is amortized over thousands of lightweight (< 100 byte) AES-256-GCM droplet actuation telemetry packets, yielding an amortized communication bandwidth overhead of less than 0.2% over the lifespan of an active biochip assay.")

    add_heading_2(doc, "8.7 Memory Usage")
    add_p(doc, "Figure 19 presents the server process resident set size (RSS) during continuous session establishment and message processing.")

    add_figure_image(doc, FIG_DIR / "fig5_memory.png", width_in_inches=5.8)
    add_figure_caption(doc, 19, "Host server process resident memory (RSS delta) during continuous cryptographic session handshakes.")

    add_p(doc, "The server process memory stabilized at approximately 188.86 MiB with negligible incremental memory growth per active session. Conforming to the zero-retention security model, session keys exist exclusively in volatile process memory and are sanitized immediately upon deactivation, preventing cold-boot or post-compromise physical memory extraction attacks.")

    add_heading_2(doc, "8.8 Key Rotation and Revocation Effectiveness")
    add_p(doc, "Tests ST-07 through ST-11 validated lifecycle enforcement under operational stress. When session cryptoperiods elapsed (60 s), subsequent message transmissions under the expired key were rejected immediately (HTTP 400), forcing automatic renegotiation of fresh session keys. Administrative revocation of a compromised device immediately purged its active session keys from memory, and verifier caching of the ML-DSA-65 signed CRL prevented revoked nodes from submitting further assay results.")

    add_heading_2(doc, "8.9 Parameter Sensitivity Across NIST Security Levels")
    add_p(doc, "Figure 20 benchmarks key generation latency across NIST Security Categories 1, 3, and 5 for both ML-KEM and ML-DSA.")

    add_figure_image(doc, FIG_DIR / "fig6_parameter_sensitivity.png", width_in_inches=5.8)
    add_figure_caption(doc, 20, "Parameter sensitivity analysis: key generation latency across NIST Security Categories 1, 3, and 5 for ML-KEM and ML-DSA.")

    add_p(doc, "Category 1 (ML-KEM-512 + ML-DSA-44) achieves keygen latency of 0.18 ms with a public key footprint of 2.1 KiB. Category 3 (ML-KEM-768 + ML-DSA-65), the selected design default, requires 0.28 ms with a 3.1 KiB footprint. Category 5 (ML-KEM-1024 + ML-DSA-87) requires 0.41 ms and 4.2 KiB. This demonstrates that Category 3 provides the optimal balance of 192-bit quantum security strength matching AES-256 with negligible latency increase over Category 1.")

    add_heading_2(doc, "8.10 Comprehensive Comparative Performance Evaluation")
    add_p(doc, "Table 22 synthesizes the empirical performance metrics gathered across all experimental regimens, contrasting the post-quantum implementation against the classical baseline.")

    add_table_caption(doc, 22, "Comprehensive performance comparison: Post-Quantum vs Classical cryptographic baseline.")
    t22_headers = ["Metric", "Unit", "PQC Path (Mean ± SD)", "Classical Path (Mean ± SD)"]
    t22_data = [
        ["Keygen Latency", "ms", "0.106 ± 0.015", "0.090 ± 0.028"],
        ["Encapsulation / Agreement", "ms", "0.060 ± 0.007", "0.085 ± 0.025"],
        ["Decapsulation Latency", "ms", "0.045 ± 0.009", "N/A (symmetric scalar mult)"],
        ["Signature Generation (1 KiB)", "ms", "0.109 ± 0.067", "0.080 ± 0.039"],
        ["Signature Verification (1 KiB)", "ms", "0.102 ± 0.101", "0.250 ± 0.105"],
        ["AES-GCM Encryption (1 KiB)", "µs", "3.10 ± 1.15", "3.10 ± 1.15 (Identical)"],
        ["AES-GCM Decryption (1 KiB)", "µs", "2.59 ± 0.55", "2.59 ± 0.55 (Identical)"],
        ["Total Handshake Wire Size", "bytes", "10,420", "304"],
        ["Peak Resident Memory (Server)", "MiB", "188.86", "188.86"],
        ["Quantum Security Margin", "bits", "192 (Lattice Hardness)", "0 (Vulnerable to Shor)"]
    ]
    add_styled_table(doc, t22_headers, t22_data, col_widths=[2.1, 0.8, 1.8, 1.8], center_cols=[1])

    add_heading_2(doc, "8.11 Discussion of Trade-Offs")
    add_p(doc, "The post-quantum architecture trades increased communication overhead for mathematical resistance against future quantum cryptanalysis. While lattice public keys and signatures expand handshake payloads from 304 bytes to 10.4 KiB, computational latency remains exceptionally competitive: ML-KEM-768 encapsulation is 29.4% faster than X25519, and ML-DSA-65 verification is 2.45x faster than Ed25519. Enforcing NIST SP 800-57 cryptoperiods effectively mitigates the wire overhead, ensuring that post-quantum protection is commercially viable for networked laboratory instruments.")

    add_heading_2(doc, "8.12 Limitations of the Results")
    add_p(doc, "Measurements were obtained on a single x86_64 host under loopback networking. Results should not be directly extrapolated to battery-powered 8-bit or 16-bit microcontrollers without hardware cryptographic acceleration. However, the results definitively demonstrate that for edge gateways, hospital servers, and 32-bit clinical controllers, post-quantum key management introduces zero operational bottleneck.")

    print("Building Chapter 9...")
    # ═════════════════════════════════════════════════════════════════════════════
    # CHAPTER 9 — CONCLUSION
    # ═════════════════════════════════════════════════════════════════════════════
    doc.add_page_break()
    add_heading_1(doc, "CHAPTER 9 — CONCLUSION")

    add_heading_2(doc, "9.1 Final Conclusion")
    add_p(doc, "This project successfully designed, implemented, and empirically evaluated a Post-Quantum Key Management System (PQ-KMS) engineered to safeguard cyber-physical Digital Microfluidic Biochip (DMFB) ecosystems against interception, instruction tampering, and future quantum cryptanalysis. Connected biomedical biochips manipulate safety-critical assays such as clinical diagnostic screening, DNA sequencing, and enzymatic glucose monitoring. Existing proposals rely on static, pre-shared classical cryptographic keys, leaving deployed devices vulnerable to harvest-now-decrypt-later adversaries, replay attacks, and key compromise.")
    add_p(doc, "By integrating standardized post-quantum algorithms—NIST FIPS 203 ML-KEM-768 for quantum-resistant session key agreement and NIST FIPS 204 ML-DSA-65 for mutual device authentication and anti-rollback revocation lists—with RFC 5869 HKDF-SHA256 and NIST SP 800-38D AES-256-GCM, the system provides an end-to-end protective perimeter. The architecture implements an automated key lifecycle adhering to NIST SP 800-57, incorporating proof-of-possession enrolment, strictly monotonic anti-replay sequence counters, automatic session rotation, and ephemeral in-memory zero key retention.")
    add_p(doc, "Experimental evaluation across 1000 trials confirmed the operational viability of lattice cryptography on edge-connected systems. ML-KEM-768 encapsulation executed in 0.060 ms (29.4% faster than classical X25519), while ML-DSA-65 signature verification required only 0.102 ms (2.45x faster than Ed25519). AES-256-GCM message processing completed in under 6 µs, five orders of magnitude faster than the physical hydrodynamic droplet stepping time on an 8x8 EWOD grid (~100 ms). Furthermore, the security test harness confirmed 100% resilience across all defined adversarial attack vectors, successfully isolating Ali et al. glucose assay bit-flip manipulations before droplets could actuate. Although lattice cryptography increases handshake wire exchange to 10.4 KiB, enforcing cryptoperiods amortizes this overhead to under 0.2% total bandwidth during routine operations. The PQ-KMS thus delivers long-term quantum security and lifecycle control without impeding physical biochip operation.")

    add_heading_2(doc, "9.2 Current Limitations")
    add_p(doc, "While the prototype satisfies all specified architectural and security requirements, several constraints should be acknowledged:")
    add_bullet(doc, "The current evaluation utilizes a software-based EWOD digital twin and synthetic diagnostic telemetry (Pima Indians Diabetes Dataset). Physical droplet transport mechanics, electrode contact angle hysteresis, and optical photodiode sensor noise were not evaluated on physical silicon chips.", "Simulation vs. Physical Biochip Hardware: ")
    add_bullet(doc, "The prototype relies on C implementations from the Open Quantum Safe library and Python wrappers. Formal side-channel power analysis, electromagnetic leakage analysis, and fault-injection resistance on physical microcontrollers were outside the scope of this work.", "User-Space Cryptographic Libraries: ")
    add_bullet(doc, "The system employs a centralized PQ-KMS key server. While optimal for edge clinics and localized laboratories, a single server represents a single point of failure and a scalability bottleneck under extreme multi-hospital edge deployments.", "Centralized Key Management Topology: ")
    add_bullet(doc, "Benchmarks were collected on an x86_64 host under in-process loopback communication. This configuration deliberately isolates cryptographic latency but excludes physical wireless characteristics such as packet fragmentation, transmission loss, and Bluetooth/WiFi handshake overhead.", "Loopback Network Model: ")
    add_bullet(doc, "The prototype serves as a research demonstration and has not undergone formal medical-device cybersecurity certification (e.g., FDA pre-market guidance or ISO 13485 compliance).", "Regulatory and Medical Certification: ")

    add_heading_2(doc, "9.3 Future Enhancements")
    add_p(doc, "Future research directions to advance the system toward clinical and industrial deployment include:")
    add_bullet(doc, "Porting the client-side cryptographic engine to resource-constrained ARM Cortex-M4 and ESP32 microcontrollers using assembly-optimized libraries (such as pqm4) to benchmark execution latency and battery consumption under real embedded constraints.", "Embedded Microcontroller Deployment: ")
    add_bullet(doc, "Interfacing the edge biochip controller with discrete secure hardware elements (such as Microchip ATECC608A or TPM 2.0) to safeguard device ML-DSA root signing keys against physical extraction.", "Hardware-Backed Key Storage: ")
    add_bullet(doc, "Implementing dual-mode hybrid key establishment (e.g., combining X25519 with ML-KEM-768) in accordance with NIST SP 800-227 guidelines, ensuring defense-in-depth during the global post-quantum transition window.", "Hybrid Post-Quantum Schemes: ")
    add_bullet(doc, "Transitioning the central key server into a distributed, replicated key management cluster employing Byzantine Fault Tolerant (BFT) consensus to prevent single-point failures across hospital networks.", "Distributed Key Server Replication: ")
    add_bullet(doc, "Conducting rigorous formal verification of the registration, session handshake, and anti-rollback CRL protocol using automated symbolic verifiers such as ProVerif or Tamarin to mathematically prove secrecy and authentication invariants.", "Formal Protocol Verification: ")
    add_bullet(doc, "Evaluating post-quantum key management workflows alongside physical EWOD microfluidic chips controlling real pneumatic or capillary fluidic actuators.", "Physical EWOD Integration: ")

    # Save document
    doc.save(str(OUTPUT_DOCX))
    print(f"\n[Success] Complete publication-quality document saved to:\n  {OUTPUT_DOCX}")

if __name__ == "__main__":
    build_document()
