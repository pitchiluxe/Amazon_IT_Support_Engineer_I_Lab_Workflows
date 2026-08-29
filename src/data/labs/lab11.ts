import type { Lab } from "@/types";

export const lab11: Lab = {
  id: "lab11",
  number: 11,
  title: "Cisco Switching & VLAN Troubleshooting",
  category: "networking",
  difficulty: "intermediate",
  estimatedMinutes: 90,
  objectives: [
    "Configure VLANs and trunk ports on a Cisco switch",
    "Use show commands to verify configuration",
    "Diagnose VLAN mismatch and trunk failure",
    "Document a VLAN and trunk design",
  ],
  prerequisites: [],
  scenario:
    "A new warehouse area was added. PCs in that area cannot reach the server VLAN. You need to verify the switch configuration and find the cause.",
  environment: [
    "Cisco switch (or Packet Tracer)",
    "PCs in different VLANs",
    "Console cable or remote access",
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
      title: "Configure VLANs",
      description: "Create VLAN 10 (Operations) and VLAN 20 (IT) on the switch.",
      order: 1,
      steps: [
        { instruction: "Connect to the Cisco switch via console cable (or SSH if configured)", tool: "PuTTY or serial console", expectedResult: "Switch CLI prompt: Switch>" },

{ instruction: "Enter privileged exec mode: type enable, enter the enable password", tool: "Switch CLI", expectedResult: "Prompt changes to Switch#", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Enter global configuration mode: configure terminal", tool: "Switch CLI", expectedResult: "Prompt changes to Switch(config)#", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Create VLAN 10: vlan 10 → name Operations", tool: "Switch(config)# CLI", expectedResult: "VLAN 10 created", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Create VLAN 20: vlan 20 → name IT", tool: "Switch(config)# CLI", expectedResult: "VLAN 20 created", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Exit config mode: exit (twice) → verify with show vlan brief", tool: "Switch# CLI", expectedResult: "Both VLANs appear in the table", nodeId: "switch-01", toolId: "cisco-cli" },

      ],
    },
{
      id: "t2",
      title: "Configure trunk",
      description: "Set the uplink port as a trunk with proper encapsulation.",
      order: 2,
      steps: [
        { instruction: "Enter global config: configure terminal", tool: "Switch# CLI", expectedResult: "Switch(config)# prompt", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Select the uplink port, e.g., interface GigabitEthernet0/1", tool: "Switch(config)# CLI", expectedResult: "Switch(config-if)#", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Set the port as trunk: switchport mode trunk", tool: "Switch(config-if)# CLI", expectedResult: "Port mode set to trunk", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Set encapsulation to dot1q: switchport trunk encapsulation dot1q (if required by switch model)", tool: "Switch(config-if)# CLI", expectedResult: "Encapsulation set", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Allow both VLANs on the trunk: switchport trunk allowed vlan 10,20", tool: "Switch(config-if)# CLI", expectedResult: "VLANs allowed on trunk", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Exit and save: exit → exit → copy run start", tool: "Switch# CLI", expectedResult: "Configuration saved", nodeId: "switch-01", toolId: "cisco-cli" },

      ],
    },
{
      id: "t3",
      title: "Assign access ports",
      description: "Assign access ports to the correct VLANs.",
      order: 3,
      steps: [
        { instruction: "Enter config for port range for Operations (e.g., ports 2-5): interface range GigabitEthernet0/2 - 5", tool: "Switch(config)# CLI", expectedResult: "Switch(config-if-range)#", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Set mode to access: switchport mode access", tool: "Switch(config-if-range)# CLI", expectedResult: "Ports set to access mode", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Assign to VLAN 10: switchport access vlan 10", tool: "Switch(config-if-range)# CLI", expectedResult: "Ports assigned to VLAN 10", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Repeat for IT ports: interface range GigabitEthernet0/6 - 10 → switchport mode access → switchport access vlan 20", tool: "Switch(config)# CLI", expectedResult: "IT ports assigned to VLAN 20", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Save: copy run start", tool: "Switch# CLI", expectedResult: "Configuration saved", nodeId: "switch-01", toolId: "cisco-cli" },

      ],
    },
{
      id: "t4",
      title: "Verify with show",
      description: "Use show vlan, show interfaces trunk, show running-config.",
      order: 4,
      steps: [
        { instruction: "Run: show vlan brief — verify both VLANs are listed with names and port assignments", tool: "Switch# CLI", expectedResult: "VLAN 10 and 20 visible with correct ports", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Run: show interfaces trunk — verify the uplink port shows as trunk with correct VLANs allowed", tool: "Switch# CLI", expectedResult: "Gi0/1 shows trunk, VLANs 10,20 allowed", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Run: show interfaces GigabitEthernet0/1 switchport — verify trunk mode and encapsulation", tool: "Switch# CLI", expectedResult: "Mode: Trunk, Encapsulation: 802.1Q", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Ping test: from a PC in VLAN 10, ping the VLAN 10 interface IP of the switch", tool: "PC Command Prompt", expectedResult: "Ping successful", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Ping test: from a PC in VLAN 10, ping a server in VLAN 20 — should fail without routing", tool: "PC Command Prompt", expectedResult: "Ping fails — inter-VLAN routing not configured", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Document VLAN assignments and trunk config in the evidence panel", tool: "Evidence panel", expectedResult: "VLAN design documented" },

      ],
    },
{
      id: "t5",
      title: "Diagnose planted fault",
      description: "End-to-end connectivity fails. Find why.",
      order: 5,
      steps: [
        { instruction: "From a PC in VLAN 10, ping the default gateway — it fails", tool: "PC Command Prompt", expectedResult: "Request timed out", nodeId: "ws-01", toolId: "cmd" },

{ instruction: "Run: show interfaces GigabitEthernet0/2 switchport on the access port the PC is connected to", tool: "Switch# CLI", expectedResult: "Shows VLAN 1 instead of VLAN 10 — port not assigned", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Run: show vlan brief — check the port's VLAN membership", tool: "Switch# CLI", expectedResult: "Port Gi0/2 shows VLAN 1 (default)", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Compare with the running config: show running-config interface GigabitEthernet0/2", tool: "Switch# CLI", expectedResult: "No switchport access vlan 10 command present", nodeId: "switch-01", toolId: "cisco-cli" },

{ instruction: "Document evidence: port Gi0/2 is missing switchport access vlan 10 command", tool: "Evidence panel", expectedResult: "Evidence: VLAN assignment missing" },

{ instruction: "Submit diagnosis: access port not assigned to VLAN 10 — PC in wrong VLAN", tool: "Diagnosis input", expectedResult: "Diagnosis accepted" },

      ],
    },
  ],
  incident: {
    id: "inc11",
    severity: "medium",
    symptoms: [
      "New warehouse PCs cannot reach the server VLAN",
      "Same switch ports worked before",
    ],
    affectedAssets: ["Cisco-SW-01", "New warehouse PCs"],
    initialState: {
      "VLAN 10": "Operations (correct)",
      "New ports": "Not assigned to VLAN 10",
    },
    hiddenRootCause:
      "The new access ports were not assigned to VLAN 10. The ports remain in the default VLAN 1. The fix is to assign the ports to the correct VLAN.",
    allowedActions: [
      "show vlan brief",
      "show interfaces switchport",
      "show running-config interface",
      "ping",
    ],
    forbiddenActions: ["reboot switch without notice", "delete VLANs"],
    evidenceRevealedOnAction: {
      "show vlan brief": [
        { id: "ev1", label: "VLAN table", value: "New ports not listed under VLAN 10", collectedAt: "" },
      ],
    },
    resolution:
      "Assign the new ports to VLAN 10 using: switchport access vlan 10 under each port interface.",
    businessImpact:
      "New warehouse area has no network connectivity — operations cannot start.",
  },
  hints: [
    { level: 1, text: "The new PCs can't reach servers. Are they even on the right VLAN?" },
    { level: 2, text: "Check the port's VLAN membership — show vlan brief." },
    { level: 3, text: "Look at the running-config for the specific port — is there a 'switchport access vlan' command?" },
    { level: 4, text: "If the port is in VLAN 1 (default) and should be in VLAN 10, it's a missing command." },
    { level: 5, text: "Solution: configure interface range for the new ports with 'switchport mode access' and 'switchport access vlan 10'." },
  ],
  validation: [
    { id: "v1", description: "VLANs created", command: "show vlan brief", expectedResult: "VLAN 10 and 20 listed", points: 10 },
    { id: "v2", description: "Trunk configured", command: "show interfaces trunk", expectedResult: "Uplink shows trunk", points: 10 },
    { id: "v3", description: "Access ports assigned", command: "show running-config interface", expectedResult: "Ports assigned to correct VLAN", points: 10 },
  ],
  rubric: [
    { criterion: "VLAN design", description: "VLANs correctly named and numbered", maxPoints: 20 },
    { criterion: "Trunk config", description: "Trunk configured with correct encapsulation and allowed VLANs", maxPoints: 20 },
    { criterion: "Access ports", description: "Ports assigned to correct VLANs", maxPoints: 20 },
    { criterion: "Diagnosis", description: "Found missing VLAN assignment", maxPoints: 20 },
    { criterion: "Documentation", description: "VLAN design documented", maxPoints: 20 },
  ],
  requiredEvidence: ["show vlan brief", "show interfaces trunk", "show running-config"],
  deliverables: ["VLAN design document", "Port assignment table", "Trunk configuration"],
  interviewQuestion:
    "A new user plugs in their PC and can't reach any servers. Walk me through how you troubleshoot this from the wall jack to the switch port.",
};
