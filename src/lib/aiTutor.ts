// AI Tutor — Ollama local / OpenRouter fallback
"use client";

import type { AIProvider, AIStatus, TutorMessage } from "@/types";

const OLLAMA_BASE = "http://localhost:11434";

export async function checkOllamaStatus(): Promise<AIStatus> {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const model = data.models?.[0]?.name ?? "local model";
    return { provider: "ollama", model, available: true };
  } catch {
    return {
      provider: "unavailable",
      available: false,
      error: "Ollama not running. Install from ollama.com and run 'ollama serve'.",
    };
  }
}

export async function checkOpenRouterStatus(): Promise<AIStatus> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      provider: "unavailable",
      available: false,
      error: "OpenRouter not configured. Set NEXT_PUBLIC_OPENROUTER_API_KEY.",
    };
  }
  return { provider: "openrouter", model: "openrouter/free", available: true };
}

export async function detectAIProvider(): Promise<AIStatus> {
  const ollama = await checkOllamaStatus();
  if (ollama.available) return ollama;
  return checkOpenRouterStatus();
}

// Build Socratic system prompt
function buildSystemPrompt(labTitle?: string, scenario?: string): string {
  return `You are a Socratic IT instructor helping a learner through a hands-on lab simulation.

CRITICAL RULES:
- NEVER give the direct answer or reveal the hidden root cause.
- Ask diagnostic questions to guide the learner.
- Suggest what to check next, not what to fix.
- Explain concepts, not solutions.
- Use operational language: severity, production impact, escalation, rollback, validation.
- After the learner solves the incident, explain WHY the solution worked.
- Distinguish facts from assumptions.
- Encourage evidence-based troubleshooting.
- Never fabricate command output. If asked for output, describe what the command would show conceptually.

Current lab: ${labTitle ?? "General IT troubleshooting"}
Scenario: ${scenario ?? "IT operations support incident"}`;
}

export async function sendTutorMessage(
  messages: TutorMessage[],
  labTitle?: string,
  scenario?: string
): Promise<{ content: string; provider: AIProvider }> {
  const ollama = await checkOllamaStatus();

  if (ollama.available) {
    return sendOllamaMessage(messages, labTitle, scenario);
  }

  const openrouter = await checkOpenRouterStatus();
  if (openrouter.available) {
    return sendOpenRouterMessage(messages, labTitle, scenario);
  }

  throw new Error(
    "No AI provider available. Run Ollama (ollama.com) or configure NEXT_PUBLIC_OPENROUTER_API_KEY."
  );
}

async function sendOllamaMessage(
  messages: TutorMessage[],
  labTitle?: string,
  scenario?: string
): Promise<{ content: string; provider: AIProvider }> {
  const systemPrompt = buildSystemPrompt(labTitle, scenario);
  const payload = {
    model: "llama3.2", // Will be overridden by discovered model if available
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: false,
  };

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = await res.json();
  return { content: data.message?.content ?? "", provider: "ollama" };
}

async function sendOpenRouterMessage(
  messages: TutorMessage[],
  labTitle?: string,
  scenario?: string
): Promise<{ content: string; provider: AIProvider }> {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OpenRouter API key not set");

  const systemPrompt = buildSystemPrompt(labTitle, scenario);
  const payload = {
    model: "anthropic/claude-3.5-haiku",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  };

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? `OpenRouter error: ${res.status}`);
  }
  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    provider: "openrouter",
  };
}
