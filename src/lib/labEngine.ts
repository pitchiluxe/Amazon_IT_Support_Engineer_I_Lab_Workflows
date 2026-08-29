// Lab engine — state machine and task progression
"use client";

import type { Lab, LearnerProgress, Incident, EvidenceItem, Hint } from "@/types";
import { saveLabProgress, getLabProgress } from "./storage";

export type LabPhase =
  | "intro"
  | "tasks"
  | "incident"
  | "evidence"
  | "hints"
  | "scoring"
  | "review";

export interface LabEngineState {
  phase: LabPhase;
  currentTaskIndex: number;
  gatheredEvidence: EvidenceItem[];
  hintsRevealed: number[];
  revealedEvidence: EvidenceItem[];
  startedAt: string;
  completedAt?: string;
}

export function initLabEngine(labId: string, lab: Lab): LabEngineState {
  const saved = getLabProgress(labId);
  const startedAt = saved?.startedAt ?? new Date().toISOString();

  return {
    phase: "intro",
    currentTaskIndex: 0,
    gatheredEvidence: saved?.evidence ?? [],
    hintsRevealed: [],
    revealedEvidence: [],
    startedAt,
  };
}

export function advancePhase(state: LabEngineState): LabPhase {
  const phases: LabPhase[] = [
    "intro",
    "tasks",
    "incident",
    "evidence",
    "hints",
    "scoring",
    "review",
  ];
  const idx = phases.indexOf(state.phase);
  return phases[Math.min(idx + 1, phases.length - 1)];
}

export function getHintForLevel(
  hints: Hint[],
  level: 1 | 2 | 3 | 4 | 5
): Hint | null {
  return hints.find((h) => h.level === level) ?? null;
}

export function getNextHint(
  hints: Hint[],
  hintsRevealed: number[]
): Hint | null {
  for (let l = 1; l <= 5; l++) {
    if (!hintsRevealed.includes(l)) {
      const hint = getHintForLevel(hints, l as 1 | 2 | 3 | 4 | 5);
      if (hint) return hint;
    }
  }
  return null;
}

export function completeTask(
  lab: Lab,
  taskId: string,
  progress: LearnerProgress
): LearnerProgress {
  if (!progress.completedTaskIds.includes(taskId)) {
    progress.completedTaskIds.push(taskId);
  }
  if (progress.status === "not_started") {
    progress.status = "in_progress";
    progress.startedAt = new Date().toISOString();
  }
  return progress;
}

export function collectEvidence(
  evidence: EvidenceItem,
  progress: LearnerProgress
): LearnerProgress {
  const exists = progress.evidence.some((e) => e.id === evidence.id);
  if (!exists) {
    progress.evidence.push(evidence);
  }
  return progress;
}

export function finishLab(
  progress: LearnerProgress,
  score: number
): LearnerProgress {
  progress.status = "completed";
  progress.score = score;
  progress.completedAt = new Date().toISOString();
  return progress;
}

// Process an allowed action and return any newly revealed evidence
export function processAction(
  action: string,
  incident: Incident | undefined,
  revealedEvidence: EvidenceItem[]
): EvidenceItem[] {
  if (!incident) return [];
  const newEvidence = incident.evidenceRevealedOnAction[action] ?? [];
  return newEvidence.filter((e) => !revealedEvidence.some((r) => r.id === e.id));
}

// Get the hidden root cause — only for review phase
export function getRootCause(incident: Incident | undefined, phase: LabPhase): string | null {
  if (phase !== "review" || !incident) return null;
  return incident.hiddenRootCause;
}

// Validate the learner's diagnosis
export function validateDiagnosis(
  diagnosis: string,
  incident: Incident | undefined
): boolean {
  if (!incident) return true;
  const d = diagnosis.toLowerCase();
  const rootCause = incident.hiddenRootCause.toLowerCase();
  // Simple keyword overlap check
  const rootWords = rootCause.split(/\s+/).filter((w) => w.length > 4);
  const matches = rootWords.filter((w) => d.includes(w));
  return matches.length >= Math.max(1, Math.floor(rootWords.length * 0.3));
}
