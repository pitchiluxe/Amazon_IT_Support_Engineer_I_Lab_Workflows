import type { Lab } from "@/types";

export const lab19: Lab = {
  id: "lab19",
  number: 19,
  title: "Local IT Project: Site Expansion",
  category: "project",
  difficulty: "advanced",
  estimatedMinutes: 90,
  objectives: [
    "Gather requirements and build a bill of materials",
    "Design a VLAN/IP plan for a new area",
    "Plan endpoints, printers, and Wi-Fi dependencies",
    "Create a project plan with change and rollback",
  ],
  prerequisites: ["Lab 11 — Cisco Switching", "Lab 18 — IT Closet"],
  scenario:
    "A warehouse adds a new operations area with 30 new workstations, 2 printers, 2 scanners, and a new Wi-Fi AP. You must plan and document the deployment.",
  environment: [
    "Project planning tools",
    "Network design tool",
    "BOM template",
  ],
  interactiveEnvironment: {
    theme: "server_room",
    title: "Infrastructure Environment",
    nodes: [
      {
        id: "dc-01",
        name: "DC-01",
        type: "server",
        position: { x: 15, y: 38  },
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
        position: { x: 40, y: 38  },
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
        position: { x: 65, y: 38  },
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
        position: { x: 88, y: 38  },
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
        id: "ups-01",
        name: "UPS-01",
        type: "ups",
        position: { x: 28, y: 72  },
        layer: 1,
        status: "online",
        room: "Server Room",
        tools: [
          {
            id: "settings",
            name: "UPS Web UI",
            label: "Web UI",
            path: "https://10.0.0.20",
            type: "web" },

        ],
      }
    ],
  },
  tasks: [{
      id: "t1",
      title: "Gather requirements",
      description: "Document scope, success criteria, constraints.",
      order: 1,
      steps: [
        { instruction: "Meet with the operations manager to document: what is the new area for? (Operations Bay 5) How many workers? (30) What do they need? (file access, printing, scanner access, Wi-Fi)", tool: "Meeting notes or email", expectedResult: "Requirements captured" },

{ instruction: "Define scope: 30 workstations, 2 printers, 2 scanners, 1 Wi-Fi AP, new network drops, VLAN, DHCP scope extension, GPO", tool: "Scope document", expectedResult: "Scope statement written" },

{ instruction: "Define success criteria: all 30 workstations domain-joined and accessible within 3 days of deployment; printers and scanners functional within 1 day", tool: "Success criteria document", expectedResult: "Success criteria defined" },

{ instruction: "Identify constraints: budget limit, timeline (must be complete by [date]), no downtime for existing areas", tool: "Constraints document", expectedResult: "Constraints documented" },

{ instruction: "Document scope, success criteria, and constraints in the evidence panel", tool: "Evidence panel", expectedResult: "Requirements documented" },

      ],
    },
{
      id: "t2",
      title: "Build BOM",
      description: "List all hardware, software, and licenses.",
      order: 2,
      steps: [
        { instruction: "Hardware BOM: 30 x workstations (spec: i5/8GB/256GB SSD), 2 x network printers, 2 x barcode scanners (USB or network), 1 x Wi-Fi AP (Ubiquiti or Cisco), 1 x 48-port switch (if needed), Cat6 cable runs", tool: "BOM spreadsheet", expectedResult: "Hardware BOM complete" },

{ instruction: "Software/licensing: 30 x Windows 11 Pro licenses, 30 x Office 365 licenses, endpoint management agent for each workstation", tool: "BOM spreadsheet → Software tab", expectedResult: "Software BOM complete" },

{ instruction: "Services/parts: network drop installation (30 drops), patch cables, wall plates, UPS capacity check for new equipment", tool: "BOM spreadsheet → Services tab", expectedResult: "Services BOM complete" },

{ instruction: "Calculate total estimated cost: hardware + software + services", tool: "BOM spreadsheet", expectedResult: "Total cost calculated" },

{ instruction: "Save the BOM to the evidence panel", tool: "Evidence panel", expectedResult: "BOM saved" },

      ],
    },
{
      id: "t3",
      title: "Design VLAN/IP plan",
      description: "Assign VLANs, subnets, and IP ranges.",
      order: 3,
      steps: [
        { instruction: "Design the new VLAN: VLAN 50 — Operations-Bay5, Subnet: 10.0.50.0/24, Gateway: 10.0.50.1, DHCP scope: 10.0.50.100 - 10.0.50.200 (101 addresses for 30 workstations + growth)", tool: "Network design document", expectedResult: "VLAN design complete" },

{ instruction: "Plan the switch port assignments: 30 ports for workstations, 2 for printers, 2 for scanners, 1 for Wi-Fi AP uplink, 1 spare", tool: "Switch port plan", expectedResult: "Port plan complete" },

{ instruction: "Update the VLAN database on the core switch: add VLAN 50, name Operations-Bay5, set the SVI (switch virtual interface) IP as the gateway", tool: "Switch CLI", expectedResult: "VLAN 50 configured", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Configure the DHCP scope on DC-01: new scope for 10.0.50.0/24 with options 003 Router (10.0.50.1), 006 DNS Servers (10.0.0.10)", tool: "DHCP console on DC-01", expectedResult: "DHCP scope created", nodeId: "dc-01", toolId: "powershell" },

{ instruction: "Document the VLAN/IP plan in the evidence panel", tool: "Evidence panel", expectedResult: "VLAN/IP plan saved" },

      ],
    },
{
      id: "t4",
      title: "Plan dependencies",
      description: "Endpoints, printers, Wi-Fi, power, network drops.",
      order: 4,
      steps: [
        { instruction: "Endpoint dependency: workstations must be pre-built with standard image before deployment day", tool: "Project plan → dependency list", expectedResult: "Pre-build dependency noted" },

{ instruction: "Printer dependency: printers must be configured with static IPs (10.0.50.10 and 10.0.50.11) before deployment", tool: "Printer configuration plan", expectedResult: "Printer IP assignments done", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Wi-Fi dependency: Wi-Fi AP must be on the network and configured with SSID 'Warehouse-Bay5' before users arrive", tool: "Wi-Fi deployment plan", expectedResult: "Wi-Fi plan documented" },

{ instruction: "Network drops dependency: all 30 wall drops must be cable-tested and labeled before deployment day", tool: "Cable installation schedule", expectedResult: "Drop installation scheduled" },

{ instruction: "Document all dependencies and their sequence in the evidence panel", tool: "Evidence panel", expectedResult: "Dependencies documented" },

      ],
    },
{
      id: "t5",
      title: "Create timeline",
      description: "Build a phased implementation plan.",
      order: 5,
      steps: [
        { instruction: "Phase 1 (Week 1): Network infrastructure — run cables, install switch ports, configure VLAN and DHCP, test connectivity", tool: "Project timeline", expectedResult: "Phase 1 planned" },

{ instruction: "Phase 2 (Week 2): Device preparation — pre-build 30 workstations with standard image, configure printers and scanners, set up Wi-Fi AP", tool: "Project timeline", expectedResult: "Phase 2 planned" },

{ instruction: "Phase 3 (Week 3 — Deployment): On-site deployment — deploy workstations, join to domain, deploy GPO, test all services, user acceptance testing", tool: "Project timeline", expectedResult: "Phase 3 planned" },

{ instruction: "Phase 4 (Week 4): Validation — confirm all 30 workstations are functional, close project, document lessons learned", tool: "Project timeline", expectedResult: "Phase 4 planned" },

{ instruction: "Save the project timeline to the evidence panel", tool: "Evidence panel", expectedResult: "Timeline saved" },

      ],
    },
{
      id: "t6",
      title: "Test/rollback plan",
      description: "Define acceptance test and rollback steps.",
      order: 6,
      steps: [
        { instruction: "Acceptance criteria: all 30 workstations can log in as domain users, access file shares, print to warehouse printers, scan barcodes", tool: "Acceptance test plan", expectedResult: "Acceptance criteria defined" },

{ instruction: "Rollback criteria: if more than 5 workstations fail to deploy within the window, pause deployment and assess", tool: "Rollback plan", expectedResult: "Rollback criteria defined" },

{ instruction: "Rollback steps: (1) Do not power on additional workstations, (2) Document what failed and why, (3) Escalate to project manager, (4) Resume when root cause resolved", tool: "Rollback plan document", expectedResult: "Rollback steps documented" },

{ instruction: "Risk register: identify top 3 risks — (1) switch ports insufficient, (2) DHCP scope conflict, (3) Wi-Fi AP not configured — and mitigation for each", tool: "Risk register", expectedResult: "Risk register complete" },

{ instruction: "Save the acceptance test, rollback plan, and risk register to the evidence panel", tool: "Evidence panel", expectedResult: "All plans saved" },

      ],
    },
  ],
  incident: {
    id: "inc19",
    severity: "medium",
    symptoms: [
      "New workstations can't get DHCP addresses",
      "New VLAN not routing to existing network",
    ],
    affectedAssets: ["New Bay 5 workstations", "Core switch"],
    initialState: {
      "VLAN 50": "Created on access switch only",
      "Routing": "Not configured on core switch",
    },
    hiddenRootCause:
      "VLAN 50 is created on the access switch but not on the core switch. Inter-VLAN routing is not configured, so the new subnet cannot communicate with the rest of the network.",
    allowedActions: [
      "show vlan",
      "show ip route",
      "ping test",
      "router configuration",
    ],
    forbiddenActions: ["change existing VLANs without testing", "reboot core switch without maintenance window"],
    evidenceRevealedOnAction: {
      "show vlan": [
        { id: "ev1", label: "Core switch VLAN table", value: "VLAN 50 not present on core switch", collectedAt: "" },
      ],
    },
    resolution:
      "Add VLAN 50 to the core switch. Configure inter-VLAN routing (router-on-a-stick or layer-3 switch).",
    businessImpact:
      "New area cannot function — deployment blocked.",
  },
  hints: [
    { level: 1, text: "New workstations can't get IPs. Is the DHCP scope configured for the new VLAN?" },
    { level: 2, text: "Is the new VLAN present on the core switch?" },
    { level: 3, text: "Check 'show vlan' on the core switch — is VLAN 50 there?" },
    { level: 4, text: "Inter-VLAN routing must be configured on the core or router." },
    { level: 5, text: "Solution: add VLAN 50 to core switch, configure SVI with IP 10.0.50.1, add ip routing." },
  ],
  validation: [
    { id: "v1", description: "BOM complete", command: "Evidence panel", expectedResult: "BOM with all hardware, software, services, and costs", points: 10 },
    { id: "v2", description: "VLAN plan complete", command: "Evidence panel", expectedResult: "VLAN design with IP ranges and port assignments", points: 10 },
    { id: "v3", description: "Project timeline complete", command: "Evidence panel", expectedResult: "4-phase plan with owners and dates", points: 10 },
  ],
  rubric: [
    { criterion: "Requirements", description: "Scope, success criteria, and constraints clearly defined", maxPoints: 15 },
    { criterion: "BOM quality", description: "Complete and accurate bill of materials", maxPoints: 20 },
    { criterion: "Network design", description: "VLAN/IP plan is technically sound and scalable", maxPoints: 20 },
    { criterion: "Dependency planning", description: "All dependencies identified and sequenced", maxPoints: 15 },
    { criterion: "Timeline and rollback", description: "Phased plan with acceptance criteria and rollback", maxPoints: 15 },
    { criterion: "Risk register", description: "Top risks identified with mitigations", maxPoints: 15 },
  ],
  requiredEvidence: ["Requirements doc", "BOM spreadsheet", "VLAN design", "Project timeline", "Risk register"],
  deliverables: ["Project plan", "BOM", "Network design", "Implementation timeline", "Risk register"],
  interviewQuestion:
    "You're asked to plan a site expansion with 30 new workstations. Walk me through how you create a project plan from a blank page.",
};
