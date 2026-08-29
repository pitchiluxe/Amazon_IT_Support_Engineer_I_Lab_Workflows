// ==========================================
// Amazon IT Support Lab Platform — Types
// ==========================================

// --- Lab Engine ---
export type LabPhase =
  | "intro"
  | "tasks"
  | "incident"
  | "evidence"
  | "hints"
  | "scoring"
  | "review";

// --- Core Entities ---

export type LabCategory =
  | "foundations"
  | "windows"
  | "networking"
  | "operations"
  | "infrastructure"
  | "project"
  | "capstone";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface TaskStep {
  /** What to do — the action or command */
  instruction: string;
  /** Where to go — the tool, menu, or interface */
  tool: string;
  /** What to expect as a result */
  expectedResult?: string;
  /** Optional: a specific command to type in the terminal */
  command?: string;
  /** Optional: the specific node to open in the environment */
  nodeId?: string;
  /** Optional: the specific tool to open in the environment */
  toolId?: string;
  /** Optional: hint to highlight a specific UI element in the tool */
  uiHint?: string;
  /** Whether this step is complete */
  completed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
  /** Step-by-step instructions — added by user */
  steps?: TaskStep[];
}

export interface EvidenceItem {
  id: string;
  label: string;
  value: string;
  collectedAt: string;
}

export interface Hint {
  level: 1 | 2 | 3 | 4 | 5;
  text: string;
}

export interface ValidationTest {
  id: string;
  description: string;
  command?: string;
  expectedResult: string;
  points: number;
}

export interface RubricItem {
  criterion: string;
  description: string;
  maxPoints: number;
}

export interface Incident {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  symptoms: string[];
  affectedAssets: string[];
  initialState: Record<string, string>;
  hiddenRootCause: string;
  allowedActions: string[];
  forbiddenActions: string[];
  evidenceRevealedOnAction: Record<string, EvidenceItem[]>;
  resolution: string;
  businessImpact: string;
}

export interface Lab {
  id: string;
  number: number;
  title: string;
  category: LabCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  objectives: string[];
  prerequisites: string[];
  scenario: string;
  environment: string[];
  tasks: Task[];
  /** Interactive environment — 3D-style system layout with clickable tools */
  interactiveEnvironment?: LabEnvironment;
  incident?: Incident;
  hints: Hint[];
  validation: ValidationTest[];
  rubric: RubricItem[];
  requiredEvidence: string[];
  deliverables: string[];
  interviewQuestion: string;
}

// --- Progress & Tracking ---

export type LabStatus = "not_started" | "in_progress" | "completed";

export interface LearnerProgress {
  labId: string;
  status: LabStatus;
  attempts: number;
  score?: number;
  evidence: EvidenceItem[];
  completedTaskIds: string[];
  hintsUsed: number;
  startedAt?: string;
  completedAt?: string;
  diagnosis?: string;
  notes?: string;
}

export interface LearnerProfile {
  name: string;
  startedAt: string;
  totalTimeMinutes: number;
  overallScore: number;
}

export interface PlatformState {
  profile: LearnerProfile;
  progress: Record<string, LearnerProgress>;
  completedIncidentIds: string[];
  portfolioEntries: string[];
  skillLevels: Record<string, number>;
}

// --- Assets & Network ---

export type AssetType =
  | "server"
  | "workstation"
  | "laptop"
  | "switch"
  | "router"
  | "printer"
  | "scanner"
  | "access_point"
  | "ups"
  | "phone"
  | "conference"
  | "other";

export type AssetStatus = "active" | "maintenance" | "retired" | "staged";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  location: string;
  ipAddress?: string;
  macAddress?: string;
  serialNumber?: string;
  assignedTo?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  notes?: string;
}

// --- SOPs ---

export interface SOP {
  id: string;
  title: string;
  category: string;
  content: string;
  owner: string;
  reviewDate: string;
  version: string;
}

// --- Projects ---

export type ProjectStatus = "planning" | "in_progress" | "on_hold" | "completed";

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  targetDate: string;
  tasks: ProjectTask[];
  budget?: number;
}

// --- Incidents (Operational) ---

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "investigating" | "escalated" | "resolved";

export interface OperationalIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedAt: string;
  resolvedAt?: string;
  reporter: string;
  affectedService: string;
  description: string;
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  timestamp: string;
  action: string;
  user: string;
  note?: string;
}

// --- AI Tutor ---

export interface TutorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type AIProvider = "ollama" | "openrouter" | "unavailable";

export interface AIStatus {
  provider: AIProvider;
  model?: string;
  available: boolean;
  error?: string;
}

// --- Skill Matrix ---

export interface Skill {
  id: string;
  name: string;
  category: LabCategory;
  level: 0 | 1 | 2 | 3 | 4;
  description: string;
}

// --- Scoring ---

export interface ScoreBreakdown {
  diagnosis: number;
  evidenceQuality: number;
  troubleshootingProcess: number;
  productionSafety: number;
  resolution: number;
  validation: number;
  documentation: number;
  communication: number;
  total: number;
}

// ==========================================
// Interactive Lab Environment
// ==========================================

/** A physical or logical location shown in the 3D lab environment */
export type NodeType =
  | "server"
  | "workstation"
  | "laptop"
  | "switch"
  | "router"
  | "firewall"
  | "printer"
  | "ups"
  | "rack"
  | "conference"
  | "wallplate";

export type NodeStatus = "online" | "offline" | "warning" | "selected";

/** A tool or interface available on a node */
export interface ToolItem {
  id: string;
  name: string;
  /** Short label shown in the tools panel */
  label: string;
  /** Full path like "Server Manager → Tools → DNS" */
  path: string;
  type: "gui" | "cli" | "web" | "settings";
  icon?: string;
}

/** A physical/logical system in the lab */
export interface EnvironmentNode {
  id: string;
  name: string;
  type: NodeType;
  /** 2D position in the environment (0-100 percentage) */
  position: { x: number; y: number };
  /** Z-index layer for depth (1=back, 3=front) */
  layer?: 1 | 2 | 3;
  /** Node status */
  status?: NodeStatus;
  /** Tools available on this node */
  tools: ToolItem[];
  /** IP address of the node (shown in environment) */
  ip?: string;
  /** Room/area label */
  room?: string;
}

/** A complete lab environment layout */
export interface LabEnvironment {
  /** Background theme */
  theme: "server_room" | "office" | "it_closet" | "mixed";
  /** Optional title for the environment view */
  title?: string;
  /** All nodes in the environment */
  nodes: EnvironmentNode[];
}

/** Current state of the interactive environment */
export interface EnvironmentState {
  selectedNodeId: string | null;
  selectedToolId: string | null;
  terminalHistory: TerminalEntry[];
  terminalInput: string;
}

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  type: "input" | "output" | "error" | "info";
  timestamp: string;
}

/** A command the terminal can respond to */
export interface TerminalCommand {
  command: string;
  description: string;
  output: string;
  nextHint?: string;
}

