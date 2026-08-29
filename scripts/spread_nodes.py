"""
Spread out the interactiveEnvironment node positions to prevent overlap.

Each lab's nodes are repositioned to give them more breathing room.
"""
import re
from pathlib import Path

LABS_DIR = Path("src/data/labs")

# New, well-spaced position maps per category.
# X is horizontal position (0-100), Y is vertical (0-100).
# Nodes placed with at least 12% horizontal and 15% vertical separation.

ENV_LAYOUTS = {
    "foundations": {
        # 4 nodes: 2 servers, 1 workstation, 1 switch
        "dc-01":      {"x": 22, "y": 28, "layer": 2},
        "fs-01":      {"x": 48, "y": 28, "layer": 2},
        "switch-01":  {"x": 75, "y": 28, "layer": 3},
        "ws-01":      {"x": 22, "y": 62, "layer": 1},
        "ws-02":      {"x": 48, "y": 62, "layer": 1},
    },
    "windows": {
        # 3 nodes: DC, FS, WS
        "dc-01":      {"x": 25, "y": 30, "layer": 2},
        "fs-01":      {"x": 50, "y": 30, "layer": 2},
        "ws-01":      {"x": 75, "y": 30, "layer": 1},
    },
    "networking": {
        # 6 nodes: router, firewall, 2 switches, wallplate, ws
        "router-01":      {"x": 13, "y": 25, "layer": 3},
        "firewall-01":    {"x": 38, "y": 25, "layer": 3},
        "switch-01":      {"x": 63, "y": 25, "layer": 3},
        "switch-02":      {"x": 87, "y": 25, "layer": 2},
        "wallplate-01":   {"x": 25, "y": 58, "layer": 1},
        "ws-01":          {"x": 55, "y": 58, "layer": 1},
    },
    "operations": {
        # 5 nodes: DC, FS, printer, 2 workstations
        "dc-01":      {"x": 20, "y": 25, "layer": 2},
        "fs-01":      {"x": 45, "y": 25, "layer": 2},
        "printer-01": {"x": 70, "y": 25, "layer": 1},
        "ws-01":      {"x": 32, "y": 65, "layer": 1},
        "ws-02":      {"x": 58, "y": 65, "layer": 1},
    },
    "infrastructure": {
        # 5 nodes: DC, FS-01, FS-02, switch, UPS
        "dc-01":      {"x": 18, "y": 28, "layer": 2},
        "fs-01":      {"x": 42, "y": 28, "layer": 2},
        "fs-02":      {"x": 66, "y": 28, "layer": 2},
        "switch-01":  {"x": 88, "y": 28, "layer": 3},
        "ups-01":     {"x": 30, "y": 65, "layer": 1},
    },
    "project": {
        # 5 nodes: DC, FS, switch, 2 workstations
        "dc-01":      {"x": 20, "y": 25, "layer": 2},
        "fs-01":      {"x": 45, "y": 25, "layer": 2},
        "switch-01":  {"x": 70, "y": 25, "layer": 3},
        "ws-01":      {"x": 32, "y": 65, "layer": 1},
        "ws-02":      {"x": 58, "y": 65, "layer": 1},
    },
    "capstone": {
        # 9 nodes
        "dc-01":      {"x": 15, "y": 22, "layer": 2},
        "fs-01":      {"x": 38, "y": 22, "layer": 2},
        "fs-02":      {"x": 61, "y": 22, "layer": 2},
        "switch-01":  {"x": 84, "y": 22, "layer": 3},
        "router-01":  {"x":  8, "y": 50, "layer": 3},
        "vc-codec":   {"x": 84, "y": 50, "layer": 2},
        "ws-01":      {"x": 24, "y": 70, "layer": 1},
        "ws-02":      {"x": 48, "y": 70, "layer": 1},
        "printer-01": {"x": 72, "y": 70, "layer": 1},
    },
}

LAB_CATEGORIES = {
    1: "foundations", 2: "foundations", 3: "foundations",
    4: "windows", 5: "windows", 6: "windows", 7: "windows",
    8: "networking", 9: "networking", 10: "networking", 11: "networking", 12: "networking",
    13: "operations", 14: "operations", 15: "operations", 16: "operations", 17: "operations",
    18: "infrastructure", 19: "infrastructure", 20: "operations", 21: "operations",
    22: "capstone",
}


def update_node_positions(content, layout):
    """Find each node and update its position + layer."""
    for node_id, pos in layout.items():
        # Match the node block and replace position + layer
        # Pattern: find the id, then look for position line
        node_pattern = re.compile(
            r'(id:\s*"' + re.escape(node_id) + r'",\s*name:\s*"[^"]+",\s*type:\s*"[^"]+",\s*'
            r'position:\s*\{\s*x:\s*)\d+(\s*,\s*y:\s*)\d+(\s*\},\s*'
            r'layer:\s*)\d+',
            re.DOTALL,
        )
        new = node_pattern.sub(
            lambda m: f"{m.group(1)}{pos['x']}{m.group(2)}{pos['y']}{m.group(3)}{pos['layer']}",
            content,
        )
        if new != content:
            content = new
        else:
            # Try without explicit layer (in case it's missing)
            node_pattern2 = re.compile(
                r'(id:\s*"' + re.escape(node_id) + r'",\s*name:\s*"[^"]+",\s*type:\s*"[^"]+",\s*'
                r'position:\s*\{\s*x:\s*)\d+(\s*,\s*y:\s*)\d+(\s*\},)',
                re.DOTALL,
            )
            content = node_pattern2.sub(
                lambda m: f"{m.group(1)}{pos['x']}{m.group(2)}{pos['y']}{m.group(3)}",
                content,
            )
    return content


def main():
    for lab_file in sorted(LABS_DIR.glob("lab*.ts")):
        lab_num = int(lab_file.stem[3:])
        category = LAB_CATEGORIES.get(lab_num, "foundations")
        layout = ENV_LAYOUTS[category]

        content = lab_file.read_text(encoding="utf-8")
        if "interactiveEnvironment" not in content:
            print(f"  SKIP {lab_file.name} (no env)")
            continue

        new_content = update_node_positions(content, layout)
        if new_content != content:
            lab_file.write_text(new_content, encoding="utf-8")
            print(f"  OK   {lab_file.name} — spread {category} nodes")
        else:
            print(f"  --   {lab_file.name} — no changes")


if __name__ == "__main__":
    main()
