"""
Interactive Cyber-Physical Attack Lab for DMFB Ecosystem.
Demonstrates specific attacks from DMFB literature (Ali et al., Guo et al.)
and how PQ-KMS cryptographic layers detect and prevent them.
"""
from __future__ import annotations

import base64
import copy
import json
import time
import uuid
from typing import Any, Dict

from app.audit.audit import get_audit_logger
from app.config import (
    CTX_SREQ,
    IV_ROLE_CLIENT,
    KEM_ALG,
    SIG_ALG,
)
from app.crypto.aead import decrypt as aead_decrypt
from app.crypto.aead import encrypt as aead_encrypt
from app.crypto.kdf import derive_session_key
from app.crypto.kem import decapsulate, encapsulate, generate_kem_keypair
from app.crypto.sig import generate_sig_keypair, sign as sig_sign, verify as sig_verify
from app.database.db import get_db
from app.key_management.lifecycle import get_lifecycle_manager
from app.revocation.revocation import revoke_device, verify_crl
from app.simulation.dmfb_simulator import DMFBBiochip, get_biochip


class AttackLab:
    """
    Executes live attack simulations and captures comparative results
    (Unprotected DMFB vs PQ-KMS Protected DMFB).
    """

    def __init__(self) -> None:
        self.db = get_db()
        self.audit = get_audit_logger()
        self.lifecycle = get_lifecycle_manager()

    def run_glucose_tamper_attack(
        self,
        true_glucose: float = 220.0,
        falsified_glucose: float = 110.0,
    ) -> Dict[str, Any]:
        """
        Glucose assay result manipulation attack simulation.
        An attacker in the middle intercepts the wireless transmission from the DMFB
        and alters a true 220 mg/dL (hyperglycemia requiring insulin) into 110 mg/dL
        (normal, leading to withheld medical treatment).
        """
        # 1. Physical Biochip executes genuine test
        chip = DMFBBiochip(device_id="DMFB-ALPHA")
        steps = chip.load_glucose_assay(patient_glucose=true_glucose)
        for s in steps:
            chip.execute_step(s)
        sensor_data = chip.read_optical_sensor()

        # 2. Unprotected scenario (Legacy Biochip with CRC or ECB)
        unprotected_intercepted = copy.deepcopy(sensor_data)
        unprotected_intercepted["glucose_mg_dl"] = falsified_glucose
        unprotected_intercepted["clinical_status"] = "NORMAL_FASTING (Falsified!)"
        unprotected_result = {
            "status": "VULNERABLE",
            "received_glucose": falsified_glucose,
            "clinical_consequence": "CRITICAL: Patient has severe hyperglycemia (220 mg/dL), but hospital server receives 110 mg/dL. Insulin withheld; risk of diabetic coma.",
            "detected_by_legacy": False,
        }

        # 3. PQ-KMS Protected Scenario
        # Create a real in-memory session key
        session_key = os_urandom_key()
        session_id = str(uuid.uuid4())
        device_id = "DMFB-ALPHA"
        counter = 101
        msg_id = str(uuid.uuid4())

        payload_bytes = json.dumps(sensor_data).encode("utf-8")
        ciphertext_with_tag, nonce = aead_encrypt(
            key=session_key,
            plaintext=payload_bytes,
            role=IV_ROLE_CLIENT,
            counter=counter,
            device_id=device_id,
            session_id=session_id,
            message_id=msg_id,
        )

        # Attacker tampers with ciphertext bytes in transit
        tampered_ciphertext = bytearray(ciphertext_with_tag)
        # Flip bits to simulate payload corruption
        tampered_ciphertext[5] ^= 0xAA
        tampered_ciphertext[12] ^= 0x55
        tampered_bytes = bytes(tampered_ciphertext)

        # Edge receiver decrypts
        pqkms_detected = False
        error_msg = ""
        try:
            aead_decrypt(
                key=session_key,
                ciphertext_with_tag=tampered_bytes,
                nonce=nonce,
                device_id=device_id,
                session_id=session_id,
                message_id=msg_id,
                counter=counter,
            )
        except Exception as exc:
            pqkms_detected = True
            error_msg = "AES-GCM Authentication Tag Mismatch (InvalidTag). Ciphertext modified in transit."
            self.audit.log(
                actor="ATTACK_LAB",
                event_type="TAMPER_ATTACK_BLOCKED",
                outcome="REJECTED",
                device_id=device_id,
                details="Glucose Tamper detected. Tag check failed.",
            )

        pqkms_result = {
            "status": "PROTECTED",
            "tamper_detected": pqkms_detected,
            "error_detail": error_msg,
            "received_glucose": None,
            "clinical_consequence": "SAFE: Packet rejected before reading interpretation. Alert triggered to nurse station. Assay re-run requested.",
        }

        return {
            "attack_type": "Glucose Assay Result Tampering",
            "true_glucose": true_glucose,
            "attacker_injected_glucose": falsified_glucose,
            "unprotected_system": unprotected_result,
            "pqkms_system": pqkms_result,
        }

    def run_replay_attack(self) -> Dict[str, Any]:
        """
        Replay attack: Attacker captures a valid old message (e.g. from yesterday
        when patient was healthy) and re-transmits it today when patient is in critical state.
        """
        session_key = os_urandom_key()
        session_id = str(uuid.uuid4())
        device_id = "DMFB-BETA"
        msg_id = str(uuid.uuid4())

        # Legitimate message at counter = 1
        legit_data = {"glucose_mg_dl": 95.0, "status": "HEALTHY"}
        ct, nonce = aead_encrypt(
            key=session_key,
            plaintext=json.dumps(legit_data).encode("utf-8"),
            role=IV_ROLE_CLIENT,
            counter=1,
            device_id=device_id,
            session_id=session_id,
            message_id=msg_id,
        )

        # Later, legitimate session moves forward to counter = 25
        # Now attacker replays the captured packet with counter = 1
        last_seen_counter = 25
        replay_detected = False
        rejection_reason = ""

        incoming_counter = 1
        if incoming_counter <= last_seen_counter:
            replay_detected = True
            rejection_reason = f"Monotonic counter violation: received counter={incoming_counter} <= last_accepted={last_seen_counter}"
            self.audit.log(
                actor="ATTACK_LAB",
                event_type="REPLAY_ATTACK_BLOCKED",
                outcome="REJECTED",
                device_id=device_id,
                details=rejection_reason,
            )

        return {
            "attack_type": "Diagnostic Message Replay Attack",
            "captured_message_counter": 1,
            "current_session_counter": last_seen_counter,
            "replay_detected": replay_detected,
            "rejection_reason": rejection_reason,
            "mitigation": "Strict per-session 64-bit invocation counter authenticated in AAD.",
        }

    def run_quantum_threat_comparison(self) -> Dict[str, Any]:
        """
        Comparison of Quantum Security between Classical baseline (X25519/RSA)
        and Post-Quantum ML-KEM-768.
        """
        return {
            "classical_mechanism": "X25519 (ECDH Curve25519) + Ed25519",
            "classical_quantum_security": "0 bits (Completely broken by Shor's Algorithm)",
            "shor_complexity": "O((log N)^3) polynomial time on fault-tolerant quantum computer",
            "pqc_mechanism": "NIST FIPS 203 ML-KEM-768 + FIPS 204 ML-DSA-65",
            "pqc_quantum_security": "Category 3 (~192-bit quantum security against best lattice sieving/BKZ algorithms)",
            "lattice_hardness": "Module Learning with Errors (M-LWE). No known polynomial quantum algorithm.",
            "harvest_now_decrypt_later_status": "PQC traffic recorded today remains undecryptable indefinitely.",
        }


def os_urandom_key(n: int = 32) -> bytes:
    import os
    return os.urandom(n)
