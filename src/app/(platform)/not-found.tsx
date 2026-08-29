import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-fg-primary mb-2">
          Page not found
        </h1>
        <p className="text-sm text-fg-muted mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try the dashboard or labs listing.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/labs">
            <Button variant="secondary">Browse Labs</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
