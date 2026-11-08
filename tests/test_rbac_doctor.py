"""
Integration and security tests for PQ-KMS Role-Based Access Control (RBAC)
and Doctor In-Transit Key Exchange & Local Decryption.
"""

from fastapi.testclient import TestClient
from dashboard.server import app


def test_rbac_login_admin():
    client = TestClient(app)
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "AUTHENTICATED"
    assert data["user"]["role"] == "ADMIN"


def test_rbac_login_doctor():
    client = TestClient(app)
    res = client.post("/api/auth/login", json={"username": "dr.sharma", "password": "doc123"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "AUTHENTICATED"
    assert data["user"]["role"] == "DOCTOR"
    assert "DMFB-ALPHA" in data["user"]["authorized_biochips"]


def test_rbac_login_invalid_password():
    client = TestClient(app)
    res = client.post("/api/auth/login", json={"username": "dr.sharma", "password": "wrong"})
    assert res.status_code == 401


def test_doctor_biochips_catalog():
    client = TestClient(app)
    res = client.get("/api/doctor/biochips?doctor_id=dr.sharma")
    assert res.status_code == 200
    chips = res.json()["biochips"]
    alpha = next(c for c in chips if c["biochip_id"] == "DMFB-ALPHA")
    assert alpha["authorized"] is True


def test_doctor_unauthorized_biochip_rejected():
    client = TestClient(app)
    res = client.post("/api/doctor/exchange-keys", json={
        "doctor_id": "dr.sharma",
        "biochip_id": "DMFB-RESEARCH-03",
    })
    assert res.status_code == 403
    assert "Access Denied" in res.json()["detail"]


def test_doctor_authorized_key_exchange_and_decryption():
    client = TestClient(app)
    # Step 1: Exchange keys
    res_ex = client.post("/api/doctor/exchange-keys", json={
        "doctor_id": "dr.sharma",
        "biochip_id": "DMFB-ALPHA",
    })
    assert res_ex.status_code == 200
    pkg = res_ex.json()
    assert pkg["status"] == "ENCRYPTED_SUCCESS"
    assert pkg["kem_ciphertext_len"] == 1088

    # Step 2: Decrypt telemetry
    res_de = client.post("/api/doctor/decrypt-telemetry", json={
        "doctor_id": "dr.sharma",
        "biochip_id": "DMFB-ALPHA",
        "session_id": pkg["session_id"],
        "message_id": pkg["message_id"],
        "nonce_c_b64": pkg["nonce_c_b64"],
        "doctor_kem_sk_b64": pkg["doctor_kem_sk_b64"],
        "kem_ciphertext_b64": pkg["kem_ciphertext_b64"],
        "aead_ciphertext_b64": pkg["aead_ciphertext_b64"],
        "nonce_b64": pkg["nonce_b64"],
    })
    assert res_de.status_code == 200
    data = res_de.json()
    assert data["status"] == "DECRYPTED_SUCCESS"
    assert data["gcm_tag_verified"] is True
    assert len(data["patients"]) == 25


def test_admin_authorization_toggle():
    client = TestClient(app)
    # Grant
    res_g = client.post("/api/admin/authorizations/toggle", json={
        "doctor_id": "dr.sharma",
        "biochip_id": "DMFB-RESEARCH-03",
    })
    assert res_g.status_code == 200
    assert res_g.json()["action"] == "GRANTED"

    # Revoke
    res_r = client.post("/api/admin/authorizations/toggle", json={
        "doctor_id": "dr.sharma",
        "biochip_id": "DMFB-RESEARCH-03",
    })
    assert res_r.status_code == 200
    assert res_r.json()["action"] == "REVOKED"
