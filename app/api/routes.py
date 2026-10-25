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
import time
import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, status

from app.api.models import (
    AuditResponse,
    CRLResponse,
    EnrolRequest,
    EnrolResponse,
    MessageRequest,
    MessageResponse,
    MetricsResponse,
    RegisterRequest,
    RegisterResponse,
    RevokeRequest,
    RevokeResponse,
    SessionRequest,
    SessionResponse,
    StateResponse,
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


# ─── GET /state ───────────────────────────────────────────────────────────────

@router.get("/state", response_model=StateResponse)
def get_state():
    """Dashboard: real backend state (device + session metadata, never key material)."""
    summary = get_db().get_state_summary()
    # Strip binary key blobs from device records before sending
    for d in summary["devices"]:
        d.pop("kem_public_key", None)
        d.pop("sig_public_key", None)
        d.pop("enrolment_code_hash", None)
    return StateResponse(**summary)


# ─── GET /audit ───────────────────────────────────────────────────────────────

@router.get("/audit", response_model=AuditResponse)
def get_audit(limit: int = 100):
    """Dashboard: audit log with chain integrity check."""
    db = get_db()
    events = db.get_audit_log(limit)
    chain_valid, break_idx = db.verify_audit_chain()
    return AuditResponse(events=events, chain_valid=chain_valid, chain_break_index=break_idx)


# ─── GET /metrics ─────────────────────────────────────────────────────────────

@router.get("/metrics", response_model=MetricsResponse)
def get_metrics():
    """Dashboard: benchmark statistics from the benchmarks table."""
    stats = get_db().get_benchmark_stats()
    return MetricsResponse(benchmark_stats=stats)
