import type { Lab } from "@/types";

export const lab15: Lab = {
  id: "lab15",
  number: 15,
  title: "Network Service Outage & Root Cause Analysis",
  category: "operations",
  difficulty: "advanced",
  estimatedMinutes: 90,
  objectives: [
    "Apply the 5-Whys technique",
    "Differentiate symptoms, root cause, and contributing factors",
    "Write a professional RCA document",
    "Define corrective and preventive actions",
  ],
  prerequisites: ["Lab 14 — High-Availability Operations Incident"],
  scenario:
    "A network service has been recurring — every 2-3 weeks, scanners drop offline for 5-10 minutes. You must find the root cause and propose permanent prevention.",
  environment: [
    "Network monitoring (or simulated)",
    "Switch logs",
    "DHCP/DNS logs",
    "Recent change records",
  ],
  interactiveEnvironment: {
    theme: "mixed",
    title: "Operations Floor",
    nodes: [
      {
        id: "dc-01",
        name: "DC-01",
        type: "server",
        position: { x: 18, y: 35  },
        layer: 2,
        status: "online",
        ip: "10.0.0.10",
        room: "Server Room",
        tools: [
          {
            id: "server-manager",
            name: "Server Manager",
            label: "Server Manager",
            path: "Server Manager → Dashboard",
            type: "gui" },


          {
            id: "aduc",
            name: "ADUC",
            label: "ADUC",
            path: "Server Manager → Tools → ADUC",
            type: "gui" },


          {
            id: "dns",
            name: "DNS",
            label: "DNS",
            path: "Server Manager → Tools → DNS",
            type: "gui" },


          {
            id: "dhcp",
            name: "DHCP",
            label: "DHCP",
            path: "Server Manager → Tools → DHCP",
            type: "gui" },


          {
            id: "gpo",
            name: "GPO",
            label: "GPO",
            path: "Server Manager → Tools → GPM",
            type: "gui" },


          {
            id: "powershell",
            name: "PowerShell",
            label: "PowerShell",
            path: "Start → PowerShell",
            type: "cli" },


        ],
      },
      {
        id: "fs-01",
        name: "FS-01",
        type: "server",
        position: { x: 48, y: 35  },
        layer: 2,
        status: "online",
        ip: "10.0.0.11",
        room: "Server Room",
        tools: [
          {
            id: "server-manager",
            name: "Server Manager",
            label: "Server Manager",
            path: "Server Manager → Dashboard",
            type: "gui" },


          {
            id: "dfs",
            name: "DFS",
            label: "DFS",
            path: "Server Manager → Tools → DFS",
            type: "gui" },


          {
            id: "print",
            name: "Print Mgmt",
            label: "Print",
            path: "Server Manager → Tools → Print",
            type: "gui" },


          {
            id: "file-explorer",
            name: "File Explorer",
            label: "Explorer",
            path: "\\fs-01\C$",
            type: "gui" },


          {
            id: "powershell",
            name: "PowerShell",
            label: "PowerShell",
            path: "Start → PowerShell",
            type: "cli" },


        ],
      },
      {
        id: "printer-01",
        name: "Bay-Printer-01",
        type: "printer",
        position: { x: 78, y: 35  },
        layer: 1,
        status: "online",
        ip: "10.0.0.50",
        room: "Bay 1",
        tools: [
          {
            id: "print",
            name: "Printer Web UI",
            label: "Web UI",
            path: "https://10.0.0.50",
            type: "web" },

        ],
      },
      {
        id: "ws-01",
        name: "WS-01",
        type: "workstation",
        position: { x: 33, y: 72  },
        layer: 1,
        status: "online",
        ip: "10.0.0.100",
        room: "Bay 1",
        tools: [
          {
            id: "powershell",
            name: "PowerShell",
            label: "PowerShell",
            path: "Start → PowerShell",
            type: "cli" },


          {
            id: "cmd",
            name: "CMD",
            label: "CMD",
            path: "Start → cmd",
            type: "cli" },


          {
            id: "file-explorer",
            name: "File Explorer",
            label: "Explorer",
            path: "Taskbar → File Explorer",
            type: "gui" },


        ],
      },
      {
        id: "ws-02",
        name: "WS-02",
        type: "workstation",
        position: { x: 63, y: 72  },
        layer: 1,
        status: "warning",
        ip: "10.0.0.101",
        room: "Bay 2",
        tools: [
          {
            id: "powershell",
            name: "PowerShell",
            label: "PowerShell",
            path: "Start → PowerShell",
            type: "cli" },


          {
            id: "file-explorer",
            name: "File Explorer",
            label: "Explorer",
            path: "Taskbar → File Explorer",
            type: "gui" },


        ],
      }
    ],
  },
  tasks: [{
      id: "t1",
      title: "Gather evidence",
      description: "Collect logs, change history, and incident timeline.",
      order: 1,
      steps: [
        { instruction: "Pull the monitoring history for the scanner subnet (VLAN 30) for the last 6 incidents", tool: "Monitoring dashboard", expectedResult: "6 outage events listed with timestamps" },

{ instruction: "Pull switch logs from the scanner switch: show log | include 2024 for outage timestamps", tool: "Cisco switch CLI", expectedResult: "Switch logs retrieved", nodeId: "ws-02", toolId: "powershell" },

{ instruction: "Pull DHCP logs: C:\\Windows\\System32\\dhcp\\DhcpSrvLog-* on the DHCP server", tool: "File Explorer on DHCP server", expectedResult: "DHCP event log entries visible", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Pull DNS logs: Event Viewer → Applications and Services Logs → DNS Server", tool: "Event Viewer on DC-01", expectedResult: "DNS log entries visible" },

{ instruction: "Check the change log: was anything changed on the switch or DHCP server around the outage dates?", tool: "Change management log", expectedResult: "Change history reviewed" },

{ instruction: "Compile all evidence into a timeline: date, time, duration, affected devices, logs", tool: "Evidence panel", expectedResult: "Evidence compilation complete" },

      ],
    },
{
      id: "t2",
      title: "Apply 5-Whys",
      description: "Iterate from symptom to root cause.",
      order: 2,
      steps: [
        { instruction: "Why 1: Why did the scanners go offline? → They lost their DHCP lease and couldn't renew", tool: "5-Whys analysis", expectedResult: "First why documented" },

{ instruction: "Why 2: Why did they lose their DHCP lease? → The DHCP scope ran out of addresses — no free IPs available", tool: "5-Whys analysis", expectedResult: "Second why documented" },

{ instruction: "Why 3: Why was the scope full? → Scanners lease IPs and hold them for the full lease duration (8 hours), and the scope is only 20 addresses for 30+ devices", tool: "5-Whys analysis", expectedResult: "Third why documented" },

{ instruction: "Why 4: Why was the scope sized for 20 when there are 30+ devices? → The scope was designed when the site had only 20 scanners; the new scanners were added without expanding the scope", tool: "5-Whys analysis", expectedResult: "Fourth why documented" },

{ instruction: "Why 5: Why was the scope not expanded when scanners were added? → No change management process for new device onboarding — IT was not notified of the new scanners", tool: "5-Whys analysis", expectedResult: "Root cause reached: no device onboarding process" },

{ instruction: "Document the full 5-Whys chain in the evidence panel", tool: "Evidence panel", expectedResult: "5-Whys documented" },

      ],
    },
{
      id: "t3",
      title: "Identify contributing factors",
      description: "What allowed the issue to occur?",
      order: 3,
      steps: [
        { instruction: "Factor 1: DHCP scope is undersized — designed for fewer devices than currently deployed", tool: "5-Whys analysis", expectedResult: "Contributing factor #1" },

{ instruction: "Factor 2: No monitoring alert when DHCP scope utilization exceeds 80%", tool: "Monitoring review", expectedResult: "Contributing factor #2" },

{ instruction: "Factor 3: No formal change management for new device onboarding — new scanners added without IT review", tool: "Change management review", expectedResult: "Contributing factor #3" },

{ instruction: "Factor 4: DHCP lease duration is too long for a dynamic device environment (scanners)", tool: "DHCP configuration review", expectedResult: "Contributing factor #4", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Document all contributing factors in the evidence panel", tool: "Evidence panel", expectedResult: "Contributing factors documented" },

      ],
    },
{
      id: "t4",
      title: "Write RCA",
      description: "Produce a clear RCA with corrective and preventive actions.",
      order: 4,
      steps: [
        { instruction: "Section 1 — Summary: 'Recurring scanner network outages caused by DHCP scope exhaustion due to undersized scope and new device onboarding without IT review'", tool: "RCA document", expectedResult: "Executive summary written" },

{ instruction: "Section 2 — Timeline: table of the 6 outage events with dates, duration, and impact", tool: "RCA document", expectedResult: "Timeline table complete" },

{ instruction: "Section 3 — Root Cause: No formal device onboarding process; DHCP scope undersized for current device count", tool: "RCA document", expectedResult: "Root cause section complete" },

{ instruction: "Section 4 — Corrective Actions (immediate): Expand DHCP scope to include all current and projected devices (50 addresses)", tool: "RCA document → Corrective Actions", expectedResult: "Corrective actions listed" },

{ instruction: "Section 5 — Preventive Actions: (1) Implement device onboarding SOP, (2) Add DHCP scope utilization monitoring alert at 80%, (3) Reduce lease duration for scanner VLAN to 4 hours", tool: "RCA document → Preventive Actions", expectedResult: "Preventive actions listed" },

{ instruction: "Save the RCA document to the evidence panel", tool: "Evidence panel", expectedResult: "RCA saved" },

      ],
    },
{
      id: "t5",
      title: "Present and defend",
      description: "Walk through the RCA as if presenting to a manager.",
      order: 5,
      steps: [
        { instruction: "Present the summary in plain language: what happened, who was affected, for how long", tool: "Presentation (verbal or slide)", expectedResult: "Summary delivered" },

{ instruction: "Present the 5-Whys chain: walk through each why clearly connecting to the next", tool: "Presentation", expectedResult: "5-Whys explained" },

{ instruction: "Present the corrective actions: what was done immediately to fix the outage", tool: "Presentation", expectedResult: "Corrective actions explained" },

{ instruction: "Present the preventive actions: what will prevent this from happening again — include owner and target date for each", tool: "Presentation", expectedResult: "Preventive actions with owners" },

{ instruction: "Be prepared to answer: 'Why didn't monitoring catch this?' — answer: monitoring wasn't configured for DHCP scope utilization alerts", tool: "Q&A preparation", expectedResult: "Defensible answers ready" },

{ instruction: "Document the presentation and any feedback received in the evidence panel", tool: "Evidence panel", expectedResult: "Presentation documented" },

      ],
    },
  ],
  incident: {
    id: "inc15",
    severity: "medium",
    symptoms: [
      "Scanners drop offline every 2-3 weeks",
      "Outage lasts 5-10 minutes then resolves",
      "DHCP scope at 100% during outage",
    ],
    affectedAssets: ["Scanner VLAN (VLAN 30)", "DHCP-01"],
    initialState: {
      "DHCP scope": "20 addresses, fully utilized",
      "Scanners": "30+ devices",
    },
    hiddenRootCause:
      "DHCP scope exhaustion: the scope (20 addresses) cannot accommodate all scanners (30+), and when leases expire and renew simultaneously, some scanners cannot get an IP, causing temporary offline status. The root systemic cause: no device onboarding process to size DHCP scopes appropriately.",
    allowedActions: [
      "Get-DhcpServerv4ScopeStatistics",
      "show log on switch",
      "review change management",
    ],
    forbiddenActions: ["delete all leases", "disable DHCP without escalation"],
    evidenceRevealedOnAction: {
      "Get-DhcpServerv4ScopeStatistics": [
        { id: "ev1", label: "Scope stats at time of outage", value: "InUse: 20/20, PercentageInUse: 100%", collectedAt: "" },
      ],
      "show log": [
        { id: "ev2", label: "Switch log", value: "Port flap events on scanner switch ports during outage windows", collectedAt: "" },
      ],
    },
    resolution:
      "Expand the DHCP scope. Implement device onboarding SOP. Add DHCP monitoring alert.",
    businessImpact:
      "Production halts when scanners are offline — warehouse operations slow or stop.",
  },
  hints: [
    { level: 1, text: "The scanners come back after 5-10 minutes. What expires and renews every few hours?" },
    { level: 2, text: "Check the DHCP scope utilization at the time of the outage — how many addresses are in use vs. available?" },
    { level: 3, text: "If the scope is always at 100%, there are more devices than addresses. Why were the extra devices added without expanding scope?" },
    { level: 4, text: "The 5-Whys should lead to a systemic cause — not just 'scope too small.'" },
    { level: 5, text: "Solution: fix the immediate problem (expand scope), then fix the systemic problem (device onboarding process)." },
  ],
  validation: [
    { id: "v1", description: "5-Whys complete", command: "Evidence panel", expectedResult: "All 5 whys documented with logical connections", points: 10 },
    { id: "v2", description: "RCA complete", command: "RCA document", expectedResult: "All 5 sections present", points: 10 },
    { id: "v3", description: "Preventive actions with owners", command: "RCA document", expectedResult: "Each action has owner and target date", points: 10 },
  ],
  rubric: [
    { criterion: "Evidence quality", description: "All relevant logs collected and analyzed", maxPoints: 15 },
    { criterion: "5-Whys", description: "Logical, connected chain leading to systemic root cause", maxPoints: 25 },
    { criterion: "Contributing factors", description: "All contributing factors identified", maxPoints: 15 },
    { criterion: "RCA quality", description: "Clear, factual, actionable RCA document", maxPoints: 25 },
    { criterion: "Preventive actions", description: "Specific, owned, dated preventive actions", maxPoints: 20 },
  ],
  requiredEvidence: ["5-Whys chain", "RCA document", "Monitoring evidence", "Corrective/Preventive action plan"],
  deliverables: ["RCA document", "5-Whys analysis", "Corrective action plan", "Preventive action plan"],
  interviewQuestion:
    "You're asked to write an RCA for a recurring outage. Walk me through the structure of a good RCA and how you determine the difference between a root cause and a symptom.",
};
