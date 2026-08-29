"use client";
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { detectAIProvider, sendTutorMessage } from "@/lib/aiTutor";
import type { AIStatus, TutorMessage } from "@/types";
import { Send, Bot, User as UserIcon, AlertCircle } from "lucide-react";

interface TutorChatProps {
  labTitle?: string;
  scenario?: string;
}

const quickPrompts = [
  "What should I check next?",
  "Give me a hint",
  "Explain this concept",
  "Review my troubleshooting",
];

export function TutorChat({ labTitle, scenario }: TutorChatProps) {
  const [status, setStatus] = useState<AIStatus | null>(null);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await detectAIProvider();
      setStatus(s);
      setChecked(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Status check failed");
    } finally {
      setLoading(false);
    }
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: TutorMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const { content } = await sendTutorMessage(
        [...messages, userMsg],
        labTitle,
        scenario
      );
      const assistantMsg: TutorMessage = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-accent" />
          <CardTitle>AI Tutor</CardTitle>
        </div>
        {status && (
          <Badge variant={status.available ? "success" : "warning"}>
            {status.available ? status.provider : "Offline"}
          </Badge>
        )}
      </div>

      {!checked && !loading && (
        <div className="text-center py-4">
          <p className="text-sm text-fg-muted mb-3">
            Get Socratic guidance from the AI tutor. It will ask diagnostic questions, not give answers.
          </p>
          <Button size="sm" onClick={checkStatus}>
            Connect to Tutor
          </Button>
        </div>
      )}

      {loading && !checked && <LoadingState message="Checking AI providers..." />}

      {checked && status && !status.available && (
        <div className="p-3 rounded-lg bg-warning-muted border border-warning/30 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="font-semibold text-warning">Tutor unavailable</span>
          </div>
          <p className="text-fg-secondary text-xs">
            {status.error ?? "No AI provider configured. Install Ollama or set NEXT_PUBLIC_OPENROUTER_API_KEY."}
          </p>
          <p className="text-fg-muted text-xs mt-2">
            You can still use the built-in hint system on the lab page.
          </p>
          <Button size="sm" variant="ghost" onClick={checkStatus} className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {error && (
        <ErrorState message={error} onRetry={checkStatus} />
      )}

      {checked && status?.available && (
        <>
          <div className="space-y-2 max-h-96 overflow-y-auto mb-3">
            {messages.length === 0 && (
              <p className="text-xs text-fg-muted text-center py-4">
                Ask the tutor a question or use a quick prompt below.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded-lg text-sm flex gap-2 ${
                  m.role === "user"
                    ? "bg-accent-muted text-fg-primary ml-6"
                    : "bg-bg-muted text-fg-primary mr-6"
                }`}
              >
                {m.role === "assistant" ? (
                  <Bot className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                ) : (
                  <UserIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="p-2 rounded-lg bg-bg-muted text-sm text-fg-muted mr-6">
                <span className="animate-pulse-soft">Tutor is thinking...</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                disabled={loading}
                className="text-xs px-2 py-1 rounded-full bg-bg-muted text-fg-secondary hover:text-fg-primary disabled:opacity-50 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask the tutor..."
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary placeholder:text-fg-muted text-sm"
            />
            <Button
              size="sm"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
