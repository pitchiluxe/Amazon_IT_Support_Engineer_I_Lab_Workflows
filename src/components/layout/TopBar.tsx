"use client";
import { useEffect, useState } from "react";
import { getTheme, setTheme } from "@/lib/storage";
import { Button } from "@/components/ui/Button";

export function TopBar() {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const cycleTheme = () => {
    const order: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setThemeState(next);
    setTheme(next);
  };

  const themeIcon = theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️";

  return (
    <header className="h-12 border-b border-border-soft bg-bg-surface flex items-center justify-end px-6 gap-3">
      <span className="text-xs text-fg-muted">
        Practice environment · No production impact
      </span>
      <Button variant="ghost" size="sm" onClick={cycleTheme} title={`Theme: ${theme}`}>
        {themeIcon}
      </Button>
    </header>
  );
}
