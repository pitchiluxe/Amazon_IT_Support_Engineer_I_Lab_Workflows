"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface FAQItem {
  q: string;
  a: string;
}

/** An accessible accordion. Only one item open at a time; clicking an open
 *  item closes it. Animates height via CSS grid-rows trick (no JS height
 *  measurement). */
export function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-border-soft border border-border-soft rounded-2xl overflow-hidden bg-bg-surface">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-bg-muted/50 transition-colors"
            >
              <span className="font-semibold text-fg-primary">{item.q}</span>
              <ChevronDown
                className={clsx(
                  "flex-shrink-0 w-5 h-5 text-fg-muted transition-transform duration-300",
                  isOpen && "rotate-180 text-accent"
                )}
              />
            </button>
            <div
              className={clsx(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm text-fg-secondary leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
