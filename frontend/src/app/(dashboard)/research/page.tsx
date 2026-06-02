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
  Trash2,
  Tag,
  FileText,
  Calendar,
  User,
  FlaskConical,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Market Research",
  "Sector Analysis",
  "Company Deep Dive",
  "Macro Economics",
  "Investment Thesis",
  "Regulatory Update",
  "Technology Trends",
  "ESG Research",
];

const STATUSES = ["Draft", "In Review", "Published", "Archived"];

const STATUS_VARIANT: Record<
  string,
  "success" | "warning" | "secondary" | "outline"
> = {
  Published: "success",
  "In Review": "warning",
  Draft: "secondary",
  Archived: "outline",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResearchItem {
  id: string;
  title: string;
  category: string;
  author: string;
  description: string;
  status: string;
  tags: string[];
  version: string;
  attachments?: number;
  created_at?: string;
  updated_at?: string;
}

interface FormState {
  title: string;
  category: string;
  author: string;
  description: string;
  status: string;
  tags: string; // comma-separated input
  version: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  category: "",
  author: "",
  description: "",
  status: "Draft",
  tags: "",
  version: "1.0",
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 rounded-full bg-muted" />
        <div className="h-4 w-16 rounded bg-muted" />
      </div>
      <div className="h-5 w-3/4 rounded bg-muted" />
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-5/6 rounded bg-muted" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-14 rounded-full bg-muted" />
        <div className="h-5 w-14 rounded-full bg-muted" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
    </div>
  );
}

// ─── Research Card ────────────────────────────────────────────────────────────

interface ResearchCardProps {
  item: ResearchItem;
  onEdit: (item: ResearchItem) => void;
  onDelete: (item: ResearchItem) => void;
  onView: (item: ResearchItem) => void;
}

function ResearchCard({ item, onEdit, onDelete, onView }: ResearchCardProps) {
  return (
    <div className="group relative rounded-xl border bg-card hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top accent bar */}
      <div
        className={`h-1 w-full ${
          item.status === "Published"
            ? "bg-emerald-500"
            : item.status === "In Review"
            ? "bg-amber-500"
            : item.status === "Draft"
            ? "bg-slate-400"
            : "bg-slate-200"
        }`}
      />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <Badge variant={STATUS_VARIANT[item.status] ?? "secondary"}>
            {item.status}
          </Badge>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            v{item.version}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
          {item.description || "No description provided."}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag.trim()}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{item.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.author}
            </span>
            {item.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(item.created_at)}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {item.attachments ?? 0} files
          </span>
        </div>

        {/* Category badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>

          {/* Action buttons – always visible on mobile, hover on desktop */}
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => onView(item)}
              title="View"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => onEdit(item)}
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(item)}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<ResearchItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // View dialog
  const [viewItem, setViewItem] = useState<ResearchItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filterCategory && filterCategory !== "all")
        params.category = filterCategory;
      if (filterStatus && filterStatus !== "all")
        params.status = filterStatus;

      const res = await api.get("/research", { params });
      setItems(res.data?.data ?? res.data ?? []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load research items.");
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, filterStatus]);

  useEffect(() => {
    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [fetchItems]);

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = {
    total: items.length,
    published: items.filter((i) => i.status === "Published").length,
    inReview: items.filter((i) => i.status === "In Review").length,
    draft: items.filter((i) => i.status === "Draft").length,
  };

  // ── Dialog helpers ─────────────────────────────────────────────────────────

  function openCreate() {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(item: ResearchItem) {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      author: item.author,
      description: item.description,
      status: item.status,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      version: item.version,
    });
    setDialogOpen(true);
  }

  function openView(item: ResearchItem) {
    setViewItem(item);
    setViewDialogOpen(true);
  }

  function openDelete(item: ResearchItem) {
    setDeleteTarget(item);
    setDeleteDialogOpen(true);
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!form.category) {
      toast.error("Category is required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      author: form.author.trim(),
      description: form.description.trim(),
      status: form.status,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      version: form.version.trim(),
    };

    setSaving(true);
    try {
      if (editingItem) {
        await api.put(`/research/${editingItem.id}`, payload);
        toast.success("Research item updated.");
      } else {
        await api.post("/research", payload);
        toast.success("Research item created.");
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
      await api.delete(`/research/${deleteTarget.id}`);
      toast.success("Research item deleted.");
      setDeleteDialogOpen(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            Research
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage research reports, analyses, and investment theses.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Research
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Published", value: stats.published, color: "text-emerald-600" },
          { label: "In Review", value: stats.inReview, color: "text-amber-600" },
          { label: "Draft", value: stats.draft, color: "text-slate-500" },
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
            placeholder="Search research..."
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[160px]">
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
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <FlaskConical className="h-10 w-10 opacity-30" />
          <p className="font-medium">No research items found.</p>
          <p className="text-sm">Try adjusting your filters or create a new item.</p>
          <Button variant="outline" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Research
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <ResearchCard
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDelete={openDelete}
              onView={openView}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Research Item" : "New Research Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="r-title">Title *</Label>
              <Input
                id="r-title"
                placeholder="Research title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="r-category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger id="r-category">
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
                <Label htmlFor="r-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger id="r-status">
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
            </div>

            {/* Author + Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="r-author">Author</Label>
                <Input
                  id="r-author"
                  placeholder="Author name"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="r-version">Version</Label>
                <Input
                  id="r-version"
                  placeholder="e.g. 1.0"
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="r-description">Description</Label>
              <Textarea
                id="r-description"
                placeholder="Brief description of the research..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label htmlFor="r-tags">
                Tags{" "}
                <span className="text-muted-foreground font-normal">
                  (comma-separated)
                </span>
              </Label>
              <Input
                id="r-tags"
                placeholder="e.g. India, Equity, Fintech"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
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
                <DialogTitle className="pr-6">{viewItem.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={STATUS_VARIANT[viewItem.status] ?? "secondary"}>
                    {viewItem.status}
                  </Badge>
                  <Badge variant="outline">{viewItem.category}</Badge>
                  <span className="text-xs text-muted-foreground self-center">
                    v{viewItem.version}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{viewItem.author || "Unknown"}</span>
                  </div>
                  {viewItem.created_at && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(viewItem.created_at)}</span>
                    </div>
                  )}
                </div>

                {viewItem.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {viewItem.description}
                  </p>
                )}

                {viewItem.tags && viewItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {viewItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-0.5 rounded-full text-muted-foreground"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
            <DialogTitle>Delete Research Item</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{deleteTarget?.title}"
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
