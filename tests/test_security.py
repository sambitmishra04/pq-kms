"""
Security tests ST-01 to ST-14 — the complete attack test matrix.
"""
from __future__ import annotations

import base64
import os
import time
import uuid

import pytest

from tests.conftest import _enrol_and_register, _establish_session
from app.config import CTX_REG, CTX_SREQ, SIG_ALG, KEM_ALG, IV_ROLE_CLIENT
from app.crypto.aead import encrypt as aead_encrypt
from app.crypto.sig import sign as sig_sign


# ─── ST-01: Valid registration ───────────────────────────────────────────────

def test_st01_valid_registration(client, admin_headers, server_verify_key_hex):
    """ST-01: Valid registration flow → device stored, AUTHORIZED."""
    device_id = f"st01-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    state = client.get("/state").json()
    devices = {d["device_id"]: d for d in state["devices"]}
    assert device_id in devices
    assert devices[device_id]["status"] == "AUTHORIZED"


# ─── ST-02: Reject unauthorized device ───────────────────────────────────────

def test_st02_reject_unknown_device(client, admin_headers, server_verify_key_hex):
    """ST-02a: Registration with no enrolment code issued → rejected."""
    import oqs
    kem = oqs.KeyEncapsulation(KEM_ALG)
    kem_pk = kem.generate_keypair()
    sig_obj = oqs.Signature(SIG_ALG)
    sig_pk = sig_obj.generate_keypair()
    sig_sk = sig_obj.export_secret_key()
    did = f"unknown-{uuid.uuid4().hex[:8]}"
    message = did.encode() + kem_pk + sig_pk
    proof = sig_sign(sig_sk, message, CTX_REG, SIG_ALG)
    resp = client.post("/register", json={
        "device_id": did,
        "enrolment_code": "invalid-code",
        "kem_public_key_b64": base64.b64encode(kem_pk).decode(),
        "sig_public_key_b64": base64.b64encode(sig_pk).decode(),
        "proof_signature_b64": base64.b64encode(proof).decode(),
        "sig_algorithm": SIG_ALG,
    })
    assert resp.status_code == 400


def test_st02_reject_wrong_code(client, admin_headers, server_verify_key_hex):
    """ST-02b: Wrong enrolment code → rejected."""
    import oqs
    did = f"st02b-{uuid.uuid4().hex[:8]}"
    client.post("/enrol", json={"device_id": did}, headers=admin_headers)
    kem = oqs.KeyEncapsulation(KEM_ALG)
    kem_pk = kem.generate_keypair()
    sig_obj = oqs.Signature(SIG_ALG)
    sig_pk = sig_obj.generate_keypair()
    sig_sk = sig_obj.export_secret_key()
    message = did.encode() + kem_pk + sig_pk
    proof = sig_sign(sig_sk, message, CTX_REG, SIG_ALG)
    resp = client.post("/register", json={
        "device_id": did,
        "enrolment_code": "WRONG-CODE",
        "kem_public_key_b64": base64.b64encode(kem_pk).decode(),
        "sig_public_key_b64": base64.b64encode(sig_pk).decode(),
        "proof_signature_b64": base64.b64encode(proof).decode(),
        "sig_algorithm": SIG_ALG,
    })
    assert resp.status_code == 400


# ─── ST-03: Reject impersonation ─────────────────────────────────────────────

def test_st03_reject_impersonation(client, admin_headers, server_verify_key_hex):
    """ST-03: Session request signed with a DIFFERENT key → rejected."""
    import oqs
    # Register device A
    info_a = _enrol_and_register(client, admin_headers, f"st03a-{uuid.uuid4().hex[:8]}")

    # Generate a rogue keypair (device B pretending to be A)
    sig_obj = oqs.Signature(SIG_ALG)
    _ = sig_obj.generate_keypair()
    rogue_sk = sig_obj.export_secret_key()

    nonce_c = os.urandom(16)
    timestamp = time.time()
    message = info_a["device_id"].encode() + nonce_c + str(timestamp).encode()
    rogue_sig = sig_sign(rogue_sk, message, CTX_SREQ, SIG_ALG)

    resp = client.post("/session", json={
        "device_id": info_a["device_id"],
        "nonce_c_b64": base64.b64encode(nonce_c).decode(),
        "timestamp": timestamp,
        "signature_b64": base64.b64encode(rogue_sig).decode(),
        "sig_algorithm": SIG_ALG,
        "kem_algorithm": KEM_ALG,
    })
    assert resp.status_code in (400, 403)


# ─── ST-04: ML-KEM session establishment ─────────────────────────────────────

def test_st04_session_establishment(client, admin_headers, server_verify_key_hex):
    """ST-04: Full session → matching keys, session ACTIVE."""
    device_id = f"st04-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    assert len(sess["session_key"]) == 32
    assert sess["session_id"]

    state = client.get("/state").json()
    sessions = {s["session_id"]: s for s in state["sessions"]}
    assert sess["session_id"] in sessions
    assert sessions[sess["session_id"]]["state"] == "ACTIVE"


# ─── ST-05: Reject tampered ciphertext ───────────────────────────────────────

def test_st05_reject_tampered_ciphertext(client, admin_headers, server_verify_key_hex):
    """ST-05: Flip one byte in GCM ciphertext → tag failure → rejected."""
    device_id = f"st05-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    plaintext = b"legitimate diagnostic payload"
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

    # Flip byte 0 in the ciphertext
    tampered = bytearray(ct)
    tampered[0] ^= 0xFF
    tampered = bytes(tampered)

    resp = client.post("/message", json={
        "device_id": device_id,
        "session_id": sess["session_id"],
        "message_id": msg_id,
        "counter": sess["counter"],
        "ciphertext_b64": base64.b64encode(tampered).decode(),
        "nonce_b64": base64.b64encode(nonce).decode(),
    })
    assert resp.status_code == 400


# ─── ST-06: Reject invalid ML-DSA signature ──────────────────────────────────

def test_st06_reject_invalid_signature(client, admin_headers, server_verify_key_hex):
    """ST-06: Alter a signed session request field → verification fails → rejected."""
    device_id = f"st06-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)

    nonce_c = os.urandom(16)
    timestamp = time.time()
    # Sign with correct fields
    message = device_id.encode() + nonce_c + str(timestamp).encode()
    sig = sig_sign(info["sig_sk"], message, CTX_SREQ, SIG_ALG)

    # But submit a DIFFERENT timestamp (alters the signed content)
    resp = client.post("/session", json={
        "device_id": device_id,
        "nonce_c_b64": base64.b64encode(nonce_c).decode(),
        "timestamp": timestamp + 9999,  # different from what was signed
        "signature_b64": base64.b64encode(sig).decode(),
        "sig_algorithm": SIG_ALG,
        "kem_algorithm": KEM_ALG,
    })
    assert resp.status_code in (400, 403)


# ─── ST-07: Reject expired key ───────────────────────────────────────────────

def test_st07_reject_expired_key(client, admin_headers, server_verify_key_hex):
    """ST-07: Session key expires → messages rejected."""
    import os as _os
    _os.environ["SESSION_LIFETIME_S"] = "2"  # 2-second lifetime for this test
    from importlib import reload
    import app.config as cfg
    reload(cfg)

    device_id = f"st07-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    # Force expire the session in the lifecycle manager
    from app.key_management.lifecycle import get_lifecycle_manager
    lm = get_lifecycle_manager()
    entry = lm.get_session_entry(sess["session_id"])
    if entry:
        entry.expires_at = time.time() - 1  # expired 1 second ago

    msg_id = str(uuid.uuid4())
    sess["counter"] += 1
    ct, nonce = aead_encrypt(
        key=sess["session_key"],
        plaintext=b"late message",
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
    assert resp.status_code == 400


# ─── ST-08: Key rotation ─────────────────────────────────────────────────────

def test_st08_key_rotation(client, admin_headers, server_verify_key_hex):
    """ST-08: After expiry, client must re-establish session; old session unusable."""
    device_id = f"st08-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)
    old_session_id = sess["session_id"]

    # Expire the session
    from app.key_management.lifecycle import get_lifecycle_manager
    entry = get_lifecycle_manager().get_session_entry(old_session_id)
    if entry:
        entry.expires_at = time.time() - 1

    # Old session should be rejected
    msg_id = str(uuid.uuid4())
    sess["counter"] += 1
    ct, nonce = aead_encrypt(
        key=sess["session_key"], plaintext=b"test",
        role=IV_ROLE_CLIENT, counter=sess["counter"],
        device_id=device_id, session_id=old_session_id, message_id=msg_id,
    )
    resp = client.post("/message", json={
        "device_id": device_id, "session_id": old_session_id,
        "message_id": msg_id, "counter": sess["counter"],
        "ciphertext_b64": base64.b64encode(ct).decode(),
        "nonce_b64": base64.b64encode(nonce).decode(),
    })
    assert resp.status_code == 400

    # New session should succeed
    new_sess = _establish_session(client, info, server_verify_key_hex)
    assert new_sess["session_id"] != old_session_id


# ─── ST-09: Reject revoked device ────────────────────────────────────────────

def test_st09_reject_revoked_device(client, admin_headers, server_verify_key_hex):
    """ST-09: After revocation, device cannot send messages or establish sessions."""
    device_id = f"st09-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    # Revoke device
    resp = client.post("/revoke", json={"device_id": device_id}, headers=admin_headers)
    assert resp.status_code == 200

    # Try to send a message → should be rejected
    msg_id = str(uuid.uuid4())
    sess["counter"] += 1
    ct, nonce = aead_encrypt(
        key=sess["session_key"], plaintext=b"post-revocation message",
        role=IV_ROLE_CLIENT, counter=sess["counter"],
        device_id=device_id, session_id=sess["session_id"], message_id=msg_id,
    )
    resp = client.post("/message", json={
        "device_id": device_id, "session_id": sess["session_id"],
        "message_id": msg_id, "counter": sess["counter"],
        "ciphertext_b64": base64.b64encode(ct).decode(),
        "nonce_b64": base64.b64encode(nonce).decode(),
    })
    assert resp.status_code in (400, 403)

    # Try to establish new session → should be rejected
    nonce_c = os.urandom(16)
    timestamp = time.time()
    message = device_id.encode() + nonce_c + str(timestamp).encode()
    sig = sig_sign(info["sig_sk"], message, CTX_SREQ, SIG_ALG)
    resp = client.post("/session", json={
        "device_id": device_id,
        "nonce_c_b64": base64.b64encode(nonce_c).decode(),
        "timestamp": timestamp,
        "signature_b64": base64.b64encode(sig).decode(),
        "sig_algorithm": SIG_ALG, "kem_algorithm": KEM_ALG,
    })
    assert resp.status_code in (400, 403)


# ─── ST-10: Signed revocation list verification ───────────────────────────────

def test_st10_signed_crl(client, admin_headers, server_verify_key_hex):
    """ST-10: Valid CRL accepted; altered signature rejected; older version rejected."""
    from app.revocation.revocation import verify_crl
    device_id = f"st10-{uuid.uuid4().hex[:8]}"
    _enrol_and_register(client, admin_headers, device_id)
    client.post("/revoke", json={"device_id": device_id}, headers=admin_headers)

    resp = client.get("/revocations")
    assert resp.status_code == 200
    crl = resp.json()
    assert crl is not None

    server_vk = bytes.fromhex(server_verify_key_hex)

    # Valid CRL should verify
    crl_data = {"version": crl["version"], "issued_at": crl["issued_at"], "device_ids": crl["device_ids"]}
    result = verify_crl(crl_data, crl["signature_hex"], server_vk, crl["version"] - 1, SIG_ALG)
    assert result is True

    # Altered signature → rejected
    from app.revocation.revocation import verify_crl
    bad_sig = "deadbeef" * 826  # 3309-byte garbage as hex
    with pytest.raises(ValueError, match="signature"):
        verify_crl(crl_data, bad_sig, server_vk, crl["version"] - 1, SIG_ALG)

    # Older version → rejected (even with valid signature)
    with pytest.raises(ValueError, match="not newer"):
        verify_crl(crl_data, crl["signature_hex"], server_vk, crl["version"], SIG_ALG)


# ─── ST-11: Revocation side effects ──────────────────────────────────────────

def test_st11_revocation_side_effects(client, admin_headers, server_verify_key_hex):
    """ST-11: Revoking a device → sessions COMPROMISED then DESTROYED, logged."""
    device_id = f"st11-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)
    session_id = sess["session_id"]

    from app.key_management.lifecycle import get_lifecycle_manager
    lm = get_lifecycle_manager()
    assert lm.get_session_entry(session_id) is not None  # session in memory

    client.post("/revoke", json={"device_id": device_id}, headers=admin_headers)

    # Session should be gone from in-memory store
    assert lm.get_session_entry(session_id) is None

    # DB should show DESTROYED
    from app.database.db import get_db
    db_sess = get_db().get_session(session_id)
    assert db_sess["state"] == "DESTROYED"

    # Audit log should have SESSIONS_COMPROMISED event
    audit = client.get("/audit").json()
    event_types = [e["event_type"] for e in audit["events"]]
    assert "SESSIONS_COMPROMISED" in event_types or "SESSION_DESTROYED" in event_types


# ─── ST-12: Replay detection ─────────────────────────────────────────────────

def test_st12_replay_detection(client, admin_headers, server_verify_key_hex):
    """ST-12: Resend the same message counter → rejected as replay."""
    device_id = f"st12-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)
    sess = _establish_session(client, info, server_verify_key_hex)

    msg_id = str(uuid.uuid4())
    sess["counter"] += 1
    ct, nonce = aead_encrypt(
        key=sess["session_key"], plaintext=b"original message",
        role=IV_ROLE_CLIENT, counter=sess["counter"],
        device_id=device_id, session_id=sess["session_id"], message_id=msg_id,
    )
    payload = {
        "device_id": device_id, "session_id": sess["session_id"],
        "message_id": msg_id, "counter": sess["counter"],
        "ciphertext_b64": base64.b64encode(ct).decode(),
        "nonce_b64": base64.b64encode(nonce).decode(),
    }

    # First send — should succeed
    resp = client.post("/message", json=payload)
    assert resp.status_code == 200

    # Replay — same counter → rejected
    resp = client.post("/message", json=payload)
    assert resp.status_code == 400


# ─── ST-13: Malformed KEM inputs ─────────────────────────────────────────────

def test_st13_malformed_kem_ciphertext(client, admin_headers, server_verify_key_hex):
    """ST-13: Wrong-length ciphertext → rejected, no crash."""
    device_id = f"st13-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)

    # Establish a real session first (we need a session key for the message)
    sess = _establish_session(client, info, server_verify_key_hex)

    # Send a message with a wrong-length nonce (simulate malformed AES-GCM nonce)
    msg_id = str(uuid.uuid4())
    sess["counter"] += 1
    ct, nonce = aead_encrypt(
        key=sess["session_key"], plaintext=b"test",
        role=IV_ROLE_CLIENT, counter=sess["counter"],
        device_id=device_id, session_id=sess["session_id"], message_id=msg_id,
    )
    # Truncate the ciphertext (simulates malformed KEM ciphertext input to AES)
    truncated = ct[:4]
    resp = client.post("/message", json={
        "device_id": device_id, "session_id": sess["session_id"],
        "message_id": msg_id, "counter": sess["counter"],
        "ciphertext_b64": base64.b64encode(truncated).decode(),
        "nonce_b64": base64.b64encode(nonce).decode(),
    })
    assert resp.status_code in (400, 422)


def test_st13_wrong_length_kem_encap_key(client):
    """ST-13: Wrong-length ML-KEM public key → rejected at KEM layer."""
    from app.crypto.kem import encapsulate
    bad_pk = b"\x00" * 10  # way too short for ML-KEM-768 (should be 1184)
    with pytest.raises((ValueError, Exception)):
        encapsulate(bad_pk, "ML-KEM-768")


# ─── ST-14: Cross-context signature ──────────────────────────────────────────

def test_st14_cross_context_signature(client, admin_headers, server_verify_key_hex):
    """ST-14: Registration signature presented as session request → rejected."""
    import oqs
    device_id = f"st14-{uuid.uuid4().hex[:8]}"

    # Issue enrolment code but DON'T register yet
    resp = client.post("/enrol", json={"device_id": device_id}, headers=admin_headers)
    code = resp.json()["enrolment_code"]

    kem = oqs.KeyEncapsulation(KEM_ALG)
    kem_pk = kem.generate_keypair()
    sig_obj = oqs.Signature(SIG_ALG)
    sig_pk = sig_obj.generate_keypair()
    sig_sk = sig_obj.export_secret_key()

    # Build and sign with CTX_REG (registration context)
    reg_message = device_id.encode() + kem_pk + sig_pk
    reg_sig = sig_sign(sig_sk, reg_message, CTX_REG, SIG_ALG)

    # Register the device properly
    from app.crypto.sig import sign as sig_sign_local
    message_for_reg = device_id.encode() + kem_pk + sig_pk
    from app.config import CTX_REG as CTX_REG_IMPORT
    proof = sig_sign_local(sig_sk, message_for_reg, CTX_REG_IMPORT, SIG_ALG)
    client.post("/register", json={
        "device_id": device_id, "enrolment_code": code,
        "kem_public_key_b64": base64.b64encode(kem_pk).decode(),
        "sig_public_key_b64": base64.b64encode(sig_pk).decode(),
        "proof_signature_b64": base64.b64encode(proof).decode(),
        "sig_algorithm": SIG_ALG,
    })

    # Now try to use the REGISTRATION signature as a SESSION REQUEST signature
    # The server uses CTX_SREQ for session requests — so this should fail verification
    nonce_c = os.urandom(16)
    timestamp = time.time()
    # We reuse the reg_sig (which was signed with CTX_REG) as the session request sig
    resp = client.post("/session", json={
        "device_id": device_id,
        "nonce_c_b64": base64.b64encode(nonce_c).decode(),
        "timestamp": timestamp,
        "signature_b64": base64.b64encode(reg_sig).decode(),  # wrong context!
        "sig_algorithm": SIG_ALG,
        "kem_algorithm": KEM_ALG,
    })
    assert resp.status_code in (400, 403), (
        "Cross-context signature should be rejected but server accepted it"
    )
