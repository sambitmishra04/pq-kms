"""
Pydantic request/response models for the PQ-KMS REST API.
All binary fields (keys, ciphertexts, signatures) are base64-encoded strings.
"""
from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class EnrolRequest(BaseModel):
    device_id: str = Field(..., description="Unique device identifier")
    role: str = Field("device", description="Device role: 'device' or 'admin'")


class EnrolResponse(BaseModel):
    device_id: str
    enrolment_code: str
    message: str = "Enrolment code issued. Deliver securely to the device."


class RegisterRequest(BaseModel):
    device_id: str
    enrolment_code: str
    kem_public_key_b64: str = Field(..., description="Base64-encoded ML-KEM encapsulation key")
    sig_public_key_b64: str = Field(..., description="Base64-encoded ML-DSA verification key")
    proof_signature_b64: str = Field(..., description="Base64-encoded proof-of-possession signature")
    sig_algorithm: str = Field("ML-DSA-65", description="Signature algorithm used")


class RegisterResponse(BaseModel):
    device_id: str
    status: str = "AUTHORIZED"
    message: str = "Device registered successfully."


class SessionRequest(BaseModel):
    device_id: str
    nonce_c_b64: str = Field(..., description="Base64-encoded 16-byte client nonce (HKDF salt)")
    timestamp: float = Field(..., description="Unix timestamp of the request")
    signature_b64: str = Field(..., description="Base64-encoded ML-DSA signature over request fields")
    sig_algorithm: str = Field("ML-DSA-65")
    kem_algorithm: str = Field("ML-KEM-768")


class SessionResponse(BaseModel):
    session_id: str
    key_id: str
    ciphertext_b64: str = Field(..., description="Base64-encoded ML-KEM ciphertext")
    expires_at: str = Field(..., description="ISO8601 expiry timestamp")
    server_signature_b64: str = Field(..., description="Base64-encoded server ML-DSA signature")


class MessageRequest(BaseModel):
    device_id: str
    session_id: str
    message_id: str
    counter: int = Field(..., description="Strictly increasing per-session counter")
    ciphertext_b64: str = Field(..., description="Base64-encoded AES-256-GCM ciphertext+tag")
    nonce_b64: str = Field(..., description="Base64-encoded 12-byte AES-GCM IV")


class MessageResponse(BaseModel):
    message_id: str
    outcome: str
    details: str = ""


class RevokeRequest(BaseModel):
    device_id: str


class RevokeResponse(BaseModel):
    device_id: str
    crl_version: int
    message: str


class CRLResponse(BaseModel):
    version: int
    issued_at: str
    device_ids: list[str]
    signature_hex: str


class StateResponse(BaseModel):
    devices: list[dict[str, Any]]
    sessions: list[dict[str, Any]]
    message_stats: dict[str, int]
    latest_crl_version: int
    revoked_devices: list[str]


class AuditResponse(BaseModel):
    events: list[dict[str, Any]]
    chain_valid: bool
    chain_break_index: int | None = None
    total_records: int = 0
    filtered_count: int = 0
    break_details: dict[str, Any] | None = None
    stats: dict[str, Any] | None = None


class ResealResponse(BaseModel):
    status: str
    resealed_count: int
    repaired_count: int
    reseal_event_id: str | None = None
    message: str


class TamperSimulationRequest(BaseModel):
    target_index: int | None = None


class TamperSimulationResponse(BaseModel):
    status: str
    tampered_index: int
    event_id: str
    original_prev_hash: str
    tampered_prev_hash: str
    message: str


class MetricsResponse(BaseModel):
    benchmark_stats: list[dict[str, Any]]
