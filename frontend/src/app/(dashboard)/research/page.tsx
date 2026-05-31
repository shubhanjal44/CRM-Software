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
import { Plus, Search, Filter, Eye, Pencil, Trash2, Tag, FileText, Calendar, User, FlaskConical, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const categories = ["Market Research", "Sector Analysis", "Company Deep Dive", "Macro Economics", "Investment Thesis", "Regulatory Update", "Technology Trends", "ESG Research"];
const statuses = ["Draft", "In Review", "Published", "Archived"];

const mockResearch = [
  { id: 1, title: "India Pharma Sector Outlook 2026", category: "Sector Analysis", author: "Rohan Mehta", date: "2026-05-20", status: "Published", description: "Comprehensive analysis of the Indian pharmaceutical sector with focus on generic drug exports and R&D pipelines.", tags: ["Pharma", "Healthcare", "Export"], attachments: 3 },
  { id: 2, title: "EV Ecosystem Mapping – Tier 2 Cities", category: "Market Research", author: "Priya Sharma", date: "2026-05-15", status: "In Review", description: "Deep dive into EV adoption patterns and infrastructure gaps in tier-2 Indian cities.", tags: ["EV", "Mobility", "Infrastructure"], attachments: 5 },
  { id: 3, title: "SEBI Regulatory Changes Q2 2026", category: "Regulatory Update", author: "Admin", date: "2026-05-10", status: "Published", description: "Summary of all major SEBI regulations effective Q2 2026 impacting PE/VC funds.", tags: ["SEBI", "Regulation", "Compliance"], attachments: 2 },
  { id: 4, title: "AI SaaS Investment Thesis India", category: "Investment Thesis", author: "Ankit Joshi", date: "2026-04-28", status: "Draft", description: "Thesis on AI-native SaaS companies targeting Indian enterprise market.", tags: ["AI", "SaaS", "Technology"], attachments: 1 },
  { id: 5, title: "Consumer Retail Rebound Analysis", category: "Market Research", author: "Rohan Mehta", date: "2026-04-15", status: "Published", description: "Post-pandemic consumer spending recovery trends across FMCG and lifestyle segments.", tags: ["Consumer", "Retail", "FMCG"], attachments: 4 },
  { id: 6, title: "Green Energy Fund Landscape India", category: "Sector Analysis", author: "Priya Sharma", date: "2026-03-30", status: "Archived", description: "Overview of PE/VC funds investing in renewable energy sector in India.", tags: ["Green Energy", "ESG", "Infrastructure"], attachments: 6 },
];

const statusColors: Record<string, string> = {
  "Published": "success",
  "In Review": "warning",
  "Draft": "secondary",
  "Archived": "outline",
};

export default function ResearchPage() {
  const [research, setResearch] = useState(mockResearch);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filtered = research.filter(r =>
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.author.toLowerCase().includes(search.toLowerCase())) &&
    (filterCategory === "all" || r.category === filterCategory) &&
    (filterStatus === "all" || r.status === filterStatus)
  );

  const handleDelete = (id: number) => {
    setResearch(prev => prev.filter(r => r.id !== id));
    toast.success("Research deleted successfully");
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setOpen(true);
  };

  const handleSave = () => {
    toast.success(editItem?.id ? "Research updated!" : "Research created!");
    setOpen(false);
    setEditItem(null);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Research</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Research notes, reports, and analysis repository</p>
        </div>
        <Button id="add-research-btn" onClick={() => { setEditItem(null); setOpen(true); }}>
          <Plus className="w-4 h-4" />
          New Research
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: research.length, color: "text-violet-500" },
          { label: "Published", value: research.filter(r => r.status === "Published").length, color: "text-emerald-500" },
          { label: "In Review", value: research.filter(r => r.status === "In Review").length, color: "text-amber-500" },
          { label: "Draft", value: research.filter(r => r.status === "Draft").length, color: "text-muted-foreground" },
        ].map(stat => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <FlaskConical className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="research-search" placeholder="Search by title or author..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48" id="filter-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36" id="filter-status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Research Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="card-hover border-border/50 group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <Badge variant={statusColors[item.status] as any}>{item.status}</Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(item.date)}</span>
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{item.attachments} files</span>
              </div>
              <div className="flex items-center gap-1 pt-3 border-t border-border">
                <Badge variant="outline" className="text-[10px] flex-shrink-0">{item.category}</Badge>
                <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" id={`view-research-${item.id}`}><Eye className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-research-${item.id}`} onClick={() => handleEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" id={`delete-research-${item.id}`} onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Research" : "New Research"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="title">Research Title *</Label>
              <Input id="title" placeholder="Enter research title" defaultValue={editItem?.title} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select defaultValue={editItem?.category}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select defaultValue={editItem?.status || "Draft"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="author">Author *</Label>
                <Input id="author" placeholder="Author name" defaultValue={editItem?.author} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date Created</Label>
                <Input id="date" type="date" defaultValue={editItem?.date || new Date().toISOString().split("T")[0]} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Research description..." rows={4} defaultValue={editItem?.description} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" placeholder="e.g. Pharma, Healthcare, Export" defaultValue={editItem?.tags?.join(", ")} />
            </div>
            <div className="space-y-1.5">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drag & drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, XLS, PPT, Images, ZIP</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Create"} Research</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
