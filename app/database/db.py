"""
SQLite database manager for PQ-KMS.
Persists all metadata — device registry, sessions, messages, revocations, audit log,
and benchmark results. Session KEY MATERIAL is NEVER stored here.
"""
from __future__ import annotations

import hashlib
import json
import sqlite3
import threading
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Generator

from app.config import DATABASE_PATH


class Database:
    """Thread-safe SQLite database manager."""

    def __init__(self, db_path: str = DATABASE_PATH) -> None:
        self.db_path = db_path
        self._local = threading.local()
        self._audit_lock = threading.RLock()
        self._tamper_backup: dict[str, Any] | None = None
        self.init_db()

    def _get_conn(self) -> sqlite3.Connection:
        if not hasattr(self._local, "conn") or self._local.conn is None:
            conn = sqlite3.connect(self.db_path, check_same_thread=False)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("PRAGMA foreign_keys=ON")
            self._local.conn = conn
        return self._local.conn

    @contextmanager
    def cursor(self) -> Generator[sqlite3.Cursor, None, None]:
        conn = self._get_conn()
        cur = conn.cursor()
        try:
            yield cur
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cur.close()

    def init_db(self) -> None:
        """Create all tables if they don't exist."""
        with self.cursor() as cur:
            # Device registry
            cur.execute("""
                CREATE TABLE IF NOT EXISTS devices (
                    device_id TEXT PRIMARY KEY,
                    status TEXT NOT NULL DEFAULT 'PENDING',
                    kem_public_key BLOB,
                    sig_public_key BLOB,
                    enrolled_at TEXT,
                    enrolment_code_hash TEXT,
                    role TEXT NOT NULL DEFAULT 'device'
                )
            """)
            # Sessions — key material NOT stored, only metadata
            cur.execute("""
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    key_id TEXT NOT NULL,
                    device_id TEXT NOT NULL REFERENCES devices(device_id),
                    created_at TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    state TEXT NOT NULL DEFAULT 'CREATED',
                    msg_count INTEGER NOT NULL DEFAULT 0,
                    last_counter INTEGER NOT NULL DEFAULT 0
                )
            """)
            # Per-message outcomes (accepted/rejected, no plaintext)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    message_id TEXT NOT NULL,
                    session_id TEXT NOT NULL,
                    received_at TEXT NOT NULL,
                    outcome TEXT NOT NULL,
                    reason TEXT
                )
            """)
            # Revocation lists
            cur.execute("""
                CREATE TABLE IF NOT EXISTS revocations (
                    list_version INTEGER PRIMARY KEY,
                    issued_at TEXT NOT NULL,
                    device_ids TEXT NOT NULL,
                    signature BLOB NOT NULL
                )
            """)
            # Tamper-evident audit log (hash chain)
            cur.execute("""
                CREATE TABLE IF NOT EXISTS audit_log (
                    event_id TEXT PRIMARY KEY,
                    time TEXT NOT NULL,
                    actor TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    device_id TEXT,
                    outcome TEXT NOT NULL,
                    details TEXT,
                    prev_hash TEXT NOT NULL
                )
            """)
            # Benchmark results
            cur.execute("""
                CREATE TABLE IF NOT EXISTS benchmarks (
                    run_id TEXT NOT NULL,
                    operation TEXT NOT NULL,
                    algorithm TEXT NOT NULL,
                    trial INTEGER NOT NULL,
                    value_ns INTEGER NOT NULL,
                    unit TEXT NOT NULL DEFAULT 'ns',
                    environment TEXT,
                    PRIMARY KEY (run_id, operation, algorithm, trial)
                )
            """)
            # User accounts for dashboard authentication
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    role TEXT NOT NULL CHECK(role IN ('admin','doctor','auditor')),
                    department TEXT,
                    created_at TEXT NOT NULL,
                    last_login TEXT,
                    is_active INTEGER NOT NULL DEFAULT 1
                )
            """)

    # ─── Device operations ──────────────────────────────────────────────

    def create_enrolment_code_record(
        self, device_id: str, code_hash: str, role: str = "device"
    ) -> None:
        with self.cursor() as cur:
            cur.execute(
                """INSERT OR REPLACE INTO devices
                   (device_id, status, enrolment_code_hash, role)
                   VALUES (?, 'PENDING', ?, ?)""",
                (device_id, code_hash, role),
            )

    def get_device(self, device_id: str) -> dict | None:
        with self.cursor() as cur:
            cur.execute("SELECT * FROM devices WHERE device_id = ?", (device_id,))
            row = cur.fetchone()
            return dict(row) if row else None

    def register_device(
        self,
        device_id: str,
        kem_public_key: bytes,
        sig_public_key: bytes,
    ) -> None:
        with self.cursor() as cur:
            cur.execute(
                """UPDATE devices SET
                   status='AUTHORIZED',
                   kem_public_key=?,
                   sig_public_key=?,
                   enrolled_at=?,
                   enrolment_code_hash=NULL
                   WHERE device_id=?""",
                (
                    kem_public_key,
                    sig_public_key,
                    datetime.now(timezone.utc).isoformat(),
                    device_id,
                ),
            )

    def set_device_status(self, device_id: str, status: str) -> None:
        with self.cursor() as cur:
            cur.execute(
                "UPDATE devices SET status=? WHERE device_id=?",
                (status, device_id),
            )

    def get_all_devices(self) -> list[dict]:
        with self.cursor() as cur:
            cur.execute("SELECT * FROM devices")
            return [dict(r) for r in cur.fetchall()]

    # ─── Session operations ─────────────────────────────────────────────

    def create_session(
        self,
        session_id: str,
        key_id: str,
        device_id: str,
        created_at: datetime,
        expires_at: datetime,
    ) -> None:
        with self.cursor() as cur:
            cur.execute(
                """INSERT INTO sessions
                   (session_id, key_id, device_id, created_at, expires_at, state, msg_count, last_counter)
                   VALUES (?, ?, ?, ?, ?, 'ACTIVE', 0, 0)""",
                (
                    session_id,
                    key_id,
                    device_id,
                    created_at.isoformat(),
                    expires_at.isoformat(),
                ),
            )

    def get_session(self, session_id: str) -> dict | None:
        with self.cursor() as cur:
            cur.execute("SELECT * FROM sessions WHERE session_id=?", (session_id,))
            row = cur.fetchone()
            return dict(row) if row else None

    def update_session_state(self, session_id: str, state: str) -> None:
        with self.cursor() as cur:
            cur.execute(
                "UPDATE sessions SET state=? WHERE session_id=?", (state, session_id)
            )

    def update_session_counters(
        self, session_id: str, msg_count: int, last_counter: int
    ) -> None:
        with self.cursor() as cur:
            cur.execute(
                "UPDATE sessions SET msg_count=?, last_counter=? WHERE session_id=?",
                (msg_count, last_counter, session_id),
            )

    def get_active_sessions(self) -> list[dict]:
        with self.cursor() as cur:
            cur.execute("SELECT * FROM sessions WHERE state IN ('ACTIVE','DEACTIVATED')")
            return [dict(r) for r in cur.fetchall()]

    def get_all_sessions(self) -> list[dict]:
        with self.cursor() as cur:
            cur.execute("SELECT * FROM sessions ORDER BY created_at DESC")
            return [dict(r) for r in cur.fetchall()]

    def get_device_sessions(self, device_id: str) -> list[dict]:
        with self.cursor() as cur:
            cur.execute(
                "SELECT * FROM sessions WHERE device_id=? AND state NOT IN ('DESTROYED','COMPROMISED')",
                (device_id,),
            )
            return [dict(r) for r in cur.fetchall()]

    # ─── Message operations ─────────────────────────────────────────────

    def log_message(
        self,
        message_id: str,
        session_id: str,
        outcome: str,
        reason: str | None = None,
    ) -> None:
        with self.cursor() as cur:
            cur.execute(
                """INSERT INTO messages (message_id, session_id, received_at, outcome, reason)
                   VALUES (?, ?, ?, ?, ?)""",
                (
                    message_id,
                    session_id,
                    datetime.now(timezone.utc).isoformat(),
                    outcome,
                    reason,
                ),
            )

    def get_message_stats(self) -> dict:
        with self.cursor() as cur:
            cur.execute(
                "SELECT outcome, COUNT(*) as cnt FROM messages GROUP BY outcome"
            )
            return {row["outcome"]: row["cnt"] for row in cur.fetchall()}

    # ─── Revocation operations ──────────────────────────────────────────

    def save_revocation_list(
        self,
        list_version: int,
        device_ids: list[str],
        signature: bytes,
        issued_at: str | None = None,
    ) -> None:
        if issued_at is None:
            issued_at = datetime.now(timezone.utc).isoformat()
        with self.cursor() as cur:
            cur.execute(
                """INSERT OR REPLACE INTO revocations
                   (list_version, issued_at, device_ids, signature)
                   VALUES (?, ?, ?, ?)""",
                (
                    list_version,
                    issued_at,
                    json.dumps(device_ids),
                    signature,
                ),
            )

    def get_latest_revocation_list(self) -> dict | None:
        with self.cursor() as cur:
            cur.execute(
                "SELECT * FROM revocations ORDER BY list_version DESC LIMIT 1"
            )
            row = cur.fetchone()
            if row:
                d = dict(row)
                d["device_ids"] = json.loads(d["device_ids"])
                return d
            return None

    # ─── Audit log operations ───────────────────────────────────────────

    def get_last_audit_hash(self) -> str:
        with self.cursor() as cur:
            cur.execute(
                "SELECT * FROM audit_log ORDER BY rowid DESC LIMIT 1"
            )
            row = cur.fetchone()
            if row is None:
                return "0" * 64
            return _compute_record_hash(dict(row))

    def append_audit_event(
        self,
        actor: str,
        event_type: str,
        outcome: str,
        device_id: str | None = None,
        details: str | None = None,
    ) -> str:
        with self._audit_lock:
            event_id = str(uuid.uuid4())
            now = datetime.now(timezone.utc).isoformat()
            prev_hash = self.get_last_audit_hash()
            with self.cursor() as cur:
                cur.execute(
                    """INSERT INTO audit_log
                       (event_id, time, actor, event_type, device_id, outcome, details, prev_hash)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    (event_id, now, actor, event_type, device_id, outcome, details, prev_hash),
                )
            return event_id

    def get_audit_log(self, limit: int = 200) -> list[dict]:
        with self.cursor() as cur:
            cur.execute(
                "SELECT * FROM audit_log ORDER BY time DESC LIMIT ?", (limit,)
            )
            rows = [dict(r) for r in cur.fetchall()]
            for r in rows:
                r["current_hash"] = _compute_record_hash(r)
            return rows

    def get_audit_log_paginated(
        self,
        limit: int = 50,
        offset: int = 0,
        search: str | None = None,
        event_type: str | None = None,
        outcome: str | None = None,
        actor: str | None = None,
    ) -> tuple[list[dict], int, dict]:
        """
        Fetch audit records with search, filter, pagination, and outcome statistics.
        Also attaches computed `current_hash` for each returned event.
        """
        with self.cursor() as cur:
            # Query global outcome counts
            cur.execute(
                "SELECT outcome, COUNT(*) FROM audit_log GROUP BY outcome"
            )
            stats = {row[0]: row[1] for row in cur.fetchall()}
            stats["TOTAL"] = sum(stats.values())

            # Base query
            query = "SELECT rowid, * FROM audit_log WHERE 1=1"
            params: list[Any] = []

            if search:
                s = f"%{search.strip()}%"
                query += " AND (event_type LIKE ? OR actor LIKE ? OR device_id LIKE ? OR details LIKE ? OR event_id LIKE ?)"
                params.extend([s, s, s, s, s])

            if event_type and event_type != "ALL":
                query += " AND event_type = ?"
                params.append(event_type)

            if outcome and outcome != "ALL":
                query += " AND outcome = ?"
                params.append(outcome)

            if actor and actor != "ALL":
                query += " AND actor = ?"
                params.append(actor)

            # Count total matching query
            count_query = query.replace("SELECT rowid, * FROM", "SELECT COUNT(*) FROM")
            cur.execute(count_query, params)
            matching_count = cur.fetchone()[0]

            # Fetch paginated rows ordered by rowid DESC (newest first)
            query += " ORDER BY rowid DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            cur.execute(query, params)
            rows = [dict(r) for r in cur.fetchall()]

            # Compute current_hash for each row
            for r in rows:
                r["current_hash"] = _compute_record_hash(r)

            return rows, matching_count, stats

    def verify_audit_chain_detailed(self) -> dict:
        """
        Verify the hash chain integrity of the audit log with forensic details.
        Returns detailed diagnostic breakdown if discontinuity is found.
        """
        with self.cursor() as cur:
            cur.execute("SELECT rowid, * FROM audit_log ORDER BY rowid ASC")
            rows = [dict(r) for r in cur.fetchall()]

        total = len(rows)
        if not rows:
            return {
                "is_valid": True,
                "break_index": None,
                "total_records": 0,
                "break_details": None,
            }

        genesis_hash = "0" * 64
        for i, row in enumerate(rows):
            expected_prev = genesis_hash if i == 0 else _compute_record_hash(rows[i - 1])
            if row["prev_hash"] != expected_prev:
                # Analyze whether this was a concurrent race fork
                is_concurrent_fork = any(
                    rows[j]["prev_hash"] == row["prev_hash"]
                    for j in range(max(0, i - 10), i)
                )
                break_details = {
                    "index": i,
                    "rowid": row.get("rowid"),
                    "event_id": row.get("event_id"),
                    "time": row.get("time"),
                    "actor": row.get("actor"),
                    "event_type": row.get("event_type"),
                    "device_id": row.get("device_id"),
                    "outcome": row.get("outcome"),
                    "details": row.get("details"),
                    "expected_prev_hash": expected_prev,
                    "actual_prev_hash": row.get("prev_hash"),
                    "preceding_event_id": rows[i - 1].get("event_id") if i > 0 else None,
                    "preceding_time": rows[i - 1].get("time") if i > 0 else None,
                    "preceding_event_type": rows[i - 1].get("event_type") if i > 0 else None,
                    "reason": (
                        "Non-linear branch / concurrent thread fork detected at sequence index #"
                        + str(i)
                        + ". Multiple transactions referenced the same parent block."
                        if is_concurrent_fork
                        else "Cryptographic digest mismatch: Stored prev_hash does not match predecessor SHA-256."
                    ),
                }
                return {
                    "is_valid": False,
                    "break_index": i,
                    "total_records": total,
                    "break_details": break_details,
                }
        return {
            "is_valid": True,
            "break_index": None,
            "total_records": total,
            "break_details": None,
        }

    def verify_audit_chain(self) -> tuple[bool, int | None]:
        """
        Verify the hash chain integrity of the audit log.
        Returns:
            (is_valid, break_index) — break_index is None if valid.
        """
        res = self.verify_audit_chain_detailed()
        return res["is_valid"], res["break_index"]

    def reseal_audit_chain(self, actor: str = "admin") -> dict:
        """
        Recalculate and re-anchor the cryptographic SHA-256 chain from genesis across
        all historical audit records, eliminating concurrency race-forks, then record
        an official AUDIT_CHAIN_RESEALED governance entry.
        """
        with self._audit_lock:
            with self.cursor() as cur:
                cur.execute("SELECT rowid, * FROM audit_log ORDER BY rowid ASC")
                rows = [dict(r) for r in cur.fetchall()]
                if not rows:
                    return {"status": "empty", "resealed_count": 0, "repaired_count": 0}

                genesis_hash = "0" * 64
                prev = genesis_hash
                repaired_count = 0

                for i, row in enumerate(rows):
                    rowid = row["rowid"]
                    if row["prev_hash"] != prev:
                        cur.execute(
                            "UPDATE audit_log SET prev_hash = ? WHERE rowid = ?",
                            (prev, rowid),
                        )
                        row["prev_hash"] = prev
                        repaired_count += 1
                    prev = _compute_record_hash(row)

            # Clear any active simulation backup
            self._tamper_backup = None

            # Log governance reseal event
            event_id = self.append_audit_event(
                actor=actor,
                event_type="AUDIT_CHAIN_RESEALED",
                outcome="ACCEPTED",
                device_id=None,
                details=f"Cryptographic hash chain verified and re-anchored across {len(rows)} records. Repaired {repaired_count} discontinuities.",
            )
            return {
                "status": "success",
                "resealed_count": len(rows),
                "repaired_count": repaired_count,
                "reseal_event_id": event_id,
            }

    def simulate_audit_tamper(self, target_index: int | None = None) -> dict:
        """
        Adversarial sandbox: Alter a historical block prev_hash to test real-time tamper evidence.
        """
        with self._audit_lock:
            with self.cursor() as cur:
                cur.execute("SELECT rowid, * FROM audit_log ORDER BY rowid ASC")
                rows = [dict(r) for r in cur.fetchall()]
                if len(rows) == 0:
                    return {"status": "error", "message": "No audit records found to simulate tamper"}

                # Pick index (default: middle of chain or latest available)
                idx = target_index if (target_index is not None and 0 <= target_index < len(rows)) else (len(rows) // 2)
                target = rows[idx]
                orig_hash = target["prev_hash"]
                # Invert/tamper the first 8 hex characters
                tampered_hash = "deadbeef" + orig_hash[8:]

                # Save backup for clean restoration
                self._tamper_backup = {
                    "rowid": target["rowid"],
                    "index": idx,
                    "original_prev_hash": orig_hash,
                }

                cur.execute(
                    "UPDATE audit_log SET prev_hash = ? WHERE rowid = ?",
                    (tampered_hash, target["rowid"]),
                )

                return {
                    "status": "tampered",
                    "tampered_index": idx,
                    "event_id": target["event_id"],
                    "original_prev_hash": orig_hash,
                    "tampered_prev_hash": tampered_hash,
                }

    def restore_audit_tamper(self) -> dict:
        """
        Adversarial sandbox: Revert simulated tamper to original hash state or reseal chain.
        """
        with self._audit_lock:
            if self._tamper_backup:
                rowid = self._tamper_backup["rowid"]
                orig_hash = self._tamper_backup["original_prev_hash"]
                with self.cursor() as cur:
                    cur.execute(
                        "UPDATE audit_log SET prev_hash = ? WHERE rowid = ?",
                        (orig_hash, rowid),
                    )
                self._tamper_backup = None

            # Reseal to ensure complete continuity
            return self.reseal_audit_chain(actor="admin")

    # ─── Benchmark operations ───────────────────────────────────────────

    def save_benchmark_trial(
        self,
        run_id: str,
        operation: str,
        algorithm: str,
        trial: int,
        value_ns: int,
        environment: str | None = None,
    ) -> None:
        with self.cursor() as cur:
            cur.execute(
                """INSERT OR REPLACE INTO benchmarks
                   (run_id, operation, algorithm, trial, value_ns, unit, environment)
                   VALUES (?, ?, ?, ?, ?, 'ns', ?)""",
                (run_id, operation, algorithm, trial, value_ns, environment),
            )

    def get_benchmark_stats(self, run_id: str | None = None) -> list[dict]:
        with self.cursor() as cur:
            if run_id:
                cur.execute(
                    """SELECT operation, algorithm,
                          COUNT(*) as trials,
                          AVG(value_ns) as mean_ns,
                          MIN(value_ns) as min_ns,
                          MAX(value_ns) as max_ns
                       FROM benchmarks WHERE run_id=?
                       GROUP BY operation, algorithm""",
                    (run_id,),
                )
            else:
                cur.execute(
                    """SELECT operation, algorithm,
                          COUNT(*) as trials,
                          AVG(value_ns) as mean_ns,
                          MIN(value_ns) as min_ns,
                          MAX(value_ns) as max_ns
                       FROM benchmarks
                       GROUP BY operation, algorithm"""
                )
            return [dict(r) for r in cur.fetchall()]

    # ─── User operations ────────────────────────────────────────────────────────

    def create_user(self, user_id: str, username: str, password_hash: str, full_name: str, role: str, department: str | None = None) -> None:
        from datetime import datetime, timezone
        with self.cursor() as cur:
            cur.execute(
                """INSERT INTO users (user_id, username, password_hash, full_name, role, department, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (user_id, username, password_hash, full_name, role, department,
                 datetime.now(timezone.utc).isoformat()),
            )

    def get_user_by_username(self, username: str) -> dict | None:
        with self.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE username = ?", (username,))
            row = cur.fetchone()
            return dict(row) if row else None

    def get_user_by_id(self, user_id: str) -> dict | None:
        with self.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            row = cur.fetchone()
            return dict(row) if row else None

    def get_all_users(self) -> list[dict]:
        with self.cursor() as cur:
            cur.execute("SELECT user_id, username, full_name, role, department, created_at, last_login, is_active FROM users ORDER BY created_at DESC")
            return [dict(r) for r in cur.fetchall()]

    def update_user_last_login(self, user_id: str) -> None:
        from datetime import datetime, timezone
        with self.cursor() as cur:
            cur.execute("UPDATE users SET last_login = ? WHERE user_id = ?",
                       (datetime.now(timezone.utc).isoformat(), user_id))

    # ─── Dashboard queries ───────────────────────────────────────────────

    def get_state_summary(self) -> dict:
        """Summary for the dashboard /state endpoint."""
        devices = self.get_all_devices()
        sessions = self.get_all_sessions()
        msg_stats = self.get_message_stats()
        crl = self.get_latest_revocation_list()
        return {
            "devices": devices,
            "sessions": sessions,
            "message_stats": msg_stats,
            "latest_crl_version": crl["list_version"] if crl else 0,
            "revoked_devices": crl["device_ids"] if crl else [],
        }


def _compute_record_hash(row: dict) -> str:
    """Compute SHA-256 hash of an audit record for chain linking."""
    fields = ["event_id", "time", "actor", "event_type", "device_id", "outcome", "prev_hash"]
    parts = []
    for k in fields:
        val = row.get(k)
        parts.append("" if val is None else str(val))
    content = "|".join(parts)
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


# Global database instance
_db: Database | None = None


def get_db() -> Database:
    global _db
    if _db is None:
        _db = Database()
    return _db
