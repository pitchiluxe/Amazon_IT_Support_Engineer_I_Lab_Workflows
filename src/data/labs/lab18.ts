import type { Lab } from "@/types";

export const lab18: Lab = {
  id: "lab18",
  number: 18,
  title: "IT Closet / Mini Data Center",
  category: "infrastructure",
  difficulty: "advanced",
  estimatedMinutes: 90,
  objectives: [
    "Document the IT closet layout and inventory",
    "Implement cable management and labeling",
    "Plan power and cooling",
    "Create a closet readiness checklist",
  ],
  prerequisites: ["Lab 13 — Data Cabling"],
  scenario:
    "You inherit a small IT closet. It has power issues, poor cable management, and no documentation. You must bring it to a documented, supportable state.",
  environment: [
    "IT closet with rack, switches, patch panel, UPS",
    "Cable management supplies",
    "Labeling tool",
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
      title: "Inventory the closet",
      description: "Catalog rack, switches, patch panel, UPS, power.",
      order: 1,
      steps: [
        { instruction: "Walk through the IT closet and list all equipment: servers, switches, routers, UPS, patch panels — record manufacturer, model, and serial number", tool: "Physical inspection", expectedResult: "Equipment list complete" },

{ instruction: "Document the rack layout: which U (rack unit) each device occupies from top to bottom", tool: "Rack diagram", expectedResult: "Rack layout documented" },

{ instruction: "Record all IP addresses assigned to devices in the closet: run arp -a or check DHCP/DNS records", tool: "Command Prompt → arp -a", expectedResult: "IP inventory complete", nodeId: "dc-01", toolId: "powershell" },

{ instruction: "Document all network connections: which switch port connects to which wall port", tool: "Switch CLI → show mac address-table", expectedResult: "Port-to-port mapping documented", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Photograph the front and rear of the rack from multiple angles", tool: "Camera or phone", expectedResult: "Rack photos saved" },

{ instruction: "Compile the inventory into a table: Device | Model | Serial | IP | Rack Position | U height", tool: "Evidence panel → closet inventory", expectedResult: "Inventory table complete" },

      ],
    },
{
      id: "t2",
      title: "Plan power and cooling",
      description: "Verify UPS capacity, redundancy, and airflow.",
      order: 2,
      steps: [
        { instruction: "Check the UPS: note the model, capacity (VA/watts), and load percentage — look at the UPS display or run: apaccess.exe or PowerShield software", tool: "UPS display or software", expectedResult: "UPS load status recorded", nodeId: "ups-01", toolId: "settings" },

{ instruction: "Calculate total power draw: add up the wattage of all devices — does the UPS have headroom (at least 20% spare capacity)?", tool: "Wattage calculation", expectedResult: "Power budget calculated" },

{ instruction: "Check airflow: are there vent holes or a dedicated cooling fan? Is the closet temperature within range (18-27°C)?", tool: "Thermometer or thermal camera", expectedResult: "Temperature recorded" },

{ instruction: "Check power redundancy: are critical devices on UPS and non-critical on standard power? Are dual PSUs connected to separate UPS circuits?", tool: "Power cable inspection", expectedResult: "Power redundancy status noted" },

{ instruction: "Document findings: UPS load %, available headroom, temperature, redundancy status", tool: "Evidence panel", expectedResult: "Power and cooling assessment saved" },

      ],
    },
{
      id: "t3",
      title: "Implement cable management",
      description: "Organize and label all cables.",
      order: 3,
      steps: [
        { instruction: "Unplug, sort, and re-cable: group cables by function (network, power, KVM)", tool: "Physical cable work", expectedResult: "Cables sorted" },

{ instruction: "Use Velcro ties or cable combs to organize cables: network cables on the left side of the rack, power on the right", tool: "Cable management supplies", expectedResult: "Cables organized and tied" },

{ instruction: "Label both ends of every patch cable: use a label maker to print 'PP-01-Fa0/1' (Patch Panel 01, Port 1) on each end", tool: "Label printer (Brother P-Touch)", expectedResult: "All patch cables labeled", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Label each switch port: label the port face with the wall plate it connects to (e.g., '→ B3')", tool: "Label printer", expectedResult: "Switch ports labeled", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Use cable management bars or velcro straps to bundle and route cables cleanly through the rack", tool: "Cable management supplies", expectedResult: "Cables bundled and routed" },

{ instruction: "Photograph the before and after rack — rear and front", tool: "Camera or phone", expectedResult: "Before/after photos saved" },

      ],
    },
{
      id: "t4",
      title: "Create diagram",
      description: "Produce a closet diagram with port assignments.",
      order: 4,
      steps: [
        { instruction: "Use draw.io, Visio, or a whiteboard to draw the rack diagram: top to bottom, showing each device in its U position", tool: "draw.io or whiteboard", expectedResult: "Rack diagram created" },

{ instruction: "Add a network topology section: show the uplink from the ISP, the router/firewall, the switch, and how each VLAN connects", tool: "draw.io network topology", expectedResult: "Network topology diagram created" },

{ instruction: "Add a power section: show the UPS, PDU, and which devices are on UPS vs standard power", tool: "draw.io power diagram", expectedResult: "Power topology diagram created" },

{ instruction: "Label every switch port with the destination (wall plate or device) on the diagram", tool: "Diagram annotations", expectedResult: "All ports labeled" },

{ instruction: "Export or photograph the diagram and save it to the evidence panel", tool: "Evidence panel", expectedResult: "Diagram saved" },

      ],
    },
{
      id: "t5",
      title: "Build readiness checklist",
      description: "Daily/weekly/monthly maintenance tasks.",
      order: 5,
      steps: [
        { instruction: "Daily checklist: check UPS status light (green = OK), check room temperature, check for unusual noise or smells", tool: "Notepad → checklist template", expectedResult: "Daily checklist created" },

{ instruction: "Weekly checklist: check UPS load percentage, check cable ties for wear, verify backup logs from servers", tool: "Notepad → checklist template", expectedResult: "Weekly checklist created" },

{ instruction: "Monthly checklist: clean dust from rack vents, check battery replacement date on UPS (replace every 3-5 years), review switch logs for errors, test UPS failover by unplugging one device", tool: "Notepad → checklist template", expectedResult: "Monthly checklist created" },

{ instruction: "Quarterly checklist: review and update the closet diagram if anything changed, test all UPS batteries, review capacity planning", tool: "Notepad → checklist template", expectedResult: "Quarterly checklist created" },

{ instruction: "Compile all checklists into a single document: IT-Closet-Maintenance-SOP.md and save to the evidence panel", tool: "Evidence panel", expectedResult: "Maintenance SOP saved" },

      ],
    },
  ],
  incident: {
    id: "inc18",
    severity: "low",
    symptoms: [
      "Closet has no documentation",
      "Cables are a mess — no labels",
      "UPS shows amber warning light",
    ],
    affectedAssets: ["IT Closet", "All closet equipment"],
    initialState: {
      "Closet": "Undocumented, poor cable management, UPS warning",
    },
    hiddenRootCause:
      "The IT closet was built without documentation standards. The UPS amber light indicates either overload or battery replacement needed. Without documentation, changes are made blindly.",
    allowedActions: [
      "visual inspection",
      "UPS diagnostics",
      "cable tracing",
    ],
    forbiddenActions: [
      "reboot critical servers without change management",
      "replace UPS without power audit",
    ],
    evidenceRevealedOnAction: {
      "UPS diagnostics": [
        { id: "ev1", label: "UPS status", value: "Load: 92%, Battery age: 4 years — replacement recommended", collectedAt: "" },
      ],
    },
    resolution:
      "Create full documentation. Replace UPS batteries. Implement cable labeling. Build maintenance checklist.",
    businessImpact:
      "No documentation means changes cause outages. UPS failure means total power loss for all closet equipment.",
  },
  hints: [
    { level: 1, text: "Start with a physical inventory — you can't manage what you can't see." },
    { level: 2, text: "Check the UPS display — the amber light has a specific meaning." },
    { level: 3, text: "Document as you go — photograph everything before you move cables." },
    { level: 4, text: "A good diagram is more valuable than a clean rack — both are needed." },
    { level: 5, text: "Solution: document first, then fix power issues, then clean up cables." },
  ],
  validation: [
    { id: "v1", description: "Inventory complete", command: "Evidence panel", expectedResult: "All devices cataloged with serial/IP/position", points: 10 },
    { id: "v2", description: "Diagram complete", command: "Evidence panel", expectedResult: "Rack and network topology diagrams saved", points: 10 },
    { id: "v3", description: "Cables labeled", command: "Physical inspection", expectedResult: "All patch cables labeled at both ends", points: 10 },
  ],
  rubric: [
    { criterion: "Inventory accuracy", description: "All equipment cataloged correctly", maxPoints: 20 },
    { criterion: "Power assessment", description: "UPS capacity and redundancy reviewed", maxPoints: 15 },
    { criterion: "Cable management", description: "Cables organized, labeled, and documented", maxPoints: 20 },
    { criterion: "Diagrams", description: "Rack and network topology diagrams complete", maxPoints: 20 },
    { criterion: "Checklist", description: "Daily/weekly/monthly checklists created", maxPoints: 25 },
  ],
  requiredEvidence: ["Inventory table", "Before/after photos", "Rack diagram", "Power diagram", "Maintenance checklist"],
  deliverables: ["IT closet inventory", "Rack diagram", "Cable labeling SOP", "Maintenance checklist"],
  interviewQuestion:
    "You inherit a closet where nothing is labeled and there's no documentation. Walk me through how you would bring it to a supportable state without causing any outages.",
};
