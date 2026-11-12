"""
Attack Lab API routes for the React dashboard.
Exposes the cyber-physical attack simulations to the frontend.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

attack_lab_router = APIRouter(prefix="/api/attack-lab", tags=["attack-lab"])


def _get_attack_lab():
    from app.simulation.attack_lab import AttackLab
    return AttackLab()


class GlucoseTamperRequest(BaseModel):
    true_glucose: float = 220.0
    falsified_glucose: float = 110.0


@attack_lab_router.post("/glucose-tamper")
def run_glucose_tamper(req: GlucoseTamperRequest):
    try:
        lab = _get_attack_lab()
        result = lab.run_glucose_tamper_attack(req.true_glucose, req.falsified_glucose)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@attack_lab_router.post("/replay")
def run_replay_attack():
    try:
        lab = _get_attack_lab()
        result = lab.run_replay_attack()
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@attack_lab_router.get("/quantum-compare")
def run_quantum_comparison():
    try:
        lab = _get_attack_lab()
        result = lab.run_quantum_threat_comparison()
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
