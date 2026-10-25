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
        event_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        prev_hash = self.get_last_audit_hash()
        # Build this record's content for hashing into the NEXT record
        record_content = f"{event_id}|{now}|{actor}|{event_type}|{device_id}|{outcome}|{prev_hash}"
        # We store prev_hash (the previous record's hash), and the next record will hash this one
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
            return [dict(r) for r in cur.fetchall()]

    def verify_audit_chain(self) -> tuple[bool, int | None]:
        """
        Verify the hash chain integrity of the audit log.

        Returns:
            (is_valid, break_index) — break_index is None if valid.
        """
        with self.cursor() as cur:
            cur.execute("SELECT * FROM audit_log ORDER BY rowid ASC")
            rows = [dict(r) for r in cur.fetchall()]

        if not rows:
            return True, None

        genesis_hash = "0" * 64
        for i, row in enumerate(rows):
            expected_prev = genesis_hash if i == 0 else _compute_record_hash(rows[i - 1])
            if row["prev_hash"] != expected_prev:
                return False, i
        return True, None

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
