# PQ-KMS: Quantum-Resistant Key Management System for DMFB Ecosystem

> **B.Tech Final Year Project** — Software prototype implementing NIST FIPS 203 (ML-KEM-768)
> and FIPS 204 (ML-DSA-65) post-quantum cryptography for simulated Digital Microfluidic Biochip networks.

---

## Quick Start

```bash
# 1. One-time setup (creates .venv, installs deps, downloads data)
bash run.sh setup

# 2. Run full test suite (FT-01..FT-05 + ST-01..ST-14)
bash run.sh test

# 3. Run all benchmark experiments and generate figures/tables
bash run.sh bench

# 4a. Start the Medical SOC & Biochip Simulator Dashboard (Streamlit)
bash run.sh dashboard                # → http://localhost:8501

# 4b. Start the Modern Interactive React Dashboard
bash run.sh dashboard-old            # → http://localhost:8502 (or bash run.sh dashboard-react)

# 4c. Start the Classic Streamlit Dashboard (before-change version)
bash run.sh dashboard-old-streamlit  # → http://localhost:8501

# 5. Start the API server (in a separate terminal)
bash run.sh server      # → http://localhost:8000
```

---

## Project Structure

```
kms/
├── app/
│   ├── config.py                    # All policy parameters (Table 14)
│   ├── main.py                      # FastAPI server entry point
│   ├── api/
│   │   ├── models.py                # Pydantic request/response models
│   │   └── routes.py                # 8 REST API endpoints (Table 13)
│   ├── crypto/
│   │   ├── kem.py                   # ML-KEM-768 wrapper (FIPS 203)
│   │   ├── sig.py                   # ML-DSA-65 wrapper (FIPS 204)
│   │   ├── kdf.py                   # HKDF-SHA256 (RFC 5869)
│   │   ├── aead.py                  # AES-256-GCM (SP 800-38D)
│   │   └── classical.py             # X25519 + Ed25519 baseline
│   ├── key_management/
│   │   └── lifecycle.py             # SP 800-57 state machine + in-memory key store
│   ├── device_management/
│   │   └── registry.py              # Algorithm 1: registration
│   ├── revocation/
│   │   └── revocation.py            # Algorithm 5: signed CRL
│   ├── database/
│   │   └── db.py                    # SQLite metadata (no key material)
│   ├── audit/
│   │   └── audit.py                 # Hash-chained tamper-evident audit log
│   └── simulation/
│       ├── client.py                # Simulated biochip client (full protocol)
│       └── workloads.py             # Real + synthetic biomedical payloads
├── dashboard/
│   ├── app.py                       # Newer Streamlit SOC & biochip simulator dashboard
│   ├── old_app.py                   # Classic/original Streamlit monitoring dashboard (before-change)
│   ├── server.py                    # Modern React dashboard server
│   └── react_ui/                    # Modern clean interactive React UI (source & pre-built dist)
├── tests/
│   ├── conftest.py                  # Fixtures (in-process server, device helpers)
│   ├── test_functional.py           # FT-01 to FT-05
│   └── test_security.py             # ST-01 to ST-14
├── experiments/
│   ├── download_data.py             # Kaggle / public vitals data downloader
│   ├── benchmark_primitives.py      # E1, E2: per-operation timings
│   ├── benchmark_e2e.py             # E3, E4: end-to-end + signature scaling
│   ├── benchmark_memory.py          # E6: RSS memory footprint
│   └── generate_results.py          # Master: runs all experiments, makes figures/tables
├── results/
│   ├── figures/                     # PNG figures (300 dpi) — Tables 19
│   └── tables/                      # CSV + Markdown tables — Tables 15, 18, 20
├── data/
│   └── vitals.csv                   # Patient vitals data (Kaggle/synthetic)
├── run.sh                           # One-command wrapper
├── requirements.txt
└── pytest.ini
```

---

## Cryptographic Design

| Purpose | Algorithm | Standard |
|---------|-----------|----------|
| Key encapsulation | ML-KEM-768 | NIST FIPS 203 |
| Digital signatures | ML-DSA-65 (hedged) | NIST FIPS 204 |
| Key derivation | HKDF-SHA256 | RFC 5869 |
| Data protection | AES-256-GCM | NIST SP 800-38D |
| Classical baseline | X25519 + Ed25519 | Comparison only |

**IV construction**: `role32 || counter64` (96-bit deterministic, SP 800-38D §8.2.1)
**HKDF info**: `"PQKMS-v1" || device_id || session_id || "aes256gcm"`
**Domain separation**: context prefixes `PQKMS-REG`, `PQKMS-SREQ`, `PQKMS-SRESP`, `PQKMS-REV`

---

## API Endpoints (Table 13)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/enrol` | Admin creates enrolment code | Admin token |
| POST | `/register` | Device registers with proof-of-possession | Public |
| POST | `/session` | Signed session request → ML-KEM encap | Device sig |
| POST | `/message` | AES-256-GCM protected message | Session |
| POST | `/revoke` | Revoke device, issue signed CRL | Admin token |
| GET | `/revocations` | Fetch latest signed CRL | Public |
| GET | `/state` | Device + session state | Public |
| GET | `/audit` | Audit log with chain check | Public |
| GET | `/metrics` | Benchmark statistics | Public |

---

## Test Coverage

| Suite | Count | Coverage |
|-------|-------|----------|
| Functional (FT) | 5 | Registration, key agreement, AES-GCM, metadata, dashboard |
| Security (ST) | 14 | Full attack matrix (replay, tampering, revocation, cross-context sig, ...) |

---

## Configuration (Table 14)

Set via environment variables or `app/config.py`:

| Variable | Default | Meaning |
|----------|---------|---------|
| `KEM_ALG` | `ML-KEM-768` | KEM parameter set |
| `SIG_ALG` | `ML-DSA-65` | Signature parameter set |
| `SESSION_LIFETIME_S` | `60` | Session key cryptoperiod (demo) |
| `MAX_MESSAGES` | `1000` | Messages per session key |
| `ADMIN_TOKEN` | `admin-secret-...` | Change in production! |

---

## Cleanup

```bash
# Remove EVERYTHING (venv, database, results, built liboqs)
rm -rf /home/sambit/code/kms/.venv
rm -rf /home/sambit/_oqs
rm -rf /home/sambit/code/kms/results/
rm -f /home/sambit/code/kms/*.db /home/sambit/code/kms/server_keys.json

# Or remove the whole project directory
rm -rf /home/sambit/code/kms
```

---

## References

- [NIST FIPS 203] ML-KEM (Kyber) — https://doi.org/10.6028/NIST.FIPS.203
- [NIST FIPS 204] ML-DSA (Dilithium) — https://doi.org/10.6028/NIST.FIPS.204
- [NIST SP 800-57] Key Management — https://doi.org/10.6028/NIST.SP.800-57pt1r5
- [NIST SP 800-38D] GCM — https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf
- [liboqs] Open Quantum Safe — https://openquantumsafe.org
