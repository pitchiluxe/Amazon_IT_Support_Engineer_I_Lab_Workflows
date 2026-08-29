"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge, DifficultyBadge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState, LoadingState } from "@/components/ui/Spinner";
import { getAllLabs } from "@/lib/labData";
import { getPlatformState } from "@/lib/storage";
import type { Lab, LearnerProgress, LabCategory, Difficulty } from "@/types";

const categoryLabels: Record<LabCategory, string> = {
  foundations: "Foundations",
  windows: "Windows Server",
  networking: "Networking",
  operations: "Operations",
  infrastructure: "Infrastructure",
  project: "Project",
  capstone: "Capstone",
};

export default function LabsPage() {
  const labs = getAllLabs();
  const [progress, setProgress] = useState<Record<string, LearnerProgress>>({});
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");

  useEffect(() => {
    setProgress(getPlatformState().progress);
  }, []);

  const filtered = useMemo(() => {
    return labs.filter((lab) => {
      if (catFilter !== "all" && lab.category !== catFilter) return false;
      if (diffFilter !== "all" && lab.difficulty !== diffFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          lab.title.toLowerCase().includes(q) ||
          lab.scenario.toLowerCase().includes(q) ||
          lab.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [labs, search, catFilter, diffFilter]);

  const categories: LabCategory[] = Array.from(new Set(labs.map((l) => l.category))) as LabCategory[];

  return (
    <>
      <PageHeader
        title="Labs"
        description={`${labs.length} hands-on labs across the IT Support Engineer I curriculum. Complete them in order for the best learning path.`}
      />

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Search labs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-64 px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary placeholder:text-fg-muted text-sm"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c] ?? c}
            </option>
          ))}
        </select>
        <select
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
        >
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No labs match your filters"
          description="Try adjusting your search or category filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lab) => {
            const p = progress[lab.id];
            return (
              <Link key={lab.id} href={`/labs/${lab.id}`}>
                <Card hover className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono text-fg-muted">
                      Lab {String(lab.number).padStart(2, "0")}
                    </span>
                    <DifficultyBadge difficulty={lab.difficulty} />
                  </div>
                  <CardTitle className="mb-1">{lab.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mb-3">
                    {lab.scenario}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-border-soft">
                    <Badge variant="default">{categoryLabels[lab.category]}</Badge>
                    {p && <StatusBadge status={p.status} />}
                    {p?.score !== undefined && (
                      <Badge variant="success">{p.score}%</Badge>
                    )}
                    <span className="text-xs text-fg-muted ml-auto">
                      {lab.estimatedMinutes} min
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
