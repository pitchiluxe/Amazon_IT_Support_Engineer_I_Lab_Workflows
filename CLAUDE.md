# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Repository State (after initial build)

A working Next.js 16 platform that simulates the Amazon IT Support Engineer I role across 22 hands-on labs. All pages render (`/`, `/labs`, `/labs/[id]` × 22, `/incidents`, `/network`, `/assets`, `/sops`, `/projects`, `/tutor`, `/roadmap`, `/skills`, `/portfolio`, `/interview`).

## Quick Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (verifies types + static pages)
npm run start    # Run production build
npm run lint     # ESLint
```

## Architecture

**Stack:** Next.js 16.3.3 (App Router) · TypeScript · Tailwind CSS v4 (CSS variable theme) · localStorage for persistence · no database · no auth.

**Source layout:**
```
src/
├── app/                        # App Router pages
│   ├── error.tsx              # Global error boundary
│   ├── not-found.tsx          # 404 page
│   ├── loading.tsx            # Root loading skeleton
│   ├── layout.tsx             # Sidebar + TopBar + <main>
│   ├── page.tsx               # Dashboard
│   ├── labs/[id]/page.tsx     # Static-generated lab detail
│   └── ... (11 other pages)
├── components/
│   ├── ui/                    # Button, Card, Badge, Modal, Spinner, ProgressBar
│   ├── layout/                # Sidebar, TopBar, PageHeader
│   ├── dashboard/             # DashboardClient
│   ├── labs/                  # LabClient (7-phase engine)
│   ├── incidents/             # IncidentPanel
│   └── tutor/                 # TutorChat
├── lib/
│   ├── storage.ts             # localStorage CRUD (state, assets, SOPs, projects, incidents, theme)
│   ├── labEngine.ts           # Lab state machine
│   ├── incidentEngine.ts      # Incident resolution logic
│   ├── scoring.ts             # Rubric-based scoring
│   ├── aiTutor.ts             # Ollama (port 11434) + OpenRouter fallback
│   └── labData.ts             # Lab registry (getAllLabs, getLabById, getLabsByCategory)
├── data/labs/                 # 22 lab JSON files (lab01.ts – lab22.ts)
└── types/index.ts             # All TypeScript interfaces
```

## Key Design Decisions

- **No backend**: localStorage is the sole persistence layer. All state lives in the browser.
- **Static-first**: `generateStaticParams` pre-renders all 22 lab pages.
- **AI tutor**: Detects Ollama at `localhost:11434`, falls back to OpenRouter. Uses Socratic prompting — never reveals root cause. Graceful degradation if neither available.
- **Theme system**: `data-theme` attribute on `<html>`, with inline script in layout to set it before React mounts (FOUC-free). Three modes: light/dark/system.
- **Lab flow**: intro → tasks → incident → evidence → hints → scoring → review. Root cause is hidden until final review.
- **Hint escalation**: 5 levels per lab (clarify → subsystem → tool → mechanism → solution).

## Content Structure (per lab)

Each `src/data/labs/labNN.ts` file exports a `Lab` object with:
- `tasks[]`: step-by-step checklist
- `incident`: hidden root cause, symptoms, allowed/forbidden actions, evidence triggers
- `hints[]`: 5 levels
- `validation[]`: 3-5 tests with expected results
- `rubric[]`: weighted scoring (8 categories, 100pts total)
- `interviewQuestion`: STAR-style behavioral question

## Conventions

- **Naming**: `LabPhase` (union), `LearnerProgress`, `OperationalIncident` — see `src/types/index.ts` for full list.
- **State management**: React `useState` + `useEffect` for client-side data. No Redux/Zustand.
- **Theme tokens**: `bg-base`, `bg-surface`, `bg-elevated`, `fg-primary`, `accent`, `success`, `warning`, `danger`, `info`. Use Tailwind utility classes mapped via `@theme inline`.
- **Date handling**: ISO strings in storage, formatted at display time.

## Common Development Tasks

**Add a new lab:**
1. Create `src/data/labs/labNN.ts` exporting a `Lab` object
2. Import and register it in `src/lib/labData.ts`

**Add a new page:**
1. Create `src/app/<route>/page.tsx` with `"use client"`
2. Use `PageHeader` for the title
3. Add a `navItem` to `src/components/layout/Sidebar.tsx`

**Modify theme:**
- Light defaults: `src/app/globals.css` (`:root`)
- Dark overrides: `src/app/globals.css` (`[data-theme="dark"]`)

**Connect a new LLM provider:**
- Edit `src/lib/aiTutor.ts` and add a new branch after Ollama detection.
