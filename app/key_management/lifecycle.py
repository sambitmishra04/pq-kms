"""
Key lifecycle manager: in-memory session key store + state machine.
Session keys NEVER touch the database. Only metadata is persisted.
Implements NIST SP 800-57 key states: CREATED → ACTIVE → DEACTIVATED → DESTROYED
                                                      → COMPROMISED → DESTROYED
"""
from __future__ import annotations

import threading
import time
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from app.audit.audit import get_audit_logger
from app.config import GRACE_WINDOW_S, MAX_MESSAGES, SESSION_LIFETIME_S
from app.database.db import get_db


@dataclass
class SessionKeyEntry:
    """In-memory session key record. Key bytes stored ONLY here, never in DB."""
    session_id: str
    key_id: str
    device_id: str
    key_bytes: bytes        # 32-byte AES-256-GCM key
    state: str              # CREATED, ACTIVE, DEACTIVATED, COMPROMISED, DESTROYED
    created_at: float       # epoch time
    expires_at: float       # epoch time
    msg_count: int = 0
    last_counter: int = 0
    deactivated_at: Optional[float] = None

    def is_expired(self) -> bool:
        return time.time() >= self.expires_at

    def is_msg_limit_reached(self) -> bool:
        return self.msg_count >= MAX_MESSAGES

    def is_grace_expired(self) -> bool:
        if self.deactivated_at is None:
            return True
        return time.time() >= (self.deactivated_at + GRACE_WINDOW_S)

    def wipe_key(self) -> None:
        """Overwrite key bytes in-place (best-effort in Python)."""
        if self.key_bytes:
            # Overwrite backing buffer with zeros (best effort — Python may copy)
            self.key_bytes = b"\x00" * len(self.key_bytes)
            self.key_bytes = b""


class KeyLifecycleManager:
    """Thread-safe in-memory session key store with lifecycle enforcement."""

    def __init__(self) -> None:
        self._store: dict[str, SessionKeyEntry] = {}
        self._lock = threading.RLock()

    def create_session(
        self,
        device_id: str,
        key_bytes: bytes,
        lifetime_s: int = SESSION_LIFETIME_S,
    ) -> tuple[str, str, datetime, datetime]:
        """
        Create a new session key entry in ACTIVE state.

        Returns:
            (session_id, key_id, created_at, expires_at)
        """
        session_id = str(uuid.uuid4())
        key_id = str(uuid.uuid4())
        now = time.time()
        expires = now + lifetime_s
        created_dt = datetime.fromtimestamp(now, tz=timezone.utc)
        expires_dt = datetime.fromtimestamp(expires, tz=timezone.utc)

        entry = SessionKeyEntry(
            session_id=session_id,
            key_id=key_id,
            device_id=device_id,
            key_bytes=key_bytes,
            state="ACTIVE",
            created_at=now,
            expires_at=expires,
        )
        with self._lock:
            self._store[session_id] = entry

        # Persist metadata only
        db = get_db()
        db.create_session(session_id, key_id, device_id, created_dt, expires_dt)
        get_audit_logger().log(
            actor="server",
            event_type="SESSION_CREATED",
            outcome="ACCEPTED",
            device_id=device_id,
            details=f"session_id={session_id} key_id={key_id} expires={expires_dt.isoformat()}",
        )
        return session_id, key_id, created_dt, expires_dt

    def get_key_for_message(
        self, session_id: str, counter: int
    ) -> tuple[bytes, SessionKeyEntry]:
        """
        Retrieve the session key for message processing with full lifecycle checks.

        Args:
            session_id: The session ID.
            counter: The incoming message counter (must be > last_counter).

        Returns:
            (key_bytes, entry)

        Raises:
            ValueError: For expired session, wrong state, or replay.
        """
        with self._lock:
            entry = self._store.get(session_id)
            if entry is None:
                raise ValueError(f"Session '{session_id}' not found (may have been destroyed)")

            if entry.state == "DESTROYED":
                raise ValueError(f"Session '{session_id}' is DESTROYED")

            if entry.state == "COMPROMISED":
                raise ValueError(f"Session '{session_id}' is COMPROMISED")

            if entry.state == "DEACTIVATED":
                if entry.is_grace_expired():
                    self._destroy_session_locked(entry)
                    raise ValueError(f"Session '{session_id}' grace window expired")
                # Decrypt-only during grace window — no new messages accepted
                raise ValueError(f"Session '{session_id}' is DEACTIVATED (grace window active, reject new messages)")

            if entry.state != "ACTIVE":
                raise ValueError(f"Session '{session_id}' state={entry.state}")

            if entry.is_expired():
                self._deactivate_session_locked(entry)
                raise ValueError(f"Session '{session_id}' has expired")

            if entry.is_msg_limit_reached():
                self._deactivate_session_locked(entry)
                raise ValueError(f"Session '{session_id}' has reached message limit")

            # Replay check: counter must be strictly increasing
            if counter <= entry.last_counter:
                raise ValueError(
                    f"Replay detected: counter {counter} <= last_counter {entry.last_counter}"
                )

            # Accept — update counters
            entry.msg_count += 1
            entry.last_counter = counter
            get_db().update_session_counters(session_id, entry.msg_count, entry.last_counter)
            return entry.key_bytes, entry

    def deactivate_session(self, session_id: str) -> None:
        with self._lock:
            entry = self._store.get(session_id)
            if entry and entry.state == "ACTIVE":
                self._deactivate_session_locked(entry)

    def _deactivate_session_locked(self, entry: SessionKeyEntry) -> None:
        entry.state = "DEACTIVATED"
        entry.deactivated_at = time.time()
        get_db().update_session_state(entry.session_id, "DEACTIVATED")
        get_audit_logger().log(
            actor="server",
            event_type="SESSION_DEACTIVATED",
            outcome="INFO",
            device_id=entry.device_id,
            details=f"session_id={entry.session_id}",
        )

    def destroy_session(self, session_id: str) -> None:
        with self._lock:
            entry = self._store.get(session_id)
            if entry:
                self._destroy_session_locked(entry)

    def _destroy_session_locked(self, entry: SessionKeyEntry) -> None:
        entry.wipe_key()
        entry.state = "DESTROYED"
        get_db().update_session_state(entry.session_id, "DESTROYED")
        get_audit_logger().log(
            actor="server",
            event_type="SESSION_DESTROYED",
            outcome="INFO",
            device_id=entry.device_id,
            details=f"session_id={entry.session_id}",
        )
        # Remove from in-memory store
        self._store.pop(entry.session_id, None)

    def compromise_device_sessions(self, device_id: str) -> list[str]:
        """
        Mark all sessions for a device as COMPROMISED then DESTROYED.
        Called during device revocation.
        Returns list of compromised session IDs.
        """
        with self._lock:
            compromised = []
            to_destroy = []
            for sid, entry in list(self._store.items()):
                if entry.device_id == device_id and entry.state not in ("DESTROYED", "COMPROMISED"):
                    entry.state = "COMPROMISED"
                    get_db().update_session_state(sid, "COMPROMISED")
                    get_audit_logger().log(
                        actor="server",
                        event_type="SESSION_COMPROMISED",
                        outcome="INFO",
                        device_id=device_id,
                        details=f"session_id={sid} reason=device_revoked",
                    )
                    compromised.append(sid)
                    to_destroy.append(entry)
            # Immediately destroy
            for entry in to_destroy:
                self._destroy_session_locked(entry)
            return compromised

    def run_rotation_check(self, session_factory) -> list[str]:
        """
        Algorithm 4: Check all ACTIVE sessions for expiry/msg limit.
        Triggers new session creation for authorized devices.

        Args:
            session_factory: Callable(device_id) -> new (session_id, key_id) or raises.

        Returns:
            List of rotated session IDs.
        """
        rotated = []
        with self._lock:
            expired_entries = []
            for sid, entry in list(self._store.items()):
                if entry.state == "ACTIVE" and (entry.is_expired() or entry.is_msg_limit_reached()):
                    expired_entries.append(entry)
                elif entry.state == "DEACTIVATED" and entry.is_grace_expired():
                    self._destroy_session_locked(entry)

        for entry in expired_entries:
            try:
                device = get_db().get_device(entry.device_id)
                if device and device["status"] == "AUTHORIZED":
                    new_ids = session_factory(entry.device_id)
                    get_audit_logger().log(
                        actor="server",
                        event_type="SESSION_ROTATED",
                        outcome="ACCEPTED",
                        device_id=entry.device_id,
                        details=f"old_session={entry.session_id} new_session={new_ids}",
                    )
                    rotated.append(entry.session_id)
                else:
                    with self._lock:
                        if entry.session_id in self._store:
                            self._destroy_session_locked(entry)
            except Exception as exc:
                get_audit_logger().log(
                    actor="server",
                    event_type="SESSION_ROTATION_FAILED",
                    outcome="REJECTED",
                    device_id=entry.device_id,
                    details=str(exc),
                )
            finally:
                with self._lock:
                    if entry.session_id in self._store:
                        self._deactivate_session_locked(entry)

        return rotated

    def get_session_entry(self, session_id: str) -> SessionKeyEntry | None:
        with self._lock:
            return self._store.get(session_id)

    def get_all_entries(self) -> list[SessionKeyEntry]:
        with self._lock:
            return list(self._store.values())


# Global lifecycle manager instance
_lifecycle_manager: KeyLifecycleManager | None = None


def get_lifecycle_manager() -> KeyLifecycleManager:
    global _lifecycle_manager
    if _lifecycle_manager is None:
        _lifecycle_manager = KeyLifecycleManager()
    return _lifecycle_manager
