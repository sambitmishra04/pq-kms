#!/usr/bin/env bash
# PQ-KMS: Development Dual-Server Launch Script
# Runs FastAPI backend on :8000 and Vite React HMR on :5173
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Seed users
python scripts/seed_users.py

echo "[*] Starting FastAPI Backend on http://127.0.0.1:8000..."
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

echo "[*] Starting Vite React Dev Server on http://localhost:5173..."
cd frontend && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT INT TERM

wait
