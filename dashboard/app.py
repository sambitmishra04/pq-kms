"""
PQ-KMS Medical Security Operations Center (SOC) & DMFB Digital Twin Dashboard.
Features:
- Live 2D Digital Microfluidic Biochip (DMFB) Electrode Grid Simulator
- Interactive Cyber-Physical Attack Lab (Ali et al. glucose tamper, replay, Shor quantum analysis)
- Deep Cryptographic Inspector (ML-KEM-768, ML-DSA-65, HKDF, AES-256-GCM)
- Key Lifecycle Monitor (NIST SP 800-57 state machine)
- Real-time Hash-Chained Audit Trail Verification
- Benchmarking Analytics & Publication Tables
"""
from __future__ import annotations

import base64
import json
import os
import sys
import time
from pathlib import Path

# Set LD_LIBRARY_PATH for liboqs
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from app.audit.audit import get_audit_logger
from app.config import (
    ADMIN_TOKEN,
    DATABASE_PATH,
    KEM_ALG,
    SESSION_LIFETIME_S,
    SIG_ALG,
)
from app.database.db import Database
from app.simulation.attack_lab import AttackLab
from app.simulation.dmfb_simulator import DMFBBiochip, get_biochip

st.set_page_config(
    page_title="PQ-KMS | Biomedical Biochip Cyber-Defense SOC",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── Custom Dark Medical Theme CSS ──────────────────────────────────────────
st.markdown(
    """
<style>
    .stApp {
        background-color: #0b0f19;
        color: #e2e8f0;
    }
    .metric-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .metric-value {
        font-size: 26px;
        font-weight: 700;
        color: #38bdf8;
        margin-top: 4px;
    }
    .metric-label {
        font-size: 13px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .status-badge-secure {
        background-color: rgba(16, 185, 129, 0.15);
        border: 1px solid #10b981;
        color: #10b981;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
    }
    .status-badge-alert {
        background-color: rgba(239, 68, 68, 0.15);
        border: 1px solid #ef4444;
        color: #ef4444;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
    }
    .status-badge-pqc {
        background-color: rgba(139, 92, 246, 0.15);
        border: 1px solid #8b5cf6;
        color: #c084fc;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
    }
</style>
""",
    unsafe_allow_html=True,
)


@st.cache_resource
def get_database() -> Database:
    return Database(DATABASE_PATH)


def draw_biochip_grid(chip: DMFBBiochip) -> go.Figure:
    """
    Render an interactive 2D visualization of the DMFB electrode array
    with droplet positions, dispensers, detector, and active electrodes.
    """
    fig = go.Figure()

    # Draw grid electrodes (8x8)
    for x in range(chip.grid_width):
        for y in range(chip.grid_height):
            is_active = (x, y) in chip.active_electrodes
            is_detector = (x, y) == chip.optical_detector
            is_sample = (x, y) == chip.dispenser_sample
            is_reagent = (x, y) == chip.dispenser_reagent
            is_waste = (x, y) == chip.waste_reservoir

            if is_active:
                cell_color = "rgba(56, 189, 248, 0.45)"  # Glowing cyan
                border_color = "#38bdf8"
            elif is_detector:
                cell_color = "rgba(16, 185, 129, 0.25)"  # Green detector
                border_color = "#10b981"
            elif is_sample or is_reagent:
                cell_color = "rgba(244, 63, 94, 0.2)"
                border_color = "#f43f5e"
            elif is_waste:
                cell_color = "rgba(100, 116, 139, 0.2)"
                border_color = "#64748b"
            else:
                cell_color = "rgba(30, 41, 59, 0.6)"
                border_color = "rgba(71, 85, 105, 0.4)"

            fig.add_shape(
                type="rect",
                x0=x - 0.45,
                y0=y - 0.45,
                x1=x + 0.45,
                y1=y + 0.45,
                line=dict(color=border_color, width=1.5 if is_active or is_detector else 1),
                fillcolor=cell_color,
            )

    # Annotate special sites
    fig.add_annotation(
        x=chip.dispenser_sample[0],
        y=chip.dispenser_sample[1] - 0.35,
        text="Sample In",
        showarrow=False,
        font=dict(size=9, color="#f87171"),
    )
    fig.add_annotation(
        x=chip.dispenser_reagent[0],
        y=chip.dispenser_reagent[1] - 0.35,
        text="Reagent In",
        showarrow=False,
        font=dict(size=9, color="#22d3ee"),
    )
    fig.add_annotation(
        x=chip.optical_detector[0],
        y=chip.optical_detector[1] + 0.35,
        text="Photodiode Sensor",
        showarrow=False,
        font=dict(size=9, color="#4ade80"),
    )
    fig.add_annotation(
        x=chip.waste_reservoir[0],
        y=chip.waste_reservoir[1] - 0.35,
        text="Waste",
        showarrow=False,
        font=dict(size=9, color="#94a3b8"),
    )

    # Plot droplets as scatter points
    for d in chip.droplets.values():
        fig.add_trace(
            go.Scatter(
                x=[d.x],
                y=[d.y],
                mode="markers+text",
                marker=dict(
                    size=26,
                    color=d.color,
                    line=dict(width=2, color="#ffffff"),
                    opacity=0.95,
                ),
                text=[f"<b>{d.label}</b>"],
                textposition="bottom center",
                name=d.label,
                hoverinfo="text",
                hovertext=f"Droplet: {d.label}<br>Type: {d.droplet_type}<br>Volume: {d.volume_ul} µL<br>Glucose: {d.concentration_mg_dl} mg/dL<br>Position: ({d.x}, {d.y})",
            )
        )

    fig.update_layout(
        title="<b>DMFB 2D Electrode Grid Array (8 × 8 EWOD Cells)</b>",
        xaxis=dict(
            range=[-0.8, chip.grid_width - 0.2],
            showgrid=False,
            zeroline=False,
            showticklabels=True,
            title="Electrode Column (X)",
            tickmode="linear",
            tick0=0,
            dtick=1,
        ),
        yaxis=dict(
            range=[-0.8, chip.grid_height - 0.2],
            showgrid=False,
            zeroline=False,
            showticklabels=True,
            title="Electrode Row (Y)",
            tickmode="linear",
            tick0=0,
            dtick=1,
            scaleanchor="x",
            scaleratio=1,
        ),
        template="plotly_dark",
        plot_bgcolor="#0f172a",
        paper_bgcolor="#0b0f19",
        height=520,
        margin=dict(l=40, r=40, t=60, b=40),
        showlegend=False,
    )
    return fig


def main() -> None:
    db = get_database()
    attack_lab = AttackLab()

    # ─── Top Telemetry Header ───────────────────────────────────────────────
    col_t1, col_t2 = st.columns([3, 1])
    with col_t1:
        st.markdown(
            "## 🧬 PQ-KMS | Digital Microfluidic Biochip Security Center"
        )
        st.markdown(
            f"<span class='status-badge-pqc'>Post-Quantum Standardized: {KEM_ALG}</span> "
            f"<span class='status-badge-pqc'>Signature: {SIG_ALG}</span> "
            f"<span class='status-badge-secure'>● Protection: AES-256-GCM Active</span>",
            unsafe_allow_html=True,
        )
    with col_t2:
        if st.button("▶ Run Evaluator Demo (CLI)", use_container_width=True):
            st.info("Execute: `bash run.sh demo` in terminal to run the automated scripted walkthrough!")

    st.markdown("---")

    # ─── KPI Telemetry Cards ────────────────────────────────────────────────
    devices = db.get_all_devices()
    sessions = db.get_all_sessions()
    active_sessions = [s for s in sessions if s.get("state") == "ACTIVE"]
    msg_stats = db.get_message_stats()
    chain_valid, break_idx = db.verify_audit_chain()

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(
            f"<div class='metric-card'><div class='metric-label'>Registered Biochips</div>"
            f"<div class='metric-value'>{len(devices)} Nodes</div></div>",
            unsafe_allow_html=True,
        )
    with c2:
        st.markdown(
            f"<div class='metric-card'><div class='metric-label'>Active Quantum-Safe Sessions</div>"
            f"<div class='metric-value'>{len(active_sessions)} Sessions</div></div>",
            unsafe_allow_html=True,
        )
    with c3:
        total_msgs = sum(msg_stats.values())
        st.markdown(
            f"<div class='metric-card'><div class='metric-label'>Protected Ingested Assays</div>"
            f"<div class='metric-value'>{total_msgs} Messages</div></div>",
            unsafe_allow_html=True,
        )
    with c4:
        chain_text = (
            "<span style='color:#10b981;'>VALID (Intact)</span>"
            if chain_valid
            else f"<span style='color:#ef4444;'>BROKEN at #{break_idx}</span>"
        )
        st.markdown(
            f"<div class='metric-card'><div class='metric-label'>Audit Hash Chain</div>"
            f"<div class='metric-value'>{chain_text}</div></div>",
            unsafe_allow_html=True,
        )

    st.markdown("<br>", unsafe_allow_html=True)

    # ─── Main Tabs ──────────────────────────────────────────────────────────
    tab_sim, tab_attack, tab_crypto, tab_devices, tab_sessions, tab_bench, tab_audit = st.tabs([
        "🧬 Biochip Simulator & Grid",
        "🎯 Interactive Attack Lab",
        "🔍 Cryptographic Inspector",
        "📋 Device Fleet",
        "🔑 Key Lifecycle",
        "📊 Benchmark Analytics",
        "📜 Tamper-Evident Audit",
    ])

    # =========================================================================
    # TAB 1: BIOCHIP SIMULATOR & LIVE GRID
    # =========================================================================
    with tab_sim:
        st.subheader("Cyber-Physical Biochip Digital Twin (Electrowetting-on-Dielectric)")
        st.markdown(
            "Simulating automated **enzymatic glucose assay** execution on an $8 \\times 8$ array of electrowetting electrodes. "
            "Droplet transport, mixing, and photodiode sensing are coordinated with the edge processor."
        )

        chip = get_biochip()

        # Session state for interactive step execution
        if "assay_steps" not in st.session_state:
            st.session_state.assay_steps = chip.load_glucose_assay(patient_glucose=220.0)
            st.session_state.current_step_idx = 0
            st.session_state.patient_glucose = 220.0

        col_ctrl, col_view = st.columns([1, 2])

        with col_ctrl:
            st.markdown("#### Assay Execution Controls")
            glucose_val = st.slider(
                "Patient Blood Glucose (mg/dL):",
                min_value=40.0,
                max_value=450.0,
                value=float(st.session_state.patient_glucose),
                step=5.0,
            )

            if st.button("🔄 Reset Biochip & Reload Protocol", use_container_width=True):
                st.session_state.patient_glucose = glucose_val
                st.session_state.assay_steps = chip.load_glucose_assay(patient_glucose=glucose_val)
                st.session_state.current_step_idx = 0
                st.rerun()

            total_steps = len(st.session_state.assay_steps)
            cur_idx = st.session_state.current_step_idx

            col_btn1, col_btn2 = st.columns(2)
            with col_btn1:
                if st.button("▶ Next Step", disabled=cur_idx >= total_steps, use_container_width=True):
                    if cur_idx < total_steps:
                        step_to_exec = st.session_state.assay_steps[cur_idx]
                        chip.execute_step(step_to_exec)
                        st.session_state.current_step_idx += 1
                        st.rerun()

            with col_btn2:
                if st.button("⏩ Run Complete Assay", disabled=cur_idx >= total_steps, use_container_width=True):
                    while st.session_state.current_step_idx < total_steps:
                        step_to_exec = st.session_state.assay_steps[st.session_state.current_step_idx]
                        chip.execute_step(step_to_exec)
                        st.session_state.current_step_idx += 1
                    st.rerun()

            st.markdown(f"**Assay Progress:** Step {cur_idx} of {total_steps}")
            st.progress(cur_idx / total_steps if total_steps else 0)

            if cur_idx > 0 and cur_idx <= total_steps:
                last_step = st.session_state.assay_steps[cur_idx - 1]
                st.info(f"**Step {last_step.step_num} ({last_step.operation}):** {last_step.description}")

            # Sensor readout if assay completed
            sensor_data = chip.read_optical_sensor()
            if sensor_data["detected"]:
                st.success("### 🔬 Optical Biosensor Readout")
                st.metric("Absorbance (AU)", f"{sensor_data['absorbance_au']} AU")
                st.metric("Reported Glucose", f"{sensor_data['glucose_mg_dl']} mg/dL")
                st.markdown(f"**Clinical Status:** `{sensor_data['clinical_status']}`")

        with col_view:
            fig_grid = draw_biochip_grid(chip)
            st.plotly_chart(fig_grid, use_container_width=True)

    # =========================================================================
    # TAB 2: INTERACTIVE ATTACK LAB
    # =========================================================================
    with tab_attack:
        st.subheader("🎯 Interactive Cyber-Physical Attack Sandbox")
        st.markdown(
            "Test adversarial attack vectors from the cyber-physical DMFB literature (Ali et al. [1], Guo et al. [3]) "
            "and observe how PQ-KMS's post-quantum authenticated layers detect and contain them."
        )

        attack_choice = st.radio(
            "Select Attack Simulation:",
            [
                "1. Glucose Assay Result Tampering (Ali et al. [1])",
                "2. Diagnostic Message Replay Attack",
                "3. Harvest-Now-Decrypt-Later Quantum Analysis",
            ],
            horizontal=True,
        )

        st.markdown("---")

        if "1. Glucose Assay" in attack_choice:
            st.markdown("### 🧪 Attack Scenario: In-Transit Assay Falsification")
            st.caption(
                "Ali et al. demonstrated that an in-transit adversary can manipulate glucose concentration records, "
                "flipping a critical 220 mg/dL hyperglycemic result to 110 mg/dL so insulin is withheld from the patient."
            )

            c_atk1, c_atk2 = st.columns(2)
            with c_atk1:
                true_g = st.number_input("True Physical Glucose (mg/dL):", value=220.0, step=10.0)
            with c_atk2:
                falsified_g = st.number_input("Adversary Injected Glucose (mg/dL):", value=110.0, step=10.0)

            if st.button("🚨 Launch In-Transit Tamper Attack", type="primary"):
                result = attack_lab.run_glucose_tamper_attack(true_g, falsified_g)

                c_res1, c_res2 = st.columns(2)
                with c_res1:
                    st.error("#### ❌ Legacy Unprotected DMFB")
                    st.markdown(f"**Received at Hospital:** `{result['unprotected_system']['received_glucose']} mg/dL`")
                    st.markdown(f"**Detection:** None (Passed CRC or unauthenticated cipher)")
                    st.markdown(f"**Clinical Harm:** {result['unprotected_system']['clinical_consequence']}")

                with c_res2:
                    st.success("#### 🛡️ With PQ-KMS Protection")
                    st.markdown(f"**Tamper Caught:** `{result['pqkms_system']['tamper_detected']}`")
                    st.markdown(f"**Cryptographic Error:** `{result['pqkms_system']['error_detail']}`")
                    st.markdown(f"**Clinical Outcome:** {result['pqkms_system']['clinical_consequence']}")

        elif "2. Diagnostic Message Replay" in attack_choice:
            st.markdown("### 🔁 Attack Scenario: Message Replay")
            st.caption(
                "An attacker eavesdrops on a healthy diagnostic reading from yesterday and replays it today "
                "to mask a dangerous spike in patient vitals."
            )

            if st.button("🚨 Launch Replay Attack", type="primary"):
                res_replay = attack_lab.run_replay_attack()
                st.success("#### 🛡️ PQ-KMS Defense Triggered")
                st.markdown(f"**Replay Detected:** `{res_replay['replay_detected']}`")
                st.markdown(f"**Rejection Mechanism:** `{res_replay['rejection_reason']}`")
                st.info(f"**Mitigation Detail:** {res_replay['mitigation']}")

        elif "3. Harvest-Now" in attack_choice:
            st.markdown("### ⚛️ Attack Scenario: 'Harvest-Now, Decrypt-Later' Quantum Threat")
            st.caption(
                "Adversaries record encrypted biomedical transmissions today. When a fault-tolerant quantum computer "
                "becomes operational, classical algorithms (RSA, ECC, Diffie-Hellman) will be completely broken via Shor's algorithm."
            )

            q_info = attack_lab.run_quantum_threat_comparison()

            cq1, cq2 = st.columns(2)
            with cq1:
                st.error("#### Classical Baseline (X25519 / RSA)")
                st.markdown(f"**Quantum Security:** `{q_info['classical_quantum_security']}`")
                st.markdown(r"**Shor's Algorithm:** Breaks in polynomial time $\mathcal{O}((\log N)^3)$")
                st.markdown(f"**Verdict:** All harvested clinical records are decrypted once quantum computer exists.")

            with cq2:
                st.success("#### Post-Quantum KMS (ML-KEM-768)")
                st.markdown(f"**Quantum Security:** `{q_info['pqc_quantum_security']}`")
                st.markdown(f"**Mathematical Hardness:** Module Learning With Errors (M-LWE)")
                st.markdown(f"**Verdict:** {q_info['harvest_now_decrypt_later_status']}")

    # =========================================================================
    # TAB 3: CRYPTOGRAPHIC INSPECTOR
    # =========================================================================
    with tab_crypto:
        st.subheader("🔍 Deep Cryptographic Inspector")
        st.markdown("Detailed breakdown of the post-quantum primitives and structures implemented.")

        col_c1, col_c2 = st.columns(2)
        with col_c1:
            st.markdown("#### NIST FIPS 203 (ML-KEM-768)")
            st.code(
                f"""Algorithm: ML-KEM-768 (Category 3)
Encapsulation Key (Public): 1,184 bytes
Decapsulation Key (Private): 2,400 bytes
Ciphertext: 1,088 bytes
Shared Secret Output: 32 bytes (256 bits)
Lattice Dimension: k = 3, Module Rank
Randomness Requirement: Approved RBG with 192-bit strength""",
                language="yaml",
            )

        with col_c2:
            st.markdown("#### NIST FIPS 204 (ML-DSA-65)")
            st.code(
                f"""Algorithm: ML-DSA-65 (Category 3)
Verification Key (Public): 1,952 bytes
Signing Key (Private): 4,032 bytes
Signature Length: 3,309 bytes
Signing Mode: Hedged (fresh randomness + private key)
Domain Separation: Context prefix in signed message byte stream""",
                language="yaml",
            )

        st.markdown("#### Symmetric Key Derivation & Deterministic IV (SP 800-38D)")
        st.code(
            """SK = HKDF-SHA256(
    IKM  = ML-KEM Shared Secret (32 bytes),
    salt = nonce_c (16 bytes client nonce),
    info = "PQKMS-v1" || device_id || session_id || "aes256gcm",
    L    = 32 bytes (AES-256 key)
)

96-bit Deterministic IV Construction:
  Bytes 0-3:  Role ID (0x00000001 for Client, 0x00000002 for Server)
  Bytes 4-11: Monotonic 64-bit per-direction counter
  AAD = device_id || session_id || message_id || counter""",
            language="python",
        )

    # =========================================================================
    # TAB 4: DEVICE FLEET
    # =========================================================================
    with tab_devices:
        st.subheader("Biochip Device Fleet Registry")
        devices_all = db.get_all_devices()
        if devices_all:
            df_dev = pd.DataFrame(devices_all)
            for c in ["kem_public_key", "sig_public_key", "enrolment_code_hash"]:
                if c in df_dev.columns:
                    df_dev.drop(columns=[c], inplace=True)
            st.dataframe(df_dev, use_container_width=True)
        else:
            st.info("No devices registered in database.")

        st.markdown("#### Quick Enrolment Simulator")
        col_e1, col_e2 = st.columns([2, 1])
        with col_e1:
            new_did = st.text_input("New Biochip Device ID:", value=f"DMFB-NODE-{int(time.time())%10000}")
        with col_e2:
            if st.button("Generate One-Time Enrolment Token", use_container_width=True):
                from app.device_management.registry import create_enrolment_code
                try:
                    code = create_enrolment_code(new_did, "device")
                    st.success(f"Enrolment Token Issued: `{code}`")
                except Exception as exc:
                    st.error(str(exc))

    # =========================================================================
    # TAB 5: KEY LIFECYCLE
    # =========================================================================
    with tab_sessions:
        st.subheader("NIST SP 800-57 Key Lifecycle State Machine")
        st.markdown(
            "Session keys transition: `CREATED` $\\rightarrow`ACTIVE` $\\rightarrow`DEACTIVATED` $\\rightarrow`DESTROYED` "
            "(or `COMPROMISED`). Keys are held **only in-memory** and zeroized upon destruction."
        )

        all_sess = db.get_all_sessions()
        if all_sess:
            df_s = pd.DataFrame(all_sess)
            st.dataframe(df_s, use_container_width=True)

            state_counts = df_s["state"].value_counts().reset_index()
            state_counts.columns = ["State", "Count"]
            fig_st = px.bar(
                state_counts,
                x="State",
                y="Count",
                color="State",
                title="Sessions by NIST Lifecycle State",
                color_discrete_map={
                    "ACTIVE": "#10b981",
                    "DEACTIVATED": "#f59e0b",
                    "DESTROYED": "#64748b",
                    "COMPROMISED": "#ef4444",
                },
            )
            st.plotly_chart(fig_st, use_container_width=True)
        else:
            st.info("No active sessions.")

    # =========================================================================
    # TAB 6: BENCHMARKS & REPORT TABLES
    # =========================================================================
    with tab_bench:
        st.subheader("Empirical Benchmark Analytics (Table 20 & Publication Figures)")
        TABLES_DIR = Path(__file__).parent.parent / "results" / "tables"
        FIGURES_DIR = Path(__file__).parent.parent / "results" / "figures"

        t20_file = TABLES_DIR / "table20_performance_comparison.md"
        if t20_file.exists():
            st.markdown("### Table 20: Performance Comparison (1,000 Trials)")
            st.markdown(t20_file.read_text())

        # Render figures in 2-column layout
        st.markdown("### High-Resolution Publication Plots (300 DPI)")
        fig_files = sorted(FIGURES_DIR.glob("*.png"))
        if fig_files:
            for i in range(0, len(fig_files), 2):
                col_f1, col_f2 = st.columns(2)
                with col_f1:
                    st.image(str(fig_files[i]), caption=fig_files[i].stem, use_container_width=True)
                if i + 1 < len(fig_files):
                    with col_f2:
                        st.image(str(fig_files[i + 1]), caption=fig_files[i + 1].stem, use_container_width=True)

    # =========================================================================
    # TAB 7: TAMPER-EVIDENT AUDIT TRAIL
    # =========================================================================
    with tab_audit:
        st.subheader("Tamper-Evident SHA-256 Chained Audit Trail")
        if chain_valid:
            st.success("✅ Audit Hash Chain: 100% INTACT (Zero Tampering Detected)")
        else:
            st.error(f"❌ Hash Chain Compromised at Index #{break_idx}")

        events = db.get_audit_log(200)
        if events:
            df_ev = pd.DataFrame(events)
            st.dataframe(df_ev, use_container_width=True, height=450)


if __name__ == "__main__":
    main()
