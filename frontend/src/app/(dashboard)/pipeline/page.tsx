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
import { Plus, Search, Eye, Pencil, Trash2, GitMerge, MapPin, Calendar, User, AlertCircle, LayoutGrid, List } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const pipelineStatuses = ["New Lead", "Contacted", "Meeting Scheduled", "Due Diligence", "Proposal Sent", "Negotiation", "Closed Won", "Closed Lost"];
const priorities = ["High", "Medium", "Low"];

const statusConfig: Record<string, { color: string; variant: any; bg: string }> = {
  "New Lead": { color: "#8B5CF6", variant: "purple", bg: "bg-purple-500/10" },
  "Contacted": { color: "#06B6D4", variant: "info", bg: "bg-blue-500/10" },
  "Meeting Scheduled": { color: "#10B981", variant: "success", bg: "bg-emerald-500/10" },
  "Due Diligence": { color: "#F59E0B", variant: "warning", bg: "bg-amber-500/10" },
  "Proposal Sent": { color: "#6366F1", variant: "purple", bg: "bg-indigo-500/10" },
  "Negotiation": { color: "#EC4899", variant: "default", bg: "bg-pink-500/10" },
  "Closed Won": { color: "#22C55E", variant: "success", bg: "bg-emerald-500/10" },
  "Closed Lost": { color: "#6B7280", variant: "secondary", bg: "bg-gray-500/10" },
};

const mockPipeline = [
  { id: 1, company: "TechVista Solutions", meetingDate: "2026-06-10", source: "Referral", location: "Bangalore", submittedBy: "Admin", remarks: "Strong tech team, needs valuation alignment", status: "Due Diligence", nextFollowup: "2026-06-15", priority: "High" },
  { id: 2, company: "GreenField Energy", meetingDate: "2026-06-05", source: "LinkedIn", location: "Pune", submittedBy: "Rohan M.", remarks: "Impressive pipeline, ESG alignment required", status: "Proposal Sent", nextFollowup: "2026-06-12", priority: "High" },
  { id: 3, company: "Urban Logistics Co.", meetingDate: "2026-05-28", source: "Events", location: "Delhi", submittedBy: "Priya S.", remarks: "Series B raise underway", status: "Meeting Scheduled", nextFollowup: "2026-06-08", priority: "Medium" },
  { id: 4, company: "EduTech Academy", meetingDate: "2026-05-20", source: "Cold Outreach", location: "Chennai", submittedBy: "Admin", remarks: "Evaluation pending from partner committee", status: "Contacted", nextFollowup: "2026-06-20", priority: "Low" },
  { id: 5, company: "MediCore Devices", meetingDate: "2026-05-15", source: "Referral", location: "Hyderabad", submittedBy: "Ankit J.", remarks: "Strong revenue growth Q1 2026", status: "Negotiation", nextFollowup: "2026-06-02", priority: "High" },
  { id: 6, company: "FinServe Analytics", meetingDate: "2026-04-10", source: "Partners", location: "Mumbai", submittedBy: "Admin", remarks: "Investment approved by board", status: "Closed Won", nextFollowup: "", priority: "High" },
  { id: 7, company: "RetailEdge Pvt Ltd", meetingDate: "2026-03-20", source: "LinkedIn", location: "Bangalore", submittedBy: "Rohan M.", remarks: "Competitive space, valuation too high", status: "Closed Lost", nextFollowup: "", priority: "Low" },
  { id: 8, company: "AgriTech Innovations", meetingDate: "2026-06-01", source: "Events", location: "Pune", submittedBy: "Priya S.", remarks: "First introductory call pending", status: "New Lead", nextFollowup: "2026-06-07", priority: "Medium" },
];

const priorityColors: Record<string, any> = { "High": "destructive", "Medium": "warning", "Low": "secondary" };

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState(mockPipeline);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filtered = pipeline.filter(p =>
    p.company.toLowerCase().includes(search.toLowerCase()) ||
    p.source.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => { setPipeline(p => p.filter(x => x.id !== id)); toast.success("Pipeline entry removed"); };
  const handleSave = () => { toast.success(editItem ? "Pipeline updated!" : "Pipeline entry added!"); setOpen(false); setEditItem(null); };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track deals through the investment lifecycle</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button variant={view === "table" ? "secondary" : "ghost"} size="sm" className="rounded-none" onClick={() => setView("table")} id="table-view-btn"><List className="w-4 h-4" /></Button>
            <Button variant={view === "kanban" ? "secondary" : "ghost"} size="sm" className="rounded-none" onClick={() => setView("kanban")} id="kanban-view-btn"><LayoutGrid className="w-4 h-4" /></Button>
          </div>
          <Button id="add-pipeline-btn" onClick={() => { setEditItem(null); setOpen(true); }}><Plus className="w-4 h-4" />Add Pipeline</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Deals", value: pipeline.length, color: "text-violet-500" },
          { label: "Active Deals", value: pipeline.filter(p => !["Closed Won", "Closed Lost"].includes(p.status)).length, color: "text-blue-500" },
          { label: "Closed Won", value: pipeline.filter(p => p.status === "Closed Won").length, color: "text-emerald-500" },
          { label: "High Priority", value: pipeline.filter(p => p.priority === "High").length, color: "text-red-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <GitMerge className={`w-5 h-5 ${s.color}`} />
              <div><p className={`text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="pipeline-search" placeholder="Search by company or source..." className="pl-9 max-w-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {view === "table" ? (
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Sr", "Company", "Meeting Date", "Source", "Location", "Submitted By", "Status", "Priority", "Next Followup", "Actions"].map(h => (
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
                          <p className="text-sm font-medium">{item.company}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-36">{item.remarks}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(item.meetingDate)}</td>
                      <td className="px-4 py-3 text-sm">{item.source}</td>
                      <td className="px-4 py-3 text-sm"><span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" />{item.location}</span></td>
                      <td className="px-4 py-3 text-sm">{item.submittedBy}</td>
                      <td className="px-4 py-3"><Badge variant={statusConfig[item.status]?.variant}>{item.status}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={priorityColors[item.priority]}>{item.priority}</Badge></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.nextFollowup ? formatDate(item.nextFollowup) : "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" id={`view-pipeline-${item.id}`}><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-pipeline-${item.id}`} onClick={() => { setEditItem(item); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-pipeline-${item.id}`} onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pipelineStatuses.slice(0, 4).map(status => {
            const items = filtered.filter(p => p.status === status);
            const cfg = statusConfig[status];
            return (
              <div key={status} className="space-y-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${cfg.bg}`}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-xs font-semibold">{status}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{items.length}</span>
                </div>
                {items.map(item => (
                  <Card key={item.id} className="border-border/50 cursor-pointer card-hover">
                    <CardContent className="p-3">
                      <p className="text-sm font-medium mb-1">{item.company}</p>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.remarks}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant={priorityColors[item.priority]} className="text-[10px]">{item.priority}</Badge>
                        <span className="text-[10px] text-muted-foreground">{item.source}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Pipeline Entry" : "Add Pipeline Entry"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2"><Label>Company Name *</Label><Input placeholder="Company name" defaultValue={editItem?.company} /></div>
              <div className="space-y-1.5"><Label>Meeting Date</Label><Input type="date" defaultValue={editItem?.meetingDate} /></div>
              <div className="space-y-1.5"><Label>Source Name</Label><Input placeholder="Referral, LinkedIn..." defaultValue={editItem?.source} /></div>
              <div className="space-y-1.5"><Label>Company Location</Label><Input placeholder="City" defaultValue={editItem?.location} /></div>
              <div className="space-y-1.5"><Label>Submitted By</Label><Input placeholder="Your name" defaultValue={editItem?.submittedBy} /></div>
              <div className="space-y-1.5"><Label>Pipeline Status</Label>
                <Select defaultValue={editItem?.status || "New Lead"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{pipelineStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <Select defaultValue={editItem?.priority || "Medium"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Next Follow-up Date</Label><Input type="date" defaultValue={editItem?.nextFollowup} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Remarks</Label><Textarea placeholder="Notes, key observations..." rows={3} defaultValue={editItem?.remarks} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"} Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
