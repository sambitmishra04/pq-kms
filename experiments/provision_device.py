#!/usr/bin/env python3
"""
PQ-KMS Device Provisioning & Key Generation CLI (Algorithm 1).
Allows administrators and evaluators to provision a new DMFB device,
generate its ML-KEM-768 and ML-DSA-65 post-quantum keypairs,
sign a proof-of-possession, and register it in the PQ-KMS registry.

Usage:
    python experiments/provision_device.py --id DMFB-LAB-01 --role CLINICAL_ANALYZER
    python experiments/provision_device.py  (interactive prompt)
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
from pathlib import Path

# Ensure liboqs is found
_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import CTX_REG, KEM_ALG, SIG_ALG
from app.crypto.kem import generate_kem_keypair
from app.crypto.sig import generate_sig_keypair, sign as sig_sign
from app.database.db import get_db
from app.device_management.registry import create_enrolment_code, register_device

# ANSI Terminal Colors
BOLD = "\033[1m"
GREEN = "\033[92m"
CYAN = "\033[96m"
YELLOW = "\033[93m"
MAGENTA = "\033[95m"
RESET = "\033[0m"


def provision(device_id: str, role: str, export_keys_path: str | None = None) -> dict:
    print(f"\n{CYAN}{'=' * 68}{RESET}")
    print(f"{BOLD}{MAGENTA}  ▶ PROVISIONING NEW BIOCHIP: {device_id} ({role}){RESET}")
    print(f"{CYAN}{'=' * 68}{RESET}\n")

    # Step 1: Admin generates one-time enrolment code
    print(f"{BOLD}[Step 1/4]{RESET} Admin generating one-time enrolment code...")
    enrolment_code = create_enrolment_code(device_id, role=role)
    print(f"  ✓ Issued Enrolment Code: {YELLOW}{enrolment_code}{RESET}")

    # Step 2: Device generates post-quantum keypairs locally
    print(f"\n{BOLD}[Step 2/4]{RESET} Generating post-quantum keypairs (NIST FIPS 203 & 204)...")
    t0 = time.perf_counter()
    kem_pk, kem_sk_obj = generate_kem_keypair(KEM_ALG)
    t_kem = (time.perf_counter() - t0) * 1000

    t1 = time.perf_counter()
    sig_pk, sig_sk = generate_sig_keypair(SIG_ALG)
    t_sig = (time.perf_counter() - t1) * 1000

    print(f"  ✓ Generated {BOLD}{KEM_ALG}{RESET} (KEM):")
    print(f"      Public Key Length:  {GREEN}{len(kem_pk)} bytes{RESET} (in {t_kem:.2f} ms)")
    print(f"      Preview:            {kem_pk.hex()[:32]}...")
    print(f"  ✓ Generated {BOLD}{SIG_ALG}{RESET} (Signatures):")
    print(f"      Verify Key Length:  {GREEN}{len(sig_pk)} bytes{RESET} (in {t_sig:.2f} ms)")
    print(f"      Preview:            {sig_pk.hex()[:32]}...")

    # Step 3: Compute Algorithm 1 proof-of-possession signature
    print(f"\n{BOLD}[Step 3/4]{RESET} Computing proof-of-possession signature...")
    proof_message = device_id.encode("utf-8") + kem_pk + sig_pk
    proof_sig = sig_sign(sig_sk, proof_message, CTX_REG, SIG_ALG)
    print(f"  ✓ Proof Signature Length: {GREEN}{len(proof_sig)} bytes{RESET}")
    print(f"  ✓ Domain Context:          {CYAN}{CTX_REG.decode()}{RESET}")

    # Step 4: Register device in PQ-KMS registry
    print(f"\n{BOLD}[Step 4/4]{RESET} Submitting registration to PQ-KMS database...")
    register_device(
        device_id=device_id,
        enrolment_code=enrolment_code,
        kem_public_key=kem_pk,
        sig_public_key=sig_pk,
        proof_signature=proof_sig,
        sig_algorithm=SIG_ALG,
    )

    db = get_db()
    record = db.get_device(device_id)
    ts = record.get("enrolled_at") or record.get("registered_at") or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    print(f"  ✓ Registered Device Status: {GREEN}{record['status']}{RESET}")
    print(f"  ✓ Registered Timestamp:     {ts}")
    print(f"  ✓ Tamper-Evident Audit:    {GREEN}Event REGISTRATION logged to hash chain{RESET}")

    # Optional export of keys to JSON file
    if export_keys_path:
        out_file = Path(export_keys_path)
        out_file.write_text(
            json.dumps({
                "device_id": device_id,
                "role": role,
                "registered_at": ts,
                "kem_algorithm": KEM_ALG,
                "kem_public_key_b64": base64.b64encode(kem_pk).decode(),
                "sig_algorithm": SIG_ALG,
                "sig_public_key_b64": base64.b64encode(sig_pk).decode(),
                "sig_secret_key_b64": base64.b64encode(sig_sk).decode(),
            }, indent=2)
        )
        print(f"\n{GREEN}✔ Keypair safely exported to {out_file.resolve()}{RESET}")

    print(f"\n{GREEN}{BOLD}🎉 Success! Device '{device_id}' is AUTHORIZED and visible in dashboard.{RESET}\n")

    return {
        "device_id": device_id,
        "role": role,
        "status": record["status"],
        "enrolment_code": enrolment_code,
        "kem_public_key_hex": kem_pk.hex(),
        "sig_public_key_hex": sig_pk.hex(),
        "registered_at": ts,
    }


def main():
    parser = argparse.ArgumentParser(description="PQ-KMS Device Provisioning CLI")
    parser.add_argument("--id", dest="device_id", help="Device ID (e.g. DMFB-LAB-01)")
    parser.add_argument("--role", default="BIOCHIP_NODE", help="Device Role (default: BIOCHIP_NODE)")
    parser.add_argument("--export", dest="export_path", help="Optional path to save keys JSON file")
    args = parser.parse_args()

    dev_id = args.device_id
    if not dev_id:
        print(f"{CYAN}--- PQ-KMS Interactive Device Provisioning ---{RESET}")
        dev_id = input("Enter Device ID (e.g. DMFB-NODE-01): ").strip()
        if not dev_id:
            dev_id = f"DMFB-MANUAL-{os.urandom(2).hex().upper()}"
            print(f"Using generated ID: {dev_id}")

        role_input = input("Enter Role [BIOCHIP_NODE / CLINICAL_ANALYZER / GLUCOSE_MONITOR]: ").strip()
        role = role_input if role_input else "BIOCHIP_NODE"
    else:
        role = args.role

    try:
        provision(dev_id, role, args.export_path)
    except Exception as exc:
        print(f"{BOLD}\033[91mError: {exc}{RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()
