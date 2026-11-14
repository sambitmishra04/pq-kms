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


def test_audit_endpoints_and_governance(client: TestClient):
    """Test enhanced audit log endpoints, pagination, tamper simulation, and export."""
    # 1. Test paginated audit query
    res = client.get("/audit?limit=10&offset=0")
    assert res.status_code == 200
    data = res.json()
    assert "events" in data
    assert "chain_valid" in data
    assert "total_records" in data
    assert "stats" in data
    assert len(data["events"]) <= 10
    if len(data["events"]) > 0:
        assert "current_hash" in data["events"][0]

    # 2. Test CSV export
    res_csv = client.get("/audit/export?format=csv")
    assert res_csv.status_code == 200
    assert "text/csv" in res_csv.headers["content-type"]
    assert "Event ID,Timestamp (UTC)" in res_csv.text

    # 3. Test JSON export
    res_json = client.get("/audit/export?format=json")
    assert res_json.status_code == 200
    bundle = res_json.json()
    assert "metadata" in bundle
    assert "records" in bundle

    # 4. Test simulate tamper and restore
    tamper_res = client.post("/audit/simulate-tamper")
    assert tamper_res.status_code == 200
    tamper_data = tamper_res.json()
    assert tamper_data["status"] == "tampered"

    # Verify chain is invalid
    verify_res = client.get("/audit?limit=5")
    assert verify_res.status_code == 200
    assert verify_res.json()["chain_valid"] is False

    # Restore and reseal
    restore_res = client.post("/audit/restore")
    assert restore_res.status_code == 200
    assert restore_res.json()["status"] == "restored"

    # Verify chain is now valid
    verify_after = client.get("/audit?limit=5")
    assert verify_after.status_code == 200
    assert verify_after.json()["chain_valid"] is True


def test_session_lifecycle_and_governance_endpoints(client, admin_headers):
    """Test the session pagination, memory status, inspection, and action endpoints."""
    # 1. Test GET /sessions (paginated)
    res = client.get("/sessions?page=1&page_size=10")
    assert res.status_code == 200
    data = res.json()
    assert "sessions" in data
    assert "total" in data
    assert "stats" in data
    assert "memory_status" in data
    assert data["page"] == 1
    assert data["page_size"] == 10

    # 2. Test GET /sessions/memory-status
    mem_res = client.get("/sessions/memory-status")
    assert mem_res.status_code == 200
    mem_data = mem_res.json()
    assert "volatile_keys_in_ram" in mem_data
    assert mem_data["disk_key_material_stored"] is False

    # 3. If there is at least one session, test details and actions
    if data["sessions"]:
        target_sid = data["sessions"][0]["session_id"]

        # Details
        detail_res = client.get(f"/sessions/{target_sid}/details")
        assert detail_res.status_code == 200
        detail = detail_res.json()
        assert detail["session_id"] == target_sid
        assert "cipher_suite" in detail
        assert "kem_primitive" in detail
        assert "next_expected_counter" in detail

        # Deactivate
        deact_res = client.post(f"/sessions/{target_sid}/deactivate")
        assert deact_res.status_code == 200
        assert deact_res.json()["action"] == "deactivate"

        # Destroy
        destroy_res = client.post(f"/sessions/{target_sid}/destroy")
        assert destroy_res.status_code == 200
        assert destroy_res.json()["action"] == "destroy"

    # 4. Bulk operations
    bulk_res = client.post("/sessions/bulk-rotate-expired")
    assert bulk_res.status_code == 200
    assert bulk_res.json()["status"] == "success"

    # Purge destroyed
    purge_res = client.post("/sessions/purge-destroyed")
    assert purge_res.status_code == 200
    assert purge_res.json()["status"] == "success"


def test_clinician_portal_endpoints(client):
    """Test clinician patient listing, biochip telemetry, acknowledgment, intervention, assay re-run, and tamper."""
    # 1. Listing patients with summary
    res = client.get("/api/clinician/patients?page=1&page_size=10")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] > 100
    assert len(data["patients"]) == 10
    assert "summary" in data
    assert data["summary"]["active_biochips"] > 0
    first_patient = data["patients"][0]
    pid = first_patient["patient_id"]
    assert pid == "PAT-4821"
    assert first_patient["name"] == "Eleanor Vance"
    assert first_patient["device_id"] == "DMFB-ALPHA-POC"
    assert first_patient["crypto_verified"] is True

    # 2. Patient detail
    detail_res = client.get(f"/api/clinician/patients/{pid}")
    assert detail_res.status_code == 200
    assert detail_res.json()["patient_id"] == pid

    # 3. Acknowledge
    ack_res = client.post(f"/api/clinician/patients/{pid}/acknowledge", json={"note": "Clinician reviewed"})
    assert ack_res.status_code == 200
    assert ack_res.json()["status"] == "success"
    assert "audit_event_id" in ack_res.json()

    # 4. Clinical intervention
    inv_res = client.post(
        f"/api/clinician/patients/{pid}/intervention",
        json={"protocol": "Regular Insulin", "dosage": "8 Units SubQ", "notes": "Target glucose < 140"},
    )
    assert inv_res.status_code == 200
    assert inv_res.json()["status"] == "dispatched"
    assert "audit_event_id" in inv_res.json()

    # 5. Re-run bioassay via DMFB digital twin simulator
    rerun_res = client.post(f"/api/clinician/patients/{pid}/re-run-assay")
    assert rerun_res.status_code == 200
    assert rerun_res.json()["status"] == "success"
    assert "sensor_reading" in rerun_res.json()
    assert rerun_res.json()["sensor_reading"]["detected"] is True

    # 6. Simulate MITM tamper on telemetry
    tamper_res = client.post(f"/api/clinician/patients/{pid}/simulate-tamper")
    assert tamper_res.status_code == 200
    tamper_data = tamper_res.json()
    assert tamper_data["is_tampered"] is True
    assert tamper_data["tamper_detected"] is True
    assert "audit_event_id" in tamper_data

    # 7. Reset tamper
    reset_res = client.post(f"/api/clinician/patients/{pid}/reset-tamper")
    assert reset_res.status_code == 200
    assert reset_res.json()["is_tampered"] is False
    assert reset_res.json()["crypto_verified"] is True




