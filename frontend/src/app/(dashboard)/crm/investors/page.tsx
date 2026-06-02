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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Landmark,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Investor {
  id: number;
  organization_name: string;
  investor_name: string;
  location: string | null;
  contact_number: string | null;
  email: string | null;
  classification: string;
  last_interaction_date: string | null;
  current_status: string;
  india_related_investments: string | null;
  comments: string | null;
  source_of_introduction: string | null;
  next_steps: string | null;
  submitted_by: string | null;
  investment_thesis: string | null;
  preferred_sectors: string | null;
  ticket_size: string | null;
  geography_preference: string | null;
  internal_notes: string | null;
}

const CLASSIFICATIONS = [
  "HNI",
  "Family Office",
  "Angel Investor",
  "VC",
  "PE Fund",
  "Institutional Investor",
  "Strategic Investor",
  "Sovereign Fund",
  "Corporate Venture Capital",
  "Others",
] as const;

const STATUSES = [
  "Active",
  "Interested",
  "Follow-up Required",
  "Due Diligence",
  "Closed",
  "Not Interested",
] as const;

type StatusType = (typeof STATUSES)[number];

const STATUS_COLORS: Record<StatusType, string> = {
  Active: "success",
  Interested: "info",
  "Follow-up Required": "warning",
  "Due Diligence": "purple",
  Closed: "secondary",
  "Not Interested": "destructive",
};

// ─── Empty form ────────────────────────────────────────────────────────────────

const emptyForm = (): Omit<Investor, "id" | "submitted_by"> => ({
  organization_name: "",
  investor_name: "",
  location: "",
  contact_number: "",
  email: "",
  classification: "HNI",
  last_interaction_date: "",
  current_status: "Active",
  india_related_investments: "",
  comments: "",
  source_of_introduction: "",
  next_steps: "",
  investment_thesis: "",
  preferred_sectors: "",
  ticket_size: "",
  geography_preference: "",
  internal_notes: "",
});

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 9 }).map((_, i) => (
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

// ─── Detail field ─────────────────────────────────────────────────────────────

function DetailField({
  label,
  value,
  icon,
  fullWidth,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 whitespace-pre-wrap break-words">{value}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClassification, setFilterClassification] = useState("all");

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(
    null
  );
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch list ─────────────────────────────────────────────────────────────

  const fetchInvestors = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filterStatus && filterStatus !== "all")
        params.status = filterStatus;
      if (filterClassification && filterClassification !== "all")
        params.classification = filterClassification;

      const res = await api.get("/investors", { params });
      const raw = res.data?.data ?? res.data ?? [];
      setInvestors(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error("Failed to load investors");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterClassification]);

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const totalInvestors = investors.length;
  const activeInvestors = investors.filter(
    (i) => i.current_status === "Active"
  ).length;
  const followUpRequired = investors.filter(
    (i) => i.current_status === "Follow-up Required"
  ).length;
  const dueDiligence = investors.filter(
    (i) => i.current_status === "Due Diligence"
  ).length;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function openAdd() {
    setForm(emptyForm());
    setAddOpen(true);
  }

  function openEdit(investor: Investor) {
    setSelectedInvestor(investor);
    setForm({
      organization_name: investor.organization_name ?? "",
      investor_name: investor.investor_name ?? "",
      location: investor.location ?? "",
      contact_number: investor.contact_number ?? "",
      email: investor.email ?? "",
      classification: investor.classification ?? "HNI",
      last_interaction_date: investor.last_interaction_date ?? "",
      current_status: investor.current_status ?? "Active",
      india_related_investments: investor.india_related_investments ?? "",
      comments: investor.comments ?? "",
      source_of_introduction: investor.source_of_introduction ?? "",
      next_steps: investor.next_steps ?? "",
      investment_thesis: investor.investment_thesis ?? "",
      preferred_sectors: investor.preferred_sectors ?? "",
      ticket_size: investor.ticket_size ?? "",
      geography_preference: investor.geography_preference ?? "",
      internal_notes: investor.internal_notes ?? "",
    });
    setEditOpen(true);
  }

  async function openDetail(investor: Investor) {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const res = await api.get(`/investors/${investor.id}`);
      setSelectedInvestor(res.data?.data ?? res.data ?? investor);
    } catch {
      setSelectedInvestor(investor);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleCreate() {
    if (!form.organization_name.trim()) {
      toast.error("Organization name is required");
      return;
    }
    if (!form.investor_name.trim()) {
      toast.error("Investor name is required");
      return;
    }
    setSaving(true);
    try {
      await api.post("/investors", form);
      toast.success("Investor created successfully");
      setAddOpen(false);
      fetchInvestors();
    } catch {
      toast.error("Failed to create investor");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate() {
    if (!selectedInvestor) return;
    if (!form.organization_name.trim()) {
      toast.error("Organization name is required");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/investors/${selectedInvestor.id}`, form);
      toast.success("Investor updated successfully");
      setEditOpen(false);
      fetchInvestors();
    } catch {
      toast.error("Failed to update investor");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(investor: Investor) {
    const confirmed = window.confirm(
      `Delete investor "${investor.investor_name}" from "${investor.organization_name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(investor.id);
    try {
      await api.delete(`/investors/${investor.id}`);
      toast.success("Investor deleted");
      fetchInvestors();
    } catch {
      toast.error("Failed to delete investor");
    } finally {
      setDeletingId(null);
    }
  }

  // ── Form field helper ──────────────────────────────────────────────────────

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Badges ─────────────────────────────────────────────────────────────────

  function StatusBadge({ status }: { status: string }) {
    const color = STATUS_COLORS[status as StatusType] ?? "default";
    return <Badge variant={color as any}>{status}</Badge>;
  }

  // ── Investor form (shared) ─────────────────────────────────────────────────

  function InvestorForm() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Organization */}
        <div>
          <Label htmlFor="organization_name">Organization Name *</Label>
          <Input
            id="organization_name"
            value={form.organization_name}
            onChange={(e) => setField("organization_name", e.target.value)}
            placeholder="e.g. Sequoia Capital"
          />
        </div>
        {/* Investor Name */}
        <div>
          <Label htmlFor="investor_name">Investor Name *</Label>
          <Input
            id="investor_name"
            value={form.investor_name}
            onChange={(e) => setField("investor_name", e.target.value)}
            placeholder="Contact person name"
          />
        </div>
        {/* Classification */}
        <div>
          <Label htmlFor="classification">Classification</Label>
          <Select
            value={form.classification}
            onValueChange={(v) => setField("classification", v)}
          >
            <SelectTrigger id="classification">
              <SelectValue placeholder="Select classification" />
            </SelectTrigger>
            <SelectContent>
              {CLASSIFICATIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Status */}
        <div>
          <Label htmlFor="current_status">Status</Label>
          <Select
            value={form.current_status}
            onValueChange={(v) => setField("current_status", v)}
          >
            <SelectTrigger id="current_status">
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
        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={form.location ?? ""}
            onChange={(e) => setField("location", e.target.value)}
            placeholder="City, Country"
          />
        </div>
        {/* Last Interaction */}
        <div>
          <Label htmlFor="last_interaction_date">Last Interaction Date</Label>
          <Input
            id="last_interaction_date"
            type="date"
            value={form.last_interaction_date ?? ""}
            onChange={(e) =>
              setField("last_interaction_date", e.target.value)
            }
          />
        </div>
        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email ?? ""}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="investor@example.com"
          />
        </div>
        {/* Contact Number */}
        <div>
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input
            id="contact_number"
            value={form.contact_number ?? ""}
            onChange={(e) => setField("contact_number", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        {/* Source of Introduction */}
        <div>
          <Label htmlFor="source_of_introduction">Source of Introduction</Label>
          <Input
            id="source_of_introduction"
            value={form.source_of_introduction ?? ""}
            onChange={(e) =>
              setField("source_of_introduction", e.target.value)
            }
            placeholder="Referral, Conference, etc."
          />
        </div>
        {/* Ticket Size */}
        <div>
          <Label htmlFor="ticket_size">Ticket Size</Label>
          <Input
            id="ticket_size"
            value={form.ticket_size ?? ""}
            onChange={(e) => setField("ticket_size", e.target.value)}
            placeholder="e.g. $1M – $5M"
          />
        </div>
        {/* Preferred Sectors */}
        <div>
          <Label htmlFor="preferred_sectors">Preferred Sectors</Label>
          <Input
            id="preferred_sectors"
            value={form.preferred_sectors ?? ""}
            onChange={(e) => setField("preferred_sectors", e.target.value)}
            placeholder="e.g. Fintech, Healthcare"
          />
        </div>
        {/* Geography Preference */}
        <div>
          <Label htmlFor="geography_preference">Geography Preference</Label>
          <Input
            id="geography_preference"
            value={form.geography_preference ?? ""}
            onChange={(e) => setField("geography_preference", e.target.value)}
            placeholder="e.g. India, SEA"
          />
        </div>
        {/* India Related Investments */}
        <div className="sm:col-span-2">
          <Label htmlFor="india_related_investments">
            India Related Investments
          </Label>
          <Textarea
            id="india_related_investments"
            value={form.india_related_investments ?? ""}
            onChange={(e) =>
              setField("india_related_investments", e.target.value)
            }
            placeholder="Previous investments in India..."
            rows={2}
          />
        </div>
        {/* Investment Thesis */}
        <div className="sm:col-span-2">
          <Label htmlFor="investment_thesis">Investment Thesis</Label>
          <Textarea
            id="investment_thesis"
            value={form.investment_thesis ?? ""}
            onChange={(e) => setField("investment_thesis", e.target.value)}
            placeholder="Investment strategy and thesis..."
            rows={2}
          />
        </div>
        {/* Next Steps */}
        <div className="sm:col-span-2">
          <Label htmlFor="next_steps">Next Steps</Label>
          <Textarea
            id="next_steps"
            value={form.next_steps ?? ""}
            onChange={(e) => setField("next_steps", e.target.value)}
            placeholder="Planned next actions..."
            rows={2}
          />
        </div>
        {/* Comments */}
        <div className="sm:col-span-2">
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            value={form.comments ?? ""}
            onChange={(e) => setField("comments", e.target.value)}
            placeholder="General comments..."
            rows={2}
          />
        </div>
        {/* Internal Notes */}
        <div className="sm:col-span-2">
          <Label htmlFor="internal_notes">Internal Notes</Label>
          <Textarea
            id="internal_notes"
            value={form.internal_notes ?? ""}
            onChange={(e) => setField("internal_notes", e.target.value)}
            placeholder="Internal team notes (not shared externally)..."
            rows={2}
          />
        </div>
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
            <Landmark className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Investors
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your investor relationships
          </p>
        </div>
        <Button onClick={openAdd} className="w-full sm:w-auto gap-1.5">
          <Plus className="h-4 w-4" />
          Add Investor
        </Button>
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
                  Total Investors
                </p>
                <p className="text-2xl font-bold mt-1">{totalInvestors}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Active
                </p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {activeInvestors}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Follow-up Required
                </p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {followUpRequired}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  In Due Diligence
                </p>
                <p className="text-2xl font-bold mt-1 text-purple-600">
                  {dueDiligence}
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
            placeholder="Search investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-52">
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
        <Select
          value={filterClassification}
          onValueChange={setFilterClassification}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All Classifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classifications</SelectItem>
            {CLASSIFICATIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold">Sr</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Organization
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Investor Name
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Classification
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Last Interaction
                </th>
                <th className="px-4 py-3 text-left font-semibold">Source</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Submitted By
                </th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : investors.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No investors found. Add your first investor to get started.
                  </td>
                </tr>
              ) : (
                investors.map((inv, idx) => (
                  <tr
                    key={inv.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {inv.organization_name}
                    </td>
                    <td className="px-4 py-3">{inv.investor_name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{inv.classification}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.last_interaction_date
                        ? formatDate(inv.last_interaction_date)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.source_of_introduction ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.current_status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.submitted_by ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetail(inv)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(inv)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(inv)}
                          disabled={deletingId === inv.id}
                          title="Delete"
                          className="text-destructive hover:text-destructive"
                        >
                          {deletingId === inv.id ? (
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

      {/* ── Add Dialog ──────────────────────────────────────────────────────── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Investor</DialogTitle>
          </DialogHeader>
          <InvestorForm />
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
              Add Investor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ─────────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Investor</DialogTitle>
          </DialogHeader>
          <InvestorForm />
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
            <DialogTitle>
              {selectedInvestor?.organization_name ?? "Investor Details"}
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : selectedInvestor ? (
            <ScrollArea className="max-h-[60vh] pr-2">
              <div className="space-y-5 text-sm pb-2">
                {/* Status & Classification */}
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selectedInvestor.current_status} />
                  <Badge variant="outline">
                    {selectedInvestor.classification}
                  </Badge>
                </div>

                {/* Core info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailField
                    label="Investor Name"
                    value={selectedInvestor.investor_name}
                  />
                  <DetailField
                    label="Location"
                    value={selectedInvestor.location}
                    icon={<MapPin className="h-3 w-3" />}
                  />
                  <DetailField
                    label="Email"
                    value={selectedInvestor.email}
                    icon={<Mail className="h-3 w-3" />}
                  />
                  <DetailField
                    label="Contact Number"
                    value={selectedInvestor.contact_number}
                    icon={<Phone className="h-3 w-3" />}
                  />
                  <DetailField
                    label="Last Interaction"
                    value={
                      selectedInvestor.last_interaction_date
                        ? formatDate(selectedInvestor.last_interaction_date)
                        : undefined
                    }
                    icon={<Calendar className="h-3 w-3" />}
                  />
                  <DetailField
                    label="Source of Introduction"
                    value={selectedInvestor.source_of_introduction}
                  />
                  <DetailField
                    label="Ticket Size"
                    value={selectedInvestor.ticket_size}
                  />
                  <DetailField
                    label="Geography Preference"
                    value={selectedInvestor.geography_preference}
                  />
                  <DetailField
                    label="Preferred Sectors"
                    value={selectedInvestor.preferred_sectors}
                  />
                  <DetailField
                    label="Submitted By"
                    value={selectedInvestor.submitted_by}
                  />
                </div>

                {/* Long text fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DetailField
                    label="India Related Investments"
                    value={selectedInvestor.india_related_investments}
                    fullWidth
                  />
                  <DetailField
                    label="Investment Thesis"
                    value={selectedInvestor.investment_thesis}
                    fullWidth
                  />
                  <DetailField
                    label="Next Steps"
                    value={selectedInvestor.next_steps}
                    fullWidth
                  />
                  <DetailField
                    label="Comments"
                    value={selectedInvestor.comments}
                    fullWidth
                  />
                  <DetailField
                    label="Internal Notes"
                    value={selectedInvestor.internal_notes}
                    fullWidth
                  />
                </div>
              </div>
            </ScrollArea>
          ) : null}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setDetailOpen(false);
                if (selectedInvestor) openEdit(selectedInvestor);
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
