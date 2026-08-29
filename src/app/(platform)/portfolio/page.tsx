"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/Spinner";
import { getAllLabs } from "@/lib/labData";
import { getPlatformState } from "@/lib/storage";
import { getReadinessLevel } from "@/lib/scoring";
import type { LearnerProgress } from "@/types";
import { Award, Target, BookOpen } from "lucide-react";

export default function PortfolioPage() {
  const labs = getAllLabs();
  const [progress, setProgress] = useState<Record<string, LearnerProgress>>({});

  useEffect(() => {
    setProgress(getPlatformState().progress);
  }, []);

  const completedLabs = labs.filter((l) => progress[l.id]?.status === "completed");

  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Your completed labs and evidence of hands-on experience. Use this to demonstrate skills to potential employers."
      />

      {completedLabs.length === 0 ? (
        <EmptyState
          icon="🏆"
          title="Portfolio is empty"
          description="Complete labs to build your portfolio of evidence and demonstrated skills."
        />
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-fg-primary">
                  {completedLabs.length}
                </div>
                <div className="text-sm text-fg-muted">Labs Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">
                  {Math.round(
                    completedLabs.reduce(
                      (sum, l) => sum + (progress[l.id]?.score ?? 0),
                      0
                    ) / completedLabs.length
                  )}
                  %
                </div>
                <div className="text-sm text-fg-muted">Avg. Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">
                  {completedLabs.reduce(
                    (sum, l) => sum + (progress[l.id]?.hintsUsed ?? 0),
                    0
                  )}
                </div>
                <div className="text-sm text-fg-muted">Hints Used</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-fg-primary">
                  {labs.length - completedLabs.length}
                </div>
                <div className="text-sm text-fg-muted">Labs Remaining</div>
              </div>
            </div>
          </Card>

          {/* Portfolio entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedLabs.map((lab) => {
              const p = progress[lab.id];
              const readiness = getReadinessLevel(p?.score ?? 0);
              return (
                <Card key={lab.id}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-xs text-fg-muted font-mono mb-1">
                        {lab.id.toUpperCase()}
                      </div>
                      <CardTitle className="text-base">{lab.title}</CardTitle>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-accent">
                        {p?.score ?? 0}%
                      </div>
                      <Badge variant={readiness.color as any}>{readiness.label}</Badge>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-fg-secondary mb-3">
                    <div>
                      <span className="text-fg-muted">Evidence collected:</span>{" "}
                      {p?.evidence.length ?? 0}
                    </div>
                    <div>
                      <span className="text-fg-muted">Tasks completed:</span>{" "}
                      {p?.completedTaskIds.length ?? 0} / {lab.tasks.length}
                    </div>
                    <div>
                      <span className="text-fg-muted">Attempts:</span> {p?.attempts ?? 1}
                    </div>
                    {p?.completedAt && (
                      <div>
                        <span className="text-fg-muted">Completed:</span>{" "}
                        {new Date(p.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-bg-muted text-sm">
                    <div className="font-medium text-fg-primary mb-1 flex items-center gap-1">
                      <Target className="w-4 h-4 text-accent" />
                      Interview Question
                    </div>
                    <p className="text-fg-secondary italic">
                      &ldquo;{lab.interviewQuestion}&rdquo;
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
