"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { clsx } from "clsx";
import type {
  EnvironmentNode,
  LabEnvironment as LabEnvironmentType,
  TerminalEntry,
} from "@/types";
import { Button } from "@/components/ui/Button";

// ─── Node type icons (SVG) ───────────────────────────────────────────────────
const NodeIcon = ({
  type,
  size = 32,
}: {
  type: EnvironmentNode["type"];
  size?: number;
}) => {
  const s = size;
  switch (type) {
    case "server":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" rx="3" fill="#3b82f6" opacity="0.2" />
          <rect x="4" y="4" width="24" height="24" rx="3" stroke="#3b82f6" strokeWidth="1.5" />
          <rect x="7" y="8" width="10" height="2" rx="1" fill="#3b82f6" />
          <circle cx="23" cy="9" r="1.5" fill="#22c55e" />
          <rect x="7" y="13" width="18" height="2" rx="1" fill="#64748b" />
          <rect x="7" y="18" width="18" height="2" rx="1" fill="#64748b" />
          <rect x="7" y="23" width="18" height="2" rx="1" fill="#64748b" />
        </svg>
      );
    case "workstation":
    case "laptop":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="4" y="6" width="24" height="16" rx="2" fill="#0891b2" opacity="0.2" />
          <rect x="4" y="6" width="24" height="16" rx="2" stroke="#0891b2" strokeWidth="1.5" />
          <rect x="7" y="9" width="18" height="10" rx="1" fill="#0891b2" opacity="0.3" />
          <rect x="13" y="22" width="6" height="2" rx="1" fill="#64748b" />
          <rect x="10" y="24" width="12" height="2" rx="1" fill="#64748b" />
        </svg>
      );
    case "switch":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="2" y="10" width="28" height="12" rx="2" fill="#7c3aed" opacity="0.2" />
          <rect x="2" y="10" width="28" height="12" rx="2" stroke="#7c3aed" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <rect x={4 + i * 3.2} y="13" width="2" height="3" rx="0.5" fill="#7c3aed" />
              <rect x={4 + i * 3.2} y="18" width="2" height="2" rx="0.5" fill="#22c55e" />
            </g>
          ))}
        </svg>
      );
    case "router":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="16" rx="12" ry="8" fill="#d97706" opacity="0.2" />
          <ellipse cx="16" cy="16" rx="12" ry="8" stroke="#d97706" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="3" fill="#d97706" opacity="0.5" />
          <circle cx="16" cy="8" r="1.5" fill="#d97706" />
          <circle cx="16" cy="24" r="1.5" fill="#d97706" />
          <circle cx="8" cy="13" r="1.5" fill="#d97706" />
          <circle cx="24" cy="13" r="1.5" fill="#d97706" />
          <circle cx="8" cy="19" r="1.5" fill="#d97706" />
          <circle cx="24" cy="19" r="1.5" fill="#d97706" />
        </svg>
      );
    case "printer":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="6" y="10" width="20" height="12" rx="2" fill="#16a34a" opacity="0.2" />
          <rect x="6" y="10" width="20" height="12" rx="2" stroke="#16a34a" strokeWidth="1.5" />
          <rect x="9" y="7" width="14" height="5" rx="1" fill="#16a34a" opacity="0.4" />
          <rect x="9" y="15" width="14" height="4" rx="1" fill="#64748b" opacity="0.3" />
          <rect x="11" y="22" width="10" height="2" rx="1" fill="#64748b" />
        </svg>
      );
    case "ups":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="8" y="4" width="16" height="24" rx="2" fill="#dc2626" opacity="0.2" />
          <rect x="8" y="4" width="16" height="24" rx="2" stroke="#dc2626" strokeWidth="1.5" />
          <rect x="11" y="8" width="10" height="3" rx="1" fill="#dc2626" />
          <rect x="11" y="14" width="10" height="2" rx="1" fill="#64748b" />
          <rect x="11" y="19" width="10" height="2" rx="1" fill="#64748b" />
          <rect x="11" y="24" width="10" height="2" rx="1" fill="#64748b" />
        </svg>
      );
    case "firewall":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="6" y="8" width="20" height="16" rx="3" fill="#dc2626" opacity="0.2" />
          <rect x="6" y="8" width="20" height="16" rx="3" stroke="#dc2626" strokeWidth="1.5" />
          <path d="M10 12 L16 18 L10 24" stroke="#dc2626" strokeWidth="1.5" fill="none" />
          <path d="M14 12 L20 18 L14 24" stroke="#dc2626" strokeWidth="1.5" fill="none" />
          <path d="M18 12 L24 18 L18 24" stroke="#dc2626" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "rack":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="8" y="2" width="16" height="28" rx="2" fill="#475569" opacity="0.2" />
          <rect x="8" y="2" width="16" height="28" rx="2" stroke="#475569" strokeWidth="1.5" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x="10" y={4 + i * 3.2} width="12" height="2.5" rx="1" fill="#64748b" opacity="0.5" />
          ))}
        </svg>
      );
    case "conference":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="4" y="12" width="24" height="14" rx="2" fill="#0891b2" opacity="0.2" />
          <rect x="4" y="12" width="24" height="14" rx="2" stroke="#0891b2" strokeWidth="1.5" />
          <circle cx="16" cy="8" r="4" fill="#0891b2" opacity="0.3" />
          <circle cx="16" cy="8" r="4" stroke="#0891b2" strokeWidth="1.5" />
          <circle cx="16" cy="8" r="1.5" fill="#0891b2" />
          <rect x="12" y="20" width="8" height="3" rx="1" fill="#0891b2" opacity="0.4" />
        </svg>
      );
    case "wallplate":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="10" y="8" width="12" height="16" rx="1" fill="#64748b" opacity="0.2" />
          <rect x="10" y="8" width="12" height="16" rx="1" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="2" fill="#22c55e" />
          <circle cx="18" cy="14" r="2" fill="#22c55e" />
          <rect x="13" y="19" width="6" height="2" rx="1" fill="#64748b" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" rx="4" fill="#64748b" opacity="0.2" />
          <rect x="4" y="4" width="24" height="24" rx="4" stroke="#64748b" strokeWidth="1.5" />
        </svg>
      );
  }
};

// ─── Status dot ─────────────────────────────────────────────────────────────
const StatusDot = ({ status }: { status?: string }) => {
  const colors: Record<string, string> = {
    online: "bg-success",
    offline: "bg-danger",
    warning: "bg-warning",
    selected: "bg-accent",
  };
  return (
    <span
      className={clsx(
        "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-bg-surface",
        colors[status || "online"] || "bg-success"
      )}
    />
  );
};

// ─── 3D Node ────────────────────────────────────────────────────────────────
function Node3D({
  node,
  isSelected,
  onClick,
}: {
  node: EnvironmentNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColor =
    node.status === "offline"
      ? "border-danger/50"
      : node.status === "warning"
        ? "border-warning/50"
        : isSelected
          ? "border-accent"
          : "border-border-strong hover:border-accent";

  return (
    <button
      onClick={onClick}
      className={clsx(
        "absolute flex flex-col items-center gap-1 group transition-all duration-200",
        isSelected && "scale-105 z-30",
        node.layer === 3 && "z-20",
        node.layer === 2 && "z-10"
      )}
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      title={`${node.name} — ${node.ip || ""}`}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-0 w-16 h-4 rounded-full bg-black/20 blur-sm"
        style={{ transform: "translateY(50%) scale(1.1)" }}
      />

      {/* 3D box — server rack style */}
      <div
        className={clsx(
          "relative w-20 h-16 rounded-xl border-2 transition-all duration-200",
          "flex flex-col items-center justify-center gap-0.5 px-2",
          "bg-bg-surface shadow-lg",
          statusColor,
          isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-bg-surface" : "group-hover:shadow-xl"
        )}
      >
        <NodeIcon type={node.type} size={36} />
        <StatusDot status={isSelected ? "selected" : node.status} />
      </div>

      {/* Label — always visible (short) */}
      <div
        className={clsx(
          "absolute top-full mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap",
          "bg-bg-surface border border-border-soft shadow-sm pointer-events-none",
          isSelected ? "text-accent" : "text-fg-primary"
        )}
      >
        {node.name}
      </div>

      {/* Hover tooltip — full details */}
      <div
        className={clsx(
          "absolute left-full ml-2 top-0 px-2 py-1.5 rounded text-[10px] font-medium whitespace-nowrap z-40",
          "bg-bg-elevated border border-border-strong shadow-lg pointer-events-none",
          "transition-opacity duration-150",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <div className="font-semibold text-fg-primary">{node.name}</div>
        {node.ip && <div className="text-fg-muted font-mono">{node.ip}</div>}
        {node.room && <div className="text-fg-muted">{node.room}</div>}
      </div>
    </button>
  );
}

// ─── Environment Background ──────────────────────────────────────────────────
function EnvironmentBackground({
  theme,
}: {
  theme: LabEnvironmentType["theme"];
}) {
  if (theme === "server_room" || theme === "it_closet") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Floor grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border-strong" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Back wall */}
        <div
          className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg-muted/50 to-transparent"
          style={{ height: "30%" }}
        />

        {/* Server rack outlines */}
        <div className="absolute top-[8%] left-[5%] w-24 h-36 rounded border border-border-soft/30 opacity-30" />
        <div className="absolute top-[8%] right-[5%] w-24 h-36 rounded border border-border-soft/30 opacity-30" />

        {/* Floor reflection */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{
            background: "linear-gradient(to top, rgba(15,23,42,0.08), transparent)",
          }}
        />
      </div>
    );
  }

  if (theme === "office") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid floor */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border-strong" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>

        {/* Office desk outlines */}
        <div className="absolute top-[20%] left-[15%] w-32 h-16 rounded-lg border border-border-soft/30 opacity-20" />
        <div className="absolute top-[20%] right-[15%] w-32 h-16 rounded-lg border border-border-soft/30 opacity-20" />

        {/* Window light */}
        <div className="absolute top-0 right-[20%] w-48 h-full bg-gradient-to-l from-accent/5 to-transparent opacity-30" />
      </div>
    );
  }

  // mixed
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid3" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border-strong" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid3)" />
      </svg>
    </div>
  );
}

// ─── Terminal ────────────────────────────────────────────────────────────────
function Terminal({
  onCommand,
  history,
  onClear,
}: {
  onCommand: (cmd: string) => void;
  history: TerminalEntry[];
  onClear: () => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      // cycle through history — simplified
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-[#0f172a] rounded-xl overflow-hidden border border-[#1e293b]"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border-b border-[#334155]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
        </div>
        <span className="text-xs text-[#94a3b8] ml-2 font-mono">PowerShell</span>
        <div className="ml-auto">
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {history.length === 0 && (
          <p className="text-[#475569] font-mono text-sm">
            Windows PowerShell{"\n"}
            <span className="text-[#38bdf8]">PS C:\&gt;</span> Type a command below...
          </p>
        )}
        {history.map((entry) => (
          <div key={entry.id} className="font-mono text-sm">
            {entry.type === "input" && (
              <div className="flex gap-2">
                <span className="text-[#38bdf8]">PS C:\&gt;</span>
                <span className="text-[#e2e8f0]">{entry.command}</span>
              </div>
            )}
            {entry.type === "output" && (
              <pre className="text-[#a7f3d0] whitespace-pre-wrap pl-4">{entry.output}</pre>
            )}
            {entry.type === "error" && (
              <pre className="text-[#fca5a5] whitespace-pre-wrap pl-4">{entry.output}</pre>
            )}
            {entry.type === "info" && (
              <pre className="text-[#94a3b8] whitespace-pre-wrap pl-4 italic">{entry.output}</pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-[#334155]">
        <span className="text-[#38bdf8] font-mono text-sm flex-shrink-0">PS C:\&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          className="flex-1 bg-transparent text-[#e2e8f0] font-mono text-sm outline-none placeholder:text-[#475569]"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="text-[#38bdf8] text-sm font-mono hover:text-[#7dd3fc] transition-colors"
        >
          Run
        </button>
      </form>
    </div>
  );
}

// ─── Tool Panel ─────────────────────────────────────────────────────────────
function ToolPanel({
  node,
  onSelectTool,
  selectedToolId,
}: {
  node: EnvironmentNode;
  onSelectTool: (toolId: string) => void;
  selectedToolId: string | null;
}) {
  const toolIcons: Record<string, string> = {
    gui: "🖥️",
    cli: "⌨️",
    web: "🌐",
    settings: "⚙️",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <NodeIcon type={node.type} size={24} />
        <div>
          <div className="font-semibold text-fg-primary text-sm">{node.name}</div>
          {node.ip && (
            <div className="text-fg-muted font-mono text-xs">{node.ip}</div>
          )}
        </div>
        <span
          className={clsx(
            "ml-auto text-xs px-2 py-0.5 rounded-full font-medium",
            node.status === "online" && "bg-success/10 text-success",
            node.status === "offline" && "bg-danger/10 text-danger",
            node.status === "warning" && "bg-warning/10 text-warning",
            !node.status && "bg-success/10 text-success"
          )}
        >
          {node.status || "online"}
        </span>
      </div>

      <div className="text-xs text-fg-muted mb-2 font-medium uppercase tracking-wider">
        Available Tools
      </div>

      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {node.tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all",
              selectedToolId === tool.id
                ? "bg-accent text-fg-inverted"
                : "bg-bg-muted text-fg-secondary hover:bg-bg-elevated hover:text-fg-primary"
            )}
          >
            <span className="text-base">{toolIcons[tool.type] || "📦"}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{tool.name}</div>
              <div className={clsx("text-[10px]", selectedToolId === tool.id ? "text-fg-inverted/70" : "text-fg-muted")}>
                {tool.path}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Simulated Tool Interfaces ───────────────────────────────────────────────

/** Simulated Server Manager interface */
function ServerManagerPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-fg-primary">Server Manager</h3>
          <p className="text-fg-muted text-xs">DC-01.warehouse.local</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      <div className="flex gap-2 mb-4">
        {["Dashboard", "Local Server", "AD DS", "DNS", "File Services"].map((item) => (
          <button
            key={item}
            className="px-3 py-1.5 text-xs rounded-lg bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        {[
          { name: "AD DS", status: "Running", color: "success" },
          { name: "DNS Server", status: "Running", color: "success" },
          { name: "DHCP Server", status: "Running", color: "success" },
          { name: "File Services", status: "Running", color: "success" },
        ].map((role) => (
          <div key={role.name} className="surface p-3 rounded-lg">
            <div className="font-medium text-sm text-fg-primary">{role.name}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className={clsx("w-1.5 h-1.5 rounded-full", `bg-${role.color}`)} />
              <span className="text-xs text-fg-muted">{role.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-bg-muted rounded-lg">
        <div className="text-xs font-mono text-fg-muted">
          <div>Computer: DC-01</div>
          <div>OS: Windows Server 2025</div>
          <div>Roles: AD DS, DNS, DHCP</div>
        </div>
      </div>
    </div>
  );
}

/** Simulated DNS Manager */
function DNSPanel({ onClose }: { onClose: () => void }) {
  const [activeZone, setActiveZone] = useState<"forward" | "reverse">("forward");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg-primary">DNS Manager</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      {/* Zone tabs */}
      <div className="flex gap-1 mb-3">
        {(["forward", "reverse"] as const).map((z) => (
          <button
            key={z}
            onClick={() => setActiveZone(z)}
            className={clsx(
              "px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize",
              activeZone === z ? "bg-accent text-fg-inverted" : "bg-bg-muted text-fg-secondary hover:text-fg-primary"
            )}
          >
            {z} Lookup Zones
          </button>
        ))}
      </div>

      {/* Zone tree */}
      <div className="flex-1 flex gap-3">
        <div className="w-48 surface rounded-lg p-2 overflow-y-auto">
          {activeZone === "forward" ? (
            <>
              <div className="font-semibold text-xs text-fg-muted px-2 py-1">Forward Lookup Zones</div>
              <div className="pl-3 space-y-0.5">
                <div className="text-xs font-medium text-fg-primary bg-bg-muted rounded px-2 py-1">📁 warehouse.local</div>
                <div className="pl-4 space-y-0.5 text-[11px] text-fg-muted">
                  <div className="hover:text-fg-primary cursor-pointer">A — dc-01 (10.0.0.10)</div>
                  <div className="hover:text-fg-primary cursor-pointer">A — fs-01 (10.0.0.11)</div>
                  <div className="hover:text-fg-primary cursor-pointer">A — app (10.0.0.100)</div>
                  <div className="hover:text-fg-primary cursor-pointer">CNAME — www.app → app</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold text-xs text-fg-muted px-2 py-1">Reverse Lookup Zones</div>
              <div className="pl-3 space-y-0.5">
                <div className="text-xs font-medium text-fg-primary bg-bg-muted rounded px-2 py-1">📁 0.0.10.in-addr.arpa</div>
                <div className="pl-4 space-y-0.5 text-[11px] text-fg-muted">
                  <div className="hover:text-fg-primary cursor-pointer">PTR — 100 → app.warehouse.local</div>
                  <div className="hover:text-fg-primary cursor-pointer">PTR — 10 → dc-01.warehouse.local</div>
                  <div className="hover:text-fg-primary cursor-pointer">PTR — 11 → fs-01.warehouse.local</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Record detail panel */}
        <div className="flex-1 surface rounded-lg p-3 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-2">Record Details</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">Name</span>
              <span className="text-fg-primary">app</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">Type</span>
              <span className="text-fg-primary">A Host</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">IP Address</span>
              <span className="text-success">10.0.0.100</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">TTL</span>
              <span className="text-fg-primary">3600 (1 hour)</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded text-xs text-warning">
            ⚠️ Stale record detected — 10.0.0.5 points to decommissioned server
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simulated DHCP console */
function DHCPPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg-primary">DHCP</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      <div className="space-y-2">
        {/* Scope card */}
        <div className="surface p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-fg-primary">IPv4 — Scope [10.0.0.0]</span>
            <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full font-medium">Active</span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-fg-muted">Start IP</span>
              <span className="text-fg-primary">10.0.0.100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">End IP</span>
              <span className="text-fg-primary">10.0.0.200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Subnet</span>
              <span className="text-fg-primary">255.255.255.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Lease Duration</span>
              <span className="text-warning">1 hour ⚠️</span>
            </div>
          </div>
        </div>

        {/* Scope statistics */}
        <div className="surface p-3 rounded-lg">
          <div className="text-xs font-semibold text-fg-muted mb-2">Scope Statistics</div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-fg-muted">Utilization</span>
                <span className="text-danger font-semibold">100% ⚠️</span>
              </div>
              <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-danger rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-fg-muted">In Use</span>
              <span className="text-danger">101 / 101</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-fg-muted">Free</span>
              <span className="text-fg-primary">0</span>
            </div>
          </div>
        </div>

        {/* Scope options */}
        <div className="surface p-3 rounded-lg">
          <div className="text-xs font-semibold text-fg-muted mb-2">Scope Options</div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-fg-muted">003 Router</span>
              <span className="text-fg-primary">10.0.0.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">006 DNS Servers</span>
              <span className="text-fg-primary">10.0.0.10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">015 Domain Name</span>
              <span className="text-fg-primary">warehouse.local</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simulated ADUC */
function ADUCPanel({ onClose }: { onClose: () => void }) {
  const [selectedOU, setSelectedOU] = useState("Operations");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg-primary">Active Directory Users and Computers</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      <div className="flex gap-3 flex-1">
        {/* Tree */}
        <div className="w-48 surface rounded-lg p-2 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-1 px-1">warehouse.local</div>
          {["Operations", "IT", "Management", "Devices", "Servers"].map((ou) => (
            <div key={ou}>
              <button
                onClick={() => setSelectedOU(ou)}
                className={clsx(
                  "w-full text-left text-xs px-2 py-1 rounded flex items-center gap-1",
                  selectedOU === ou ? "bg-accent/10 text-accent font-medium" : "text-fg-secondary hover:text-fg-primary"
                )}
              >
                <span>{selectedOU === ou ? "📂" : "📁"}</span> {ou}
              </button>
              {selectedOU === ou && ou === "Operations" && (
                <div className="pl-4 space-y-0.5 mt-0.5">
                  {["Bay1", "Bay2", "Bay3", "Bay4"].map((b) => (
                    <div key={b} className="text-[11px] text-fg-muted px-2 py-0.5 hover:text-fg-primary cursor-pointer">
                      📁 {b}
                    </div>
                  ))}
                </div>
              )}
              {selectedOU === ou && ou === "IT" && (
                <div className="pl-4 space-y-0.5 mt-0.5">
                  {["IT-Admins", "HelpDesk", "IT-ReadOnly"].map((g) => (
                    <div key={g} className="text-[11px] text-fg-muted px-2 py-0.5 hover:text-fg-primary cursor-pointer">
                      👥 {g}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="flex-1 surface rounded-lg p-3 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-2">{selectedOU} OU</div>
          {selectedOU === "Operations" && (
            <div className="space-y-1">
              {[
                { type: "user", name: "jsmith (John Smith)", status: "enabled" },
                { type: "user", name: "jdoe (Jane Doe)", status: "enabled" },
                { type: "user", name: "bchen (Bob Chen)", status: "enabled" },
                { type: "group", name: "GG_Ops_BayWorkers", status: "security" },
                { type: "group", name: "GG_Ops_Managers", status: "security" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs p-2 rounded hover:bg-bg-muted">
                  <span>{item.type === "user" ? "👤" : "👥"}</span>
                  <span className="text-fg-primary flex-1">{item.name}</span>
                  <span className={clsx(
                    "text-[10px] px-1.5 py-0.5 rounded",
                    item.status === "enabled" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          {selectedOU === "IT" && (
            <div className="space-y-1">
              {[
                { type: "user", name: "itadmin1", status: "enabled" },
                { type: "user", name: "svc_filesync (Service Account)", status: "enabled" },
                { type: "group", name: "GG_IT_Admins", status: "security" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs p-2 rounded hover:bg-bg-muted">
                  <span>{item.type === "user" ? "👤" : "👥"}</span>
                  <span className="text-fg-primary flex-1">{item.name}</span>
                  <span className={clsx(
                    "text-[10px] px-1.5 py-0.5 rounded",
                    item.status === "enabled" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Simulated Cisco Switch CLI */
function CiscoCLIPanel({ onClose, pendingCommand }: { onClose: () => void; pendingCommand?: string | null }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<{ text: string; color: string }[]>([
    { text: "Switch#", color: "text-[#38bdf8]" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-fill pending command from task step
  useEffect(() => {
    if (pendingCommand) {
      setInput(pendingCommand);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [pendingCommand]);

  const commands: Record<string, string[]> = {
    "show vlan brief": [
      "VLAN Name                             Status    Ports",
      "---- -------------------------------- --------- -------------------------------",
      "1    default                          active    Gi0/1, Gi0/2, Gi0/3",
      "10   Operations                       active",
      "20   IT                              active",
      "30   Server                          active",
    ],
    "show interfaces trunk": [
      "Port        Mode             Encapsulation  Status      Native vlan",
      "Gi0/1       on               802.1q         trunking    1",
      "Gi0/24      on               802.1q         trunking    1",
    ],
    "show running-config interface GigabitEthernet0/2": [
      "interface GigabitEthernet0/2",
      " switchport mode access",
      " switchport access vlan 1",
      "!",
    ],
    "ping 10.0.0.10": [
      "Type escape sequence to abort.",
      "Sending 5, 100-byte ICMP Echos to 10.0.0.10, timeout is 2 seconds:",
      "!!!!!",
      "Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms",
    ],
    "enable": ["Switch#"],
    "configure terminal": ["Switch(config)#"],
    "vlan 10": ["Switch(config-vlan)#"],
    "name Operations": ["Switch(config-vlan)#"],
    "exit": ["Switch(config)#"],
    "interface GigabitEthernet0/1": ["Switch(config-if)#"],
    "switchport mode trunk": ["Switch(config-if)#"],
    "switchport trunk allowed vlan 10,20": ["Switch(config-if)#"],
    "end": ["Switch#"],
    "copy run start": [
      "Destination filename [startup-config]? ",
      "Building configuration...",
      "[OK]",
    ],
    "show ip route": [
      "Codes: C - connected, S - static, I - IGRP, M - mobile, B - BGP",
      "     D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area",
      "     N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2",
      "     E1 - OSPF external type 1, E2 - OSPF external type 2, * - candidate default",
      "Gateway of last resort is not set",
      "     10.0.0.0/24 is subnetted, 2 subnets",
      "C       10.0.10.0 is directly connected, Vlan10",
      "C       10.0.20.0 is directly connected, Vlan20",
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setLines((prev) => [...prev, { text: `Switch# ${cmd}`, color: "text-[#e2e8f0]" }]);

    const lower = cmd.toLowerCase().trim();

    // Exact match — return known output
    if (commands[lower]) {
      commands[lower].forEach((line) => {
        setLines((prev) => [...prev, { text: line, color: "text-[#a7f3d0]" }]);
      });
    }
    // Partial prefix: suggest full commands from known keys
    else if (
      lower.startsWith("show") ||
      lower.startsWith("ping") ||
      lower.startsWith("copy") ||
      lower.startsWith("enable") ||
      lower.startsWith("configure") ||
      lower.startsWith("vlan") ||
      lower.startsWith("interface") ||
      lower.startsWith("switchport") ||
      lower.startsWith("exit") ||
      lower === "end"
    ) {
      // Find commands that start with the same prefix
      const matches = Object.keys(commands).filter((k) => k.startsWith(lower));
      if (matches.length === 1) {
        setLines((prev) => [
          ...prev,
          { text: `% Incomplete command. Did you mean '${matches[0]}'?`, color: "text-[#fca5a5]" },
        ]);
      } else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          { text: `% Ambiguous command: '${cmd}'. Did you mean one of:`, color: "text-[#fca5a5]" },
          ...matches.map((m) => ({ text: `  ${m}`, color: "text-[#a7f3d0]" })),
        ]);
      } else {
        // Known prefix but no matching command — show what we know for this prefix
        const prefix = lower.split(" ")[0]; // e.g. "show"
        const available = Object.keys(commands).filter((k) => k.startsWith(prefix + " "));
        setLines((prev) => [
          ...prev,
          { text: `% Incomplete command. Available '${prefix}' subcommands:`, color: "text-[#fca5a5]" },
          ...available.map((m) => ({ text: `  ${m}`, color: "text-[#a7f3d0]" })),
        ]);
      }
    }
    // Help shortcut
    else if (lower === "?" || lower === "help") {
      setLines((prev) => [
        ...prev,
        { text: "Available commands:", color: "text-[#e2e8f0]" },
        ...Object.keys(commands).map((c) => ({ text: `  ${c}`, color: "text-[#a7f3d0]" })),
      ]);
    }
    // Completely unknown
    else {
      setLines((prev) => [
        ...prev,
        { text: `% Unknown command: '${cmd}'`, color: "text-[#fca5a5]" },
        { text: "  Type '?' to see available commands", color: "text-[#94a3b8]" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-fg-primary">Cisco IOS</h3>
          <p className="text-fg-muted text-xs">Switch — warehouse-core-01</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      <div
        className="flex-1 bg-[#0f172a] rounded-lg p-3 overflow-y-auto border border-[#1e293b] font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className={line.color}>{line.text}</div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-[#38bdf8] mr-2">Switch#</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-[#e2e8f0] outline-none font-mono text-sm"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>

      <div className="mt-2 text-xs text-fg-muted">
        Commands: <code className="bg-bg-muted px-1 rounded">show vlan brief</code>,{" "}
        <code className="bg-bg-muted px-1 rounded">show interfaces trunk</code>,{" "}
        <code className="bg-bg-muted px-1 rounded">ping</code>,{" "}
        <code className="bg-bg-muted px-1 rounded">configure terminal</code>
      </div>
    </div>
  );
}

/** Simulated Group Policy Management */
function GPOPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg-primary">Group Policy Management</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <div className="flex gap-3 flex-1">
        <div className="w-48 surface rounded-lg p-2 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-1">Forest: warehouse.local</div>
          <div className="text-xs text-fg-muted px-1">Domains</div>
          <div className="pl-2 space-y-0.5">
            <div className="text-xs font-medium text-fg-primary bg-bg-muted rounded px-2 py-1">📁 warehouse.local</div>
            <div className="pl-3 space-y-0.5 text-[11px] text-fg-muted">
              <div className="hover:text-fg-primary cursor-pointer">📁 Default Domain Policy</div>
              <div className="hover:text-fg-primary cursor-pointer">📁 Password-Policy</div>
              <div className="hover:text-fg-primary cursor-pointer">📁 Map-OpsDrive</div>
            </div>
          </div>
        </div>
        <div className="flex-1 surface rounded-lg p-3 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-2">Password-Policy — Linked to: warehouse.local</div>
          <div className="space-y-2 text-xs">
            {[
              { name: "Minimum password length", value: "12 characters" },
              { name: "Password must meet complexity requirements", value: "Enabled" },
              { name: "Maximum password age", value: "90 days" },
              { name: "Minimum password age", value: "1 day" },
              { name: "Enforce password history", value: "24 passwords remembered" },
            ].map((setting) => (
              <div key={setting.name} className="flex justify-between p-2 bg-bg-muted rounded">
                <span className="text-fg-muted">{setting.name}</span>
                <span className="text-success font-medium">{setting.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simulated Print Management */
function PrintPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg-primary">Print Management</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <div className="flex gap-3 flex-1">
        <div className="w-48 surface rounded-lg p-2 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-1">Print Server: FS-01</div>
          <div className="text-xs text-fg-muted px-1 mb-1">Printers</div>
          <div className="space-y-0.5">
            {[
              { name: "Warehouse-Printer-01", status: "ready" },
              { name: "Warehouse-Printer-02", status: "offline" },
              { name: "Shipping-Label-Printer", status: "ready" },
            ].map((printer) => (
              <div key={printer.name} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded hover:bg-bg-muted cursor-pointer">
                <span className={clsx("w-1.5 h-1.5 rounded-full flex-shrink-0",
                  printer.status === "ready" ? "bg-success" : "bg-danger"
                )} />
                <span className="text-fg-secondary truncate">{printer.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 surface rounded-lg p-3 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-2">Printer: Warehouse-Printer-01</div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">Status</span>
              <span className="text-success">Ready</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">Port</span>
              <span className="text-warning">10.0.0.50 ⚠️ (old IP)</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">Shared</span>
              <span className="text-fg-primary">Yes</span>
            </div>
            <div className="flex justify-between p-2 bg-bg-muted rounded">
              <span className="text-fg-muted">Share Name</span>
              <span className="text-fg-primary">Warehouse-Printer-01</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-danger/10 border border-danger/20 rounded text-xs text-danger">
            ⚠️ Port IP 10.0.0.50 — printer was moved but port not updated
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simulated DFS Management */
function DFSPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg-primary">DFS Management</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <div className="flex gap-3 flex-1">
        <div className="w-48 surface rounded-lg p-2 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-1">Namespaces</div>
          <div className="space-y-0.5">
            <div className="text-xs font-medium text-fg-primary bg-bg-muted rounded px-2 py-1">📁 \\\\warehouse.local\\Operations</div>
            <div className="pl-4 space-y-0.5 text-[11px] text-fg-muted">
              <div className="hover:text-fg-primary cursor-pointer">📁 OperationsDocs</div>
            </div>
          </div>
          <div className="text-xs font-semibold text-fg-muted mb-1 mt-3">Replication</div>
          <div className="space-y-0.5">
            <div className="text-xs text-fg-secondary px-2 py-1">📁 Warehouse-FileRep</div>
          </div>
        </div>
        <div className="flex-1 surface rounded-lg p-3 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-2">Namespace: \\\\warehouse.local\\Operations</div>
          <div className="space-y-2">
            {[
              { name: "FS-01 (primary)", status: "online", path: "\\\\FS-01\\Operations" },
              { name: "FS-02 (replica)", status: "offline", path: "\\\\FS-02\\Operations" },
            ].map((target) => (
              <div key={target.name} className={clsx(
                "p-3 rounded-lg border",
                target.status === "online" ? "border-success/20 bg-success/5" : "border-danger/20 bg-danger/5"
              )}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-fg-primary">{target.name}</span>
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    target.status === "online" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  )}>
                    {target.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-fg-muted">{target.path}</div>
                {target.status === "offline" && (
                  <div className="mt-2 text-xs text-danger">
                    ⚠️ The network path was not found
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simulated File Explorer */
function FileExplorerPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-fg-primary">File Explorer</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <div className="flex gap-3 flex-1">
        <div className="w-40 surface rounded-lg p-2 overflow-y-auto">
          <div className="text-xs font-semibold text-fg-muted mb-1">Quick Access</div>
          <div className="space-y-0.5">
            {["Desktop", "Documents", "Downloads", "This PC"].map((item) => (
              <div key={item} className="text-xs text-fg-secondary px-2 py-1 rounded hover:bg-bg-muted cursor-pointer">
                📁 {item}
              </div>
            ))}
          </div>
          <div className="text-xs font-semibold text-fg-muted mb-1 mt-3">Network</div>
          <div className="space-y-0.5">
            {[
              "\\\\warehouse.local",
              "\\\\fs-01",
              "\\\\dc-01",
            ].map((item) => (
              <div key={item} className="text-xs text-fg-secondary px-2 py-1 rounded hover:bg-bg-muted cursor-pointer">
                🌐 {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 surface rounded-lg p-3 overflow-y-auto">
          <div className="text-xs font-mono text-fg-muted mb-3">\\\\warehouse.local\\Operations</div>
          <div className="space-y-0.5">
            {[
              { name: "Operations_Bay1", type: "folder" },
              { name: "Operations_Bay2", type: "folder" },
              { name: "Policy_Documents", type: "folder" },
              { name: "Shared_Reports.xlsx", type: "file" },
              { name: "Warehouse_Map.pdf", type: "file" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs p-2 rounded hover:bg-bg-muted cursor-pointer">
                <span>{item.type === "folder" ? "📁" : "📄"}</span>
                <span className="text-fg-primary">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simulated PowerShell with command simulation */
function PowerShellPanel({ onClose, pendingCommand }: { onClose: () => void; pendingCommand?: string | null }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<{ text: string; color: string }[]>([
    { text: "Windows PowerShell", color: "text-[#38bdf8]" },
    { text: "Copyright (C) Microsoft Corporation. All rights reserved.", color: "text-[#475569]" },
    { text: "", color: "" },
    { text: "Install the latest PowerShell for new features and improvements!", color: "text-[#475569]" },
    { text: "", color: "" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-fill pending command from task step
  useEffect(() => {
    if (pendingCommand) {
      setInput(pendingCommand);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [pendingCommand]);

  const commands: Record<string, { output: string[]; type?: "error" }[]> = {
    "ping 10.0.0.45": [{
      output: [
        "Pinging 10.0.0.45 with 32 bytes of data:",
        "Request timed out.",
        "Request timed out.",
        "Request timed out.",
        "Request timed out.",
        "",
        "Ping statistics for 10.0.0.45:",
        "    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),",
      ]
    }],
    "ping 10.0.0.103": [{
      output: [
        "Pinging 10.0.0.103 with 32 bytes of data:",
        "Reply from 10.0.0.103: bytes=32 time<1ms TTL=128",
        "Reply from 10.0.0.103: bytes=32 time<1ms TTL=128",
        "Reply from 10.0.0.103: bytes=32 time<1ms TTL=128",
        "Reply from 10.0.0.103: bytes=32 time<1ms TTL=128",
        "",
        "Ping statistics for 10.0.0.103:",
        "    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),",
        "Approximate round trip times in milli-seconds:",
        "    Minimum = 0ms, Maximum = 0ms, Average = 0ms",
      ]
    }],
    "nslookup warehouse.local": [{
      output: [
        "Server:  dc-01.warehouse.local",
        "Address:  10.0.0.10",
        "",
        "Name:    warehouse.local",
        "Address:  10.0.0.10",
      ]
    }],
    "Get-Printer": [{
      output: [
        "Name                           PrinterStatus  ComputerName    PortName",
        "----                           -------------  ------------   ---------",
        "Warehouse-Printer-01           Ready          FS-01          IP_10.0.0.50",
        "Warehouse-Printer-02          Offline        FS-01          IP_10.0.0.51",
      ]
    }],
    "Get-PrinterPort": [{
      output: [
        "Name                           PSComputerName",
        "----                           --------------",
        "IP_10.0.0.50                  FS-01",
        "IP_10.0.0.51                  FS-01",
      ]
    }],
    "Get-DfsnFolderTarget": [{
      output: [
        "Namespace Path                 Path                                  State",
        "---------------               ----                                  -----",
        "\\\\warehouse.local\\Operations    \\\\FS-01\\Operations                   Online",
        "\\\\warehouse.local\\Operations    \\\\FS-02\\Operations                   Offline",
      ]
    }],
    "Get-DhcpServerv4ScopeStatistics": [{
      output: [
        "ScopeId           PercentageInUse  Free            InUse           Pending          Supernetted",
        "-------           ---------------  -----           -----           -------          -----------",
        "10.0.0.0                     100  0              101             0                False",
      ]
    }],
    "Get-ADUser": [{
      output: [
        "DistinguishedName : CN=jsmith,OU=Bay1,OU=Operations,DC=warehouse,DC=local",
        "Enabled           : True",
        "GivenName         : John",
        "Name              : jsmith",
        "ObjectClass       : user",
        "SamAccountName    : jsmith",
        "SID               : S-1-5-21-xxx-xxx-xxx-xxx",
        "Surname           : Smith",
        "UserPrincipalName : jsmith@warehouse.local",
      ]
    }],
    "Get-ADGroupMember GG_Ops_Managers": [{
      output: [
        "distinguishedName : CN=Ops Manager,OU=Bay1,OU=Operations,DC=warehouse,DC=local",
        "Name             : Ops Manager",
        "objectClass      : user",
        "SamAccountName   : opsmanager",
        "SID              : S-1-5-21-xxx-xxx-xxx-xxx",
      ]
    }],
    "Get-DnsServerResourceRecord -ZoneName warehouse.local -Name app": [{
      output: [
        "ZoneName         HostName  RecordType  Type  Timestamp  TimeToLive      RecordData",
        "--------         --------  ----------  ----  ---------  ----------      ----------",
        "warehouse.local app       A           1     0          01:00:00        10.0.0.100",
        "warehouse.local app       A           1     0          01:00:00        10.0.0.5",
      ]
    }],
    "Resolve-DnsName app.warehouse.local": [{
      output: [
        "Name                           Type   TTL   Section    IPAddress",
        "----                           ----   ---   -------    ---------",
        "app.warehouse.local            A      3600  Answer    10.0.0.100",
        "app.warehouse.local            A      3600  Answer    10.0.0.5",
      ]
    }],
    "nslookup app.warehouse.local": [{
      output: [
        "Server:  dc-01.warehouse.local",
        "Address:  10.0.0.10",
        "",
        "Name:    app.warehouse.local",
        "Addresses:  10.0.0.100",
        "          10.0.0.5",
      ]
    }],
    "nslookup 10.0.0.5": [{
      output: [
        "Server:  dc-01.warehouse.local",
        "Address:  10.0.0.10",
        "*** dc-01.warehouse.local can't find 10.0.0.5: Non-existent domain",
      ]
    }],
    "ipconfig /all": [{
      output: [
        "Windows IP Configuration",
        "",
        "   Host Name . . . . . . . . . : WS-01",
        "   Primary Dns Suffix . . . . . : warehouse.local",
        "   DNS Servers . . . . . . . . : 8.8.8.8",
      ]
    }],
    "ipconfig /release": [{
      output: ["Windows IP Configuration\n\nEthernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : warehouse.local\n   IPv4 Address. . . . . . . . . . : (null)"]
    }],
    "ipconfig /renew": [{
      output: ["Ethernet adapter Ethernet:\n\n   Connection-specific DNS Suffix  . : warehouse.local\n   IPv4 Address. . . . . . . . . . : 169.254.32.18\n   Subnet Mask . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . : "]
    }],
    "ping 10.0.0.5": [{
      output: [
        "Pinging 10.0.0.5 with 32 bytes of data:",
        "Request timed out.",
        "Request timed out.",
        "Request timed out.",
        "Request timed out.",
        "",
        "Ping statistics for 10.0.0.5:",
        "    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),",
      ]
    }],
    "gpresult /r": [{
      output: [
        "Microsoft (R) Windows (R) Group Policy Result Tool",
        "",
        "RSOP output for warehouse.local\\jsmith on WS-01 : Logging Mode",
        "",
        "OS Type: Microsoft Windows 11 Enterprise",
        "",
        "The following GPOs were successfully applied:",
        "        Password-Policy",
        "        Map-OpsDrive",
      ]
    }],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setLines((prev) => [...prev, { text: `PS C:\\> ${cmd}`, color: "text-[#38bdf8]" }]);

    const lower = cmd.toLowerCase();
    if (commands[lower]) {
      commands[lower].forEach(({ output, type }) => {
        output.forEach((line) => {
          setLines((prev) => [...prev, {
            text: line,
            color: type === "error" ? "text-[#fca5a5]" : "text-[#a7f3d0]"
          }]);
        });
      });
    } else if (lower === "cls" || lower === "clear") {
      setLines([{ text: "Windows PowerShell", color: "text-[#38bdf8]" }]);
    } else if (lower === "help" || lower === "?") {
      ["Get-Printer", "Get-PrinterPort", "Get-DfsnFolderTarget", "Get-DhcpServerv4ScopeStatistics",
        "Get-ADUser", "Get-DnsServerResourceRecord", "nslookup", "ipconfig /all",
        "ping", "gpresult /r"
      ].forEach((c) => {
        setLines((prev) => [...prev, { text: `  ${c}`, color: "text-[#a7f3d0]" }]);
      });
    } else {
      setLines((prev) => [
        ...prev,
        { text: `${cmd} : The term '${cmd.split(" ")[0]}' is not recognized as the name of a cmdlet.`, color: "text-[#fca5a5]" },
        { text: "Type 'help' for available commands.", color: "text-[#475569]" },
      ]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-fg-primary">PowerShell</h3>
          <p className="text-fg-muted text-xs">Administrator: Windows PowerShell</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>

      <div
        className="flex-1 bg-[#0f172a] rounded-lg p-3 overflow-y-auto border border-[#1e293b] font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className={clsx(line.color, "whitespace-pre-wrap")}>{line.text}</div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-[#38bdf8] mr-2">PS C:\&gt;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-[#e2e8f0] outline-none font-mono text-sm"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>

      <div className="mt-2 text-xs text-fg-muted">
        Commands: <code className="bg-bg-muted px-1 rounded">Get-Printer</code>,{" "}
        <code className="bg-bg-muted px-1 rounded">nslookup</code>,{" "}
        <code className="bg-bg-muted px-1 rounded">ipconfig /all</code>,{" "}
        <code className="bg-bg-muted px-1 rounded">ping</code>,{" "}
        <code className="bg-bg-muted px-1 rounded">help</code>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function LabEnvironment({
  environment,
  onNodeSelect,
  pendingNodeId,
  pendingToolId,
  pendingCommand,
  onCommandConsumed,
}: {
  environment: LabEnvironmentType;
  onNodeSelect?: (nodeId: string, toolId: string) => void;
  pendingNodeId?: string | null;
  pendingToolId?: string | null;
  pendingCommand?: string | null;
  onCommandConsumed?: () => void;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);

  // When parent pushes a new node/tool selection (from task step click)
  useEffect(() => {
    if (pendingNodeId) {
      setSelectedNodeId(pendingNodeId);
      if (pendingToolId) {
        setSelectedToolId(pendingToolId);
      } else {
        setSelectedToolId(null);
      }
    }
  }, [pendingNodeId, pendingToolId]);

  const selectedNode = environment.nodes.find((n) => n.id === selectedNodeId);
  const selectedTool = selectedNode?.tools.find((t) => t.id === selectedToolId);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedToolId(null);
    onNodeSelect?.(nodeId, "");
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    const node = environment.nodes.find((n) => n.id === selectedNodeId);
    const tool = node?.tools.find((t) => t.id === toolId);
    onNodeSelect?.(selectedNodeId || "", toolId);
  };

  const handleCommand = useCallback((cmd: string) => {
    setTerminalHistory((prev) => [
      ...prev,
      { id: crypto.randomUUID(), command: cmd, output: "", type: "input", timestamp: new Date().toISOString() },
    ]);
    // Simulate basic output
    const lower = cmd.toLowerCase();
    if (lower.includes("ping")) {
      setTimeout(() => {
        setTerminalHistory((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            command: "",
            output: "Reply from 10.0.0.10: bytes=32 time<1ms TTL=128",
            type: "output",
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 300);
    }
  }, []);

  const handleClearTerminal = () => setTerminalHistory([]);

  const renderToolPanel = () => {
    if (!selectedNode) return null;
    return (
      <div className="surface p-4 rounded-xl">
        <ToolPanel
          node={selectedNode}
          onSelectTool={handleToolSelect}
          selectedToolId={selectedToolId}
        />
      </div>
    );
  };

  const renderToolInterface = () => {
    if (!selectedTool) return null;

    switch (selectedTool.id) {
      case "server-manager":
      case "sm":
        return <ServerManagerPanel onClose={() => setSelectedToolId(null)} />;
      case "dns-manager":
      case "dns":
        return <DNSPanel onClose={() => setSelectedToolId(null)} />;
      case "dhcp":
        return <DHCPPanel onClose={() => setSelectedToolId(null)} />;
      case "aduc":
      case "ad-users":
        return <ADUCPanel onClose={() => setSelectedToolId(null)} />;
      case "gpm":
      case "group-policy":
        return <GPOPanel onClose={() => setSelectedToolId(null)} />;
      case "print-management":
      case "print":
        return <PrintPanel onClose={() => setSelectedToolId(null)} />;
      case "dfs-management":
      case "dfs":
        return <DFSPanel onClose={() => setSelectedToolId(null)} />;
      case "file-explorer":
      case "explorer":
        return <FileExplorerPanel onClose={() => setSelectedToolId(null)} />;
      case "powershell":
      case "ps":
      case "cmd":
      case "terminal":
        return <PowerShellPanel onClose={() => setSelectedToolId(null)} pendingCommand={pendingCommand} />;
      case "cisco-cli":
      case "ios":
        return <CiscoCLIPanel onClose={() => setSelectedToolId(null)} pendingCommand={pendingCommand} />;
      default:
        return (
          <div className="surface p-4 rounded-xl flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-3xl mb-2">🖥️</div>
              <div className="font-semibold text-fg-primary">{selectedTool.name}</div>
              <div className="text-fg-muted text-sm mt-1">{selectedTool.path}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Environment header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-fg-primary text-sm">
            {environment.title || "Lab Environment"}
          </h2>
          <p className="text-fg-muted text-xs">
            Click a system to access its tools
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-fg-muted">
            <span className="w-2 h-2 rounded-full bg-success" />
            Online
            <span className="w-2 h-2 rounded-full bg-danger ml-2" />
            Offline
            <span className="w-2 h-2 rounded-full bg-warning ml-2" />
            Warning
          </div>
        </div>
      </div>

      {/* Main layout: environment + side panels */}
      <div className="flex gap-4 flex-col lg:flex-row flex-1 min-h-0">
        {/* 3D Environment View */}
        <div
          className="relative flex-1 surface rounded-2xl overflow-hidden cursor-crosshair"
          style={{ minHeight: "480px", perspective: "1000px" }}
        >
          <EnvironmentBackground theme={environment.theme} />

          {/* 3D floor plane */}
          <div
            className="absolute inset-0"
            style={{
              transform: "rotateX(45deg)",
              transformOrigin: "center 120%",
              opacity: 0.15,
            }}
          />

          {/* Header bar — room label + title on separate sides, pushed down */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 pointer-events-none z-10">
            <div className="text-[11px] font-semibold text-fg-muted uppercase tracking-wider pointer-events-auto bg-bg-surface/80 backdrop-blur-sm px-2.5 py-1 rounded">
              {environment.theme === "server_room" && "🗄️ Server Room"}
              {environment.theme === "it_closet" && "🗄️ IT Closet"}
              {environment.theme === "office" && "🏢 Office Floor"}
              {environment.theme === "mixed" && "🏢 Mixed Environment"}
            </div>
            {environment.title && (
              <div className="text-[11px] font-semibold text-accent bg-accent/15 backdrop-blur-sm px-2.5 py-1 rounded-full max-w-[60%] truncate pointer-events-auto border border-accent/20">
                {environment.title}
              </div>
            )}
          </div>

          {/* Nodes */}
          {environment.nodes.map((node) => (
            <Node3D
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onClick={() => handleNodeClick(node.id)}
            />
          ))}

          {/* Connection lines (decorative) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
            {environment.nodes.map((node, i) => {
              if (i === 0) return null;
              const prev = environment.nodes[i - 1];
              return (
                <line
                  key={`line-${node.id}`}
                  x1={`${prev.position.x}%`}
                  y1={`${prev.position.y}%`}
                  x2={`${node.position.x}%`}
                  y2={`${node.position.y}%`}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  className="text-accent"
                />
              );
            })}
          </svg>
        </div>

        {/* Right sidebar: tools + terminal */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          {/* Tool panel */}
          {selectedNode ? (
            <div className="flex-1 min-h-0 overflow-y-auto">
              {renderToolPanel()}
            </div>
          ) : (
            <div className="surface p-4 rounded-xl flex-1 flex items-center justify-center">
              <div className="text-center text-fg-muted">
                <div className="text-3xl mb-2">👈</div>
                <p className="text-sm">Click a system above<br />to see available tools</p>
              </div>
            </div>
          )}

          {/* Quick terminal */}
          <div className="h-56 flex-shrink-0">
            <Terminal
              onCommand={handleCommand}
              history={terminalHistory}
              onClear={handleClearTerminal}
            />
          </div>
        </div>
      </div>

      {/* Tool interface overlay */}
      {selectedTool && (
        <div className="surface rounded-xl p-4 animate-slide-in">
          {renderToolInterface()}
        </div>
      )}
    </div>
  );
}
