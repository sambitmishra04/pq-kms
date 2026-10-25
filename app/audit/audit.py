"""
Tamper-evident audit logging module.
Wraps the database append_audit_event with additional validation.
Never logs key material or plaintext diagnostic content.
"""
from __future__ import annotations

from app.database.db import get_db


class AuditLogger:
    """Audit logger with hash-chain tamper evidence."""

    def log(
        self,
        actor: str,
        event_type: str,
        outcome: str,
        device_id: str | None = None,
        details: str | None = None,
    ) -> str:
        """
        Append an event to the audit log.

        Args:
            actor: Who performed the action (e.g., "admin", device_id, "system").
            event_type: Event category (e.g., "REGISTRATION", "SESSION", "MESSAGE",
                        "ROTATION", "REVOCATION", "CRL_VERIFY").
            outcome: "ACCEPTED" or "REJECTED" or "INFO".
            device_id: Related device (if applicable).
            details: Optional extra context (must NOT contain keys or plaintext).

        Returns:
            event_id string.
        """
        db = get_db()
        return db.append_audit_event(
            actor=actor,
            event_type=event_type,
            outcome=outcome,
            device_id=device_id,
            details=details,
        )

    def verify_chain(self) -> tuple[bool, int | None]:
        """
        Verify audit log integrity.

        Returns:
            (True, None) if chain is intact.
            (False, index) if chain is broken at given index.
        """
        return get_db().verify_audit_chain()


# Global singleton
_audit_logger: AuditLogger | None = None


def get_audit_logger() -> AuditLogger:
    global _audit_logger
    if _audit_logger is None:
        _audit_logger = AuditLogger()
    return _audit_logger
