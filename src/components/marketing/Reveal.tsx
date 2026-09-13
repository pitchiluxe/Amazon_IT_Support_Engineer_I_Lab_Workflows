"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { clsx } from "clsx";

type Direction = "up" | "left" | "right" | "scale";

const directionClass: Record<Direction, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  /** Delay in ms before the reveal transition starts after entering viewport. */
  delay?: number;
  className?: string;
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion users: the CSS media query already forces opacity:1
    // and disables transitions, so we only need to flip the state when the
    // element enters the viewport (done in the async observer callback below).
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay) {
              window.setTimeout(() => setVisible(true), delay);
            } else {
              setVisible(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={clsx(directionClass[direction], visible && "is-visible", className)}
    >
      {children}
    </div>
  );
}
