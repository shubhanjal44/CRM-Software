"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Pencil, Trash2, Download, Archive, FileText, Calendar, User, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const policyCategories = ["HR Policy", "IT Policy", "Financial Policy", "Compliance", "Data Privacy", "Investment Policy", "Operational Policy", "Legal"];

const mockPolicies = [
  { id: 1, name: "Investment Decision Framework 2026", category: "Investment Policy", effectiveDate: "2026-01-01", uploadedBy: "Admin", version: "v3.2", archived: false, size: "1.2 MB" },
  { id: 2, name: "Data Privacy & GDPR Compliance", category: "Data Privacy", effectiveDate: "2026-03-15", uploadedBy: "Admin", version: "v2.0", archived: false, size: "890 KB" },
  { id: 3, name: "Employee Code of Conduct", category: "HR Policy", effectiveDate: "2025-07-01", uploadedBy: "Priya S.", version: "v4.1", archived: false, size: "540 KB" },
  { id: 4, name: "IT Security & Access Policy", category: "IT Policy", effectiveDate: "2026-02-01", uploadedBy: "Admin", version: "v1.5", archived: false, size: "720 KB" },
  { id: 5, name: "Anti-Money Laundering Policy", category: "Compliance", effectiveDate: "2025-10-01", uploadedBy: "Admin", version: "v2.3", archived: false, size: "1.1 MB" },
  { id: 6, name: "Travel & Expense Policy 2024", category: "Financial Policy", effectiveDate: "2024-04-01", uploadedBy: "Rohan M.", version: "v1.0", archived: true, size: "380 KB" },
];

const categoryColors: Record<string, any> = {
  "Investment Policy": "purple", "Data Privacy": "info", "HR Policy": "success",
  "IT Policy": "warning", "Compliance": "destructive", "Financial Policy": "secondary",
  "Legal": "outline", "Operational Policy": "secondary"
};

export default function PoliciesPage() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filtered = policies.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "all" || p.category === filterCategory) &&
    (showArchived ? p.archived : !p.archived)
  );

  const handleArchive = (id: number) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, archived: !p.archived } : p));
    toast.success("Policy archive status updated");
  };
  const handleSave = () => { toast.success(editItem ? "Policy updated!" : "Policy uploaded!"); setOpen(false); setEditItem(null); };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Policies</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Organizational policies and compliance documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowArchived(!showArchived)}>
            <Archive className="w-4 h-4" />{showArchived ? "Active" : "Archived"}
          </Button>
          <Button id="add-policy-btn" onClick={() => { setEditItem(null); setOpen(true); }}>
            <Plus className="w-4 h-4" />Upload Policy
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Policies", value: policies.length, color: "text-violet-500" },
          { label: "Active", value: policies.filter(p => !p.archived).length, color: "text-emerald-500" },
          { label: "Archived", value: policies.filter(p => p.archived).length, color: "text-muted-foreground" },
          { label: "Categories", value: [...new Set(policies.map(p => p.category))].length, color: "text-blue-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <ShieldCheck className={`w-5 h-5 ${s.color}`} />
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
            <Input id="policy-search" placeholder="Search policies..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {policyCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Policy List */}
      <div className="space-y-3">
        {filtered.map((policy) => (
          <Card key={policy.id} className="border-border/50 card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-sm">{policy.name}</h3>
                    <Badge variant="outline" className="text-[10px]">{policy.version}</Badge>
                    {policy.archived && <Badge variant="secondary" className="text-[10px]">Archived</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Effective: {formatDate(policy.effectiveDate)}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{policy.uploadedBy}</span>
                    <span>{policy.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={categoryColors[policy.category] || "secondary"}>{policy.category}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" id={`download-policy-${policy.id}`}><Download className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" id={`edit-policy-${policy.id}`} onClick={() => { setEditItem(policy); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" id={`archive-policy-${policy.id}`} onClick={() => handleArchive(policy.id)}><Archive className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editItem ? "Edit Policy" : "Upload Policy"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Policy Name *</Label><Input placeholder="Policy name" defaultValue={editItem?.name} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Category *</Label>
                <Select defaultValue={editItem?.category}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{policyCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Effective Date</Label><Input type="date" defaultValue={editItem?.effectiveDate} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Version</Label><Input placeholder="e.g. v1.0" defaultValue={editItem?.version} /></div>
              <div className="space-y-1.5"><Label>Uploaded By</Label><Input placeholder="Your name" defaultValue={editItem?.uploadedBy} /></div>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload policy document</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Upload"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
