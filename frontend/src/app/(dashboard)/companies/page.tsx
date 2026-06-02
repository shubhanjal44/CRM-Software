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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Eye, Pencil, Trash2, Building2, MapPin, FolderOpen, Upload, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

const industries = ["Technology", "Healthcare", "Manufacturing", "Financial Services", "Consumer", "Energy", "Real Estate", "Agriculture", "Education", "Logistics"];
const statusList = ["Active", "Under Review", "On Hold", "Archived"];
const statusColors: Record<string, any> = { "Active": "success", "Under Review": "warning", "On Hold": "info", "Archived": "secondary" };

interface Company {
  id: number; name: string; industry: string; sector: string; website: string;
  location: string; description: string; current_status: string; submitted_by: string;
  date_added: string; attachments?: any[];
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3"><div className="h-4 rounded shimmer" /></td>
      ))}
    </tr>
  );
}

export default function CompaniesPage() {
  const [companies, setCompanies]   = useState<Company[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [open, setOpen]             = useState(false);
  const [viewItem, setViewItem]     = useState<Company | null>(null);
  const [editItem, setEditItem]     = useState<Company | null>(null);
  const [saving, setSaving]         = useState(false);
  const [form, setForm]             = useState({ name: "", industry: "", sector: "", website: "", location: "", description: "", current_status: "Active" });

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterIndustry !== "all") params.set("industry", filterIndustry);
      const res = await api.get<{ data: Company[] }>(`/companies?${params}`);
      setCompanies(res.data.data);
    } catch { toast.error("Failed to load companies"); }
    finally { setLoading(false); }
  }, [search, filterIndustry]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const openAdd = () => { setEditItem(null); setForm({ name: "", industry: "", sector: "", website: "", location: "", description: "", current_status: "Active" }); setOpen(true); };
  const openEdit = (c: Company) => { setEditItem(c); setForm({ name: c.name, industry: c.industry ?? "", sector: c.sector ?? "", website: c.website ?? "", location: c.location ?? "", description: c.description ?? "", current_status: c.current_status }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Company name is required"); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/companies/${editItem.id}`, form);
        toast.success("Company updated!");
      } else {
        await api.post("/companies", form);
        toast.success("Company added!");
      }
      setOpen(false);
      fetchCompanies();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this company?")) return;
    try { await api.delete(`/companies/${id}`); toast.success("Company removed"); fetchCompanies(); }
    catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="space-y-4 sm:space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Companies Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage company profiles and documents</p>
        </div>
        <Button id="add-company-btn" onClick={openAdd} className="w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: companies.length, color: "text-violet-500" },
          { label: "Active", value: companies.filter(c => c.current_status === "Active").length, color: "text-emerald-500" },
          { label: "Under Review", value: companies.filter(c => c.current_status === "Under Review").length, color: "text-amber-500" },
          { label: "Total Files", value: companies.reduce((a, c) => a + (c.attachments?.length ?? 0), 0), color: "text-blue-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3">
              <Building2 className={`w-5 h-5 flex-shrink-0 ${s.color}`} />
              <div><p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="company-search" placeholder="Search companies..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterIndustry} onValueChange={setFilterIndustry}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder="Industry" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table — scrollable on mobile */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["#", "Company", "Industry", "Location", "Submitted By", "Files", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                ) : companies.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground text-sm">No companies found</td></tr>
                ) : (
                  companies.map((company, idx) => (
                    <tr key={company.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{company.name}</p>
                          <p className="text-xs text-muted-foreground">{company.sector}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{company.industry}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" />{company.location}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{company.submitted_by}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-sm text-blue-500 font-medium"><FolderOpen className="w-3.5 h-3.5" />{company.attachments?.length ?? 0}</span>
                      </td>
                      <td className="px-4 py-3"><Badge variant={statusColors[company.current_status]}>{company.current_status}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" id={`view-company-${company.id}`} onClick={() => setViewItem(company)}><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-company-${company.id}`} onClick={() => openEdit(company)}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-company-${company.id}`} onClick={() => handleDelete(company.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      {viewItem && (
        <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
          <DialogContent className="max-w-lg w-[95vw]">
            <DialogHeader><DialogTitle>{viewItem.name}</DialogTitle></DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Industry</p><p className="font-medium">{viewItem.industry}</p></div>
                <div><p className="text-xs text-muted-foreground">Sector</p><p className="font-medium">{viewItem.sector}</p></div>
                <div><p className="text-xs text-muted-foreground">Location</p><p className="font-medium">{viewItem.location}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><Badge variant={statusColors[viewItem.current_status]}>{viewItem.current_status}</Badge></div>
              </div>
              {viewItem.description && <div><p className="text-xs text-muted-foreground mb-1">Description</p><p className="text-sm">{viewItem.description}</p></div>}
              {viewItem.website && <div><p className="text-xs text-muted-foreground">Website</p><a href={viewItem.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">{viewItem.website}</a></div>}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Company" : "Add Company"}</DialogTitle></DialogHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="details">Company Details</TabsTrigger>
              <TabsTrigger value="files">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 sm:col-span-2"><Label>Company Name *</Label><Input placeholder="Company name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Industry *</Label>
                  <Select value={form.industry} onValueChange={v => setForm(f => ({ ...f, industry: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Sector</Label><Input placeholder="e.g. SaaS, Pharma" value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Website</Label><Input placeholder="https://" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input placeholder="City, State" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
                <div className="space-y-1.5 sm:col-span-2"><Label>Description</Label><Textarea placeholder="Company description..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>Status</Label>
                  <Select value={form.current_status} onValueChange={v => setForm(f => ({ ...f, current_status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="files" className="pt-2">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Upload company documents</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS, PPT, ZIP, Images</p>
                <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editItem ? "Update" : "Add"} Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
