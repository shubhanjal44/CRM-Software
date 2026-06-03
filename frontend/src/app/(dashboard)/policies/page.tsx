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
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Download,
  Archive,
  FileText,
  Calendar,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "HR Policy",
  "IT Policy",
  "Financial Policy",
  "Compliance",
  "Data Privacy",
  "Investment Policy",
  "Operational Policy",
  "Legal",
];

type CategoryColor =
  | "purple"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "secondary"
  | "outline";

const CATEGORY_COLOR: Record<string, CategoryColor> = {
  "Investment Policy": "purple",
  "Data Privacy": "info",
  "HR Policy": "success",
  "IT Policy": "warning",
  Compliance: "destructive",
  "Financial Policy": "secondary",
  Legal: "outline",
  "Operational Policy": "secondary",
};

// Map semantic color names to Tailwind classes
const CATEGORY_BADGE_CLASS: Record<string, string> = {
  "Investment Policy":
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  "Data Privacy":
    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400",
  "HR Policy":
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  "IT Policy":
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
  Compliance:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  "Financial Policy":
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400",
  Legal:
    "bg-background text-foreground border-border",
  "Operational Policy":
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface PolicyItem {
  id: string;
  name: string;
  category: string;
  effective_date?: string;
  version: string;
  uploaded_by: string;
  archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FormState {
  name: string;
  category: string;
  effective_date: string;
  version: string;
  uploaded_by: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  category: "",
  effective_date: "",
  version: "1.0",
  uploaded_by: "",
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card animate-pulse">
      <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="h-3 w-32 rounded bg-muted" />
      </div>
      <div className="hidden sm:flex gap-2 items-center">
        <div className="h-5 w-20 rounded-full bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="flex gap-1">
        <div className="h-7 w-7 rounded bg-muted" />
        <div className="h-7 w-7 rounded bg-muted" />
        <div className="h-7 w-7 rounded bg-muted" />
      </div>
    </div>
  );
}

// ─── Policy Row Card ──────────────────────────────────────────────────────────

interface PolicyRowProps {
  item: PolicyItem;
  onEdit: (item: PolicyItem) => void;
  onDelete: (item: PolicyItem) => void;
  onView: (item: PolicyItem) => void;
  onArchive: (item: PolicyItem) => void;
  archiving: string | null;
}

function PolicyRow({
  item,
  onEdit,
  onDelete,
  onView,
  onArchive,
  archiving,
}: PolicyRowProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-sm transition-all duration-200 ${
        item.archived ? "opacity-70" : ""
      }`}
    >
      {/* PDF Icon */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-sm truncate">{item.name}</span>
            <Badge variant="outline" className="text-xs shrink-0">
              v{item.version}
            </Badge>
            {item.archived && (
              <Badge variant="secondary" className="text-xs shrink-0">
                Archived
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
            {item.effective_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Effective {formatDate(item.effective_date)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.uploaded_by}
            </span>
          </div>
        </div>
      </div>

      {/* Category badge */}
      <div className="flex items-center gap-2 sm:ml-auto">
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
            CATEGORY_BADGE_CLASS[item.category] ?? "bg-muted text-muted-foreground border-border"
          }`}
        >
          {item.category}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:flex-shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onView(item)}
          title="View"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          title="Download"
          onClick={() => toast.info("Download not implemented.")}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onEdit(item)}
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className={`h-8 w-8 ${item.archived ? "text-primary" : "text-muted-foreground"}`}
          onClick={() => onArchive(item)}
          title={item.archived ? "Unarchive" : "Archive"}
          disabled={archiving === item.id}
        >
          {archiving === item.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(item)}
          title="Delete"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PoliciesPage() {
  const [items, setItems] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [archiving, setArchiving] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PolicyItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<PolicyItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // View dialog
  const [viewItem, setViewItem] = useState<PolicyItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        archived: String(showArchived),
      };
      if (search) params.search = search;
      if (filterCategory && filterCategory !== "all")
        params.category = filterCategory;

      const res = await api.get("/policies", { params });
      setItems(res.data?.data ?? res.data ?? []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load policies.");
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, showArchived]);

  useEffect(() => {
    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [fetchItems]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const allItems = items; // items already filtered by archived on server
  const activeCount = items.filter((i) => !i.archived).length;
  const archivedCount = items.filter((i) => i.archived).length;
  const distinctCategories = new Set(items.map((i) => i.category)).size;

  // ── Dialog helpers ─────────────────────────────────────────────────────────

  function openCreate() {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(item: PolicyItem) {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      effective_date: item.effective_date?.slice(0, 10) ?? "",
      version: item.version,
      uploaded_by: item.uploaded_by,
    });
    setDialogOpen(true);
  }

  function openView(item: PolicyItem) {
    setViewItem(item);
    setViewDialogOpen(true);
  }

  function openDelete(item: PolicyItem) {
    setDeleteTarget(item);
    setDeleteDialogOpen(true);
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Policy name is required.");
      return;
    }
    if (!form.category) {
      toast.error("Category is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      effective_date: form.effective_date || undefined,
      version: form.version.trim(),
      uploaded_by: form.uploaded_by.trim(),
    };

    setSaving(true);
    try {
      if (editingItem) {
        await api.put(`/policies/${editingItem.id}`, payload);
        toast.success("Policy updated.");
      } else {
        await api.post("/policies", payload);
        toast.success("Policy created.");
      }
      setDialogOpen(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/policies/${deleteTarget.id}`);
      toast.success("Policy deleted.");
      setDeleteDialogOpen(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  // ── Archive Toggle ─────────────────────────────────────────────────────────

  async function handleArchive(item: PolicyItem) {
    setArchiving(item.id);
    try {
      await api.put(`/policies/${item.id}/archive`);
      toast.success(item.archived ? "Policy unarchived." : "Policy archived.");
      fetchItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Archive action failed.");
    } finally {
      setArchiving(null);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Policies
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage company policies, compliance documents, and guidelines.
          </p>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={() => setShowArchived((v) => !v)}
            className="w-full sm:w-auto"
          >
            <Archive className="h-4 w-4 mr-2" />
            {showArchived ? "Showing Archived" : "Show Archived"}
          </Button>
          <Button onClick={openCreate} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Policies", value: allItems.length, color: "text-foreground" },
          { label: "Active", value: activeCount, color: "text-emerald-600" },
          { label: "Archived", value: archivedCount, color: "text-slate-500" },
          { label: "Categories", value: distinctCategories, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <CardContent className="p-0">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Policy List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <ShieldCheck className="h-10 w-10 opacity-30" />
          <p className="font-medium">
            {showArchived ? "No archived policies." : "No active policies found."}
          </p>
          <p className="text-sm">
            {showArchived
              ? "All policies are currently active."
              : "Try adjusting your filters or create a new policy."}
          </p>
          {!showArchived && (
            <Button variant="outline" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <PolicyRow
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDelete={openDelete}
              onView={openView}
              onArchive={handleArchive}
              archiving={archiving}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Policy" : "New Policy"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 px-6 py-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="p-name">Policy Name *</Label>
              <Input
                id="p-name"
                placeholder="e.g. Data Privacy Policy"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Category + Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger id="p-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-version">Version</Label>
                <Input
                  id="p-version"
                  placeholder="e.g. 1.0"
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                />
              </div>
            </div>

            {/* Effective Date + Uploaded By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="p-date">Effective Date</Label>
                <Input
                  id="p-date"
                  type="date"
                  value={form.effective_date}
                  onChange={(e) =>
                    setForm({ ...form, effective_date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-uploaded-by">Uploaded By</Label>
                <Input
                  id="p-uploaded-by"
                  placeholder="Name or team"
                  value={form.uploaded_by}
                  onChange={(e) =>
                    setForm({ ...form, uploaded_by: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingItem ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
          {viewItem && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{viewItem.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 px-6 py-2">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                      CATEGORY_BADGE_CLASS[viewItem.category] ??
                      "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {viewItem.category}
                  </span>
                  <Badge variant="outline">v{viewItem.version}</Badge>
                  {viewItem.archived && (
                    <Badge variant="secondary">Archived</Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{viewItem.uploaded_by || "Unknown"}</span>
                  </div>
                  {viewItem.effective_date && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Effective {formatDate(viewItem.effective_date)}</span>
                    </div>
                  )}
                  {viewItem.created_at && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Uploaded {formatDate(viewItem.created_at)}</span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewDialogOpen(false);
                    openEdit(viewItem);
                  }}
                  className="w-full sm:w-auto"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => setViewDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delete Policy</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground px-6 py-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{deleteTarget?.name}"
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
