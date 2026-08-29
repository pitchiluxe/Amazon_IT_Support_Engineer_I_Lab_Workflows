import type { Lab } from "@/types";

export const lab12: Lab = {
  id: "lab12",
  number: 12,
  title: "TCP/IP + OSI Troubleshooting",
  category: "networking",
  difficulty: "intermediate",
  estimatedMinutes: 75,
  objectives: [
    "Map troubleshooting steps to the OSI model",
    "Use ping, traceroute, nslookup, and netstat effectively",
    "Diagnose Layer 1-7 issues",
  ],
  prerequisites: [],
  scenario:
    "A user reports 'the internet is down' but other users on the same VLAN are working. You need to systematically isolate the failure across the OSI layers.",
  environment: [
    "Windows client with command line",
    "Network access",
    "Internal and external test targets",
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
      title: "Layer 1 check",
      description: "Verify physical link, link light, cable.",
      order: 1,
      steps: [
        { instruction: "On the failing PC, check the network icon in the system tray — does it show a red X or 'No Internet'?", tool: "Windows taskbar (bottom-right)", expectedResult: "Network status shown (connected/disconnected)" },

{ instruction: "Check the NIC link light on the PC (LED on the RJ45 port) — is it green/blinking or off?", tool: "Physical NIC port on PC", expectedResult: "Link light status noted" },

{ instruction: "Check the switch port link light — is it green and blinking?", tool: "Switch port LED", expectedResult: "Switch port status noted" },

{ instruction: "Try swapping the network cable with a known-good cable", tool: "Physical cable replacement", expectedResult: "Cable swapped" },

{ instruction: "Document Layer 1 findings: link light status, cable test result", tool: "Evidence panel", expectedResult: "Layer 1 check documented" },

      ],
    },
{
      id: "t2",
      title: "Layer 2 check",
      description: "Verify IP, subnet, gateway with ipconfig.",
      order: 2,
      steps: [
        { instruction: "Open Command Prompt and run: ipconfig /all", tool: "Start → cmd", expectedResult: "Full IP configuration displayed", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check: is an IP address assigned? Is it 169.254.x.x (APIPA) indicating no DHCP response?", tool: "ipconfig /all output", expectedResult: "IP address status identified", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check: is the subnet mask correct (e.g., 255.255.255.0)?", tool: "ipconfig /all output", expectedResult: "Subnet mask verified", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check: is the default gateway IP reachable on the local segment?", tool: "ipconfig /all output", expectedResult: "Gateway IP noted", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check: is the DNS server IP correct (should be the DC)?", tool: "ipconfig /all output", expectedResult: "DNS server identified", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document Layer 2 findings: IP address, subnet, gateway, DNS", tool: "Evidence panel", expectedResult: "Layer 2 check documented" },

      ],
    },
{
      id: "t3",
      title: "Layer 3 check",
      description: "Ping gateway, then remote host, then DNS.",
      order: 3,
      steps: [
        { instruction: "Ping the default gateway: ping <gateway IP>", tool: "Command Prompt", expectedResult: "Reply from gateway OR Request timed out", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "If gateway ping fails: ping the PC's own IP — verify the NIC is working", tool: "Command Prompt", expectedResult: "Reply from own IP (NIC is functional)", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Ping the local DHCP/DNS server (e.g., ping 10.0.0.10)", tool: "Command Prompt", expectedResult: "Ping result: success or timeout", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Ping an external IP (e.g., ping 8.8.8.8) — determines if the issue is local or upstream", tool: "Command Prompt", expectedResult: "Ping result: blocked (firewall) or no route vs success", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: tracert 8.8.8.8 to identify where packets stop", tool: "Command Prompt", expectedResult: "Traceroute shows which hop fails", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: nslookup google.com to check DNS resolution", tool: "Command Prompt", expectedResult: "DNS resolution result returned", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document Layer 3 findings: gateway reachability, upstream connectivity, DNS resolution", tool: "Evidence panel", expectedResult: "Layer 3 check documented" },

      ],
    },
{
      id: "t4",
      title: "Layer 4-7 check",
      description: "Test specific services, check firewall/proxy.",
      order: 4,
      steps: [
        { instruction: "Run: netstat -an | findstr :443 to check if HTTPS connections are established", tool: "Command Prompt", expectedResult: "Active connections listed", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Try opening a website in Edge — does it load or give a specific error?", tool: "Microsoft Edge", expectedResult: "Error or loaded page" },

{ instruction: "Check Windows Firewall: Control Panel → Windows Defender Firewall → check if it is blocking outbound", tool: "Control Panel → Windows Defender Firewall", expectedResult: "Firewall status shown" },

{ instruction: "Check proxy settings: Internet Options → Connections → LAN Settings — is a proxy configured?", tool: "Internet Explorer / Edge → Internet Options", expectedResult: "Proxy settings shown" },

{ instruction: "If proxy is configured, test without proxy: Edge → Settings → Open with my default profile → try again", tool: "Microsoft Edge", expectedResult: "Browser loads or still fails" },

{ instruction: "Document Layer 4-7 findings: firewall state, proxy settings, service availability", tool: "Evidence panel", expectedResult: "Layer 4-7 check documented" },

      ],
    },
{
      id: "t5",
      title: "Diagnose planted fault",
      description: "User cannot reach specific application.",
      order: 5,
      steps: [
        { instruction: "The user says a specific internal app (app.warehouse.local) is unreachable", tool: "Browser on WS-01", expectedResult: "App fails to load" },

{ instruction: "Ping app.warehouse.local — does it resolve and respond?", tool: "Command Prompt", expectedResult: "Ping result shown", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: nslookup app.warehouse.local — does it return an IP?", tool: "Command Prompt", expectedResult: "DNS record returned", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Check the DNS record: nslookup shows two IPs: 10.0.0.100 (correct) and 10.0.0.5 (old/decommissioned server)", tool: "nslookup output", expectedResult: "Round-robin DNS returning wrong IP" },

{ instruction: "Ping 10.0.0.5 — it should fail (decommissioned server)", tool: "Command Prompt", expectedResult: "Request timed out", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document evidence: stale DNS A record for app.warehouse.local pointing to 10.0.0.5", tool: "Evidence panel", expectedResult: "Evidence: DNS stale record confirmed" },

{ instruction: "Submit diagnosis: round-robin DNS returning IP of decommissioned server — app unavailable to half the users", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc12",
    severity: "medium",
    symptoms: [
      "User reports 'the internet is down'",
      "Other users on the same VLAN are working",
    ],
    affectedAssets: ["WS-01", "Network"],
    initialState: {
      "PC": "Correct IP, gateway, DNS configured",
      "Issue": "Specific app unreachable",
    },
    hiddenRootCause:
      "Round-robin DNS returns the IP of a decommissioned server (10.0.0.5) for the internal app. Half the users get the correct IP, half get the wrong one.",
    allowedActions: [
      "ipconfig",
      "ping",
      "tracert",
      "nslookup",
      "netstat",
    ],
    forbiddenActions: ["flush DNS without reason", "disable firewall without justification"],
    evidenceRevealedOnAction: {
      "nslookup": [
        { id: "ev1", label: "DNS for app", value: "Returns 10.0.0.100 AND 10.0.0.5", collectedAt: "" },
      ],
      "ping 10.0.0.5": [
        { id: "ev2", label: "Old server", value: "Request timed out (decommissioned)", collectedAt: "" },
      ],
    },
    resolution:
      "Remove the stale A record for app.warehouse.local → 10.0.0.5 from DNS Manager.",
    businessImpact:
      "Half of users cannot access the internal application.",
  },
  hints: [
    { level: 1, text: "The user says 'internet is down' but others work. Is it the whole internet or a specific app?" },
    { level: 2, text: "Systematically check each OSI layer: L1 cable, L2 IP/subnet, L3 gateway, L4-7 DNS/firewall/proxy." },
    { level: 3, text: "Run 'nslookup app.warehouse.local' and 'ping 8.8.8.8' — what do they return?" },
    { level: 4, text: "If DNS returns multiple IPs, ping each one. The dead one is the stale record." },
    { level: 5, text: "Solution: delete the stale DNS A record. Use DNS Manager or Remove-DnsServerResourceRecord." },
  ],
  validation: [
    { id: "v1", description: "Layer-by-layer documented", command: "Evidence panel", expectedResult: "All 5 layers documented", points: 10 },
    { id: "v2", description: "Diagnosis correct", command: "nslookup output", expectedResult: "Stale record identified", points: 10 },
  ],
  rubric: [
    { criterion: "Systematic approach", description: "Followed OSI layer-by-layer methodology", maxPoints: 25 },
    { criterion: "Tool usage", description: "Used ping, tracert, nslookup, netstat correctly", maxPoints: 20 },
    { criterion: "Diagnosis", description: "Identified the DNS stale record", maxPoints: 25 },
    { criterion: "Documentation", description: "All findings documented per layer", maxPoints: 15 },
    { criterion: "Fix quality", description: "Removed correct record only", maxPoints: 15 },
  ],
  requiredEvidence: ["ipconfig /all output", "ping/tracert results", "nslookup output", "OSI layer table"],
  deliverables: ["OSI troubleshooting log", "DNS record audit", "Fix steps"],
  interviewQuestion:
    "A user calls and says 'I can't access the internal app.' Walk me through the exact commands you run and what you look for at each OSI layer.",
};
