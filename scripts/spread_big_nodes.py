"""Spread nodes further apart to accommodate larger node boxes."""
import re
from pathlib import Path

LABS_DIR = Path("src/data/labs")

ENV_LAYOUTS = {
    "foundations": {
        "dc-01":      {"x": 18, "y": 38},
        "fs-01":      {"x": 50, "y": 38},
        "switch-01":  {"x": 82, "y": 38},
        "ws-01":      {"x": 18, "y": 72},
        "ws-02":      {"x": 50, "y": 72},
    },
    "windows": {
        "dc-01":      {"x": 20, "y": 40},
        "fs-01":      {"x": 50, "y": 40},
        "ws-01":      {"x": 80, "y": 40},
    },
    "networking": {
        "router-01":     {"x": 12, "y": 35},
        "firewall-01":   {"x": 38, "y": 35},
        "switch-01":     {"x": 64, "y": 35},
        "switch-02":     {"x": 88, "y": 35},
        "wallplate-01":  {"x": 25, "y": 68},
        "ws-01":         {"x": 58, "y": 68},
    },
    "operations": {
        "dc-01":      {"x": 18, "y": 35},
        "fs-01":      {"x": 48, "y": 35},
        "printer-01": {"x": 78, "y": 35},
        "ws-01":      {"x": 33, "y": 72},
        "ws-02":      {"x": 63, "y": 72},
    },
    "infrastructure": {
        "dc-01":     {"x": 15, "y": 38},
        "fs-01":     {"x": 40, "y": 38},
        "fs-02":     {"x": 65, "y": 38},
        "switch-01": {"x": 88, "y": 38},
        "ups-01":    {"x": 28, "y": 72},
    },
    "project": {
        "dc-01":     {"x": 18, "y": 35},
        "fs-01":     {"x": 48, "y": 35},
        "switch-01": {"x": 78, "y": 35},
        "ws-01":     {"x": 33, "y": 72},
        "ws-02":     {"x": 63, "y": 72},
    },
    "capstone": {
        "dc-01":      {"x": 12, "y": 32},
        "fs-01":      {"x": 38, "y": 32},
        "fs-02":      {"x": 64, "y": 32},
        "switch-01":  {"x": 88, "y": 32},
        "router-01":  {"x":  6, "y": 60},
        "vc-codec":   {"x": 88, "y": 60},
        "ws-01":      {"x": 20, "y": 78},
        "ws-02":      {"x": 48, "y": 78},
        "printer-01": {"x": 76, "y": 78},
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
    for node_id, pos in layout.items():
        node_pattern = re.compile(
            r'(id:\s*"' + re.escape(node_id) + r'",\s*name:\s*"[^"]+",\s*type:\s*"[^"]+",\s*'
            r'position:\s*\{\s*x:\s*)\d+(\s*,\s*y:\s*)\d+(\s*\})',
            re.DOTALL,
        )
        content = node_pattern.sub(
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
            continue

        new_content = update_node_positions(content, layout)
        if new_content != content:
            lab_file.write_text(new_content, encoding="utf-8")
            print(f"  OK   {lab_file.name}")


if __name__ == "__main__":
    main()
