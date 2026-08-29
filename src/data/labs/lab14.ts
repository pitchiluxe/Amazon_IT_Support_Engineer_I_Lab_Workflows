import type { Lab } from "@/types";

export const lab14: Lab = {
  id: "lab14",
  number: 14,
  title: "High-Availability Operations Incident",
  category: "operations",
  difficulty: "advanced",
  estimatedMinutes: 90,
  objectives: [
    "Define service impact and severity during an incident",
    "Establish an incident timeline",
    "Identify the layer of failure",
    "Restore service using the safest reversible action",
    "Conduct a post-incident review",
  ],
  prerequisites: ["Lab 02 — AD", "Lab 03 — DNS", "Lab 04 — DHCP"],
  scenario:
    "A critical service becomes unavailable during a simulated production window. You are the on-call IT engineer. You must manage the incident, restore service, and document it.",
  environment: [
    "Domain controller + DNS + DHCP",
    "File server",
    "Print services",
    "Network monitoring (or simulated alerts)",
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
      title: "Define impact",
      description: "Identify which services and users are affected.",
      order: 1,
      steps: [
        { instruction: "Review the initial alert: 'DC-01 unreachable' or 'Users cannot authenticate'", tool: "Monitoring dashboard or email alert", expectedResult: "Alert details reviewed" },

{ instruction: "Categorize severity: P1 = all users down, P2 = group down, P3 = single user — for this scenario, mark P1 (critical)", tool: "Incident categorization", expectedResult: "Severity assigned: P1" },

{ instruction: "Identify affected services: AD authentication, GPO application, DNS resolution, file shares", tool: "Service dependency map", expectedResult: "Affected services listed" },

{ instruction: "Estimate user impact: how many users cannot work? All? Specific department?", tool: "ADUC user count", expectedResult: "User impact number documented", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Document impact in the incident log: time, services, users affected, severity", tool: "Incident log", expectedResult: "Impact statement written" },

      ],
    },
{
      id: "t2",
      title: "Establish timeline",
      description: "Build a timeline from first alert to current state.",
      order: 2,
      steps: [
        { instruction: "Note the time of the first alert or user report: e.g., 'Alert received at 14:23'", tool: "Email/monitoring tool", expectedResult: "T0 documented" },

{ instruction: "Log each action taken with a timestamp: e.g., '14:25 — contacted on-call teammate; 14:30 — started DC-01 health check'", tool: "Incident log", expectedResult: "Actions logged with timestamps" },

{ instruction: "Note when the service was restored (T-Restore): e.g., '15:10 — DC-01 restarted, services confirmed operational'", tool: "Incident log", expectedResult: "T-Restore documented" },

{ instruction: "Calculate total downtime: T-Restore minus T0 = total minutes of outage", tool: "Incident log calculation", expectedResult: "Total downtime calculated" },

{ instruction: "Document the complete timeline in the evidence panel", tool: "Evidence panel", expectedResult: "Timeline complete" },

      ],
    },
{
      id: "t3",
      title: "Check monitoring",
      description: "Review alerts, dependencies, recent changes.",
      order: 3,
      steps: [
        { instruction: "Open the monitoring dashboard (or simulated alert list) and review all active alerts", tool: "Monitoring dashboard", expectedResult: "Active alerts listed" },

{ instruction: "Check the DC-01 event logs: Event Viewer → Windows Logs → System — look for errors around the outage time", tool: "Event Viewer on DC-01", expectedResult: "Error events visible" },

{ instruction: "Check for recent changes: did anyone apply a GPO, install software, or modify AD in the last 24-48 hours?", tool: "ADUC audit log / GPO history", expectedResult: "Recent changes reviewed", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Check DNS and DHCP service status on DC-01", tool: "Services.msc on DC-01", expectedResult: "Service status shown" },

{ instruction: "Document the monitoring findings in the incident log", tool: "Incident log", expectedResult: "Monitoring findings documented" },

      ],
    },
{
      id: "t4",
      title: "Identify layer",
      description: "Determine if the issue is client, network, DNS, auth, server, or app.",
      order: 4,
      steps: [
        { instruction: "Check if the DC is reachable by IP: from a client, ping 10.0.0.10", tool: "Command Prompt on WS-01", expectedResult: "Ping result: success or failure", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check if DNS resolves: nslookup warehouse.local 10.0.0.10", tool: "Command Prompt", expectedResult: "DNS result returned or timeout", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check if authentication works: try logging in as a domain user on WS-01", tool: "Windows logon screen", expectedResult: "Login success or failure" },

{ instruction: "Check if file shares are accessible: try \\\\dc-01\\netlogon", tool: "File Explorer", expectedResult: "Share accessible or Access Denied", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Determine: if IP ping works but name resolution fails → DNS; if auth fails → AD; if share fails → service", tool: "Layer determination", expectedResult: "Root layer identified" },

{ instruction: "Document the failure layer and immediate cause in the incident log", tool: "Incident log", expectedResult: "Root cause layer documented" },

      ],
    },
{
      id: "t5",
      title: "Restore service",
      description: "Use the safest, most reversible action first.",
      order: 5,
      steps: [
        { instruction: "If the service is down: try the least impactful fix first (e.g., restart the service) before restarting the server", tool: "Services.msc on DC-01", expectedResult: "Service restart attempted" },

{ instruction: "If service restart doesn't work: restart the DC-01 server", tool: "Server Manager → DC-01 → Restart", expectedResult: "Server restarts", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "After restart, verify: ping dc-01.warehouse.local from WS-01", tool: "Command Prompt on WS-01", expectedResult: "Name resolves and responds", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Verify AD: log in as a domain user on WS-01", tool: "Windows logon", expectedResult: "Login successful" },

{ instruction: "Verify DNS: nslookup warehouse.local from WS-01", tool: "Command Prompt", expectedResult: "DNS resolves to 10.0.0.10", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Verify DHCP: run ipconfig /renew on WS-01", tool: "Command Prompt", expectedResult: "IP address renewed", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Update the incident log: service restored at [time], all verifications passed", tool: "Incident log", expectedResult: "Service restoration confirmed" },

      ],
    },
{
      id: "t6",
      title: "Post-incident review",
      description: "Write a brief PIR covering what happened, impact, and prevention.",
      order: 6,
      steps: [
        { instruction: "Document: what happened? (root cause), when? (timeline), who was affected? (impact)", tool: "Incident log → PIR document", expectedResult: "PIR basic facts complete" },

{ instruction: "Document: what was the fix? Was it the right fix? Was there a faster option?", tool: "PIR document", expectedResult: "Fix analysis complete" },

{ instruction: "Document: what preventive measures should be put in place? (e.g., monitoring alerts for DC service stop)", tool: "PIR document → preventive actions", expectedResult: "Prevention steps listed" },

{ instruction: "Save the PIR to the evidence panel", tool: "Evidence panel", expectedResult: "PIR saved" },

      ],
    },
  ],
  incident: {
    id: "inc14",
    severity: "high",
    symptoms: [
      "Users cannot log in",
      "File shares inaccessible",
      "DNS fails to resolve",
    ],
    affectedAssets: ["DC-01", "All domain clients"],
    initialState: {
      "DC-01": "Running but AD DS service stopped",
      "All clients": "Cannot authenticate",
    },
    hiddenRootCause:
      "The Active Directory Domain Services service on DC-01 stopped unexpectedly (or was stopped). All AD-dependent services (auth, GPO, DNS, DHCP) are affected.",
    allowedActions: [
      "ping",
      "nslookup",
      "services.msc",
      "eventvwr",
      "restart service",
      "restart server",
    ],
    forbiddenActions: ["demote DC without backup", "delete AD objects", "re-image DC without escalation"],
    evidenceRevealedOnAction: {
      "services.msc": [
        { id: "ev1", label: "AD DS service", value: "Status: Stopped, Startup type: Automatic", collectedAt: "" },
      ],
      "eventvwr": [
        { id: "ev2", label: "System log", value: "AD DS service terminated unexpectedly (Event 7038)", collectedAt: "" },
      ],
    },
    resolution:
      "Start the Active Directory Domain Services service on DC-01. Investigate why it stopped (check event log).",
    businessImpact:
      "All domain operations halted. No users can authenticate, no GPOs apply, no file shares accessible.",
  },
  hints: [
    { level: 1, text: "Is this a single service failure or a full server failure?" },
    { level: 2, text: "Check if DC-01 responds to ping. Then check the AD DS service status." },
    { level: 3, text: "Open Services.msc on DC-01 and check if 'Active Directory Domain Services' is running." },
    { level: 4, text: "If the service is stopped, start it. Then check the event log to find why it stopped." },
    { level: 5, text: "Solution: start the AD DS service. Implement monitoring to alert when it stops again." },
  ],
  validation: [
    { id: "v1", description: "Service restored", command: "Services.msc", expectedResult: "AD DS: Running", points: 10 },
    { id: "v2", description: "Users can log in", command: "Login as domain user", expectedResult: "Login successful", points: 10 },
    { id: "v3", description: "PIR documented", command: "Incident log", expectedResult: "PIR complete with prevention steps", points: 10 },
  ],
  rubric: [
    { criterion: "Impact assessment", description: "Correctly assessed scope and severity", maxPoints: 20 },
    { criterion: "Timeline", description: "Complete and accurate timeline", maxPoints: 20 },
    { criterion: "Layer identification", description: "Correctly identified the failure layer", maxPoints: 20 },
    { criterion: "Restoration", description: "Restored service safely and verified", maxPoints: 20 },
    { criterion: "Post-incident review", description: "PIR with prevention steps", maxPoints: 20 },
  ],
  requiredEvidence: ["Incident log", "Timeline", "Event log screenshot", "PIR document"],
  deliverables: ["Incident report", "Timeline", "PIR", "Prevention plan"],
  interviewQuestion:
    "You get an alert at 2am: all users are locked out. Walk me through your response from the moment you see the alert to the moment you close the incident.",
};
