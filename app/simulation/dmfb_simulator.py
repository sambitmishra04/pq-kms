"""
Cyber-Physical Digital Microfluidic Biochip (DMFB) Simulator.
Simulates a 2D electrode array, droplet transport, mixing, splitting,
enzymatic glucose assay execution, optical detection, and attack injection.
"""
from __future__ import annotations

import copy
import json
import time
import uuid
from dataclasses import asdict, dataclass, field
from typing import Any, List, Optional, Tuple


@dataclass
class Droplet:
    id: str
    label: str
    droplet_type: str  # "sample", "reagent", "mixed", "waste", "diluted"
    x: int
    y: int
    volume_ul: float = 1.0
    concentration_mg_dl: float = 0.0
    color: str = "#3b82f6"


@dataclass
class ActuationStep:
    step_num: int
    active_electrodes: List[Tuple[int, int]]
    operation: str  # "DISPENSE", "TRANSPORT", "MIX", "SPLIT", "DETECT"
    description: str
    target_droplets: List[str]


class DMFBBiochip:
    """
    8x8 Digital Microfluidic Biochip (DMFB) simulation.
    Handles physical droplet kinematics, electrowetting actuation,
    and optical biosensing.
    """

    def __init__(self, grid_width: int = 8, grid_height: int = 8, device_id: str = "DMFB-01") -> None:
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.device_id = device_id
        self.droplets: dict[str, Droplet] = {}
        self.active_electrodes: set[Tuple[int, int]] = set()
        self.optical_detector: Tuple[int, int] = (3, 6)
        self.dispenser_sample: Tuple[int, int] = (0, 2)
        self.dispenser_reagent: Tuple[int, int] = (7, 2)
        self.waste_reservoir: Tuple[int, int] = (7, 7)
        self.history: List[dict] = []
        self.status: str = "IDLE"
        self.reset()

    def reset(self) -> None:
        """Reset the biochip grid to clean state."""
        self.droplets.clear()
        self.active_electrodes.clear()
        self.status = "IDLE"
        self.history.clear()

    def load_glucose_assay(self, patient_glucose: float = 220.0) -> List[ActuationStep]:
        """
        Build the standard enzymatic glucose bioassay protocol:
        Sample serum + Glucose oxidase reagent -> Mixing -> Optical Detection.
        """
        self.reset()
        self.status = "ASSAY_LOADED"

        # Initialize standard assay droplets
        d_sample = Droplet(
            id="D-SAMPLE",
            label="Serum Sample",
            droplet_type="sample",
            x=self.dispenser_sample[0],
            y=self.dispenser_sample[1],
            volume_ul=1.0,
            concentration_mg_dl=patient_glucose,
            color="#ef4444",  # Red
        )
        d_reagent = Droplet(
            id="D-REAGENT",
            label="GOx Reagent",
            droplet_type="reagent",
            x=self.dispenser_reagent[0],
            y=self.dispenser_reagent[1],
            volume_ul=1.0,
            concentration_mg_dl=0.0,
            color="#06b6d4",  # Cyan
        )
        self.droplets[d_sample.id] = d_sample
        self.droplets[d_reagent.id] = d_reagent

        # Generate actuation sequence
        steps = [
            ActuationStep(
                step_num=1,
                active_electrodes=[(0, 2), (1, 2), (7, 2), (6, 2)],
                operation="DISPENSE",
                description="Dispense 1 µL serum sample and 1 µL glucose oxidase reagent",
                target_droplets=["D-SAMPLE", "D-REAGENT"],
            ),
            ActuationStep(
                step_num=2,
                active_electrodes=[(2, 2), (5, 2)],
                operation="TRANSPORT",
                description="Transport droplets toward central mixing zone",
                target_droplets=["D-SAMPLE", "D-REAGENT"],
            ),
            ActuationStep(
                step_num=3,
                active_electrodes=[(3, 2), (4, 2)],
                operation="MIX",
                description="Merge sample and reagent droplets into enzymatic reaction chamber",
                target_droplets=["D-SAMPLE", "D-REAGENT"],
            ),
            ActuationStep(
                step_num=4,
                active_electrodes=[(3, 2), (3, 3), (4, 3), (4, 2)],
                operation="MIX",
                description="Oscillate 2x2 loop for complete enzymatic catalysis (4 cycles)",
                target_droplets=["D-MIXED"],
            ),
            ActuationStep(
                step_num=5,
                active_electrodes=[(3, 4), (4, 4)],
                operation="TRANSPORT",
                description="Transport reacted droplet toward split/detection lane",
                target_droplets=["D-MIXED"],
            ),
            ActuationStep(
                step_num=6,
                active_electrodes=[(3, 5), (5, 5)],
                operation="SPLIT",
                description="Split 2 µL mixture into 1 µL assay droplet and 1 µL backup/waste",
                target_droplets=["D-TEST", "D-WASTE"],
            ),
            ActuationStep(
                step_num=7,
                active_electrodes=[(3, 6)],
                operation="DETECT",
                description="Position reacted droplet under photodiode optical absorption sensor",
                target_droplets=["D-TEST"],
            ),
        ]
        return steps

    def execute_step(self, step: ActuationStep) -> dict:
        """
        Execute one physical actuation step on the biochip electrodes.
        Updates droplet coordinates and concentrations.
        """
        self.active_electrodes = set(step.active_electrodes)

        if step.operation == "DISPENSE":
            if "D-SAMPLE" in self.droplets:
                self.droplets["D-SAMPLE"].x = 1
                self.droplets["D-SAMPLE"].y = 2
            if "D-REAGENT" in self.droplets:
                self.droplets["D-REAGENT"].x = 6
                self.droplets["D-REAGENT"].y = 2

        elif step.operation == "TRANSPORT":
            if "D-SAMPLE" in self.droplets:
                self.droplets["D-SAMPLE"].x = 2
                self.droplets["D-SAMPLE"].y = 2
            if "D-REAGENT" in self.droplets:
                self.droplets["D-REAGENT"].x = 5
                self.droplets["D-REAGENT"].y = 2
            if "D-MIXED" in self.droplets:
                self.droplets["D-MIXED"].x = 3
                self.droplets["D-MIXED"].y = 4

        elif step.operation == "MIX":
            if "D-SAMPLE" in self.droplets and "D-REAGENT" in self.droplets:
                conc = self.droplets["D-SAMPLE"].concentration_mg_dl
                del self.droplets["D-SAMPLE"]
                del self.droplets["D-REAGENT"]
                self.droplets["D-MIXED"] = Droplet(
                    id="D-MIXED",
                    label="Reacted Assay",
                    droplet_type="mixed",
                    x=3,
                    y=3,
                    volume_ul=2.0,
                    concentration_mg_dl=conc,
                    color="#8b5cf6",  # Purple
                )
            elif "D-MIXED" in self.droplets:
                # Oscillating loop
                self.droplets["D-MIXED"].x = 3 if step.step_num % 2 == 0 else 4
                self.droplets["D-MIXED"].y = 3

        elif step.operation == "SPLIT":
            if "D-MIXED" in self.droplets:
                conc = self.droplets["D-MIXED"].concentration_mg_dl
                del self.droplets["D-MIXED"]
                self.droplets["D-TEST"] = Droplet(
                    id="D-TEST",
                    label="Assay Droplet",
                    droplet_type="mixed",
                    x=3,
                    y=5,
                    volume_ul=1.0,
                    concentration_mg_dl=conc,
                    color="#10b981",  # Green
                )
                self.droplets["D-WASTE"] = Droplet(
                    id="D-WASTE",
                    label="Waste/Backup",
                    droplet_type="waste",
                    x=5,
                    y=5,
                    volume_ul=1.0,
                    concentration_mg_dl=conc,
                    color="#64748b",  # Grey
                )

        elif step.operation == "DETECT":
            if "D-TEST" in self.droplets:
                self.droplets["D-TEST"].x = self.optical_detector[0]
                self.droplets["D-TEST"].y = self.optical_detector[1]
                self.status = "COMPLETED"

        snapshot = self.get_state_snapshot()
        self.history.append(snapshot)
        return snapshot

    def read_optical_sensor(self) -> dict:
        """
        Simulate photodiode optical absorbance readout on detector electrode (3, 6).
        """
        for d in self.droplets.values():
            if (d.x, d.y) == self.optical_detector:
                glucose = d.concentration_mg_dl
                absorbance = 0.0025 * glucose + 0.05
                clinical_status = (
                    "CRITICAL_HIGH (Diabetes Hyperglycemia)"
                    if glucose >= 200.0
                    else "NORMAL_FASTING"
                    if glucose >= 70.0
                    else "HYPOGLYCEMIA"
                )
                return {
                    "detected": True,
                    "glucose_mg_dl": round(glucose, 2),
                    "absorbance_au": round(absorbance, 4),
                    "optical_sensor_coords": list(self.optical_detector),
                    "clinical_status": clinical_status,
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                }
        return {"detected": False, "glucose_mg_dl": 0.0, "clinical_status": "NO_DROPLET"}

    def get_state_snapshot(self) -> dict:
        """Current state snapshot for UI rendering."""
        return {
            "device_id": self.device_id,
            "grid_size": [self.grid_width, self.grid_height],
            "active_electrodes": list(self.active_electrodes),
            "detector_coord": list(self.optical_detector),
            "dispensers": {
                "sample": list(self.dispenser_sample),
                "reagent": list(self.dispenser_reagent),
                "waste": list(self.waste_reservoir),
            },
            "droplets": [asdict(d) for d in self.droplets.values()],
            "status": self.status,
        }


# Global singleton simulator
_biochip: Optional[DMFBBiochip] = None


def get_biochip() -> DMFBBiochip:
    global _biochip
    if _biochip is None:
        _biochip = DMFBBiochip()
    return _biochip
