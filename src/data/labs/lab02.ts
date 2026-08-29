import type { Lab } from "@/types";

export const lab02: Lab = {
  id: "lab02",
  number: 2,
  title: "Active Directory Domain Controller",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 90,
  objectives: [
    "Deploy Windows Server with AD DS role",
    "Configure a new AD forest and domain in an isolated lab",
    "Create OUs for Operations, IT, Management and Devices",
    "Create users and security groups",
    "Join a Windows client to the domain",
    "Configure basic Group Policy",
    "Test authentication and permissions",
  ],
  prerequisites: ["Lab 01 — Operations IT Baseline & Documentation"],
  scenario:
    "Build the identity foundation for a warehouse site. Without AD, every service from DNS to DFS to file share permissions has no consistent identity layer.",
  environment: [
    "Windows Server 2022/2025 VM (will become DC)",
    "Windows 11 client VM",
    "Static IP for DC",
    "Isolated lab network",
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


                  {
            id: "gpo",
            name: "Group Policy Management",
            label: "GPO",
            path: "Server Manager → Tools → GPM",
            type: "gui" },
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
      title: "Install AD DS role",
      description: "Add the Active Directory Domain Services role via Server Manager.",
      order: 1,
      steps: [
        { instruction: "Open Server Manager on the server that will become DC-01", tool: "Start Menu → Server Manager", expectedResult: "Server Manager dashboard loads", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Click Manage → Add Roles and Features", tool: "Server Manager toolbar", expectedResult: "Add Roles and Features Wizard opens", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Click Next until you reach Server Roles, then check Active Directory Domain Services", tool: "Wizard → Server Roles step", expectedResult: "AD DS checkbox selected; prompts to add features" },

{ instruction: "Click Add Features, then click Next through all remaining steps until Install", tool: "Wizard confirmation pages", expectedResult: "Installation begins, progress bar reaches 100%" },

      ],
    },
{
      id: "t2",
      title: "Promote to domain controller",
      description: "Create a new forest (e.g., warehouse.local) and promote.",
      order: 2,
      steps: [
        { instruction: "In Server Manager, click the flag icon (Notifications) in the top-right", tool: "Server Manager notification bell", expectedResult: "Panel shows 'Promote this server to a domain controller'", nodeId: "dc-01", toolId: "server-manager" },

{ instruction: "Click 'Promote this server to a domain controller'", tool: "Notification panel", expectedResult: "Active Directory Domain Services Configuration Wizard opens" },

{ instruction: "Select 'Add a new forest', enter root domain name: warehouse.local", tool: "Deployment Configuration step", expectedResult: "Domain name field set to warehouse.local" },

{ instruction: "Click Next to Domain Controller Options, set a Directory Services Restore Mode (DSRM) password", tool: "Domain Controller Options step", expectedResult: "Password entered and confirmed" },

{ instruction: "Click Next through all remaining steps, then click Install", tool: "Wizard summary page", expectedResult: "Server restarts; login screen shows warehouse.local\\Administrator" },

      ],
    },
{
      id: "t3",
      title: "Create OU structure",
      description: "Build OUs: Operations, IT, Management, Devices, Servers.",
      order: 3,
      steps: [
        { instruction: "Open Active Directory Users and Computers", tool: "Server Manager → Tools → ADUC", expectedResult: "ADUC snap-in opens", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Enable Advanced Features", tool: "ADUC menu → View → Advanced Features", expectedResult: "Security tab and additional object tabs appear", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Right-click warehouse.local → New → Organizational Unit", tool: "ADUC left panel right-click", expectedResult: "New Object dialog opens", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Create these top-level OUs: Operations, IT, Management, Devices, Servers", tool: "OU creation dialog", expectedResult: "All 5 OUs visible in the ADUC tree" },

{ instruction: "Within Operations, create sub-OUs: Bay1, Bay2, Bay3, Bay4", tool: "Right-click Operations OU → New → OU", expectedResult: "4 Bay sub-OUs nested under Operations" },

      ],
    },
{
      id: "t4",
      title: "Create security groups",
      description: "GG_Admins, GG_Operations, GG_Management, GG_EndpointUsers.",
      order: 4,
      steps: [
        { instruction: "Navigate to the IT OU in ADUC", tool: "ADUC → warehouse.local → IT", expectedResult: "IT OU selected", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Right-click IT → New → Group", tool: "ADUC right-click menu", expectedResult: "New Object - Group dialog", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Create: IT-Admins (Security, Global), HelpDesk (Security, Global), IT-ReadOnly (Security, Global)", tool: "Group dialog", expectedResult: "3 groups created in IT OU" },

{ instruction: "Navigate to Operations OU and create: Ops-BayWorkers (Security, Global), Ops-Managers (Security, Global)", tool: "ADUC → Operations right-click → New → Group", expectedResult: "2 groups created in Operations OU", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Navigate to Management OU and create: Management-Exec (Security, Global)", tool: "ADUC → Management right-click → New → Group", expectedResult: "Management-Exec group created", nodeId: "dc-01", toolId: "aduc" },

      ],
    },
{
      id: "t5",
      title: "Create sample users",
      description: "5 users across the OUs, including a service account.",
      order: 5,
      steps: [
        { instruction: "Navigate to Operations → Bay1 in ADUC", tool: "ADUC → Operations → Bay1", expectedResult: "Bay1 OU selected", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Right-click Bay1 → New → User", tool: "ADUC right-click menu", expectedResult: "New Object - User dialog", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Create: John Smith (jsmith), Jane Doe (jdoe), Bob Chen (bchen)", tool: "User creation dialog", expectedResult: "3 users in Bay1 OU" },

{ instruction: "Navigate to IT OU, create: IT Admin1 (itadmin1)", tool: "ADUC → IT right-click → New → User", expectedResult: "IT admin user created", nodeId: "dc-01", toolId: "aduc" },

{ instruction: "Navigate to IT OU, create service account: SVC_FileSync (password never expires)", tool: "User creation dialog → check 'Password never expires'", expectedResult: "Service account created with password policy set" },

      ],
    },
{
      id: "t6",
      title: "Join client to domain",
      description: "Domain-join the Windows 11 client.",
      order: 6,
      steps: [
        { instruction: "On WS-01, open Settings → System → About → Rename this PC (advanced)", tool: "Windows Settings → System → About", expectedResult: "System Properties dialog opens" },

{ instruction: "Click Network ID... → This computer is part of a business network → I use a domain...", tool: "System Properties → Computer Name tab → Network ID", expectedResult: "Network credentials wizard opens" },

{ instruction: "Enter domain name: warehouse.local and domain admin credentials", tool: "Network Identification Wizard", expectedResult: "Credentials dialog prompts for admin username/password" },

{ instruction: "After joining, the computer will restart. Log in as warehouse.local\\jsmith", tool: "Windows logon screen", expectedResult: "Domain user logged in successfully" },

      ],
    },
{
      id: "t7",
      title: "Create a GPO",
      description: "Apply a password policy and a mapped drive GPO.",
      order: 7,
      steps: [
        { instruction: "Open Group Policy Management", tool: "Server Manager → Tools → Group Policy Management", expectedResult: "GPM snap-in opens", nodeId: "dc-01", toolId: "gpo" },

{ instruction: "Navigate to Forest: warehouse.local → Domains → warehouse.local → right-click create GPO: Password-Policy", tool: "GPM left panel", expectedResult: "New GPO dialog", nodeId: "dc-01", toolId: "gpo" },

{ instruction: "Edit Password-Policy GPO: Computer Configuration → Policies → Windows Settings → Security Settings → Account Policies → Password Policy", tool: "GPO Editor", expectedResult: "Password policy settings visible", nodeId: "dc-01", toolId: "gpo" },

{ instruction: "Set: Minimum password length: 12, Complexity: Enabled, Maximum age: 90 days", tool: "Password Policy settings", expectedResult: "Policy settings configured" },

{ instruction: "Create a second GPO: Map-OpsDrive, link to Operations OU, configure: User Configuration → Preferences → Drive Maps → New Mapped Drive → \\\\FS-01\\Operations → Apply", tool: "GPM → Ops OU → GPO Editor", expectedResult: "Mapped drive GPO configured", nodeId: "dc-01", toolId: "gpo" },

      ],
    },
{
      id: "t8",
      title: "Test authentication",
      description: "Log in as a domain user, verify GPO applied, test file share access.",
      order: 8,
      steps: [
        { instruction: "On WS-01, log out and log in as warehouse.local\\jsmith", tool: "Windows logon screen", expectedResult: "Domain user logged in" },

{ instruction: "Open Command Prompt and run: gpresult /r", tool: "Command Prompt as jsmith", expectedResult: "GPO report shows both Password-Policy and Map-OpsDrive applied", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Open File Explorer — Ops drive (O:) should be mapped automatically", tool: "File Explorer", expectedResult: "O: drive pointing to \\\\FS-01\\Operations visible", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Try to access a restricted share and confirm Access Denied", tool: "File Explorer → UNC path to restricted share", expectedResult: "Access Denied shown for unauthorized share", nodeId: "fs-01", toolId: "file-explorer" },

      ],
    },
{
      id: "t9",
      title: "Diagnose the planted fault",
      description: "A client cannot authenticate. Find why.",
      order: 9,
      steps: [
        { instruction: "On the failing client, run ipconfig /all", tool: "Command Prompt on WS-01", expectedResult: "DNS Servers line shows 8.8.8.8 instead of DC IP", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Try to ping the domain: ping warehouse.local", tool: "Command Prompt", expectedResult: "Ping fails — cannot find host", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document evidence: DNS is pointed to public resolver, not the DC", tool: "Evidence panel", expectedResult: "Evidence collected showing wrong DNS" },

{ instruction: "Submit diagnosis: DNS pointing to 8.8.8.8 prevents domain join", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc02",
    severity: "high",
    symptoms: [
      "Client WS-01 receives 'The user name or password is incorrect' on domain join",
      "DNS resolution for the domain fails from the client",
    ],
    affectedAssets: ["WS-01", "DC-01"],
    initialState: {
      "DC-01": "Static IP 10.0.0.10, DNS set to itself",
      "WS-01": "DHCP, but DNS manually set to 8.8.8.8",
    },
    hiddenRootCause:
      "Client WS-01 has its DNS server manually set to 8.8.8.8 instead of the DC (10.0.0.10). Without DC DNS, it cannot locate the domain controller. The fix is to point DNS to the DC, not to re-create the user account.",
    allowedActions: [
      "ipconfig /all",
      "nslookup",
      "Test-ComputerSecureChannel",
      "nltest /sc_query",
      "ping DC by name",
      "check DNS settings",
    ],
    forbiddenActions: ["demote DC", "delete user account", "reset DC without backup"],
    evidenceRevealedOnAction: {
      "ipconfig /all": [
        { id: "ev1", label: "WS-01 DNS server", value: "8.8.8.8 (manually configured)", collectedAt: "" },
      ],
      "ping": [
        { id: "ev2", label: "Ping DC-01 by name fails", value: "Ping request could not find host DC-01", collectedAt: "" },
      ],
      "nslookup": [
        { id: "ev3", label: "NSLookup for domain fails", value: "*** Can't find warehouse.local: Non-existent domain", collectedAt: "" },
      ],
    },
    resolution:
      "On WS-01, change DNS to point to 10.0.0.10 (the DC), then re-attempt domain join. Or set DHCP to provide the DC's DNS and refresh DHCP lease.",
    businessImpact:
      "Without AD, no user authentication, no GPO, no DFS permissions, no centralized policy. Every workstation depending on the domain is impacted.",
  },
  hints: [
    { level: 1, text: "When authentication fails on a client, what does the client know about the network it's on?" },
    { level: 2, text: "Domain join is a DNS-dependent operation. What does your client think the DNS server is?" },
    { level: 3, text: "Run 'ipconfig /all' on the client and check the DNS Servers line. Then try 'nslookup warehouse.local'." },
    { level: 4, text: "If DNS points to a public resolver (8.8.8.8), the client cannot locate the DC. The user account is not the problem." },
    { level: 5, text: "Solution: set client DNS to the DC (10.0.0.10), refresh with 'ipconfig /flushdns', then re-join the domain." },
  ],
  validation: [
    { id: "v1", description: "Domain controller is reachable by name", command: "nslookup warehouse.local", expectedResult: "Resolves to 10.0.0.10", points: 5 },
    { id: "v2", description: "Client DNS set to DC", command: "ipconfig /all", expectedResult: "DNS: 10.0.0.10", points: 5 },
    { id: "v3", description: "Client joined to domain", command: "systeminfo | findstr /Domain", expectedResult: "Domain: warehouse.local", points: 5 },
    { id: "v4", description: "Domain user can log in", command: "Login as DOMAIN\\user", expectedResult: "Successful login", points: 5 },
    { id: "v5", description: "GPO applied", command: "gpresult /r", expectedResult: "GPO listed", points: 5 },
  ],
  rubric: [
    { criterion: "AD deployment", description: "Domain functional, OU structure created", maxPoints: 20 },
    { criterion: "Identity hygiene", description: "Users in correct OUs, groups used for permissions", maxPoints: 15 },
    { criterion: "GPO quality", description: "GPOs targeted, not applied at default", maxPoints: 15 },
    { criterion: "Domain join", description: "Client joined without errors", maxPoints: 10 },
    { criterion: "Troubleshooting", description: "Diagnosed DNS issue, did not reset user", maxPoints: 25 },
    { criterion: "Production safety", description: "Did not demote DC or destroy data", maxPoints: 15 },
  ],
  requiredEvidence: [
    "AD Users and Computers screenshot",
    "OU structure screenshot",
    "GPO report (gpresult)",
    "Successful domain login screenshot",
  ],
  deliverables: [
    "AD architecture",
    "OU/group design",
    "GPO list",
    "Validation screenshots",
    "Troubleshooting notes",
  ],
  interviewQuestion:
    "A user calls saying 'my password doesn't work.' Walk me through your troubleshooting from the moment you pick up the phone. What do you check first, and why?",
};
