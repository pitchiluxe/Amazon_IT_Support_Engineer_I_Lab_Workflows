"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/labs", label: "Labs", icon: "🧪" },
  { href: "/incidents", label: "Incidents", icon: "🚨" },
  { href: "/network", label: "Network", icon: "🌐" },
  { href: "/assets", label: "Assets", icon: "🖥️" },
  { href: "/sops", label: "SOPs", icon: "📚" },
  { href: "/projects", label: "Projects", icon: "📋" },
  { href: "/tutor", label: "AI Tutor", icon: "🤖" },
  { href: "/roadmap", label: "Roadmap", icon: "🗓️" },
  { href: "/skills", label: "Skills", icon: "🎯" },
  { href: "/portfolio", label: "Portfolio", icon: "🏆" },
  { href: "/interview", label: "Interview", icon: "💼" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-border-soft bg-bg-surface h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-4 border-b border-border-soft">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <div>
            <div className="font-semibold text-fg-primary text-sm leading-tight">
              IT Support Lab
            </div>
            <div className="text-xs text-fg-muted">Engineer I</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-5 py-2 text-sm transition-colors",
                active
                  ? "bg-accent-muted text-accent font-medium border-r-2 border-accent"
                  : "text-fg-secondary hover:bg-bg-muted hover:text-fg-primary"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-3 border-t border-border-soft text-xs text-fg-muted">
        <p>All labs run in a simulated environment.</p>
        <p className="mt-1 text-fg-muted/70">
          Never practice on production systems.
        </p>
      </div>
    </aside>
  );
}
