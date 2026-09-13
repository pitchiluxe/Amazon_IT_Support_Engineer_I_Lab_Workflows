"use client";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

interface Shot {
  src: string;
  label: string;
  icon: React.ReactNode;
}

/** An interactive screenshot gallery with a tab rail and a large preview that
 *  cross-fades and slides when the active tab changes. Auto-advances every
 *  5s until the user interacts. */
export function ScreenshotGallery({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((a) => (a + 1) % shots.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, shots.length]);

  return (
    <div
      className="grid lg:grid-cols-[260px_1fr] gap-6 items-start"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tab rail */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {shots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => setActive(i)}
            className={clsx(
              "group flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 whitespace-nowrap lg:whitespace-normal",
              active === i
                ? "border-accent bg-accent-muted text-accent shadow-sm"
                : "border-border-soft bg-bg-surface text-fg-secondary hover:border-accent/40 hover:text-fg-primary"
            )}
          >
            <span
              className={clsx(
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                active === i
                  ? "bg-accent text-fg-inverted"
                  : "bg-bg-muted text-fg-muted group-hover:text-accent"
              )}
            >
              {shot.icon}
            </span>
            <span className="text-sm font-medium">{shot.label}</span>
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="relative rounded-2xl overflow-hidden border border-border-soft bg-bg-muted shadow-xl">
        <div className="aspect-[16/10] relative">
          {shots.map((shot, i) => (
            <div
              key={shot.src}
              className={clsx(
                "absolute inset-0 transition-all duration-700 ease-out",
                active === i
                  ? "opacity-100 scale-100 translate-x-0"
                  : active > i
                  ? "opacity-0 scale-95 -translate-x-8 pointer-events-none"
                  : "opacity-0 scale-95 translate-x-8 pointer-events-none"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={shot.label}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}
        </div>

        {/* Label badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-base/80 backdrop-blur text-sm font-medium text-fg-primary border border-border-soft">
          <span className="text-accent">{shots[active].icon}</span>
          {shots[active].label}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
          {shots.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${shots[i].label}`}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-300",
                active === i ? "w-6 bg-accent" : "w-1.5 bg-fg-muted/40 hover:bg-fg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
