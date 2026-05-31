"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Shield, Calendar, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const handleSave = () => toast.success("Profile updated successfully!");

  return (
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account information</p>
      </div>

      {/* Avatar Section */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl">SA</AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-bg flex items-center justify-center shadow-lg">
                <User className="w-3 h-3 text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">Super Admin</h2>
              <p className="text-muted-foreground text-sm">admin@tejindia.com</p>
              <Badge variant="purple" className="mt-1.5">Super Admin</Badge>
            </div>
            <div className="ml-auto text-right text-sm text-muted-foreground">
              <p className="flex items-center gap-1 justify-end"><Calendar className="w-3.5 h-3.5" />Member since Jan 2026</p>
              <p className="flex items-center gap-1 justify-end mt-1"><Shield className="w-3.5 h-3.5" />Full Access</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" defaultValue="Super" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" defaultValue="Admin" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@tejindia.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+91 98765 43210" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" defaultValue="Mumbai, India" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="super_admin">
                <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="research_analyst">Research Analyst</SelectItem>
                  <SelectItem value="crm_executive">CRM Executive</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} id="save-profile-btn"><Save className="w-4 h-4" />Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Entries Added", value: "147" },
              { label: "Files Uploaded", value: "89" },
              { label: "Last Login", value: "Today" },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
