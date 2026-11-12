import React, { useState, useEffect } from 'react';
import {
  Pipette,
  Play,
  RotateCcw,
  SkipForward,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { Badge } from '../components/common/Badge';
import type { FullAssayResult, AssayStepSnapshot, Droplet } from '../types';

export const DMFBTwin: React.FC = () => {
  const [patientGlucose, setPatientGlucose] = useState<number>(220.0);
  const [assayResult, setAssayResult] = useState<FullAssayResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(false);

  const gridSize = 8;
  const detectorCoord: [number, number] = [3, 6];

  const handleRunAssay = async () => {
    setIsRunning(true);
    try {
      const data = await api.runGlucoseAssay(patientGlucose);
      setAssayResult(data);
      setCurrentStepIndex(0);
      setIsPlayingAnimation(true);
    } catch (err) {
      console.error('Failed to run assay:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Step animation loop
  useEffect(() => {
    if (!isPlayingAnimation || !assayResult) return;

    if (currentStepIndex < assayResult.steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsPlayingAnimation(false);
    }
  }, [isPlayingAnimation, currentStepIndex, assayResult]);

  const currentStep: AssayStepSnapshot | undefined = assayResult?.steps[currentStepIndex];
  const activeElectrodes: [number, number][] = currentStep?.active_electrodes || [];
  const currentDroplets: Droplet[] = currentStep?.grid_state?.droplets || [];

  const isElectrodeActive = (x: number, y: number) => {
    return activeElectrodes.some(([ex, ey]) => ex === x && ey === y);
  };

  const isDetector = (x: number, y: number) => {
    return detectorCoord[0] === x && detectorCoord[1] === y;
  };

  const getDropletAt = (x: number, y: number): Droplet | undefined => {
    return currentDroplets.find((d) => d.x === x && d.y === y);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Pipette className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Digital Microfluidic Biochip (DMFB) Digital Twin
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/80 font-semibold">
              8×8 EWOD Array
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time physical kinematics of electrowetting-driven droplet transport, enzymatic catalysis, and photodiode optical biosensing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Patient Glucose:</span>
            <input
              type="number"
              value={patientGlucose}
              onChange={(e) => setPatientGlucose(parseFloat(e.target.value) || 0)}
              className="w-16 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-teal-700 dark:text-teal-300 font-mono text-xs focus:outline-none text-right"
            />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">mg/dL</span>
          </div>

          <button
            onClick={handleRunAssay}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Actuating Grid...' : 'Run Bioassay Protocol'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Telemetry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 8x8 EWOD Electrode Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm dark:shadow-lg flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Electrowetting Electrode Array
                {currentStep && (
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
                    • Step {currentStep.step_num}/7: {currentStep.operation}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Droplet actuation via high-voltage RF dielectric modulation
              </p>
            </div>

            {/* Stepper buttons if assay is loaded */}
            {assayResult && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentStepIndex === 0}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-mono text-slate-700 dark:text-slate-300"
                >
                  Prev
                </button>
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300 px-1">
                  {currentStepIndex + 1}/{assayResult.steps.length}
                </span>
                <button
                  onClick={() => setCurrentStepIndex((prev) => Math.min(assayResult.steps.length - 1, prev + 1))}
                  disabled={currentStepIndex === assayResult.steps.length - 1}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-mono text-slate-700 dark:text-slate-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* 8x8 Grid Canvas */}
          <div className="relative p-3 bg-slate-100 dark:bg-[#0a0e18] border border-slate-200 dark:border-slate-800/80 rounded-xl shadow-inner inline-block">
            {/* Legend Pins */}
            <div className="absolute -top-2 left-6 text-[9px] font-mono text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-900 shadow-2xs">
              <Droplets className="w-2.5 h-2.5" /> Sample (0,2)
            </div>
            <div className="absolute -top-2 right-6 text-[9px] font-mono text-cyan-600 dark:text-cyan-400 flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-300 dark:border-cyan-900 shadow-2xs">
              <Droplets className="w-2.5 h-2.5" /> Reagent (7,2)
            </div>

            <div className="grid grid-cols-8 gap-1.5 w-[360px] sm:w-[440px] h-[360px] sm:h-[440px]">
              {Array.from({ length: gridSize }).map((_, y) =>
                Array.from({ length: gridSize }).map((_, x) => {
                  const active = isElectrodeActive(x, y);
                  const detector = isDetector(x, y);
                  const droplet = getDropletAt(x, y);

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`relative rounded-md border flex items-center justify-center transition-all duration-300 ${
                        active
                          ? 'bg-amber-100 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] dark:bg-amber-500/25 dark:border-amber-400'
                          : detector
                          ? 'bg-purple-100 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)] dark:bg-purple-950/40 dark:border-purple-500/60'
                          : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/90 dark:border-slate-800/80 dark:hover:border-slate-700'
                      }`}
                      title={`Electrode (${x}, ${y})${active ? ' - ENERGIZED' : ''}${detector ? ' - PHOTODIODE' : ''}`}
                    >
                      {/* Sub-label for detector */}
                      {detector && (
                        <div className="absolute bottom-0.5 right-0.5 text-[8px] text-purple-600 dark:text-purple-400 font-mono">
                          <Eye className="w-2.5 h-2.5" />
                        </div>
                      )}

                      {/* Droplet Marker */}
                      {droplet && (
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg animate-in zoom-in-50 duration-300 transform"
                          style={{
                            backgroundColor: droplet.color,
                            boxShadow: `0 0 14px ${droplet.color}`,
                          }}
                        >
                          <span className="truncate max-w-[28px] text-center font-mono">
                            {droplet.label.slice(0, 3)}
                          </span>
                        </div>
                      )}

                      {/* Coordinate */}
                      <span className="absolute top-0.5 left-1 text-[7px] text-slate-400 dark:text-slate-600 font-mono select-none">
                        {x},{y}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom waste indicator */}
            <div className="mt-2 text-center text-[10px] font-mono text-slate-500">
              Photodiode Optical Sensor at (3, 6) • Waste Reservoir at (7, 7)
            </div>
          </div>
        </div>

        {/* Right: Step Description & Clinical Sensor Readout (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Current Step Description Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
              Actuation Sequence Step Telemetry
            </span>
            {currentStep ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-teal-700 dark:text-teal-300 font-mono">
                    Step {currentStep.step_num}: {currentStep.operation}
                  </span>
                  <Badge variant="teal">{currentStep.operation}</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {currentStep.description}
                </p>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  Energized Electrodes: {currentStep.active_electrodes.map(([x, y]) => `(${x},${y})`).join(' ')}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 dark:text-slate-500 py-3">
                Click "Run Bioassay Protocol" above to execute the 7-step enzymatic glucose protocol.
              </div>
            )}
          </div>

          {/* Optical Sensor Readout Card */}
          {assayResult && currentStepIndex === assayResult.steps.length - 1 && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50 via-white to-white dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900 border border-teal-200 dark:border-teal-500/40 shadow-sm dark:shadow-xl space-y-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Photodiode Optical Readout
                  </h4>
                </div>
                <Badge status={assayResult.sensor_reading.clinical_status}>
                  {assayResult.sensor_reading.clinical_status}
                </Badge>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] block">MEASURED BLOOD GLUCOSE</span>
                  <span className="text-2xl font-bold text-teal-700 dark:text-teal-300 mt-1 block">
                    {assayResult.sensor_reading.glucose_mg_dl} <span className="text-sm font-normal text-slate-400">mg/dL</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">OPTICAL ABSORBANCE</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {assayResult.sensor_reading.absorbance_au} AU
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DETECTION COORDS</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      (3, 6) Detector
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 text-teal-800 dark:text-teal-300 text-[11px] font-sans">
                  <strong>Clinical Status:</strong> {assayResult.sensor_reading.clinical_status}. Telemetry securely encrypted and transmitted to attending physician portal.
                </div>
              </div>
            </div>
          )}

          {/* Droplet Inventory */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg space-y-2 flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
              Active Droplet Inventory
            </span>
            <div className="space-y-2 text-xs">
              {currentDroplets.map((d) => (
                <div
                  key={d.id}
                  className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{d.label}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    pos: ({d.x}, {d.y}) • {d.volume_ul} µL
                  </div>
                </div>
              ))}
              {currentDroplets.length === 0 && (
                <p className="text-slate-400 dark:text-slate-500 text-xs">No active droplets on grid.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
