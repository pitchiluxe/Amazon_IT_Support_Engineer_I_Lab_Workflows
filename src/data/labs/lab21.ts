import type { Lab } from "@/types";

export const lab21: Lab = {
  id: "lab21",
  number: 21,
  title: "12-Hour Operations Shift Simulation",
  category: "operations",
  difficulty: "advanced",
  estimatedMinutes: 180,
  objectives: [
    "Manage multiple incidents under time pressure",
    "Prioritize by production impact",
    "Communicate status to stakeholders",
    "Document each incident end-to-end",
  ],
  prerequisites: ["Lab 14 — High-Availability Incident", "Lab 20 — SOP"],
  scenario:
    "Simulate a full operations IT shift. You will receive 10 incident injects across 12 hours of simulated time. You must triage, resolve, and document.",
  environment: [
    "Simulated ticket queue",
    "Monitoring dashboard",
    "Communication channel (slack-like)",
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
      title: "Triage injects",
      description: "Sort injects by severity and impact.",
      order: 1,
      steps: [
        { instruction: "Review all 10 incident injects (provided by the lab). For each: assign a severity (P1/P2/P3/P4) and impact (users affected, business function)", tool: "Incident inject list", expectedResult: "All 10 injects triaged" },

{ instruction: "Sort the injects by priority: P1s first (all users down), then P2s (department down), then P3s (single user), then P4s (minor/cosmetic)", tool: "Priority queue", expectedResult: "Injects sorted by priority" },

{ instruction: "Note the injection time for each — some arrive at the same time, requiring prioritization", tool: "Inject schedule", expectedResult: "Timing noted" },

{ instruction: "Document the triage decision and priority order in the evidence panel", tool: "Evidence panel", expectedResult: "Triage decisions saved" },

      ],
    },
{
      id: "t2",
      title: "Resolve each incident",
      description: "Work through each inject, documenting as you go.",
      order: 2,
      steps: [
        { instruction: "Work through the P1 injects first: follow the incident response process — define impact, check monitoring, identify layer, restore service, document", tool: "Incident response process", expectedResult: "P1 resolved and documented" },

{ instruction: "Work through P2 injects: same process, document each step in the incident log", tool: "Incident response process", expectedResult: "P2s resolved and documented" },

{ instruction: "Work through P3/P4 injects: apply the relevant SOPs (from Lab 20), document resolution", tool: "Lab 20 SOPs", expectedResult: "P3s/P4s resolved and documented" },

{ instruction: "For each inject: note the T0 (time reported), actions taken, resolution time, and root cause", tool: "Incident log", expectedResult: "All 10 incidents documented" },

{ instruction: "Track the clock — note when you started each inject and when you resolved it", tool: "Incident log", expectedResult: "Resolution times tracked" },

      ],
    },
{
      id: "t3",
      title: "Communicate",
      description: "Provide status updates at meaningful points.",
      order: 3,
      steps: [
        { instruction: "Draft a status update for the P1 incident: 'IT OUTAGE — [Service] unavailable. Impact: All [department]. Currently investigating. ETA for update: [time]'", tool: "Status update draft", expectedResult: "Initial status update written" },

{ instruction: "Draft an update at the 30-minute mark: 'IT OUTAGE — Root cause identified as [cause]. Fix in progress. ETA for resolution: [time]'", tool: "Status update draft", expectedResult: "Mid-incident update written" },

{ instruction: "Draft an all-clear update when the P1 is resolved: 'IT OUTAGE RESOLVED — [Service] restored at [time]. Root cause: [brief]. Duration: [X hours Y minutes]'", tool: "Status update draft", expectedResult: "All-clear update written" },

{ instruction: "Draft a shift summary email to the IT manager at the end of the shift: summary of all incidents, resolution times, any open items", tool: "Shift summary", expectedResult: "Shift summary written" },

{ instruction: "Save all communication drafts to the evidence panel", tool: "Evidence panel", expectedResult: "Communications saved" },

      ],
    },
{
      id: "t4",
      title: "Escalate appropriately",
      description: "Escalate when out of scope.",
      order: 4,
      steps: [
        { instruction: "For any inject requiring hardware replacement or vendor involvement: open a ticket with the vendor, note the ticket number in the incident log", tool: "Vendor ticket system", expectedResult: "Vendor tickets opened" },

{ instruction: "For any inject requiring infrastructure changes beyond your authority: escalate to the IT manager with a clear description and impact", tool: "Escalation email", expectedResult: "Management escalations sent" },

{ instruction: "For any inject that cannot be resolved within your shift window: hand over to the next shift with a clear handoff note", tool: "Handoff document", expectedResult: "Handoff notes written" },

{ instruction: "Document all escalations in the evidence panel", tool: "Evidence panel", expectedResult: "Escalations documented" },

      ],
    },
{
      id: "t5",
      title: "Close and document",
      description: "Close each incident with evidence and a summary.",
      order: 5,
      steps: [
        { instruction: "For each of the 10 injects: write a one-paragraph summary: what was the issue, what was the fix, what was the resolution time, was there an escalation?", tool: "Incident log", expectedResult: "All 10 summaries written" },

{ instruction: "Calculate shift KPIs: total incidents handled, P1s resolved, average resolution time, escalations", tool: "Incident log", expectedResult: "KPIs calculated" },

{ instruction: "Note any recurring incidents — were any of the 10 injects from the same root cause?", tool: "Incident analysis", expectedResult: "Recurring patterns identified" },

{ instruction: "Save the complete incident log to the evidence panel", tool: "Evidence panel", expectedResult: "Incident log saved" },

      ],
    },
{
      id: "t6",
      title: "End-of-shift summary",
      description: "Produce a summary for the next shift.",
      order: 6,
      steps: [
        { instruction: "Write the end-of-shift summary: number of incidents (P1/P2/P3/P4), key events, any ongoing issues, handoffs for next shift", tool: "Shift summary document", expectedResult: "Shift summary complete" },

{ instruction: "Identify any process improvements: were there steps that slowed you down? Any missing SOPs?", tool: "Shift retrospective", expectedResult: "Improvements noted" },

{ instruction: "Submit the end-of-shift summary as the final evidence item", tool: "Evidence panel", expectedResult: "Shift summary saved" },

      ],
    },
  ],
  incident: {
    id: "inc21",
    severity: "high",
    symptoms: [
      "Multiple simultaneous incidents",
      "P1 service outage + P2 printer issues + P3 user requests",
    ],
    affectedAssets: ["All systems"],
    initialState: {
      "Incidents": "10 injects queued",
      "Time": "Shift start",
    },
    hiddenRootCause:
      "Multiple independent incidents occurring simultaneously. Prioritization and communication are the key skills being tested.",
    allowedActions: [
      "all previous lab skills",
      "incident prioritization",
      "stakeholder communication",
    ],
    forbiddenActions: [
      "ignore P1 incidents",
      "fail to communicate status",
      "close incidents without resolution",
    ],
    evidenceRevealedOnAction: {
      "triage": [
        { id: "ev1", label: "Priority order", value: "3 P1s, 4 P2s, 2 P3s, 1 P4", collectedAt: "" },
      ],
    },
    resolution:
      "Resolve all 10 incidents using appropriate skills from prior labs. Communicate throughout.",
    businessImpact:
      "Multiple services impacted simultaneously — production risk is highest during multi-incident scenarios.",
  },
  hints: [
    { level: 1, text: "Always handle P1s first — never let an all-users-down incident sit while you fix a printer." },
    { level: 2, text: "Communicate early and often — even if you don't have a fix yet, stakeholders want to know you're working on it." },
    { level: 3, text: "Use your SOPs from Lab 20 — they exist precisely so you don't have to figure everything out from scratch." },
    { level: 4, text: "Track your time — if an incident is taking too long, consider escalating." },
    { level: 5, text: "The shift summary is evidence too — write it as if your manager will read it tomorrow morning." },
  ],
  validation: [
    { id: "v1", description: "All 10 incidents resolved", command: "Incident log", expectedResult: "10/10 incidents resolved", points: 10 },
    { id: "v2", description: "P1s resolved within SLA", command: "Incident log", expectedResult: "P1 resolution < 4 hours each", points: 10 },
    { id: "v3", description: "Communications documented", command: "Evidence panel", expectedResult: "Status updates and shift summary present", points: 10 },
  ],
  rubric: [
    { criterion: "Triage quality", description: "Correctly prioritized by severity and impact", maxPoints: 20 },
    { criterion: "Resolution quality", description: "Used appropriate skills, resolved all incidents", maxPoints: 25 },
    { criterion: "Communication", description: "Status updates sent at appropriate times, all-clear issued", maxPoints: 20 },
    { criterion: "Escalation", description: "Escalated appropriately when needed", maxPoints: 15 },
    { criterion: "Documentation", description: "Complete incident log and shift summary", maxPoints: 20 },
  ],
  requiredEvidence: ["Triage decisions", "10 incident logs", "Status updates", "Shift summary"],
  deliverables: ["10 incident logs", "Status communications", "Shift summary", "KPIs"],
  interviewQuestion:
    "You get 3 P1 incidents at once during your shift. Walk me through how you decide what to work on first and how you communicate to stakeholders.",
};
