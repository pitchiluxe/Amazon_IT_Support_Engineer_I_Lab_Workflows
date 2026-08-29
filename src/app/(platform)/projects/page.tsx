"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Spinner";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/storage";
import type { Project } from "@/types";
import { Plus, Calendar, DollarSign } from "lucide-react";

const statusConfig = {
  planning: { label: "Planning", variant: "info" as const },
  in_progress: { label: "In Progress", variant: "warning" as const },
  on_hold: { label: "On Hold", variant: "default" as const },
  completed: { label: "Completed", variant: "success" as const },
};

const defaultProjects: Omit<Project, "id">[] = [
  {
    title: "Site Expansion — Bay 8",
    description: "Add 30 new workstations, 2 printers, 2 scanners, and Wi-Fi AP for new operations area.",
    status: "in_progress",
    startDate: "2024-01-15",
    targetDate: "2024-02-28",
    tasks: [
      { id: "p1-1", title: "Requirements gathering", completed: true },
      { id: "p1-2", title: "Build BOM", completed: true },
      { id: "p1-3", title: "Order equipment", completed: false },
      { id: "p1-4", title: "Configure switches", completed: false },
      { id: "p1-5", title: "Deploy and test", completed: false },
    ],
    budget: 15000,
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Omit<Project, "id">>({
    title: "",
    description: "",
    status: "planning",
    startDate: new Date().toISOString().split("T")[0],
    targetDate: "",
    tasks: [],
  });

  useEffect(() => {
    const stored = getProjects();
    if (stored.length === 0) {
      const seeded = defaultProjects.map((p, i) => ({
        ...p,
        id: `proj-seed-${i}`,
      })) as Project[];
      seeded.forEach((p) => addProject(p));
      setProjects(seeded);
    } else {
      setProjects(stored);
    }
  }, []);

  const handleAdd = () => {
    if (!form.title) return;
    const project: Project = { ...form, id: `proj-${Date.now()}` };
    addProject(project);
    setProjects([...projects, project]);
    setForm({
      title: "", description: "", status: "planning",
      startDate: new Date().toISOString().split("T")[0],
      targetDate: "", tasks: [],
    });
    setShowAdd(false);
  };

  const toggleTask = (projectId: string, taskId: string) => {
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      };
    });
    setProjects(updated);
    updateProject(projectId, {
      tasks: updated.find((p) => p.id === projectId)?.tasks,
    });
  };

  const getProgress = (project: Project) => {
    if (project.tasks.length === 0) return 0;
    return Math.round(
      (project.tasks.filter((t) => t.completed).length / project.tasks.length) * 100
    );
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Track IT projects, implementation timelines, and task completion."
        actions={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>
            New Project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No projects yet"
          description="Track your IT projects with tasks, timelines, and budgets."
          action={
            <Button size="sm" onClick={() => setShowAdd(true)}>
              Create First Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => {
            const pct = getProgress(project);
            const cfg = statusConfig[project.status];
            return (
              <Card key={project.id}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
                <CardDescription className="mb-3 line-clamp-2">
                  {project.description}
                </CardDescription>

                <div className="flex items-center gap-4 text-xs text-fg-muted mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.startDate} → {project.targetDate}
                  </span>
                  {project.budget && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${project.budget.toLocaleString()}
                    </span>
                  )}
                </div>

                <ProgressBar
                  value={pct}
                  showPercent
                  size="sm"
                  className="mb-3"
                />

                <div className="space-y-1">
                  {project.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(project.id, task.id)}
                      className="w-full text-left flex items-center gap-2 text-sm p-1.5 rounded hover:bg-bg-muted transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(project.id, task.id)}
                        className="w-3.5 h-3.5"
                      />
                      <span
                        className={
                          task.completed
                            ? "text-fg-muted line-through"
                            : "text-fg-primary"
                        }
                      >
                        {task.title}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Project</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-sm text-fg-muted block mb-1">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-fg-muted block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-fg-muted block mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-fg-muted block mb-1">Target Date</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
