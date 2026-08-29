import type { Lab } from "@/types";

export const lab05: Lab = {
  id: "lab05",
  number: 5,
  title: "AD Users, Groups & Access Control",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 75,
  objectives: [
    "Create users, groups, and OUs following least-privilege",
    "Apply NTFS and share permissions correctly",
    "Use AGDLP model (Account -> Global -> Domain Local -> Permission)",
    "Diagnose 'access denied' issues",
  ],
  prerequisites: ["Lab 02 — Active Directory Domain Controller"],
  scenario:
    "A new operations team needs access to a specific file share. Some team members can read, others can read/write, and one manager needs full control. The previous approach was 'Everyone: Full Control' — you must fix this.",
  environment: [
    "DC with existing AD",
    "File server (or DC with file role)",
    "Test share: \\\\fileserver\\Operations",
    "Test users representing each role",
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
      title: "Create OUs and groups",
      description: "Build OU structure and security groups for the operations team.",
      order: 1,
      steps: [
        { instruction: "Open Active Directory Users and Computers", tool: "Server Manager → Tools → ADUC", expectedResult: "ADUC opens", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Navigate to warehouse.local → Operations", tool: "ADUC left panel", expectedResult: "Operations OU contents visible", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Right-click Operations → New → Group → GG_Ops_BayWorkers (Security, Global scope)", tool: "ADUC right-click → New → Group", expectedResult: "GG_Ops_BayWorkers created", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Create GG_Ops_Managers (Security, Global) in the same Operations OU", tool: "ADUC right-click → New → Group", expectedResult: "GG_Ops_Managers created", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Navigate to IT OU, create GG_IT_Admins (Security, Domain Local scope)", tool: "ADUC → IT right-click → New → Group", expectedResult: "GG_IT_Admins created", nodeId: "dc-01", toolId: "aduc" },

      ],
    },
{
      id: "t2",
      title: "Add users to groups",
      description: "Populate groups with the correct members.",
      order: 2,
      steps: [
        { instruction: "Navigate to Operations → Bay1 in ADUC, create or find test users: John Smith (jsmith)", tool: "ADUC → Operations → Bay1", expectedResult: "User jsmith visible in Bay1", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Double-click jsmith → Member Of tab → Add → type GG_Ops_BayWorkers → OK", tool: "User Properties → Member Of", expectedResult: "jsmith is now a member of GG_Ops_BayWorkers" },

{ instruction: "Create or find Ops Manager user and add to GG_Ops_Managers", tool: "ADUC → user properties → Member Of", expectedResult: "Manager user in GG_Ops_Managers", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Verify group memberships: right-click jsmith → Properties → Member Of tab", tool: "User Properties", expectedResult: "GG_Ops_BayWorkers listed, GG_Ops_Managers NOT listed for jsmith" },

      ],
    },
{
      id: "t3",
      title: "Configure share permissions",
      description: "Apply share-level permissions via groups (not users).",
      order: 3,
      steps: [
        { instruction: "On FS-01, create folder C:\\WarehouseShares\\Operations if it does not exist", tool: "File Explorer on FS-01", expectedResult: "Folder created", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Right-click Operations folder → Properties → Sharing → Advanced Sharing → Share this folder", tool: "Folder Properties → Sharing tab", expectedResult: "Advanced Sharing dialog opens" },

{ instruction: "Click Permissions → Remove 'Everyone' → Add → GG_Ops_Managers (Full Control), GG_Ops_BayWorkers (Change), GG_IT_Admins (Full Control)", tool: "Share Permissions dialog", expectedResult: "Groups only, no individual user accounts" },

{ instruction: "Click OK → OK → Close to apply share permissions", tool: "Dialogs", expectedResult: "Share created" },

      ],
    },
{
      id: "t4",
      title: "Configure NTFS permissions",
      description: "Apply NTFS permissions to match access requirements.",
      order: 4,
      steps: [
        { instruction: "Right-click Operations folder → Properties → Security → Advanced", tool: "Folder Properties → Security tab → Advanced", expectedResult: "Advanced Security Settings dialog opens" },

{ instruction: "Remove inherited permissions (disable 'Include inheritable permissions') and convert them", tool: "Advanced dialog → Disable inheritance", expectedResult: "Inherited permissions converted to explicit" },

{ instruction: "Add: SYSTEM (Full Control), Administrators (Full Control), GG_Ops_Managers (Modify), GG_Ops_BayWorkers (Read & Execute)", tool: "Permission entries tab → Add", expectedResult: "AGDLP model applied at NTFS level" },

{ instruction: "Enable auditing: Security tab → Advanced → Auditing → Add → select Principal: Everyone, Type: Failure, set to 'Write' and 'Delete'", tool: "Advanced Security → Auditing tab", expectedResult: "Failed access attempts will be logged in Security Event Log" },

      ],
    },
{
      id: "t5",
      title: "Test access matrix",
      description: "Test each user role against the share.",
      order: 5,
      steps: [
        { instruction: "On WS-01, log out and log in as warehouse.local\\jsmith (Bay Worker)", tool: "Windows logon screen", expectedResult: "Logged in as jsmith" },

{ instruction: "Navigate to \\\\FS-01\\Operations in File Explorer — create a test file", tool: "File Explorer address bar", expectedResult: "Can create file (has Modify via GG_Ops_BayWorkers)", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Log out and log in as Ops Manager user — create and delete a file", tool: "Windows logon screen", expectedResult: "Can create, modify, and delete files (Full Control via GG_Ops_Managers)" },

{ instruction: "Document access results in a matrix table: User | Group | Can Read | Can Write | Can Delete", tool: "Evidence panel or a text file", expectedResult: "Access matrix completed" },

      ],
    },
{
      id: "t6",
      title: "Find the planted fault",
      description: "One user has wrong access. Diagnose without resetting permissions blindly.",
      order: 6,
      steps: [
        { instruction: "Log in as the Ops Manager user — try to create a file in \\\\FS-01\\Operations", tool: "Windows logon as Manager → File Explorer", expectedResult: "Access Denied — even though the user should have full control", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Open PowerShell and run: Get-ADUser -Identity \"<manageralias>\" -Properties memberof", tool: "PowerShell on DC-01", expectedResult: "Shows only GG_Ops_BayWorkers membership — missing GG_Ops_Managers", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Run: Get-ADGroupMember GG_Ops_Managers to confirm manager is not in the group", tool: "PowerShell on DC-01", expectedResult: "Manager user NOT listed as a member", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Document evidence: manager account is missing from GG_Ops_Managers group", tool: "Evidence panel", expectedResult: "Evidence: membership gap confirmed" },

{ instruction: "Submit diagnosis: manager account is in GG_Ops_BayWorkers (read-only) but not GG_Ops_Managers (full control)", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc05",
    severity: "medium",
    symptoms: [
      "Operations manager reports 'Access Denied' to the share she is supposed to own",
      "All other users work correctly",
    ],
    affectedAssets: ["fileserver", "Manager user account"],
    initialState: {
      "Share": "\\\\fileserver\\Operations",
      "Groups": "GG_Ops_Users, GG_Ops_Managers",
    },
    hiddenRootCause:
      "The manager's account was added to GG_Ops_Users (read-only) but not to GG_Ops_Managers. The group nesting is correct, but the account is missing from the right group. Do not change share permissions — the manager is in the wrong group.",
    allowedActions: [
      "Get-ADUser -Properties memberof",
      "Get-ADGroupMember",
      "icacls",
      "test access from manager's account",
    ],
    forbiddenActions: [
      "grant Everyone:FullControl",
      "remove NTFS deny",
      "modify share permissions without reason",
    ],
    evidenceRevealedOnAction: {
      "Get-ADUser -Properties memberof": [
        { id: "ev1", label: "Manager group memberships", value: "GG_Ops_Users only; not in GG_Ops_Managers", collectedAt: "" },
      ],
      "Get-ADGroupMember": [
        { id: "ev2", label: "GG_Ops_Managers", value: "Manager not listed", collectedAt: "" },
      ],
    },
    resolution:
      "Add the manager's account to GG_Ops_Managers. Document the change. Re-test access.",
    businessImpact:
      "Wrong access management either blocks work or exposes data. Both are business-impacting. Using groups is correct; mis-population is a hygiene issue.",
  },
  hints: [
    { level: 1, text: "If other users work but one user does not, is the share broken or is the user different?" },
    { level: 2, text: "What group memberships does this user have, and what group should they be in?" },
    { level: 3, text: "Run 'Get-ADUser manager -Properties memberof' and 'Get-ADGroupMember GG_Ops_Managers'." },
    { level: 4, text: "If the manager is only in GG_Ops_Users, she only gets read access. She should be in GG_Ops_Managers." },
    { level: 5, text: "Solution: add the manager to GG_Ops_Managers via Active Directory Users and Computers." },
  ],
  validation: [
    { id: "v1", description: "Manager has full control", command: "Test access from manager account", expectedResult: "Can create, modify, delete files", points: 10 },
    { id: "v2", description: "Read-only user cannot write", command: "Test write from read-only user", expectedResult: "Access Denied on write", points: 5 },
    { id: "v3", description: "No 'Everyone: FullControl' on share", command: "icacls", expectedResult: "Specific groups only", points: 5 },
  ],
  rubric: [
    { criterion: "AGDLP model", description: "Groups used for permission, not individual users", maxPoints: 25 },
    { criterion: "Least privilege", description: "Roles only have access they need", maxPoints: 20 },
    { criterion: "Diagnosis", description: "Found the membership gap, not a permissions fault", maxPoints: 25 },
    { criterion: "Fix", description: "Added user to correct group, did not weaken permissions", maxPoints: 15 },
    { criterion: "Documentation", description: "Group memberships and policy documented", maxPoints: 15 },
  ],
  requiredEvidence: ["Group membership screenshots", "Access test results"],
  deliverables: ["Group design document", "Permissions matrix", "Test results"],
  interviewQuestion:
    "Explain the AGDLP model. Why use groups instead of assigning permissions to users? When is the right time to deviate?",
};
