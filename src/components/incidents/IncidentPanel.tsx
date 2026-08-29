"use client";
import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { getSeverityConfig } from "@/lib/incidentEngine";
import type { Incident } from "@/types";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";

interface IncidentPanelProps {
  incident: Incident;
  diagnosis: string;
  setDiagnosis: (s: string) => void;
  result: { correct: boolean; show: boolean };
  onSubmit: () => void;
  onContinue: () => void;
}

export function IncidentPanel({
  incident,
  diagnosis,
  setDiagnosis,
  result,
  onSubmit,
  onContinue,
}: IncidentPanelProps) {
  const sev = getSeverityConfig(incident.severity);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-danger" />
        <CardTitle>Incident Details</CardTitle>
        <SeverityBadge severity={incident.severity} />
      </div>

      <div className="p-3 rounded-lg bg-danger-muted border border-danger/30 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-danger" />
          <span className="font-semibold text-danger">User Report</span>
        </div>
        <ul className="space-y-1 text-sm text-fg-secondary">
          {incident.symptoms.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-danger mt-1">▸</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
        <div className="p-3 rounded-lg border border-border-soft">
          <div className="text-xs text-fg-muted mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Affected Assets
          </div>
          <div className="text-fg-primary">
            {incident.affectedAssets.join(", ")}
          </div>
        </div>
        <div className="p-3 rounded-lg border border-border-soft">
          <div className="text-xs text-fg-muted mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Business Impact
          </div>
          <div className="text-fg-primary">{incident.businessImpact}</div>
        </div>
      </div>

      <h3 className="font-semibold text-sm mb-2">Initial State</h3>
      <div className="terminal mb-4 text-xs">
        {Object.entries(incident.initialState).map(([k, v]) => (
          <div key={k}>
            <span className="terminal-prompt">$</span>{" "}
            <span className="text-slate-400">{k}:</span>{" "}
            <span className="terminal-output">{v}</span>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-warning-muted border border-warning/30 mb-4 text-sm">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-4 h-4 text-warning" />
          <span className="font-semibold text-warning">Production Safety</span>
        </div>
        <p className="text-fg-secondary text-xs">
          Forbidden actions: {incident.forbiddenActions.join("; ")}
        </p>
        <p className="text-fg-muted text-xs mt-1">
          Use the safest reversible action. Document before changing.
        </p>
      </div>

      {!result.show && (
        <>
          <h3 className="font-semibold text-sm mb-2">Your Diagnosis</h3>
          <p className="text-xs text-fg-muted mb-2">
            Based on the evidence you have gathered, what is your best diagnosis of the root cause?
          </p>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g., 'The client DNS is pointing to 8.8.8.8, not the DC, so the domain join fails.'"
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary placeholder:text-fg-muted text-sm mb-3"
          />
          <div className="flex justify-between">
            <p className="text-xs text-fg-muted self-center">
              Submit when ready. The hidden root cause will be revealed after scoring.
            </p>
            <Button onClick={onSubmit} disabled={diagnosis.trim().length < 10}>
              Submit Diagnosis
            </Button>
          </div>
        </>
      )}

      {result.show && (
        <div
          className={`p-3 rounded-lg border ${
            result.correct
              ? "bg-success-muted border-success/30"
              : "bg-warning-muted border-warning/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {result.correct ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-warning" />
            )}
            <span className="font-semibold">
              {result.correct ? "Diagnosis looks correct" : "Review your diagnosis"}
            </span>
          </div>
          <p className="text-sm text-fg-secondary">
            {result.correct
              ? "Your diagnosis aligns with the hidden root cause. Continue to gather evidence and validate."
              : "Your diagnosis did not align strongly with the root cause. Consider what subsystem you may have missed."}
          </p>
          <div className="flex justify-end mt-3">
            <Button onClick={onContinue}>Continue to Evidence</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
