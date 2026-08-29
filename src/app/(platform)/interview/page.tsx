"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAllLabs } from "@/lib/labData";
import { getPlatformState } from "@/lib/storage";
import { ChevronRight, ChevronLeft } from "lucide-react";

const sections = [
  {
    title: "Networking",
    items: [
      { q: "Walk me through the OSI model.", a: "Start with Layer 1 (physical: cables, hubs), Layer 2 (data link: MAC addresses, switches), Layer 3 (network: IP, routers), Layer 4 (transport: TCP/UDP, ports), Layer 5-7 (session, presentation, application). Use a real example like browsing a website." },
      { q: "Troubleshoot DNS resolution failure.", a: "Layer by layer: 1) Verify IP address is assigned. 2) Ping the DNS server. 3) Check resolv.conf or DNS settings. 4) Use nslookup/dig to test. 5) Check if the zone exists and records are correct. 6) Check firewall." },
      { q: "Explain DHCP lease process.", a: "DORA: Discover (client broadcasts), Offer (server offers IP), Request (client requests), Ack (server acknowledges). Lease includes IP, subnet, gateway, DNS, and duration." },
      { q: "VLANs and trunk ports.", a: "VLANs segment broadcast domains at Layer 2. Access ports are in one VLAN; trunk ports carry multiple VLANs using 802.1Q tagging. Trunk allows a single link between switches to carry traffic for multiple VLANs." },
    ],
  },
  {
    title: "Windows Server",
    items: [
      { q: "What happens when a user cannot log in?", a: "Verify: correct username, password, domain. Check if account is disabled or locked. Verify DNS resolution. Check if DC is reachable. Review security event log on DC. Check network path (firewall)." },
      { q: "Explain Group Policy processing order.", a: "LSDOU: Local → Site → Domain → OU. OU is applied last and takes precedence. Within an OU, GPOs are applied in GPO link order (lower number = higher priority)." },
      { q: "DFS namespace vs replication.", a: "Namespace provides a single UNC path to files hosted on multiple servers. Replication keeps files synchronized between servers. Use both for redundancy and load distribution." },
      { q: "Print server troubleshooting checklist.", a: "1) Spooler service running. 2) Port correct IP. 3) Driver installed. 4) Share permissions. 5) NTFS permissions. 6) Firewall. 7) Client print queue." },
    ],
  },
  {
    title: "Behavioral",
    items: [
      { q: "Tell me about a difficult technical incident.", a: "Use STAR: Situation (scanner outage affecting 30 workers), Task (restore service quickly), Action (isolated network layer, found VLAN mismatch), Result (restored in 22 minutes, documented SOP)." },
      { q: "How do you prioritize multiple incidents?", a: "Production impact first: severity × number of affected users. Critical service (AD, network) outranks a single printer. Communicate status to stakeholders while working the fix." },
      { q: "Tell me about a time you improved a process.", a: "Situation: RCA showed the same issue recurring. Task: Write an SOP. Action: Created decision tree and published to KB. Result: 60% reduction in escalations for that issue." },
      { q: "How do you handle disagreeing with a procedure?", a: "Raise concerns through the proper channel (manager, change board). Present evidence-based risk analysis. If the decision stands, follow the procedure but document your concern. Never compromise production safety." },
    ],
  },
];

export default function InterviewPage() {
  const labs = getAllLabs();
  const [section, setSection] = useState(0);
  const [card, setCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(
      Object.values(getPlatformState().progress).filter(
        (p) => p.status === "completed"
      ).length
    );
  }, []);

  const currentItems = sections[section].items;
  const current = currentItems[card];

  const nextCard = () => {
    setFlipped(false);
    if (card < currentItems.length - 1) {
      setCard(card + 1);
    } else if (section < sections.length - 1) {
      setSection(section + 1);
      setCard(0);
    } else {
      setSection(0);
      setCard(0);
    }
  };

  const prevCard = () => {
    setFlipped(false);
    if (card > 0) {
      setCard(card - 1);
    } else if (section > 0) {
      setSection(section - 1);
      setCard(sections[section - 1].items.length - 1);
    }
  };

  return (
    <>
      <PageHeader
        title="Interview Preparation"
        description={`Flashcard-style practice for interview questions. ${completedCount} labs completed — apply that knowledge to real interview scenarios.`}
      />

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => { setSection(i); setCard(0); setFlipped(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              i === section
                ? "bg-accent text-fg-inverted"
                : "bg-bg-surface border border-border-soft text-fg-secondary hover:bg-bg-muted"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 text-sm text-fg-muted mb-4">
        <span>
          Card {card + 1} / {currentItems.length}
        </span>
        <div className="flex-1 h-1 bg-bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${((card + 1) / currentItems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-6">
        <Card
          className="min-h-64 flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:border-accent transition-colors"
          onClick={() => setFlipped(!flipped)}
          hover
        >
          {!flipped ? (
            <>
              <Badge variant="info" className="mb-4">Question</Badge>
              <p className="text-lg font-medium text-fg-primary leading-relaxed">
                {current.q}
              </p>
              <p className="text-sm text-fg-muted mt-4">👆 Click to reveal answer</p>
            </>
          ) : (
            <>
              <Badge variant="success" className="mb-4">Answer</Badge>
              <p className="text-sm text-fg-secondary whitespace-pre-wrap text-left leading-relaxed max-w-full">
                {current.a}
              </p>
              <p className="text-sm text-fg-muted mt-4">👆 Click to see question</p>
            </>
          )}
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={prevCard}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        <span className="text-sm text-fg-muted">
          {section + 1}/{sections.length} · {sections[section].title}
        </span>
        <Button onClick={nextCard} icon={<ChevronRight className="w-4 h-4" />}>
          Next
        </Button>
      </div>

      {/* STAR Story Prep */}
      <div className="mt-8">
        <Card>
          <CardTitle className="mb-3">STAR Story Preparation</CardTitle>
          <CardDescription className="mb-4">
            For behavioral questions, prepare these 5 stories before every interview:
          </CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "A difficult technical incident you resolved",
              "A root cause you discovered",
              "A process you improved",
              "Working under production pressure",
              "Supporting a non-technical customer",
              "Managing a technical project",
            ].map((story, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-muted text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-accent font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-fg-primary">{story}</span>
                </div>
                <p className="text-xs text-fg-muted">S · T · A · R format</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
