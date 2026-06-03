"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2, Mail, MapPin, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

const emptyForm = {
  individual_name: "",
  interaction_date: "",
  source_of_introduction: "",
  previous_organization: "",
  current_organization: "",
  designation: "",
  contact_number: "",
  email: "",
  notes: "",
};

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-border/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function TalentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/talent", { params: { search } });
      setItems(res.data.data ?? res.data);
    } catch {
      toast.error("Failed to load talent data");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      individual_name: item.individual_name ?? "",
      interaction_date: item.interaction_date ?? "",
      source_of_introduction: item.source_of_introduction ?? "",
      previous_organization: item.previous_organization ?? "",
      current_organization: item.current_organization ?? "",
      designation: item.designation ?? "",
      contact_number: item.contact_number ?? "",
      email: item.email ?? "",
      notes: item.notes ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.individual_name.trim()) {
      toast.error("Individual name is required");
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/talent/${editItem.id}`, form);
        toast.success("Talent contact updated!");
      } else {
        await api.post("/talent", form);
        toast.success("Talent resource added!");
      }
      setOpen(false);
      setEditItem(null);
      fetchData();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this talent contact?")) return;
    try {
      await api.delete(`/talent/${id}`);
      toast.success("Talent resource removed");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const setField = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const linkedInCount = items.filter((i) =>
    (i.source_of_introduction ?? "").toLowerCase() === "linkedin"
  ).length;
  const referralCount = items.filter((i) =>
    (i.source_of_introduction ?? "").toLowerCase() === "referral"
  ).length;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Talent Resources</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track professional contacts and talent network</p>
        </div>
        <Button id="add-talent-btn" onClick={openAdd} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Contact
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { label: "Total Contacts", value: items.length, color: "text-violet-500" },
          { label: "LinkedIn Sources", value: linkedInCount, color: "text-blue-500" },
          { label: "Referrals", value: referralCount, color: "text-emerald-500" },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="talent-search"
              placeholder="Search by name or organization..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Sr", "Individual Name", "Designation", "Interaction Date", "Source", "Previous Org", "Current Org", "Submitted By", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={9} />)
                  : items.length === 0
                  ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No talent contacts found.
                      </td>
                    </tr>
                  )
                  : items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{item.individual_name}</p>
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />{item.email}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.designation}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(item.interaction_date)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px]">{item.source_of_introduction}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{item.previous_organization}</td>
                      <td className="px-4 py-3 text-sm">{item.current_organization}</td>
                      <td className="px-4 py-3 text-sm">{item.submitted_by}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-talent-${item.id}`} onClick={() => openEdit(item)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-talent-${item.id}`} onClick={() => handleDelete(item.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Contact" : "Add Talent Resource"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-6 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Individual Name *</Label>
                <Input placeholder="Full name" value={form.individual_name} onChange={(e) => setField("individual_name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Interaction Date</Label>
                <Input type="date" value={form.interaction_date} onChange={(e) => setField("interaction_date", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Source of Introduction</Label>
                <Input placeholder="LinkedIn, Referral..." value={form.source_of_introduction} onChange={(e) => setField("source_of_introduction", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Previous Organization</Label>
                <Input placeholder="Previous company" value={form.previous_organization} onChange={(e) => setField("previous_organization", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Current Organization</Label>
                <Input placeholder="Current company" value={form.current_organization} onChange={(e) => setField("current_organization", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Designation</Label>
                <Input placeholder="Job title" value={form.designation} onChange={(e) => setField("designation", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Number</Label>
                <Input placeholder="+91 XXXXX XXXXX" value={form.contact_number} onChange={(e) => setField("contact_number", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@org.com" value={form.email} onChange={(e) => setField("email", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes..." rows={3} value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto" disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} className="w-full sm:w-auto" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {editItem ? "Update" : "Add"} Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
