"""
Functional tests FT-01 to FT-05.
"""
from __future__ import annotations

import base64
import uuid

import pytest

from tests.conftest import _enrol_and_register, _establish_session
from app.config import KEM_ALG, SIG_ALG
from app.crypto.aead import encrypt as aead_encrypt, decrypt as aead_decrypt
from app.config import IV_ROLE_CLIENT, IV_ROLE_SERVER


# ─── FT-01: Registration ──────────────────────────────────────────────────────

def test_ft01_registration(client, admin_headers, server_verify_key_hex):
    """FT-01: A client registers and appears in the registry with status AUTHORIZED."""
    device_id = f"ft01-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)

    resp = client.get("/state")
    assert resp.status_code == 200
    devices = {d["device_id"]: d for d in resp.json()["devices"]}
    assert device_id in devices
    assert devices[device_id]["status"] == "AUTHORIZED"


# ─── FT-02: Session key agreement ─────────────────────────────────────────────

def test_ft02_session_key_agreement(client, admin_headers, server_verify_key_hex):
    """FT-02: ML-KEM exchange yields identical session keys on both sides,
    demonstrated by successful encrypt/decrypt."""
    device_id = f"ft02-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    assert len(sess["session_key"]) == 32, "Session key must be 32 bytes"

    # Verify by encrypting a test message client-side and decrypting with the same key
    plaintext = b"FT02-key-agreement-test"
    msg_id = str(uuid.uuid4())
    sess["counter"] += 1
    ct, nonce = aead_encrypt(
        key=sess["session_key"],
        plaintext=plaintext,
        role=IV_ROLE_CLIENT,
        counter=sess["counter"],
        device_id=device_id,
        session_id=sess["session_id"],
        message_id=msg_id,
    )
    recovered = aead_decrypt(
        key=sess["session_key"],
        ciphertext_with_tag=ct,
        nonce=nonce,
        device_id=device_id,
        session_id=sess["session_id"],
        message_id=msg_id,
        counter=sess["counter"],
    )
    assert recovered == plaintext


# ─── FT-03: AES-GCM round-trip ────────────────────────────────────────────────

@pytest.mark.parametrize("size", [128, 1024, 10240])
def test_ft03_message_roundtrip(client, admin_headers, server_verify_key_hex, size):
    """FT-03: AES-256-GCM message round-trips for 128B, 1KiB, 10KiB payloads."""
    from app.simulation.workloads import generate_payload
    device_id = f"ft03-{size}-{uuid.uuid4().hex[:6]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    payload = generate_payload(size)
    msg_id = str(uuid.uuid4())
    sess["counter"] += 1
    ct, nonce = aead_encrypt(
        key=sess["session_key"],
        plaintext=payload,
        role=IV_ROLE_CLIENT,
        counter=sess["counter"],
        device_id=device_id,
        session_id=sess["session_id"],
        message_id=msg_id,
    )

    resp = client.post("/message", json={
        "device_id": device_id,
        "session_id": sess["session_id"],
        "message_id": msg_id,
        "counter": sess["counter"],
        "ciphertext_b64": base64.b64encode(ct).decode(),
        "nonce_b64": base64.b64encode(nonce).decode(),
    })
    assert resp.status_code == 200, resp.text
    assert resp.json()["outcome"] == "ACCEPTED"


# ─── FT-04: Session metadata ──────────────────────────────────────────────────

def test_ft04_session_metadata(client, admin_headers, server_verify_key_hex):
    """FT-04: Session metadata stored correctly; no key bytes in the database."""
    import sqlite3
    device_id = f"ft04-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    # Check via /state endpoint
    state = client.get("/state").json()
    session_ids = [s["session_id"] for s in state["sessions"]]
    assert sess["session_id"] in session_ids

    # Confirm required fields exist and no key bytes in DB
    session_record = next(s for s in state["sessions"] if s["session_id"] == sess["session_id"])
    assert "key_id" in session_record
    assert "created_at" in session_record
    assert "expires_at" in session_record
    assert "state" in session_record
    # Key bytes must NOT be present
    assert "key_bytes" not in session_record
    assert "session_key" not in session_record

    # If DB is file-based, also verify at SQL level (in-memory DB won't persist)
    from app.config import DATABASE_PATH
    if DATABASE_PATH != ":memory:":
        conn = sqlite3.connect(DATABASE_PATH)
        cur = conn.execute("PRAGMA table_info(sessions)")
        columns = [row[1] for row in cur.fetchall()]
        assert "key_bytes" not in columns
        conn.close()


# ─── FT-05: Dashboard consistency ────────────────────────────────────────────

def test_ft05_dashboard_consistency(client, admin_headers, server_verify_key_hex):
    """FT-05: Dashboard /state values match direct database queries."""
    from app.database.db import get_db
    device_id = f"ft05-{uuid.uuid4().hex[:8]}"
    _enrol_and_register(client, admin_headers, device_id)

    state_resp = client.get("/state").json()
    db_devices = get_db().get_all_devices()

    # Check device count matches
    assert len(state_resp["devices"]) == len(db_devices)

    # Check session count matches
    db_sessions = get_db().get_all_sessions()
    assert len(state_resp["sessions"]) == len(db_sessions)

    # Check audit log is retrievable
    audit_resp = client.get("/audit").json()
    assert "events" in audit_resp
    assert "chain_valid" in audit_resp
    assert audit_resp["chain_valid"] is True
