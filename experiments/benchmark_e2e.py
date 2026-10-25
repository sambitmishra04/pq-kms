"""
E3 & E4: End-to-end session + message latency, wire bytes, signature scaling.
"""
from __future__ import annotations

import base64
import csv
import os
import sys
import time
import uuid
from pathlib import Path

_oqs_lib = Path.home() / "_oqs" / "lib"
if _oqs_lib.exists():
    os.environ["LD_LIBRARY_PATH"] = f"{_oqs_lib}:{os.environ.get('LD_LIBRARY_PATH','')}"

sys.path.insert(0, str(Path(__file__).parent.parent))

import numpy as np
from fastapi.testclient import TestClient

os.environ["DATABASE_PATH"] = "/tmp/bench_pqkms.db"
os.environ["SERVER_KEY_PATH"] = "/tmp/bench_server_keys.json"
os.environ["SESSION_LIFETIME_S"] = "3600"
os.environ["ADMIN_TOKEN"] = "bench-admin-token"
Path("/tmp/bench_pqkms.db").unlink(missing_ok=True)
Path("/tmp/bench_pqkms.db-wal").unlink(missing_ok=True)
Path("/tmp/bench_pqkms.db-shm").unlink(missing_ok=True)
Path("/tmp/bench_server_keys.json").unlink(missing_ok=True)

from app.main import app
from app.config import KEM_ALG, SIG_ALG, IV_ROLE_CLIENT, CTX_REG, CTX_SREQ, NONCE_C_BYTES
from app.crypto.kdf import derive_session_key
from app.crypto.kem import decapsulate, generate_kem_keypair
from app.crypto.sig import generate_sig_keypair, sign as sig_sign, verify as sig_verify
from app.crypto.aead import encrypt as aead_encrypt
from app.crypto.classical import (
    x25519_generate_keypair, x25519_agree,
    ed25519_generate_keypair, ed25519_sign,
)
from app.simulation.workloads import generate_payload

RESULTS_DIR = Path(__file__).parent.parent / "results" / "tables"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

from app.config import ADMIN_TOKEN

ADMIN_HDR = {"X-Admin-Token": ADMIN_TOKEN}
PAYLOAD_SIZES = [128, 1024, 10240]
E3_TRIALS = 100
E4_TRIALS = 200


def ns() -> int:
    return time.perf_counter_ns()


def stats(samples: list[int]) -> dict:
    a = np.array(samples, dtype=np.float64)
    return {
        "mean_ms": float(np.mean(a)) / 1e6,
        "sd_ms": float(np.std(a)) / 1e6,
        "median_ms": float(np.median(a)) / 1e6,
        "p95_ms": float(np.percentile(a, 95)) / 1e6,
        "trials": len(samples),
    }


def _enrol_register(client: TestClient, device_id: str) -> dict:
    """Register a device and return keys."""
    resp = client.post("/enrol", json={"device_id": device_id}, headers=ADMIN_HDR)
    assert resp.status_code == 200, f"Enrol failed: {resp.text}"
    code = resp.json()["enrolment_code"]
    kem_pk, kem_obj = generate_kem_keypair(KEM_ALG)
    sig_pk, sig_sk = generate_sig_keypair(SIG_ALG)
    message = device_id.encode() + kem_pk + sig_pk
    proof = sig_sign(sig_sk, message, CTX_REG, SIG_ALG)
    reg_resp = client.post("/register", json={
        "device_id": device_id,
        "enrolment_code": code,
        "kem_public_key_b64": base64.b64encode(kem_pk).decode(),
        "sig_public_key_b64": base64.b64encode(sig_pk).decode(),
        "proof_signature_b64": base64.b64encode(proof).decode(),
        "sig_algorithm": SIG_ALG,
    })
    assert reg_resp.status_code == 200, f"Register failed: {reg_resp.text}"
    return {"device_id": device_id, "kem_pk": kem_pk, "kem_obj": kem_obj,
            "sig_pk": sig_pk, "sig_sk": sig_sk}


def pqc_session_and_message(client: TestClient, info: dict, payload: bytes) -> tuple[int, int, int]:
    """
    Run one full PQC session establishment + one message.
    Returns (session_ns, message_ns, wire_bytes).
    """
    from app.main import get_server_sig_key
    from app.config import CTX_SRESP

    t0 = ns()
    nonce_c = os.urandom(NONCE_C_BYTES)
    timestamp = time.time()
    message = info["device_id"].encode() + nonce_c + str(timestamp).encode()
    sig = sig_sign(info["sig_sk"], message, CTX_SREQ, SIG_ALG)

    session_req_body = {
        "device_id": info["device_id"],
        "nonce_c_b64": base64.b64encode(nonce_c).decode(),
        "timestamp": timestamp,
        "signature_b64": base64.b64encode(sig).decode(),
        "sig_algorithm": SIG_ALG,
        "kem_algorithm": KEM_ALG,
    }
    resp = client.post("/session", json=session_req_body)
    data = resp.json()
    session_ns = ns() - t0

    session_id = data["session_id"]
    ct = base64.b64decode(data["ciphertext_b64"])
    shared_secret = decapsulate(info["kem_obj"], ct)
    session_key = derive_session_key(shared_secret, nonce_c, info["device_id"], session_id)

    # Wire bytes for session establishment
    wire_session = (
        len(base64.b64encode(sig)) +  # session request sig
        len(base64.b64encode(ct)) +   # KEM ciphertext in response
        len(base64.b64encode(base64.b64decode(data["server_signature_b64"])))  # server sig
    )

    # Message
    t1 = ns()
    counter = 1
    msg_id = str(uuid.uuid4())
    ct_msg, nonce_msg = aead_encrypt(
        key=session_key, plaintext=payload,
        role=IV_ROLE_CLIENT, counter=counter,
        device_id=info["device_id"], session_id=session_id, message_id=msg_id,
    )
    resp = client.post("/message", json={
        "device_id": info["device_id"], "session_id": session_id,
        "message_id": msg_id, "counter": counter,
        "ciphertext_b64": base64.b64encode(ct_msg).decode(),
        "nonce_b64": base64.b64encode(nonce_msg).decode(),
    })
    message_ns = ns() - t1

    wire_msg = len(ct_msg)
    return session_ns, message_ns, wire_session + wire_msg


def classical_session_simulation(payload: bytes) -> tuple[int, int, int]:
    """
    Simulate classical X25519+Ed25519 session + message (no server needed for timing).
    Returns (session_ns, message_ns, wire_bytes).
    """
    from app.crypto.kdf import derive_session_key
    from app.crypto.aead import encrypt as aead_encrypt
    from app.config import IV_ROLE_CLIENT

    # Client keygen
    t0 = ns()
    client_pub, client_priv = x25519_generate_keypair()
    ed_pub, ed_priv = ed25519_generate_keypair()

    # "Server" side: generate own X25519 keypair and agree
    server_pub, server_priv = x25519_generate_keypair()
    shared_secret = x25519_agree(client_priv, server_pub)

    nonce_c = os.urandom(16)
    session_id = str(uuid.uuid4())
    device_id = "classical-bench"
    session_key = derive_session_key(shared_secret, nonce_c, device_id, session_id)

    # Signature (client signs request, server signs response)
    msg_to_sign = device_id.encode() + nonce_c + str(time.time()).encode()
    client_sig = ed25519_sign(ed_priv, msg_to_sign, CTX_SREQ)
    server_ed_pub, server_ed_priv = ed25519_generate_keypair()
    server_sig = ed25519_sign(server_ed_priv, b"response" + session_id.encode(), CTX_SREQ)
    session_ns = ns() - t0

    wire_session = len(client_sig) + len(client_pub) + len(server_sig)  # approximate

    t1 = ns()
    counter = 1
    msg_id = str(uuid.uuid4())
    ct_msg, nonce_msg = aead_encrypt(
        key=session_key, plaintext=payload,
        role=IV_ROLE_CLIENT, counter=counter,
        device_id=device_id, session_id=session_id, message_id=msg_id,
    )
    message_ns = ns() - t1

    return session_ns, message_ns, wire_session + len(ct_msg)


def run_e3_e4() -> list[dict]:
    rows = []
    run_id = str(uuid.uuid4())[:8]

    with TestClient(app) as client:
        print("\n=== E3: End-to-end session + message latency ===")
        for size in PAYLOAD_SIZES:
            payload = generate_payload(size)
            print(f"  Payload {size}B:", end=" ", flush=True)

            pqc_sessions, pqc_msgs, pqc_wires = [], [], []
            for i in range(E3_TRIALS):
                did = f"e3-pqc-{size}-{i}-{uuid.uuid4().hex[:4]}"
                info = _enrol_register(client, did)
                s_ns, m_ns, w = pqc_session_and_message(client, info, payload)
                pqc_sessions.append(s_ns)
                pqc_msgs.append(m_ns)
                pqc_wires.append(w)

            cl_sessions, cl_msgs, cl_wires = [], [], []
            for _ in range(E3_TRIALS):
                s_ns, m_ns, w = classical_session_simulation(payload)
                cl_sessions.append(s_ns)
                cl_msgs.append(m_ns)
                cl_wires.append(w)

            def s(lst): return stats(lst)

            rows.append({"run_id": run_id, "experiment": "E3", "path": "PQC",
                         "payload_bytes": size, "metric": "session_ms", **s(pqc_sessions)})
            rows.append({"run_id": run_id, "experiment": "E3", "path": "PQC",
                         "payload_bytes": size, "metric": "message_ms", **s(pqc_msgs)})
            rows.append({"run_id": run_id, "experiment": "E3", "path": "Classical",
                         "payload_bytes": size, "metric": "session_ms", **s(cl_sessions)})
            rows.append({"run_id": run_id, "experiment": "E3", "path": "Classical",
                         "payload_bytes": size, "metric": "message_ms", **s(cl_msgs)})
            rows.append({"run_id": run_id, "experiment": "E3", "path": "PQC",
                         "payload_bytes": size, "metric": "wire_bytes",
                         "mean_ms": float(np.mean(pqc_wires)), "sd_ms": 0, "median_ms": 0,
                         "p95_ms": 0, "trials": E3_TRIALS})
            rows.append({"run_id": run_id, "experiment": "E3", "path": "Classical",
                         "payload_bytes": size, "metric": "wire_bytes",
                         "mean_ms": float(np.mean(cl_wires)), "sd_ms": 0, "median_ms": 0,
                         "p95_ms": 0, "trials": E3_TRIALS})
            print("done")

    # E4: signature scaling
    print("\n=== E4: Signature scaling with payload size ===")
    import oqs
    for alg, label in [("ML-DSA-65", "PQC"), ("Ed25519", "Classical")]:
        for size in [1024, 10240]:
            payload = os.urandom(size)
            ctx = CTX_SREQ
            print(f"  {alg} sign/verify {size}B:", end=" ", flush=True)

            if label == "PQC":
                sig_obj = oqs.Signature(alg)
                pk = sig_obj.generate_keypair()
                sk = sig_obj.export_secret_key()
                signed_bytes = ctx + len(payload).to_bytes(4, "big") + payload

                samples_sign = []
                for _ in range(E4_TRIALS):
                    t0 = ns()
                    oqs.Signature(alg, sk).sign(signed_bytes)
                    samples_sign.append(ns() - t0)

                sig_val = oqs.Signature(alg, sk).sign(signed_bytes)
                samples_verify = []
                for _ in range(E4_TRIALS):
                    t0 = ns()
                    oqs.Signature(alg).verify(signed_bytes, sig_val, pk)
                    samples_verify.append(ns() - t0)
            else:
                ed_pub, ed_priv = ed25519_generate_keypair()
                samples_sign = []
                for _ in range(E4_TRIALS):
                    t0 = ns()
                    ed25519_sign(ed_priv, payload, ctx)
                    samples_sign.append(ns() - t0)
                sig_val = ed25519_sign(ed_priv, payload, ctx)
                samples_verify = []
                for _ in range(E4_TRIALS):
                    t0 = ns()
                    from app.crypto.classical import ed25519_verify
                    ed25519_verify(ed_pub, payload, sig_val, ctx)
                    samples_verify.append(ns() - t0)

            rows.append({"run_id": run_id, "experiment": "E4", "path": label,
                         "payload_bytes": size, "metric": "sign_ms", **stats(samples_sign)})
            rows.append({"run_id": run_id, "experiment": "E4", "path": label,
                         "payload_bytes": size, "metric": "verify_ms", **stats(samples_verify)})
            print("done")

    path = RESULTS_DIR / "e3_e4_latency.csv"
    with open(path, "w", newline="", encoding="utf-8") as f:
        if rows:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
    print(f"[E3/E4] Saved → {path}")
    return rows


if __name__ == "__main__":
    run_e3_e4()
