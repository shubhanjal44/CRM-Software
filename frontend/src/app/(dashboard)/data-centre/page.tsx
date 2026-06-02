"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, FileText, Building2, Landmark, FlaskConical, ShieldCheck, TrendingUp, Briefcase, UsersRound, Database, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

const categories = [
  { key: "all",            label: "All Documents",  icon: Database },
  { key: "companies",      label: "Companies",      icon: Building2 },
  { key: "investors",      label: "Investors",      icon: Landmark },
  { key: "research",       label: "Research",       icon: FlaskConical },
  { key: "policies",       label: "Policies",       icon: ShieldCheck },
  { key: "pevc",           label: "PE/VC",          icon: TrendingUp },
  { key: "talent",         label: "Talent",         icon: Briefcase },
  { key: "intermediaries", label: "Intermediaries", icon: UsersRound },
];

const typeColors: Record<string, string> = {
  "PDF":  "text-red-500 bg-red-500/10",
  "DOCX": "text-blue-500 bg-blue-500/10",
  "XLSX": "text-emerald-500 bg-emerald-500/10",
  "PPTX": "text-orange-500 bg-orange-500/10",
  "ZIP":  "text-amber-500 bg-amber-500/10",
};

interface DocFile {
  id: number; file_name: string; file_path: string; file_size: string;
  file_type: string; uploaded_by: string; created_at: string;
  category: string; entity_name: string;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      {Array.from({ length: 7 }).map((_, i) => <td key={i} className="px-4 py-3"><div className="h-4 rounded shimmer" /></td>)}
    </tr>
  );
}

export default function DataCentrePage() {
  const [docs, setDocs]                 = useState<DocFile[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected]         = useState<number[]>([]);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeCategory !== "all") params.set("type", activeCategory);
      const res = await api.get<{ data: DocFile[]; total: number }>(`/data-centre?${params}`);
      setDocs(res.data.data);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to load documents");
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const toggleSelect = (id: number) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = (checked: boolean) =>
    setSelected(checked ? docs.map(d => d.id) : []);

  const categoryCounts: Record<string, number> = { all: total };
  docs.forEach(d => { categoryCounts[d.category] = (categoryCounts[d.category] ?? 0) + 1; });

  return (
    <div className="space-y-4 sm:space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Data Centre</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Central repository for all documents and files</p>
        </div>
        {selected.length > 0 && (
          <Button variant="outline" id="bulk-download-btn" className="w-full sm:w-auto">
            <Download className="w-4 h-4" />Bulk Download ({selected.length})
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Documents", value: total, color: "text-violet-500" },
          { label: "Categories", value: categories.length - 1, color: "text-blue-500" },
          { label: "Selected", value: selected.length, color: "text-emerald-500" },
          { label: "This Session", value: docs.length, color: "text-amber-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3">
              <Database className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${s.color}`} />
              <div><p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Category sidebar — horizontal scroll on mobile */}
        <Card className="border-border/50 lg:w-52 flex-shrink-0">
          <CardContent className="p-2">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  id={`cat-${cat.key}`}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all whitespace-nowrap lg:w-full ${
                    activeCategory === cat.key
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 text-left">{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {cat.key === "all" ? total : (categoryCounts[cat.key] ?? 0)}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document list */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="datacentre-search" placeholder="Search documents, entities..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="w-10 px-4 py-3">
                        <input type="checkbox" className="rounded" onChange={e => toggleAll(e.target.checked)} checked={selected.length === docs.length && docs.length > 0} />
                      </th>
                      {["File Name", "Category", "Entity", "Type", "Size", "Uploaded By", "Date", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : docs.length === 0 ? (
                      <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground text-sm">No documents found</td></tr>
                    ) : (
                      docs.map(doc => (
                        <tr key={doc.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${selected.includes(doc.id) ? "bg-primary/5" : ""}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox" className="rounded" checked={selected.includes(doc.id)} onChange={() => toggleSelect(doc.id)} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${typeColors[doc.file_type] ?? "text-muted-foreground bg-muted"}`}>
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                              <p className="text-sm font-medium max-w-40 truncate">{doc.file_name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3"><Badge variant="outline" className="text-[10px] capitalize">{categories.find(c => c.key === doc.category)?.label ?? doc.category}</Badge></td>
                          <td className="px-4 py-3 text-sm text-muted-foreground max-w-32 truncate">{doc.entity_name}</td>
                          <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[doc.file_type] ?? "text-muted-foreground bg-muted"}`}>{doc.file_type}</span></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{doc.file_size}</td>
                          <td className="px-4 py-3 text-sm">{doc.uploaded_by}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(doc.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" id={`preview-doc-${doc.id}`}><Eye className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" id={`download-doc-${doc.id}`}><Download className="w-3.5 h-3.5" /></Button>
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
        </div>
      </div>
    </div>
  );
}
