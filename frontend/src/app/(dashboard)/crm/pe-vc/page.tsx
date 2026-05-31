"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2, TrendingUp, MapPin, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const stages = ["Pre-Seed", "Seed", "Series A", "Series B", "Growth", "Late Stage", "Buyout", "Special Situations"];
const stageColors: Record<string, any> = {
  "Pre-Seed": "secondary", "Seed": "info", "Series A": "purple", "Series B": "warning",
  "Growth": "success", "Late Stage": "success", "Buyout": "destructive", "Special Situations": "outline"
};

const mockPeVc = [
  { id: 1, org: "Sequoia Capital India", metDate: "2026-05-20", personMet: "Shailendra Singh", stage: "Series A", location: "Bangalore", phone: "+91 80001 00001", email: "india@sequoiacap.com", fundSize: "$2.5B", sector: "Technology, Consumer", submittedBy: "Admin", notes: "Strong Series A mandate, 15-20 deals/year" },
  { id: 2, org: "Lightspeed India Partners", metDate: "2026-05-10", personMet: "Bejul Somaia", stage: "Seed", location: "Delhi", phone: "+91 11001 00002", email: "india@lsvp.com", fundSize: "$500M", sector: "SaaS, Fintech", submittedBy: "Rohan M.", notes: "Fintech-first mandate for current fund" },
  { id: 3, org: "Kedaara Capital", metDate: "2026-04-28", personMet: "Manish Kejriwal", stage: "Growth", location: "Mumbai", phone: "+91 22001 00003", email: "contact@kedaara.com", fundSize: "$1.2B", sector: "Consumer, Healthcare, Financial Services", submittedBy: "Priya S.", notes: "Growth buyout specialist, strong FMCG thesis" },
  { id: 4, org: "True North", metDate: "2026-04-15", personMet: "Vishal Nevatia", stage: "Buyout", location: "Mumbai", phone: "+91 22002 00004", email: "info@truenorth.in", fundSize: "$1.8B", sector: "Financial Services, Healthcare", submittedBy: "Admin", notes: "Control deals only, ₹200Cr+ EBITDA" },
  { id: 5, org: "Fireside Ventures", metDate: "2026-03-30", personMet: "Kannan Sitaram", stage: "Seed", location: "Bangalore", phone: "+91 80002 00005", email: "hello@firesideventures.com", fundSize: "$400M", sector: "Consumer Brands", submittedBy: "Ankit J.", notes: "D2C and consumer brand specialists" },
];

export default function PeVcPage() {
  const [items, setItems] = useState(mockPeVc);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filtered = items.filter(i =>
    (i.org.toLowerCase().includes(search.toLowerCase()) || i.personMet.toLowerCase().includes(search.toLowerCase())) &&
    (filterStage === "all" || i.stage === filterStage)
  );

  const handleDelete = (id: number) => { setItems(p => p.filter(i => i.id !== id)); toast.success("Removed"); };
  const handleSave = () => { toast.success(editItem ? "Updated!" : "PE/VC contact added!"); setOpen(false); setEditItem(null); };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PE / VC</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Private equity and venture capital contacts</p>
        </div>
        <Button id="add-pevc-btn" onClick={() => { setEditItem(null); setOpen(true); }}><Plus className="w-4 h-4" />Add PE/VC</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Funds", value: items.length, color: "text-violet-500" },
          { label: "Early Stage", value: items.filter(i => ["Pre-Seed","Seed","Series A"].includes(i.stage)).length, color: "text-blue-500" },
          { label: "Growth/Buyout", value: items.filter(i => ["Growth","Buyout","Late Stage"].includes(i.stage)).length, color: "text-emerald-500" },
          { label: "Avg Fund Size", value: "$1.1B", color: "text-amber-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className={`w-5 h-5 ${s.color}`} />
              <div><p className={`text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="pevc-search" placeholder="Search PE/VC..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Sr", "Organization", "Person Met", "Met Date", "Stage", "Fund Size", "Focus Sector", "Submitted By", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{item.org}</p>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{item.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">{item.personMet}</p>
                        <a href={`mailto:${item.email}`} className="text-xs text-blue-500 flex items-center gap-1"><Mail className="w-3 h-3" />{item.email}</a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(item.metDate)}</td>
                    <td className="px-4 py-3"><Badge variant={stageColors[item.stage]}>{item.stage}</Badge></td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-500">{item.fundSize}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-36 truncate">{item.sector}</td>
                    <td className="px-4 py-3 text-sm">{item.submittedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-pevc-${item.id}`} onClick={() => { setEditItem(item); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-pevc-${item.id}`} onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} PE/VC Contact</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2"><Label>Organization Name *</Label><Input defaultValue={editItem?.org} /></div>
              <div className="space-y-1.5"><Label>Met Date</Label><Input type="date" defaultValue={editItem?.metDate} /></div>
              <div className="space-y-1.5"><Label>Person Met</Label><Input defaultValue={editItem?.personMet} /></div>
              <div className="space-y-1.5"><Label>Stage of Investment</Label>
                <Select defaultValue={editItem?.stage}>
                  <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>{stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Location</Label><Input defaultValue={editItem?.location} /></div>
              <div className="space-y-1.5"><Label>Contact Number</Label><Input defaultValue={editItem?.phone} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue={editItem?.email} /></div>
              <div className="space-y-1.5"><Label>Fund Size</Label><Input placeholder="$500M" defaultValue={editItem?.fundSize} /></div>
              <div className="space-y-1.5"><Label>Submitted By</Label><Input defaultValue={editItem?.submittedBy} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Focus Sector</Label><Input placeholder="Technology, Healthcare..." defaultValue={editItem?.sector} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Notes</Label><Textarea rows={3} defaultValue={editItem?.notes} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
