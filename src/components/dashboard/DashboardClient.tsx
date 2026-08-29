"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { Badge, DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getPlatformState,
  getCompletedCount,
  getInProgressCount,
  computeOverallScore,
} from "@/lib/storage";
import type { Lab, LearnerProgress } from "@/types";

interface DashboardClientProps {
  labs: Lab[];
}

const categoryColors: Record<string, string> = {
  foundations: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  windows: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  networking: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  operations: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  infrastructure: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  project: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  capstone: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
};

export function DashboardClient({ labs }: DashboardClientProps) {
  const [progress, setProgress] = useState<Record<string, LearnerProgress>>({});

  useEffect(() => {
    const state = getPlatformState();
    setProgress(state.progress);
  }, []);

  const completedCount = getCompletedCount();
  const inProgressCount = getInProgressCount();
  const totalLabs = labs.length;
  const overallScore = computeOverallScore();
  const completionPct = totalLabs > 0 ? Math.round((completedCount / totalLabs) * 100) : 0;

  // Category progress
  const categories = Array.from(new Set(labs.map((l) => l.category)));
  const categoryStats = categories.map((cat) => {
    const catLabs = labs.filter((l) => l.category === cat);
    const catCompleted = catLabs.filter((l) => progress[l.id]?.status === "completed").length;
    return { category: cat, total: catLabs.length, completed: catCompleted };
  });

  // Next recommended lab
  const nextLab = labs.find((l) => {
    const p = progress[l.id];
    return !p || p.status !== "completed";
  });

  // Recent activity (last 5 completed)
  const recentCompleted = labs
    .filter((l) => progress[l.id]?.status === "completed")
    .sort((a, b) => {
      const da = progress[a.id]?.completedAt ?? "";
      const db = progress[b.id]?.completedAt ?? "";
      return db.localeCompare(da);
    })
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-bold text-fg-primary">{completedCount}</div>
            <div className="text-sm text-fg-muted">Labs Completed</div>
          </div>
          <span className="text-3xl ml-auto">✅</span>
        </Card>
        <Card className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-bold text-fg-primary">{inProgressCount}</div>
            <div className="text-sm text-fg-muted">In Progress</div>
          </div>
          <span className="text-3xl ml-auto">🔄</span>
        </Card>
        <Card className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-bold text-fg-primary">
              {overallScore > 0 ? `${overallScore}%` : "—"}
            </div>
            <div className="text-sm text-fg-muted">Avg. Score</div>
          </div>
          <span className="text-3xl ml-auto">📊</span>
        </Card>
        <Card className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-bold text-fg-primary">{totalLabs}</div>
            <div className="text-sm text-fg-muted">Total Labs</div>
          </div>
          <span className="text-3xl ml-auto">🧪</span>
        </Card>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center justify-center py-6">
          <ProgressRing value={completionPct} size={100} label="Complete" />
          <p className="text-sm text-fg-muted mt-3 text-center">
            {completedCount} of {totalLabs} labs
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle className="mb-4">Progress by Category</CardTitle>
          <div className="space-y-3">
            {categoryStats.map(({ category, total, completed }) => {
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={category} className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${categoryColors[category] ?? "bg-bg-muted text-fg-secondary"}`}
                  >
                    {category}
                  </span>
                  <div className="flex-1 h-2 bg-bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-fg-muted w-12 text-right">
                    {completed}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick actions + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle className="mb-4">📌 Next Recommended Lab</CardTitle>
          {nextLab ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-fg-primary">
                  Lab {String(nextLab.number).padStart(2, "0")}: {nextLab.title}
                </span>
                <DifficultyBadge difficulty={nextLab.difficulty} />
              </div>
              <p className="text-sm text-fg-muted line-clamp-2">
                {nextLab.scenario}
              </p>
              <Link href={`/labs/${nextLab.id}`}>
                <Button size="sm">
                  Start Lab →
                </Button>
              </Link>
            </div>
          ) : (
            <p className="text-sm text-fg-muted">
              All labs completed! 🎉 Consider revisiting any for a better score.
            </p>
          )}
        </Card>

        <Card>
          <CardTitle className="mb-4">📜 Recent Completions</CardTitle>
          {recentCompleted.length > 0 ? (
            <div className="space-y-2">
              {recentCompleted.map((lab) => (
                <Link
                  key={lab.id}
                  href={`/labs/${lab.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-muted transition-colors"
                >
                  <span className="text-sm font-medium text-fg-primary">
                    Lab {String(lab.number).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-fg-secondary flex-1 line-clamp-1">
                    {lab.title}
                  </span>
                  <Badge variant="success">Completed</Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-fg-muted">
              No completed labs yet. Start your first lab above!
            </p>
          )}
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/tutor", icon: "🤖", label: "AI Tutor", desc: "Ask questions" },
          { href: "/incidents", icon: "🚨", label: "Incidents", desc: "Active tickets" },
          { href: "/roadmap", icon: "🗓️", label: "Roadmap", desc: "12-week plan" },
          { href: "/skills", icon: "🎯", label: "Skills", desc: "Skill matrix" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card hover className="text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-sm font-medium text-fg-primary">{item.label}</div>
              <div className="text-xs text-fg-muted">{item.desc}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
