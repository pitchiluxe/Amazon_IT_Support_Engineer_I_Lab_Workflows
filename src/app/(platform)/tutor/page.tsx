"use client";
import { TutorChat } from "@/components/tutor/TutorChat";
import { PageHeader } from "@/components/layout/PageHeader";

export default function TutorPage() {
  return (
    <>
      <PageHeader
        title="AI Tutor"
        description="Get Socratic guidance from the AI tutor. Ask questions about concepts, labs, incidents, or request a hint."
      />
      <div className="max-w-2xl">
        <TutorChat />
        <div className="mt-4 p-4 rounded-lg border border-border-soft text-sm text-fg-muted">
          <strong className="text-fg-primary">How to use the tutor:</strong>
          <ul className="mt-2 space-y-1 list-disc pl-5">
            <li>Start a conversation — the tutor knows about this platform</li>
            <li>Ask diagnostic questions like &ldquo;What should I check next?&rdquo;</li>
            <li>Use &ldquo;Give me a hint&rdquo; for a structured hint</li>
            <li>Use &ldquo;Explain this concept&rdquo; for a definition</li>
            <li>The tutor will not give you the answer — it will guide you to find it</li>
          </ul>
        </div>
      </div>
    </>
  );
}
