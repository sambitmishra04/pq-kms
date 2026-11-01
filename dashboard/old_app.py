"""
PQ-KMS Monitoring Dashboard (Streamlit) — Classic / Original UI.
Shows real backend state — device registry, sessions, audit log, benchmark results.
No key material is ever displayed.

Run: streamlit run dashboard/old_app.py
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from app.database.db import Database
from app.config import DATABASE_PATH, KEM_ALG, SIG_ALG, SESSION_LIFETIME_S

st.set_page_config(
    page_title="PQ-KMS Dashboard (Classic)",
    page_icon="🔐",
    layout="wide",
    initial_sidebar_state="expanded",
)


@st.cache_resource
def get_database() -> Database:
    return Database(DATABASE_PATH)


def main() -> None:
    st.title("🔐 PQ-KMS — Post-Quantum Key Management System (Classic UI)")
    st.caption(
        f"Algorithm: **{KEM_ALG}** (KEM) + **{SIG_ALG}** (Signatures) + AES-256-GCM | "
        f"Session lifetime: **{SESSION_LIFETIME_S}s**"
    )

    db = get_database()

    # ─── Sidebar ─────────────────────────────────────────────────────────────
    with st.sidebar:
        st.header("⚙️ System Info")
        env_path = Path(__file__).parent.parent / "results" / "environment.json"
        if env_path.exists():
            env = json.loads(env_path.read_text())
            st.json(env)
        else:
            st.info("Run experiments to see environment info.")

        st.divider()
        if st.button("🔄 Refresh Dashboard"):
            st.cache_resource.clear()
            st.rerun()

    # ─── Tabs ─────────────────────────────────────────────────────────────────
    tab1, tab2, tab3, tab4, tab5 = st.tabs([
        "📋 Devices", "🔑 Sessions", "📜 Audit Log", "📊 Benchmarks", "🛡️ Security"
    ])

    # ── Tab 1: Devices ───────────────────────────────────────────────────────
    with tab1:
        st.subheader("Registered Devices")
        devices = db.get_all_devices()
        if devices:
            df = pd.DataFrame(devices)
            # Strip binary key columns for display
            for col in ["kem_public_key", "sig_public_key", "enrolment_code_hash"]:
                if col in df.columns:
                    df.drop(columns=[col], inplace=True)
            st.dataframe(df, use_container_width=True)

            status_counts = df["status"].value_counts()
            col1, col2, col3 = st.columns(3)
            col1.metric("Total Devices", len(df))
            col2.metric("Authorized", int(status_counts.get("AUTHORIZED", 0)))
            col3.metric("Revoked", int(status_counts.get("REVOKED", 0)))

            fig = px.pie(df, names="status", title="Device Status Distribution",
                         color_discrete_map={"AUTHORIZED": "#22c55e", "REVOKED": "#ef4444",
                                             "PENDING": "#f59e0b", "DISABLED": "#6b7280"})
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No devices registered yet.")

    # ── Tab 2: Sessions ──────────────────────────────────────────────────────
    with tab2:
        st.subheader("Session Key Lifecycle")
        sessions = db.get_all_sessions()
        if sessions:
            df = pd.DataFrame(sessions)
            st.dataframe(df, use_container_width=True)

            state_counts = df["state"].value_counts()
            cols = st.columns(len(state_counts))
            for i, (state, count) in enumerate(state_counts.items()):
                cols[i].metric(state, int(count))

            fig = px.bar(df.groupby("state").size().reset_index(name="count"),
                         x="state", y="count", title="Sessions by State",
                         color="state",
                         color_discrete_map={"ACTIVE": "#22c55e", "DEACTIVATED": "#f59e0b",
                                             "DESTROYED": "#6b7280", "COMPROMISED": "#ef4444"})
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No sessions created yet.")

    # ── Tab 3: Audit Log ─────────────────────────────────────────────────────
    with tab3:
        st.subheader("Tamper-Evident Audit Log")
        chain_valid, break_idx = db.verify_audit_chain()
        if chain_valid:
            st.success("✅ Hash chain integrity: VALID")
        else:
            st.error(f"❌ Hash chain BROKEN at index {break_idx}")

        events = db.get_audit_log(500)
        if events:
            df = pd.DataFrame(events)
            outcome_filter = st.multiselect(
                "Filter by outcome:", options=df["outcome"].unique().tolist(),
                default=df["outcome"].unique().tolist()
            )
            df_filtered = df[df["outcome"].isin(outcome_filter)]
            st.dataframe(df_filtered, use_container_width=True, height=400)

            outcome_counts = df["outcome"].value_counts()
            fig = px.pie(names=outcome_counts.index, values=outcome_counts.values,
                         title="Audit Outcomes",
                         color_discrete_map={"ACCEPTED": "#22c55e", "REJECTED": "#ef4444",
                                             "INFO": "#3b82f6"})
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No audit events yet.")

    # ── Tab 4: Benchmarks ────────────────────────────────────────────────────
    with tab4:
        st.subheader("Benchmark Results")
        TABLES_DIR = Path(__file__).parent.parent / "results" / "tables"
        FIGURES_DIR = Path(__file__).parent.parent / "results" / "figures"

        e1_path = TABLES_DIR / "e1_primitive_benchmarks.csv"
        if e1_path.exists():
            df_e1 = pd.read_csv(e1_path)
            st.markdown("### E1: Primitive Operation Timings")
            st.dataframe(df_e1, use_container_width=True)

            fig = px.bar(df_e1[df_e1["operation"].isin(["keygen", "encap", "decap", "agree"])],
                         x="operation", y="mean_us", color="algorithm", barmode="group",
                         error_y="sd_us",
                         title="Key Establishment: Mean Time (µs) by Algorithm",
                         labels={"mean_us": "Mean (µs)", "operation": "Operation"})
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("Run `python experiments/generate_results.py` to populate benchmarks.")

        t20_path = TABLES_DIR / "table20_performance_comparison.md"
        if t20_path.exists():
            st.markdown("### Table 20: Performance Comparison")
            st.markdown(t20_path.read_text())

        # Show saved figures
        figs = sorted(FIGURES_DIR.glob("*.png"))
        if figs:
            st.markdown("### Publication Figures")
            for fig_path in figs:
                st.image(str(fig_path), caption=fig_path.stem, use_container_width=True)

    # ── Tab 5: Security Overview ─────────────────────────────────────────────
    with tab5:
        st.subheader("Security Test Results")
        t15_path = TABLES_DIR / "table15_security_test_cases.csv"
        if t15_path.exists():
            df_t15 = pd.read_csv(t15_path)
            st.dataframe(df_t15, use_container_width=True)
        else:
            st.info("Run `pytest tests/ --tb=short -v` then `python experiments/generate_results.py` to populate.")

        st.subheader("Revocation List")
        crl = db.get_latest_revocation_list()
        if crl:
            st.json({
                "version": crl["list_version"],
                "issued_at": crl["issued_at"],
                "revoked_devices": crl["device_ids"],
                "signature_preview": crl["signature"].hex()[:32] + "..." if isinstance(crl["signature"], bytes) else crl["signature"][:32] + "...",
            })
        else:
            st.info("No revocation list issued yet.")

        msg_stats = db.get_message_stats()
        if msg_stats:
            st.subheader("Message Processing Statistics")
            cols = st.columns(len(msg_stats))
            for i, (outcome, count) in enumerate(msg_stats.items()):
                cols[i].metric(outcome, count)


if __name__ == "__main__":
    main()
