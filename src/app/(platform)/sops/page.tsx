"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Spinner";
import { getSOPs, addSOP, updateSOP, deleteSOP } from "@/lib/storage";
import type { SOP } from "@/types";
import { Plus, BookOpen, Edit2, Trash2 } from "lucide-react";

const sampleSOPs: Omit<SOP, "id">[] = [
  {
    title: "New Windows Workstation Deployment",
    category: "Endpoint",
    owner: "IT Team",
    reviewDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
    version: "1.0",
    content: `## Purpose
Deploy a new Windows workstation following the standard image and domain join procedure.

## Scope
All new Windows 11 workstation deployments.

## Prerequisites
- Standard image (.wim) available
- Machine is on the network
- Service tag recorded

## Procedure
1. Boot from USB/installer
2. Apply standard image: \`DISM /Apply-Image /ImageFile:\\share\\images\\win11.wim /Index:1 /ApplyDrive:C:\`
3. Set hostname: \`Rename-Computer -NewName WS-XX\`
4. Join domain: \`Add-Computer -DomainName warehouse.local -Restart\`
5. Verify in AD Users and Computers
6. Deploy software via policy
7. Run validation checks

## Validation
- Hostname correct in AD
- Domain login works
- Software policy applied
- No unknown devices in Device Manager

## Common Failures
- Image apply fails: check drive letter
- Domain join fails: verify DNS
- Software not deploying: check collection membership`,
  },
  {
    title: "Password / Account Issue",
    category: "Identity",
    owner: "IT Team",
    reviewDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
    version: "1.0",
    content: `## Purpose
Resolve user account and password issues through proper escalation.

## Scope
All AD user account issues.

## Procedure
1. Verify user identity with 2-factor questions
2. Check if account is disabled: \`Get-ADUser -Identity username -Properties Enabled\`
3. Check password expiry: \`net user username /domain\`
4. If expired: reset via IT request form (requires manager approval)
5. If disabled: re-enable with manager approval
6. Document action in ticket

## Escalation
Do not reset executive passwords without IT Manager approval.`,
  },
  {
    title: "Network Connectivity Issue",
    category: "Network",
    owner: "IT Team",
    reviewDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
    version: "1.0",
    content: `## Purpose
Diagnose and resolve workstation network connectivity issues.

## Procedure
1. Verify physical link (link light on NIC)
2. \`ipconfig /all\` — check IP, DNS, gateway
3. \`ping 127.0.0.1\` — confirm stack
4. \`ping gateway\` — confirm Layer 3
5. \`nslookup warehouse.local\` — confirm DNS
6. Check DHCP lease: \`ipconfig /release && ipconfig /renew\`
7. Check VLAN/port: \`arp -a\` for MAC table
8. Escalate if unresolved after Layer 3 checks`,
  },
];

export default function SOPsPage() {
  const [sops, setSOPs] = useState<SOP[]>([]);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Omit<SOP, "id">>({
    title: "",
    category: "General",
    content: "",
    owner: "IT Team",
    reviewDate: "",
    version: "1.0",
  });

  useEffect(() => {
    const stored = getSOPs();
    if (stored.length === 0) {
      // Seed with sample SOPs
      const seeded = sampleSOPs.map((s, i) => ({
        ...s,
        id: `sop-seed-${i}`,
      })) as SOP[];
      seeded.forEach((s) => addSOP(s));
      setSOPs(seeded);
    } else {
      setSOPs(stored);
    }
  }, []);

  const filtered = sops.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.title) return;
    const sop: SOP = { ...form, id: `sop-${Date.now()}` };
    addSOP(sop);
    setSOPs([...sops, sop]);
    setForm({ title: "", category: "General", content: "", owner: "IT Team", reviewDate: "", version: "1.0" });
    setShowAdd(false);
  };

  return (
    <>
      <PageHeader
        title="SOPs & Knowledge Base"
        description="Standard operating procedures and runbooks. These should be the first resource for any common issue."
        actions={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>
            New SOP
          </Button>
        }
      />

      <div className="flex gap-3 mb-6">
        <input
          type="search"
          placeholder="Search SOPs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          {filtered.map((sop) => (
            <Card
              key={sop.id}
              hover
              padding="sm"
              className={selectedSOP?.id === sop.id ? "border-accent" : ""}
            >
              <button
                className="w-full text-left"
                onClick={() => setSelectedSOP(sop)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="font-medium text-sm text-fg-primary line-clamp-1">
                    {sop.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{sop.category}</Badge>
                  <span className="text-xs text-fg-muted">v{sop.version}</span>
                </div>
              </button>
            </Card>
          ))}
          {filtered.length === 0 && (
            <EmptyState
              icon="📚"
              title="No SOPs found"
              description="Add your first SOP or adjust your search."
            />
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedSOP ? (
            <Card className="sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle>{selectedSOP.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{selectedSOP.category}</Badge>
                  <Badge variant="info">v{selectedSOP.version}</Badge>
                </div>
              </div>
              <div className="flex gap-4 text-xs text-fg-muted mb-4 pb-4 border-b border-border-soft">
                <span>Owner: {selectedSOP.owner}</span>
                <span>Review: {selectedSOP.reviewDate}</span>
              </div>
              <div className="prose prose-sm max-w-none text-fg-secondary whitespace-pre-wrap text-sm">
                {selectedSOP.content}
              </div>
            </Card>
          ) : (
            <Card>
              <EmptyState
                icon="📖"
                title="Select an SOP"
                description="Choose an SOP from the list to view its contents."
              />
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="New SOP"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save SOP</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-sm text-fg-muted block mb-1">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-fg-muted block mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              >
                <option>Endpoint</option>
                <option>Identity</option>
                <option>Network</option>
                <option>Server</option>
                <option>Operations</option>
                <option>General</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-fg-muted block mb-1">Owner</label>
              <input
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-fg-muted block mb-1">Review Date</label>
              <input
                type="date"
                value={form.reviewDate}
                onChange={(e) => setForm({ ...form, reviewDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-fg-muted block mb-1">Content (Markdown)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm font-mono"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
