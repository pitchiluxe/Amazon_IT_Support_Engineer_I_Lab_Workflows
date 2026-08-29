import type { Lab } from "@/types";

export const lab06: Lab = {
  id: "lab06",
  number: 6,
  title: "DFS Namespace & File Availability",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 75,
  objectives: [
    "Install DFS Namespaces and DFS Replication roles",
    "Create a domain-based namespace",
    "Add folder targets and configure replication",
    "Test failover behavior",
    "Diagnose a DFS availability issue",
  ],
  prerequisites: ["Lab 05 — AD Users, Groups & Access Control"],
  scenario:
    "The operations team needs a single UNC path for the shared folder, but you want redundancy across two file servers. You will build a DFS namespace with two folder targets.",
  environment: [
    "Two file servers: FS-01 and FS-02",
    "Windows client",
    "Shared folder: \\\\warehouse.local\\Operations",
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
      title: "Install DFS roles",
      description: "Add DFS Namespaces and DFS Replication on both servers.",
      order: 1,
      steps: [
        { instruction: "On FS-01, open Server Manager → Manage → Add Roles and Features", tool: "Server Manager → Manage", expectedResult: "Add Roles and Features Wizard opens", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Click Next until Server Roles, expand File and Storage Services → check DFS Namespace and DFS Replication", tool: "Server Roles step", expectedResult: "Both DFS roles checked" },

{ instruction: "Click Next → Install, wait for completion, then repeat on FS-02", tool: "Wizard confirmation", expectedResult: "Both roles installed on both servers" },

{ instruction: "Open DFS Management on FS-01: Server Manager → Tools → DFS Management", tool: "Server Manager → Tools", expectedResult: "DFS Management snap-in opens", nodeId: "dc-01", toolId: "server-manager" },

      ],
    },
{
      id: "t2",
      title: "Create namespace",
      description: "Domain-based namespace \\\\warehouse.local\\Operations.",
      order: 2,
      steps: [
        { instruction: "In DFS Management, right-click Namespaces in the left panel → New Namespace", tool: "DFS Management left panel", expectedResult: "New Namespace Wizard opens", nodeId: "fs-01", toolId: "dfs" },

{ instruction: "Click Browse → Find Now → select FS-01 → click OK", tool: "Namespace Server step → Browse dialog", expectedResult: "FS-01 selected as the namespace server" },

{ instruction: "Enter namespace name: Operations and click Next", tool: "Namespace Name and Settings step", expectedResult: "Name set to Operations" },

{ instruction: "Select 'Domain-based namespace', click Create", tool: "Namespace Type step", expectedResult: "Namespace created: \\\\warehouse.local\\Operations" },

{ instruction: "Verify the namespace appears in DFS Management and is accessible via UNC path", tool: "File Explorer → \\\\warehouse.local\\Operations", expectedResult: "Namespace opens (empty)", nodeId: "fs-01", toolId: "file-explorer" },

      ],
    },
{
      id: "t3",
      title: "Add folder targets",
      description: "Add \\\\FS-01\\Ops and \\\\FS-02\\Ops as folder targets.",
      order: 3,
      steps: [
        { instruction: "In DFS Management, expand Namespaces → \\\\warehouse.local\\Operations → right-click → New Folder", tool: "DFS Management namespace view", expectedResult: "New Folder dialog opens", nodeId: "fs-01", toolId: "dfs" },

{ instruction: "Name the folder: OperationsDocs, click Add under Folder targets", tool: "New Folder dialog", expectedResult: "Add Folder Target dialog opens" },

{ instruction: "Browse to or type: \\\\FS-01\\Operations → click OK", tool: "Folder Target dialog", expectedResult: "First target added" },

{ instruction: "Click Add again, browse to or type: \\\\FS-02\\Operations → click OK → OK", tool: "New Folder dialog", expectedResult: "Second target added; both targets visible in the folder" },

{ instruction: "Verify both targets show Online status in DFS Management", tool: "DFS Management → folder targets panel", expectedResult: "Both targets: Online", nodeId: "fs-01", toolId: "dfs" },

      ],
    },
{
      id: "t4",
      title: "Configure replication",
      description: "Enable DFS-R between the two targets.",
      order: 4,
      steps: [
        { instruction: "In DFS Management, click Replication in the left panel → right-click → New Replication Group", tool: "DFS Management → Replication node", expectedResult: "New Replication Group Wizard opens", nodeId: "fs-01", toolId: "dfs" },

{ instruction: "Select 'Multipurpose replication group' → enter name: Warehouse-FileRep → click Next", tool: "Replication Group Type step", expectedResult: "Name entered" },

{ instruction: "Click Add → enter FS-01 hostname → Add → enter FS-02 hostname → Add → Next", tool: "Members step", expectedResult: "Both servers listed as replication members" },

{ instruction: "On the Replication Folder step, click Browse → select \\\\FS-01\\Operations → click OK → set as primary member → click Next", tool: "Replication Folders step", expectedResult: "Replication folder configured" },

{ instruction: "Select Full Mesh topology and set Schedule to 24/7 (continuous replication) → click Create", tool: "Topology and Schedule step", expectedResult: "DFS-R relationship established; both servers show replication active" },

      ],
    },
{
      id: "t5",
      title: "Test failover",
      description: "Take one server offline, verify access through namespace.",
      order: 5,
      steps: [
        { instruction: "On WS-01, navigate to \\\\warehouse.local\\Operations → create a test file named 'failover_test.txt'", tool: "File Explorer", expectedResult: "Test file created", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "In DFS Management, right-click the FS-01 folder target → Take Offline (or stop the share on FS-01)", tool: "DFS Management → folder target right-click", expectedResult: "Target shows Offline status", nodeId: "fs-01", toolId: "dfs" },

{ instruction: "On WS-01, refresh the DFS namespace — the file should still be accessible", tool: "File Explorer → refresh \\\\warehouse.local\\Operations", expectedResult: "Content still accessible via FS-02 target", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Document evidence: failover test passed, namespace remained available", tool: "Evidence panel", expectedResult: "Evidence: DFS failover working" },

      ],
    },
{
      id: "t6",
      title: "Diagnose planted fault",
      description: "One folder target is unreachable. Find why.",
      order: 6,
      steps: [
        { instruction: "In DFS Management, check the folder targets — one shows 'Offline' with error: 'The network path was not found'", tool: "DFS Management → folder targets", expectedResult: "FS-02 target shows Offline", nodeId: "fs-01", toolId: "dfs" },

{ instruction: "From WS-01, try to access \\\\FS-02\\Operations directly by UNC path", tool: "File Explorer address bar", expectedResult: "Network path not found or Access Denied", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "On FS-02, run: Get-SmbShare in PowerShell — the Operations share should be missing or have wrong permissions", tool: "PowerShell on FS-02", expectedResult: "Operations share not found in the share list", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Document evidence: share missing on FS-02 causing DFS target offline status", tool: "Evidence panel", expectedResult: "Evidence: share fault confirmed" },

{ instruction: "Submit diagnosis: DFS target offline because the underlying share on FS-02 is missing", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc06",
    severity: "high",
    symptoms: [
      "Client gets 'The network path was not found' for one of the two DFS targets",
      "DFS Management shows 'Offline' for one folder target",
    ],
    affectedAssets: ["FS-02", "DFS Namespace"],
    initialState: {
      "FS-01": "Online, replicated",
      "FS-02": "Folder share is stopped (administrative share removed)",
    },
    hiddenRootCause:
      "The folder share on FS-02 was unpublished (or the share permissions were changed to deny). The namespace still references it. Fix: re-publish the folder target or fix share permissions.",
    allowedActions: [
      "dfsutil",
      "Get-DfsnFolderTarget",
      "test UNC path",
      "Get-SmbShare",
    ],
    forbiddenActions: ["remove FS-02 from DFS", "delete the namespace"],
    evidenceRevealedOnAction: {
      "Get-DfsnFolderTarget": [
        { id: "ev1", label: "FS-02 target state", value: "State: Offline; Status: The network path was not found", collectedAt: "" },
      ],
      "test UNC path": [
        { id: "ev2", label: "Direct UNC to FS-02", value: "Access denied or path not found", collectedAt: "" },
      ],
      "Get-SmbShare": [
        { id: "ev3", label: "FS-02 share list", value: "Ops share missing or permissions deny Everyone", collectedAt: "" },
      ],
    },
    resolution:
      "Re-publish the Ops share on FS-02 with correct permissions. DFS-R will sync any pending changes once the target is reachable.",
    businessImpact:
      "DFS unavailability removes a single UNC path. If both targets are down, file access halts across the site.",
  },
  hints: [
    { level: 1, text: "DFS gives you one path, but it depends on the underlying shares being healthy. How would you check that?" },
    { level: 2, text: "Can you reach FS-02 directly by UNC, bypassing the namespace?" },
    { level: 3, text: "Run 'Get-SmbShare' on FS-02 and try \\\\FS-02\\Ops from the client. Also 'dfsutil cache referral'." },
    { level: 4, text: "If the share is missing or the share permissions deny access, the namespace will mark the target offline." },
    { level: 5, text: "Solution: re-publish the share on FS-02 with the right share permissions. The namespace will recover automatically." },
  ],
  validation: [
    { id: "v1", description: "Both folder targets online", command: "Get-DfsnFolderTarget", expectedResult: "Both targets Online", points: 10 },
    { id: "v2", description: "Namespace accessible", command: "\\\\warehouse.local\\Operations", expectedResult: "Opens share", points: 5 },
    { id: "v3", description: "Replication working", command: "Get-DfsrState", expectedResult: "Replication in normal state", points: 5 },
  ],
  rubric: [
    { criterion: "Namespace design", description: "Domain-based, correctly referenced", maxPoints: 20 },
    { criterion: "Replication", description: "DFS-R configured and healthy", maxPoints: 20 },
    { criterion: "Diagnosis", description: "Found share fault, not DFS fault", maxPoints: 25 },
    { criterion: "Fix", description: "Repaired share without removing target", maxPoints: 20 },
    { criterion: "Production safety", description: "Did not delete namespace", maxPoints: 15 },
  ],
  requiredEvidence: ["DFS Management screenshot", "UNC test", "Replication status"],
  deliverables: ["DFS topology diagram", "Test results", "SOP for DFS health"],
  interviewQuestion:
    "DFS abstracts two file servers behind one UNC. Walk me through what happens under the hood when a client opens a file.",
};
