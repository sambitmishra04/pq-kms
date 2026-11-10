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
  dashboard-react|dashboard-medical)
    activate
    cd "$PROJ"
    echo "[Dashboard] Building and starting Production-Grade Medical Biochip Admin React UI..."
    node dashboard/react_ui/build.cjs
    python -m dashboard.server --port "${REACT_DASHBOARD_PORT:-8502}"
    ;;
  dashboard-v1|dashboard-old)
    activate
    cd "$PROJ"
    echo "[Dashboard] Starting Saved V1 Clean React UI Dashboard..."
    if [ -f "$PROJ/dashboard/react_ui/src/App.v1.jsx" ]; then
      node -e '
        const fs = require("fs");
        const vm = require("vm");
        const src = fs.readFileSync("dashboard/react_ui/src/App.v1.jsx", "utf8");
        const babelCode = fs.readFileSync("dashboard/react_ui/assets/vendor/babel.min.js", "utf8");
        const context = { window: {}, console };
        vm.createContext(context);
        vm.runInContext(babelCode, context);
        const Babel = context.Babel || context.window.Babel;
        const processed = src.replace(/import\s+React.*?from\s+["\x27][^"\x27]+["\x27];?/g, "").replace(/export\s+default\s+function\s+App/g, "function App");
        const transformed = Babel.transform(processed, { presets: ["react"] });
        const bundle = `(function() { const { useState, useEffect, useRef, useMemo } = React;\n${transformed.code}\nconst rootElement = document.getElementById("root"); if (rootElement) { ReactDOM.createRoot(rootElement).render(React.createElement(App)); } })();`;
        fs.writeFileSync("dashboard/react_ui/dist/assets/app.bundle.js", bundle);
      '
    fi
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
    echo "Usage: bash run.sh [setup|server|test|bench|dashboard|dashboard-react|dashboard-v1|dashboard-old-streamlit|data|demo|slides|report|all]"
    echo ""
    echo "  setup                   — create venv, install dependencies, download data"
    echo "  server                  — start the FastAPI PQ-KMS server"
    echo "  test                    — run full pytest security + functional test suite (23 tests)"
    echo "  bench                   — run all benchmark experiments, generate tables & figures"
    echo "  dashboard               — start the Streamlit Medical SOC & Biochip simulator dashboard"
    echo "  dashboard-react         — start the Production-Grade Medical Biochip Admin React UI (port 8502)"
    echo "  dashboard-v1            — start the Saved V1 Clean React UI Dashboard (port 8502)"
    echo "  dashboard-old-streamlit — start the original/classic Streamlit dashboard (before-change version)"
    echo "  data          — download/generate biomedical vitals data"
    echo "  demo          — run one-click automated live evaluator demonstration"
    echo "  slides        — display location of interactive presentation slide deck"
    echo "  report        — generate publication-ready LaTeX Chapter 8"
    echo "  all           — run tests + benchmarks + report"
    ;;
esac
