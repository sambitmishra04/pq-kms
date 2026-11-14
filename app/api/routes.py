"""
FastAPI route handlers implementing all 8 API endpoints.
Security rules (Section 6.12):
- Verify signature BEFORE any state change.
- Check device status BEFORE relying on verified signature.
- Fail closed: any missing/malformed field → reject.
- Never log keys, shared secrets, or plaintext content.
- Return generic client errors; full reason only in audit log.
"""
from __future__ import annotations

import base64
import csv
import io
import time
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse, StreamingResponse

from app.api.models import (
    AuditResponse,
    BulkSessionActionResponse,
    CRLResponse,
    EnrolRequest,
    EnrolResponse,
    MessageRequest,
    MessageResponse,
    MetricsResponse,
    RegisterRequest,
    RegisterResponse,
    ResealResponse,
    RevokeRequest,
    RevokeResponse,
    SessionActionResponse,
    SessionDetailResponse,
    SessionItem,
    SessionListResponse,
    SessionRequest,
    SessionResponse,
    StateResponse,
    TamperSimulationRequest,
    TamperSimulationResponse,
)
from app.audit.audit import get_audit_logger
from app.config import (
    ADMIN_TOKEN,
    CTX_REG,
    CTX_SREQ,
    CTX_SRESP,
    TS_SKEW_S,
)
from app.crypto.aead import decrypt as aead_decrypt
from app.crypto.kdf import derive_session_key
from app.crypto.kem import encapsulate
from app.crypto.sig import sign as sig_sign
from app.crypto.sig import verify as sig_verify
from app.database.db import get_db
from app.device_management.registry import create_enrolment_code, register_device
from app.key_management.lifecycle import get_lifecycle_manager
from app.revocation.revocation import (
    get_latest_crl,
    revoke_device,
    verify_crl,
)

router = APIRouter()


# ─── Dependency: Admin authentication ────────────────────────────────────────

def require_admin(x_admin_token: str = Header(...)) -> None:
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid administrator token",
        )


# ─── POST /enrol ─────────────────────────────────────────────────────────────

@router.post("/enrol", response_model=EnrolResponse)
def enrol(req: EnrolRequest, _: None = Depends(require_admin)):
    """
    Admin creates a one-time enrolment code for a device.
    The code must be securely delivered to the device out-of-band.
    """
    try:
        code = create_enrolment_code(req.device_id, req.role)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return EnrolResponse(device_id=req.device_id, enrolment_code=code)


# ─── POST /register ──────────────────────────────────────────────────────────

@router.post("/register", response_model=RegisterResponse)
def register(req: RegisterRequest):
    """
    Device registers with proof-of-possession signature (Algorithm 1).
    """
    try:
        kem_pk = base64.b64decode(req.kem_public_key_b64)
        sig_pk = base64.b64decode(req.sig_public_key_b64)
        proof_sig = base64.b64decode(req.proof_signature_b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 encoding")

    try:
        register_device(
            device_id=req.device_id,
            enrolment_code=req.enrolment_code,
            kem_public_key=kem_pk,
            sig_public_key=sig_pk,
            proof_signature=proof_sig,
            sig_algorithm=req.sig_algorithm,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Registration failed")

    return RegisterResponse(device_id=req.device_id)


# ─── POST /session ────────────────────────────────────────────────────────────

@router.post("/session", response_model=SessionResponse)
def establish_session(req: SessionRequest):
    """
    Algorithm 2: Signed session request → KEM encapsulation → signed response.
    """
    db = get_db()
    audit = get_audit_logger()
    lifecycle = get_lifecycle_manager()

    # Step 2: Device must exist, be AUTHORIZED, and not revoked
    device = db.get_device(req.device_id)
    if device is None or device["status"] != "AUTHORIZED":
        audit.log("server", "SESSION", "REJECTED", req.device_id, "Not AUTHORIZED")
        raise HTTPException(status_code=403, detail="Device not authorized")

    # Timestamp freshness check
    if abs(time.time() - req.timestamp) > TS_SKEW_S:
        audit.log("server", "SESSION", "REJECTED", req.device_id, "Stale timestamp")
        raise HTTPException(status_code=400, detail="Request timestamp too old or in the future")

    # Decode fields
    try:
        nonce_c = base64.b64decode(req.nonce_c_b64)
        client_sig = base64.b64decode(req.signature_b64)
        sig_pk = bytes(device["sig_public_key"])
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid encoding")

    # Step 3: Verify ML-DSA session request signature
    message = (
        req.device_id.encode("utf-8")
        + nonce_c
        + str(req.timestamp).encode("utf-8")
    )
    if not sig_verify(sig_pk, message, client_sig, CTX_SREQ, req.sig_algorithm):
        audit.log("server", "SESSION", "REJECTED", req.device_id, "Invalid session request signature")
        raise HTTPException(status_code=400, detail="Session request rejected")

    # Step 4: ML-KEM encapsulation with the device's registered public key
    try:
        kem_pk = bytes(device["kem_public_key"])
        ciphertext, shared_secret = encapsulate(kem_pk, req.kem_algorithm)
    except (ValueError, RuntimeError) as exc:
        audit.log("server", "SESSION", "REJECTED", req.device_id, f"KEM failed: {exc}")
        raise HTTPException(status_code=500, detail="Key encapsulation failed")

    # Step 5: Derive session key via HKDF (server side)
    # We need the session_id first to use in info string
    # Derive a temp session_id, then create the session
    temp_session_id = str(uuid.uuid4())
    session_key = derive_session_key(shared_secret, nonce_c, req.device_id, temp_session_id)

    # Store in lifecycle manager (in-memory only)
    session_id, key_id, created_at, expires_at = lifecycle.create_session(
        device_id=req.device_id,
        key_bytes=session_key,
    )
    # Note: temp_session_id unused - lifecycle manager generates its own UUID
    # Re-derive with actual session_id so client and server agree
    session_key = derive_session_key(shared_secret, nonce_c, req.device_id, session_id)
    # Update the key in the store
    entry = lifecycle.get_session_entry(session_id)
    if entry:
        entry.key_bytes = session_key

    # Step 6: Sign response with server key
    from app.main import get_server_sig_key  # late import to avoid circular
    server_sk, server_vk = get_server_sig_key()
    resp_message = (
        ciphertext
        + session_id.encode("utf-8")
        + expires_at.isoformat().encode("utf-8")
    )
    server_sig = sig_sign(server_sk, resp_message, CTX_SRESP, req.sig_algorithm)

    audit.log(
        "server", "SESSION", "ACCEPTED", req.device_id,
        details=f"session_id={session_id} key_id={key_id}",
    )
    return SessionResponse(
        session_id=session_id,
        key_id=key_id,
        ciphertext_b64=base64.b64encode(ciphertext).decode(),
        expires_at=expires_at.isoformat(),
        server_signature_b64=base64.b64encode(server_sig).decode(),
    )


# ─── POST /message ────────────────────────────────────────────────────────────

@router.post("/message", response_model=MessageResponse)
def receive_message(req: MessageRequest):
    """
    Algorithm 3: Receive, validate, and decrypt an AES-256-GCM protected message.
    """
    db = get_db()
    audit = get_audit_logger()
    lifecycle = get_lifecycle_manager()

    # Check device status first
    device = db.get_device(req.device_id)
    if device is None or device["status"] != "AUTHORIZED":
        audit.log("server", "MESSAGE", "REJECTED", req.device_id, "Device not AUTHORIZED")
        raise HTTPException(status_code=403, detail="Device not authorized")

    # Validate and get session key
    try:
        key_bytes, entry = lifecycle.get_key_for_message(req.session_id, req.counter)
    except ValueError as exc:
        reason = str(exc)
        audit.log("server", "MESSAGE", "REJECTED", req.device_id, reason)
        db.log_message(req.message_id, req.session_id, "REJECTED", reason)
        raise HTTPException(status_code=400, detail="Message rejected")

    # Decode ciphertext and nonce
    try:
        ct = base64.b64decode(req.ciphertext_b64)
        nonce = base64.b64decode(req.nonce_b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid encoding")

    # AES-256-GCM decryption (raises InvalidTag on tampering)
    try:
        from cryptography.exceptions import InvalidTag
        plaintext = aead_decrypt(
            key=key_bytes,
            ciphertext_with_tag=ct,
            nonce=nonce,
            device_id=req.device_id,
            session_id=req.session_id,
            message_id=req.message_id,
            counter=req.counter,
        )
    except Exception as exc:
        reason = "GCM tag verification failed (tampered or wrong context)"
        audit.log("server", "MESSAGE", "REJECTED", req.device_id, reason)
        db.log_message(req.message_id, req.session_id, "REJECTED", reason)
        raise HTTPException(status_code=400, detail="Message rejected")

    # Success — log outcome only (never log plaintext)
    audit.log(
        "server", "MESSAGE", "ACCEPTED", req.device_id,
        details=f"session_id={req.session_id} msg_id={req.message_id} counter={req.counter} payload_len={len(plaintext)}",
    )
    db.log_message(req.message_id, req.session_id, "ACCEPTED")
    return MessageResponse(message_id=req.message_id, outcome="ACCEPTED")


# ─── POST /revoke ─────────────────────────────────────────────────────────────

@router.post("/revoke", response_model=RevokeResponse)
def revoke(req: RevokeRequest, _: None = Depends(require_admin)):
    """
    Algorithm 5: Admin revokes a device and issues a signed CRL.
    """
    from app.main import get_server_sig_key
    server_sk, _ = get_server_sig_key()
    try:
        crl = revoke_device(req.device_id, server_sk)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return RevokeResponse(
        device_id=req.device_id,
        crl_version=crl["version"],
        message=f"Device '{req.device_id}' revoked. CRL v{crl['version']} issued.",
    )


# ─── GET /revocations ────────────────────────────────────────────────────────

@router.get("/revocations", response_model=CRLResponse | None)
def get_revocations():
    """Return the latest signed CRL for verifiers."""
    from app.main import get_server_sig_key
    _, server_vk = get_server_sig_key()
    crl = get_latest_crl(server_vk)
    if crl is None:
        return None
    return CRLResponse(
        version=crl["version"],
        issued_at=crl["issued_at"],
        device_ids=crl["device_ids"],
        signature_hex=crl["signature"],
    )


# ─── GET /devices/{device_id}/keys ───────────────────────────────────────────

@router.get("/devices/{device_id}/keys")
@router.get("/api/devices/{device_id}/keys")
def get_device_keys(device_id: str):
    """Retrieve full post-quantum cryptographic public keys for a specific device."""
    import hashlib
    db = get_db()
    dev = db.get_device(device_id)
    if not dev:
        raise HTTPException(status_code=404, detail=f"Device '{device_id}' not found")

    kem_pk: bytes | None = dev.get("kem_public_key")
    sig_pk: bytes | None = dev.get("sig_public_key")

    return {
        "device_id": device_id,
        "status": dev.get("status"),
        "role": dev.get("role"),
        "enrolled_at": dev.get("enrolled_at"),
        "kem_public_key_hex": kem_pk.hex() if kem_pk else None,
        "kem_public_key_b64": base64.b64encode(kem_pk).decode() if kem_pk else None,
        "kem_key_size_bytes": len(kem_pk) if kem_pk else 0,
        "kem_fingerprint": hashlib.sha256(kem_pk).hexdigest() if kem_pk else None,
        "sig_public_key_hex": sig_pk.hex() if sig_pk else None,
        "sig_public_key_b64": base64.b64encode(sig_pk).decode() if sig_pk else None,
        "sig_key_size_bytes": len(sig_pk) if sig_pk else 0,
        "sig_fingerprint": hashlib.sha256(sig_pk).hexdigest() if sig_pk else None,
    }


# ─── GET /state ───────────────────────────────────────────────────────────────

@router.get("/state", response_model=StateResponse)
def get_state():
    """Dashboard: real backend state (device + session metadata, verified public keys)."""
    import hashlib
    summary = get_db().get_state_summary()
    for d in summary["devices"]:
        kem_pk = d.pop("kem_public_key", None)
        sig_pk = d.pop("sig_public_key", None)
        d.pop("enrolment_code_hash", None)

        if kem_pk:
            d["kem_public_key_hex"] = kem_pk.hex()
            d["kem_public_key_b64"] = base64.b64encode(kem_pk).decode()
            d["kem_key_size_bytes"] = len(kem_pk)
            d["kem_fingerprint"] = hashlib.sha256(kem_pk).hexdigest()
        else:
            d["kem_public_key_hex"] = None
            d["kem_public_key_b64"] = None
            d["kem_key_size_bytes"] = 0
            d["kem_fingerprint"] = None

        if sig_pk:
            d["sig_public_key_hex"] = sig_pk.hex()
            d["sig_public_key_b64"] = base64.b64encode(sig_pk).decode()
            d["sig_key_size_bytes"] = len(sig_pk)
            d["sig_fingerprint"] = hashlib.sha256(sig_pk).hexdigest()
        else:
            d["sig_public_key_hex"] = None
            d["sig_public_key_b64"] = None
            d["sig_key_size_bytes"] = 0
            d["sig_fingerprint"] = None

    return StateResponse(**summary)


# ─── Session Key Lifecycle Governance ──────────────────────────────────────────

@router.get("/sessions", response_model=SessionListResponse)
@router.get("/api/sessions", response_model=SessionListResponse)
def get_sessions(
    search: str | None = Query(None, description="Search by session_id, key_id, or device_id"),
    state: str | None = Query(None, description="Filter by lifecycle state (ACTIVE, DEACTIVATED, DESTROYED, ALL)"),
    device_id: str | None = Query(None, description="Filter by device_id"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=200, description="Items per page"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
):
    """
    Paginated, searchable, filterable view of cryptographic sessions.
    Computes real-time cryptoperiod countdowns, message quotas, and RAM isolation status.
    """
    from datetime import datetime, timezone
    db = get_db()
    lifecycle = get_lifecycle_manager()
    now_ts = time.time()

    paginated = db.get_paginated_sessions(
        search=search,
        state=state,
        device_id=device_id,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    enriched_sessions = []
    for s in paginated["sessions"]:
        try:
            exp_str = s["expires_at"].replace("Z", "+00:00")
            exp_dt = datetime.fromisoformat(exp_str)
            exp_ts = exp_dt.timestamp()
            create_str = s["created_at"].replace("Z", "+00:00")
            create_dt = datetime.fromisoformat(create_str)
            create_ts = create_dt.timestamp()
            total_duration = max(1.0, exp_ts - create_ts)
            elapsed = max(0.0, now_ts - create_ts)
            pct = min(100.0, max(0.0, (elapsed / total_duration) * 100.0))
        except Exception:
            exp_ts = now_ts + 60
            pct = 0.0

        is_exp = now_ts >= exp_ts
        time_rem = max(0, int(exp_ts - now_ts)) if not is_exp else 0
        in_ram = s["state"] in ("ACTIVE", "DEACTIVATED") and lifecycle.get_session_entry(s["session_id"]) is not None

        enriched_sessions.append(
            SessionItem(
                session_id=s["session_id"],
                key_id=s["key_id"],
                device_id=s["device_id"],
                created_at=s["created_at"],
                expires_at=s["expires_at"],
                state=s["state"],
                msg_count=s["msg_count"],
                last_counter=s["last_counter"],
                is_expired=is_exp,
                time_remaining_s=time_rem,
                in_transient_ram=in_ram,
                progress_pct=round(pct, 1),
            )
        )

    stats = db.get_session_lifecycle_stats()
    memory_status = lifecycle.get_memory_status()

    return SessionListResponse(
        sessions=enriched_sessions,
        total=paginated["total"],
        page=paginated["page"],
        page_size=paginated["page_size"],
        total_pages=paginated["total_pages"],
        stats=stats,
        memory_status=memory_status,
    )


@router.get("/sessions/{session_id}/details", response_model=SessionDetailResponse)
@router.get("/api/sessions/{session_id}/details", response_model=SessionDetailResponse)
def get_session_details(session_id: str):
    """
    Detailed cryptographic inspection of a session key.
    Exposes KEM, KDF, AEAD, replay sequencing window, and audit linkages.
    """
    from datetime import datetime, timezone
    from app.config import KEM_ALG, SIG_ALG, GRACE_WINDOW_S
    db = get_db()
    lifecycle = get_lifecycle_manager()
    sess = db.get_session(session_id)
    if sess is None:
        raise HTTPException(status_code=404, detail=f"Session '{session_id}' not found")

    entry = lifecycle.get_session_entry(session_id)
    device = db.get_device(sess["device_id"])

    now_ts = time.time()
    try:
        exp_dt = datetime.fromisoformat(sess["expires_at"].replace("Z", "+00:00"))
        exp_ts = exp_dt.timestamp()
    except Exception:
        exp_ts = now_ts + 60
    is_exp = now_ts >= exp_ts
    time_rem = max(0, int(exp_ts - now_ts)) if not is_exp else 0

    deact_str = None
    grace_rem = 0
    if entry and entry.deactivated_at:
        deact_str = datetime.fromtimestamp(entry.deactivated_at, tz=timezone.utc).isoformat()
        grace_window = GRACE_WINDOW_S if GRACE_WINDOW_S > 0 else 15
        grace_rem = max(0, int((entry.deactivated_at + grace_window) - now_ts))

    # Pull related audit logs for this session
    audit_rows, _, _ = db.get_audit_log_paginated(limit=10, search=session_id)

    return SessionDetailResponse(
        session_id=sess["session_id"],
        key_id=sess["key_id"],
        device_id=sess["device_id"],
        created_at=sess["created_at"],
        expires_at=sess["expires_at"],
        state=sess["state"],
        msg_count=sess["msg_count"],
        last_counter=sess["last_counter"],
        next_expected_counter=sess["last_counter"] + 1,
        is_expired=is_exp,
        time_remaining_s=time_rem,
        deactivated_at=deact_str,
        grace_remaining_s=grace_rem,
        in_transient_ram=entry is not None,
        key_byte_length=32,
        cipher_suite="AES-256-GCM (256-bit symmetric session key)",
        kem_primitive=KEM_ALG,
        sig_primitive=SIG_ALG,
        kdf_primitive="HKDF-SHA256 (RFC 5869, context label: PQKMS-v1)",
        device_status=device["status"] if device else "UNKNOWN",
        device_role=device["role"] if device else "device",
        audit_events=audit_rows,
    )


@router.post("/sessions/{session_id}/rotate", response_model=SessionActionResponse)
@router.post("/api/sessions/{session_id}/rotate", response_model=SessionActionResponse)
def rotate_session(session_id: str):
    """
    Force manual rotation of an active session key.
    Transitions active key to DEACTIVATED grace state and audits the action.
    """
    lifecycle = get_lifecycle_manager()
    try:
        res = lifecycle.force_rotate_session(session_id)
        return SessionActionResponse(
            status="success",
            session_id=session_id,
            action="rotate",
            message=res["message"],
            details=res,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/sessions/{session_id}/deactivate", response_model=SessionActionResponse)
@router.post("/api/sessions/{session_id}/deactivate", response_model=SessionActionResponse)
def deactivate_session(session_id: str):
    """
    Transition an active session into DEACTIVATED decrypt-only grace mode.
    """
    lifecycle = get_lifecycle_manager()
    db = get_db()
    sess = db.get_session(session_id)
    if sess is None:
        raise HTTPException(status_code=404, detail=f"Session '{session_id}' not found")
    lifecycle.deactivate_session(session_id)
    db.update_session_state(session_id, "DEACTIVATED")
    get_audit_logger().log(
        actor="admin",
        event_type="SESSION_DEACTIVATED",
        outcome="ACCEPTED",
        device_id=sess["device_id"],
        details=f"session_id={session_id} reason=admin_manual_deactivate",
    )
    return SessionActionResponse(
        status="success",
        session_id=session_id,
        action="deactivate",
        message=f"Session {session_id[:8]}... transitioned to DEACTIVATED grace window.",
        details={"state": "DEACTIVATED"},
    )


@router.post("/sessions/{session_id}/destroy", response_model=SessionActionResponse)
@router.post("/api/sessions/{session_id}/destroy", response_model=SessionActionResponse)
def destroy_session(session_id: str):
    """
    Immediately destroy session: zeroizes key bytes in transient RAM,
    evicts key buffer, updates state to DESTROYED, and logs to forensic audit ledger.
    """
    lifecycle = get_lifecycle_manager()
    try:
        res = lifecycle.force_destroy_session(session_id)
        return SessionActionResponse(
            status="success",
            session_id=session_id,
            action="destroy",
            message=res["message"],
            details=res,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/sessions/bulk-rotate-expired", response_model=BulkSessionActionResponse)
@router.post("/api/sessions/bulk-rotate-expired", response_model=BulkSessionActionResponse)
def bulk_rotate_expired():
    """
    Trigger key rotation policy verification across all expired/exhausted sessions.
    """
    lifecycle = get_lifecycle_manager()
    rotated = lifecycle.run_rotation_check(session_factory=lambda _: None)
    count = len(rotated)
    if count > 0:
        msg = f"Key rotation enforced successfully. {count} expired session(s) transitioned to grace window."
    else:
        msg = "Key lifecycle verification complete. All active session keys are healthy and within their cryptoperiods."

    return BulkSessionActionResponse(
        status="success",
        action="bulk_rotate",
        affected_count=count,
        message=msg,
    )


@router.post("/sessions/purge-destroyed", response_model=BulkSessionActionResponse)
@router.post("/api/sessions/purge-destroyed", response_model=BulkSessionActionResponse)
def purge_destroyed():
    """
    Purge metadata for all DESTROYED sessions from persistent store.
    """
    db = get_db()
    count = db.purge_destroyed_sessions()
    get_audit_logger().log(
        actor="admin",
        event_type="SESSIONS_PURGED",
        outcome="ACCEPTED",
        details=f"purged_destroyed_count={count}",
    )
    return BulkSessionActionResponse(
        status="success",
        action="purge_destroyed",
        affected_count=count,
        message=f"Purged {count} destroyed session audit records from persistent store.",
    )


@router.get("/sessions/memory-status")
@router.get("/api/sessions/memory-status")
def get_memory_status():
    """
    Return volatile RAM key isolation diagnostics.
    """
    lifecycle = get_lifecycle_manager()
    return lifecycle.get_memory_status()


# ─── Audit Log & Cryptographic Ledger Governance ───────────────────────────

@router.get("/audit", response_model=AuditResponse)
@router.get("/api/audit", response_model=AuditResponse)
def get_audit(
    limit: int = 50,
    offset: int = 0,
    search: str | None = None,
    event_type: str | None = None,
    outcome: str | None = None,
    actor: str | None = None,
):
    """
    Dashboard: audit log with search, filtering, pagination, and cryptographic chain verification.
    """
    db = get_db()
    events, matching_count, stats = db.get_audit_log_paginated(
        limit=limit,
        offset=offset,
        search=search,
        event_type=event_type,
        outcome=outcome,
        actor=actor,
    )
    verification = db.verify_audit_chain_detailed()
    return AuditResponse(
        events=events,
        chain_valid=verification["is_valid"],
        chain_break_index=verification["break_index"],
        total_records=verification["total_records"],
        filtered_count=matching_count,
        break_details=verification["break_details"],
        stats=stats,
    )


@router.post("/audit/reseal", response_model=ResealResponse)
@router.post("/api/audit/reseal", response_model=ResealResponse)
def reseal_audit(actor: str = "admin"):
    """
    Administrative command: Recalculate and re-anchor the cryptographic SHA-256
    hash chain across all records in the ledger and record an official audit event.
    """
    db = get_db()
    result = db.reseal_audit_chain(actor=actor)
    return ResealResponse(
        status=result["status"],
        resealed_count=result["resealed_count"],
        repaired_count=result["repaired_count"],
        reseal_event_id=result.get("reseal_event_id"),
        message=f"Successfully verified and re-anchored {result['resealed_count']} audit blocks ({result['repaired_count']} discontinuities corrected).",
    )


@router.post("/audit/simulate-tamper", response_model=TamperSimulationResponse)
@router.post("/api/audit/simulate-tamper", response_model=TamperSimulationResponse)
def simulate_tamper(req: TamperSimulationRequest | None = None):
    """
    Adversarial sandbox: Alter a historical block hash to test real-time tamper evidence.
    """
    db = get_db()
    target_idx = req.target_index if req else None
    result = db.simulate_audit_tamper(target_index=target_idx)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return TamperSimulationResponse(
        status="tampered",
        tampered_index=result["tampered_index"],
        event_id=result["event_id"],
        original_prev_hash=result["original_prev_hash"],
        tampered_prev_hash=result["tampered_prev_hash"],
        message=f"Simulated adversarial hash tampering at sequence index #{result['tampered_index']}.",
    )


@router.post("/audit/restore", response_model=ResealResponse)
@router.post("/api/audit/restore", response_model=ResealResponse)
def restore_tamper():
    """
    Adversarial sandbox: Restore simulated tamper modifications and verify chain.
    """
    db = get_db()
    result = db.restore_audit_tamper()
    return ResealResponse(
        status="restored",
        resealed_count=result["resealed_count"],
        repaired_count=result["repaired_count"],
        reseal_event_id=result.get("reseal_event_id"),
        message=f"Audit chain restored and verified. {result['repaired_count']} blocks re-aligned.",
    )


@router.get("/audit/export")
@router.get("/api/audit/export")
def export_audit(format: str = "csv"):
    """
    Export the full audit trail in FDA 21 CFR Part 11 compliant CSV or JSON format.
    """
    db = get_db()
    rows, _, _ = db.get_audit_log_paginated(limit=100000, offset=0)

    if format.lower() == "json":
        verification = db.verify_audit_chain_detailed()
        from datetime import datetime, timezone
        export_bundle = {
            "metadata": {
                "system": "PQ-KMS Medical Biochip Cryptographic Management Platform",
                "format": "Cryptographic Hash-Chained Forensic Ledger",
                "exported_at": datetime.now(timezone.utc).isoformat(),
                "total_records": len(rows),
                "chain_valid": verification["is_valid"],
                "chain_break_index": verification["break_index"],
            },
            "records": rows,
        }
        return JSONResponse(
            content=export_bundle,
            headers={"Content-Disposition": 'attachment; filename="audit_ledger_forensics.json"'}
        )

    # CSV export
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Event ID", "Timestamp (UTC)", "Actor", "Event Type",
        "Target Node", "Outcome", "Details", "Previous Hash (H_{i-1})", "Current Hash (H_i)"
    ])
    for r in rows:
        writer.writerow([
            r.get("event_id", ""),
            r.get("time", ""),
            r.get("actor", ""),
            r.get("event_type", ""),
            r.get("device_id", "") or "—",
            r.get("outcome", ""),
            r.get("details", "") or "—",
            r.get("prev_hash", ""),
            r.get("current_hash", ""),
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="audit_ledger_21cfr11.csv"'}
    )


# ─── GET /metrics ─────────────────────────────────────────────────────────────

@router.get("/metrics", response_model=MetricsResponse)
def get_metrics():
    """Dashboard: benchmark statistics from the benchmarks table."""
    stats = get_db().get_benchmark_stats()
    return MetricsResponse(benchmark_stats=stats)
