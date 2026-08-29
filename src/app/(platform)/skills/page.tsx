"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { getPlatformState } from "@/lib/storage";
import type { Skill, LabCategory } from "@/types";

const skillAreas: Array<{
  category: LabCategory;
  label: string;
  skills: string[];
}> = [
  {
    category: "windows",
    label: "Windows Server",
    skills: ["Active Directory", "DNS", "DHCP", "DFS", "Print Services", "Group Policy", "Windows Services", "NTFS Permissions"],
  },
  {
    category: "networking",
    label: "Networking",
    skills: ["OSI Model", "TCP/IP", "VLANs", "Trunking", "Switching", "Routing", "DHCP", "DNS", "Subnetting", "Layer 1 / Cabling"],
  },
  {
    category: "operations",
    label: "Operations",
    skills: ["Incident Management", "Escalation", "RCA / 5-Whys", "Change Management", "Rollback", "SOPs", "Communication"],
  },
  {
    category: "windows",
    label: "Endpoint Support",
    skills: ["PC Hardware", "Imaging/Deployment", "Driver Troubleshooting", "Windows Repair", "Linux Support", "macOS Support", "Asset Lifecycle"],
  },
  {
    category: "infrastructure",
    label: "Infrastructure",
    skills: ["IT Closet / Data Center", "UPS/Power", "Cabling Standards", "Video Conferencing", "Rack Management"],
  },
  {
    category: "project",
    label: "Project & Documentation",
    skills: ["Project Planning", "BOM Creation", "Network Diagrams", "Documentation", "Stakeholder Communication"],
  },
];

export default function SkillsPage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [totalSkillCount] = useState(
    skillAreas.reduce((acc, area) => acc + area.skills.length, 0)
  );

  useEffect(() => {
    const state = getPlatformState();
    const completed = Object.values(state.progress).filter(
      (p) => p.status === "completed"
    ).length;
    setCompletedCount(completed);
  }, []);

  const levelLabel = (level: number) => {
    if (level === 0) return "Not started";
    if (level === 1) return "Beginner";
    if (level === 2) return "Developing";
    if (level === 3) return "Proficient";
    return "Advanced";
  };

  const levelColor = (level: number) => {
    if (level <= 1) return "danger";
    if (level <= 2) return "warning";
    if (level <= 3) return "info";
    return "success";
  };

  // Assign levels based on completed labs
  const skillLevel = (category: LabCategory): number => {
    if (completedCount >= 18) return 4;
    if (completedCount >= 12) return 3;
    if (completedCount >= 6) return 2;
    if (completedCount >= 1) return 1;
    return 0;
  };

  return (
    <>
      <PageHeader
        title="Skill Matrix"
        description="Track your proficiency across IT support domains. Levels improve as you complete labs."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6].map((level) => {
          const count = skillAreas.filter(
            (area) => skillLevel(area.category) >= level
          ).length;
          return (
            <Card key={level} className="text-center">
              <div className="text-2xl font-bold text-fg-primary">{count}</div>
              <div className="text-xs text-fg-muted">
                {levelLabel(level)}
              </div>
              <ProgressBar
                value={count}
                max={skillAreas.length}
                showPercent={false}
                size="sm"
                className="mt-2"
              />
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillAreas.map((area) => {
          const level = skillLevel(area.category);
          return (
            <Card key={area.label}>
              <div className="flex items-center justify-between mb-3">
                <CardTitle>{area.label}</CardTitle>
                <Badge variant={levelColor(level) as any}>
                  {levelLabel(level)}
                </Badge>
              </div>
              <div className="space-y-2">
                {area.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 text-sm">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        level >= 2
                          ? "bg-success"
                          : level >= 1
                          ? "bg-warning"
                          : "bg-bg-muted border border-border-soft"
                      }`}
                    />
                    <span className="text-fg-secondary">{skill}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border-soft text-xs text-fg-muted">
                {area.skills.length} skills in this area
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
