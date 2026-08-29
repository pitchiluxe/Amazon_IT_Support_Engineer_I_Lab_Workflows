import type { Lab } from "@/types";

export const lab07: Lab = {
  id: "lab07",
  number: 7,
  title: "Windows Print Services",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 60,
  objectives: [
    "Deploy a print server role",
    "Add and share a printer",
    "Deploy printers via Group Policy",
    "Diagnose print queue issues",
  ],
  prerequisites: ["Lab 02 — Active Directory Domain Controller"],
  scenario:
    "The warehouse has 5 network printers shared by 30+ users. A recurring issue is the 'printer is offline' or 'print job stuck' complaint. You will deploy a print server and create a procedure to handle these.",
  environment: [
    "Windows Server with Print Server role",
    "Network printer (or simulated)",
    "Windows client",
    "Test users",
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
      title: "Install Print Server role",
      description: "Add Print and Document Services role.",
      order: 1,
      steps: [
        { instruction: "Open Server Manager on the print server (e.g., FS-01)", tool: "Start Menu → Server Manager", expectedResult: "Server Manager dashboard loads", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Click Manage → Add Roles and Features", tool: "Server Manager toolbar", expectedResult: "Add Roles and Features Wizard opens", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Click Next until Server Roles, expand Print and Document Services → check Print Server", tool: "Server Roles step", expectedResult: "Print Server checkbox selected" },

{ instruction: "Click Next → Install, wait for completion", tool: "Wizard confirmation", expectedResult: "Print Server role installed successfully" },

{ instruction: "Open Print Management: Server Manager → Tools → Print Management", tool: "Server Manager → Tools", expectedResult: "Print Management console opens", nodeId: "dc-01", toolId: "server-manager" },

      ],
    },
{
      id: "t2",
      title: "Add and share printer",
      description: "Add a network printer and share it.",
      order: 2,
      steps: [
        { instruction: "In Print Management, expand Print Server → right-click Printers → Add Printer", tool: "Print Management → Printers node", expectedResult: "Add Printer Wizard opens", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Select 'Add a TCP/IP or Web Services Printer by IP address or hostname'", tool: "Add Printer Wizard → first page", expectedResult: "IP address entry screen", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Enter the printer's IP address (e.g., 10.0.0.50) and click Next", tool: "Printer IP dialog", expectedResult: "Wizard detects printer type", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Select the appropriate printer driver from the list, click Next", tool: "Driver selection dialog", expectedResult: "Driver selected" },

{ instruction: "Enter printer name: Warehouse-Printer-01, check 'Share this printer', click Next", tool: "Printer name and sharing step", expectedResult: "Printer shared as Warehouse-Printer-01", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Click Finish — verify the printer appears under Printers in Print Management", tool: "Print Management console", expectedResult: "Printer listed with green status icon", nodeId: "fs-01", toolId: "file-explorer" },

      ],
    },
{
      id: "t3",
      title: "Deploy via GPO",
      description: "Use Group Policy Preferences to deploy printer to users.",
      order: 3,
      steps: [
        { instruction: "Open Group Policy Management", tool: "Server Manager → Tools → Group Policy Management", expectedResult: "GPM opens", nodeId: "dc-01", toolId: "gpo" },

{ instruction: "Navigate to Forest: warehouse.local → Domains → warehouse.local → right-click the Operations OU → Create a GPO in this domain → Link it here", tool: "GPM → Operations OU right-click", expectedResult: "New GPO dialog: name it 'Deploy-Printers'", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Right-click 'Deploy-Printers' GPO → Edit", tool: "GPM → GPO right-click → Edit", expectedResult: "Group Policy Management Editor opens", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Navigate to: User Configuration → Preferences → Control Panel Settings → Printers", tool: "GPO Editor left panel", expectedResult: "Printers node selected", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Right-click Printers → New → Shared Printer", tool: "Printers node right-click", expectedResult: "New Shared Printer dialog opens" },

{ instruction: "Set: Action: Create, Printer path: \\\\FS-01\\Warehouse-Printer-01, check 'Run in logged-on user's security context' → click OK", tool: "New Shared Printer dialog", expectedResult: "Printer deployment configured", nodeId: "fs-01", toolId: "file-explorer" },

      ],
    },
{
      id: "t4",
      title: "Test print",
      description: "Print a test page from a client.",
      order: 4,
      steps: [
        { instruction: "On WS-01, log in as a user in the Operations OU (e.g., jsmith)", tool: "Windows logon screen", expectedResult: "Logged into domain" },

{ instruction: "Open Control Panel → Devices and Printers", tool: "Start → Control Panel", expectedResult: "Devices and Printers window opens" },

{ instruction: "Verify Warehouse-Printer-01 appears in the printer list", tool: "Devices and Printers", expectedResult: "Printer appears and shows 'Ready'" },

{ instruction: "Right-click the printer → Printer Properties → click Print Test Page", tool: "Printer right-click → Properties", expectedResult: "Test page prints (or shows in queue)", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Open Print Management on the server → navigate to the printer's queue to confirm the test page arrived", tool: "Print Management → server → printer queue", expectedResult: "Job visible in queue, status: Printed", nodeId: "fs-01", toolId: "file-explorer" },

      ],
    },
{
      id: "t5",
      title: "Diagnose planted fault",
      description: "Users cannot print. Find the cause.",
      order: 5,
      steps: [
        { instruction: "On WS-01, try to print a test page — it shows 'Offline' or stays queued indefinitely", tool: "Devices and Printers → printer", expectedResult: "Printer shows Offline or jobs stuck", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Open PowerShell on the print server, run: Get-Printer | Format-List Name,PortName,Shared", tool: "PowerShell on print server", expectedResult: "Shows printer port is 10.0.0.50 (old/stale IP)", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Run: Get-PrinterPort to confirm the port IP is wrong", tool: "PowerShell on print server", expectedResult: "Port IP shows outdated address", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Ping the printer IP — it should fail (printer was moved)", tool: "PowerShell → ping <old IP>", expectedResult: "Request timed out — printer not at that IP", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Document evidence: printer port points to wrong IP, causing offline status", tool: "Evidence panel", expectedResult: "Evidence: port misconfiguration confirmed" },

{ instruction: "Submit diagnosis: print queue port IP is stale — printer was moved but port not updated", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc07",
    severity: "medium",
    symptoms: [
      "Print jobs are stuck in queue",
      "Printer shows 'Offline' on clients",
    ],
    affectedAssets: ["Print Server", "Printer-01"],
    initialState: {
      "Print Spooler": "Running",
      "Printer-01": "Network port set to wrong IP",
    },
    hiddenRootCause:
      "The print queue's port is configured to point to a wrong IP address. The printer physically moved, but the port was never updated. Fix: update the port IP to the new printer address.",
    allowedActions: [
      "Get-Printer",
      "Get-PrinterPort",
      "Test-NetConnection",
      "restart spooler",
      "check printer console",
    ],
    forbiddenActions: [
      "remove printer from server",
      "delete all drivers",
    ],
    evidenceRevealedOnAction: {
      "Get-PrinterPort": [
        { id: "ev1", label: "Printer-01 port", value: "Port IP: 10.0.0.50 (old IP)", collectedAt: "" },
      ],
    },
    resolution:
      "Update the printer port IP address to match the printer's new network location. Then restart the Print Spooler service.",
    businessImpact:
      "Users cannot print. Production documents, labels, and picking lists cannot be produced.",
  },
  hints: [
    { level: 1, text: "The printer shows Offline. Is the printer itself the problem or the port configuration?" },
    { level: 2, text: "Can the print server reach the printer IP address?" },
    { level: 3, text: "Run 'Get-PrinterPort' on the print server and 'Test-NetConnection <printer IP>'." },
    { level: 4, text: "The port IP may point to a printer that was moved. Check the printer console for its current IP." },
    { level: 5, text: "Solution: update the port IP in Print Management → Printer Properties → Ports → change the TCP/IP port address." },
  ],
  validation: [
    { id: "v1", description: "Printer is online", command: "Get-Printer", expectedResult: "Printer status: Ready", points: 10 },
    { id: "v2", description: "Test page prints", command: "Print test page from client", expectedResult: "Page completes successfully", points: 10 },
  ],
  rubric: [
    { criterion: "Print server deployment", description: "Role installed, printer shared correctly", maxPoints: 20 },
    { criterion: "GPO deployment", description: "Printer deployed via policy", maxPoints: 20 },
    { criterion: "Diagnosis", description: "Found port misconfiguration", maxPoints: 25 },
    { criterion: "Fix", description: "Updated port without removing printer", maxPoints: 20 },
    { criterion: "Documentation", description: "Printer config documented", maxPoints: 15 },
  ],
  requiredEvidence: ["Print Management screenshot", "GPO screenshot", "Test page confirmation"],
  deliverables: ["Print server SOP", "Printer deployment guide", "Troubleshooting guide"],
  interviewQuestion:
    "A user says their print jobs are stuck. Walk me through how you diagnose this from the client to the printer.",
};
