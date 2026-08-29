import type { Lab } from "@/types";

export const lab04: Lab = {
  id: "lab04",
  number: 4,
  title: "DHCP Scope & Failure Recovery",
  category: "networking",
  difficulty: "intermediate",
  estimatedMinutes: 60,
  objectives: [
    "Configure a DHCP scope with exclusions and reservations",
    "Understand DHCP relay/IP helper",
    "Test client lease acquisition",
    "Recover from DHCP scope exhaustion",
    "Diagnose rogue DHCP issues",
  ],
  prerequisites: ["Lab 03 — DNS Troubleshooting"],
  scenario:
    "Workstations and scanners are intermittently unable to get IP addresses. The DHCP server appears to be running, but clients are falling back to APIPA.",
  environment: [
    "Windows Server with DHCP role",
    "Layer 2 switch",
    "VLAN interface or DHCP relay",
    "5 test clients",
  ],
  interactiveEnvironment: {
    theme: "server_room",
    title: "Windows Server Environment",
    nodes: [
      {
        id: "dc-01",
        name: "DC-01",
        type: "server",
        position: { x: 20, y: 40  },
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
            name: "Group Policy Mgmt",
            label: "GPO",
            path: "Server Manager → Tools → Group Policy",
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
        position: { x: 50, y: 40  },
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
            name: "DFS Management",
            label: "DFS",
            path: "Server Manager → Tools → DFS",
            type: "gui" },


          {
            id: "file-explorer",
            name: "File Explorer",
            label: "Explorer",
            path: "\\fs-01\Shares",
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
        id: "ws-01",
        name: "WS-01",
        type: "workstation",
        position: { x: 80, y: 40  },
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
      }
    ],
  },
  tasks: [{
      id: "t1",
      title: "Verify DHCP service",
      description: "Confirm the DHCP Server service is running and authorized in AD.",
      order: 1,
      steps: [
        { instruction: "Open DHCP console on the DHCP server", tool: "Server Manager → Tools → DHCP", expectedResult: "DHCP snap-in opens", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Expand IPv4 in the left panel and check the server icon", tool: "DHCP console left panel", expectedResult: "Green server icon indicates running; red means stopped", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Right-click the DHCP server → Properties → DNS tab — verify 'Dynamically update DNS A and PTR records' is enabled", tool: "Server Properties → DNS tab", expectedResult: "Both A and PTR update options checked", nodeId: "dc-01", toolId: "dns" },

{ instruction: "Check Authorization status at the top of DHCP console", tool: "DHCP console", expectedResult: "Shows 'Authorized' — unauthorized servers will not lease IPs", nodeId: "dc-01", toolId: "dhcp" },

      ],
    },
{
      id: "t2",
      title: "Review scope",
      description: "Inspect the existing scope, exclusions, and lease times.",
      order: 2,
      steps: [
        { instruction: "In DHCP console, expand IPv4 → Scope [10.0.0.0] → Scope Properties", tool: "DHCP console → Scope node", expectedResult: "Scope properties dialog opens", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Review: Start IP: 10.0.0.100, End IP: 10.0.0.200, Subnet mask: 255.255.255.0", tool: "Scope General tab", expectedResult: "Range covers 101 addresses total" },

{ instruction: "Click Scope Options to review DHCP options: 003 Router, 006 DNS Servers, 015 Domain Name", tool: "DHCP console → Scope Options", expectedResult: "Router (gateway), DNS, and domain name all configured", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Navigate to Address Leases — count how many active leases exist", tool: "DHCP console → Address Leaves node", expectedResult: "101 leases shown (all 101 addresses in use)", nodeId: "dc-01", toolId: "dhcp" },

      ],
    },
{
      id: "t3",
      title: "Test client lease",
      description: "Run ipconfig /release and ipconfig /renew on a client.",
      order: 3,
      steps: [
        { instruction: "On WS-01, open Command Prompt as Administrator", tool: "Start → cmd → right-click → Run as administrator", expectedResult: "Admin CMD opens", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: ipconfig /all | findstr \"DHCP Server\" to confirm the DHCP server", tool: "Command Prompt", expectedResult: "DHCP Server: 10.0.0.10", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: ipconfig /release to release the current lease", tool: "Command Prompt", expectedResult: "IPv4 address cleared", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: ipconfig /renew to request a new lease", tool: "Command Prompt", expectedResult: "Receives 169.254.x.x (APIPA) — scope is full", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document this finding as evidence: scope is exhausted, clients receiving APIPA", tool: "Evidence panel", expectedResult: "Evidence item: scope exhaustion confirmed" },

      ],
    },
{
      id: "t4",
      title: "Check scope utilization",
      description: "View DHCP console for scope exhaustion indicators.",
      order: 4,
      steps: [
        { instruction: "In DHCP console, right-click the Scope → Display Statistics", tool: "DHCP console → Scope right-click", expectedResult: "Statistics window shows in-use vs free addresses", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Run PowerShell: Get-DhcpServerv4ScopeStatistics -ComputerName DC-01", tool: "PowerShell on DHCP server", expectedResult: "Shows: PercentageInUse: 100%, Free: 0, InUse: 101", nodeId: "dc-01", toolId: "dhcp" },

        { instruction: "Run: Get-DhcpServerv4Lease -ComputerName DC-01 | Where-Object {$_.LeaseExpiry -lt (Get-Date)} to find stale leases", tool: "PowerShell", expectedResult: "Lists expired leases still holding addresses" },
      ],
    },
{
      id: "t5",
      title: "Resolve planted fault",
      description: "Restore DHCP availability for new clients.",
      order: 5,
      steps: [
        { instruction: "In DHCP console, right-click Scope → Properties → edit End IP from 10.0.0.200 to 10.0.0.250", tool: "DHCP Scope Properties → IP Address Range", expectedResult: "Scope expanded from 101 to 151 addresses", nodeId: "dc-01", toolId: "dhcp" },

{ instruction: "Change lease duration from 1 hour to 8 hours", tool: "DHCP Scope Properties → General tab", expectedResult: "Lease duration updated", nodeId: "dc-01", toolId: "dhcp" },

        { instruction: "Run: Get-DhcpServerv4Lease -ComputerName DC-01 | Where-Object {$_.LeaseExpiry -lt (Get-Date)} | Remove-DhcpServerv4Lease to clear stale leases", tool: "PowerShell as admin", expectedResult: "Expired leases cleared from the database" },
{ instruction: "On WS-01, run: ipconfig /renew again", tool: "Command Prompt on WS-01", expectedResult: "Receives a valid 10.0.0.x address from the expanded scope", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document evidence: APIPA before fix, valid IP after fix, scope stats updated", tool: "Evidence panel", expectedResult: "3 evidence items collected" },

      ],
    },
  ],
  incident: {
    id: "inc04",
    severity: "high",
    symptoms: [
      "Clients receive 169.254.x.x addresses (APIPA)",
      "DHCP server shows 100% scope utilization",
      "Scanners cannot connect",
    ],
    affectedAssets: ["DHCP-01", "All dynamic clients", "Scanners"],
    initialState: {
      "Scope": "10.0.0.0/24, range 10.0.0.100-10.0.0.200",
      "Status": "100% utilized due to short leases and many devices",
    },
    hiddenRootCause:
      "DHCP scope exhaustion: the scope is fully leased, and lease duration is 1 hour. New clients cannot get an address. The fix is to expand the scope or extend the lease, then audit stale leases.",
    allowedActions: [
      "Get-DhcpServerv4Lease",
      "Get-DhcpServerv4Scope",
      "ipconfig /release /renew",
      "check DHCP console",
    ],
    forbiddenActions: ["delete all leases", "reduce lease time further"],
    evidenceRevealedOnAction: {
      "Get-DhcpServerv4Scope": [
        { id: "ev1", label: "Scope stats", value: "Addresses in use: 101/101 (100%)", collectedAt: "" },
      ],
      "ipconfig /renew": [
        { id: "ev2", label: "Client fallback", value: "169.254.32.18 (APIPA)", collectedAt: "" },
      ],
    },
    resolution:
      "Expand the scope to 10.0.0.100-10.0.0.250 and extend lease time to 8 hours. Audit and remove stale leases from decommissioned devices.",
    businessImpact:
      "DHCP exhaustion silently takes down all dynamic clients — scanners, workstations, IoT devices. Operations grind to a halt.",
  },
  hints: [
    { level: 1, text: "If a client cannot get an IP but the service is running, is the problem the service or the data?" },
    { level: 2, text: "What is the utilization of the DHCP scope, and how long are leases held?" },
    { level: 3, text: "Open the DHCP console and look at Address Leases and Scope Statistics. Also try 'ipconfig /renew' on a fresh client." },
    { level: 4, text: "100% utilization with short leases means you are churning devices. The scope is too small or the lease too short." },
    { level: 5, text: "Solution: expand the scope, extend the lease, then audit. Consider reservations for scanners." },
  ],
  validation: [
    { id: "v1", description: "Scope utilization below 80%", command: "DHCP console scope stats", expectedResult: "Less than 80% utilized", points: 10 },
    { id: "v2", description: "New client gets a real IP", command: "ipconfig /renew", expectedResult: "Receives 10.0.0.x address", points: 10 },
    { id: "v3", description: "Lease time is reasonable", command: "Get-DhcpServerv4Scope", expectedResult: "Lease duration >= 8 hours", points: 5 },
  ],
  rubric: [
    { criterion: "Scope design", description: "Appropriate range, exclusions, reservations", maxPoints: 20 },
    { criterion: "Diagnosis", description: "Identified exhaustion, not service failure", maxPoints: 25 },
    { criterion: "Fix", description: "Expanded scope, did not destroy leases", maxPoints: 25 },
    { criterion: "Documentation", description: "Updated asset inventory with new range", maxPoints: 15 },
    { criterion: "Production safety", description: "Did not delete all leases", maxPoints: 15 },
  ],
  requiredEvidence: ["DHCP scope screenshot", "ipconfig output", "Scope stats"],
  deliverables: ["Updated DHCP plan", "Lease audit report", "Fix steps"],
  interviewQuestion:
    "A scanner cannot get on the network. The user says it was working yesterday. Walk me through how you determine if it is the scanner, the cable, the switch port, the VLAN, or DHCP.",
};
