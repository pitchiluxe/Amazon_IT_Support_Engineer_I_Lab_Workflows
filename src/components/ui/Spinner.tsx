"use client";
import { clsx } from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-3",
};

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <div
        className={clsx(
          "rounded-full border-border-soft border-t-accent animate-spin",
          sizes[size]
        )}
      />
      {label && <span className="text-sm text-fg-muted">{label}</span>}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Spinner size="lg" />
      <p className="text-fg-muted text-sm">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="text-danger text-3xl">⚠</div>
      <p className="text-fg-secondary">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-accent hover:underline text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon = "📋",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="font-semibold text-fg-primary">{title}</h3>
      {description && (
        <p className="text-fg-muted text-sm max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
