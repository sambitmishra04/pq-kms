#!/usr/bin/env bash
# Standalone Attack & Penetration Lab runner script
# Runs independently from the hospital production server
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

python scripts/run_attack_lab.py
