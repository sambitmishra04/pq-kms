#!/usr/bin/env python3
"""
Seed default users for the PQ-KMS dashboard.
Run: python scripts/seed_users.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database.db import get_db
from app.auth.service import create_user

DEFAULT_USERS = [
    {
        "username": "admin",
        "password": "admin123",
        "full_name": "System Administrator",
        "role": "admin",
        "department": "IT Security",
    },
    {
        "username": "dr.sharma",
        "password": "doctor123",
        "full_name": "Dr. Priya Sharma",
        "role": "doctor",
        "department": "Endocrinology",
    },
    {
        "username": "auditor",
        "password": "audit123",
        "full_name": "Security Auditor",
        "role": "auditor",
        "department": "Compliance",
    },
]

def seed():
    db = get_db()
    for u in DEFAULT_USERS:
        existing = db.get_user_by_username(u["username"])
        if existing:
            print(f"[skip] {u['username']} already exists")
            continue
        create_user(
            username=u["username"],
            password=u["password"],
            full_name=u["full_name"],
            role=u["role"],
            department=u["department"],
        )
        print(f"[ok]   Created {u['role']}: {u['username']} / {u['password']}")

if __name__ == "__main__":
    seed()
    print("\nDefault users seeded successfully.")
