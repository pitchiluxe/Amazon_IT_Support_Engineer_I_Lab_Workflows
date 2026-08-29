"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
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
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  Star,
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Hands-On Labs",
    description:
      "22 structured labs covering Windows Server, Active Directory, networking, and real incident scenarios. Every lab is built around a realistic warehouse operations context.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Incident Simulation",
    description:
      "Face real-world incidents with hidden root causes. Practice gathering evidence, following diagnostic procedures, and escalating properly — before it matters.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "AI Tutor",
    description:
      "An AI tutor that asks you questions instead of giving answers. Get Socratic guidance on every lab, hint at 5 escalation levels, and never get stuck.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Portfolio & Evidence",
    description:
      "Every completed lab generates evidence of your skills. Build a portfolio that demonstrates your capabilities to hiring managers.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Interview Prep",
    description:
      "Flashcard-style practice for behavioral and technical questions. Master the STAR method and walk into every interview with confidence.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Safe Environment",
    description:
      "All labs run in a simulated environment. Nothing you do here can affect any real system. Practice without fear.",
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

export default function LandingPage() {
  const [progress, setProgress] = useState({
    completed: 0,
    inProgress: 0,
    total: 22,
    avgScore: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const state = getPlatformState();
    const labs = getAllLabs();
    const completed = Object.values(state.progress).filter(
      (p) => p.status === "completed"
    ).length;
    const inProgress = Object.values(state.progress).filter(
      (p) => p.status === "in_progress"
    ).length;
    const scores = Object.values(state.progress)
      .map((p) => p.score)
      .filter((s): s is number => s !== undefined);
    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    setProgress({ completed, inProgress, total: labs.length, avgScore: avg });
  }, []);

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bg-surface to-bg-base">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #2563eb 0%, transparent 50%), radial-gradient(circle at 80% 50%, #7c3aed 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <Badge variant="info" className="mb-6 text-sm px-4 py-1">
            🏭 Warehouse IT Operations Training
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-fg-primary mb-4 leading-tight">
            Train like an{" "}
            <span className="text-accent">IT Support Engineer I</span>
          </h1>
          <p className="text-lg text-fg-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            Hands-on practice for the day-to-day work of supporting warehouse operations:
            Windows Server, Active Directory, networking, incident response, and
            operational excellence — all in a safe, simulated environment.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/labs">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Start Learning
              </Button>
            </Link>
            <a
              href="https://github.com/pitchiluxe/Amazon_IT_Support_Engineer_I_Lab_Workflows/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold rounded-xl transition-all duration-200 border-2 border-accent text-accent hover:bg-accent hover:text-fg-inverted"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 6v12.5c0 .5-.5 1-1 1s-1-.5-1-1V6.5C5 6.2 5.2 6 5.5 6h13c.3 0 .5.2.5.5v12.5c0 .5-.5 1-1 1s-1-.5-1-1V9.5c0-.3-.2-.5-.5-.5h-13c-.3 0-.5.2-.5.5V18.5c0 .5-.5 1-1 1s-1-.5-1-1V6z"/>
                <path d="M20.5 14c-.3 0-.5.2-.5.5v3c0 .3-.2.5-.5.5H3.5c-.3 0-.5-.2-.5-.5v-3c0-.3.2-.5.5-.5h-2c-.5 0-1 .5-1 1v4c0 2.5 2 4.5 4.5 4.5h9c2.5 0 4.5-2 4.5-4.5v-4c0-.5-.5-1-1-1h-2z"/>
              </svg>
              Download for Windows
            </a>
            <Link href="/roadmap">
              <Button variant="secondary" size="lg">
                View Study Plan
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {mounted && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto">
              {[
                { label: "Total Labs", value: progress.total, icon: <BookOpen className="w-4 h-4" /> },
                { label: "Completed", value: progress.completed, icon: <CheckCircle2 className="w-4 h-4" /> },
                { label: "In Progress", value: progress.inProgress, icon: <Clock className="w-4 h-4" /> },
                { label: "Avg Score", value: progress.avgScore > 0 ? `${progress.avgScore}%` : "—", icon: <TrendingUp className="w-4 h-4" /> },
              ].map((stat) => (
                <Card key={stat.label} padding="sm" className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1 text-accent">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-fg-primary">{stat.value}</div>
                  <div className="text-xs text-fg-muted">{stat.label}</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-16 bg-bg-surface border-y border-border-soft">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-fg-primary mb-2">
              Who is this for?
            </h2>
            <p className="text-fg-muted max-w-xl mx-auto">
              Built for anyone targeting an IT Support Engineer I role at a warehouse
              or fulfillment operations environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🎯",
                title: "Job Seekers",
                desc: "Preparing for an IT support interview at Amazon or similar fulfillment operations. Build real skills and a portfolio.",
              },
              {
                emoji: "🔄",
                title: "Career Changers",
                desc: "Moving from general IT into warehouse or operations-specific roles. Learn the domain context that generic certs skip.",
              },
              {
                emoji: "📈",
                title: "Current IT Staff",
                desc: "Already in IT but want structured practice for incident response, AD, DNS, and networking in a warehouse context.",
              },
            ].map((item) => (
              <Card key={item.title} className="text-center p-6">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-fg-primary mb-2">{item.title}</h3>
                <p className="text-sm text-fg-secondary leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-fg-primary mb-2">
              What you get
            </h2>
            <p className="text-fg-muted max-w-xl mx-auto">
              Every tool you need to go from beginner to job-ready, in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="p-5">
                <div className="w-10 h-10 rounded-lg bg-accent-muted text-accent flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-fg-primary mb-2">{f.title}</h3>
                <p className="text-sm text-fg-secondary leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 12-Week Path */}
      <section className="py-16 bg-bg-surface border-y border-border-soft">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-fg-primary mb-2">
              12-Week Learning Path
            </h2>
            <p className="text-fg-muted max-w-xl mx-auto">
              Structured progression from foundations to capstone. Complete labs in
              order for the best outcome.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningPath.map((phase, i) => (
              <Card key={phase.phase} className="p-4 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-fg-inverted flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <div className="text-xs text-fg-muted mb-0.5">{phase.phase}</div>
                  <div className="font-semibold text-fg-primary text-sm">{phase.title}</div>
                  <div className="text-xs text-fg-secondary mt-0.5">{phase.desc}</div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/roadmap">
              <Button variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
                View Full Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Card className="p-10 bg-gradient-to-br from-accent-muted to-transparent border-accent">
            <h2 className="text-2xl font-bold text-fg-primary mb-3">
              Ready to start?
            </h2>
            <p className="text-fg-secondary mb-6 max-w-md mx-auto">
              Your progress is saved locally. Come back anytime and pick up exactly
              where you left off.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/labs">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Browse All Labs
                </Button>
              </Link>
              <Link href="/tutor">
                <Button variant="secondary" size="lg">
                  Try the AI Tutor
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Download Desktop App */}
      <section className="py-16" id="download">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-fg-primary mb-2">
              Download the Desktop App
            </h2>
            <p className="text-fg-muted max-w-xl mx-auto">
              Get the full Windows desktop experience with offline support, native
              shortcuts, and a system tray icon.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="font-semibold text-fg-primary mb-2">Windows 10/11</h3>
              <p className="text-sm text-fg-secondary mb-4">
                64-bit installer, ~170 MB
              </p>
              <a
                href="https://github.com/pitchiluxe/Amazon_IT_Support_Engineer_I_Lab_Workflows/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-200 bg-accent text-fg-inverted hover:opacity-90"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Download for Windows
              </a>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-5xl mb-4">🖥️</div>
              <h3 className="font-semibold text-fg-primary mb-2">Web Version</h3>
              <p className="text-sm text-fg-secondary mb-4">
                No install required, runs in any browser
              </p>
              <Link href="/dashboard" className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-200 border-2 border-accent text-accent hover:bg-accent hover:text-fg-inverted">
                <ArrowRight className="w-5 h-5" />
                Open in Browser
              </Link>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="font-semibold text-fg-primary mb-2">Source Code</h3>
              <p className="text-sm text-fg-secondary mb-4">
                MIT-style license, fork and customize
              </p>
              <a
                href="https://github.com/pitchiluxe/Amazon_IT_Support_Engineer_I_Lab_Workflows"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-200 border-2 border-border-soft text-fg-primary hover:border-accent"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="py-16" id="creator">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-fg-primary mb-2">
              Meet the Creator
            </h2>
          </div>
          <Card className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <img
                  src="/Erick.jpg"
                  alt="Erick Omari"
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-accent shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-fg-primary mb-1">
                  Erick Omari
                </h3>
                <p className="text-accent font-medium text-sm mb-4">
                  Creator & Developer
                </p>
                <p className="text-fg-secondary leading-relaxed mb-4">
                  I built this platform to give aspiring IT professionals a real
                  place to practice the day-to-day work of supporting warehouse
                  operations — from Windows Server and Active Directory to
                  incident response and project management. Too many people
                  walk into their first IT support interview without ever
                  having touched a real scenario. This changes that.
                </p>
                <p className="text-fg-secondary leading-relaxed mb-6">
                  I&apos;m passionate about hands-on learning, building tools
                  that make complex topics approachable, and helping people
                  land their first IT role. When I&apos;m not building, I&apos;m
                  sharing what I learn on YouTube and writing code on GitHub.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href="https://www.youtube.com/@eomari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>
                  <a
                    href="https://x.com/eomari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X
                  </a>
                  <a
                    href="https://github.com/pitchiluxe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-bg-surface border-t border-border-soft" id="contact">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-fg-primary mb-2">Get in Touch</h2>
            <p className="text-fg-muted">
              Have questions about the platform or want to contribute content?
              Reach out below.
            </p>
          </div>
          <Card className="p-8">
            <ContactForm />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border-soft text-center text-xs text-fg-muted">
        <p>
          IT Support Engineer I Lab Platform — Practice environment only.
          Never apply these techniques on production systems without authorization.
        </p>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // In a real app, this would send to a backend.
    // For now, we show a success state.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-fg-primary mb-2">
          Message sent!
        </h3>
        <p className="text-fg-secondary text-sm">
          Thanks for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-fg-muted block mb-1">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-sm text-fg-muted block mb-1">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-fg-muted block mb-1">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="What's this about?"
          className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="text-sm text-fg-muted block mb-1">
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Your message..."
          rows={5}
          className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm focus:outline-none focus:border-accent resize-none"
        />
      </div>
      {error && (
        <p className="text-danger text-sm bg-danger-muted p-2 rounded-lg">{error}</p>
      )}
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
}
