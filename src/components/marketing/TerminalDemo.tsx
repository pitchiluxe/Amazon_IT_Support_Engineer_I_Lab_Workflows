"use client";
import { useEffect, useRef, useState } from "react";

interface Line {
  type: "input" | "output" | "info" | "success";
  text: string;
}

const SCRIPT: Line[] = [
  { type: "input", text: "lab start 02 --domain" },
  { type: "info", text: "→ Promoting server to Domain Controller..." },
  { type: "success", text: "✓ AD DS role installed" },
  { type: "success", text: "✓ OU structure created" },
  { type: "success", text: "✓ GPO linked to Warehouse OU" },
  { type: "input", text: "diagnose --incident INC-0007" },
  { type: "info", text: "→ Gathering evidence..." },
  { type: "output", text: "symptom: users cannot authenticate" },
  { type: "output", text: "root cause: hidden — investigate" },
  { type: "input", text: "tutor ask \"where should I look first?\"" },
  { type: "success", text: "✓ lab scored: 94/100" },
];

export function TerminalDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typed, setTyped] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  // Typing animation — defined before the effect that uses it so there is no
  // forward-reference at runtime or for the linter.
  const runScript = () => {
    let lineIndex = 0;
    let charIndex = 0;

    const tick = () => {
      if (lineIndex >= SCRIPT.length) return;
      const current = SCRIPT[lineIndex];

      if (charIndex <= current.text.length) {
        setTyped(current.text.slice(0, charIndex));
        charIndex++;
        const speed = current.type === "input" ? 45 : 12;
        window.setTimeout(tick, speed);
      } else {
        setVisibleCount((c) => c + 1);
        setTyped("");
        lineIndex++;
        charIndex = 0;
        window.setTimeout(tick, current.type === "input" ? 220 : 140);
      }
    };
    tick();
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            // Reduced-motion users see the finished terminal immediately.
            if (
              typeof window !== "undefined" &&
              window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
            ) {
              setVisibleCount(SCRIPT.length);
              setTyped("");
              return;
            }
            runScript();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const colorFor = (type: Line["type"]) =>
    type === "input"
      ? "text-sky-300"
      : type === "success"
      ? "text-emerald-300"
      : type === "info"
      ? "text-violet-300"
      : "text-slate-300";

  return (
    <div
      ref={containerRef}
      className="terminal float-y w-full max-w-md text-left shadow-2xl"
      style={{ borderColor: "rgba(148,163,184,0.15)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-red-400/80" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-xs text-slate-400 font-mono">
          it-support-lab — zsh
        </span>
      </div>

      <div className="space-y-1.5 min-h-[260px]">
        {SCRIPT.slice(0, visibleCount).map((line, i) => (
          <div key={i} className={`font-mono text-xs leading-relaxed ${colorFor(line.type)}`}>
            {line.type === "input" ? (
              <>
                <span className="text-emerald-400">$ </span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}

        {/* Currently typing line */}
        {visibleCount < SCRIPT.length && (
          <div className={`font-mono text-xs leading-relaxed ${colorFor(SCRIPT[visibleCount].type)}`}>
            {SCRIPT[visibleCount].type === "input" && (
              <span className="text-emerald-400">$ </span>
            )}
            {typed}
            <span className="terminal-cursor text-slate-200">▋</span>
          </div>
        )}
      </div>
    </div>
  );
}
