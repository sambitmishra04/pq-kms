#!/usr/bin/env bash
# PQ-KMS — one-command setup and run script
# Usage: bash run.sh [server|test|bench|dashboard|all]

set -euo pipefail
PROJ="$(cd "$(dirname "$0")" && pwd)"
VENV="$PROJ/.venv"
OQS_LIB="$HOME/_oqs/lib"

activate() {
    source "$VENV/bin/activate"
    export LD_LIBRARY_PATH="$OQS_LIB:${LD_LIBRARY_PATH:-}"
    export PATH="$VENV/bin:$PATH"
}

cmd="${1:-help}"

case "$cmd" in
  setup)
    echo "[Setup] Creating virtual environment..."
    python3 -m venv "$VENV"
    activate
    pip install --upgrade pip -q
    pip install cmake ninja -q
    pip install -r "$PROJ/requirements.txt" -q
    echo "[Setup] Downloading/generating data..."
    python experiments/download_data.py
    echo "[Setup] Done. Run: bash run.sh server"
    ;;
  server)
    activate
    cd "$PROJ"
    echo "[Server] Starting PQ-KMS API server..."
    python -m app.main
    ;;
  test)
    activate
    cd "$PROJ"
    echo "[Test] Running full test suite..."
    pytest tests/ -v --tb=short 2>&1 | tee results/test_output.txt
    echo "[Test] Results saved to results/test_output.txt"
    ;;
  bench)
    activate
    cd "$PROJ"
    echo "[Bench] Running all experiments and generating results..."
    python experiments/generate_results.py
    ;;
  dashboard)
    activate
    cd "$PROJ"
    echo "[Dashboard] Starting Streamlit Medical SOC & Biochip Simulator Dashboard..."
    streamlit run dashboard/app.py --server.port 8501
    ;;
  dashboard-old|dashboard-react)
    activate
    cd "$PROJ"
    echo "[Dashboard] Starting Modern Clean Interactive React UI Dashboard..."
    python -m dashboard.server --port "${REACT_DASHBOARD_PORT:-8502}"
    ;;
  dashboard-old-streamlit|dashboard-classic-streamlit)
    activate
    cd "$PROJ"
    echo "[Dashboard] Starting Original/Classic Streamlit Dashboard (Before-Change Version)..."
    streamlit run dashboard/old_app.py --server.port 8501
    ;;
  data)
    activate
    cd "$PROJ"
    python experiments/download_data.py
    ;;
  demo)
    activate
    cd "$PROJ"
    echo "[Demo] Running live evaluator presentation demo..."
    python experiments/run_live_demo.py
    ;;
  slides)
    echo "[Slides] Presentation slide deck ready at:"
    echo "  file://$PROJ/results/presentation/index.html"
    echo "Open the above file in your web browser (Chrome/Firefox/Edge) for the defense presentation."
    ;;
  report)
    activate
    cd "$PROJ"
    echo "[Report] Generating publication-quality LaTeX Chapter 8..."
    python experiments/generate_latex_report.py
    echo "[Report] Chapter 8 LaTeX generated at: results/latex/chapter8_results.tex"
    ;;
  all)
    bash "$0" test
    bash "$0" bench
    bash "$0" report
    echo "[All] Done. Start server with: bash run.sh server"
    echo "      Start dashboard with: bash run.sh dashboard"
    echo "      View presentation:    bash run.sh slides"
    ;;
  *)
    echo "Usage: bash run.sh [setup|server|test|bench|dashboard|dashboard-old|dashboard-old-streamlit|data|demo|slides|report|all]"
    echo ""
    echo "  setup                   — create venv, install dependencies, download data"
    echo "  server                  — start the FastAPI PQ-KMS server"
    echo "  test                    — run full pytest security + functional test suite (23 tests)"
    echo "  bench                   — run all benchmark experiments, generate tables & figures"
    echo "  dashboard               — start the Streamlit Medical SOC & Biochip simulator dashboard"
    echo "  dashboard-old           — start the modern clean interactive React UI dashboard (replaced old UI)"
    echo "  dashboard-old-streamlit — start the original/classic Streamlit dashboard (before-change version)"
    echo "  data          — download/generate biomedical vitals data"
    echo "  demo          — run one-click automated live evaluator demonstration"
    echo "  slides        — display location of interactive presentation slide deck"
    echo "  report        — generate publication-ready LaTeX Chapter 8"
    echo "  all           — run tests + benchmarks + report"
    ;;
esac
