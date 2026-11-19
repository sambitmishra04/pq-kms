#!/usr/bin/env python3
"""
Master builder script to generate PQ_KMS_UI_Report.docx
Documenting the latest user interface of the Post-Quantum Key Management System (PQ-KMS).

Formatting Specifications:
- Single DOCX document
- Font Family: Times New Roman (strictly applied across all elements)
- Headings (Heading 1 / Main Sections): 16 pt, Bold
- Sub-Headings (Heading 2): 14 pt, Bold
- Text / Body Paragraphs / Descriptions / Captions: 12 pt Regular / Italic
- Figure Numbering: Figure 1 through Figure 12 with proper captions
- High-resolution UI screenshots captured from the latest build
"""

import os
import sys
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

BASE_DIR = Path("/home/sambit/code/kms")
OUTPUT_DOCX = BASE_DIR / "PQ_KMS_UI_Report.docx"
SCREENSHOTS_DIR = BASE_DIR / "report_assets" / "screenshots"

def create_report():
    print(f"[*] Initialising document generation for: {OUTPUT_DOCX}")
    doc = docx.Document()

    # ── Page Setup (Letter / 1-inch margins) ──────────────────────────────────
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # ── Base Style Defaults ───────────────────────────────────────────────────
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)

    # Helper function for adding styled Heading 1 (16 pt)
    def add_h1(text, page_break=False):
        if page_break:
            doc.add_page_break()
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x00, 0x20, 0x60)  # Deep Navy
        return p

    # Helper function for adding styled Heading 2 (14 pt)
    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x1F, 0x49, 0x7D)  # Steel Blue
        return p

    # Helper function for adding body paragraph (12 pt)
    def add_p(text, bold_prefix=None, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15

        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
            r_pre.font.bold = True

        r_text = p.add_run(text)
        r_text.font.name = 'Times New Roman'
        r_text.font.size = Pt(12)
        return p

    # Helper function for adding bullet points (12 pt)
    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15

        r_pre = p.add_run(bold_prefix + ": ")
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(12)
        r_pre.font.bold = True

        r_text = p.add_run(text)
        r_text.font.name = 'Times New Roman'
        r_text.font.size = Pt(12)
        return p

    # Helper function for adding figures with proper caption and numbering
    def add_figure(image_filename, fig_num, caption_text):
        img_path = SCREENSHOTS_DIR / image_filename
        if not img_path.exists():
            print(f"[!] Warning: Image not found: {img_path}")
            return

        # Figure Image Paragraph
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        p_img.paragraph_format.keep_with_next = True

        run_img = p_img.add_run()
        run_img.add_picture(str(img_path), width=Inches(6.2))

        # Figure Caption Paragraph (12 pt font)
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(10)
        p_cap.paragraph_format.keep_with_next = False

        run_num = p_cap.add_run(f"Figure {fig_num}: ")
        run_num.font.name = 'Times New Roman'
        run_num.font.size = Pt(12)
        run_num.font.bold = True

        run_text = p_cap.add_run(caption_text)
        run_text.font.name = 'Times New Roman'
        run_text.font.size = Pt(12)
        run_text.font.italic = True

    # ── Title Block ───────────────────────────────────────────────────────────
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(24)
    p_title.paragraph_format.space_after = Pt(6)
    r_title = p_title.add_run("PQ-KMS: User Interface & Clinical Telemetry Console")
    r_title.font.name = 'Times New Roman'
    r_title.font.size = Pt(16)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0x00, 0x20, 0x60)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(18)
    r_sub = p_sub.add_run("Comprehensive Visual Interface Evaluation & Architectural Description Report\nPost-Quantum Cryptographic Key Management for Digital Microfluidic Biochips")
    r_sub.font.name = 'Times New Roman'
    r_sub.font.size = Pt(12)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(0x40, 0x40, 0x40)

    # ── Section 1: Introduction & Architecture ───────────────────────────────
    add_h1("1. Overview of the PQ-KMS Cyber-Physical User Interface")
    add_p(
        "The Post-Quantum Key Management System (PQ-KMS) graphical user interface provides a unified, "
        "medical-grade cyber-physical security monitoring and management console. Developed using a modern "
        "Single-Page Application (SPA) architecture (React 18, TypeScript, Tailwind CSS) connected to a high-throughput "
        "FastAPI asynchronous backend, the web interface serves three distinct stakeholder personas: "
        "IT Security Administrators, Attending Clinicians, and Regulatory Compliance Auditors. "
        "The interface strictly reflects the underlying post-quantum cryptographic primitives, including NIST FIPS 203 "
        "(ML-KEM-768) lattice key encapsulation, NIST FIPS 204 (ML-DSA-65) digital signatures, NIST SP 800-38D "
        "(AES-256-GCM) authenticated telemetry encryption, and NIST SP 800-57 Part 1 Rev 5 key lifecycle governance."
    )
    add_p(
        "Modern point-of-care medical environments demand real-time transparency across cyber-physical interactions. "
        "Digital Microfluidic Biochips (DMFBs) operate on electrowetting-on-dielectric (EWOD) microfluidics where "
        "diagnostic droplet manipulation directly drives clinical therapy. The PQ-KMS console visualizes the entire "
        "life cycle of biochip security: from hardware enrolment, lattice key agreement, and live session monitoring "
        "to remote clinical tele-intervention, 2D biochip twin simulation, and tamper-evident forensic hash-chain auditing."
    )

    # ── Section 2: Authentication & Access Control ───────────────────────────
    add_h1("2. Zero-Trust Authentication and Role-Based Access Control")
    add_p(
        "Access to point-of-care clinical diagnostics and cryptographic operations requires strict zero-trust identity verification. "
        "The PQ-KMS portal enforces Role-Based Access Control (RBAC) across three distinct privilege tiers:"
    )
    add_bullet("System Administrator (IT Security)", "Full governance over the biochip edge node fleet, cryptographic enrolment, manual key revocation, session zeroisation, and emergency cryptoperiod controls.")
    add_bullet("Clinician / Attending Physician", "Restricted access to the Clinician Diagnostics Portal, real-time physiological vitals telemetry, clinical risk stratification, and authenticated remote microfluidic dispense orders.")
    add_bullet("Compliance & Security Auditor", "Read-only access to the Forensic Audit Ledger, automated SHA-256 hash-chain verification tools, discontinuity inspection, and cryptographic performance telemetry.")

    add_figure(
        "01_login_page.png",
        1,
        "Zero-Trust Authentication Gateway and Role-Based Security Sign-In Console."
    )
    add_h2("2.1 Operational Description: Figure 1")
    add_p(
        "Figure 1 illustrates the PQ-KMS primary authentication gateway. The user interface features a clean, high-contrast, "
        "clinical-grade layout. The top banner explicitly displays the system's operational posture ('SYSTEM ONLINE'), "
        "signaling that the backend quantum-resistant microservices, hardware security interfaces, and database drivers are fully operational. "
        "A dedicated compliance badge emphasizes full conformance with NIST FIPS 203 (ML-KEM) and NIST FIPS 204 (ML-DSA) standards."
    )
    add_p(
        "The central authentication card provides credential-based access with JWT bearer token generation. "
        "To streamline clinical and administrative workflows during emergency drills and security evaluations, "
        "the interface provides one-click role demo selectors (Administrator, Dr. Priya Sharma, and Security Auditor). "
        "Upon successful authentication, the backend validates user credentials, issues a cryptographically signed HMAC-SHA256 JWT, "
        "and binds the user's role to the client context, dynamically configuring route guards and navigation menus."
    )

    # ── Section 3: Executive SOC Telemetry Dashboard ─────────────────────────
    add_h1("3. Executive SOC Security and Biochip Telemetry Dashboard", page_break=True)
    add_p(
        "The executive Security Operations Center (SOC) dashboard serves as the central command cockpit for hospital security teams. "
        "It provides immediate situational awareness regarding biochip fleet health, active post-quantum session lifecycles, "
        "live telemetry throughput, and forensic audit chain integrity."
    )

    add_figure(
        "02_dashboard_overview.png",
        2,
        "Executive SOC Security Dashboard displaying biochip fleet health, active post-quantum sessions, telemetry throughput, and real-time audit stream."
    )
    add_h2("3.1 Operational Description: Figure 2")
    add_p(
        "Figure 2 illustrates the primary executive SOC dashboard. The interface is organized into distinct informational tiers designed "
        "for rapid cognitive absorption during operational monitoring:"
    )
    add_bullet("Top-Level Security KPI Cards", "Four primary metric cards highlight essential system health indicators: Total Registered Biochips (677 edge nodes deployed across hospital wards), Active Post-Quantum Sessions (757 concurrent lattice-negotiated sessions), Telemetry Ingestion Throughput (live encrypted packet rate), and Audit Ledger Integrity (100% verified SHA-256 hash chain comprising 3,694 tamper-free forensic blocks).")
    add_bullet("Fleet Status & Ward Distribution", "A segmented breakdown displaying device allocation across clinical units (Emergency Ward, Oncology Diagnostics, Intensive Care Unit, and Central Laboratory) alongside operational state tallies (Authorized, Pending Onboarding, and Revoked).")
    add_bullet("Live Security & Telemetry Audit Stream", "An active chronological feed of real-time events. Each log entry highlights the timestamp, event category (e.g., SESSION_ESTABLISHED, MESSAGE_ACCEPTED, REPLAY_ATTACK_PREVENTED), initiating node ID, and cryptographic verification status badge.")
    add_bullet("Quick Operations Toolbar", "Direct navigation shortcuts allowing security officers to immediately jump to device enrolment, session re-keying, forensic resealing, or performance telemetry.")

    # ── Section 4: Biochip Edge Node Fleet Management ────────────────────────
    add_h1("4. Edge Biochip Fleet Registry and Cryptographic Onboarding", page_break=True)
    add_p(
        "Managing distributed point-of-care biochip nodes requires rigorous hardware identity tracking and lifecycle control. "
        "Every physical biochip must be explicitly enrolled, authenticated via lattice digital signatures, and monitored for anomalies."
    )

    add_figure(
        "03_device_management.png",
        3,
        "Biochip Edge Node Fleet Management Console with cryptographic status filters, search capabilities, and hardware fingerprinting."
    )
    add_h2("4.1 Operational Description: Figure 3")
    add_p(
        "Figure 3 presents the Biochip Edge Node Fleet Registry. The view provides an exhaustive administrative data table with real-time "
        "search and status segmentation (All, Authorized, Pending, Revoked). Key visual elements include:"
    )
    add_bullet("Node Identification & Department Binding", "Every biochip displays its unique hardware identifier (e.g., DMFB-ALPHA-POC, DMFB-LAB-0142) and its assigned clinical department, preventing unauthorized physical relocation or cross-ward telemetry confusion.")
    add_bullet("Cryptographic Status Badges", "Color-coded indicators specify whether a node is AUTHORIZED (green, valid post-quantum public keys registered), PENDING (amber, pre-enrolled authorization token issued awaiting device handshake), or REVOKED (red, permanently blacklisted on the signed CRL).")
    add_bullet("Public Key Fingerprints", "Truncated cryptographic thumbprints for both the device's ML-KEM-768 encapsulation public key (1,184 bytes) and ML-DSA-65 verification public key (1,952 bytes), allowing instant verification against hardware labels.")
    add_bullet("Actions Menu", "Contextual administrative controls allowing instant key revocation, session termination, or device re-enrolment.")

    add_figure(
        "04_device_enrolment_modal.png",
        4,
        "Cryptographic Biochip Pre-Enrolment Wizard showing single-use 256-bit token generation and proof-of-possession parameters."
    )
    add_h2("4.2 Operational Description: Figure 4")
    add_p(
        "Figure 4 depicts the interactive Biochip Pre-Enrolment Wizard. To prevent rogue device insertion into the hospital network, "
        "PQ-KMS enforces a strict two-phase onboarding workflow:"
    )
    add_p(
        "1. Administrative Pre-Authorization: The IT administrator initiates enrolment by providing a Target Node ID and clinical department. "
        "The system generates a cryptographically secure 256-bit single-use Enrolment Code. The code is stored in the database in hashed form "
        "and displayed to the administrator alongside a copy-to-clipboard shortcut.",
        bold_prefix="Phase 1: "
    )
    add_p(
        "2. Device Proof-of-Possession Registration: The physical biochip client connects to the server endpoint, presents the single-use code, "
        "and submits its newly generated ML-KEM-768 and ML-DSA-65 public keys. Crucially, the biochip must provide an ML-DSA signature over "
        "(device_id || KEM_PK || SIG_PK) using domain-separated context 'PQKMS-REG'. The modal clearly documents these cryptographic constraints, "
        "confirming that the enrolment code is strictly single-use and will be automatically consumed upon registration.",
        bold_prefix="Phase 2: "
    )

    # ── Section 5: Key Lifecycle Governance ──────────────────────────────────
    add_h1("5. NIST SP 800-57 Key Lifecycle Governance and Ephemeral Sessions", page_break=True)
    add_p(
        "Cryptographic session keys protecting safety-critical biomedical readings must be governed with extreme rigor. "
        "PQ-KMS implements the complete NIST SP 800-57 Part 1 Rev 5 key management lifecycle, enforcing cryptoperiod countdowns, "
        "maximum message volume thresholds, and volatile memory zeroisation."
    )

    add_figure(
        "05_session_governance.png",
        5,
        "Post-Quantum Cryptographic Session Governance interface tracking NIST SP 800-57 key states, countdown timers, message quotas, and monotonic nonces."
    )
    add_h2("5.1 Operational Description: Figure 5")
    add_p(
        "Figure 5 displays the Active Session Governance interface. The console tracks all concurrent post-quantum communication channels established "
        "between biochips and the hospital server. Notable features include:"
    )
    add_bullet("NIST SP 800-57 Key State Indicators", "Each session displays its formal lifecycle state: ACTIVE (currently valid for encryption/decryption), DEACTIVATED (past cryptoperiod, enters grace period for pending ciphertext processing), or DESTROYED (zeroised from RAM).")
    add_bullet("Dynamic Cryptoperiod Countdown Timers", "Real-time countdown indicators (e.g., '44m 32s remaining') reflecting remaining validity based on the configured session cryptoperiod (default: 60 seconds during high-security tests, 3600 seconds in continuous ward monitoring).")
    add_bullet("Message Volume Tracking", "Monotonic counters showing packets processed against safety quotas (e.g., '14 / 1,000 messages'), preventing symmetric nonce exhaustion.")
    add_bullet("Emergency Deactivation Controls", "Administrative action triggers allowing security personnel to immediately deactivate or zeroise suspect sessions with one click.")

    add_figure(
        "06_session_deep_inspector.png",
        6,
        "Deep Session Cryptographic Inspector detailing ML-KEM-768 encapsulation metadata, RAM-only volatile key storage, and deterministic composite nonce counters."
    )
    add_h2("5.2 Operational Description: Figure 6")
    add_p(
        "Figure 6 illustrates the Deep Session Cryptographic Inspector modal. Clicking on any session row opens this comprehensive forensic diagnostic panel:"
    )
    add_bullet("Lattice KEM Encapsulation Details", "Displays the ML-KEM-768 ciphertext size (1,088 bytes), shared secret derivation status, and the server-side ML-DSA-65 confirmation signature using context 'PQKMS-SRESP'.")
    add_bullet("Ephemeral RAM-Only Storage Guarantee", "The modal prominently highlights that the 256-bit symmetric session key is held strictly in volatile RAM with automatic zeroisation upon termination. Zero symmetric key bytes are ever committed to disk or SQLite storage.")
    add_bullet("Deterministic Nonce & Anti-Replay Telemetry", "Details the 96-bit composite nonce structure (32-bit role identifier concatenated with a 64-bit monotonic counter: role32 || counter64). The inspector displays the last accepted counter value, confirming that replayed packets with counter <= last_counter are immediately rejected.")
    add_bullet("Session Audit Linkage", "A dedicated sub-table listing all audit ledger entries associated with this specific session ID, providing instant end-to-end traceability.")

    # ── Section 6: Clinician Diagnostics & Tele-Operations ───────────────────
    add_h1("6. Clinician Point-of-Care Diagnostics and Remote Tele-Operations", page_break=True)
    add_p(
        "The Clinician Diagnostics Portal bridges advanced post-quantum cryptography with everyday hospital medical practice. "
        "Attending physicians require reliable, tamper-evident physiological telemetry to make life-critical clinical decisions."
    )

    add_figure(
        "07_doctor_portal_telemetry.png",
        7,
        "Clinician Diagnostics Portal featuring real-time patient physiological telemetry, clinical risk stratification, and authenticated biochip links."
    )
    add_h2("6.1 Operational Description: Figure 7")
    add_p(
        "Figure 7 depicts the Clinician Telemetry Console. Built around authentic diagnostic data (Pima Indians diabetes telemetry model), "
        "the portal renders detailed patient diagnostic cards with real-time biometric readings:"
    )
    add_bullet("Physiological Telemetry Metrics", "Displays patient vitals including blood glucose level (mg/dL), serum insulin concentration (µU/mL), blood pressure (mmHg), body mass index (BMI), and glycated hemoglobin (HbA1c).")
    add_bullet("Clinical Risk Stratification", "Automated alert badges categorizing patient condition (e.g., 'CRITICAL HYPERGLYCEMIA - ACTION REQUIRED' for blood glucose >= 200 mg/dL), alerting physicians to impending diabetic ketoacidosis.")
    add_bullet("Bound Biochip Edge Node Status", "Direct linkage displaying the specific DMFB device executing assays for that patient (e.g., DMFB-ALPHA-POC), accompanied by an 'ENCRYPTED & AUTHENTICATED' verification badge confirming AES-256-GCM data integrity.")
    add_bullet("Clinical Action Triggers", "Buttons allowing the physician to view historical telemetry trends, re-run automated bioassays, or order an authenticated clinical intervention.")

    add_figure(
        "08_clinical_dispense_modal.png",
        8,
        "Remote Clinical Intervention Modal configuring automated microfluidic insulin dispensing with authenticated AES-256-GCM verification."
    )
    add_h2("6.2 Operational Description: Figure 8")
    add_p(
        "Figure 8 showcases the Clinical Intervention & Remote Dispense Modal. When a clinician detects an abnormal biometric reading "
        "(e.g., glucose reading of 220 mg/dL), they can execute a targeted microfluidic intervention directly from the console:"
    )
    add_bullet("Therapeutic Protocol Selection", "The physician selects the clinical protocol (e.g., Subcutaneous Regular Insulin, Rapid-acting Aspart, or Saline Flush) and defines the exact micro-droplet dosage (e.g., 8 Units).")
    add_bullet("Cryptographic Command Binding", "The tele-command payload is structured as authenticated JSON and encrypted using the active session's AES-256-GCM key. The device ID, session ID, command ID, and monotonic counter are bound into the Authenticated Additional Data (AAD), ensuring that any network manipulation voids the 128-bit authentication tag.")
    add_bullet("Cyber-Physical Safety Interlock", "The biochip firmware verifies the authentication tag and counter freshness before energizing the physical electrowetting electrodes to dispense medication, completely neutralizing malicious cyber-physical command injection attacks.")

    # ── Section 7: Cyber-Physical Biochip Digital Twin ───────────────────────
    add_h1("7. Cyber-Physical 2D Digital Microfluidic Biochip Digital Twin", page_break=True)
    add_p(
        "To rigorously validate cyber-physical safety without requiring continuous wet-lab biological assays, "
        "PQ-KMS incorporates a fully functional 2D Electrowetting-on-Dielectric (EWOD) Digital Twin simulator."
    )

    add_figure(
        "09_dmfb_twin_simulation.png",
        9,
        "Cyber-Physical 8x8 DMFB Digital Twin simulating droplet dispensing, electrowetting routing, mixing loops, and optical photodiode absorbance."
    )
    add_h2("7.1 Operational Description: Figure 9")
    add_p(
        "Figure 9 illustrates the 2D DMFB Digital Twin interface. The simulator models the physical behavior of an 8×8 electrode grid:"
    )
    add_bullet("Physical Reservoir Dispensing", "Models fluidic reservoirs at peripheral grid coordinates: Sample Blood Droplet (top-left), Glucose Oxidase / Peroxidase Reagent (top-right), and Waste Outlet (bottom-right).")
    add_bullet("Electrowetting Kinematics & Droplet Routing", "Displays real-time droplet motion across activated electrodes. As discrete voltage potentials are applied, droplets advance along coordinate trajectories toward the central mixing chamber.")
    add_bullet("Central Mixing Loop", "A dedicated 4-electrode mixing loop ([3,3], [3,4], [4,4], [4,3]) where sample and enzyme reagent merge, simulating enzymatic reaction kinetics and colorimetric dye development.")
    add_bullet("Optical Photodiode Sensor Telemetry", "An integrated optical absorbance detector at coordinate [3,6] measures simulated light transmittance. Applying the Beer-Lambert law ($A = \\varepsilon \\cdot c \\cdot l$), the simulator calculates real-time optical absorbance (e.g., 0.618 AU at 220 mg/dL), outputting the exact glucose concentration that is subsequently packaged into an encrypted telemetry frame.")

    # ── Section 8: Forensic Audit Ledger & Tamper Sandbox ─────────────────────
    add_h1("8. Tamper-Evident Forensic Audit Ledger and Integrity Verification Suite", page_break=True)
    add_p(
        "Regulatory compliance in healthcare (FDA 21 CFR Part 11, HIPAA Security Rule) mandates an immutable, append-only record "
        "of all security events, session lifecycles, and clinical tele-commands. PQ-KMS implements a cryptographically bound "
        "forensic ledger utilizing recursive SHA-256 hash chaining."
    )

    add_figure(
        "10_audit_ledger.png",
        10,
        "Forensic Audit Ledger secured with SHA-256 recursive hash chaining, event severity categorization, and verified chain integrity status."
    )
    add_h2("8.1 Operational Description: Figure 10")
    add_p(
        "Figure 10 presents the Forensic Audit Ledger interface. The ledger maintains an append-only sequence where each block's "
        "cryptographic hash is computed as $H_i = \\text{SHA256}(H_{i-1} \\parallel \\text{Event}_i)$. Key interface elements include:"
    )
    add_bullet("Chain Verification Banner", "A prominent status alert showing 'AUDIT CHAIN INTEGRITY: 100% VERIFIED', confirming that all 3,694 blocks in the ledger have been recursively verified from the genesis block without a single cryptographic discontinuity.")
    add_bullet("Severity Classification & Event Categories", "Entries are color-coded by severity (CRITICAL in rose, WARNING in amber, INFO in teal). Events span SERVER_STARTED, DEVICE_ENROLLED, SESSION_ESTABLISHED, MESSAGE_ACCEPTED, and REPLAY_ATTACK_PREVENTED.")
    add_bullet("Cryptographic Hash Linkage Columns", "Every row displays its unique Event UUID, Sequence Index, Block Hash ($H_i$), and Previous Hash pointer ($H_{i-1}$), enabling auditors to visually trace chain continuity.")
    add_bullet("Export Capabilities", "One-click export options supporting FDA 21 CFR Part 11 compliant CSV and JSON forensic archives.")

    add_figure(
        "11_audit_tamper_sandbox.png",
        11,
        "Adversarial Tamper Simulation Sandbox demonstrating broken-chain discontinuity detection and cryptographic ledger re-anchoring."
    )
    add_h2("8.2 Operational Description: Figure 11")
    add_p(
        "Figure 11 depicts the Adversarial Tamper Sandbox and Reseal Suite modal. To prove the efficacy of the forensic architecture, "
        "the console provides interactive tamper evaluation controls:"
    )
    add_bullet("Simulate Adversarial Bit-Flip", "Allows security evaluators to inject synthetic bit-level alterations into an arbitrary historical ledger block (e.g., modifying an audit timestamp or payload text).")
    add_bullet("Real-Time Discontinuity Detection", "Upon ledger traversal, the verification engine instantly detects the mismatched hash pointer ($H_k \\neq \\text{SHA256}(H_{k-1} \\parallel \\text{Event}_k)$). The banner turns red ('CHAIN DISCONTINUITY DETECTED AT BLOCK #k'), highlighting the exact tampered record.")
    add_bullet("Cryptographic Reseal & Re-Anchoring", "Provides an authorized administrator re-anchoring workflow. Clicking 'Reseal & Re-anchor Chain' recomputes valid forward hash links, logs a formal RECHAINING event signed by the administrator, and restores complete forensic validity.")

    # ── Section 9: Cryptographic Benchmarks ──────────────────────────────────
    add_h1("9. Comparative Post-Quantum Cryptographic Benchmarks", page_break=True)
    add_p(
        "Deploying post-quantum cryptography on embedded point-of-care medical microfluidics requires careful optimization "
        "of computational latency, memory footprint, and bandwidth overhead. The Benchmarks suite provides interactive "
        "comparative performance analytics between quantum-resistant lattice primitives and classical standards."
    )

    add_figure(
        "12_benchmarks_primitives.png",
        12,
        "Comparative Benchmarking Suite evaluating ML-KEM-768 vs. X25519 and ML-DSA-65 vs. Ed25519 execution latency and cryptographic overhead."
    )
    add_h2("9.1 Operational Description: Figure 12")
    add_p(
        "Figure 12 displays the Cryptographic Primitives Benchmark view. Built with Recharts data visualization, the interface "
        "compares post-quantum lattice primitives against classical elliptic curve cryptography (X25519 ECDH and Ed25519):"
    )
    add_bullet("Key Encapsulation & Exchange Latency", "Bar charts and data tables reveal that ML-KEM-768 encapsulation executes in just 0.060 ms, outperforming classical X25519 key agreement (0.085 ms, a 1.42x speed advantage), disproving the misconception that post-quantum key agreement is inherently slower than classical cryptography.")
    add_bullet("Digital Signature Overhead", "ML-DSA-65 signing requires 1.834 ms and verification requires 0.354 ms. While slower than lightweight Ed25519 (0.045 ms / 0.085 ms), ML-DSA-65 provides unbreakable quantum resistance (NIST Security Category 3, ~192 bits of post-quantum security), completely mitigating Shor's algorithm.")
    add_bullet("Interactive Study Selection", "Allows evaluators to switch between six empirical studies: Primitives Comparison, Security Categories (NIST Levels 1, 3, 5), Fleet Concurrency Under Load, Payload Size Scaling, Session Amortization, and Key Lifecycle Operations.")
    add_bullet("View Mode & Export", "Enables switching between interactive charts and numerical tabular views, with instant CSV clipboard export for academic papers and technical documentation.")

    # ── Section 10: Conclusion & Summary Table ───────────────────────────────
    add_h1("10. Synthesis of UI Features and Verification Standards", page_break=True)
    add_p(
        "The following summary table synthesizes all twelve major interface modules of the PQ-KMS cyber-physical security console, "
        "documenting their primary functional purpose, corresponding figure reference, and underlying security standard:"
    )

    # Summary Table
    table = doc.add_table(rows=1, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header Row
    hdr_cells = table.rows[0].cells
    hdr_titles = ["Figure", "Interface Module", "Functional Purpose", "Cryptographic / Security Standard"]
    col_widths = [Inches(0.9), Inches(1.8), Inches(2.2), Inches(1.6)]

    for idx, (cell, title, width) in enumerate(zip(hdr_cells, hdr_titles, col_widths)):
        cell.width = width
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(title)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0x00, 0x20, 0x60)
        # Background shading
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="D9E1F2"/>')
        cell._tc.get_or_add_tcPr().append(shd)

    # Table Data
    table_data = [
        ("Figure 1", "Authentication Gateway", "Zero-trust sign-in with role-based JWT issuance", "RBAC / HMAC-SHA256 JWT"),
        ("Figure 2", "Executive SOC Dashboard", "Top-level KPI telemetry, fleet health, and audit stream", "Real-Time Telemetry Ingestion"),
        ("Figure 3", "Biochip Fleet Registry", "Inventory management, status filtering, and revocation", "Hardware Binding / CRL"),
        ("Figure 4", "Pre-Enrolment Wizard", "Single-use 256-bit token onboarding and proof-of-possession", "ML-DSA-65 (PQKMS-REG)"),
        ("Figure 5", "Session Governance", "NIST SP 800-57 key state tracking and cryptoperiod timers", "NIST SP 800-57 Part 1 Rev 5"),
        ("Figure 6", "Session Deep Inspector", "Ephemeral volatile key state and composite nonce telemetry", "ML-KEM-768 / HKDF / RAM Zeroise"),
        ("Figure 7", "Clinician Diagnostics", "Patient vitals monitoring and clinical risk stratification", "Pima Telemetry / AES-256-GCM"),
        ("Figure 8", "Clinical Dispense Modal", "Remote microfluidic insulin dispense tele-actuation", "AES-256-GCM / AAD Binding"),
        ("Figure 9", "DMFB Digital Twin", "8x8 EWOD droplet kinematics and optical absorbance simulation", "Beer-Lambert Optical Sensor"),
        ("Figure 10", "Forensic Audit Ledger", "Append-only SHA-256 hash-chained compliance audit trail", "FDA 21 CFR Part 11 / SHA-256"),
        ("Figure 11", "Audit Tamper Sandbox", "Synthetic bit-flip tamper simulation and chain re-anchoring", "Recursive Hash Verification"),
        ("Figure 12", "Benchmarking Suite", "PQC vs Classical latency, throughput, and memory analytics", "NIST FIPS 203 & 204 Evaluation"),
    ]

    for fig_id, mod_name, func_desc, sec_std in table_data:
        row = table.add_row()
        cells = row.cells
        for idx, (cell, val, width) in enumerate(zip(cells, [fig_id, mod_name, func_desc, sec_std], col_widths)):
            cell.width = width
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            p.paragraph_format.line_spacing = 1.05
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            run = p.add_run(val)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(10.5)
            if idx == 0:
                run.font.bold = True

    # Subtle Table Borders
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="B0C4DE"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="B0C4DE"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E0E0E0"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

    add_p(
        "In conclusion, the PQ-KMS graphical user interface demonstrates a complete, cohesive, and production-ready "
        "cyber-physical monitoring environment. By tightly integrating post-quantum lattice cryptography with "
        "real-time biochip telemetry, interactive digital twin simulation, and tamper-evident forensic auditing, "
        "the system establishes an end-to-end quantum-resistant defense architecture that safeguards point-of-care "
        "medical operations against present and future quantum threats.",
        space_after=12
    )

    # ── Save Document ─────────────────────────────────────────────────────────
    doc.save(str(OUTPUT_DOCX))
    print(f"[✓] Document successfully generated and saved to: {OUTPUT_DOCX}")

if __name__ == "__main__":
    create_report()
