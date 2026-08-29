import type { Lab } from "@/types";

export const lab08: Lab = {
  id: "lab08",
  number: 8,
  title: "Endpoint Deployment & SCCM/MECM Concepts",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 90,
  objectives: [
    "Understand endpoint management architecture",
    "Build collections, packages, and deployments in a lab",
    "Diagnose a software deployment failure",
    "Apply concepts to MECM/SCCM or equivalent tools",
  ],
  prerequisites: ["Lab 02 — Active Directory Domain Controller"],
  scenario:
    "The warehouse needs to deploy a new scanner driver to 50 workstations. You will simulate this with PowerShell remoting or a lightweight endpoint management tool. If you have MECM, you may use it.",
  environment: [
    "Domain-joined client(s)",
    "PowerShell remoting enabled",
    "A test deployment tool (or PowerShell)",
    "Sample installer (.msi or .exe)",
  ],
  interactiveEnvironment: {
    theme: "it_closet",
    title: "Network Infrastructure",
    nodes: [
      {
        id: "router-01",
        name: "WAN-Router",
        type: "router",
        position: { x: 12, y: 35  },
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
        id: "firewall-01",
        name: "FW-01",
        type: "firewall",
        position: { x: 38, y: 35  },
        layer: 3,
        status: "online",
        ip: "10.0.0.1",
        room: "IT Closet",
        tools: [
          {
            id: "cisco-cli",
            name: "Firewall Mgmt",
            label: "Firewall",
            path: "Web → https://10.0.0.1",
            type: "web" },

        ],
      },
      {
        id: "switch-01",
        name: "Core-SW-01",
        type: "switch",
        position: { x: 64, y: 35  },
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
        id: "switch-02",
        name: "Access-SW-01",
        type: "switch",
        position: { x: 88, y: 35  },
        layer: 2,
        status: "online",
        ip: "10.0.0.3",
        room: "Office",
        tools: [
          {
            id: "cisco-cli",
            name: "Cisco IOS",
            label: "IOS CLI",
            path: "Telnet → 10.0.0.3",
            type: "cli" },


        ],
      },
      {
        id: "wallplate-01",
        name: "Bay1-Wallplate",
        type: "wallplate",
        position: { x: 25, y: 68  },
        layer: 1,
        status: "online",
        room: "Bay 1",
        tools: [
          {
            id: "settings",
            name: "Patch Panel Log",
            label: "Patch",
            path: "Cabling Diagram",
            type: "settings" },

        ],
      },
      {
        id: "ws-01",
        name: "WS-01",
        type: "workstation",
        position: { x: 58, y: 68  },
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


        ],
      }
    ],
  },
  tasks: [{
      id: "t1",
      title: "Document architecture",
      description: "Diagram the management server, clients, and the deployment path.",
      order: 1,
      steps: [
        { instruction: "On DC-01, open a text editor or draw.io and create a diagram showing: Management Server → AD Group → Collection → Deployment Package → Target Clients", tool: "Text editor or draw.io", expectedResult: "Architecture diagram created" },

{ instruction: "Document the required ports: 80/443 for HTTP/HTTPS, 135/445 for file share, 5985/5986 for WinRM", tool: "Architecture diagram → notes section", expectedResult: "Port list documented" },

{ instruction: "Identify the test machine(s): WS-01 and at least one additional client", tool: "ADUC → Computers OU", expectedResult: "Test clients listed", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Save the diagram to your evidence folder", tool: "File Explorer", expectedResult: "Diagram saved as .png or .pdf", nodeId: "switch-01", toolId: "cisco-cli" },

      ],
    },
{
      id: "t2",
      title: "Build a collection/group",
      description: "Create a logical group of clients to target.",
      order: 2,
      steps: [
        { instruction: "Open Active Directory Users and Computers on DC-01", tool: "Server Manager → Tools → ADUC", expectedResult: "ADUC opens", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Navigate to Computers or a relevant OU, right-click → New → Group", tool: "ADUC → OU right-click", expectedResult: "New Object - Group dialog", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Create: Deployment-TestClients (Security, Global) — add WS-01 and one other test client as members", tool: "Group creation dialog", expectedResult: "Group created with test clients as members" },

{ instruction: "If using MECM/SCCM: open the MECM console → Assets and Compliance → Device Collections → right-click → Create Device Collection", tool: "MECM Console", expectedResult: "Collection creation wizard opens" },

{ instruction: "Name the collection 'Scanner-Driver-Deploy' and add the test AD group as members via Direct Rule", tool: "Collection Wizard", expectedResult: "Collection includes test clients" },

      ],
    },
{
      id: "t3",
      title: "Create package",
      description: "Define a deployment package with install command and detection method.",
      order: 3,
      steps: [
        { instruction: "Create a shared folder on the file server: \\\\FS-01\\SoftwarePackages\\ScannerDriver", tool: "File Explorer on FS-01", expectedResult: "Shared folder created", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Copy the scanner driver installer (.exe or .msi) to the shared folder", tool: "File Explorer", expectedResult: "Installer present in share", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "If using PowerShell deployment: write a install.ps1 script with: Start-Process msiexec.exe -ArgumentList '/i ScannerDriver.msi /quiet /norestart' -Wait", tool: "Notepad on FS-01", expectedResult: "Install script created" },

{ instruction: "Test the install script manually on WS-01 by running: \\\\FS-01\\SoftwarePackages\\ScannerDriver\\install.ps1", tool: "PowerShell as admin on WS-01", expectedResult: "Driver installs without errors", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Define a detection method: check registry key HKLM\\SOFTWARE\\Vendor\\ScannerDriver or the Programs list", tool: "Registry Editor on WS-01", expectedResult: "Detection path identified" },

      ],
    },
{
      id: "t4",
      title: "Deploy to test group",
      description: "Target a small set of clients first.",
      order: 4,
      steps: [
        { instruction: "In MECM (or your chosen tool), create an Application or Package with the install command: powershell.exe -ExecutionPolicy Bypass -File \\\\FS-01\\SoftwarePackages\\ScannerDriver\\install.ps1", tool: "MECM Console → Application/Package wizard", expectedResult: "Deployment package defined" },

{ instruction: "Target the deployment to the 'Scanner-Driver-Deploy' collection", tool: "Deployment wizard → Collection step", expectedResult: "Collection selected" },

{ instruction: "Set the purpose to 'Required' and set a deadline of now", tool: "Deployment wizard → Deployment Settings", expectedResult: "Deployment set to required" },

{ instruction: "Monitor the deployment status in the console: Software Library → Deployments → check compliance percentage", tool: "MECM Console → Monitoring", expectedResult: "Compliance status visible" },

        { instruction: "On WS-01, run: Get-WMIObject -Class Win32_Product | Where-Object {$_.Name -like '*Scanner*'}", tool: "PowerShell as admin on WS-01", expectedResult: "Installed software list shows scanner driver" },
      ],
    },
{
      id: "t5",
      title: "Verify success",
      description: "Confirm the software is installed on the test group.",
      order: 5,
      steps: [
        { instruction: "Check the MECM deployment report: Monitoring → Deployments → select the scanner driver deployment → View Details", tool: "MECM Console → Monitoring → Deployments", expectedResult: "Shows Success rate and any failures" },

{ instruction: "On WS-01, verify the driver is present in Programs and Features", tool: "Control Panel → Programs and Features", expectedResult: "Scanner driver listed and enabled" },

{ instruction: "Document the deployment compliance rate and any warnings in the evidence panel", tool: "Evidence panel", expectedResult: "Deployment evidence saved" },

      ],
    },
{
      id: "t6",
      title: "Diagnose planted fault",
      description: "Deployment fails on some clients. Find the cause.",
      order: 6,
      steps: [
        { instruction: "On WS-04, check the deployment log: C:\\Windows\\Logs\\Software\\SCClient.log or CCM logs", tool: "File Explorer on WS-04", expectedResult: "Log file opens", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Search for the error: look for 'Error', 'Failed', or 'Access is denied' in the log", tool: "Notepad → Edit → Find", expectedResult: "Error 5: Access is denied found" },

{ instruction: "Check local Administrators group on WS-04: net localgroup Administrators", tool: "Command Prompt on WS-04", expectedResult: "Only standard user accounts listed — no admin", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Compare with WS-01: net localgroup Administrators — it has domain admins", tool: "Command Prompt on WS-01", expectedResult: "Domain Admins listed as administrators on WS-01", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document evidence: WS-04 lacks local admin rights, deployment fails with Error 5", tool: "Evidence panel", expectedResult: "Evidence: insufficient permissions confirmed" },

{ instruction: "Submit diagnosis: deployment requires local admin rights; WS-04 is a standard user workstation", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc08",
    severity: "medium",
    symptoms: [
      "Deployment succeeds on some clients, fails on others",
      "Failed clients show 'Insufficient permissions' in deployment log",
    ],
    affectedAssets: ["Client-WS-04", "Client-WS-07"],
    initialState: {
      "Working clients": "Admins in local Administrators group",
      "Failing clients": "Standard user accounts; deployment requires admin",
    },
    hiddenRootCause:
      "Deployment uses an installer that requires admin rights. The failing clients run as standard users and the deployment context is not elevated. Fix: change deployment to run as SYSTEM or grant local admin temporarily, or use a user-context installer.",
    allowedActions: [
      "review deployment logs",
      "check local Administrators group",
      "test install as standard user",
      "check installer requirements",
    ],
    forbiddenActions: [
      "add all users to local admins",
      "disable UAC",
    ],
    evidenceRevealedOnAction: {
      "review deployment logs": [
        { id: "ev1", label: "Failed client log", value: "Error 5: Access is denied", collectedAt: "" },
      ],
    },
    resolution:
      "Reconfigure deployment to run as SYSTEM (via MECM/SCCM), or change the installer to user-context install mode. Alternatively, grant local admin membership temporarily via restricted group policy.",
    businessImpact:
      "Scanner drivers not deployed — scanners remain non-functional on affected machines.",
  },
  hints: [
    { level: 1, text: "Some clients work, some don't. Is it the deployment package or the client configuration?" },
    { level: 2, text: "What is different about the failing clients? Check local group membership." },
    { level: 3, text: "Review the deployment logs on a failing client for 'Error 5' or 'Access is denied'." },
    { level: 4, text: "If the installer requires admin but the user is a standard user, the deployment context matters." },
    { level: 5, text: "Solution: run the deployment as SYSTEM or convert the installer to per-user mode." },
  ],
  validation: [
    { id: "v1", description: "Deployment targets correct collection", command: "MECM collection query", expectedResult: "Collection includes test clients only", points: 10 },
    { id: "v2", description: "Driver installs on WS-01", command: "Get-WMIObject Win32_Product", expectedResult: "Scanner driver listed", points: 10 },
  ],
  rubric: [
    { criterion: "Architecture", description: "Architecture diagram correct and complete", maxPoints: 20 },
    { criterion: "Collection design", description: "Collection targets correct clients", maxPoints: 20 },
    { criterion: "Package quality", description: "Detection method and install script correct", maxPoints: 20 },
    { criterion: "Diagnosis", description: "Found admin rights issue, not package problem", maxPoints: 20 },
    { criterion: "Fix approach", description: "Proposed SYSTEM context or user-context installer", maxPoints: 20 },
  ],
  requiredEvidence: ["Architecture diagram", "Collection membership", "Deployment compliance report"],
  deliverables: ["Architecture diagram", "Deployment guide", "Failure analysis"],
  interviewQuestion:
    "You deploy software to 100 machines via SCCM. 40 succeed, 60 fail. Walk me through how you determine which ones failed and why.",
};
