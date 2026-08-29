"""
Script to add `interactiveEnvironment` data to all 22 lab files.

Inserts the environment after the `environment: [...]` array and before `tasks: [`.
Each lab gets a custom-themed environment based on its category and difficulty.
"""
import re
import os
from pathlib import Path

LABS_DIR = Path("src/data/labs")

# Environment templates per category
ENVIRONMENTS = {
    "foundations": {
        "theme": "mixed",
        "title": "Warehouse Site IT Environment",
        "nodes": [
            {"id": "dc-01", "name": "DC-01", "type": "server", "position": {"x": 30, "y": 35}, "layer": 2, "status": "online", "ip": "10.0.0.10", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "aduc", "name": "Active Directory Users and Computers", "label": "ADUC", "path": "Server Manager → Tools → ADUC", "type": "gui"},
                {"id": "dns", "name": "DNS Manager", "label": "DNS", "path": "Server Manager → Tools → DNS", "type": "gui"},
                {"id": "dhcp", "name": "DHCP", "label": "DHCP", "path": "Server Manager → Tools → DHCP", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → Windows PowerShell", "type": "cli"},
            ]},
            {"id": "fs-01", "name": "FS-01", "type": "server", "position": {"x": 50, "y": 35}, "layer": 2, "status": "online", "ip": "10.0.0.11", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "\\\\fs-01\\C$", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → Windows PowerShell", "type": "cli"},
            ]},
            {"id": "ws-01", "name": "WS-01", "type": "workstation", "position": {"x": 20, "y": 60}, "layer": 1, "status": "online", "ip": "10.0.0.100", "room": "Operations Bay 1",
             "tools": [
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → Windows PowerShell", "type": "cli"},
                {"id": "cmd", "name": "Command Prompt", "label": "CMD", "path": "Start → cmd", "type": "cli"},
            ]},
            {"id": "switch-01", "name": "Core-SW-01", "type": "switch", "position": {"x": 70, "y": 30}, "layer": 3, "status": "online", "ip": "10.0.0.2", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS CLI", "label": "IOS CLI", "path": "Console Cable → PuTTY", "type": "cli"},
            ]},
        ],
    },
    "windows": {
        "theme": "server_room",
        "title": "Windows Server Environment",
        "nodes": [
            {"id": "dc-01", "name": "DC-01", "type": "server", "position": {"x": 30, "y": 30}, "layer": 2, "status": "online", "ip": "10.0.0.10", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "aduc", "name": "ADUC", "label": "ADUC", "path": "Server Manager → Tools → ADUC", "type": "gui"},
                {"id": "dns", "name": "DNS", "label": "DNS", "path": "Server Manager → Tools → DNS", "type": "gui"},
                {"id": "dhcp", "name": "DHCP", "label": "DHCP", "path": "Server Manager → Tools → DHCP", "type": "gui"},
                {"id": "gpo", "name": "Group Policy Mgmt", "label": "GPO", "path": "Server Manager → Tools → Group Policy", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "fs-01", "name": "FS-01", "type": "server", "position": {"x": 55, "y": 30}, "layer": 2, "status": "online", "ip": "10.0.0.11", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "dfs", "name": "DFS Management", "label": "DFS", "path": "Server Manager → Tools → DFS", "type": "gui"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "\\\\fs-01\\Shares", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "ws-01", "name": "WS-01", "type": "workstation", "position": {"x": 25, "y": 65}, "layer": 1, "status": "online", "ip": "10.0.0.100", "room": "Bay 1",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "cmd", "name": "CMD", "label": "CMD", "path": "Start → cmd", "type": "cli"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
            ]},
        ],
    },
    "networking": {
        "theme": "it_closet",
        "title": "Network Infrastructure",
        "nodes": [
            {"id": "router-01", "name": "WAN-Router", "type": "router", "position": {"x": 15, "y": 30}, "layer": 3, "status": "online", "ip": "10.0.0.1", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS", "label": "IOS CLI", "path": "Console → PuTTY", "type": "cli"},
            ]},
            {"id": "firewall-01", "name": "FW-01", "type": "firewall", "position": {"x": 35, "y": 30}, "layer": 3, "status": "online", "ip": "10.0.0.1", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Firewall Mgmt", "label": "Firewall", "path": "Web → https://10.0.0.1", "type": "web"},
            ]},
            {"id": "switch-01", "name": "Core-SW-01", "type": "switch", "position": {"x": 55, "y": 30}, "layer": 3, "status": "online", "ip": "10.0.0.2", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS", "label": "IOS CLI", "path": "Console → PuTTY", "type": "cli"},
            ]},
            {"id": "switch-02", "name": "Access-SW-01", "type": "switch", "position": {"x": 75, "y": 50}, "layer": 2, "status": "online", "ip": "10.0.0.3", "room": "Office",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS", "label": "IOS CLI", "path": "Telnet → 10.0.0.3", "type": "cli"},
            ]},
            {"id": "wallplate-01", "name": "Bay1-Wallplate", "type": "wallplate", "position": {"x": 25, "y": 70}, "layer": 1, "status": "online", "room": "Bay 1",
             "tools": [
                {"id": "settings", "name": "Patch Panel Log", "label": "Patch", "path": "Cabling Diagram", "type": "settings"},
            ]},
            {"id": "ws-01", "name": "WS-01", "type": "workstation", "position": {"x": 30, "y": 80}, "layer": 1, "status": "online", "ip": "10.0.0.100", "room": "Bay 1",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "cmd", "name": "CMD", "label": "CMD", "path": "Start → cmd", "type": "cli"},
            ]},
        ],
    },
    "operations": {
        "theme": "mixed",
        "title": "Operations Floor",
        "nodes": [
            {"id": "dc-01", "name": "DC-01", "type": "server", "position": {"x": 30, "y": 25}, "layer": 2, "status": "online", "ip": "10.0.0.10", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "aduc", "name": "ADUC", "label": "ADUC", "path": "Server Manager → Tools → ADUC", "type": "gui"},
                {"id": "dns", "name": "DNS", "label": "DNS", "path": "Server Manager → Tools → DNS", "type": "gui"},
                {"id": "dhcp", "name": "DHCP", "label": "DHCP", "path": "Server Manager → Tools → DHCP", "type": "gui"},
                {"id": "gpo", "name": "GPO", "label": "GPO", "path": "Server Manager → Tools → GPM", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "fs-01", "name": "FS-01", "type": "server", "position": {"x": 55, "y": 25}, "layer": 2, "status": "online", "ip": "10.0.0.11", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "dfs", "name": "DFS", "label": "DFS", "path": "Server Manager → Tools → DFS", "type": "gui"},
                {"id": "print", "name": "Print Mgmt", "label": "Print", "path": "Server Manager → Tools → Print", "type": "gui"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "\\\\fs-01\\C$", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "printer-01", "name": "Bay-Printer-01", "type": "printer", "position": {"x": 15, "y": 60}, "layer": 1, "status": "online", "ip": "10.0.0.50", "room": "Bay 1",
             "tools": [
                {"id": "print", "name": "Printer Web UI", "label": "Web UI", "path": "https://10.0.0.50", "type": "web"},
            ]},
            {"id": "ws-01", "name": "WS-01", "type": "workstation", "position": {"x": 30, "y": 60}, "layer": 1, "status": "online", "ip": "10.0.0.100", "room": "Bay 1",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "cmd", "name": "CMD", "label": "CMD", "path": "Start → cmd", "type": "cli"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
            ]},
            {"id": "ws-02", "name": "WS-02", "type": "workstation", "position": {"x": 45, "y": 60}, "layer": 1, "status": "warning", "ip": "10.0.0.101", "room": "Bay 2",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
            ]},
        ],
    },
    "infrastructure": {
        "theme": "server_room",
        "title": "Infrastructure Environment",
        "nodes": [
            {"id": "dc-01", "name": "DC-01", "type": "server", "position": {"x": 25, "y": 30}, "layer": 2, "status": "online", "ip": "10.0.0.10", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "aduc", "name": "ADUC", "label": "ADUC", "path": "Server Manager → Tools → ADUC", "type": "gui"},
                {"id": "dns", "name": "DNS", "label": "DNS", "path": "Server Manager → Tools → DNS", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "fs-01", "name": "FS-01", "type": "server", "position": {"x": 50, "y": 30}, "layer": 2, "status": "online", "ip": "10.0.0.11", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "dfs", "name": "DFS", "label": "DFS", "path": "Server Manager → Tools → DFS", "type": "gui"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "\\\\fs-01\\C$", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "fs-02", "name": "FS-02", "type": "server", "position": {"x": 70, "y": 30}, "layer": 2, "status": "warning", "ip": "10.0.0.12", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "\\\\fs-02\\C$", "type": "gui"},
            ]},
            {"id": "switch-01", "name": "Core-SW-01", "type": "switch", "position": {"x": 40, "y": 65}, "layer": 3, "status": "online", "ip": "10.0.0.2", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS", "label": "IOS CLI", "path": "Console → PuTTY", "type": "cli"},
            ]},
            {"id": "ups-01", "name": "UPS-01", "type": "ups", "position": {"x": 80, "y": 60}, "layer": 1, "status": "online", "room": "Server Room",
             "tools": [
                {"id": "settings", "name": "UPS Web UI", "label": "Web UI", "path": "https://10.0.0.20", "type": "web"},
            ]},
        ],
    },
    "project": {
        "theme": "mixed",
        "title": "Project Environment",
        "nodes": [
            {"id": "dc-01", "name": "DC-01", "type": "server", "position": {"x": 30, "y": 30}, "layer": 2, "status": "online", "ip": "10.0.0.10", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "aduc", "name": "ADUC", "label": "ADUC", "path": "Server Manager → Tools → ADUC", "type": "gui"},
                {"id": "dns", "name": "DNS", "label": "DNS", "path": "Server Manager → Tools → DNS", "type": "gui"},
                {"id": "dhcp", "name": "DHCP", "label": "DHCP", "path": "Server Manager → Tools → DHCP", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "fs-01", "name": "FS-01", "type": "server", "position": {"x": 50, "y": 30}, "layer": 2, "status": "online", "ip": "10.0.0.11", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "dfs", "name": "DFS", "label": "DFS", "path": "Server Manager → Tools → DFS", "type": "gui"},
                {"id": "print", "name": "Print", "label": "Print", "path": "Server Manager → Tools → Print", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "switch-01", "name": "Core-SW-01", "type": "switch", "position": {"x": 70, "y": 30}, "layer": 3, "status": "online", "ip": "10.0.0.2", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS", "label": "IOS CLI", "path": "Console → PuTTY", "type": "cli"},
            ]},
            {"id": "ws-01", "name": "WS-01", "type": "workstation", "position": {"x": 25, "y": 60}, "layer": 1, "status": "online", "ip": "10.0.0.100", "room": "Bay 1",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "cmd", "name": "CMD", "label": "CMD", "path": "Start → cmd", "type": "cli"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
            ]},
            {"id": "ws-02", "name": "WS-02", "type": "workstation", "position": {"x": 45, "y": 60}, "layer": 1, "status": "online", "ip": "10.0.0.101", "room": "Bay 2",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
            ]},
        ],
    },
    "capstone": {
        "theme": "mixed",
        "title": "Full Warehouse IT Environment",
        "nodes": [
            {"id": "dc-01", "name": "DC-01", "type": "server", "position": {"x": 25, "y": 25}, "layer": 2, "status": "online", "ip": "10.0.0.10", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "aduc", "name": "ADUC", "label": "ADUC", "path": "Server Manager → Tools → ADUC", "type": "gui"},
                {"id": "dns", "name": "DNS", "label": "DNS", "path": "Server Manager → Tools → DNS", "type": "gui"},
                {"id": "dhcp", "name": "DHCP", "label": "DHCP", "path": "Server Manager → Tools → DHCP", "type": "gui"},
                {"id": "gpo", "name": "GPO", "label": "GPO", "path": "Server Manager → Tools → GPM", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "fs-01", "name": "FS-01", "type": "server", "position": {"x": 45, "y": 25}, "layer": 2, "status": "online", "ip": "10.0.0.11", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "dfs", "name": "DFS", "label": "DFS", "path": "Server Manager → Tools → DFS", "type": "gui"},
                {"id": "print", "name": "Print", "label": "Print", "path": "Server Manager → Tools → Print", "type": "gui"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "\\\\fs-01\\C$", "type": "gui"},
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
            ]},
            {"id": "fs-02", "name": "FS-02", "type": "server", "position": {"x": 65, "y": 25}, "layer": 2, "status": "warning", "ip": "10.0.0.12", "room": "Server Room",
             "tools": [
                {"id": "server-manager", "name": "Server Manager", "label": "Server Manager", "path": "Server Manager → Dashboard", "type": "gui"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "\\\\fs-02\\C$", "type": "gui"},
            ]},
            {"id": "switch-01", "name": "Core-SW-01", "type": "switch", "position": {"x": 15, "y": 55}, "layer": 3, "status": "online", "ip": "10.0.0.2", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS", "label": "IOS CLI", "path": "Console → PuTTY", "type": "cli"},
            ]},
            {"id": "router-01", "name": "WAN-Router", "type": "router", "position": {"x": 5, "y": 35}, "layer": 3, "status": "online", "ip": "10.0.0.1", "room": "IT Closet",
             "tools": [
                {"id": "cisco-cli", "name": "Cisco IOS", "label": "IOS CLI", "path": "Console → PuTTY", "type": "cli"},
            ]},
            {"id": "vc-codec", "name": "VC-Codec", "type": "conference", "position": {"x": 80, "y": 55}, "layer": 2, "status": "online", "ip": "10.0.0.30", "room": "Conf Room",
             "tools": [
                {"id": "settings", "name": "Codec Web UI", "label": "Codec UI", "path": "https://10.0.0.30", "type": "web"},
            ]},
            {"id": "ws-01", "name": "WS-01", "type": "workstation", "position": {"x": 25, "y": 70}, "layer": 1, "status": "online", "ip": "10.0.0.100", "room": "Bay 1",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "cmd", "name": "CMD", "label": "CMD", "path": "Start → cmd", "type": "cli"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
            ]},
            {"id": "ws-02", "name": "WS-02", "type": "workstation", "position": {"x": 40, "y": 70}, "layer": 1, "status": "online", "ip": "10.0.0.101", "room": "Bay 2",
             "tools": [
                {"id": "powershell", "name": "PowerShell", "label": "PowerShell", "path": "Start → PowerShell", "type": "cli"},
                {"id": "file-explorer", "name": "File Explorer", "label": "Explorer", "path": "Taskbar → File Explorer", "type": "gui"},
            ]},
            {"id": "printer-01", "name": "Bay-Printer-01", "type": "printer", "position": {"x": 55, "y": 70}, "layer": 1, "status": "online", "ip": "10.0.0.50", "room": "Bay 1",
             "tools": [
                {"id": "print", "name": "Printer Web UI", "label": "Web UI", "path": "https://10.0.0.50", "type": "web"},
            ]},
        ],
    },
}

# Map of lab number -> category
LAB_CATEGORIES = {
    1: "foundations", 2: "foundations", 3: "foundations",
    4: "windows", 5: "windows", 6: "windows", 7: "windows",
    8: "networking", 9: "networking", 10: "networking", 11: "networking", 12: "networking",
    13: "operations", 14: "operations", 15: "operations", 16: "operations", 17: "operations",
    18: "infrastructure", 19: "infrastructure", 20: "operations", 21: "operations",
    22: "capstone",
}


def format_env_block(env_data):
    """Format the environment as a TypeScript code block."""
    lines = ["  interactiveEnvironment: {"]
    lines.append(f'    theme: "{env_data["theme"]}",')
    if "title" in env_data:
        lines.append(f'    title: "{env_data["title"]}",')
    lines.append("    nodes: [")
    for i, node in enumerate(env_data["nodes"]):
        comma = "," if i < len(env_data["nodes"]) - 1 else ""
        lines.append("      {")
        lines.append(f'        id: "{node["id"]}",')
        lines.append(f'        name: "{node["name"]}",')
        lines.append(f'        type: "{node["type"]}",')
        lines.append(f'        position: {{ x: {node["position"]["x"]}, y: {node["position"]["y"]} }},')
        if "layer" in node:
            lines.append(f'        layer: {node["layer"]},')
        if "status" in node:
            lines.append(f'        status: "{node["status"]}",')
        if "ip" in node:
            lines.append(f'        ip: "{node["ip"]}",')
        if "room" in node:
            lines.append(f'        room: "{node["room"]}",')
        lines.append("        tools: [")
        for j, tool in enumerate(node["tools"]):
            tcomma = "," if j < len(node["tools"]) - 1 else ""
            lines.append("          {")
            lines.append(f'            id: "{tool["id"]}",')
            lines.append(f'            name: "{tool["name"]}",')
            lines.append(f'            label: "{tool["label"]}",')
            lines.append(f'            path: "{tool["path"]}",')
            lines.append(f'            type: "{tool["type"]}"')
            lines.append(f'          }}{tcomma}')
        lines.append("        ],")
        lines.append(f"      }}{comma}")
    lines.append("    ],")
    lines.append("  },")
    return "\n".join(lines)


def main():
    for lab_file in sorted(LABS_DIR.glob("lab*.ts")):
        lab_num = int(lab_file.stem[3:])
        category = LAB_CATEGORIES.get(lab_num, "foundations")
        env_data = ENVIRONMENTS[category]

        content = lab_file.read_text(encoding="utf-8")

        # Check if interactiveEnvironment already exists
        if "interactiveEnvironment" in content:
            print(f"  SKIP {lab_file.name} (already has environment)")
            continue

        # Find the line "  tasks: [" — insert before it
        # The pattern: a line with "  tasks: [" starting at column 0 (after indentation)
        match = re.search(r"^  tasks: \[", content, re.MULTILINE)
        if not match:
            print(f"  WARN {lab_file.name} — no tasks: [ found")
            continue

        env_block = format_env_block(env_data)
        new_content = content[:match.start()] + env_block + "\n" + content[match.start():]

        lab_file.write_text(new_content, encoding="utf-8")
        print(f"  OK   {lab_file.name} — added {category} environment ({len(env_data['nodes'])} nodes)")


if __name__ == "__main__":
    main()
