import type { Lab } from "@/types";

export const lab17: Lab = {
  id: "lab17",
  number: 17,
  title: "IT Asset Deployment, Return & Liquidation",
  category: "operations",
  difficulty: "intermediate",
  estimatedMinutes: 60,
  objectives: [
    "Document an asset from procurement to liquidation",
    "Implement a secure data wipe procedure",
    "Use an asset register to track lifecycle",
  ],
  prerequisites: [],
  scenario:
    "You receive 5 retired laptops from a department. They must be securely wiped, re-imaged or liquidated, and the asset register updated.",
  environment: [
    "5 retired laptops",
    "Disk wipe tool (e.g., DBAN or manufacturer secure erase)",
    "Standard re-image media",
    "Asset register template",
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
      title: "Receive assets",
      description: "Log received assets into the register with condition notes.",
      order: 1,
      steps: [
        { instruction: "Open the asset register spreadsheet (or asset management tool)", tool: "Excel or asset management tool", expectedResult: "Asset register open" },

{ instruction: "For each laptop: record Asset Tag, Serial Number, Manufacturer, Model, RAM, Storage size, and condition (Good/Fair/Poor)", tool: "Physical laptop inspection", expectedResult: "All 5 laptops recorded" },

{ instruction: "Physically inspect each laptop: check for cracked screens, missing keys, battery swelling — note condition on each row", tool: "Physical inspection", expectedResult: "Condition noted for each asset" },

{ instruction: "Boot each laptop briefly to confirm it powers on — note any that do not", tool: "Power on each laptop", expectedResult: "Boot test results recorded" },

{ instruction: "Photograph each laptop (front, bottom with asset tag) for the register", tool: "Phone or camera", expectedResult: "Photos saved" },

{ instruction: "Update the register: set Status = 'Retired', Disposition = 'Pending Wipe', Date Retired = today", tool: "Asset register", expectedResult: "Register updated for all 5 laptops" },

      ],
    },
{
      id: "t2",
      title: "Data wipe decision",
      description: "Decide wipe method (NIST 800-88 Purge vs Clear).",
      order: 2,
      steps: [
        { instruction: "Determine the data sensitivity: these are standard user laptops — use NIST 800-88 Purge (crypto erase or ATA Secure Erase)", tool: "Data classification policy review", expectedResult: "Wipe method determined" },

{ instruction: "For laptops with SSDs: use crypto erase (BitLocker) — initiate 'Manage BitLocker → Disable BitLocker' and wait for completion", tool: "BitLocker on each laptop", expectedResult: "BitLocker suspended/key cleared" },

{ instruction: "For laptops with HDDs: use DBAN or manufacturer secure erase tool", tool: "DBAN USB boot drive", expectedResult: "DBAN boot drive ready" },

{ instruction: "Decision table: SSD with BitLocker → crypto erase; SSD without BitLocker → manufacturer secure erase; HDD → DBAN 1-pass or NIST Purge", tool: "Wipe method table", expectedResult: "Wipe method assigned to each laptop" },

{ instruction: "Document the wipe method decision in the asset register", tool: "Asset register", expectedResult: "Wipe method recorded" },

      ],
    },
{
      id: "t3",
      title: "Perform wipe",
      description: "Execute the secure wipe and capture evidence.",
      order: 3,
      steps: [
        { instruction: "For HDDs with DBAN: boot each laptop from the DBAN USB, select the target disk, set DOD 5220.22-M (1-pass is sufficient for NIST Purge), start wipe", tool: "DBAN boot screen", expectedResult: "Wipe in progress on each laptop" },

{ instruction: "For SSDs: boot into Windows → open Command Prompt as admin → run: manage-bde -off C: to fully decrypt, then run: manage-bde -status C: to confirm encryption is off", tool: "Command Prompt on SSD laptop", expectedResult: "BitLocker fully removed", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "For manufacturer secure erase: run the secure erase command via the OEM tool (e.g., Samsung Magician → Secure Erase)", tool: "OEM tool on SSD laptop", expectedResult: "SSD securely erased" },

{ instruction: "After wipe completes: boot each laptop to confirm it shows 'No operating system found' — this confirms the wipe", tool: "BIOS boot screen", expectedResult: "No OS found — wipe confirmed" },

{ instruction: "Photograph the 'No OS found' screen for each laptop as evidence", tool: "Phone or camera", expectedResult: "Wipe evidence photos saved" },

{ instruction: "Document wipe completion: date, method, technician, and outcome for each laptop in the register", tool: "Asset register", expectedResult: "Wipe evidence documented" },

      ],
    },
{
      id: "t4",
      title: "Re-image or liquidate",
      description: "Re-image for redeployment or send to liquidation vendor.",
      order: 4,
      steps: [
        { instruction: "Assess each laptop: if condition is Good and age < 4 years → re-image for redeployment; if Fair or Poor or age > 4 years → send to liquidation", tool: "Asset condition review", expectedResult: "Disposition decision for each laptop" },

{ instruction: "For re-image candidates: boot from Windows USB, install Windows, join to domain, install standard software", tool: "Windows installation media", expectedResult: "Windows installed and updated" },

{ instruction: "For liquidation candidates: contact the approved liquidation vendor, get a quote, arrange pickup", tool: "Vendor contact", expectedResult: "Pickup scheduled" },

{ instruction: "For re-imaged laptops: update register: Status = 'Available', Location = IT Storage, Disposition = 'Redeployment'", tool: "Asset register", expectedResult: "Register updated" },

{ instruction: "For liquidated laptops: update register: Status = 'Liquidated', Disposition = 'Liquidation', Vendor = '[vendor name]', Certificate of Destruction obtained", tool: "Asset register", expectedResult: "Register updated with liquidation info" },

      ],
    },
{
      id: "t5",
      title: "Update register",
      description: "Update asset status, location, and disposition.",
      order: 5,
      steps: [
        { instruction: "Review the register for completeness: all 5 laptops should have Asset Tag, Serial, Wipe Date, Wipe Method, Disposition, and Status", tool: "Asset register review", expectedResult: "All fields populated" },

{ instruction: "Attach wipe evidence (photos of 'No OS found' and DBAN completion screen) to the register or store in the evidence folder", tool: "Evidence folder", expectedResult: "Evidence attached" },

{ instruction: "Update the location field for each asset: IT Storage (redeployed) or 'With Vendor' (liquidated)", tool: "Asset register", expectedResult: "Locations updated" },

{ instruction: "Save the updated register and submit it as evidence", tool: "Asset register → save", expectedResult: "Register saved" },

{ instruction: "Document the complete process as a SOP in the evidence panel", tool: "Evidence panel", expectedResult: "Asset lifecycle SOP saved" },

      ],
    },
  ],
  incident: {
    id: "inc17",
    severity: "low",
    symptoms: [
      "Asset register shows laptops as 'Active' after they were returned",
      "No wipe evidence on file",
    ],
    affectedAssets: ["5 retired laptops"],
    initialState: {
      "Register": "Laptops still show 'Active'",
      "Wipe status": "Not performed",
    },
    hiddenRootCause:
      "The laptops were returned but not processed — they are still in Active status with no wipe record. This is an asset management hygiene issue.",
    allowedActions: [
      "inventory check",
      "physical verification",
      "BIOS check",
    ],
    forbiddenActions: ["re-image without wipe", "dispose without documentation"],
    evidenceRevealedOnAction: {
      "inventory check": [
        { id: "ev1", label: "Register status", value: "All 5 laptops: Status = Active, no wipe record", collectedAt: "" },
      ],
    },
    resolution:
      "Process all 5 laptops through the full asset lifecycle: wipe, classify, and update register.",
    businessImpact:
      "Sensitive data at risk if laptops are not properly wiped. Non-compliant with data handling policy.",
  },
  hints: [
    { level: 1, text: "Are the laptops showing as 'Active' in the register but physically returned?" },
    { level: 2, text: "Was a secure wipe performed before the laptops were marked as disposed?" },
    { level: 3, text: "Check for any wipe evidence — logs, photos, or certificates of destruction." },
    { level: 4, text: "If no evidence exists, the wipe must be performed now before disposal." },
    { level: 5, text: "Solution: wipe all laptops, document the wipe, update the register, then liquidate or redeploy." },
  ],
  validation: [
    { id: "v1", description: "All laptops wiped", command: "Asset register", expectedResult: "Wipe date and method recorded for all 5", points: 10 },
    { id: "v2", description: "Register updated", command: "Asset register", expectedResult: "Status changed from Active to correct disposition", points: 10 },
  ],
  rubric: [
    { criterion: "Asset receiving", description: "All 5 laptops fully documented", maxPoints: 15 },
    { criterion: "Wipe decision", description: "Correct wipe method per NIST 800-88 for each device", maxPoints: 20 },
    { criterion: "Wipe execution", description: "Wipe performed with evidence captured", maxPoints: 25 },
    { criterion: "Disposition", description: "Redeployment vs liquidation decision correct", maxPoints: 15 },
    { criterion: "Register accuracy", description: "Register fully updated with all fields", maxPoints: 25 },
  ],
  requiredEvidence: ["Asset register", "Wipe evidence photos", "Certificate of Destruction (liquidated)"],
  deliverables: ["Asset lifecycle SOP", "Updated asset register", "Wipe evidence package"],
  interviewQuestion:
    "How do you ensure a laptop that was returned by an employee is safely handled before it goes to a new user or is disposed of?",
};
