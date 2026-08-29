"use client";
import { clsx } from "clsx";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-muted text-fg-secondary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
  info: "bg-info-muted text-info",
  accent: "bg-accent-muted text-accent",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
}) {
  const configs: Record<
    typeof difficulty,
    { label: string; variant: BadgeVariant }
  > = {
    beginner: { label: "Beginner", variant: "success" },
    intermediate: { label: "Intermediate", variant: "info" },
    advanced: { label: "Advanced", variant: "warning" },
    expert: { label: "Expert", variant: "danger" },
  };
  const { label, variant } = configs[difficulty];
  return <Badge variant={variant}>{label}</Badge>;
}

export function StatusBadge({
  status,
}: {
  status: "not_started" | "in_progress" | "completed";
}) {
  const configs: Record<typeof status, { label: string; variant: BadgeVariant }> = {
    not_started: { label: "Not Started", variant: "default" },
    in_progress: { label: "In Progress", variant: "info" },
    completed: { label: "Completed", variant: "success" },
  };
  const { label, variant } = configs[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function SeverityBadge({
  severity,
}: {
  severity: "low" | "medium" | "high" | "critical";
}) {
  const configs: Record<typeof severity, { label: string; variant: BadgeVariant }> = {
    low: { label: "Low", variant: "default" },
    medium: { label: "Medium", variant: "info" },
    high: { label: "High", variant: "warning" },
    critical: { label: "Critical", variant: "danger" },
  };
  const { label, variant } = configs[severity];
  return <Badge variant={variant}>{label}</Badge>;
}
