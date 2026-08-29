"use client";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

export default function NetworkPage() {
  // SVG network topology for the warehouse site
  return (
    <>
      <PageHeader
        title="Network Topology"
        description="Simulated network topology for the warehouse IT environment. Assets and connections reflect the lab setup."
      />

      <Card className="mb-6">
        <CardTitle className="mb-1">Warehouse Site Topology</CardTitle>
        <CardDescription>
          Simulated network diagram. In a real lab environment, this would reflect your actual hardware configuration.
        </CardDescription>
      </Card>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 900 500"
          className="w-full border border-border-soft rounded-xl bg-bg-surface"
        >
          {/* Internet */}
          <rect x="380" y="20" width="140" height="40" rx="8" fill="#64748b" />
          <text x="450" y="46" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">
            Internet
          </text>
          <line x1="450" y1="60" x2="450" y2="85" stroke="#94a3b8" strokeWidth="2" />
          <text x="450" y="78" textAnchor="middle" fill="#64748b" fontSize="9">WAN</text>

          {/* Firewall */}
          <rect x="380" y="85" width="140" height="36" rx="6" fill="#ef4444" />
          <text x="450" y="108" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
            Firewall
          </text>
          <line x1="450" y1="121" x2="450" y2="145" stroke="#94a3b8" strokeWidth="2" />

          {/* Core Switch */}
          <rect x="380" y="145" width="140" height="36" rx="6" fill="#3b82f6" />
          <text x="450" y="168" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
            Core Switch
          </text>
          <line x1="450" y1="181" x2="450" y2="205" stroke="#94a3b8" strokeWidth="2" />

          {/* Distribution lines */}
          <line x1="300" y1="205" x2="450" y2="205" stroke="#94a3b8" strokeWidth="2" />
          <line x1="600" y1="205" x2="450" y2="205" stroke="#94a3b8" strokeWidth="2" />

          {/* DC */}
          <rect x="230" y="205" width="140" height="50" rx="8" fill="#7c3aed" />
          <text x="300" y="228" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
            DC-01
          </text>
          <text x="300" y="243" textAnchor="middle" fill="#c4b5fd" fontSize="9">
            AD / DNS / DHCP
          </text>

          {/* File Server */}
          <rect x="230" y="280" width="140" height="50" rx="8" fill="#7c3aed" />
          <text x="300" y="303" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
            FS-01
          </text>
          <text x="300" y="318" textAnchor="middle" fill="#c4b5fd" fontSize="9">
            DFS / File Share
          </text>
          <line x1="300" y1="255" x2="300" y2="280" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Print Server */}
          <rect x="230" y="355" width="140" height="40" rx="6" fill="#0891b2" />
          <text x="300" y="379" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
            Print Server
          </text>
          <line x1="300" y1="330" x2="300" y2="355" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Access Switch */}
          <rect x="530" y="205" width="140" height="36" rx="6" fill="#059669" />
          <text x="600" y="228" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
            Access Switch
          </text>

          {/* VLANs */}
          <rect x="530" y="260" width="140" height="28" rx="4" fill="#064e3b" />
          <text x="600" y="279" textAnchor="middle" fill="#6ee7b7" fontSize="10">
            VLAN 10 — Ops
          </text>
          <rect x="530" y="300" width="140" height="28" rx="4" fill="#1e3a5f" />
          <text x="600" y="319" textAnchor="middle" fill="#93c5fd" fontSize="10">
            VLAN 20 — IT
          </text>
          <rect x="530" y="340" width="140" height="28" rx="4" fill="#4c1d95" />
          <text x="600" y="359" textAnchor="middle" fill="#ddd6fe" fontSize="10">
            VLAN 30 — IoT
          </text>

          <line x1="600" y1="241" x2="600" y2="260" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="600" y1="241" x2="600" y2="300" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="600" y1="241" x2="600" y2="340" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Workstations */}
          {["WS-01", "WS-02", "WS-03"].map((name, i) => (
            <g key={name}>
              <rect x={530 + i * 48} y="380" width="40" height="28" rx="4" fill="#334155" />
              <text x={550 + i * 48} y="398" textAnchor="middle" fill="#94a3b8" fontSize="9">
                {name}
              </text>
              <line x1={550 + i * 48} y1="380" x2={550 + i * 48} y2="368" stroke="#94a3b8" strokeWidth="1" />
            </g>
          ))}
          <line x1="558" y1="368" x2="600" y2="368" stroke="#94a3b8" strokeWidth="1" />
          <line x1="600" y1="368" x2="600" y2="340" stroke="#94a3b8" strokeWidth="1" />

          {/* Printer */}
          <rect x="710" y="250" width="100" height="32" rx="6" fill="#0891b2" />
          <text x="760" y="270" textAnchor="middle" fill="white" fontSize="10">
            Laser-01
          </text>
          <line x1="760" y1="250" x2="670" y2="250" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="670" y1="250" x2="670" y2="205" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Legend */}
          <rect x="20" y="420" width="200" height="70" rx="6" fill="#f1f5f9" stroke="#e2e8f0" />
          <text x="30" y="438" fill="#64748b" fontSize="9" fontWeight="700">LEGEND</text>
          <rect x="30" y="446" width="16" height="10" rx="2" fill="#7c3aed" />
          <text x="52" y="455" fill="#475569" fontSize="9">Server / DC</text>
          <rect x="30" y="462" width="16" height="10" rx="2" fill="#059669" />
          <text x="52" y="471" fill="#475569" fontSize="9">Network Switch</text>
          <rect x="30" y="478" width="16" height="10" rx="2" fill="#334155" />
          <text x="52" y="487" fill="#475569" fontSize="9">Workstation</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { label: "VLAN 10 — Operations", subnet: "10.0.10.0/24", desc: "Workstations, scanners" },
          { label: "VLAN 20 — IT", subnet: "10.0.20.0/24", desc: "IT admin devices" },
          { label: "VLAN 30 — IoT", subnet: "10.0.30.0/24", desc: "Printers, cameras, IoT" },
          { label: "VLAN 99 — Management", subnet: "10.0.99.0/24", desc: "Switch management" },
        ].map((vlan) => (
          <Card key={vlan.label} padding="sm">
            <div className="font-semibold text-sm text-fg-primary">{vlan.label}</div>
            <div className="text-xs font-mono text-accent mt-1">{vlan.subnet}</div>
            <div className="text-xs text-fg-muted mt-0.5">{vlan.desc}</div>
          </Card>
        ))}
      </div>
    </>
  );
}
