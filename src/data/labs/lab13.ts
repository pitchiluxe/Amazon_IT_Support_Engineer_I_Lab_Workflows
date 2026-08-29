import type { Lab } from "@/types";

export const lab13: Lab = {
  id: "lab13",
  number: 13,
  title: "Data Cabling & Layer-1 Fault Isolation",
  category: "networking",
  difficulty: "intermediate",
  estimatedMinutes: 60,
  objectives: [
    "Use a cable tester to verify a cable run",
    "Identify common cabling faults (open, short, split, crosstalk)",
    "Replace a faulty patch cable",
    "Document cabling standards and labeling",
  ],
  prerequisites: [],
  scenario:
    "A user reports intermittent connectivity. Cable tester shows the run is faulty. You must isolate the fault and replace the affected component.",
  environment: [
    "Cable tester",
    "Known-good patch cables",
    "Wall plate and patch panel access",
    "Cable labeling supplies",
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
      title: "Test cable run",
      description: "Use the tester to identify the fault type.",
      order: 1,
      steps: [
        { instruction: "Identify the failing cable run — the user reports intermittent drops", tool: "User report", expectedResult: "Affected port identified (e.g., Wall plate port B3)" },

{ instruction: "Set up the cable tester: connect the remote (far end) to the wall plate jack, the main unit to the patch panel port", tool: "Cable tester", expectedResult: "Both ends connected" },

{ instruction: "Run the test — observe the LED pattern on the cable tester", tool: "Cable tester display", expectedResult: "Fault type indicated (Open/Short/Split)" },

{ instruction: "Note the fault type: if all 8 wires light up green → pass; if one pair is red → wire map fault; if all off → open circuit", tool: "Cable tester result", expectedResult: "Fault type identified" },

{ instruction: "Document the result: port, cable ID, fault type, and tester model", tool: "Evidence panel", expectedResult: "Test result documented" },

      ],
    },
{
      id: "t2",
      title: "Isolate fault",
      description: "Determine if the fault is in the patch, run, or termination.",
      order: 2,
      steps: [
        { instruction: "Test the patch cable (short cable from patch panel to switch): connect both ends to the tester", tool: "Cable tester", expectedResult: "Patch cable test result" },

{ instruction: "Test the wall plate cable (from wall to PC): connect the tester across the wall jack at both ends", tool: "Cable tester → wall jack", expectedResult: "Wall plate test result" },

{ instruction: "Check the patch panel termination: visually inspect the IDC contacts — are any wires loose or crossed?", tool: "Patch panel visual inspection", expectedResult: "Termination condition noted" },

{ instruction: "Decision: if patch cable fails → replace patch cable; if wall plate fails → replace cable or re-terminate", tool: "Test result analysis", expectedResult: "Fault location identified" },

{ instruction: "Document the fault location: patch cable, wall plate, or horizontal run", tool: "Evidence panel", expectedResult: "Fault isolation documented" },

      ],
    },
{
      id: "t3",
      title: "Replace faulty component",
      description: "Replace the bad cable or re-terminate.",
      order: 3,
      steps: [
        { instruction: "If the patch cable is faulty: remove the bad patch cable from both the patch panel and the switch", tool: "Physical patch panel", expectedResult: "Old cable removed" },

{ instruction: "Install a new Cat6 (or appropriate grade) patch cable of the same length", tool: "New patch cable installation", expectedResult: "New cable connected" },

{ instruction: "Re-run the cable test on the new patch cable", tool: "Cable tester", expectedResult: "New cable passes all tests" },

{ instruction: "If the wall plate termination is faulty: remove the faceplate, check wire order (T568A or T568B — must be consistent at both ends)", tool: "Wall plate inspection", expectedResult: "Wire sequence confirmed" },

{ instruction: "Re-terminate using a punch-down tool: match the color code to T568A or T568B standard, punch each wire firmly into the IDC slot", tool: "Punch-down tool", expectedResult: "All wires seated correctly" },

{ instruction: "Re-test: run the full cable test again after re-termination", tool: "Cable tester", expectedResult: "Full run passes" },

      ],
    },
{
      id: "t4",
      title: "Validate",
      description: "Re-test and confirm link up at full speed.",
      order: 4,
      steps: [
        { instruction: "Run a full cable test on the complete run (patch panel to wall plate)", tool: "Cable tester", expectedResult: "Test result: PASS, all 4 pairs" },

{ instruction: "Connect the PC to the wall plate and verify the switch port shows link (green LED)", tool: "PC NIC → wall plate → switch", expectedResult: "Green link LED on switch port" },

{ instruction: "On the PC, run a speed test: transfer a large file to confirm full gigabit speed", tool: "File Explorer → copy large file", expectedResult: "Transfer completes at expected speed", nodeId: "fs-01", toolId: "file-explorer" },

{ instruction: "Ping the gateway: ping <gateway IP> to confirm no packet loss", tool: "Command Prompt on PC", expectedResult: "Packets: 4 sent, 4 received, 0% loss", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document final test results and confirm the issue is resolved", tool: "Evidence panel", expectedResult: "Validation complete" },

      ],
    },
{
      id: "t5",
      title: "Document",
      description: "Update cabling records and labeling.",
      order: 5,
      steps: [
        { instruction: "Update the cabling register: port B3 — patch panel port PP-07 → wall plate B3 → re-terminated and tested 2024-XX-XX", tool: "Cabling register (spreadsheet or asset tool)", expectedResult: "Record updated" },

{ instruction: "Print a label for the patch panel port: PP-07 (Building-Floor-PatchPort)", tool: "Label printer (Brother P-Touch or similar)", expectedResult: "Label printed", nodeId: "fs-01", toolId: "print" },

{ instruction: "Print a label for the wall plate: B3 (Building-Floor-WallPort)", tool: "Label printer", expectedResult: "Label printed", nodeId: "fs-01", toolId: "print" },

{ instruction: "Apply labels to both ends of the cable run", tool: "Physical cable labeling", expectedResult: "Both ends labeled" },

{ instruction: "Save the cabling register update as evidence", tool: "Evidence panel", expectedResult: "Documentation complete" },

      ],
    },
  ],
  incident: {
    id: "inc13",
    severity: "low",
    symptoms: [
      "Intermittent connectivity drops",
      "Cable tester shows open or short on specific pairs",
    ],
    affectedAssets: ["Patch cable PP-07", "Wall plate B3"],
    initialState: {
      "Fault type": "Open circuit on pairs 3-4 (blue, green)",
      "Location": "Patch cable or wall plate",
    },
    hiddenRootCause:
      "The patch cable connecting the patch panel to the switch has a broken conductor (pairs 3-4 open). The fix is to replace the patch cable.",
    allowedActions: [
      "cable tester",
      "visual inspection",
      "TDR test",
    ],
    forbiddenActions: [
      "replace permanent horizontal cable unnecessarily",
      "bypass the structured cabling standard",
    ],
    evidenceRevealedOnAction: {
      "cable tester": [
        { id: "ev1", label: "Patch cable test", value: "Open circuit on pairs 3-4", collectedAt: "" },
      ],
      "visual inspection": [
        { id: "ev2", label: "Patch cable condition", value: "Visible kinking near connector", collectedAt: "" },
      ],
    },
    resolution:
      "Replace the patch cable. Re-test the full run. Confirm 1000BASE-T connectivity at full gigabit speed.",
    businessImpact:
      "User productivity impacted by intermittent drops.",
  },
  hints: [
    { level: 1, text: "Is the fault in the patch cable, the wall plate, or the permanent horizontal run?" },
    { level: 2, text: "Test the patch cable first — it's the easiest component to replace." },
    { level: 3, text: "Use the cable tester in wiremap mode to identify which pairs are affected." },
    { level: 4, text: "Visual inspection of the patch cable connector can reveal kinks or broken conductors." },
    { level: 5, text: "Solution: replace the patch cable. Re-test the full run. Label both ends." },
  ],
  validation: [
    { id: "v1", description: "Cable test passes", command: "Cable tester", expectedResult: "All 4 pairs PASS", points: 10 },
    { id: "v2", description: "Link established", command: "Switch port LED", expectedResult: "Green link light", points: 10 },
    { id: "v3", description: "No packet loss", command: "ping gateway", expectedResult: "0% loss", points: 5 },
  ],
  rubric: [
    { criterion: "Fault isolation", description: "Correctly identified the faulty component", maxPoints: 25 },
    { criterion: "Repair quality", description: "Replaced/repaired correctly, no new faults", maxPoints: 25 },
    { criterion: "Validation", description: "Tested at full speed, confirmed no drops", maxPoints: 20 },
    { criterion: "Documentation", description: "Cabling register updated and labeled", maxPoints: 15 },
    { criterion: "Standards compliance", description: "Used correct cable grade and T568A/B standard", maxPoints: 15 },
  ],
  requiredEvidence: ["Cable tester results (before and after)", "Ping test", "Labeled ports"],
  deliverables: ["Cabling fault report", "Before/after test results", "Updated register"],
  interviewQuestion:
    "A user has intermittent network drops. Walk me through how you determine whether it's a Layer 1 (cable), Layer 2 (switch port), or Layer 3 (VLAN/routing) issue.",
};
