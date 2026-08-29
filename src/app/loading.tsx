import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="text-center p-8">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-fg-muted text-sm">Loading...</p>
      </Card>
    </div>
  );
}
