"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { LoadingState, EmptyState } from "@/components/ui/Spinner";
import { TutorChat } from "@/components/tutor/TutorChat";
import { IncidentPanel } from "@/components/incidents/IncidentPanel";
import { TaskList } from "@/components/labs/TaskList";
import { LabEnvironment } from "@/components/environment/LabEnvironment";
import {
  getLabById,
} from "@/lib/labData";
import {
  initLabProgress,
  getLabProgress,
  saveLabProgress,
  computeOverallScore,
} from "@/lib/storage";
import {
  calculateScore,
  getReadinessLevel,
} from "@/lib/scoring";
import {
  advancePhase,
  collectEvidence,
  completeTask,
  finishLab,
  validateDiagnosis,
  getNextHint,
} from "@/lib/labEngine";
import type { Lab, LearnerProgress, LabPhase, EvidenceItem } from "@/types";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Terminal,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Monitor,
} from "lucide-react";

interface LabClientProps {
  lab: Lab;
}

const phaseOrder: LabPhase[] = [
  "intro",
  "tasks",
  "incident",
  "evidence",
  "hints",
  "scoring",
  "review",
];

const phaseLabels: Record<LabPhase, string> = {
  intro: "Briefing",
  tasks: "Tasks",
  incident: "Incident",
  evidence: "Evidence",
  hints: "Hints",
  scoring: "Scoring",
  review: "Review",
};

export function LabClient({ lab }: LabClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<LearnerProgress | null>(null);
  const [phase, setPhase] = useState<LabPhase>("intro");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [showTutor, setShowTutor] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showEnvironment, setShowEnvironment] = useState(false);
  // Pending command to send to the environment when a task step is clicked
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [evidenceInput, setEvidenceInput] = useState("");
  const [validationResults, setValidationResults] = useState<
    Record<string, boolean>
  >({});
  const [hintRevealed, setHintRevealed] = useState<number[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<{
    correct: boolean;
    show: boolean;
  }>({ correct: false, show: false });
  const [score, setScore] = useState(0);
  const [incidentsCompleted, setIncidentsCompleted] = useState(false);

  useEffect(() => {
    const p = initLabProgress(lab.id);
    setProgress(p);
  }, [lab.id]);

  if (!progress) {
    return <LoadingState message="Loading lab..." />;
  }

  const phaseIdx = phaseOrder.indexOf(phase);

  const handleStart = () => {
    setPhase("tasks");
  };

  const handleTaskToggle = (taskId: string) => {
    if (!progress) return;
    const updated = { ...progress };
    completeTask(lab, taskId, updated);
    saveLabProgress(lab.id, updated);
    setProgress(updated);
  };

  const handleCollectEvidence = () => {
    if (!progress || !evidenceInput.trim()) return;
    const evidence: EvidenceItem = {
      id: `ev-${Date.now()}`,
      label: "Learner-collected evidence",
      value: evidenceInput,
      collectedAt: new Date().toISOString(),
    };
    const updated = { ...progress };
    collectEvidence(evidence, updated);
    saveLabProgress(lab.id, updated);
    setProgress(updated);
    setEvidenceInput("");
  };

  const handleRequestHint = () => {
    if (!progress) return;
    const next = getNextHint(lab.hints, hintRevealed);
    if (next) {
      setHintRevealed([...hintRevealed, next.level]);
      const updated = { ...progress };
      updated.hintsUsed = hintRevealed.length + 1;
      saveLabProgress(lab.id, updated);
      setProgress(updated);
    }
  };

  const handleSubmitDiagnosis = () => {
    if (!lab.incident) {
      handleAdvance();
      return;
    }
    const correct = validateDiagnosis(diagnosis, lab.incident);
    setDiagnosisResult({ correct, show: true });
  };

  const handleAdvance = () => {
    const next = advancePhase({ phase, currentTaskIndex: 0, gatheredEvidence: [], hintsRevealed: [], revealedEvidence: [], startedAt: progress.startedAt ?? new Date().toISOString() });
    setPhase(next);
  };

  const handleValidate = (testId: string, passed: boolean) => {
    setValidationResults({ ...validationResults, [testId]: passed });
  };

  const handleFinish = () => {
    if (!progress) return;
    const breakdown = calculateScore(lab, progress, {
      diagnosedCorrectly: diagnosisResult.correct,
      documentedWell: notes.length > 50,
    });
    setScore(breakdown.total);
    const updated = finishLab(progress, breakdown.total);
    updated.notes = notes;
    updated.diagnosis = diagnosis;
    saveLabProgress(lab.id, updated);
    setProgress(updated);
    setPhase("review");
  };

  const handleReset = () => {
    localStorage.removeItem("lab-platform-state");
    const fresh = initLabProgress(lab.id);
    setProgress(fresh);
    setPhase("intro");
    setDiagnosis("");
    setNotes("");
    setValidationResults({});
    setHintRevealed([]);
    setDiagnosisResult({ correct: false, show: false });
    setScore(0);
    setIncidentsCompleted(false);
  };

  const completedTasks = progress.completedTaskIds.length;
  const totalTasks = lab.tasks.length;
  const evidenceCount = progress.evidence.length;
  const requiredEvidence = lab.requiredEvidence.length;

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sm text-fg-muted mb-1">
            <Link href="/labs" className="hover:text-fg-primary">
              Labs
            </Link>
            <span>›</span>
            <span>Lab {String(lab.number).padStart(2, "0")}</span>
          </div>
          <h1 className="text-2xl font-bold text-fg-primary">{lab.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <DifficultyBadge difficulty={lab.difficulty} />
            <Badge variant="default">{lab.category}</Badge>
            <Badge variant="info">{lab.estimatedMinutes} min</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowTutor(!showTutor)}
            icon={<Lightbulb className="w-4 h-4" />}
          >
            {showTutor ? "Hide" : "Ask"} Tutor
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Phase progress */}
      <Card padding="sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {phaseOrder.map((p, idx) => (
            <div key={p} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setPhase(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  phase === p
                    ? "bg-accent text-fg-inverted"
                    : idx < phaseIdx
                    ? "bg-success-muted text-success"
                    : "bg-bg-muted text-fg-muted"
                }`}
              >
                {phaseLabels[p]}
              </button>
              {idx < phaseOrder.length - 1 && (
                <ChevronRight className="w-3 h-3 text-fg-muted" />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {phase === "intro" && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-accent" />
                <CardTitle>Scenario</CardTitle>
              </div>
              <p className="text-fg-secondary mb-4 leading-relaxed">
                {lab.scenario}
              </p>

              <h3 className="font-semibold text-sm mb-2 mt-4">Objectives</h3>
              <ul className="space-y-1 mb-4">
                {lab.objectives.map((obj, i) => (
                  <li
                    key={i}
                    className="text-sm text-fg-secondary flex gap-2 items-start"
                  >
                    <span className="text-accent mt-1">▸</span>
                    {obj}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-sm mb-2">Environment</h3>
              <ul className="space-y-1 mb-4">
                {lab.environment.map((env, i) => (
                  <li
                    key={i}
                    className="text-sm text-fg-secondary flex gap-2 items-start"
                  >
                    <span className="text-fg-muted mt-1">•</span>
                    {env}
                  </li>
                ))}
              </ul>

              {lab.prerequisites.length > 0 && (
                <>
                  <h3 className="font-semibold text-sm mb-2">Prerequisites</h3>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lab.prerequisites.map((p, i) => (
                      <Badge key={i} variant="warning">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </>
              )}

              <Button onClick={handleStart} icon={<ChevronRight className="w-4 h-4" />}>
                Start Lab
              </Button>
            </Card>
          )}

          {phase === "tasks" && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <CardTitle>Tasks</CardTitle>
                </div>
                <span className="text-xs text-fg-muted">
                  {completedTasks} / {totalTasks}
                </span>
              </div>
              <ProgressBar
                value={completedTasks}
                max={totalTasks}
                showPercent={false}
                size="sm"
                className="mb-4"
              />
              <div className="text-xs text-fg-muted mb-3 flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Click any task to expand step-by-step instructions</span>
              </div>
              <TaskList
                tasks={lab.tasks}
                completedTaskIds={progress.completedTaskIds}
                onToggle={handleTaskToggle}
                environment={lab.interactiveEnvironment}
                onOpenEnvironment={() => setShowEnvironment(true)}
                onStepCommand={(cmd) => setPendingCommand(cmd)}
              />

              {/* Interactive Environment */}
              {lab.interactiveEnvironment && (
                <div className="mt-4 border-t border-border-soft pt-4">
                  <button
                    onClick={() => setShowEnvironment(!showEnvironment)}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-bg-muted transition-colors text-sm font-medium text-fg-primary"
                  >
                    <span className="text-accent text-lg">{showEnvironment ? "▼" : "▶"}</span>
                    <span>🖥️ Interactive Lab Environment</span>
                    {showEnvironment && (
                      <span className="ml-auto text-xs text-fg-muted bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>

                  {showEnvironment && lab.interactiveEnvironment && (
                    <div className="mt-3">
                      <LabEnvironment
                        environment={lab.interactiveEnvironment}
                        pendingCommand={pendingCommand}
                        onCommandConsumed={() => setPendingCommand(null)}
                        onNodeSelect={(nodeId, toolId) => {
                          // Auto-navigate to tool step hint
                          console.log(`Node: ${nodeId}, Tool: ${toolId}`);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPhase("intro")}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setPhase("incident")}
                  icon={<ChevronRight className="w-4 h-4" />}
                  disabled={completedTasks === 0}
                >
                  Next: Incident
                </Button>
              </div>
            </Card>
          )}

          {phase === "incident" && lab.incident && (
            <IncidentPanel
              incident={lab.incident}
              onSubmit={handleSubmitDiagnosis}
              diagnosis={diagnosis}
              setDiagnosis={setDiagnosis}
              result={diagnosisResult}
              onContinue={() => setPhase("evidence")}
            />
          )}

          {phase === "incident" && !lab.incident && (
            <Card>
              <CardTitle>No Incident</CardTitle>
              <p className="text-fg-muted text-sm mt-2">
                This lab does not have a simulation incident. Continue to gather evidence.
              </p>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setPhase("evidence")}>
                  Continue
                </Button>
              </div>
            </Card>
          )}

          {phase === "evidence" && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-accent" />
                <CardTitle>Evidence &amp; Validation</CardTitle>
              </div>
              <p className="text-sm text-fg-muted mb-3">
                Gather evidence methodically. Avoid guessing. Each piece of evidence should support your understanding of the system.
              </p>

              <div className="bg-bg-muted rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold mb-2">Add Evidence</h4>
                <div className="flex gap-2">
                  <input
                    value={evidenceInput}
                    onChange={(e) => setEvidenceInput(e.target.value)}
                    placeholder="e.g., 'Ping W-04 returns 10.0.0.50, not 10.0.0.45'"
                    className="flex-1 px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary placeholder:text-fg-muted text-sm"
                  />
                  <Button size="sm" onClick={handleCollectEvidence}>
                    Add
                  </Button>
                </div>
              </div>

              {progress.evidence.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Collected Evidence ({progress.evidence.length})
                  </h4>
                  <div className="space-y-2">
                    {progress.evidence.map((e) => (
                      <div
                        key={e.id}
                        className="p-2 rounded-lg border border-border-soft bg-bg-muted text-sm"
                      >
                        <div className="text-fg-primary">{e.value}</div>
                        <div className="text-xs text-fg-muted mt-1">
                          {new Date(e.collectedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h4 className="text-sm font-semibold mb-2">Validation Tests</h4>
              <div className="space-y-2">
                {lab.validation.map((test) => (
                  <div
                    key={test.id}
                    className="p-2 rounded-lg border border-border-soft text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={validationResults[test.id] ?? false}
                        onChange={(e) =>
                          handleValidate(test.id, e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-fg-primary">{test.description}</span>
                      <span className="text-xs text-fg-muted ml-auto">
                        {test.points} pts
                      </span>
                    </div>
                    {test.command && (
                      <div className="text-xs font-mono text-fg-muted mt-1 ml-6">
                        {test.command}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPhase("incident")}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button onClick={() => setPhase("hints")} icon={<ChevronRight className="w-4 h-4" />}>
                  Next: Hints &amp; Review
                </Button>
              </div>
            </Card>
          )}

          {phase === "hints" && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-warning" />
                <CardTitle>Hints &amp; Self-Review</CardTitle>
              </div>
              <p className="text-sm text-fg-muted mb-3">
                Hints follow the troubleshooting order: clarify → subsystem → diagnostic command → mechanism → solution. Use sparingly.
              </p>

              <div className="space-y-2 mb-4">
                {lab.hints.map((hint) => {
                  const revealed = hintRevealed.includes(hint.level);
                  return (
                    <div
                      key={hint.level}
                      className="p-3 rounded-lg border border-border-soft"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-fg-muted">
                          LEVEL {hint.level}
                        </span>
                        {!revealed && (
                          <Button size="sm" variant="ghost" onClick={handleRequestHint}>
                            Reveal
                          </Button>
                        )}
                      </div>
                      {revealed ? (
                        <p className="text-sm text-fg-secondary">{hint.text}</p>
                      ) : (
                        <p className="text-sm text-fg-muted italic">
                          [Hidden]
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <h4 className="text-sm font-semibold mb-2">Notes (required for full credit)</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document your approach, what you checked, and what you found..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary placeholder:text-fg-muted text-sm font-mono"
              />

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPhase("evidence")}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button onClick={() => setPhase("scoring")} icon={<ChevronRight className="w-4 h-4" />}>
                  Score Lab
                </Button>
              </div>
            </Card>
          )}

          {phase === "scoring" && (
            <Card>
              <CardTitle>Final Scoring</CardTitle>
              <p className="text-sm text-fg-muted mt-1 mb-4">
                Review your evidence and submit for scoring. The hidden root cause will be revealed on the next screen.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="p-3 rounded-lg bg-bg-muted">
                  <div className="text-fg-muted">Tasks completed</div>
                  <div className="text-lg font-bold text-fg-primary">
                    {completedTasks} / {totalTasks}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-bg-muted">
                  <div className="text-fg-muted">Evidence collected</div>
                  <div className="text-lg font-bold text-fg-primary">
                    {evidenceCount} / {requiredEvidence || "?"}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-bg-muted">
                  <div className="text-fg-muted">Hints used</div>
                  <div className="text-lg font-bold text-fg-primary">
                    {progress.hintsUsed}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-bg-muted">
                  <div className="text-fg-muted">Diagnosis</div>
                  <div className="text-lg font-bold text-fg-primary">
                    {diagnosisResult.show
                      ? diagnosisResult.correct
                        ? "✓ Correct"
                        : "✗ Review"
                      : "Not submitted"}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPhase("hints")}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button onClick={handleFinish} icon={<Award className="w-4 h-4" />}>
                  Submit &amp; View Score
                </Button>
              </div>
            </Card>
          )}

          {phase === "review" && progress.status === "completed" && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-6 h-6 text-accent" />
                <CardTitle>Lab Review</CardTitle>
              </div>

              <div className="text-center py-6 mb-4">
                <div className="text-6xl font-bold text-accent">{score}%</div>
                <div className="text-sm text-fg-muted mt-1">
                  {getReadinessLevel(score).label}
                </div>
              </div>

              {lab.incident && (
                <div className="p-4 rounded-lg bg-warning-muted border border-warning/30 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="font-semibold text-warning">Hidden Root Cause</span>
                  </div>
                  <p className="text-sm text-fg-secondary">
                    {lab.incident.hiddenRootCause}
                  </p>
                </div>
              )}

              <h3 className="font-semibold text-sm mb-2 mt-4">Resolution</h3>
              <p className="text-sm text-fg-secondary mb-4">
                {lab.incident?.resolution ?? "Lab objectives completed."}
              </p>

              <h3 className="font-semibold text-sm mb-2">Required Evidence Checklist</h3>
              <div className="space-y-1 mb-4">
                {lab.requiredEvidence.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {evidenceCount > i ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Circle className="w-4 h-4 text-fg-muted" />
                    )}
                    <span className={evidenceCount > i ? "text-fg-primary" : "text-fg-muted"}>
                      {req}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-sm mb-2">Deliverables</h3>
              <ul className="text-sm text-fg-secondary list-disc pl-5 mb-4">
                {lab.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>

              <div className="p-4 rounded-lg bg-accent-muted border border-accent/30">
                <h3 className="font-semibold text-sm mb-2 text-accent">
                  Interview Question
                </h3>
                <p className="text-sm text-fg-secondary italic">
                  &ldquo;{lab.interviewQuestion}&rdquo;
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => router.push("/labs")}
                >
                  Back to Labs
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/portfolio?add=${lab.id}`)}
                >
                  Add to Portfolio
                </Button>
                <Link href="/labs">
                  <Button>Continue</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-sm mb-3">Lab Progress</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-fg-muted">Tasks</span>
                  <span className="text-fg-primary">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
                <ProgressBar
                  value={completedTasks}
                  max={totalTasks}
                  showPercent={false}
                  size="sm"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-fg-muted">Evidence</span>
                  <span className="text-fg-primary">
                    {evidenceCount}/{requiredEvidence || "?"}
                  </span>
                </div>
                <ProgressBar
                  value={evidenceCount}
                  max={requiredEvidence || 1}
                  showPercent={false}
                  size="sm"
                />
              </div>
              {progress.score !== undefined && (
                <div className="pt-2 border-t border-border-soft">
                  <div className="flex justify-between">
                    <span className="text-fg-muted">Final score</span>
                    <span className="font-bold text-accent">{progress.score}%</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {showTutor && (
            <TutorChat
              labTitle={lab.title}
              scenario={lab.scenario}
            />
          )}
        </div>
      </div>

      <Modal
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset Lab Progress?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowResetConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleReset();
                setShowResetConfirm(false);
              }}
            >
              Reset
            </Button>
          </>
        }
      >
        <p className="text-fg-secondary">
          This will clear all your tasks, evidence, notes, and score for this lab. Are you sure?
        </p>
      </Modal>
    </div>
  );
}
