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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Eye, Pencil, Trash2, Mail, Phone, MapPin, Calendar, User, Building, Upload, Activity, FileText, Landmark } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const classifications = ["HNI", "Family Office", "Angel Investor", "VC", "PE Fund", "Institutional Investor", "Strategic Investor", "Sovereign Fund", "Corporate Venture Capital", "Others"];
const statusList = ["Active", "Interested", "Follow-up Required", "Due Diligence", "Closed", "Not Interested"];
const statusColors: Record<string, any> = { "Active": "success", "Interested": "info", "Follow-up Required": "warning", "Due Diligence": "purple", "Closed": "secondary", "Not Interested": "destructive" };

const mockInvestors = [
  { id: 1, org: "Rajan Capital Partners", name: "Rajan Mehta", location: "Mumbai", phone: "+91 98201 12345", email: "rajan@rajancapital.com", classification: "Family Office", lastInteraction: "2026-06-01", status: "Active", india: "₹200 Cr in tech", comments: "Strong interest in B2B SaaS and healthtech", source: "Referral", nextSteps: "Send NDA and pitch deck", submittedBy: "Admin", ticketSize: "₹20–50 Cr", sectors: "Technology, Healthcare", geography: "Pan India, SEA" },
  { id: 2, org: "Sunrise Angel Network", name: "Priyanka Verma", location: "Bangalore", phone: "+91 80001 23456", email: "priyanka@sunrisean.com", classification: "Angel Investor", lastInteraction: "2026-05-25", status: "Interested", india: "₹50 Cr across 15 startups", comments: "Focus on early-stage, wants co-investment opportunities", source: "LinkedIn", nextSteps: "Schedule partner meeting", submittedBy: "Rohan M.", ticketSize: "₹2–5 Cr", sectors: "Consumer, EdTech", geography: "Tier 1 Cities" },
  { id: 3, org: "GlobalTech Ventures", name: "Arjun Singhania", location: "Delhi", phone: "+91 11001 34567", email: "arjun@globaltech.vc", classification: "VC", lastInteraction: "2026-05-20", status: "Follow-up Required", india: "$120M deployed in India", comments: "Deep tech and climate focus, Series A+", source: "Events", nextSteps: "Follow up on Term Sheet", submittedBy: "Priya S.", ticketSize: "$3–10M", sectors: "DeepTech, CleanTech", geography: "India, US" },
  { id: 4, org: "Bharat Growth Fund", name: "Suresh Nair", location: "Chennai", phone: "+91 44001 45678", email: "suresh@bharatgrowth.in", classification: "PE Fund", lastInteraction: "2026-05-10", status: "Due Diligence", india: "₹800 Cr AUM", comments: "Growth equity, prefers 51%+ stake", source: "Partners", nextSteps: "Legal DD in progress", submittedBy: "Admin", ticketSize: "₹50–200 Cr", sectors: "Manufacturing, FMCG", geography: "Pan India" },
  { id: 5, org: "Wellington Family Office", name: "Meera Wellington", location: "Hyderabad", phone: "+91 40001 56789", email: "meera@wellington.family", classification: "Family Office", lastInteraction: "2026-04-15", status: "Active", india: "₹150 Cr via PE co-investments", comments: "Long-term horizon, no board seat required", source: "Referral", nextSteps: "Share Q2 deal flow", submittedBy: "Ankit J.", ticketSize: "₹15–40 Cr", sectors: "Real Estate, Infrastructure", geography: "South India" },
];

const timeline = [
  { type: "Call", text: "Introductory call – discussed fund thesis", date: "2026-06-01", icon: Phone },
  { type: "Email", text: "Sent pitch deck and financials", date: "2026-05-28", icon: Mail },
  { type: "Meeting", text: "In-person meeting at their office", date: "2026-05-15", icon: Calendar },
  { type: "Follow-up", text: "Follow-up email sent", date: "2026-05-10", icon: Activity },
];

export default function InvestorsPage() {
  const [investors, setInvestors] = useState(mockInvestors);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [viewItem, setViewItem] = useState<any>(null);

  const filtered = investors.filter(i =>
    (i.org.toLowerCase().includes(search.toLowerCase()) || i.name.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus === "all" || i.status === filterStatus) &&
    (filterClass === "all" || i.classification === filterClass)
  );

  const handleDelete = (id: number) => { setInvestors(p => p.filter(i => i.id !== id)); toast.success("Investor removed"); };
  const handleSave = () => { toast.success(editItem ? "Investor updated!" : "Investor added!"); setOpen(false); setEditItem(null); };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investors Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage investor relationships and interactions</p>
        </div>
        <Button id="add-investor-btn" onClick={() => { setEditItem(null); setOpen(true); }}>
          <Plus className="w-4 h-4" />Add Investor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Investors", value: investors.length, color: "text-violet-500" },
          { label: "Active", value: investors.filter(i => i.status === "Active").length, color: "text-emerald-500" },
          { label: "Follow-up Required", value: investors.filter(i => i.status === "Follow-up Required").length, color: "text-amber-500" },
          { label: "In Due Diligence", value: investors.filter(i => i.status === "Due Diligence").length, color: "text-blue-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Landmark className={`w-5 h-5 ${s.color}`} />
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
            <Input id="investor-search" placeholder="Search investors..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Classification" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classifications</SelectItem>
              {classifications.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                  {["Sr", "Organization", "Investor Name", "Classification", "Last Interaction", "Source", "Status", "Submitted By", "Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, idx) => (
                  <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{inv.org}</p>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{inv.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm">{inv.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{inv.classification}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.lastInteraction)}</td>
                    <td className="px-4 py-3 text-sm">{inv.source}</td>
                    <td className="px-4 py-3"><Badge variant={statusColors[inv.status]}>{inv.status}</Badge></td>
                    <td className="px-4 py-3 text-sm">{inv.submittedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" id={`view-investor-${inv.id}`} onClick={() => { setViewItem(inv); setViewOpen(true); }}><Eye className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-investor-${inv.id}`} onClick={() => { setEditItem(inv); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-investor-${inv.id}`} onClick={() => handleDelete(inv.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Detail Dialog */}
      {viewItem && (
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] p-0">
            <div className="flex h-full">
              {/* Main content */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30 flex-shrink-0">
                      {viewItem.org.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{viewItem.org}</h2>
                      <p className="text-muted-foreground">{viewItem.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={statusColors[viewItem.status]}>{viewItem.status}</Badge>
                        <Badge variant="outline">{viewItem.classification}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-border/50">
                      <CardContent className="p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{viewItem.phone}</div>
                          <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{viewItem.email}</div>
                          <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-muted-foreground" />{viewItem.location}</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-border/50">
                      <CardContent className="p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Investment Info</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-muted-foreground">Ticket Size: </span>{viewItem.ticketSize}</div>
                          <div><span className="text-muted-foreground">Sectors: </span>{viewItem.sectors}</div>
                          <div><span className="text-muted-foreground">Geography: </span>{viewItem.geography}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-border/50">
                    <CardContent className="p-4 space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">India Investments</h3>
                      <p className="text-sm">{viewItem.india}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardContent className="p-4 space-y-2">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes & Next Steps</h3>
                      <p className="text-sm text-muted-foreground">{viewItem.comments}</p>
                      <div className="pt-2 border-t border-border">
                        <span className="text-xs font-medium">Next Steps: </span>
                        <span className="text-xs text-muted-foreground">{viewItem.nextSteps}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Activity Timeline</h3>
                    <div className="space-y-3">
                      {timeline.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                            <t.icon className="w-3 h-3 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{t.text}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(t.date)} · {t.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit Investor" : "Add Investor"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2"><Label>Organization Name *</Label><Input placeholder="Organization" defaultValue={editItem?.org} /></div>
              <div className="space-y-1.5"><Label>Investor Name *</Label><Input placeholder="Full name" defaultValue={editItem?.name} /></div>
              <div className="space-y-1.5"><Label>Location</Label><Input placeholder="City" defaultValue={editItem?.location} /></div>
              <div className="space-y-1.5"><Label>Contact Number</Label><Input placeholder="+91 XXXXX XXXXX" defaultValue={editItem?.phone} /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="email@org.com" defaultValue={editItem?.email} /></div>
              <div className="space-y-1.5"><Label>Classification</Label>
                <Select defaultValue={editItem?.classification}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{classifications.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Current Status</Label>
                <Select defaultValue={editItem?.status || "Active"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statusList.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Last Interaction Date</Label><Input type="date" defaultValue={editItem?.lastInteraction} /></div>
              <div className="space-y-1.5"><Label>Source of Introduction</Label><Input placeholder="Referral, LinkedIn..." defaultValue={editItem?.source} /></div>
              <div className="space-y-1.5"><Label>Ticket Size</Label><Input placeholder="₹20–50 Cr" defaultValue={editItem?.ticketSize} /></div>
              <div className="space-y-1.5"><Label>Preferred Sectors</Label><Input placeholder="Technology, Healthcare..." defaultValue={editItem?.sectors} /></div>
              <div className="space-y-1.5"><Label>Submitted By</Label><Input placeholder="Your name" defaultValue={editItem?.submittedBy} /></div>
              <div className="space-y-1.5 col-span-2"><Label>India Related Investments</Label><Input placeholder="Summary of India investments" defaultValue={editItem?.india} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Comments</Label><Textarea placeholder="Notes..." rows={3} defaultValue={editItem?.comments} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Next Steps</Label><Textarea placeholder="Action items..." rows={2} defaultValue={editItem?.nextSteps} /></div>
            </div>
            <div>
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer mt-1.5">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload investor documents</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"} Investor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
