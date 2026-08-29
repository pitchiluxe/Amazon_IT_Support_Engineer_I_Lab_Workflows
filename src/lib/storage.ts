// localStorage wrapper for learner progress
"use client";

import type { LearnerProgress, PlatformState, Asset, SOP, Project, OperationalIncident } from "@/types";

const KEYS = {
  state: "lab-platform-state",
  assets: "lab-platform-assets",
  sops: "lab-platform-sops",
  projects: "lab-platform-projects",
  incidents: "lab-platform-incidents",
  theme: "lab-platform-theme",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeGet<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed:", e);
  }
}

// --- Platform State ---

export function getDefaultState(): PlatformState {
  return {
    profile: {
      name: "Learner",
      startedAt: new Date().toISOString(),
      totalTimeMinutes: 0,
      overallScore: 0,
    },
    progress: {},
    completedIncidentIds: [],
    portfolioEntries: [],
    skillLevels: {},
  };
}

export function getPlatformState(): PlatformState {
  return safeGet(KEYS.state, getDefaultState());
}

export function savePlatformState(state: PlatformState): void {
  safeSet(KEYS.state, state);
}

export function getLabProgress(labId: string): LearnerProgress | null {
  const state = getPlatformState();
  return state.progress[labId] ?? null;
}

export function saveLabProgress(labId: string, progress: LearnerProgress): void {
  const state = getPlatformState();
  state.progress[labId] = progress;
  savePlatformState(state);
}

export function initLabProgress(labId: string): LearnerProgress {
  const existing = getLabProgress(labId);
  if (existing) return existing;
  const progress: LearnerProgress = {
    labId,
    status: "not_started",
    attempts: 0,
    evidence: [],
    completedTaskIds: [],
    hintsUsed: 0,
  };
  saveLabProgress(labId, progress);
  return progress;
}

export function computeOverallScore(): number {
  const state = getPlatformState();
  const scores = Object.values(state.progress)
    .map((p) => p.score)
    .filter((s): s is number => s !== undefined);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getCompletedCount(): number {
  const state = getPlatformState();
  return Object.values(state.progress).filter((p) => p.status === "completed").length;
}

export function getInProgressCount(): number {
  const state = getPlatformState();
  return Object.values(state.progress).filter((p) => p.status === "in_progress").length;
}

// --- Assets ---

export function getAssets(): Asset[] {
  const existing = safeGet<Asset[] | null>(KEYS.assets, null);
  if (existing !== null) return existing;
  // First call — seed the warehouse site with the standard inventory
  const seeded = getDefaultAssets();
  saveAssets(seeded);
  return seeded;
}

export function getDefaultAssets(): Asset[] {
  return [
    // Servers (Server Room)
    { id: "asset-dc-01", name: "DC-01", type: "server", status: "active", location: "Server Room", ipAddress: "10.0.0.10", macAddress: "00:1A:2B:3C:4D:01", serialNumber: "DL380-DCN-001", purchaseDate: "2023-03-15", warrantyExpiry: "2026-03-15" },
    { id: "asset-fs-01", name: "FS-01", type: "server", status: "active", location: "Server Room", ipAddress: "10.0.0.11", macAddress: "00:1A:2B:3C:4D:02", serialNumber: "DL380-FS-001", purchaseDate: "2023-03-15", warrantyExpiry: "2026-03-15" },
    { id: "asset-vc-01", name: "VC-Codec", type: "conference", status: "active", location: "Conference Room", ipAddress: "10.0.0.30", macAddress: "00:1A:2B:3C:4D:03", serialNumber: "POLY-001", purchaseDate: "2023-06-10" },
    // Network gear (IT Closet)
    { id: "asset-sw-01", name: "Core-SW-01", type: "switch", status: "active", location: "IT Closet", ipAddress: "10.0.0.2", macAddress: "00:1A:2B:3C:4D:10", serialNumber: "CISCO-2960-001" },
    { id: "asset-ups-01", name: "UPS-01", type: "ups", status: "active", location: "IT Closet", ipAddress: "10.0.0.20", serialNumber: "APC-3000-001" },
    // Workstations (Operations Bays)
    { id: "asset-ws-01", name: "WS-01", type: "workstation", status: "active", location: "Operations Bay 1", ipAddress: "10.0.0.100", macAddress: "00:1A:2B:3C:4E:01", serialNumber: "WS-DEL-001" },
    { id: "asset-ws-02", name: "WS-02", type: "workstation", status: "active", location: "Operations Bay 2", ipAddress: "10.0.0.101", macAddress: "00:1A:2B:3C:4E:02", serialNumber: "WS-DEL-002" },
    { id: "asset-ws-03", name: "WS-03", type: "workstation", status: "active", location: "Operations Bay 3", ipAddress: "10.0.0.102", macAddress: "00:1A:2B:3C:4E:03", serialNumber: "WS-DEL-003" },
    { id: "asset-ws-04", name: "W-04", type: "workstation", status: "active", location: "Operations Bay 4", ipAddress: "10.0.0.45", macAddress: "00:1A:2B:3C:4E:04", serialNumber: "WS-DEL-004", notes: "Stale record — actual IP is 10.0.0.103 (changed during switchport reassignment)" },
    { id: "asset-ws-05", name: "WS-05", type: "workstation", status: "active", location: "Operations Bay 5", ipAddress: "10.0.0.104", macAddress: "00:1A:2B:3C:4E:05", serialNumber: "WS-DEL-005" },
    // Printers
    { id: "asset-prn-01", name: "Warehouse-Printer-01", type: "printer", status: "active", location: "Operations Bay 1", ipAddress: "10.0.0.50", macAddress: "00:1A:2B:3C:4F:01", serialNumber: "HP-LJ-001" },
    { id: "asset-prn-02", name: "Printer-Pick-2", type: "printer", status: "active", location: "Operations Bay 3", ipAddress: "10.0.0.51", macAddress: "00:1A:2B:3C:4F:02", serialNumber: "HP-LJ-002", notes: "Stale record — physically moved to Bay 5 during renovation, inventory not updated" },
  ];
}

export function getAssetTemplateCSV(): string {
  return `Name,Type,IP,MAC,Serial,Location
DC-01,server,10.0.0.10,00:1A:2B:3C:4D:01,DL380-DCN-001,Server Room
FS-01,server,10.0.0.11,00:1A:2B:3C:4D:02,DL380-FS-001,Server Room
Core-SW-01,switch,10.0.0.2,00:1A:2B:3C:4D:10,CISCO-2960-001,IT Closet
WS-01,workstation,10.0.0.100,00:1A:2B:3C:4E:01,WS-DEL-001,Operations Bay 1
WS-02,workstation,10.0.0.101,00:1A:2B:3C:4E:02,WS-DEL-002,Operations Bay 2
WS-03,workstation,10.0.0.102,00:1A:2B:3C:4E:03,WS-DEL-003,Operations Bay 3
W-04,workstation,10.0.0.45,00:1A:2B:3C:4E:04,WS-DEL-004,Operations Bay 4
WS-05,workstation,10.0.0.104,00:1A:2B:3C:4E:05,WS-DEL-005,Operations Bay 5
Warehouse-Printer-01,printer,10.0.0.50,00:1A:2B:3C:4F:01,HP-LJ-001,Operations Bay 1
Printer-Pick-2,printer,10.0.0.51,00:1A:2B:3C:4F:02,HP-LJ-002,Operations Bay 3
VC-Codec,conference,10.0.0.30,00:1A:2B:3C:4D:03,POLY-001,Conference Room
UPS-01,ups,10.0.0.20,,APC-3000-001,IT Closet
`;
}

export function saveAssets(assets: Asset[]): void {
  safeSet(KEYS.assets, assets);
}

export function addAsset(asset: Asset): void {
  const assets = getAssets();
  assets.push(asset);
  saveAssets(assets);
}

export function updateAsset(id: string, updates: Partial<Asset>): void {
  const assets = getAssets();
  const idx = assets.findIndex((a) => a.id === id);
  if (idx !== -1) assets[idx] = { ...assets[idx], ...updates };
  saveAssets(assets);
}

export function deleteAsset(id: string): void {
  saveAssets(getAssets().filter((a) => a.id !== id));
}

// --- SOPs ---

export function getSOPs(): SOP[] {
  return safeGet(KEYS.sops, []);
}

export function saveSOPs(sops: SOP[]): void {
  safeSet(KEYS.sops, sops);
}

export function addSOP(sop: SOP): void {
  const sops = getSOPs();
  sops.push(sop);
  saveSOPs(sops);
}

export function updateSOP(id: string, updates: Partial<SOP>): void {
  const sops = getSOPs();
  const idx = sops.findIndex((s) => s.id === id);
  if (idx !== -1) sops[idx] = { ...sops[idx], ...updates };
  saveSOPs(sops);
}

export function deleteSOP(id: string): void {
  saveSOPs(getSOPs().filter((s) => s.id !== id));
}

// --- Projects ---

export function getProjects(): Project[] {
  return safeGet(KEYS.projects, []);
}

export function saveProjects(projects: Project[]): void {
  safeSet(KEYS.projects, projects);
}

export function addProject(project: Project): void {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
}

export function updateProject(id: string, updates: Partial<Project>): void {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx !== -1) projects[idx] = { ...projects[idx], ...updates };
  saveProjects(projects);
}

export function deleteProject(id: string): void {
  saveProjects(getProjects().filter((p) => p.id !== id));
}

// --- Incidents ---

export function getOperationalIncidents(): OperationalIncident[] {
  return safeGet(KEYS.incidents, []);
}

export function saveOperationalIncidents(incidents: OperationalIncident[]): void {
  safeSet(KEYS.incidents, incidents);
}

export function addOperationalIncident(incident: OperationalIncident): void {
  const incidents = getOperationalIncidents();
  incidents.push(incident);
  saveOperationalIncidents(incidents);
}

export function updateOperationalIncident(
  id: string,
  updates: Partial<OperationalIncident>
): void {
  const incidents = getOperationalIncidents();
  const idx = incidents.findIndex((i) => i.id === id);
  if (idx !== -1) incidents[idx] = { ...incidents[idx], ...updates };
  saveOperationalIncidents(incidents);
}

// --- Theme ---

export function getTheme(): "light" | "dark" | "system" {
  if (!isBrowser()) return "system";
  return (localStorage.getItem(KEYS.theme) as "light" | "dark" | "system") ?? "system";
}

export function setTheme(theme: "light" | "dark" | "system"): void {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.theme, theme);
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
