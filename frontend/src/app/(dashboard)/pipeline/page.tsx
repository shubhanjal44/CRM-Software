"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  GitMerge,
  MapPin,
  LayoutGrid,
  List,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PipelineDeal {
  id: number;
  company_name: string;
  meeting_date: string | null;
  source_name: string | null;
  company_location: string | null;
  submitted_by: string | null;
  remarks: string | null;
  status: string;
  next_followup_date: string | null;
  priority: string;
}

const STATUSES = [
  "New Lead",
  "Contacted",
  "Meeting Scheduled",
  "Due Diligence",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
] as const;

const PRIORITIES = ["High", "Medium", "Low"] as const;

type StatusType = (typeof STATUSES)[number];
type PriorityType = (typeof PRIORITIES)[number];

const STATUS_COLORS: Record<StatusType, string> = {
  "New Lead": "purple",
  Contacted: "info",
  "Meeting Scheduled": "success",
  "Due Diligence": "warning",
  "Proposal Sent": "purple",
  Negotiation: "default",
  "Closed Won": "success",
  "Closed Lost": "secondary",
};

const PRIORITY_COLORS: Record<PriorityType, string> = {
  High: "destructive",
  Medium: "warning",
  Low: "secondary",
};

const KANBAN_STATUSES: StatusType[] = [
  "New Lead",
  "Contacted",
  "Meeting Scheduled",
  "Due Diligence",
];

// ─── Empty form ────────────────────────────────────────────────────────────────

const emptyForm = (): Omit<PipelineDeal, "id" | "submitted_by"> => ({
  company_name: "",
  meeting_date: "",
  source_name: "",
  company_location: "",
  remarks: "",
  status: "New Lead",
  next_followup_date: "",
  priority: "Medium",
});

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-muted shimmer" />
        </td>
      ))}
    </tr>
  );
}

function StatSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="h-3 w-20 rounded bg-muted shimmer mb-2" />
        <div className="h-7 w-10 rounded bg-muted shimmer" />
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [deals, setDeals] = useState<PipelineDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<PipelineDeal | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filterStatus && filterStatus !== "all") params.status = filterStatus;
      if (filterPriority && filterPriority !== "all")
        params.priority = filterPriority;

      const res = await api.get("/pipeline", { params });
      const raw = res.data?.data ?? res.data ?? [];
      setDeals(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error("Failed to load pipeline deals");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterPriority]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const totalDeals = deals.length;
  const activeDeals = deals.filter(
    (d) => d.status !== "Closed Won" && d.status !== "Closed Lost"
  ).length;
  const closedWon = deals.filter((d) => d.status === "Closed Won").length;
  const highPriority = deals.filter((d) => d.priority === "High").length;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function openAdd() {
    setForm(emptyForm());
    setAddOpen(true);
  }

  function openEdit(deal: PipelineDeal) {
    setSelectedDeal(deal);
    setForm({
      company_name: deal.company_name ?? "",
      meeting_date: deal.meeting_date ?? "",
      source_name: deal.source_name ?? "",
      company_location: deal.company_location ?? "",
      remarks: deal.remarks ?? "",
      status: deal.status ?? "New Lead",
      next_followup_date: deal.next_followup_date ?? "",
      priority: deal.priority ?? "Medium",
    });
    setEditOpen(true);
  }

  function openDetail(deal: PipelineDeal) {
    setSelectedDeal(deal);
    setDetailOpen(true);
  }

  async function handleCreate() {
    if (!form.company_name.trim()) {
      toast.error("Company name is required");
      return;
    }
    setSaving(true);
    try {
      await api.post("/pipeline", form);
      toast.success("Deal created successfully");
      setAddOpen(false);
      fetchDeals();
    } catch {
      toast.error("Failed to create deal");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!selectedDeal) return;
    if (!form.company_name.trim()) {
      toast.error("Company name is required");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/pipeline/${selectedDeal.id}`, form);
      toast.success("Deal updated successfully");
      setEditOpen(false);
      fetchDeals();
    } catch {
      toast.error("Failed to update deal");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(deal: PipelineDeal) {
    const confirmed = window.confirm(
      `Delete deal "${deal.company_name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(deal.id);
    try {
      await api.delete(`/pipeline/${deal.id}`);
      toast.success("Deal deleted");
      fetchDeals();
    } catch {
      toast.error("Failed to delete deal");
    } finally {
      setDeletingId(null);
    }
  }

  // ── Form field helper ──────────────────────────────────────────────────────

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  function StatusBadge({ status }: { status: string }) {
    const color = STATUS_COLORS[status as StatusType] ?? "default";
    return <Badge variant={color as any}>{status}</Badge>;
  }

  function PriorityBadge({ priority }: { priority: string }) {
    const color = PRIORITY_COLORS[priority as PriorityType] ?? "default";
    return <Badge variant={color as any}>{priority}</Badge>;
  }

  // ── Deal form (shared between add/edit) ────────────────────────────────────

  function DealForm() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input
            id="company_name"
            value={form.company_name}
            onChange={(e) => setField("company_name", e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <Label htmlFor="meeting_date">Meeting Date</Label>
          <Input
            id="meeting_date"
            type="date"
            value={form.meeting_date ?? ""}
            onChange={(e) => setField("meeting_date", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="next_followup_date">Next Follow-up Date</Label>
          <Input
            id="next_followup_date"
            type="date"
            value={form.next_followup_date ?? ""}
            onChange={(e) => setField("next_followup_date", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="source_name">Source</Label>
          <Input
            id="source_name"
            value={form.source_name ?? ""}
            onChange={(e) => setField("source_name", e.target.value)}
            placeholder="e.g. Referral, LinkedIn"
          />
        </div>
        <div>
          <Label htmlFor="company_location">Location</Label>
          <Input
            id="company_location"
            value={form.company_location ?? ""}
            onChange={(e) => setField("company_location", e.target.value)}
            placeholder="City, Country"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setField("status", v)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={form.priority}
            onValueChange={(v) => setField("priority", v)}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={form.remarks ?? ""}
            onChange={(e) => setField("remarks", e.target.value)}
            placeholder="Additional notes..."
            rows={3}
          />
        </div>
      </div>
    );
  }

  // ── Kanban view ────────────────────────────────────────────────────────────

  function KanbanView() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {KANBAN_STATUSES.map((status) => {
          const columnDeals = deals.filter((d) => d.status === status);
          return (
            <div key={status} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold">{status}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {columnDeals.length}
                </span>
              </div>
              <div className="flex flex-col gap-2 min-h-[100px]">
                {columnDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openDetail(deal)}
                  >
                    <CardContent className="p-3 space-y-1.5">
                      <p className="font-medium text-sm leading-tight">
                        {deal.company_name}
                      </p>
                      {deal.company_location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {deal.company_location}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <PriorityBadge priority={deal.priority} />
                      </div>
                      {deal.next_followup_date && (
                        <p className="text-xs text-muted-foreground">
                          Follow-up: {formatDate(deal.next_followup_date)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {columnDeals.length === 0 && (
                  <div className="flex-1 border-2 border-dashed rounded-lg flex items-center justify-center text-xs text-muted-foreground p-4">
                    No deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <GitMerge className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Pipeline
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your sales pipeline deals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              className={`p-2 transition-colors ${viewMode === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={() => setViewMode("kanban")}
              title="Kanban view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={openAdd} className="w-full sm:w-auto gap-1.5">
            <Plus className="h-4 w-4" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Total Deals
                </p>
                <p className="text-2xl font-bold mt-1">{totalDeals}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Active Deals
                </p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {activeDeals}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Closed Won
                </p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {closedWon}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  High Priority
                </p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {highPriority}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {viewMode === "kanban" ? (
        loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <KanbanView />
        )
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Sr</th>
                  <th className="px-4 py-3 text-left font-semibold">Company</th>
                  <th className="px-4 py-3 text-left font-semibold">Location</th>
                  <th className="px-4 py-3 text-left font-semibold">Source</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Priority</th>
                  <th className="px-4 py-3 text-left font-semibold">Follow-up</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : deals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      No deals found. Add your first deal to get started.
                    </td>
                  </tr>
                ) : (
                  deals.map((deal, idx) => (
                    <tr
                      key={deal.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {deal.company_name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {deal.company_location ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {deal.company_location}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {deal.source_name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={deal.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={deal.priority} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {deal.next_followup_date
                          ? formatDate(deal.next_followup_date)
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetail(deal)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(deal)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(deal)}
                            disabled={deletingId === deal.id}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingId === deal.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Add Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
          </DialogHeader>
          <DealForm />
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ─────────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          <DealForm />
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Detail Dialog ────────────────────────────────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDeal?.company_name}</DialogTitle>
          </DialogHeader>
          {selectedDeal && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selectedDeal.status} />
                <PriorityBadge priority={selectedDeal.priority} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Location
                  </p>
                  <p className="mt-0.5">
                    {selectedDeal.company_location ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Source
                  </p>
                  <p className="mt-0.5">{selectedDeal.source_name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Meeting Date
                  </p>
                  <p className="mt-0.5">
                    {selectedDeal.meeting_date
                      ? formatDate(selectedDeal.meeting_date)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Next Follow-up
                  </p>
                  <p className="mt-0.5">
                    {selectedDeal.next_followup_date
                      ? formatDate(selectedDeal.next_followup_date)
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Submitted By
                  </p>
                  <p className="mt-0.5">{selectedDeal.submitted_by ?? "—"}</p>
                </div>
              </div>
              {selectedDeal.remarks && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Remarks
                  </p>
                  <p className="mt-0.5 whitespace-pre-wrap">
                    {selectedDeal.remarks}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setDetailOpen(false);
                if (selectedDeal) openEdit(selectedDeal);
              }}
              className="w-full sm:w-auto"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => setDetailOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
