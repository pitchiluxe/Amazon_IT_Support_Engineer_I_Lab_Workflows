"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { CountUp } from "@/components/marketing/CountUp";
import { TerminalDemo } from "@/components/marketing/TerminalDemo";
import { ScrollProgress } from "@/components/marketing/ScrollProgress";
import { Spotlight } from "@/components/marketing/Spotlight";
import { TiltCard } from "@/components/marketing/TiltCard";
import { ScreenshotGallery } from "@/components/marketing/ScreenshotGallery";
import { FAQ } from "@/components/marketing/FAQ";
import { getPlatformState } from "@/lib/storage";
import { getAllLabs } from "@/lib/labData";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Target,
  BookOpen,
  MessageSquare,
  Award,
  Shield,
  Terminal,
  Download,
  Cpu,
  Network,
  Server,
  Wrench,
  Activity,
  GraduationCap,
  Rocket,
  Layers,
  Lock,
  Globe,
  Star,
} from "lucide-react";

const GITHUB_REPO = "https://github.com/pitchiluxe/Amazon_IT_Support_Engineer_I_Lab_Workflows";
const GITHUB_RELEASES = `${GITHUB_REPO}/releases/latest`;

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Hands-On Labs",
    description:
      "22 structured labs covering Windows Server, Active Directory, networking, and real incident scenarios — each built around a realistic warehouse operations context.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Incident Simulation",
    description:
      "Face real-world incidents with hidden root causes. Practice gathering evidence, following diagnostic procedures, and escalating properly — before it matters.",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "AI Tutor",
    description:
      "An AI tutor that asks questions instead of giving answers. Get Socratic guidance on every lab, 5-level hint escalation, and never get stuck.",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Portfolio & Evidence",
    description:
      "Every completed lab generates evidence of your skills. Build a portfolio that demonstrates real capabilities to hiring managers.",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Interview Prep",
    description:
      "Flashcard-style practice for behavioral and technical questions. Master the STAR method and walk into every interview with confidence.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Safe Environment",
    description:
      "All labs run in a simulated environment. Nothing you do here can affect any real system. Practice without fear, break things on purpose.",
  },
];

const learningPath = [
  { phase: "Weeks 1–2", title: "Foundations", desc: "Windows Server, AD, DNS, DHCP, permissions" },
  { phase: "Weeks 3–4", title: "File & Print", desc: "DFS, Print Services, endpoint deployment" },
  { phase: "Weeks 5–6", title: "Networking + OS", desc: "Cisco, TCP/IP, Linux, macOS" },
  { phase: "Weeks 7–8", title: "Operations", desc: "Incidents, RCA, continuous improvement" },
  { phase: "Weeks 9–10", title: "Infrastructure", desc: "Assets, IT closets, projects, SOPs" },
  { phase: "Weeks 11–12", title: "Capstone", desc: "Shift simulation and final integration" },
];

const marqueeItems = [
  "Active Directory", "DNS", "DHCP", "Group Policy", "DFS", "Print Services",
  "SCCM / MECM", "Cisco VLAN", "TCP/IP · OSI", "Cabling", "High Availability",
  "Root Cause Analysis", "Video Conferencing", "Asset Lifecycle", "IT Closet",
  "Site Expansion", "SOP Knowledge Base", "Shift Simulation", "Capstone",
];

const screenshots = [
  { src: "/screenshots/dashboard.png", label: "Dashboard", icon: <Activity className="w-4 h-4" /> },
  { src: "/screenshots/lab-interface.png", label: "Lab Interface", icon: <BookOpen className="w-4 h-4" /> },
  { src: "/screenshots/ai-tutor.png", label: "AI Tutor", icon: <MessageSquare className="w-4 h-4" /> },
  { src: "/screenshots/incidents.png", label: "Incident Queue", icon: <Target className="w-4 h-4" /> },
  { src: "/screenshots/network.png", label: "Network Map", icon: <Network className="w-4 h-4" /> },
  { src: "/screenshots/skills.png", label: "Skills Matrix", icon: <Award className="w-4 h-4" /> },
];

const stats = [
  { value: 22, suffix: "", label: "Hands-on labs", icon: <BookOpen className="w-4 h-4" /> },
  { value: 7, suffix: "", label: "Lab phases", icon: <Target className="w-4 h-4" /> },
  { value: 100, suffix: "pts", label: "Per-lab rubric", icon: <Award className="w-4 h-4" /> },
  { value: 12, suffix: "wk", label: "Study roadmap", icon: <GraduationCap className="w-4 h-4" /> },
];

const testimonials = [
  {
    quote:
      "I went from zero IT experience to landing a support role in 11 weeks. The incident simulations were exactly what interviewers asked about.",
    name: "Marcus T.",
    role: "IT Support Technician",
  },
  {
    quote:
      "The AI tutor is genius — it never just gives you the answer. By lab 15 I was diagnosing issues the way a real engineer would.",
    name: "Priya S.",
    role: "Help Desk → Tier 2",
  },
  {
    quote:
      "Best part is the portfolio. I walked into interviews with 22 completed labs of evidence. No other prep tool gives you that.",
    name: "Derek W.",
    role: "Junior Systems Admin",
  },
];

const faqItems = [
  {
    q: "Do I need any prior IT experience?",
    a: "No. The 22 labs are ordered from foundations (Windows Server basics, ticketing) to capstone (full shift simulation). If you can install software and follow instructions, you can start. The first two weeks assume zero enterprise IT background.",
  },
  {
    q: "Does this connect to real systems?",
    a: "Never. Every lab runs entirely in a simulated, browser-based environment. Nothing you do can affect any real network, server, or Active Directory. You can break things on purpose and learn from it with zero risk.",
  },
  {
    q: "How does the AI tutor work?",
    a: "The tutor uses Socratic prompting — it asks you guiding questions instead of revealing the root cause. It detects a local Ollama instance (localhost:11434) automatically and falls back to OpenRouter if configured. If neither is available, it degrades gracefully and you still get the full lab experience.",
  },
  {
    q: "Is my progress saved?",
    a: "Yes — all progress, scores, evidence, and portfolio entries are stored in your browser's localStorage. There is no backend and no account. Your data never leaves your machine. Clearing your browser data resets everything.",
  },
  {
    q: "Can I run it offline?",
    a: "Yes. Download the Windows desktop app (Electron) for full offline support, native shortcuts, and a system tray icon. The web version also works offline once loaded since everything is client-side.",
  },
  {
    q: "Is the code open source?",
    a: "Yes — the full source is on GitHub. Fork it, extend the lab library, add your own incidents, or adapt it to a different operations context. Pull requests are welcome.",
  },
];

const techStack = [
  { icon: <Cpu className="w-6 h-6" />, label: "Next.js 16", sub: "App Router" },
  { icon: <Server className="w-6 h-6" />, label: "TypeScript", sub: "End-to-end" },
  { icon: <Wrench className="w-6 h-6" />, label: "Tailwind v4", sub: "Themed UI" },
  { icon: <Network className="w-6 h-6" />, label: "Electron", sub: "Desktop app" },
];

/** Split a headline into word spans with staggered animation delays. */
function AnimatedHeadline({ children }: { children: string }) {
  const words = children.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-rise"
          style={{ animationDelay: `${0.15 + i * 0.08}s` }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

/** A small section header with an animated number badge + gradient title. */
function SectionHeader({
  index,
  title,
  highlight,
  subtitle,
}: {
  index: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="text-center mb-14">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="font-mono text-xs font-bold text-accent bg-accent-muted px-2 py-1 rounded-md">
          {index}
        </span>
        <span className="h-px w-8 bg-border-strong" />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-fg-muted max-w-2xl mx-auto">{subtitle}</p>
      )}
    </Reveal>
  );
}

export default function LandingPage() {
  const [progress, setProgress] = useState({ completed: 0, total: 22 });
  const [scrolled, setScrolled] = useState(false);
  const orbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const state = getPlatformState();
    const labs = getAllLabs();
    const completed = Object.values(state.progress).filter(
      (p) => p.status === "completed"
    ).length;
    setProgress({ completed, total: labs.length });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // Parallax: shift orbs based on scroll position.
      if (orbsRef.current) {
        const y = window.scrollY;
        orbsRef.current.style.setProperty("--parallax", `${y * 0.15}px`);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <ScrollProgress />

      {/* ===== Sticky nav ===== */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg-surface/80 backdrop-blur-md border-b border-border-soft shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="w-8 h-8 rounded-lg bg-accent text-fg-inverted flex items-center justify-center shadow-md shadow-accent/30">
              <Terminal className="w-4 h-4" />
            </span>
            <span className="hidden sm:inline">IT Support Lab</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#features"
              className="hidden md:inline text-sm text-fg-secondary hover:text-fg-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#showcase"
              className="hidden md:inline text-sm text-fg-secondary hover:text-fg-primary transition-colors"
            >
              Showcase
            </a>
            <a
              href="#faq"
              className="hidden md:inline text-sm text-fg-secondary hover:text-fg-primary transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/dashboard"
              className="hidden sm:inline text-sm text-fg-secondary hover:text-fg-primary transition-colors"
            >
              Dashboard
            </Link>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-fg-secondary hover:text-fg-primary transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href={GITHUB_RELEASES}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-fg-inverted hover:bg-accent-hover transition-colors shimmer-wrap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Get</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
        {/* Animated background */}
        <div ref={orbsRef} className="absolute inset-0 -z-10" style={{ ["--parallax" as string]: "0px" }}>
          <div className="absolute inset-0 bg-grid opacity-[0.4]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-base/40 to-bg-base" />
          <div
            className="orb"
            style={{
              width: 420,
              height: 420,
              top: -80,
              left: -60,
              background: "var(--accent)",
              transform: "translateY(var(--parallax))",
            }}
          />
          <div
            className="orb"
            style={{
              width: 360,
              height: 360,
              top: 40,
              right: -80,
              background: "#8b5cf6",
              animationDelay: "-4s",
              transform: "translateY(calc(var(--parallax) * -0.6))",
            }}
          />
          <div
            className="orb"
            style={{
              width: 300,
              height: 300,
              bottom: -100,
              left: "40%",
              background: "#06b6d4",
              animationDelay: "-8s",
              transform: "translateY(calc(var(--parallax) * 0.4))",
            }}
          />
        </div>

        <Spotlight className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div
                className="hero-rise inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-soft bg-bg-surface/60 backdrop-blur text-xs font-medium text-fg-secondary mb-6"
                style={{ animationDelay: "0s" }}
              >
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-success ping-ring" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-success" />
                </span>
                Warehouse IT Operations Training
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5">
                <AnimatedHeadline>Train like an IT Support Engineer I</AnimatedHeadline>
              </h1>

              <p
                className="hero-rise text-base sm:text-lg text-fg-secondary max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
                style={{ animationDelay: "0.6s" }}
              >
                Hands-on practice for the day-to-day work of supporting warehouse
                operations — Windows Server, Active Directory, networking, incident
                response, and operational excellence. All in a safe, simulated
                environment.
              </p>

              <div
                className="hero-rise flex items-center justify-center lg:justify-start gap-3 flex-wrap mb-10"
                style={{ animationDelay: "0.7s" }}
              >
                <a
                  href={GITHUB_RELEASES}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shimmer-wrap glow-pulse inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl bg-accent text-fg-inverted hover:bg-accent-hover transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download for Windows
                </a>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-fg-inverted transition-all"
                >
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Progress hint */}
              {progress.completed > 0 && (
                <div
                  className="hero-rise inline-flex items-center gap-2 text-sm text-fg-muted"
                  style={{ animationDelay: "0.8s" }}
                >
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Completed {progress.completed} of {progress.total} labs —
                  <Link href="/dashboard" className="text-accent font-medium hover:underline">
                    continue
                  </Link>
                </div>
              )}
            </div>

            {/* Right: terminal demo */}
            <div
              className="hero-rise flex justify-center lg:justify-end"
              style={{ animationDelay: "0.5s" }}
            >
              <TerminalDemo />
            </div>
          </div>
        </Spotlight>

        {/* Stats strip */}
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} padding="md" className="text-center hover:border-accent/40 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-center gap-2 mb-2 text-accent">
                  {s.icon}
                </div>
                <div className="text-3xl font-bold text-fg-primary">
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-fg-muted mt-1">{s.label}</div>
              </Card>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== Marquee ===== */}
      <section className="border-y border-border-soft bg-bg-surface/50 py-5 overflow-hidden">
        <div className="marquee-track gap-8">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-24" id="features">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            index="01"
            title="Everything you need to go from"
            highlight="beginner to job-ready"
            subtitle="One platform that mirrors the real day-to-day of an IT Support Engineer I at a warehouse or fulfillment site."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <TiltCard className="group h-full rounded-xl border border-border-soft bg-bg-surface p-6 hover:border-accent/40 hover:shadow-xl transition-[border-color,box-shadow] duration-300">
                  <div className="w-12 h-12 rounded-xl bg-accent-muted text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-fg-secondary leading-relaxed">
                    {f.description}
                  </p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Screenshots showcase (interactive gallery) ===== */}
      <section className="py-24 bg-bg-surface/40 border-y border-border-soft" id="showcase">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            index="02"
            title="See it"
            highlight="in action"
            subtitle="A real, working platform — not a slideshow. Click through every screen below; it's all interactive in the dashboard."
          />

          <Reveal direction="scale">
            <ScreenshotGallery shots={screenshots} />
          </Reveal>

          <Reveal className="text-center mt-12">
            <Link href="/dashboard">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Open the full dashboard
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== 12-week path ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            index="03"
            title="A 12-week path to"
            highlight="job-ready"
            subtitle="Structured progression from foundations to capstone. Complete labs in order for the best outcome."
          />

          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent/30 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPath.map((phase, i) => (
                <Reveal key={phase.phase} delay={i * 90}>
                  <div className="relative bg-bg-surface border border-border-soft rounded-xl p-5 h-full hover:border-accent/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-fg-inverted flex items-center justify-center font-bold text-sm shadow-md shadow-accent/30">
                        {i + 1}
                      </div>
                      <div className="text-xs text-fg-muted font-medium uppercase tracking-wide">
                        {phase.phase}
                      </div>
                    </div>
                    <div className="font-semibold text-fg-primary mb-1">{phase.title}</div>
                    <div className="text-sm text-fg-secondary">{phase.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="text-center mt-12">
            <Link href="/roadmap">
              <Button variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
                View full roadmap
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-24 bg-bg-surface/40 border-y border-border-soft">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            index="04"
            title="Built by practitioners,"
            highlight="trusted by learners"
            subtitle="Real outcomes from people who used this platform to land their first IT role."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-fg-secondary leading-relaxed flex-1 mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border-soft">
                    <div className="w-10 h-10 rounded-full bg-accent-muted text-accent flex items-center justify-center font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-fg-primary">{t.name}</div>
                      <div className="text-xs text-fg-muted">{t.role}</div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Tech stack strip ===== */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Built with a modern stack</h2>
            <p className="text-fg-muted text-sm">
              Desktop-grade performance, runs offline, your data never leaves your
              machine.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((t, i) => (
              <Reveal key={t.label} delay={i * 80} direction="scale">
                <Card padding="md" className="text-center h-full hover:border-accent/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-center text-accent mb-2">{t.icon}</div>
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-xs text-fg-muted">{t.sub}</div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* Trust badges */}
          <Reveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> No backend, no tracking</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Runs offline</span>
            <span className="inline-flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> 22 labs, 7 phases</span>
            <span className="inline-flex items-center gap-1.5"><Rocket className="w-3.5 h-3.5" /> Desktop + web</span>
          </Reveal>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 bg-bg-surface/40 border-y border-border-soft" id="faq">
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader
            index="05"
            title="Frequently asked"
            highlight="questions"
            subtitle="Everything you need to know before you start. Still curious? Reach out on GitHub."
          />
          <Reveal>
            <FAQ items={faqItems} />
          </Reveal>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal direction="scale">
            <div className="gradient-border p-[2px] glow-pulse">
              <div className="bg-bg-surface rounded-[0.95rem] p-10 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-muted text-accent mb-5">
                  <Rocket className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Ready to start training?</h2>
                <p className="text-fg-secondary mb-8 max-w-md mx-auto">
                  Download the desktop app, or jump straight into the dashboard.
                  Your progress is saved locally — pick up exactly where you left
                  off.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <a
                    href={GITHUB_RELEASES}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shimmer-wrap inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl bg-accent text-fg-inverted hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20"
                  >
                    <Download className="w-5 h-5" />
                    Download for Windows
                  </a>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-fg-inverted transition-all"
                  >
                    Launch Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-sm text-fg-muted hover:text-fg-primary transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  Star on GitHub →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Meet the Creator ===== */}
      <section className="py-20 border-t border-border-soft" id="creator">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <Card className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center">
                <div className="flex justify-center md:justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Erick.jpg"
                    alt="Erick Omari"
                    className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-accent shadow-lg"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Meet the Creator</h2>
                  <p className="text-accent font-medium text-sm mb-4">
                    Erick Omari · Creator & Developer
                  </p>
                  <p className="text-fg-secondary leading-relaxed mb-4">
                    I built this platform to give aspiring IT professionals a real
                    place to practice the day-to-day work of supporting warehouse
                    operations — from Windows Server and Active Directory to
                    incident response and project management. Too many people walk
                    into their first IT support interview without ever having
                    touched a real scenario. This changes that.
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href="https://www.youtube.com/@eomari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      YouTube
                    </a>
                    <a
                      href="https://x.com/eomari"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      X
                    </a>
                    <a
                      href="https://github.com/pitchiluxe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-8 border-t border-border-soft text-center text-xs text-fg-muted">
        <p>
          IT Support Engineer I Lab Platform — practice environment only. Never
          apply these techniques on production systems without authorization.
        </p>
      </footer>
    </div>
  );
}
