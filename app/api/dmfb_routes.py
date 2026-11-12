"""
DMFB Digital Twin API routes.
Exposes the biochip simulator to the React frontend.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

dmfb_router = APIRouter(prefix="/api/dmfb", tags=["dmfb"])


@dmfb_router.post("/run-assay")
def run_glucose_assay(patient_glucose: float = 220.0):
    """Run a full glucose assay simulation and return all step snapshots."""
    try:
        from app.simulation.dmfb_simulator import DMFBBiochip
        chip = DMFBBiochip(device_id="DMFB-DIGITAL-TWIN")
        steps = chip.load_glucose_assay(patient_glucose=patient_glucose)
        snapshots = []
        for step in steps:
            snapshot = chip.execute_step(step)
            snapshots.append({
                "step_num": step.step_num,
                "operation": step.operation,
                "description": step.description,
                "active_electrodes": list(step.active_electrodes),
                "grid_state": snapshot,
            })
        sensor_data = chip.read_optical_sensor()
        return {
            "patient_glucose": patient_glucose,
            "steps": snapshots,
            "sensor_reading": sensor_data,
            "final_state": chip.get_state_snapshot(),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@dmfb_router.get("/state")
def get_dmfb_state():
    """Get current biochip grid state."""
    try:
        from app.simulation.dmfb_simulator import get_biochip
        chip = get_biochip()
        return chip.get_state_snapshot()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@dmfb_router.get("/protocols")
def get_available_protocols():
    return {
        "protocols": [
            {
                "id": "glucose_assay",
                "name": "Enzymatic Glucose Bioassay",
                "description": "Standard serum glucose assay: sample + GOx reagent → mix → split → optical detection",
                "steps": 7,
                "grid_size": "8×8",
                "operations": ["DISPENSE", "TRANSPORT", "MIX", "MIX", "TRANSPORT", "SPLIT", "DETECT"]
            }
        ]
    }
