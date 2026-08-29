"use client";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-fg-inverted hover:bg-accent-hover disabled:bg-accent/50",
  secondary:
    "bg-bg-surface text-fg-primary border border-border-soft hover:bg-bg-muted disabled:opacity-50",
  ghost:
    "bg-transparent text-fg-secondary hover:bg-bg-muted hover:text-fg-primary disabled:opacity-50",
  danger:
    "bg-danger text-white hover:bg-danger/90 disabled:opacity-50",
  success:
    "bg-success text-white hover:bg-success/90 disabled:opacity-50",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        loading && "opacity-70 cursor-wait",
        className
      )}
    >
      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
