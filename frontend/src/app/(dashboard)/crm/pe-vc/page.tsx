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

const stages = [
  "Pre-Seed", "Seed", "Series A", "Series B",
  "Growth", "Late Stage", "Buyout", "Special Situations",
];

const stageColors: Record<string, any> = {
  "Pre-Seed": "secondary",
  "Seed": "info",
  "Series A": "purple",
  "Series B": "warning",
  "Growth": "success",
  "Late Stage": "success",
  "Buyout": "destructive",
  "Special Situations": "outline",
};

const emptyForm = {
  organization_name: "",
  met_date: "",
  person_met: "",
  stage_of_investment: "",
  location: "",
  contact_number: "",
  email: "",
  fund_size: "",
  focus_sector: "",
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

export default function PeVcPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/pe-vc", { params: { search, stage: filterStage === "all" ? "" : filterStage } });
      setItems(res.data.data ?? res.data);
    } catch {
      toast.error("Failed to load PE/VC data");
    } finally {
      setLoading(false);
    }
  }, [search, filterStage]);

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
      organization_name: item.organization_name ?? "",
      met_date: item.met_date ?? "",
      person_met: item.person_met ?? "",
      stage_of_investment: item.stage_of_investment ?? "",
      location: item.location ?? "",
      contact_number: item.contact_number ?? "",
      email: item.email ?? "",
      fund_size: item.fund_size ?? "",
      focus_sector: item.focus_sector ?? "",
      notes: item.notes ?? "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.organization_name.trim()) {
      toast.error("Organization name is required");
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/pe-vc/${editItem.id}`, form);
        toast.success("PE/VC contact updated!");
      } else {
        await api.post("/pe-vc", form);
        toast.success("PE/VC contact added!");
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
    if (!confirm("Delete this PE/VC contact?")) return;
    try {
      await api.delete(`/pe-vc/${id}`);
      toast.success("Removed");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const setField = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const earlyStage = items.filter((i) =>
    ["Pre-Seed", "Seed", "Series A"].includes(i.stage_of_investment)
  ).length;
  const growthBuyout = items.filter((i) =>
    ["Growth", "Buyout", "Late Stage"].includes(i.stage_of_investment)
  ).length;
  const seriesB = items.filter((i) => i.stage_of_investment === "Series B").length;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">PE / VC</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Private equity and venture capital contacts</p>
        </div>
        <Button id="add-pevc-btn" onClick={openAdd} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add PE/VC
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Funds", value: items.length, color: "text-violet-500" },
          { label: "Early Stage", value: earlyStage, color: "text-blue-500" },
          { label: "Growth/Buyout", value: growthBuyout, color: "text-emerald-500" },
          { label: "Series B+", value: seriesB, color: "text-amber-500" },
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
              id="pevc-search"
              placeholder="Search PE/VC..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Sr", "Organization", "Person Met", "Met Date", "Stage", "Fund Size", "Focus Sector", "Submitted By", "Actions"].map((h) => (
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
                        No PE/VC contacts found.
                      </td>
                    </tr>
                  )
                  : items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{item.organization_name}</p>
                          {item.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />{item.location}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm">{item.person_met}</p>
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="text-xs text-blue-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />{item.email}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(item.met_date)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={stageColors[item.stage_of_investment] ?? "outline"}>
                          {item.stage_of_investment}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-500">{item.fund_size}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-36 truncate">{item.focus_sector}</td>
                      <td className="px-4 py-3 text-sm">{item.submitted_by}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-pevc-${item.id}`} onClick={() => openEdit(item)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-pevc-${item.id}`} onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editItem ? "Edit" : "Add"} PE/VC Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-6 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Organization Name *</Label>
                <Input value={form.organization_name} onChange={(e) => setField("organization_name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Met Date</Label>
                <Input type="date" value={form.met_date} onChange={(e) => setField("met_date", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Person Met</Label>
                <Input value={form.person_met} onChange={(e) => setField("person_met", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Stage of Investment</Label>
                <Select value={form.stage_of_investment} onValueChange={(v) => setField("stage_of_investment", v)}>
                  <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setField("location", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Number</Label>
                <Input value={form.contact_number} onChange={(e) => setField("contact_number", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Fund Size</Label>
                <Input placeholder="$500M" value={form.fund_size} onChange={(e) => setField("fund_size", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Focus Sector</Label>
                <Input placeholder="Technology, Healthcare..." value={form.focus_sector} onChange={(e) => setField("focus_sector", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Notes</Label>
                <Textarea rows={3} value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto" disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} className="w-full sm:w-auto" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              {editItem ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
