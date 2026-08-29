"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center p-8">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-fg-primary mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-fg-muted mb-6">
          An unexpected error occurred. Your progress is safe — it&apos;s stored in your browser.
        </p>
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mb-6 p-3 rounded-lg bg-danger-muted text-sm text-left font-mono text-danger break-all">
            {error.message}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = "/")}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
