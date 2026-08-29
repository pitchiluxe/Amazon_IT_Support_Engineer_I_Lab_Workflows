import type { Lab } from "@/types";

export const lab01: Lab = {
  id: "lab01",
  number: 1,
  title: "Operations IT Baseline & Documentation",
  category: "foundations",
  difficulty: "beginner",
  estimatedMinutes: 60,
  objectives: [
    "Build a complete asset inventory for a small warehouse IT environment",
    "Document IP ranges, VLANs, DNS/DHCP services and critical dependencies",
    "Create a simple network diagram",
    "Define production-critical services and acceptable recovery priorities",
    "Create a daily IT health checklist",
  ],
  prerequisites: [],
  scenario:
    "You are the site IT engineer taking ownership of a small warehouse IT environment. The previous engineer left incomplete documentation. Before you can troubleshoot effectively, you need to establish a baseline of what is actually in the environment.",
  environment: [
    "Windows Server VM (DC, DNS, DHCP, File Server)",
    "Windows 11 client VM",
    "1 network switch (managed)",
    "2 printers",
    "5 workstations",
    "1 conference room device",
    "Asset spreadsheet template",
    "Network diagram tool (diagrams.net)",
  ],
  interactiveEnvironment: {
    theme: "mixed",
    title: "Warehouse Site IT Environment",
    nodes: [
      {
        id: "dc-01",
        name: "DC-01",
        type: "server",
        position: { x: 18, y: 38  },
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
            name: "Active Directory Users and Computers",
            label: "ADUC",
            path: "Server Manager → Tools → ADUC",
            type: "gui" },


          {
            id: "dns",
            name: "DNS Manager",
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
            id: "powershell",
            name: "PowerShell",
            label: "PowerShell",
            path: "Start → Windows PowerShell",
            type: "cli" },


        ],
      },
      {
        id: "fs-01",
        name: "FS-01",
        type: "server",
        position: { x: 50, y: 38  },
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
            id: "file-explorer",
            name: "File Explorer",
            label: "Explorer",
            path: "\\fs-01\C$",
            type: "gui" },


          {
            id: "powershell",
            name: "PowerShell",
            label: "PowerShell",
            path: "Start → Windows PowerShell",
            type: "cli" },


        ],
      },
      {
        id: "ws-01",
        name: "WS-01",
        type: "workstation",
        position: { x: 18, y: 72  },
        layer: 1,
        status: "online",
        ip: "10.0.0.100",
        room: "Operations Bay 1",
        tools: [
          {
            id: "file-explorer",
            name: "File Explorer",
            label: "Explorer",
            path: "Taskbar → File Explorer",
            type: "gui" },


          {
            id: "powershell",
            name: "PowerShell",
            label: "PowerShell",
            path: "Start → Windows PowerShell",
            type: "cli" },


          {
            id: "cmd",
            name: "Command Prompt",
            label: "CMD",
            path: "Start → cmd",
            type: "cli" },


        ],
      },
      {
        id: "switch-01",
        name: "Core-SW-01",
        type: "switch",
        position: { x: 82, y: 38  },
        layer: 3,
        status: "online",
        ip: "10.0.0.2",
        room: "IT Closet",
        tools: [
          {
            id: "cisco-cli",
            name: "Cisco IOS CLI",
            label: "IOS CLI",
            path: "Console Cable → PuTTY",
            type: "cli" },


        ],
      }
    ],
  },
  tasks: [{
      id: "t1",
      title: "Build asset inventory",
      description: "Catalog all servers, network gear, printers, and endpoints with serials, IPs, and locations.",
      order: 1,
      steps: [
        { instruction: "Open the Asset Inventory page in the sidebar — it's pre-seeded with the warehouse site inventory", tool: "Sidebar → Assets (or /assets)", expectedResult: "Inventory page shows 12 rows: DC-01, FS-01, Core-SW-01, 5 workstations, 2 printers, VC-Codec, UPS-01" },

{ instruction: "Click 'Show Template' to view the CSV template format with all required columns", tool: "Assets page → Show Template button (top right of the hint card)", expectedResult: "CSV template visible with columns: Name, Type, IP, MAC, Serial, Location, Status" },

{ instruction: "Click 'CSV' to download the asset inventory as a CSV file you can use offline", tool: "Assets page header → CSV button", expectedResult: "warehouse-asset-inventory.csv downloaded to your machine" },

{ instruction: "Walk the floor and cross-check every asset in the inventory against its physical label and location", tool: "Physical walkthrough — check name, IP, location, and serial tag on each device", expectedResult: "All 12 assets physically verified — two mismatches expected (W-04 IP and Printer-Pick-2 location)" },

{ instruction: "Identify W-04: its inventory says 10.0.0.45, but the device actually responds on 10.0.0.50. Note this as a stale IP record", tool: "Ping W-04 from any workstation: ping 10.0.0.45 → timeout; ping 10.0.0.50 → reply", expectedResult: "Confirmed: W-04 has wrong IP in inventory", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Identify Printer-Pick-2: its inventory says Bay 3, but the printer is physically in Bay 5 after the renovation. Note this as a stale location record", tool: "Walk the floor — look in Bay 3 (missing) and Bay 5 (found)", expectedResult: "Confirmed: Printer-Pick-2 is in Bay 5, not Bay 3" },

{ instruction: "Document both findings in the lab evidence panel before moving to the incident phase", tool: "Lab → Evidence phase, add two items: 'W-04 IP mismatch' and 'Printer-Pick-2 location mismatch'", expectedResult: "Two evidence items collected", nodeId: "fs-01", toolId: "file-explorer" },

      ],
    },
{
      id: "t2",
      title: "Document IP/VLAN plan",
      description: "Map IP ranges, subnets, gateway, VLANs, and DNS/DHCP scopes.",
      order: 2,
      steps: [
        { instruction: "Open the Interactive Lab Environment below the task list and click the switch (Core-SW-01)", tool: "Tasks → Interactive Lab Environment → click Core-SW-01 → click IOS CLI", expectedResult: "Switch CLI opens", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Run 'show vlan brief' in the switch CLI to see all configured VLANs", command: "show vlan brief", tool: "Switch CLI → type: show vlan brief", expectedResult: "VLAN list: 1 (default), 10 (Operations), 20 (IT), 30 (Server)", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Now click DC-01 in the environment and open Server Manager", tool: "Interactive environment → click DC-01 → click Server Manager", expectedResult: "Server Manager dashboard opens", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "From the Server Manager, verify the roles installed: AD DS, DNS, DHCP", tool: "Server Manager → Tools menu", expectedResult: "AD DS, DNS, DHCP all listed and Running", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Click DHCP in the right panel to see scope details (range, lease duration, options)", tool: "Server Manager → Tools → DHCP, or right panel → DHCP button", expectedResult: "Scope 10.0.0.0 visible with range, lease duration, and options (router, DNS, domain name)", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Document each subnet in a Markdown file: network, mask, gateway, DNS, DHCP range", tool: "Sidebar → SOPs → New SOP, or any Markdown file in shared drive", expectedResult: "IP plan table with at least VLAN 10/20/30" },

{ instruction: "Verify DNS is pointing to the right DC", command: "nslookup warehouse.local", tool: "Interactive environment → click DC-01 → PowerShell → type: nslookup warehouse.local", expectedResult: "Returns DC-01 IP address (10.0.0.10)", nodeId: "dc-01", toolId: "powershell" },

      ],
    },
{
      id: "t3",
      title: "Create network diagram",
      description: "Use diagrams.net to show physical and logical topology.",
      order: 3,
      steps: [
        { instruction: "Open diagrams.net in a browser tab to draw the topology", tool: "Browser: https://app.diagrams.net", expectedResult: "Blank canvas" },

{ instruction: "Add the Internet (cloud), Firewall, and Core-SW-01 as the top tier — drag from the Network shape library", tool: "Drag from 'Network' library", expectedResult: "Three icons at the top of the diagram" },

{ instruction: "Add DC-01, FS-01, and Print Server on the next tier — drag from the Servers shape library", tool: "Drag from 'Servers' shape library", expectedResult: "Three server icons with labels" },

{ instruction: "Add an Access Switch below and label VLANs 10 (Operations), 20 (IT), 30 (Server) — use the text labels", tool: "Network library + text labels", expectedResult: "VLAN labels visible next to access switch" },

{ instruction: "Add 5 workstations, 2 printers, 1 conference device, and 1 UPS at the bottom — use the Endpoint library", tool: "Endpoint shape library", expectedResult: "All 9 endpoints connect to access switch" },

{ instruction: "Save the diagram as a PNG and add it to the evidence panel as a deliverable", tool: "File → Export as → PNG, then Lab → Evidence → 'Network Diagram'", expectedResult: "Diagram saved and evidence item added" },

      ],
    },
{
      id: "t4",
      title: "Define critical services",
      description: "List which services are production-critical and their recovery priorities (RTO/RPO).",
      order: 4,
      steps: [
        { instruction: "Open the Interactive Lab Environment, click DC-01, and open Server Manager to list every role installed", tool: "Tasks → Interactive Lab Environment → click DC-01 → click Server Manager", expectedResult: "Server Manager dashboard shows: AD DS, DNS, DHCP, File Services", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "For each service, classify: Tier 1 (critical), Tier 2 (important), Tier 3 (nice-to-have)", tool: "Create a new SOP and use the markdown table for tiers", expectedResult: "Each service tagged with a tier" },

{ instruction: "Assign an RTO (Recovery Time Objective) and RPO (Recovery Point Objective) per service", tool: "Same SOP — add RTO and RPO columns", expectedResult: "RTO and RPO columns filled in for all 4 services" },

{ instruction: "Save the tier list as a deliverable in the evidence panel", tool: "Lab → Evidence phase → add 'Critical Services Tier List' as evidence", expectedResult: "Evidence item added" },

      ],
    },
{
      id: "t5",
      title: "Create daily health checklist",
      description: "Document morning checks (services, backups, disk space, errors).",
      order: 5,
      steps: [
        { instruction: "Open the SOPs page from the sidebar", tool: "Sidebar → SOPs (or /sops)", expectedResult: "SOPs page opens — empty initially" },

{ instruction: "Create a new SOP titled 'Daily IT Health Checklist'", tool: "SOPs page → New SOP button", expectedResult: "New SOP editor opens" },

{ instruction: "In the SOP body, list morning checks: AD replication, DNS resolution, DHCP lease pool, backup status, disk space, event viewer errors", tool: "SOP body (Markdown)", expectedResult: "Section headers for each check" },

{ instruction: "For each check, document the tool and expected result (e.g., 'AD Replication: repadmin /replsummary → expect 0 failures')", tool: "SOP body", expectedResult: "Each step has a 'Go to' command and 'Expected' result" },

{ instruction: "Save the SOP, then add it as an evidence item in this lab", tool: "SOPs page → Save → Lab → Evidence → 'Daily IT Health Checklist'", expectedResult: "SOP saved and evidence collected" },

      ],
    },
{
      id: "t6",
      title: "Find the documentation errors",
      description: "Two faults are planted in the documentation. Find them by gathering evidence.",
      order: 6,
      steps: [
        { instruction: "Open the Interactive Lab Environment below the task list, click WS-01, then click PowerShell", tool: "Lab → Tasks → Interactive Lab Environment → click WS-01 → click PowerShell", expectedResult: "PowerShell panel opens", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "In the PowerShell panel, run 'ping 10.0.0.45' — this should timeout because W-04 is not on that IP", command: "ping 10.0.0.45", tool: "PowerShell panel → type: ping 10.0.0.45", expectedResult: "Request timed out", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Now run 'ping 10.0.0.103' — this should succeed because that's W-04's actual IP (not 10.0.0.45 as the inventory says)", command: "ping 10.0.0.103", tool: "PowerShell panel → type: ping 10.0.0.103", expectedResult: "Reply from 10.0.0.103 — confirms inventory is wrong", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Open the Assets page and check Printer-Pick-2's recorded location (Bay 3)", tool: "Sidebar → Assets → search for 'Printer-Pick-2'", expectedResult: "Inventory shows Bay 3, but the device is physically in Bay 5" },

{ instruction: "Document both findings as evidence in the lab", tool: "Lab → Evidence phase → Add two evidence items", expectedResult: "Two evidence items collected" },

{ instruction: "Submit your diagnosis: documentation hygiene issue, not a service outage", tool: "Lab → Incident phase → Diagnosis input field", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc01",
    severity: "medium",
    symptoms: [
      "Endpoint W-04 is not reachable from the inventory",
      "Documentation does not match reality",
    ],
    affectedAssets: ["W-04", "Printer-Pick-2"],
    initialState: {
      "W-04": "listed as 10.0.0.45 but responds on 10.0.0.103",
      "Printer-Pick-2": "listed in Bay 3, physically in Bay 5",
    },
    hiddenRootCause:
      "Two documentation errors exist: W-04 IP address is wrong in the inventory (recorded as 10.0.0.45, actual is 10.0.0.103 after a switchport reassignment), and Printer-Pick-2 was moved to Bay 5 during renovation but the inventory still says Bay 3. This is a documentation/hygiene issue, not a service outage.",
    allowedActions: [
      "ping",
      "nslookup",
      "ipconfig",
      "walk the floor",
      "check inventory",
      "verify physical location",
    ],
    forbiddenActions: [
      "rebuild server",
      "change IP of W-04",
      "decommission printer",
    ],
    evidenceRevealedOnAction: {
      "ping": [
        { id: "ev1", label: "Ping W-04", value: "Reply from 10.0.0.103, not 10.0.0.45 as inventory says", collectedAt: "" },
      ],
      "check inventory": [
        { id: "ev2", label: "Inventory vs reality mismatch on W-04", value: "Inventory IP 10.0.0.45, actual 10.0.0.103", collectedAt: "" },
      ],
      "walk the floor": [
        { id: "ev3", label: "Printer-Pick-2 physical location mismatch", value: "Listed in Bay 3, physically in Bay 5", collectedAt: "" },
      ],
    },
    resolution:
      "Update the asset inventory with correct IP for W-04 (10.0.0.103) and correct location for Printer-Pick-2 (Bay 5). Document the lesson learned: establish a routine inventory audit.",
    businessImpact:
      "Incorrect documentation leads to longer incident response times and misrouted support calls. A 30-minute error becomes 4 hours.",
  },
  hints: [
    { level: 1, text: "When you cannot reach an endpoint, where is the first place you verify the expected address?" },
    { level: 2, text: "Compare what the documentation says to what is actually true on the network and in the room." },
    { level: 3, text: "Try 'ping' and 'ipconfig' from the client, and physically walk the floor to confirm asset locations." },
    { level: 4, text: "If the inventory says 10.0.0.45 but ping shows 10.0.0.103, the inventory is stale. The asset has not changed — the record has." },
    { level: 5, text: "Solution: correct the inventory and add a quarterly audit cadence. Do not change W-04's IP — that is a working machine." },
  ],
  validation: [
    { id: "v1", description: "Inventory accurately lists W-04 IP", command: "ping 10.0.0.103 (from WS-01)", expectedResult: "Reply from 10.0.0.103, confirms actual IP", points: 5 },
    { id: "v2", description: "Printer-Pick-2 location matches physical reality", command: "Walk floor inspection", expectedResult: "Inventory says Bay 3, physically in Bay 5", points: 5 },
    { id: "v3", description: "Network diagram includes all VLANs", command: "Open diagram", expectedResult: "VLAN 10, 20, 30 all present", points: 5 },
    { id: "v4", description: "Daily checklist covers all critical services", command: "Review checklist", expectedResult: "DC, DNS, DHCP, File Server all covered", points: 5 },
  ],
  rubric: [
    { criterion: "Inventory accuracy", description: "All 5 workstations, 2 printers, 1 switch, 1 server documented", maxPoints: 20 },
    { criterion: "Network diagram", description: "Clear topology with VLANs and IPs labeled", maxPoints: 15 },
    { criterion: "Critical services", description: "RTO/RPO assigned per service", maxPoints: 15 },
    { criterion: "Daily checklist", description: "Actionable, time-boxed morning routine", maxPoints: 15 },
    { criterion: "Troubleshooting evidence", description: "Found both planted documentation errors", maxPoints: 20 },
    { criterion: "Production safety", description: "Did not change working systems", maxPoints: 15 },
  ],
  requiredEvidence: [
    "Asset inventory (CSV/MD)",
    "Network diagram (image or link)",
    "Daily health checklist",
    "Critical service tier list",
  ],
  deliverables: [
    "Asset inventory",
    "Network diagram",
    "Dependency map",
    "Daily health checklist",
    "Escalation matrix",
    "Test report",
  ],
  interviewQuestion:
    "Walk me through how you took ownership of an undocumented site. What was your first 30 minutes, and what did you refuse to do until documentation was complete?",
};
