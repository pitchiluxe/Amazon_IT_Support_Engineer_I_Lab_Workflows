import type { Lab } from "@/types";

export const lab10: Lab = {
  id: "lab10",
  number: 10,
  title: "Windows/Linux/macOS Support",
  category: "windows",
  difficulty: "intermediate",
  estimatedMinutes: 75,
  objectives: [
    "Use OS-specific tools to gather system information",
    "Diagnose common issues on each OS",
    "Document a multi-OS support process",
  ],
  prerequisites: [],
  scenario:
    "Your site supports a small number of Linux and macOS endpoints alongside Windows. A Linux server has a service that won't start; a macOS user cannot connect to a network share.",
  environment: [
    "Ubuntu Server VM (or similar)",
    "macOS VM (if legally supported) or documented concepts",
    "Windows client for comparison",
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
      title: "Diagnose Linux service",
      description: "A systemd service won't start. Find the cause.",
      order: 1,
      steps: [
        { instruction: "On the Linux server (e.g., 10.0.0.20), SSH in or open a local terminal", tool: "Terminal or SSH client (e.g., PuTTY)", expectedResult: "Shell session opened" },

{ instruction: "Run: systemctl status app.service to check the service status", tool: "Linux terminal", expectedResult: "Service status: failed or inactive shown" },

{ instruction: "Run: journalctl -u app.service -n 50 --no-pager to view recent log entries", tool: "Linux terminal", expectedResult: "Log output shows error details" },

{ instruction: "Look for 'ExecStart' errors: No such file or Exec format error indicates a missing binary", tool: "journalctl output", expectedResult: "Error type identified" },

{ instruction: "Run: ls -la /opt/app/bin/ (or the path from ExecStart) to verify the binary exists", tool: "Linux terminal", expectedResult: "Binary missing or path wrong" },

{ instruction: "Document evidence: service fails with 203/EXEC, binary path does not exist", tool: "Evidence panel", expectedResult: "Evidence: binary path error confirmed" },

{ instruction: "Submit diagnosis: ExecStart points to a moved binary — service unit file needs updating", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
{
      id: "t2",
      title: "Diagnose macOS network share",
      description: "macOS user cannot mount a SMB share. Find the cause.",
      order: 2,
      steps: [
        { instruction: "On the macOS client, open Finder → Go → Connect to Server (Cmd+K)", tool: "Finder → Go menu", expectedResult: "Connect to Server dialog opens" },

{ instruction: "Enter: smb://warehouse.local/Operations and click Connect", tool: "Connect to Server dialog", expectedResult: "Authentication prompt appears" },

{ instruction: "Try to authenticate — if it fails, note the exact error (permission denied vs server unreachable)", tool: "Authentication dialog", expectedResult: "Error message shown" },

{ instruction: "Open Terminal and run: smbutil status -v warehouse.local to check SMB connectivity", tool: "macOS Terminal", expectedResult: "SMB status returned" },

{ instruction: "Run: smbutil shares //user@warehouse.local/Operations to enumerate shares with credentials", tool: "macOS Terminal", expectedResult: "Shares list or auth error" },

{ instruction: "Check System Settings → Network → Wi-Fi/Ethernet for DNS and confirm it points to DC-01 (10.0.0.10)", tool: "macOS System Settings → Network", expectedResult: "DNS server identified" },

{ instruction: "Document evidence: SMB signing mismatch or DNS misconfiguration causing mount failure", tool: "Evidence panel", expectedResult: "Evidence: SMB mount fault confirmed" },

{ instruction: "Submit diagnosis: SMB signing required by server but not enabled on macOS client", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
{
      id: "t3",
      title: "Document multi-OS SOP",
      description: "Build a cross-platform diagnostic quick-reference.",
      order: 3,
      steps: [
        { instruction: "Create a markdown file: Multi-OS-Diagnostics.md", tool: "VS Code or Notepad", expectedResult: "File created" },

{ instruction: "Add a table with columns: Issue | Windows | Linux | macOS", tool: "Markdown file", expectedResult: "Table structure added" },

{ instruction: "Document: Network test → Windows: ping / tracert / ipconfig | Linux: ping / traceroute / ip addr | macOS: ping / traceroute / networksetup -listallhardwareports", tool: "Markdown file → Network section", expectedResult: "Network tools documented" },

{ instruction: "Document: Service management → Windows: Get-Service / Restart-Service | Linux: systemctl status / restart | macOS: launchctl list / sudo launchctl kickstart", tool: "Markdown file → Services section", expectedResult: "Service commands documented" },

{ instruction: "Document: Disk health → Windows: Get-PhysicalDisk / chkdsk | Linux: smartctl / lsblk | macOS: diskutil list / smartctl", tool: "Markdown file → Storage section", expectedResult: "Storage tools documented" },

{ instruction: "Document: SMB share access → Windows: net use | Linux: mount.cifs / smbclient | macOS: smbutil / Finder → Connect to Server", tool: "Markdown file → File shares section", expectedResult: "SMB commands documented", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Save and submit the document as evidence", tool: "Evidence panel", expectedResult: "SOP saved as evidence" },

      ],
    },
  ],
  incident: {
    id: "inc10",
    severity: "medium",
    symptoms: [
      "Linux service 'app.service' fails to start on boot",
      "macOS user cannot mount \\\\fileserver\\Operations",
    ],
    affectedAssets: ["Linux-01", "macOS-User"],
    initialState: {
      "Linux": "service unit file is owned by root with restrictive ExecStart",
      "macOS": "Share mount fails with 'permission denied' or 'server unreachable'",
    },
    hiddenRootCause:
      "Linux: the service's ExecStart references a binary path that doesn't exist (binary was moved). macOS: SMB signing mismatch (server requires signing, client not configured). Both are common cross-platform issues.",
    allowedActions: [
      "systemctl status",
      "journalctl -xe",
      "ls -la on binary path",
      "smbutil (macOS)",
      "Console.app (macOS)",
    ],
    forbiddenActions: [
      "disable AppArmor/SELinux without review",
      "allow guest SMB without security review",
    ],
    evidenceRevealedOnAction: {
      "systemctl status": [
        { id: "ev1", label: "Linux service status", value: "Failed with status 203/EXEC", collectedAt: "" },
      ],
      "journalctl -xe": [
        { id: "ev2", label: "Service log", value: "Exec format error or No such file", collectedAt: "" },
      ],
    },
    resolution:
      "Linux: update ExecStart in the .service file to point to the correct binary path and run systemctl daemon-reload. macOS: enable SMB signing on the client or disable required signing on the server.",
    businessImpact:
      "Linux automation is down. macOS user cannot access shared files.",
  },
  hints: [
    { level: 1, text: "The service won't start. Check what the service log says — it's usually very specific." },
    { level: 2, text: "For Linux: does the binary that ExecStart points to actually exist?" },
    { level: 3, text: "Run 'journalctl -u app.service' and look for the exact error code and message." },
    { level: 4, text: "For macOS: is it a DNS issue (can't find server) or an authentication issue?" },
    { level: 5, text: "Linux fix: update the unit file path and daemon-reload. macOS fix: enable SMB signing or adjust server settings." },
  ],
  validation: [
    { id: "v1", description: "Linux service starts", command: "systemctl start app.service", expectedResult: "Active: running", points: 10 },
    { id: "v2", description: "macOS shares accessible", command: "smbutil shares //user@warehouse.local/Operations", expectedResult: "Share list returned", points: 10 },
    { id: "v3", description: "SOP documented", command: "Multi-OS-Diagnostics.md exists", expectedResult: "File present with all 4 sections", points: 5 },
  ],
  rubric: [
    { criterion: "Linux diagnosis", description: "Found binary path issue", maxPoints: 25 },
    { criterion: "macOS diagnosis", description: "Found SMB signing issue", maxPoints: 25 },
    { criterion: "SOP completeness", description: "Covers all three OSes with key commands", maxPoints: 25 },
    { criterion: "Fix quality", description: "Correct fixes for both issues", maxPoints: 25 },
  ],
  requiredEvidence: ["journalctl output", "smbutil output", "Multi-OS-Diagnostics.md"],
  deliverables: ["Multi-OS diagnostic SOP", "Linux fix notes", "macOS fix notes"],
  interviewQuestion:
    "A Linux server and a Mac user both call you at the same time. One can't start a service, one can't access a file share. Walk me through how you triage and handle both simultaneously.",
};
