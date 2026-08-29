import type { Lab } from "@/types";

export const lab09: Lab = {
  id: "lab09",
  number: 9,
  title: "PC Repair, Imaging & Deployment",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 75,
  objectives: [
    "Diagnose a hardware fault in a PC",
    "Re-image a workstation using a standard image",
    "Join it to the domain and verify services",
    "Document a repeatable deployment procedure",
  ],
  prerequisites: ["Lab 02 — Active Directory Domain Controller"],
  scenario:
    "A user reports their workstation is 'acting strange — sometimes won't boot, sometimes blue-screens.' You need to assess whether to repair or re-image, and demonstrate the re-image process.",
  environment: [
    "Test workstation (physical or VM)",
    "Windows install media or .iso",
    "Driver pack or manufacturer media",
    "Network access to DC and services",
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
      title: "Diagnose hardware",
      description: "Check disk health, RAM, temperature, recent changes.",
      order: 1,
      steps: [
        { instruction: "On the failing workstation, boot into Windows or WinPE and open Command Prompt", tool: "Boot into Windows or WinPE USB", expectedResult: "Command Prompt opens" },

{ instruction: "Run: wmic diskdrive get model,status,size to check disk status", tool: "Command Prompt", expectedResult: "Disk status shown", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: chkdsk C: /scan /r to scan for bad sectors", tool: "Command Prompt as admin", expectedResult: "Chkdsk results returned", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: Get-PhysicalDisk | Select-Object FriendlyName,HealthStatus,FirmwareVersion on a WinPE session", tool: "PowerShell in WinPE", expectedResult: "Disk health status displayed", nodeId: "ws-01", toolId: "powershell" },

{ instruction: "Check Event Viewer → System log for disk-related errors (Disk, DiskDrive, ntfs)", tool: "Event Viewer → Windows Logs → System", expectedResult: "Disk error events visible" },

{ instruction: "Document findings: disk SMART status, chkdsk results, event log errors", tool: "Evidence panel", expectedResult: "Hardware diagnosis complete" },

      ],
    },
{
      id: "t2",
      title: "Decide repair vs re-image",
      description: "Based on diagnosis, decide if a re-image is appropriate.",
      order: 2,
      steps: [
        { instruction: "Review the disk health results — if HealthStatus shows 'Warning' or 'Unhealthy', SMART has detected degradation", tool: "Chkdsk / scan output", expectedResult: "Disk health assessment complete" },

{ instruction: "Check: ReallocatedSectors count > 0 or RelocatedBlocks count > 0 indicates physical disk damage", tool: "Get-PhysicalDisk output", expectedResult: "SMART data reviewed" },

{ instruction: "Decision: if SMART shows warning AND chkdsk finds bad sectors → replace disk first, then re-image. If SMART healthy → repair Windows and return to user.", tool: "Decision tree", expectedResult: "Decision documented: replace + re-image" },

{ instruction: "Document the decision and rationale in the evidence panel", tool: "Evidence panel", expectedResult: "Decision recorded" },

      ],
    },
{
      id: "t3",
      title: "Back up user data",
      description: "Back up any user files before wiping.",
      order: 3,
      steps: [
        { instruction: "If the disk is readable, boot to Windows and open Command Prompt as admin", tool: "Windows login → admin CMD", expectedResult: "Admin CMD opens", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: net use Z: \\\\FS-01\\UserBackups to map a backup share (create it first if it doesn't exist)", tool: "Command Prompt", expectedResult: "Backup share mapped to Z:", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: robocopy C:\\Users\\<username> Z:\\WS-12\\<date> /E /R:3 /W:5 to copy user profile", tool: "Command Prompt", expectedResult: "Files copied to backup location", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Verify the backup size and key folders (Desktop, Documents) are present on Z:", tool: "File Explorer → Z: drive", expectedResult: "Backup verified", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Document the backup path and file count in the evidence panel", tool: "Evidence panel", expectedResult: "Backup evidence saved" },

      ],
    },
{
      id: "t4",
      title: "Re-image the workstation",
      description: "Apply standard image, install drivers, join to domain.",
      order: 4,
      steps: [
        { instruction: "Insert Windows install media (USB or mount ISO) and boot from it", tool: "BIOS/UEFI boot menu", expectedResult: "Windows Setup starts" },

{ instruction: "On the 'Where do you want to install Windows?' screen, select the target disk → click Format → click Next", tool: "Windows Setup installer", expectedResult: "Partition formatted" },

{ instruction: "Wait for Windows installation to complete — the machine will restart automatically", tool: "Windows Setup progress", expectedResult: "Windows desktop loads after install" },

{ instruction: "After first login, install manufacturer drivers: run the driver pack .exe or install from Device Manager → right-click devices → Update Driver", tool: "Device Manager", expectedResult: "All devices show no yellow triangles" },

{ instruction: "Join to domain: Settings → System → About → Rename this PC (advanced) → Domain → enter warehouse.local → provide admin credentials", tool: "Windows Settings → System → About", expectedResult: "Computer joined to warehouse.local domain" },

{ instruction: "Restart the computer and log in as a domain user", tool: "Windows logon screen", expectedResult: "Domain user logged in" },

      ],
    },
{
      id: "t5",
      title: "Verify and return to user",
      description: "Test all critical services, hand back to user.",
      order: 5,
      steps: [
        { instruction: "Open Command Prompt and run: gpupdate /force to apply group policies", tool: "Command Prompt as admin", expectedResult: "GPOs applied without errors", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Verify mapped drives: open File Explorer — the Operations O: drive should appear", tool: "File Explorer", expectedResult: "O: drive visible and accessible", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Verify network: ping dc-01.warehouse.local and ping google.com", tool: "Command Prompt", expectedResult: "Both pings successful", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check print queue: Settings → Devices → Printers — Warehouse-Printer-01 should be listed", tool: "Windows Settings → Devices", expectedResult: "Printer visible and Ready" },

{ instruction: "Restore user data: robocopy Z:\\WS-12\\<date> C:\\Users\\<username> /E /R:3", tool: "Command Prompt as admin", expectedResult: "User files restored", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document the full procedure including hardware findings, backup path, and final config state", tool: "Evidence panel", expectedResult: "Full deployment evidence saved" },

      ],
    },
  ],
  incident: {
    id: "inc09",
    severity: "low",
    symptoms: [
      "Workstation BSODs intermittently",
      "Disk S.M.A.R.T. shows ReallocatedSectorCount > 0",
    ],
    affectedAssets: ["Workstation-WS-12"],
    initialState: {
      "Disk health": "Degrading",
      "RAM": "Passes MemTest",
    },
    hiddenRootCause:
      "Failing hard drive (SMART warnings). The proper fix is to replace the disk and re-image. Re-imaging without replacing the disk would just delay the issue.",
    allowedActions: [
      "chkdsk",
      "Get-PhysicalDisk",
      "smartctl",
      "memtest",
      "review event log",
    ],
    forbiddenActions: [
      "re-image over failing disk",
      "ignore SMART warnings",
    ],
    evidenceRevealedOnAction: {
      "Get-PhysicalDisk": [
        { id: "ev1", label: "Disk health", value: "HealthStatus: Warning; ReallocatedSectors > 0", collectedAt: "" },
      ],
    },
    resolution:
      "Replace the hard drive. Image the new drive. Restore user data. Return workstation to user with new disk.",
    businessImpact:
      "User productivity impacted; failing disk risks data loss if not addressed.",
  },
  hints: [
    { level: 1, text: "The BSOD is intermittent. Is it a software issue or hardware? Check the disk first." },
    { level: 2, text: "What does SMART status say about the disk? SMART warnings should never be ignored." },
    { level: 3, text: "Run 'Get-PhysicalDisk' or 'smartctl' to check for reallocated sectors or pending sectors." },
    { level: 4, text: "A disk with SMART warnings is failing. Re-imaging won't fix a hardware problem." },
    { level: 5, text: "Solution: replace the disk, then re-image the new disk, then restore user data." },
  ],
  validation: [
    { id: "v1", description: "Disk replaced before imaging", command: "Evidence of old disk removal", expectedResult: "Old disk quarantined, new disk installed", points: 10 },
    { id: "v2", description: "Domain joined", command: "systeminfo | findstr /Domain", expectedResult: "Domain: warehouse.local", points: 5 },
    { id: "v3", description: "User data restored", command: "Check user profile folders", expectedResult: "Desktop/Documents accessible", points: 5 },
  ],
  rubric: [
    { criterion: "Diagnosis", description: "Identified disk failure correctly", maxPoints: 25 },
    { criterion: "Decision quality", description: "Chose repair path (replace disk) before imaging", maxPoints: 20 },
    { criterion: "Backup", description: "User data backed up before re-image", maxPoints: 20 },
    { criterion: "Deployment quality", description: "Domain joined, drivers installed, services working", maxPoints: 20 },
    { criterion: "Documentation", description: "Full procedure documented", maxPoints: 15 },
  ],
  requiredEvidence: ["SMART screenshot", "Backup confirmation", "Domain join confirmation"],
  deliverables: ["Hardware diagnosis report", "Imaging SOP", "Deployment checklist"],
  interviewQuestion:
    "A user's PC BSODs every few days. They want a new PC. How do you decide whether to replace the hardware or just re-image?",
};
