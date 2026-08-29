"""
Add nodeId and toolId to every step in every lab based on the tool field.

Maps common tool descriptions to environment node+tool IDs.
"""
import re
from pathlib import Path

LABS_DIR = Path("src/data/labs")

# Map tool descriptions -> (nodeId, toolId)
# Ordered from most specific to most general
TOOL_NAVIGATION_MAP = [
    # --- Cisco switch CLI ---
    (r"switch.*cli|switch#|switch\(config.*?\)#|cisco.*?ios|cisco cli|ios cli", "switch-01", "cisco-cli"),
    # --- Router ---
    (r"\brouter\b|router cli|router#", "router-01", "cisco-cli"),
    # --- DNS Manager (specific) ---
    (r"\bdns.*?console|dns.*?manager|dns.*?mgr|server manager.*?dns|tools.*?dns", "dc-01", "dns"),
    (r"\bdns\b(?!.*?console)", "dc-01", "dns"),
    # --- DHCP ---
    (r"\bdhcp\b|dhcp console|dhcp scope|server manager.*?dhcp|tools.*?dhcp", "dc-01", "dhcp"),
    # --- ADUC ---
    (r"\baduc\b|active directory.*?users|ad users|server manager.*?aduc|server manager.*?ad ds", "dc-01", "aduc"),
    (r"\bactive directory\b", "dc-01", "aduc"),
    # --- GPO ---
    (r"\bgpo\b|group policy|gpm\b", "dc-01", "gpo"),
    # --- Server Manager general ---
    (r"server manager(?!.*?(aduc|dns|dhcp|ad ds))", "dc-01", "server-manager"),
    # --- DFS ---
    (r"\bdfs\b|dfs management|dfs namespace", "fs-01", "dfs"),
    # --- Print Management ---
    (r"print.*?management|print.*?console|print.*?server|print server", "fs-01", "print"),
    (r"\bprinter\b|printing|print queue|print spooler", "fs-01", "print"),
    # --- File Explorer / Shares ---
    (r"\\\\(fs-01|dc-01)|\\\\fs-01|\\\\dc-01|\\\\warehouse", "fs-01", "file-explorer"),
    (r"file explorer|file share|file server|\\\\\\?\\?\\?C\$", "fs-01", "file-explorer"),
    # --- Workstation commands ---
    (r"command prompt.*?admin|admin command prompt|elevated command", "ws-01", "cmd"),
    (r"command prompt.*?w-04|w-04 command|w-04 prompt", "ws-01", "cmd"),
    (r"command prompt.*?ws-01|ws-01 command|ws-01 prompt", "ws-01", "cmd"),
    (r"command prompt.*?(on )?(the )?client", "ws-01", "cmd"),
    (r"\bcommand prompt\b(?!.*?admin)|\bcmd\b", "ws-01", "cmd"),
    # --- PowerShell ---
    (r"powershell(?!.*?exchange)|\bps\b", "ws-01", "powershell"),
    # --- ipconfig (must be on a client) ---
    (r"ipconfig|get-netip", "ws-01", "cmd"),
    # --- Workstation general ---
    (r"\bclient\b.*?workstation|workstation.*?client|\bworkstation\b", "ws-01", "powershell"),
    # --- VC codec ---
    (r"vc.*?codec|video.*?codec|conference.*?codec|video conference|vc room", "vc-codec", "settings"),
    # --- UPS / Printer web UI ---
    (r"ups|ups.*?web|ups.*?console", "ups-01", "settings"),
    (r"printer.*?web|printer.*?ui", "printer-01", "print"),
]


def get_navigation(tool_str: str) -> tuple[str | None, str | None]:
    """Map a tool description to (nodeId, toolId) or (None, None) for non-environment tools."""
    if not tool_str:
        return None, None
    t = tool_str.lower()
    for pattern, node_id, tool_id in TOOL_NAVIGATION_MAP:
        if re.search(pattern, t, re.IGNORECASE):
            return node_id, tool_id
    return None, None


def add_node_tool_to_steps(content: str) -> tuple[str, int]:
    """Add nodeId and toolId to every step that has a tool: field but lacks nodeId/toolId.

    Returns (new_content, num_changes).
    """
    # Match a step on a single line: { instruction: "X", tool: "Y", expectedResult: "Z" },
    # or with any order. We need to extract the tool and inject nodeId/toolId.
    # Pattern: opening brace, any fields with tool:, then closing brace.
    # We use a more flexible pattern that matches the whole step line.

    # First, find every line that looks like a step.
    # IMPORTANT: only match lines that START with `{ instruction:` (single-line step object)
    # This avoids matching tool object lines inside the `interactiveEnvironment` section
    # which look like `{ id: "X", name: "Y", ... type: "gui" }`.
    line_pattern = re.compile(r'^(\s*\{[^}]*instruction:[^}]*\})\s*,?\s*$', re.MULTILINE)

    changes = 0

    def replace_step(match):
        nonlocal changes
        step_line = match.group(1)

        # Skip if already has nodeId or toolId (prevents double-injection on re-runs)
        if "nodeId:" in step_line or "toolId:" in step_line:
            return step_line

        # Must have a tool: field
        tool_match = re.search(r'tool:\s*"([^"]+)"', step_line)
        if not tool_match:
            return step_line

        tool_str = tool_match.group(1)
        node_id, tool_id = get_navigation(tool_str)
        if not node_id:
            return step_line  # no environment mapping — skip

        changes += 1
        # Inject nodeId and toolId before the closing brace
        new_line = step_line.rstrip()
        if new_line.endswith("}"):
            new_line = new_line[:-1].rstrip()
        new_line += f', nodeId: "{node_id}", toolId: "{tool_id}" }}'
        return new_line

    new_content = line_pattern.sub(replace_step, content)
    return new_content, changes


def main():
    total_changes = 0
    for lab_file in sorted(LABS_DIR.glob("lab*.ts")):
        content = lab_file.read_text(encoding="utf-8")
        if "interactiveEnvironment" not in content:
            print(f"  --  {lab_file.name} (no env)")
            continue

        new_content, changes = add_node_tool_to_steps(content)
        if new_content != content:
            lab_file.write_text(new_content, encoding="utf-8")
            total_changes += changes
            print(f"  OK  {lab_file.name} — {changes} steps updated")
        else:
            print(f"  --  {lab_file.name} (no changes)")

    print(f"\nTotal: {total_changes} steps updated across all labs")


if __name__ == "__main__":
    main()
