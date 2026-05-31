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
import { Plus, Search, Eye, Pencil, Trash2, Mail, Phone, Building, Briefcase, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const mockTalent = [
  { id: 1, name: "Aisha Khan", interactionDate: "2026-05-28", source: "LinkedIn", prevOrg: "McKinsey & Company", currOrg: "Freelance Consulting", designation: "Management Consultant", phone: "+91 98765 43210", email: "aisha@email.com", submittedBy: "Admin", notes: "Expert in PE ops, open to part-time advisory roles" },
  { id: 2, name: "Vikram Patel", interactionDate: "2026-05-20", source: "Referral", prevOrg: "Goldman Sachs", currOrg: "Startup X", designation: "CFO", phone: "+91 90000 11111", email: "vikram@startupx.com", submittedBy: "Rohan M.", notes: "Strong IB background, could support deal structuring" },
  { id: 3, name: "Neha Gupta", interactionDate: "2026-05-10", source: "Events", prevOrg: "BCG", currOrg: "NovaTech", designation: "Head of Strategy", phone: "+91 80001 22222", email: "neha@novatech.in", submittedBy: "Priya S.", notes: "Deep expertise in technology sector, Series A+ stage" },
  { id: 4, name: "Rahul Kapoor", interactionDate: "2026-04-25", source: "LinkedIn", prevOrg: "Deloitte", currOrg: "Self-employed", designation: "Finance Advisor", phone: "+91 70002 33333", email: "rahul@consultant.in", submittedBy: "Admin", notes: "Regulatory and compliance specialist" },
];

export default function TalentPage() {
  const [talent, setTalent] = useState(mockTalent);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filtered = talent.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.prevOrg.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => { setTalent(p => p.filter(t => t.id !== id)); toast.success("Talent resource removed"); };
  const handleSave = () => { toast.success(editItem ? "Updated!" : "Talent resource added!"); setOpen(false); setEditItem(null); };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Talent Resources</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track professional contacts and talent network</p>
        </div>
        <Button id="add-talent-btn" onClick={() => { setEditItem(null); setOpen(true); }}>
          <Plus className="w-4 h-4" />Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Total Contacts", value: talent.length, color: "text-violet-500" },
          { label: "LinkedIn Sources", value: talent.filter(t => t.source === "LinkedIn").length, color: "text-blue-500" },
          { label: "Referrals", value: talent.filter(t => t.source === "Referral").length, color: "text-emerald-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <Briefcase className={`w-5 h-5 ${s.color}`} />
              <div><p className={`text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="talent-search" placeholder="Search by name or organization..." className="pl-9 max-w-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Sr", "Individual Name", "Designation", "Interaction Date", "Source", "Previous Org", "Current Org", "Submitted By", "Actions"].map(h => (
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
                        <p className="text-sm font-medium">{item.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          <a href={`mailto:${item.email}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1"><Mail className="w-3 h-3" />{item.email}</a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.designation}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(item.interactionDate)}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{item.source}</Badge></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{item.prevOrg}</td>
                    <td className="px-4 py-3 text-sm">{item.currOrg}</td>
                    <td className="px-4 py-3 text-sm">{item.submittedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-talent-${item.id}`} onClick={() => { setEditItem(item); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-talent-${item.id}`} onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editItem ? "Edit Contact" : "Add Talent Resource"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2"><Label>Individual Name *</Label><Input placeholder="Full name" defaultValue={editItem?.name} /></div>
              <div className="space-y-1.5"><Label>Interaction Date</Label><Input type="date" defaultValue={editItem?.interactionDate} /></div>
              <div className="space-y-1.5"><Label>Source of Introduction</Label><Input placeholder="LinkedIn, Referral..." defaultValue={editItem?.source} /></div>
              <div className="space-y-1.5"><Label>Previous Organization</Label><Input placeholder="Previous company" defaultValue={editItem?.prevOrg} /></div>
              <div className="space-y-1.5"><Label>Current Organization</Label><Input placeholder="Current company" defaultValue={editItem?.currOrg} /></div>
              <div className="space-y-1.5"><Label>Designation</Label><Input placeholder="Job title" defaultValue={editItem?.designation} /></div>
              <div className="space-y-1.5"><Label>Contact Number</Label><Input placeholder="+91 XXXXX XXXXX" defaultValue={editItem?.phone} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Email</Label><Input type="email" placeholder="email@org.com" defaultValue={editItem?.email} /></div>
              <div className="space-y-1.5"><Label>Submitted By</Label><Input placeholder="Your name" defaultValue={editItem?.submittedBy} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Notes</Label><Textarea placeholder="Additional notes..." rows={3} defaultValue={editItem?.notes} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"} Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
