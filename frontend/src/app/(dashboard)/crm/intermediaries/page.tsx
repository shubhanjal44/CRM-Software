"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2, Mail, UsersRound } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const mockIntermediaries = [
  { id: 1, name: "Deepak Sharma", interactionDate: "2026-05-25", source: "Referral", prevOrg: "ICICI Securities", currOrg: "DS Advisors", designation: "M&A Advisor", phone: "+91 98001 00001", email: "deepak@dsadvisors.in", submittedBy: "Admin", notes: "Strong deal flow from mid-market manufacturing" },
  { id: 2, name: "Sunita Reddy", interactionDate: "2026-05-18", source: "LinkedIn", prevOrg: "Kotak Investment Banking", currOrg: "SR Capital Markets", designation: "Investment Banker", phone: "+91 98002 00002", email: "sunita@srcapital.com", submittedBy: "Rohan M.", notes: "Specializes in PE fundraising for NBFC sector" },
  { id: 3, name: "Mohammed Ali", interactionDate: "2026-05-05", source: "Events", prevOrg: "EY Transaction Advisory", currOrg: "AlphaMax Consulting", designation: "Transaction Advisor", phone: "+91 98003 00003", email: "mali@alphamax.in", submittedBy: "Priya S.", notes: "Cross-border deal structuring expertise" },
];

export default function IntermediariesPage() {
  const [items, setItems] = useState(mockIntermediaries);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.designation.toLowerCase().includes(search.toLowerCase()));
  const handleDelete = (id: number) => { setItems(p => p.filter(i => i.id !== id)); toast.success("Removed"); };
  const handleSave = () => { toast.success(editItem ? "Updated!" : "Added!"); setOpen(false); setEditItem(null); };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Intermediaries</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Bankers, advisors and deal intermediaries</p>
        </div>
        <Button id="add-intermediary-btn" onClick={() => { setEditItem(null); setOpen(true); }}><Plus className="w-4 h-4" />Add Intermediary</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Total", value: items.length, color: "text-violet-500" },
          { label: "Referral Sources", value: items.filter(i => i.source === "Referral").length, color: "text-emerald-500" },
          { label: "Events", value: items.filter(i => i.source === "Events").length, color: "text-amber-500" },
        ].map(s => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <UsersRound className={`w-5 h-5 ${s.color}`} />
              <div><p className={`text-xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="intermediary-search" placeholder="Search intermediaries..." className="pl-9 max-w-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Sr", "Name", "Designation", "Interaction Date", "Source", "Previous Org", "Current Org", "Submitted By", "Actions"].map(h => (
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
                        <a href={`mailto:${item.email}`} className="text-xs text-blue-500 flex items-center gap-1"><Mail className="w-3 h-3" />{item.email}</a>
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
                        <Button variant="ghost" size="icon" className="h-7 w-7" id={`edit-int-${item.id}`} onClick={() => { setEditItem(item); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" id={`delete-int-${item.id}`} onClick={() => handleDelete(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Intermediary</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2"><Label>Name *</Label><Input placeholder="Full name" defaultValue={editItem?.name} /></div>
              <div className="space-y-1.5"><Label>Interaction Date</Label><Input type="date" defaultValue={editItem?.interactionDate} /></div>
              <div className="space-y-1.5"><Label>Source of Introduction</Label><Input placeholder="Source" defaultValue={editItem?.source} /></div>
              <div className="space-y-1.5"><Label>Previous Organization</Label><Input placeholder="Previous company" defaultValue={editItem?.prevOrg} /></div>
              <div className="space-y-1.5"><Label>Current Organization</Label><Input placeholder="Current company" defaultValue={editItem?.currOrg} /></div>
              <div className="space-y-1.5"><Label>Designation</Label><Input placeholder="Role" defaultValue={editItem?.designation} /></div>
              <div className="space-y-1.5"><Label>Contact Number</Label><Input placeholder="+91..." defaultValue={editItem?.phone} /></div>
              <div className="space-y-1.5 col-span-2"><Label>Email</Label><Input type="email" defaultValue={editItem?.email} /></div>
              <div className="space-y-1.5"><Label>Submitted By</Label><Input defaultValue={editItem?.submittedBy} /></div>
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
