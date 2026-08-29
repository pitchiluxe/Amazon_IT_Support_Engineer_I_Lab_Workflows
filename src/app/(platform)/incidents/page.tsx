"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Spinner";
import {
  getOperationalIncidents,
  addOperationalIncident,
  updateOperationalIncident,
} from "@/lib/storage";
import type { OperationalIncident } from "@/types";
import { AlertTriangle, Clock, CheckCircle2, Plus } from "lucide-react";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<OperationalIncident[]>([]);

  useEffect(() => {
    setIncidents(getOperationalIncidents());
  }, []);

  const openCount = incidents.filter((i) => i.status !== "resolved").length;
  const severityCounts = {
    critical: incidents.filter((i) => i.severity === "critical").length,
    high: incidents.filter((i) => i.severity === "high").length,
    medium: incidents.filter((i) => i.severity === "medium").length,
    low: incidents.filter((i) => i.severity === "low").length,
  };

  const statusColors: Record<string, string> = {
    open: "text-danger bg-danger-muted",
    investigating: "text-warning bg-warning-muted",
    escalated: "text-accent bg-accent-muted",
    resolved: "text-success bg-success-muted",
  };

  const handleCreateSample = () => {
    const sample: OperationalIncident = {
      id: `inc-${Date.now()}`,
      title: "Network connectivity issue - Bay 4",
      severity: "high",
      status: "open",
      reportedAt: new Date().toISOString(),
      reporter: "Operations Manager",
      affectedService: "Network",
      description: "Multiple scanners in Bay 4 are showing offline. Started around 08:30.",
      timeline: [
        {
          timestamp: new Date().toISOString(),
          action: "Opened",
          user: "Operations Manager",
          note: "Reported via radio",
        },
      ],
    };
    addOperationalIncident(sample);
    setIncidents([...incidents, sample]);
  };

  return (
    <>
      <PageHeader
        title="Incident Queue"
        description="Operational incidents and service tickets. Track severity, status, and timeline."
        actions={
          <Button
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreateSample}
          >
            New Incident
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-fg-primary">{openCount}</div>
          <div className="text-xs text-fg-muted">Open Incidents</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-danger">{severityCounts.critical}</div>
          <div className="text-xs text-fg-muted">Critical</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-warning">{severityCounts.high}</div>
          <div className="text-xs text-fg-muted">High</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-accent">{incidents.length}</div>
          <div className="text-xs text-fg-muted">Total</div>
        </Card>
      </div>

      {incidents.length === 0 ? (
        <EmptyState
          icon="🚨"
          title="No active incidents"
          description="Create a sample incident to explore the queue system."
          action={
            <Button size="sm" onClick={handleCreateSample}>
              Create Sample Incident
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <Card key={inc.id} className="flex items-start gap-4">
              <AlertTriangle
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  inc.severity === "critical"
                    ? "text-danger"
                    : inc.severity === "high"
                    ? "text-warning"
                    : "text-accent"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-fg-primary">{inc.title}</span>
                  <SeverityBadge severity={inc.severity} />
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${statusColors[inc.status]}`}
                  >
                    {inc.status}
                  </span>
                </div>
                <p className="text-sm text-fg-muted line-clamp-1">{inc.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-fg-muted">
                  <span>Reported by {inc.reporter}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(inc.reportedAt).toLocaleString()}
                  </span>
                  <span>{inc.timeline.length} updates</span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const updated = incidents.map((i) =>
                    i.id === inc.id
                      ? { ...i, status: "resolved" as const }
                      : i
                  );
                  updateOperationalIncident(inc.id, { status: "resolved" });
                  setIncidents(updated);
                }}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Resolve
              </Button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
