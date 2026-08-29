import type { Lab } from "@/types";

export const lab20: Lab = {
  id: "lab20",
  number: 20,
  title: "SOP & Knowledge Base Program",
  category: "operations",
  difficulty: "intermediate",
  estimatedMinutes: 75,
  objectives: [
    "Write production-quality SOPs for common issues",
    "Build a troubleshooting decision tree",
    "Establish a knowledge base program",
  ],
  prerequisites: [],
  scenario:
    "The same five IT issues are repeatedly escalated. You must write SOPs for each so the next on-call can resolve without escalation.",
  environment: [
    "Markdown editor",
    "Sample ticket history",
    "Knowledge base tool (or just markdown files)",
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
      title: "Identify top 5 issues",
      description: "Review ticket history for top recurring issues.",
      order: 1,
      steps: [
        { instruction: "Open the ticket history (spreadsheet or ticketing system) for the last 3 months", tool: "Ticketing system or spreadsheet", expectedResult: "Ticket history open" },

{ instruction: "Count the frequency of each issue type — list the top 5 by volume", tool: "Ticket analysis", expectedResult: "Top 5 issues identified" },

{ instruction: "Document the top 5: (1) New workstation setup, (2) Password reset, (3) Network connectivity issue, (4) Printer not working, (5) Software installation request", tool: "Top issues list", expectedResult: "Top 5 documented" },

{ instruction: "For each: note the average time to resolve (TTR) — these are your targets to reduce with SOPs", tool: "Ticket analysis", expectedResult: "TTR noted for each issue" },

{ instruction: "Save the top 5 issues list to the evidence panel", tool: "Evidence panel", expectedResult: "Top issues saved" },

      ],
    },
{
      id: "t2",
      title: "Write 5 SOPs",
      description: "New workstation deployment, password reset, network issue, printer issue, software install.",
      order: 2,
      steps: [
        { instruction: "SOP 1 — New Workstation Setup: sections: Purpose, Scope, Steps (1. Unbox and inspect, 2. Apply standard image, 3. Join to domain, 4. Install standard software, 5. Run gpupdate, 6. Test file/print access), Verification (can login, mapped drives visible, printer accessible)", tool: "Markdown editor", expectedResult: "SOP 1 created" },

{ instruction: "SOP 2 — Password Reset: sections: Purpose, Scope, Steps (1. Verify user identity with two-factor, 2. Open ADUC, 3. Find user → Reset Password, 4. Check 'User must change password at next logon', 5. Communicate new temp password securely), Verification (user confirms login)", tool: "Markdown editor", expectedResult: "SOP 2 created" },

{ instruction: "SOP 3 — Network Connectivity Issue: sections: Purpose, Scope, Steps (Layer 1: check cable/link light; Layer 2: ipconfig /release /renew; Layer 3: ping gateway; Layer 4-7: check DNS/firewall), Decision tree format with Go/No-Go at each step, Escalation criteria", tool: "Markdown editor", expectedResult: "SOP 3 created" },

{ instruction: "SOP 4 — Printer Not Working: sections: Purpose, Scope, Steps (1. Check physical — power/cable, 2. Check printer queue on PC, 3. Check Print Management on server, 4. Check port IP, 5. Test page from server), Decision tree, Escalation: vendor ticket if hardware fault", tool: "Markdown editor", expectedResult: "SOP 4 created" },

{ instruction: "SOP 5 — Software Installation Request: sections: Purpose, Scope, Steps (1. Receive request with business justification, 2. Check license compliance, 3. Test on one machine first, 4. Deploy via MECM or manual, 5. Verify install and functionality), Verification, License documentation", tool: "Markdown editor", expectedResult: "SOP 5 created" },

{ instruction: "Save all 5 SOPs to the evidence panel", tool: "Evidence panel", expectedResult: "All 5 SOPs saved" },

      ],
    },
{
      id: "t3",
      title: "Build decision tree",
      description: "Create a troubleshooting decision tree.",
      order: 3,
      steps: [
        { instruction: "Create a decision tree for 'User can't work' — the master triage tree", tool: "draw.io or markdown tree", expectedResult: "Master decision tree created" },

{ instruction: "Branch 1: Is it a hardware issue? → Check monitor/keyboard/mouse → if no display → check GPU/cable; if mouse dead → swap mouse", tool: "Decision tree", expectedResult: "Hardware branch documented" },

{ instruction: "Branch 2: Is it a network issue? → Can they ping? → Check cable/switch/VLAN → escalate to network team if needed", tool: "Decision tree", expectedResult: "Network branch documented" },

{ instruction: "Branch 3: Is it an authentication issue? → Can they login? → Check AD/credential expiry → reset password if needed", tool: "Decision tree", expectedResult: "Auth branch documented" },

{ instruction: "Branch 4: Is it an application issue? → Check app-specific KB → reinstall if needed → escalate to app owner", tool: "Decision tree", expectedResult: "App branch documented" },

{ instruction: "Save the decision tree to the evidence panel", tool: "Evidence panel", expectedResult: "Decision tree saved" },

      ],
    },
{
      id: "t4",
      title: "Publish to KB",
      description: "Make SOPs discoverable.",
      order: 4,
      steps: [
        { instruction: "Organize the KB structure: Folder: IT Operations → Subfolders: Hardware, Network, Account Management, Applications, Deployment", tool: "KB tool or file share", expectedResult: "KB folder structure created", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Create an index page: KB-Index.md — a table with columns: SOP Title | Category | Last Updated | Owner", tool: "Markdown editor", expectedResult: "KB index created" },

{ instruction: "Add metadata to each SOP: Version, Author, Last Updated, Review Frequency (quarterly)", tool: "Each SOP file → frontmatter", expectedResult: "Metadata added" },

{ instruction: "Create a 'How to Search the KB' section on the index page: list the key terms users search for and which SOP they map to", tool: "KB index → search guide", expectedResult: "Search guide added" },

{ instruction: "Set a calendar reminder to review all SOPs quarterly — add this to the index as a review schedule", tool: "Calendar", expectedResult: "Review schedule set" },

{ instruction: "Submit the complete KB package (index + 5 SOPs + decision tree) as evidence", tool: "Evidence panel", expectedResult: "KB package saved" },

      ],
    },
  ],
  incident: {
    id: "inc20",
    severity: "low",
    symptoms: [
      "Same issues repeatedly escalated to senior engineers",
      "No documented procedures for Tier 1",
    ],
    affectedAssets: ["IT team efficiency", "User productivity"],
    initialState: {
      "KB": "Does not exist",
      "SOPs": "Only in senior engineers' heads",
    },
    hiddenRootCause:
      "No knowledge base or SOPs exist. Every issue escalates to senior engineers because Tier 1 has no documented procedures to follow.",
    allowedActions: [
      "review ticket history",
      "interview senior engineers",
      "draft SOPs",
    ],
    forbiddenActions: ["delete tickets", "reclassify tickets to hide trends"],
    evidenceRevealedOnAction: {
      "review ticket history": [
        { id: "ev1", label: "Top issues", value: "5 issues account for 60% of all tickets", collectedAt: "" },
      ],
    },
    resolution:
      "Create SOPs for top 5 issues. Build KB index. Establish quarterly review schedule.",
    businessImpact:
      "Senior engineers spend time on Tier 1 work. User resolution time is slow.",
  },
  hints: [
    { level: 1, text: "What are the 5 most common issues? Count the tickets." },
    { level: 2, text: "Each SOP should have: Purpose, Scope, Steps, Verification, Escalation criteria." },
    { level: 3, text: "A decision tree is better than a wall of text — use Go/No-Go at each decision point." },
    { level: 4, text: "The KB index needs to be searchable — add the key terms users would actually search for." },
    { level: 5, text: "Solution: write all 5 SOPs, publish to a shared KB, set a quarterly review schedule." },
  ],
  validation: [
    { id: "v1", description: "5 SOPs written", command: "Evidence panel", expectedResult: "All 5 SOPs present with all required sections", points: 10 },
    { id: "v2", description: "Decision tree complete", command: "Evidence panel", expectedResult: "Master triage tree with 4 branches", points: 10 },
    { id: "v3", description: "KB index complete", command: "Evidence panel", expectedResult: "Index with version metadata and review schedule", points: 10 },
  ],
  rubric: [
    { criterion: "Issue identification", description: "Top 5 issues correctly identified from ticket data", maxPoints: 15 },
    { criterion: "SOP quality", description: "All 5 SOPs complete with Purpose/Scope/Steps/Verification/Escalation", maxPoints: 25 },
    { criterion: "Decision tree", description: "Clear decision tree with escalations", maxPoints: 20 },
    { criterion: "KB organization", description: "Logical folder structure, searchable index, metadata", maxPoints: 20 },
    { criterion: "Review program", description: "Quarterly review schedule established", maxPoints: 20 },
  ],
  requiredEvidence: ["Top 5 issues analysis", "5 SOPs", "Decision tree", "KB index"],
  deliverables: ["Knowledge base package", "5 SOPs", "Decision tree", "KB index with review schedule"],
  interviewQuestion:
    "You notice the same issue gets escalated to you 10 times a week. Walk me through what you do to prevent that escalation from happening again.",
};
