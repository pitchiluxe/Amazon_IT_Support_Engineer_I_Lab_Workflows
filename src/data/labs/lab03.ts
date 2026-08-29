import type { Lab } from "@/types";

export const lab03: Lab = {
  id: "lab03",
  number: 3,
  title: "DNS Troubleshooting",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 60,
  objectives: [
    "Configure internal DNS",
    "Create A, CNAME and reverse (PTR) records",
    "Test resolution with nslookup and Resolve-DnsName",
    "Trace DNS resolution from client to server",
    "Identify stale, missing or wrong records",
  ],
  prerequisites: ["Lab 02 — Active Directory Domain Controller"],
  scenario:
    "Users report that internal applications sometimes cannot be reached by hostname. The DC is functioning but resolution is inconsistent.",
  environment: [
    "Windows Server with AD DS and DNS",
    "Windows 11 client",
    "Internal app hostname (e.g., app.warehouse.local)",
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
      title: "Verify DNS service",
      description: "Confirm DNS service is running on the DC.",
      order: 1,
      steps: [
        { instruction: "Open DNS Manager on DC-01", tool: "Server Manager → Tools → DNS", expectedResult: "DNS Manager snap-in opens", nodeId: "dc-01", toolId: "dns" },

{ instruction: "Click on DC-01 in the left panel to view server properties", tool: "DNS Manager tree", expectedResult: "Server properties visible", nodeId: "dc-01", toolId: "dns" },

{ instruction: "Check that the DNS Server service status is Running", tool: "Task Manager → Services tab → DNS", expectedResult: "Status shows Running", nodeId: "dc-01", toolId: "dns" },

{ instruction: "In DNS Manager, verify DNS server is listening on the correct IP (e.g. 10.0.0.10)", tool: "DNS Manager → right-click DC-01 → Properties → Interfaces", expectedResult: "Listening on correct internal IP only", nodeId: "dc-01", toolId: "dns" },

      ],
    },
{
      id: "t2",
      title: "Add A and CNAME records",
      description: "Create A record for app.warehouse.local, CNAME for www.app.warehouse.local.",
      order: 2,
      steps: [
        { instruction: "In DNS Manager, expand Forward Lookup Zones → warehouse.local", tool: "DNS Manager → Forward Lookup Zones", expectedResult: "Zone contents visible", nodeId: "dc-01", toolId: "dns" },

{ instruction: "Right-click in the right panel → New Host (A or AAAA)", tool: "Zone right-click menu", expectedResult: "New Host dialog opens" },

{ instruction: "Enter name: app, IP address: 10.0.0.100, click Add Host", tool: "New Host dialog", expectedResult: "A record created: app.warehouse.local → 10.0.0.100" },

{ instruction: "Create another A record: fs-01 (10.0.0.11) and dc-01 (10.0.0.10)", tool: "New Host dialog", expectedResult: "All A records visible in zone" },

{ instruction: "Right-click warehouse.local → New Alias (CNAME), name: www.app, target host: app.warehouse.local", tool: "Zone right-click → New Alias", expectedResult: "CNAME: www.app.warehouse.local → app.warehouse.local" },

      ],
    },
{
      id: "t3",
      title: "Add reverse PTR",
      description: "Add reverse lookup zone and PTR record.",
      order: 3,
      steps: [
        { instruction: "In DNS Manager, right-click Reverse Lookup Zones → New Zone", tool: "DNS Manager → Reverse Lookup Zones", expectedResult: "New Zone Wizard opens", nodeId: "dc-01", toolId: "dns" },

{ instruction: "Select Primary zone, accept defaults, click Next through until you enter the network ID", tool: "Zone type step", expectedResult: "Primary zone selected" },

{ instruction: "Enter the network portion: 10.0.0 (for the 10.0.0.x subnet)", tool: "Reverse Lookup Zone network ID step", expectedResult: "Reverse zone created: 0.0.10.in-addr.arpa" },

{ instruction: "Navigate to the new reverse zone, right-click → New Pointer (PTR)", tool: "Reverse zone right-click", expectedResult: "New Resource Record dialog" },

{ instruction: "Enter host IP number: 100, browse to or type: app.warehouse.local", tool: "PTR record dialog", expectedResult: "PTR: 100 → app.warehouse.local" },

      ],
    },
{
      id: "t4",
      title: "Test from client",
      description: "Use nslookup and Resolve-DnsName from the client.",
      order: 4,
      steps: [
        { instruction: "On WS-01 (or any domain client), open PowerShell", tool: "Start → PowerShell", expectedResult: "PowerShell window opens", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Run: nslookup app.warehouse.local", tool: "PowerShell", expectedResult: "Returns: Name: app.warehouse.local, Address: 10.0.0.100", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Run: nslookup www.app.warehouse.local", tool: "PowerShell", expectedResult: "Returns canonical name: app.warehouse.local, then resolves to 10.0.0.100", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Run: nslookup 10.0.0.100 (reverse lookup)", tool: "PowerShell", expectedResult: "Returns: app.warehouse.local", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Run: Resolve-DnsName app.warehouse.local -Type A", tool: "PowerShell", expectedResult: "Returns full A record including TTL and IP", nodeId: "ws-01", toolId: "powershell" },

      ],
    },
{
      id: "t5",
      title: "Find the planted fault",
      description: "Resolution is inconsistent. Find the bad record.",
      order: 5,
      steps: [
        { instruction: "Run nslookup app.warehouse.local multiple times — some responses return 10.0.0.5 instead of 10.0.0.100", tool: "PowerShell → repeat nslookup", expectedResult: "Intermittent wrong IP in responses", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Run: Resolve-DnsName app.warehouse.local -Type A -DnsOnly", tool: "PowerShell", expectedResult: "Shows all A records including the stale one for 10.0.0.5", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Ping 10.0.0.5 — it should not respond (decommissioned server)", tool: "PowerShell → ping 10.0.0.5", expectedResult: "Request timed out — server is offline", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Document both evidence: round-robin DNS returning wrong IP and stale record confirmed offline", tool: "Evidence panel", expectedResult: "2 evidence items collected" },

{ instruction: "Submit diagnosis: stale A record for decommissioned server 10.0.0.5 causing intermittent failure", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc03",
    severity: "medium",
    symptoms: [
      "Some users can reach app.warehouse.local, others cannot",
      "Application sometimes returns 404 or wrong server",
    ],
    affectedAssets: ["DC-01", "app.warehouse.local"],
    initialState: {
      "A record": "app.warehouse.local -> 10.0.0.100 (correct)",
      "Stale A record": "An additional A record exists -> 10.0.0.5 (old server, decommissioned)",
    },
    hiddenRootCause:
      "There is a stale A record for app.warehouse.local pointing to 10.0.0.5 (an old, decommissioned server). Round-robin DNS sometimes returns the wrong IP. The fix is to delete the stale record.",
    allowedActions: [
      "nslookup",
      "Resolve-DnsName",
      "Get-DnsServerResourceRecord",
      "ping",
      "tracert",
    ],
    forbiddenActions: ["delete the zone", "restart DNS service without notice"],
    evidenceRevealedOnAction: {
      "nslookup": [
        { id: "ev1", label: "nslookup shows multiple A records", value: "Addresses: 10.0.0.100, 10.0.0.5", collectedAt: "" },
      ],
      "Resolve-DnsName": [
        { id: "ev2", label: "Resolve-DnsName confirms round-robin", value: "IPAddress: 10.0.0.5 (alternating)", collectedAt: "" },
      ],
    },
    resolution:
      "Use DNS Manager or PowerShell (Remove-DnsServerResourceRecord) to delete the stale A record for app.warehouse.local -> 10.0.0.5. Validate resolution returns only the correct IP.",
    businessImpact:
      "Wrong DNS resolution sends users to decommissioned servers, causing intermittent 404s and eroding trust in IT systems.",
  },
  hints: [
    { level: 1, text: "When resolution is 'sometimes' wrong, what does that tell you about the data, not the service?" },
    { level: 2, text: "Look for multiple records (round-robin). Are all of them supposed to be there?" },
    { level: 3, text: "Run 'nslookup app.warehouse.local 10.0.0.10' several times. Also use Resolve-DnsName to see all addresses." },
    { level: 4, text: "If one of the A records points to an IP that does not respond to ping or tracert, that record is stale." },
    { level: 5, text: "Solution: delete the stale A record. Use Remove-DnsServerResourceRecord with the correct zone, name, type, and IP." },
  ],
  validation: [
    { id: "v1", description: "Single A record for app.warehouse.local", command: "Resolve-DnsName app.warehouse.local -Type A", expectedResult: "Returns only 10.0.0.100", points: 10 },
    { id: "v2", description: "PTR record resolves", command: "nslookup 10.0.0.100", expectedResult: "Returns app.warehouse.local", points: 5 },
    { id: "v3", description: "CNAME works", command: "nslookup www.app.warehouse.local", expectedResult: "Resolves to app.warehouse.local then 10.0.0.100", points: 5 },
  ],
  rubric: [
    { criterion: "Record hygiene", description: "No stale, duplicate, or wrong records", maxPoints: 25 },
    { criterion: "Reverse DNS", description: "PTR zone configured and correct", maxPoints: 15 },
    { criterion: "Troubleshooting", description: "Used nslookup/Resolve-DnsName systematically", maxPoints: 25 },
    { criterion: "Fix quality", description: "Removed the right record, did not damage the zone", maxPoints: 20 },
    { criterion: "Production safety", description: "Did not restart DNS or delete the zone", maxPoints: 15 },
  ],
  requiredEvidence: [
    "DNS Manager screenshot",
    "nslookup output",
    "Resolve-DnsName output",
    "PTR lookup screenshot",
  ],
  deliverables: [
    "DNS map",
    "Commands used",
    "Fault isolation steps",
    "Root cause",
    "Permanent fix",
  ],
  interviewQuestion:
    "A user says 'the site is down for me.' The site is up for everyone else. How do you determine if it is DNS, network, browser, or user error before touching anything?",
};
