"use client";
import { useState } from "react";
import type { Task, LabEnvironment } from "@/types";
import { CheckCircle2, Circle, ChevronRight, ChevronDown, MapPin, Target, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface TaskListProps {
  tasks: Task[];
  completedTaskIds: string[];
  onToggle: (taskId: string) => void;
  environment?: LabEnvironment;
  onOpenEnvironment?: () => void;
  onStepCommand?: (command: string) => void;
}

export function TaskList({ tasks, completedTaskIds, onToggle, environment, onOpenEnvironment, onStepCommand }: TaskListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Helper to get node and tool info from IDs
  const getNodeTool = (nodeId?: string, toolId?: string) => {
    if (!nodeId || !environment) return null;
    const node = environment.nodes.find((n) => n.id === nodeId);
    if (!node) return null;
    const tool = toolId ? node.tools.find((t) => t.id === toolId) : null;
    return { node, tool };
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const done = completedTaskIds.includes(task.id);
        const expanded = expandedId === task.id;
        const hasSteps = task.steps && task.steps.length > 0;

        return (
          <div
            key={task.id}
            className={`rounded-lg border transition-colors ${
              done
                ? "border-success/30 bg-success-muted/20"
                : expanded
                ? "border-accent bg-bg-surface"
                : "border-border-soft bg-bg-surface"
            }`}
          >
            {/* Header — clickable to toggle completion AND expand */}
            <div className="flex items-start gap-3 p-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(task.id);
                }}
                className="flex-shrink-0 mt-0.5"
                aria-label={done ? "Mark incomplete" : "Mark complete"}
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-fg-muted hover:text-accent transition-colors" />
                )}
              </button>

              <button
                onClick={() => setExpandedId(expanded ? null : task.id)}
                className="flex-1 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`font-medium text-sm ${
                      done ? "line-through text-fg-muted" : "text-fg-primary"
                    }`}
                  >
                    {task.title}
                  </div>
                  {hasSteps && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="info" className="text-xs">
                        {task.steps!.length} steps
                      </Badge>
                      {expanded ? (
                        <ChevronDown className="w-4 h-4 text-fg-muted" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-fg-muted" />
                      )}
                    </div>
                  )}
                </div>
                <div className="text-xs text-fg-muted mt-0.5">{task.description}</div>
              </button>
            </div>

            {/* Expanded — show step-by-step instructions */}
            {expanded && hasSteps && (
              <div className="border-t border-border-soft bg-bg-muted/30 p-4">
                <div className="text-xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
                  How to complete this task
                </div>
                <ol className="space-y-3">
                  {task.steps!.map((step, i) => {
                    const nav = getNodeTool(step.nodeId, step.toolId);

                    return (
                      <li key={i} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-fg-inverted flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-fg-primary mb-1">
                            {step.instruction}
                          </div>

                          {/* Navigation instructions — either node+tool or generic tool path */}
                          <div className="flex items-start gap-1.5 text-xs text-fg-secondary">
                            <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                            <span>
                              <span className="font-medium text-fg-secondary">Go to:</span>{" "}
                              {nav ? (
                                // Environment navigation — actionable path
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenEnvironment?.();
                                    // If this step has a command, pre-fill the terminal
                                    if (step.command && onStepCommand) {
                                      onStepCommand(step.command);
                                    }
                                    setExpandedId(null); // collapse to give room
                                  }}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono text-[11px] hover:bg-blue-700 transition-colors"
                                  title={`${nav.node.name} → ${nav.tool?.name || step.tool}${step.command ? ` (will pre-fill: ${step.command})` : ""}`}
                                >
                                  <Monitor className="w-3 h-3" />
                                  Interactive Env
                                  <span className="opacity-70">›</span>
                                  {nav.node.name}
                                  {nav.tool && (
                                    <>
                                      <span className="opacity-70">›</span>
                                      {nav.tool.name}
                                    </>
                                  )}
                                  {step.command && (
                                    <span className="ml-1 px-1 py-0.5 rounded bg-white/20 text-white/90 text-[10px] font-mono">
                                      {step.command}
                                    </span>
                                  )}
                                </button>
                              ) : (
                                <code className="px-1.5 py-0.5 rounded bg-bg-surface text-accent font-mono text-[11px]">
                                  {step.tool}
                                </code>
                              )}
                            </span>
                          </div>

                          {step.expectedResult && (
                            <div className="flex items-start gap-1.5 text-xs text-fg-muted mt-1">
                              <Target className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                              <span>
                                <span className="font-medium text-fg-secondary">Expected:</span>{" "}
                                {step.expectedResult}
                              </span>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
