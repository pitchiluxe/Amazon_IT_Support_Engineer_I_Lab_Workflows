import type { Lab } from "@/types";

export const lab16: Lab = {
  id: "lab16",
  number: 16,
  title: "Video Conference Room Support",
  category: "infrastructure",
  difficulty: "intermediate",
  estimatedMinutes: 60,
  objectives: [
    "Diagnose a video conference room issue",
    "Test microphone, camera, display, and network",
    "Document a VC room readiness procedure",
  ],
  prerequisites: [],
  scenario:
    "A manager says 'the conference room is broken — we have a meeting in 10 minutes.' You need to triage and fix (or escalate) quickly.",
  environment: [
    "VC room with display, camera, mic, codec",
    "Network access",
    "Test call capability",
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
      title: "Triage symptoms",
      description: "What exactly is not working — audio, video, network, codec?",
      order: 1,
      steps: [
        { instruction: "Ask the manager to describe the issue: is it no audio, no video, no network, or the codec not connecting?", tool: "Verbal or phone communication", expectedResult: "Symptoms described: audio/video/network/codec" },

{ instruction: "Check the codec display: does it show a standby screen, an error code, or a connection screen?", tool: "Look at the VC room display", expectedResult: "Codec state observed",  },

{ instruction: "Check the codec front panel LEDs: network LED (green = connected, off = no link), call LED (green = in call, amber = ready)", tool: "Codec front panel LEDs", expectedResult: "LED status noted" },

{ instruction: "Document the symptoms and initial observations in the evidence panel", tool: "Evidence panel", expectedResult: "Symptoms documented" },

      ],
    },
{
      id: "t2",
      title: "Test network",
      description: "Verify the room has network and DNS.",
      order: 2,
      steps: [
        { instruction: "On the codec or a laptop in the room, run: ping <gateway IP> to test network connectivity", tool: "Codec console or laptop in room", expectedResult: "Ping result: success or timeout" },

{ instruction: "Run: ping dc-01.warehouse.local or ping google.com to test DNS and internet", tool: "Codec console or laptop in room", expectedResult: "Ping result: success or timeout" },

{ instruction: "Check the network port on the wall or table: is the cable connected? Is there a link light?", tool: "Physical cable inspection", expectedResult: "Physical connection status noted" },

{ instruction: "If no network: try swapping the network cable with a known-good cable", tool: "Network cable swap", expectedResult: "Network restored or confirmed cable not the issue" },

{ instruction: "Document network findings in the evidence panel", tool: "Evidence panel", expectedResult: "Network test results saved" },

      ],
    },
{
      id: "t3",
      title: "Test devices",
      description: "Verify mic, camera, display.",
      order: 3,
      steps: [
        { instruction: "Test the microphone: speak into the table mic or ceiling mic — does the codec show audio input levels?", tool: "Codec diagnostics → audio", expectedResult: "Audio levels displayed or mute shown" },

{ instruction: "Test the camera: does the codec show a live video feed? Is the camera PTZ (pan-tilt-zoom) responding?", tool: "Codec video diagnostics", expectedResult: "Live video feed visible" },

{ instruction: "Test the display: does the TV/monitor show the codec home screen? Try cycling the display input", tool: "TV/monitor remote → Input source", expectedResult: "Codec output visible on display" },

{ instruction: "Test the speaker: use the codec's built-in test tone or play audio from the codec", tool: "Codec audio test", expectedResult: "Audio heard from speakers" },

{ instruction: "Document which device is failing (mic, camera, display, or speaker)", tool: "Evidence panel", expectedResult: "Device status documented" },

      ],
    },
{
      id: "t4",
      title: "Test codec",
      description: "Place a test call.",
      order: 4,
      steps: [
        { instruction: "Open the codec dial pad and enter a test call number or the IT team's VC extension", tool: "Codec remote control", expectedResult: "Call initiated" },

{ instruction: "Observe the call progress: dialing → ringing → connected or error", tool: "Codec display", expectedResult: "Call status shown" },

{ instruction: "If call connects: verify audio (can you hear and be heard?) and video (can you see and be seen?)", tool: "Codec during test call", expectedResult: "Two-way audio and video confirmed" },

{ instruction: "If call fails: note the error code shown on the codec display (e.g., 'H.323 gatekeeper not found', 'SIP registration failed')", tool: "Codec display error", expectedResult: "Error code noted" },

{ instruction: "Document the test call result in the evidence panel", tool: "Evidence panel", expectedResult: "Test call result saved" },

      ],
    },
{
      id: "t5",
      title: "Resolve or escalate",
      description: "Fix or escalate to the VC vendor.",
      order: 5,
      steps: [
        { instruction: "If the issue is network: fix the cable or port, re-test. If the codec needs a restart: power cycle it (off, wait 10s, on)", tool: "Physical fix", expectedResult: "Issue fixed or confirmed persistent" },

{ instruction: "If the codec shows a firmware error or SIP registration failure: check the codec's network settings (IP, gateway, H.323/SIP server)", tool: "Codec settings menu", expectedResult: "Settings reviewed" },

{ instruction: "If the codec is hardware-failed (no display, no LEDs, no network): escalate to the VC vendor immediately with the serial number and error codes", tool: "Escalation email/ticket", expectedResult: "Ticket created with vendor" },

{ instruction: "If no resolution before the meeting: set up a Teams/Zoom call on a laptop as a fallback — use the laptop mic, camera, and screen sharing", tool: "Laptop fallback setup", expectedResult: "Backup meeting established" },

{ instruction: "Document the resolution and any escalations in the evidence panel", tool: "Evidence panel", expectedResult: "Resolution documented" },

      ],
    },
  ],
  incident: {
    id: "inc16",
    severity: "medium",
    symptoms: [
      "Codec shows 'Registering...' and never connects",
      "Camera works but no audio",
    ],
    affectedAssets: ["VC Room 1 codec", "Network switch"],
    initialState: {
      "Codec": "Network cable connected, but DNS or gatekeeper misconfigured",
      "Audio": "Codec firmware issue",
    },
    hiddenRootCause:
      "The codec's DNS server is misconfigured — it points to 8.8.8.8 instead of the internal DC. Without internal DNS, it cannot register to the H.323 gatekeeper. The audio issue is a separate codec firmware bug.",
    allowedActions: [
      "ping test",
      "nslookup",
      "codec diagnostics",
      "cable swap",
      "firmware check",
    ],
    forbiddenActions: ["reboot codec during a live call", "disable security without review"],
    evidenceRevealedOnAction: {
      "ping test": [
        { id: "ev1", label: "Network test", value: "Internet works but internal DNS fails", collectedAt: "" },
      ],
    },
    resolution:
      "Update the codec's DNS settings to point to the DC. Reboot the codec. If audio issue persists, update firmware.",
    businessImpact:
      "The meeting cannot proceed via VC — business communication disrupted.",
  },
  hints: [
    { level: 1, text: "Is the codec getting network? Check basic connectivity first." },
    { level: 2, text: "Can the codec reach internal resources? Try ping to the DC." },
    { level: 3, text: "Check the codec's DNS settings — does it point to the internal DNS server?" },
    { level: 4, text: "DNS misconfiguration would prevent H.323 gatekeeper registration." },
    { level: 5, text: "Solution: update codec DNS to 10.0.0.10, reboot. For audio: update firmware." },
  ],
  validation: [
    { id: "v1", description: "Codec registered", command: "Codec display", expectedResult: "Registered to gatekeeper", points: 10 },
    { id: "v2", description: "Test call successful", command: "Codec → test call", expectedResult: "Two-way audio and video confirmed", points: 10 },
  ],
  rubric: [
    { criterion: "Triage speed", description: "Quickly identified the issue category", maxPoints: 20 },
    { criterion: "Network diagnosis", description: "Correctly tested network and identified DNS issue", maxPoints: 25 },
    { criterion: "Device testing", description: "Tested mic, camera, display systematically", maxPoints: 20 },
    { criterion: "Resolution", description: "Fixed or escalated appropriately", maxPoints: 20 },
    { criterion: "Documentation", description: "VC room readiness procedure documented", maxPoints: 15 },
  ],
  requiredEvidence: ["Symptom log", "Network test results", "Test call result"],
  deliverables: ["VC room readiness SOP", "Troubleshooting decision tree", "Escalation contacts"],
  interviewQuestion:
    "You walk into a VC room 5 minutes before a CEO call and nothing works. Walk me through what you check in what order.",
};
