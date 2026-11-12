#!/usr/bin/env bash
# PQ-KMS: Production Unified Server Launch Script
# Starts FastAPI serving both REST APIs and the React Security Console on http://127.0.0.1:8000
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================================"
echo "  PQ-KMS: Post-Quantum Key Management System (Hospital Operations)"
echo "  Algorithms: NIST FIPS 203 ML-KEM-768 | NIST FIPS 204 ML-DSA-65"
echo "======================================================================"

# Activate virtual environment
if [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "[!] .venv directory not found. Please activate your virtualenv."
fi

# Ensure default users are seeded
python scripts/seed_users.py

# Build frontend if dist doesn't exist
if [ ! -d "frontend/dist" ]; then
    echo "[*] Building React frontend..."
    cd frontend && npm run build && cd ..
fi

echo ""
echo "[✓] Launching Unified Security Operations Console on http://127.0.0.1:8000"
echo "    - Web Console:          http://127.0.0.1:8000/"
echo "    - OpenAPI Docs:         http://127.0.0.1:8000/docs"
echo "    - Operator Accounts:    admin / admin123        (IT Security Administrator)"
echo "                            dr.sharma / doctor123    (Attending Clinician)"
echo "                            auditor / audit123      (Forensic Compliance Auditor)"
echo ""
echo "    - Standalone Attack Lab: Run './run_attack_lab.sh' in a separate terminal"
echo ""

exec python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
