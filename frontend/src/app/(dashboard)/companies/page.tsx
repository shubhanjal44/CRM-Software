"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Eye, Pencil, Trash2, Building2, FileText, Globe, MapPin, User, FolderOpen, Upload } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const industries = ["Technology", "Healthcare", "Manufacturing", "Financial Services", "Consumer", "Energy", "Real Estate", "Agriculture", "Education", "Logistics"];
const statusList = ["Active", "Under Review", "On Hold", "Archived"];

const mockCompanies = [
  { id: 1, name: "ABC Pharma Ltd", industry: "Healthcare", sector: "Pharmaceuticals", website: "abcpharma.in", location: "Mumbai", description: "Leading API manufacturer with strong export network.", status: "Active", submittedBy: "Admin", date: "2026-05-20", files: 12 },
  { id: 2, name: "TechVista Solutions", industry: "Technology", sector: "SaaS", website: "techvista.io", location: "Bangalore", description: "AI-powered enterprise SaaS for supply chain management.", status: "Active", submittedBy: "Rohan M.", date: "2026-05-15", files: 7 },
  { id: 3, name: "GreenField Energy", industry: "Energy", sector: "Renewables", website: "greenfield.energy", location: "Pune", description: "Solar and wind energy project developer with 500 MW pipeline.", status: "Under Review", submittedBy: "Priya S.", date: "2026-05-08", files: 9 },
  { id: 4, name: "Urban Logistics Co.", industry: "Logistics", sector: "Last-Mile Delivery", website: "urbanlogistics.in", location: "Delhi", description: "Last-mile delivery platform with 50 cities presence.", status: "Active", submittedBy: "Admin", date: "2026-04-22", files: 5 },
  { id: 5, name: "EduTech Academy", industry: "Education", sector: "EdTech", website: "edutech.academy", location: "Chennai", description: "K-12 online learning platform with 2M+ students.", status: "On Hold", submittedBy: "Ankit J.", date: "2026-04-10", files: 3 },
  { id: 6, name: "MediCore Devices", industry: "Healthcare", sector: "Medical Devices", website: "medicore.in", location: "Hyderabad", description: "Medical device manufacturer focused on diagnostics equipment.", status: "Active", submittedBy: "Admin", date: "2026-03-28", files: 15 },
];

const statusColors: Record<string, any> = { "Active": "success", "Under Review": "warning", "On Hold": "info", "Archived": "secondary" };

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filtered = companies.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase())) &&
    (filterIndustry === "all" || c.industry === filterIndustry)
  );

  const handleSave = () => {
    toast.success(editItem ? "Company updated!" : "Company added!");
    setOpen(false); setEditItem(null);
  };
  const handleDelete = (id: number) => { setCompanies(p => p.filter(c => c.id !== id)); toast.success("Company removed"); };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage company profiles and documents</p>
        </div>
        <Button id="add-company-btn" onClick={() => { setEditItem(null); setOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: companies.length, color: "text-violet-500" },
          { label: "Active", value: companies.filter(c => c.status === "Active").length, color: "text-emerald-500" },
          { label: "Under Review", value: companies.filter(c => c.status === "Under Review").length, color: "text-amber-500" },
          { label: "Total Files", value: companies.reduce((a, c) => a + c.files, 0), color: "text-blue-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Building2 className={`w-5 h-5 ${s.color}`} />
              <div><p className={`text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="company-search" placeholder="Search companies..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterIndustry} onValueChange={setFilterIndustry}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Industry" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Sr No", "Company Name", "Industry", "Location", "Submitted By", "Files", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((company, idx) => (
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
                    <td className="px-4 py-3 text-sm">{company.submittedBy}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm text-blue-500 font-medium"><FolderOpen className="w-3.5 h-3.5" />{company.files}</span>
                    </td>
                    <td className="px-4 py-3"><Badge variant={statusColors[company.status]}>{company.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" id={`view-company-${company.id}`}><Eye className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-company-${company.id}`} onClick={() => { setEditItem(company); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-company-${company.id}`} onClick={() => handleDelete(company.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Company" : "Add Company"}</DialogTitle></DialogHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="details">Company Details</TabsTrigger>
              <TabsTrigger value="files">Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2"><Label>Company Name *</Label><Input placeholder="Company name" defaultValue={editItem?.name} /></div>
                <div className="space-y-1.5"><Label>Industry *</Label>
                  <Select defaultValue={editItem?.industry}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Sector</Label><Input placeholder="e.g. SaaS, Pharma" defaultValue={editItem?.sector} /></div>
                <div className="space-y-1.5"><Label>Website</Label><Input placeholder="https://" defaultValue={editItem?.website} /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input placeholder="City, State" defaultValue={editItem?.location} /></div>
                <div className="space-y-1.5 col-span-2"><Label>Description</Label><Textarea placeholder="Company description..." rows={3} defaultValue={editItem?.description} /></div>
                <div className="space-y-1.5"><Label>Current Status</Label>
                  <Select defaultValue={editItem?.status || "Active"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Submitted By</Label><Input placeholder="Your name" defaultValue={editItem?.submittedBy} /></div>
              </div>
            </TabsContent>
            <TabsContent value="files" className="pt-2">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">Upload company documents</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS, PPT, ZIP, Images · Unlimited uploads</p>
                <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
              </div>
              {editItem?.files > 0 && (
                <p className="text-xs text-muted-foreground mt-3 text-center">{editItem.files} files already attached</p>
              )}
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"} Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
