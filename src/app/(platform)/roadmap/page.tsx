"use client";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import Link from "next/link";
import { getAllLabs } from "@/lib/labData";

const weeks = [
  {
    label: "Weeks 1–2",
    title: "Foundations",
    labs: ["01", "02", "03", "04", "05"],
    focus: "Windows Server, AD, DNS, DHCP, permissions",
  },
  {
    label: "Weeks 3–4",
    title: "File/Print/Endpoint",
    labs: ["06", "07", "08", "09"],
    focus: "DFS, Print Services, endpoint deployment, PC repair",
  },
  {
    label: "Weeks 5–6",
    title: "Multi-OS + Networking",
    labs: ["10", "11", "12", "13"],
    focus: "Windows/Linux/macOS, Cisco, TCP/IP, OSI, cabling",
  },
  {
    label: "Weeks 7–8",
    title: "Operations Reliability",
    labs: ["14", "15"],
    focus: "High availability, incidents, RCA, continuous improvement",
  },
  {
    label: "Week 9",
    title: "Collaboration + Infrastructure",
    labs: ["16", "17", "18"],
    focus: "Conference rooms, assets, IT closets/data-center",
  },
  {
    label: "Week 10",
    title: "Projects + Documentation",
    labs: ["19", "20"],
    focus: "Project management, SOPs, change/rollback",
  },
  {
    label: "Week 11",
    title: "Shift Simulation",
    labs: ["21"],
    focus: "Run multiple incidents under time pressure",
  },
  {
    label: "Week 12",
    title: "Capstone + Interview",
    labs: ["22"],
    focus: "Complete warehouse IT environment; interview prep",
  },
];

export default function RoadmapPage() {
  const labs = getAllLabs();

  return (
    <>
      <PageHeader
        title="12-Week Study Roadmap"
        description="A structured progression from foundations to capstone. Complete labs in order for the best learning outcome."
      />

      <div className="space-y-4">
        {weeks.map((week, i) => {
          const weekLabs = labs.filter((l) =>
            week.labs.some((n) => l.id === `lab${n}`)
          );
          return (
            <Card key={i}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-2xl font-bold text-accent">{i + 1}</span>
                  <span className="text-xs text-fg-muted">{week.label}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle>{week.title}</CardTitle>
                    <Badge variant="info">{weekLabs.length} labs</Badge>
                  </div>
                  <CardDescription className="mb-3">{week.focus}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {weekLabs.map((lab) => (
                      <Link key={lab.id} href={`/labs/${lab.id}`}>
                        <Card hover padding="sm" className="min-w-32">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-fg-muted">
                              {lab.id.replace("lab", "Lab ")}
                            </span>
                            <DifficultyBadge difficulty={lab.difficulty} />
                          </div>
                          <div className="text-sm text-fg-primary line-clamp-2">
                            {lab.title}
                          </div>
                          <div className="text-xs text-fg-muted mt-1">
                            {lab.estimatedMinutes} min
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
