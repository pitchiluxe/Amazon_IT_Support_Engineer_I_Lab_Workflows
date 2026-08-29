"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  getAssets,
  addAsset,
  deleteAsset,
  saveAssets,
  getDefaultAssets,
  getAssetTemplateCSV,
} from "@/lib/storage";
import type { Asset } from "@/types";
import {
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Search,
  Server,
  Monitor,
  Printer,
  Wifi,
  Phone,
  Camera,
  Battery,
} from "lucide-react";

const typeIcons: Record<string, string> = {
  server: "🖥️",
  workstation: "💻",
  laptop: "💻",
  switch: "🌐",
  router: "📡",
  printer: "🖨️",
  scanner: "📠",
  access_point: "📶",
  ups: "🔋",
  phone: "📞",
  conference: "📹",
  other: "📦",
};

const statusColors = {
  active: "success",
  maintenance: "warning",
  retired: "default",
  staged: "info",
} as const;

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showTemplate, setShowTemplate] = useState(false);
  const [form, setForm] = useState<Partial<Asset>>({
    type: "workstation",
    status: "staged",
  });

  useEffect(() => {
    setAssets(getAssets());
  }, []);

  const handleAdd = () => {
    if (!form.name || !form.type) return;
    const asset: Asset = {
      id: `asset-${Date.now()}`,
      name: form.name ?? "",
      type: form.type as Asset["type"],
      status: form.status as Asset["status"],
      location: form.location ?? "",
      ipAddress: form.ipAddress,
      macAddress: form.macAddress,
      serialNumber: form.serialNumber,
      purchaseDate: form.purchaseDate,
      warrantyExpiry: form.warrantyExpiry,
    };
    addAsset(asset);
    setAssets([...assets, asset]);
    setForm({ type: "workstation", status: "staged" });
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    deleteAsset(id);
    setAssets(assets.filter((a) => a.id !== id));
  };

  const handleResetToDefault = () => {
    if (confirm("Reset to the default warehouse site inventory? Your custom assets will be lost.")) {
      const defaults = getDefaultAssets();
      saveAssets(defaults);
      setAssets(defaults);
    }
  };

  const handleDownloadCSV = () => {
    const csv = getAssetTemplateCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warehouse-asset-inventory.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const md = [
      "| Name | Type | IP | MAC | Serial | Location |",
      "|------|------|-----|-----|--------|----------|",
      ...assets.map(
        (a) =>
          `| ${a.name} | ${a.type} | ${a.ipAddress || "—"} | ${a.macAddress || "—"} | ${a.serialNumber || "—"} | ${a.location || "—"} |`
      ),
    ].join("\n");
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "warehouse-asset-inventory.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter assets by search and type
  const filtered = assets.filter((a) => {
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.ipAddress?.includes(search) ||
      a.location?.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || a.type === filterType;
    return matchesSearch && matchesType;
  });

  // Counts by type
  const typeCounts = assets.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <PageHeader
        title="Asset Inventory"
        description="Warehouse site hardware inventory. Use this for the Lab 1 baseline documentation exercise."
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownloadCSV}
            >
              CSV
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownloadMarkdown}
            >
              Markdown
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleResetToDefault}
            >
              Reset
            </Button>
            <Button
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAdd(true)}
            >
              Add Asset
            </Button>
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {[
          { type: "server", label: "Servers", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
          { type: "workstation", label: "Workstations", color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/30" },
          { type: "printer", label: "Printers", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
          { type: "switch", label: "Switches", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
          { type: "ups", label: "UPS", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30" },
          { type: "conference", label: "Conf Devices", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
        ].map((cat) => (
          <button
            key={cat.type}
            onClick={() => setFilterType(filterType === cat.type ? "all" : cat.type)}
            className={`p-3 rounded-xl border transition-all ${
              filterType === cat.type
                ? "border-accent ring-2 ring-accent/30"
                : "border-border-soft hover:border-accent/50"
            } ${cat.bg}`}
          >
            <div className="text-2xl mb-1">{typeIcons[cat.type]}</div>
            <div className="text-xs text-fg-muted font-medium">{cat.label}</div>
            <div className={`text-xl font-bold ${cat.color}`}>{typeCounts[cat.type] || 0}</div>
          </button>
        ))}
      </div>

      {/* Template hint for Lab 1 */}
      <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div className="flex-1">
          <div className="font-semibold text-fg-primary text-sm">Using this for Lab 1?</div>
          <p className="text-xs text-fg-muted mt-0.5">
            This is the inventory you'll be auditing. The first time you start Lab 1, the inventory is
            <span className="font-mono text-fg-primary"> seeded with two planted documentation errors</span>.
            Find them by pinging W-04 (actual IP differs) and physically locating Printer-Pick-2 (moved during renovation).
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setShowTemplate(!showTemplate)}>
          {showTemplate ? "Hide" : "Show"} Template
        </Button>
      </div>

      {showTemplate && (
        <Card className="mb-4">
          <h3 className="font-semibold text-sm mb-2">Asset Inventory Template (CSV)</h3>
          <p className="text-xs text-fg-muted mb-3">
            Use the columns below for your own environment. Required: Name, Type, IP, MAC, Serial, Location.
          </p>
          <pre className="bg-bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`Name,Type,IP,MAC,Serial,Location,Status
DC-01,server,10.0.0.10,00:1A:2B:3C:4D:01,DL380-DCN-001,Server Room,active
FS-01,server,10.0.0.11,00:1A:2B:3C:4D:02,DL380-FS-001,Server Room,active
Core-SW-01,switch,10.0.0.2,00:1A:2B:3C:4D:10,CISCO-2960-001,IT Closet,active
WS-01,workstation,10.0.0.100,00:1A:2B:3C:4E:01,WS-DEL-001,Bay 1,active
WS-02,workstation,10.0.0.101,00:1A:2B:3C:4E:02,WS-DEL-002,Bay 2,active
W-04,workstation,10.0.0.45,00:1A:2B:3C:4E:04,WS-DEL-004,Bay 4,active
Warehouse-Printer-01,printer,10.0.0.50,00:1A:2B:3C:4F:01,HP-LJ-001,Bay 1,active
Printer-Pick-2,printer,10.0.0.51,00:1A:2B:3C:4F:02,HP-LJ-002,Bay 3,active`}
          </pre>
        </Card>
      )}

      {/* Search */}
      <Card className="mb-4" padding="sm">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-fg-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, IP, location, or serial..."
            className="flex-1 px-2 py-1.5 bg-transparent text-sm text-fg-primary outline-none"
          />
          {filterType !== "all" && (
            <Badge variant="info">Filter: {filterType}</Badge>
          )}
          <span className="text-xs text-fg-muted">
            {filtered.length} of {assets.length}
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-fg-muted text-sm text-center py-8">
            No assets match your filter.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft">
                <th className="text-left p-3 text-fg-muted font-medium">Name</th>
                <th className="text-left p-3 text-fg-muted font-medium">Type</th>
                <th className="text-left p-3 text-fg-muted font-medium">Status</th>
                <th className="text-left p-3 text-fg-muted font-medium">Location</th>
                <th className="text-left p-3 text-fg-muted font-medium">IP</th>
                <th className="text-left p-3 text-fg-muted font-medium">MAC</th>
                <th className="text-left p-3 text-fg-muted font-medium">Serial</th>
                <th className="text-left p-3 text-fg-muted font-medium">Notes</th>
                <th className="text-left p-3 text-fg-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} className="border-b border-border-soft hover:bg-bg-muted/50">
                  <td className="p-3 font-medium text-fg-primary">
                    <span className="mr-1.5">{typeIcons[asset.type]}</span>
                    {asset.name}
                  </td>
                  <td className="p-3 capitalize text-fg-secondary">{asset.type.replace("_", " ")}</td>
                  <td className="p-3">
                    <Badge variant={statusColors[asset.status] as any}>
                      {asset.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-fg-muted">{asset.location || "—"}</td>
                  <td className="p-3 font-mono text-xs text-fg-muted">{asset.ipAddress || "—"}</td>
                  <td className="p-3 font-mono text-xs text-fg-muted">{asset.macAddress || "—"}</td>
                  <td className="p-3 font-mono text-xs text-fg-muted">{asset.serialNumber || "—"}</td>
                  <td className="p-3 text-xs text-warning max-w-[200px] truncate" title={asset.notes}>
                    {asset.notes ? (
                      <span className="flex items-center gap-1">
                        <span>⚠️</span>
                        <span className="truncate">{asset.notes}</span>
                      </span>
                    ) : "—"}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
                      icon={<Trash2 className="w-3 h-3" />}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Asset"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Asset</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-sm text-fg-muted block mb-1">Name *</label>
            <input
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., DC-01, WS-01, Warehouse-Printer-02"
              className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-fg-muted block mb-1">Type</label>
              <select
                value={form.type ?? "workstation"}
                onChange={(e) => setForm({ ...form, type: e.target.value as Asset["type"] })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              >
                {Object.keys(typeIcons).map((t) => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-fg-muted block mb-1">Status</label>
              <select
                value={form.status ?? "staged"}
                onChange={(e) => setForm({ ...form, status: e.target.value as Asset["status"] })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              >
                <option value="staged">Staged</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-fg-muted block mb-1">Location</label>
            <input
              value={form.location ?? ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Server Room, Operations Bay 1"
              className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-fg-muted block mb-1">IP Address</label>
              <input
                value={form.ipAddress ?? ""}
                onChange={(e) => setForm({ ...form, ipAddress: e.target.value })}
                placeholder="10.0.0.10"
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-sm text-fg-muted block mb-1">MAC Address</label>
              <input
                value={form.macAddress ?? ""}
                onChange={(e) => setForm({ ...form, macAddress: e.target.value })}
                placeholder="00:1A:2B:3C:4D:01"
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-fg-muted block mb-1">Serial Number</label>
              <input
                value={form.serialNumber ?? ""}
                onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                placeholder="DL380-DCN-001"
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm font-mono"
              />
            </div>
            <div>
              <label className="text-sm text-fg-muted block mb-1">Purchase Date</label>
              <input
                type="date"
                value={form.purchaseDate ?? ""}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-border-soft bg-bg-surface text-fg-primary text-sm"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
