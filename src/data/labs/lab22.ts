import type { Lab } from "@/types";

export const lab22: Lab = {
  id: "lab22",
  number: 22,
  title: "Capstone: Warehouse Site IT Engineer",
  category: "capstone",
  difficulty: "expert",
  estimatedMinutes: 360,
  objectives: [
    "Design and operate a full warehouse IT environment",
    "Resolve all required incidents end-to-end",
    "Produce complete documentation",
    "Deliver an executive summary and interview walkthrough",
  ],
  prerequisites: [
    "All prior labs (01-21)",
  ],
  scenario:
    "You are the primary IT Support Engineer I for a simulated warehouse site. Design, deploy, operate, and troubleshoot the environment. Resolve 10 required incidents and produce a final readiness package.",
  environment: [
    "Windows Server domain",
    "Windows clients",
    "Linux system",
    "Cisco network simulation",
    "DNS/DHCP",
    "DFS",
    "Print Services",
    "Endpoint deployment workflow",
    "Video conference room",
    "IT closet infrastructure",
  ],
  interactiveEnvironment: {
    theme: "mixed",
    title: "Full Warehouse IT Environment",
    nodes: [
      {
        id: "dc-01",
        name: "DC-01",
        type: "server",
        position: { x: 12, y: 32  },
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
        position: { x: 38, y: 32  },
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
            name: "Print",
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
        id: "fs-02",
        name: "FS-02",
        type: "server",
        position: { x: 64, y: 32  },
        layer: 2,
        status: "warning",
        ip: "10.0.0.12",
        room: "Server Room",
        tools: [
          {
            id: "server-manager",
            name: "Server Manager",
            label: "Server Manager",
            path: "Server Manager → Dashboard",
            type: "gui" },


          {
            id: "file-explorer",
            name: "File Explorer",
            label: "Explorer",
            path: "\\fs-02\C$",
            type: "gui" },


        ],
      },
      {
        id: "switch-01",
        name: "Core-SW-01",
        type: "switch",
        position: { x: 88, y: 32  },
        layer: 3,
        status: "online",
        ip: "10.0.0.2",
        room: "IT Closet",
        tools: [
          {
            id: "cisco-cli",
            name: "Cisco IOS",
            label: "IOS CLI",
            path: "Console → PuTTY",
            type: "cli" },


        ],
      },
      {
        id: "router-01",
        name: "WAN-Router",
        type: "router",
        position: { x: 6, y: 60  },
        layer: 3,
        status: "online",
        ip: "10.0.0.1",
        room: "IT Closet",
        tools: [
          {
            id: "cisco-cli",
            name: "Cisco IOS",
            label: "IOS CLI",
            path: "Console → PuTTY",
            type: "cli" },


        ],
      },
      {
        id: "vc-codec",
        name: "VC-Codec",
        type: "conference",
        position: { x: 88, y: 60  },
        layer: 2,
        status: "online",
        ip: "10.0.0.30",
        room: "Conf Room",
        tools: [
          {
            id: "settings",
            name: "Codec Web UI",
            label: "Codec UI",
            path: "https://10.0.0.30",
            type: "web" },

        ],
      },
      {
        id: "ws-01",
        name: "WS-01",
        type: "workstation",
        position: { x: 20, y: 78  },
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
        position: { x: 48, y: 78  },
        layer: 1,
        status: "online",
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
      },
      {
        id: "printer-01",
        name: "Bay-Printer-01",
        type: "printer",
        position: { x: 76, y: 78  },
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
      }
    ],
  },
  tasks: [{
      id: "t1",
      title: "Design the environment",
      description: "Create the architecture diagram and design document.",
      order: 1,
      steps: [
        { instruction: "Create the architecture document: cover page, scope, assumptions, and constraints", tool: "Word/Google Docs/draw.io", expectedResult: "Cover and executive summary complete" },

{ instruction: "Draw the network topology: ISP → Firewall → Core Switch → Access Switches → VLANs (Management, Operations, Servers, Wi-Fi)", tool: "draw.io", expectedResult: "Network topology diagram complete" },

{ instruction: "Draw the Active Directory structure: forest, domain, OUs (Operations/IT/Management/Devices/Servers), group structure", tool: "AD architecture diagram", expectedResult: "AD structure documented" },

{ instruction: "Document the service inventory: DC-01, DNS, DHCP, DFS, Print, MECM, VC codec — with IP addresses, roles, and dependencies", tool: "Service inventory table", expectedResult: "Service inventory complete" },

{ instruction: "Document the IP addressing plan: each VLAN, subnet, gateway, DHCP scope ranges", tool: "IP plan table", expectedResult: "IP plan documented" },

{ instruction: "Save the architecture document to the evidence panel", tool: "Evidence panel", expectedResult: "Architecture document saved" },

      ],
    },
{
      id: "t2",
      title: "Deploy core services",
      description: "Deploy AD, DNS, DHCP per the design from Labs 02-04.",
      order: 2,
      steps: [
        { instruction: "Deploy DC-01: install AD DS, create warehouse.local forest, create all OUs, create security groups per the design", tool: "Server Manager → Add Roles", expectedResult: "AD deployed", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Configure DNS: create forward and reverse zones, create A/CNAME records for all servers and services", tool: "DNS Manager", expectedResult: "DNS configured", nodeId: "dc-01", toolId: "dns" },

{ instruction: "Configure DHCP: create scopes for each VLAN, set scope options (router, DNS, domain name), set lease duration (8 hours)", tool: "DHCP console", expectedResult: "DHCP configured", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Test: verify domain login from WS-01, verify DNS resolution, verify DHCP lease on a client", tool: "Client testing", expectedResult: "All core services tested" },

{ instruction: "Document the deployment in the evidence panel with validation screenshots", tool: "Evidence panel", expectedResult: "Core services deployment documented" },

      ],
    },
{
      id: "t3",
      title: "Deploy file and print services",
      description: "Deploy DFS and Print Services per Labs 05-07.",
      order: 3,
      steps: [
        { instruction: "Deploy DFS: install DFS Namespace and DFS Replication roles, create domain-based namespace, add folder targets, configure DFS-R", tool: "Server Manager + DFS Management", expectedResult: "DFS deployed and tested", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Deploy Print Services: install Print Server role, add and share network printers, deploy via GPO", tool: "Print Management", expectedResult: "Print services deployed and tested", nodeId: "fs-01", toolId: "print" },

{ instruction: "Configure file share permissions: create Operations share with AGDLP permissions (GG_Ops_BayWorkers, GG_Ops_Managers, GG_IT_Admins)", tool: "File Explorer + NTFS permissions", expectedResult: "Share permissions configured", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Test: verify DFS namespace accessible, verify printers deployed to clients, verify share access per role", tool: "Client testing", expectedResult: "All file/print services tested" },

{ instruction: "Document in the evidence panel with screenshots", tool: "Evidence panel", expectedResult: "File/print deployment documented" },

      ],
    },
{
      id: "t4",
      title: "Deploy network infrastructure",
      description: "Configure VLANs, DHCP relay, and network monitoring.",
      order: 4,
      steps: [
        { instruction: "Configure VLANs on the Cisco switch: VLAN 10 (Operations), VLAN 20 (IT), VLAN 30 (Server), configure trunk ports and access ports", tool: "Switch CLI", expectedResult: "VLANs configured", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Configure DHCP relay (IP helper) on the switch VLAN interfaces to forward DHCP requests to DC-01", tool: "Switch CLI", expectedResult: "DHCP relay configured", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Test inter-VLAN routing: from a VLAN 10 client, ping the VLAN 20 gateway and a VLAN 30 server", tool: "Client → ping test", expectedResult: "Inter-VLAN routing confirmed" },

{ instruction: "Document the VLAN design, port assignments, and IP helper configuration in the evidence panel", tool: "Evidence panel", expectedResult: "Network infrastructure documented" },

      ],
    },
{
      id: "t5",
      title: "Deploy endpoint management",
      description: "Build the MECM/powerShell deployment workflow.",
      order: 5,
      steps: [
        { instruction: "Document the endpoint management architecture: management server → collections → packages → deployments", tool: "Architecture diagram", expectedResult: "Endpoint management architecture documented" },

{ instruction: "Create the standard workstation build: Windows 11, Office 365, endpoint agent, security agents, configured via unattend.xml or reference image", tool: "Deployment documentation", expectedResult: "Standard build documented" },

{ instruction: "Document the software deployment workflow: from request → approval → packaging → testing → deployment → verification", tool: "Workflow document", expectedResult: "Deployment workflow documented" },

{ instruction: "Document the asset management lifecycle: procurement → deployment → maintenance → retirement → liquidation", tool: "Lifecycle document", expectedResult: "Asset lifecycle documented" },

{ instruction: "Save all endpoint management documentation to the evidence panel", tool: "Evidence panel", expectedResult: "Endpoint management docs saved" },

      ],
    },
{
      id: "t6",
      title: "Resolve 10 required incidents",
      description: "Work through all 10 planted incidents from labs 02-21.",
      order: 6,
      steps: [
        { instruction: "Review the 10 incident scenarios: Lab 02 (DNS wrong on client), Lab 03 (stale DNS record), Lab 04 (DHCP scope exhausted), Lab 05 (wrong group membership), Lab 06 (missing share on DFS target), Lab 07 (wrong printer port IP), Lab 11 (VLAN not assigned), Lab 12 (DNS stale record), Lab 16 (codec DNS misconfigured), Lab 17 (asset not wiped)", tool: "Incident scenarios list", expectedResult: "All 10 scenarios reviewed" },

{ instruction: "For each incident: document the triage process, the diagnosis, the evidence, the fix, and the verification", tool: "Evidence panel", expectedResult: "Each incident fully documented" },

{ instruction: "Calculate total MTTR (Mean Time to Resolve) across all 10 incidents", tool: "Incident log", expectedResult: "MTTR calculated" },

{ instruction: "Save all 10 incident resolutions to the evidence panel", tool: "Evidence panel", expectedResult: "10 incident resolutions saved" },

      ],
    },
{
      id: "t7",
      title: "Build the SOP library",
      description: "Compile all SOPs into a single reference document.",
      order: 7,
      steps: [
        { instruction: "Compile the SOP library: New Workstation Setup, Password Reset, Network Issue, Printer Issue, Software Install, Cable Fault, Incident Response, RCA Process, Asset Lifecycle, VC Room Readiness", tool: "Markdown editor", expectedResult: "10 SOPs compiled" },

{ instruction: "Create a master index: SOP-Title | Category | Last Updated | Owner | Review Date", tool: "SOP index", expectedResult: "SOP index created" },

{ instruction: "Add a Quick Reference Card: the top 10 commands/tools every IT engineer should know (nslookup, ipconfig, ping, gpupdate, Get-ADUser, etc.)", tool: "Quick reference card", expectedResult: "Quick reference card created" },

{ instruction: "Save the SOP library to the evidence panel", tool: "Evidence panel", expectedResult: "SOP library saved" },

      ],
    },
{
      id: "t8",
      title: "Produce executive summary",
      description: "Create a professional summary for management.",
      order: 8,
      steps: [
        { instruction: "Executive summary section 1: What was built — the environment, services, and infrastructure", tool: "Executive document", expectedResult: "Summary section 1 complete" },

{ instruction: "Executive summary section 2: What was documented — SOPs, diagrams, runbooks", tool: "Executive document", expectedResult: "Summary section 2 complete" },

{ instruction: "Executive summary section 3: Incidents resolved — total count, MTTR, top root causes", tool: "Executive document", expectedResult: "Summary section 3 complete" },

{ instruction: "Executive summary section 4: What was learned — key findings, process improvements, recommendations for management", tool: "Executive document", expectedResult: "Summary section 4 complete" },

{ instruction: "Prepare for the interview walkthrough: select 3 incidents that demonstrate your troubleshooting methodology, practice explaining each step", tool: "Interview preparation", expectedResult: "Interview walkthrough prepared" },

{ instruction: "Save the executive summary to the evidence panel as the final deliverable", tool: "Evidence panel", expectedResult: "Executive summary saved" },

      ],
    },
  ],
  incident: {
    id: "inc22",
    severity: "critical",
    symptoms: [
      "Multiple services failing simultaneously",
      "10 independent incidents across all domains",
    ],
    affectedAssets: ["All systems — full environment"],
    initialState: {
      "Environment": "Partially built with 10 planted faults",
    },
    hiddenRootCause:
      "This is the capstone — all prior planted faults are still present. The hidden cause is the combination of all prior root causes.",
    allowedActions: [
      "all skills from all prior labs",
      "systematic triage",
      "documentation",
    ],
    forbiddenActions: [
      "skip documentation",
      "leave incidents unresolved",
      "fail to produce deliverables",
    ],
    evidenceRevealedOnAction: {
      "comprehensive audit": [
        { id: "ev1", label: "Total findings", value: "10 incidents across Windows, Networking, Operations", collectedAt: "" },
      ],
    },
    resolution:
      "Resolve all 10 incidents. Produce complete documentation. Deliver executive summary.",
    businessImpact:
      "Full site readiness depends on resolving all incidents and completing documentation.",
  },
  hints: [
    { level: 1, text: "Start with architecture — you can't operate what you haven't designed." },
    { level: 2, text: "Deploy core services first (AD, DNS, DHCP), then supporting services, then incidents." },
    { level: 3, text: "Work incidents by severity — use the prioritization from Lab 21." },
    { level: 4, text: "Documentation is 50% of the grade — write as you go, not at the end." },
    { level: 5, text: "The interview walkthrough is your chance to show how you think, not just what you did." },
  ],
  validation: [
    { id: "v1", description: "Architecture document complete", command: "Evidence panel", expectedResult: "All diagrams and design docs present", points: 10 },
    { id: "v2", description: "All 10 incidents resolved", command: "Incident log", expectedResult: "10/10 with full documentation", points: 15 },
    { id: "v3", description: "SOP library complete", command: "Evidence panel", expectedResult: "10 SOPs + index + quick reference", points: 10 },
    { id: "v4", description: "Executive summary complete", command: "Evidence panel", expectedResult: "All 4 sections present", points: 10 },
    { id: "v5", description: "Interview walkthrough ready", command: "Evidence panel", expectedResult: "3 incidents selected with methodology explained", points: 5 },
  ],
  rubric: [
    { criterion: "Architecture design", description: "Complete environment design with diagrams", maxPoints: 15 },
    { criterion: "Service deployment", description: "All core services deployed and tested", maxPoints: 20 },
    { criterion: "Incident resolution", description: "All 10 incidents resolved with methodology", maxPoints: 25 },
    { criterion: "SOP library", description: "Complete SOP library with index and quick reference", maxPoints: 15 },
    { criterion: "Documentation quality", description: "Complete, professional, executive-ready documentation", maxPoints: 15 },
    { criterion: "Interview walkthrough", description: "Clear methodology communication in walkthrough", maxPoints: 10 },
  ],
  requiredEvidence: ["Architecture document", "Service deployment logs", "10 incident logs", "SOP library", "Executive summary"],
  deliverables: ["Architecture document", "Service deployment guide", "10 incident reports", "SOP library", "Executive summary", "Interview walkthrough notes"],
  interviewQuestion:
    "This is your interview walkthrough. Pick three incidents from your capstone and walk me through exactly how you diagnosed and resolved each one. Explain your thinking at each step.",
};
