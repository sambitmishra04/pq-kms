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
    echo "[Dashboard] Starting Streamlit dashboard..."
    streamlit run dashboard/app.py --server.port 8501
    ;;
  data)
    activate
    cd "$PROJ"
    python experiments/download_data.py
    ;;
  all)
    bash "$0" test
    bash "$0" bench
    echo "[All] Done. Start server with: bash run.sh server"
    echo "      Start dashboard with: bash run.sh dashboard"
    ;;
  *)
    echo "Usage: bash run.sh [setup|server|test|bench|dashboard|data|all]"
    echo ""
    echo "  setup      — create venv, install dependencies, download data"
    echo "  server     — start the FastAPI PQ-KMS server"
    echo "  test       — run full pytest security + functional test suite"
    echo "  bench      — run all benchmark experiments, generate tables & figures"
    echo "  dashboard  — start the Streamlit monitoring dashboard"
    echo "  data       — download/generate biomedical vitals data"
    echo "  all        — run tests + benchmarks"
    ;;
esac
