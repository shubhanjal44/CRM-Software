"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Eye, FileText, Building2, Landmark, FlaskConical, ShieldCheck, TrendingUp, Briefcase, UsersRound, Database, Filter } from "lucide-react";
import { formatDate } from "@/lib/utils";

const categories = [
  { key: "all", label: "All Documents", icon: Database },
  { key: "companies", label: "Companies", icon: Building2 },
  { key: "investors", label: "Investors", icon: Landmark },
  { key: "research", label: "Research", icon: FlaskConical },
  { key: "policies", label: "Policies", icon: ShieldCheck },
  { key: "pevc", label: "PE/VC", icon: TrendingUp },
  { key: "talent", label: "Talent", icon: Briefcase },
  { key: "intermediaries", label: "Intermediaries", icon: UsersRound },
];

const mockDocs = [
  { id: 1, name: "ABC Pharma – CIM Document.pdf", category: "companies", entity: "ABC Pharma Ltd", type: "PDF", size: "4.2 MB", uploadedBy: "Admin", date: "2026-05-20", tags: ["Pharma", "CIM"] },
  { id: 2, name: "India Pharma Sector Outlook 2026.pdf", category: "research", entity: "Research", type: "PDF", size: "2.1 MB", uploadedBy: "Rohan M.", date: "2026-05-18", tags: ["Pharma", "Research"] },
  { id: 3, name: "Investment Decision Framework.pdf", category: "policies", entity: "HR Policy", type: "PDF", size: "1.2 MB", uploadedBy: "Admin", date: "2026-05-15", tags: ["Policy", "Investment"] },
  { id: 4, name: "Rajan Capital – KYC Documents.zip", category: "investors", entity: "Rajan Capital Partners", type: "ZIP", size: "8.7 MB", uploadedBy: "Admin", date: "2026-05-12", tags: ["KYC", "HNI"] },
  { id: 5, name: "Sequoia India – Meeting Notes.docx", category: "pevc", entity: "Sequoia Capital India", type: "DOCX", size: "320 KB", uploadedBy: "Priya S.", date: "2026-05-10", tags: ["Meeting", "VC"] },
  { id: 6, name: "TechVista – Financial Model.xlsx", category: "companies", entity: "TechVista Solutions", type: "XLSX", size: "1.8 MB", uploadedBy: "Ankit J.", date: "2026-05-08", tags: ["Financial", "Model"] },
  { id: 7, name: "Vikram Patel – Resume.pdf", category: "talent", entity: "Vikram Patel", type: "PDF", size: "450 KB", uploadedBy: "Rohan M.", date: "2026-05-05", tags: ["Resume", "CFO"] },
  { id: 8, name: "Deepak Sharma – Profile.pdf", category: "intermediaries", entity: "DS Advisors", type: "PDF", size: "280 KB", uploadedBy: "Admin", date: "2026-05-02", tags: ["Intermediary", "M&A"] },
  { id: 9, name: "GreenField Energy – Pitch Deck.pptx", category: "companies", entity: "GreenField Energy", type: "PPTX", size: "6.4 MB", uploadedBy: "Admin", date: "2026-04-28", tags: ["Pitch", "Energy"] },
  { id: 10, name: "SEBI Regulations Q2 2026.pdf", category: "research", entity: "Research", type: "PDF", size: "890 KB", uploadedBy: "Admin", date: "2026-04-25", tags: ["SEBI", "Compliance"] },
];

const typeColors: Record<string, string> = {
  "PDF": "text-red-500 bg-red-500/10",
  "DOCX": "text-blue-500 bg-blue-500/10",
  "XLSX": "text-emerald-500 bg-emerald-500/10",
  "PPTX": "text-orange-500 bg-orange-500/10",
  "ZIP": "text-amber-500 bg-amber-500/10",
};

export default function DataCentrePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = mockDocs.filter(d =>
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.entity.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) &&
    (activeCategory === "all" || d.category === activeCategory)
  );

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Centre</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Central repository for all documents and files</p>
        </div>
        {selected.length > 0 && (
          <Button variant="outline" id="bulk-download-btn">
            <Download className="w-4 h-4" />Bulk Download ({selected.length})
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Documents", value: mockDocs.length, color: "text-violet-500" },
          { label: "Total Size", value: "27.5 MB", color: "text-blue-500" },
          { label: "Categories", value: 7, color: "text-emerald-500" },
          { label: "This Month", value: 8, color: "text-amber-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Database className={`w-5 h-5 ${s.color}`} />
              <div><p className={`text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Category sidebar */}
        <Card className="border-border/50 w-52 flex-shrink-0">
          <CardContent className="p-2">
            <div className="space-y-0.5">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    activeCategory === cat.key ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  id={`cat-${cat.key}`}
                >
                  <cat.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 text-left text-xs">{cat.label}</span>
                  <span className="text-[10px]">{cat.key === "all" ? mockDocs.length : mockDocs.filter(d => d.category === cat.key).length}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document list */}
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="datacentre-search" placeholder="Search documents, entities, tags..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded" onChange={e => setSelected(e.target.checked ? filtered.map(d => d.id) : [])} /></th>
                      {["File Name", "Category", "Entity", "Type", "Size", "Uploaded By", "Date", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((doc) => (
                      <tr key={doc.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${selected.includes(doc.id) ? "bg-primary/5" : ""}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded" checked={selected.includes(doc.id)} onChange={() => toggleSelect(doc.id)} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${typeColors[doc.type] || "text-muted-foreground bg-muted"}`}>
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium max-w-48 truncate">{doc.name}</p>
                              <div className="flex gap-1 mt-0.5">
                                {doc.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{categories.find(c => c.key === doc.category)?.label}</Badge></td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{doc.entity}</td>
                        <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[doc.type]}`}>{doc.type}</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{doc.size}</td>
                        <td className="px-4 py-3 text-sm">{doc.uploadedBy}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(doc.date)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" id={`preview-doc-${doc.id}`}><Eye className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" id={`download-doc-${doc.id}`}><Download className="w-3.5 h-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
