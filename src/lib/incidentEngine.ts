// Incident simulation engine
"use client";

import type { Incident, EvidenceItem } from "@/types";

// Process an allowed action and return any newly revealed evidence
export function processIncidentAction(
  action: string,
  incident: Incident
): EvidenceItem[] {
  return incident.evidenceRevealedOnAction[action] ?? [];
}

// Check if a symptom matches the incident
export function matchesSymptom(
  symptom: string,
  query: string
): boolean {
  const q = query.toLowerCase();
  const s = symptom.toLowerCase();
  return (
    s.includes(q) ||
    q.includes(s) ||
    s.split(" ").some((w) => q.includes(w))
  );
}

// Severity to display config
export function getSeverityConfig(severity: Incident["severity"]): {
  label: string;
  color: string;
  bgColor: string;
} {
  switch (severity) {
    case "critical":
      return { label: "Critical", color: "text-danger", bgColor: "bg-danger-muted" };
    case "high":
      return { label: "High", color: "text-warning", bgColor: "bg-warning-muted" };
    case "medium":
      return { label: "Medium", color: "text-accent", bgColor: "bg-accent-muted" };
    case "low":
    default:
      return { label: "Low", color: "text-success", bgColor: "bg-success-muted" };
  }
}

// Build incident summary for UI
export function buildIncidentSummary(incident: Incident): string {
  const symptoms = incident.symptoms.join("; ");
  const assets = incident.affectedAssets.join(", ");
  const impact = incident.businessImpact;
  return `Symptoms: ${symptoms}\nAffected: ${assets}\nImpact: ${impact}`;
}

// Validate action is allowed
export function isActionAllowed(action: string, incident: Incident): boolean {
  return incident.allowedActions
    .map((a) => a.toLowerCase())
    .some((a) => action.toLowerCase().includes(a));
}

// Validate action is forbidden
export function isActionForbidden(action: string, incident: Incident): boolean {
  return incident.forbiddenActions
    .map((a) => a.toLowerCase())
    .some((a) => action.toLowerCase().includes(a));
}
