// Scoring engine
import type { LearnerProgress, Lab, ScoreBreakdown, ValidationTest } from "@/types";

export const RUBRIC_WEIGHTS: Record<keyof Omit<ScoreBreakdown, "total">, number> = {
  diagnosis: 20,
  evidenceQuality: 15,
  troubleshootingProcess: 15,
  productionSafety: 15,
  resolution: 10,
  validation: 10,
  documentation: 10,
  communication: 5,
};

export function calculateScore(
  lab: Lab,
  progress: LearnerProgress,
  options?: {
    diagnosedCorrectly?: boolean;
    usedUnsafeActions?: boolean;
    skippedValidation?: boolean;
    documentedWell?: boolean;
    communicatedWell?: boolean;
  }
): ScoreBreakdown {
  const taskCompletion =
    lab.tasks.length > 0
      ? Math.round((progress.completedTaskIds.length / lab.tasks.length) * 100)
      : 0;

  // Diagnosis
  const diagnosis =
    (options?.diagnosedCorrectly ? 1 : 0.3) * RUBRIC_WEIGHTS.diagnosis;

  // Evidence quality
  const evidenceRatio =
    lab.requiredEvidence.length > 0
      ? Math.min(
          progress.evidence.length / lab.requiredEvidence.length,
          1
        )
      : taskCompletion / 100;
  const evidenceQuality = evidenceRatio * RUBRIC_WEIGHTS.evidenceQuality;

  // Troubleshooting process (task completion + evidence gathering)
  const processRatio = (taskCompletion + evidenceRatio * 50) / 150;
  const troubleshootingProcess = processRatio * RUBRIC_WEIGHTS.troubleshootingProcess;

  // Production safety
  let productionSafety = RUBRIC_WEIGHTS.productionSafety;
  if (options?.usedUnsafeActions) productionSafety *= 0.3;
  if (options?.skippedValidation) productionSafety *= 0.5;

  // Resolution (tasks done + evidence collected)
  const resolutionRatio =
    (taskCompletion / 100 + evidenceRatio) / 2;
  const resolution = resolutionRatio * RUBRIC_WEIGHTS.resolution;

  // Validation tests
  let validation = 0;
  if (options?.skippedValidation) {
    validation = 0;
  } else {
    validation = RUBRIC_WEIGHTS.validation * 0.7;
  }

  // Documentation
  const documentation = (options?.documentedWell ? 1 : 0.5) * RUBRIC_WEIGHTS.documentation;

  // Communication
  const communication =
    (options?.communicatedWell ? 1 : 0.5) * RUBRIC_WEIGHTS.communication;

  const total = Math.round(
    diagnosis +
    evidenceQuality +
    troubleshootingProcess +
    productionSafety +
    resolution +
    validation +
    documentation +
    communication
  );

  return {
    diagnosis: Math.round(diagnosis),
    evidenceQuality: Math.round(evidenceQuality),
    troubleshootingProcess: Math.round(troubleshootingProcess),
    productionSafety: Math.round(productionSafety),
    resolution: Math.round(resolution),
    validation: Math.round(validation),
    documentation: Math.round(documentation),
    communication: Math.round(communication),
    total: Math.min(total, 100),
  };
}

export function getReadinessLevel(score: number): {
  level: string;
  label: string;
  color: string;
} {
  if (score >= 90)
    return { level: "strong", label: "Strong readiness", color: "success" };
  if (score >= 80)
    return { level: "job_ready", label: "Job-ready", color: "accent" };
  if (score >= 70)
    return { level: "developing", label: "Developing", color: "warning" };
  if (score >= 60)
    return { level: "gaps", label: "Significant gaps", color: "warning" };
  return { level: "repeat", label: "Repeat core labs", color: "danger" };
}

export function scoreValidation(
  tests: ValidationTest[],
  results: Record<string, boolean>
): { passed: number; total: number; points: number } {
  let passed = 0;
  let points = 0;
  for (const test of tests) {
    if (results[test.id]) {
      passed++;
      points += test.points;
    }
  }
  return { passed, total: tests.length, points };
}
