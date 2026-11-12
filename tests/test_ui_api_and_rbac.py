"""
Tests for UI, RBAC, Attack Lab, and DMFB Digital Twin API endpoints.
"""
import pytest
from app.auth.service import create_user
from app.database.db import get_db


@pytest.fixture(autouse=True)
def ensure_default_users():
    """Ensure test database has default users."""
    db = get_db()
    if not db.get_user_by_username("admin"):
        create_user("admin", "admin123", "System Administrator", "admin", "IT Security")
    if not db.get_user_by_username("dr.sharma"):
        create_user("dr.sharma", "doctor123", "Dr. Priya Sharma", "doctor", "Endocrinology")
    if not db.get_user_by_username("auditor"):
        create_user("auditor", "audit123", "Security Auditor", "auditor", "Compliance")


def test_auth_login_admin(client):
    """Admin login returns valid JWT token and user info."""
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"
    assert data["user"]["username"] == "admin"


def test_auth_login_doctor(client):
    """Doctor login returns doctor role claims."""
    res = client.post("/api/auth/login", json={"username": "dr.sharma", "password": "doctor123"})
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "doctor"
    assert "Endocrinology" in data["user"]["department"]


def test_auth_login_auditor(client):
    """Auditor login returns auditor role claims."""
    res = client.post("/api/auth/login", json={"username": "auditor", "password": "audit123"})
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["role"] == "auditor"


def test_auth_login_invalid(client):
    """Invalid credentials return 401 Unauthorized."""
    res = client.post("/api/auth/login", json={"username": "admin", "password": "wrongpassword"})
    assert res.status_code == 401


def test_auth_get_me(client):
    """GET /api/auth/me returns current user identity with valid Bearer token."""
    login_res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = login_res.json()["access_token"]

    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["username"] == "admin"
    assert res.json()["role"] == "admin"


def test_attack_lab_glucose_tamper(client):
    """POST /api/attack-lab/glucose-tamper executes comparative Ali et al. defense."""
    res = client.post("/api/attack-lab/glucose-tamper", json={"true_glucose": 220.0, "falsified_glucose": 110.0})
    assert res.status_code == 200
    data = res.json()
    assert data["unprotected_system"]["status"] == "VULNERABLE"
    assert data["pqkms_system"]["status"] == "PROTECTED"
    assert data["pqkms_system"]["tamper_detected"] is True
    assert "InvalidTag" in data["pqkms_system"]["error_detail"]


def test_attack_lab_replay(client):
    """POST /api/attack-lab/replay detects and blocks counter rollback."""
    res = client.post("/api/attack-lab/replay")
    assert res.status_code == 200
    data = res.json()
    assert data["replay_detected"] is True
    assert "Monotonic counter violation" in data["rejection_reason"]


def test_attack_lab_quantum_compare(client):
    """GET /api/attack-lab/quantum-compare returns Shor's vs Module-LWE metrics."""
    res = client.get("/api/attack-lab/quantum-compare")
    assert res.status_code == 200
    data = res.json()
    assert "ML-KEM-768" in data["pqc_mechanism"]
    assert "0 bits" in data["classical_quantum_security"]
    assert "Category 3" in data["pqc_quantum_security"]


def test_dmfb_run_assay(client):
    """POST /api/dmfb/run-assay executes 7-step enzymatic glucose bioassay on 8x8 EWOD grid."""
    res = client.post("/api/dmfb/run-assay?patient_glucose=220.0")
    assert res.status_code == 200
    data = res.json()
    assert len(data["steps"]) == 7
    assert data["steps"][0]["operation"] == "DISPENSE"
    assert data["steps"][6]["operation"] == "DETECT"
    assert data["sensor_reading"]["detected"] is True
    assert data["sensor_reading"]["glucose_mg_dl"] == 220.0
    assert "CRITICAL_HIGH" in data["sensor_reading"]["clinical_status"]


def test_dmfb_get_state(client):
    """GET /api/dmfb/state returns 8x8 electrode array configuration."""
    res = client.get("/api/dmfb/state")
    assert res.status_code == 200
    data = res.json()
    assert data["grid_size"] == [8, 8]
    assert data["detector_coord"] == [3, 6]


def test_system_health(client):
    """GET /api/system/health returns uptime and active cryptographic algorithms."""
    res = client.get("/api/system/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "operational"
    assert data["algorithms"]["kem"] == "ML-KEM-768"
    assert data["algorithms"]["sig"] == "ML-DSA-65"


def test_system_config(client):
    """GET /api/system/config returns Table 16 parameters without secret leakage."""
    res = client.get("/api/system/config")
    assert res.status_code == 200
    data = res.json()
    assert data["cryptography"]["kem_algorithm"] == "ML-KEM-768"
    assert data["lifecycle"]["max_messages_per_session"] == 1000
    assert data["database"]["key_material_stored"] is False


def test_spa_index_served(client):
    """GET / serves the built React single-page application."""
    res = client.get("/")
    assert res.status_code == 200
    assert "<!doctype html>" in res.text.lower()
    assert "PQ-KMS" in res.text


def test_device_keys_endpoint_and_state(client, admin_headers):
    """GET /devices/{device_id}/keys and /state expose verified public keys and fingerprints."""
    from tests.test_functional import _enrol_and_register
    import uuid
    import hashlib

    device_id = f"inspect-keys-{uuid.uuid4().hex[:8]}"
    info = _enrol_and_register(client, admin_headers, device_id)

    # 1. Test dedicated endpoint /devices/{device_id}/keys
    res = client.get(f"/devices/{device_id}/keys")
    assert res.status_code == 200
    data = res.json()
    assert data["device_id"] == device_id
    assert data["status"] == "AUTHORIZED"
    assert data["kem_key_size_bytes"] == 1184
    assert data["sig_key_size_bytes"] == 1952
    assert len(data["kem_public_key_hex"]) == 1184 * 2
    assert len(data["sig_public_key_hex"]) == 1952 * 2
    assert data["kem_fingerprint"] == hashlib.sha256(info["kem_pk"]).hexdigest()
    assert data["sig_fingerprint"] == hashlib.sha256(info["sig_pk"]).hexdigest()

    # 2. Test /state device list contains the keys
    res_state = client.get("/state")
    assert res_state.status_code == 200
    dev_state = next(d for d in res_state.json()["devices"] if d["device_id"] == device_id)
    assert dev_state["kem_key_size_bytes"] == 1184
    assert dev_state["kem_fingerprint"] == data["kem_fingerprint"]
    assert dev_state["kem_public_key_hex"] == data["kem_public_key_hex"]

