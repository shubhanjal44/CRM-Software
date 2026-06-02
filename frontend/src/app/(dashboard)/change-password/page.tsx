"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function ChangePasswordPage() {
  const [show, setShow] = useState({ current: false, new_pw: false, confirm: false });
  const [form, setForm] = useState({ current_password: "", new_password: "", new_password_confirmation: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.current_password || !form.new_password || !form.new_password_confirmation) {
      toast.error("All fields are required");
      return;
    }
    if (form.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (form.new_password !== form.new_password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await api.put("/auth/change-password", form);
      toast.success("Password changed successfully!");
      setForm({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "current_password", showKey: "current" as const, label: "Current Password", id: "current-password" },
    { key: "new_password", showKey: "new_pw" as const, label: "New Password", id: "new-password" },
    { key: "new_password_confirmation", showKey: "confirm" as const, label: "Confirm New Password", id: "confirm-password" },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-6 fade-in max-w-lg">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Change Password</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Update your account password</p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />Password Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(field => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              <div className="relative">
                <Input
                  id={field.id}
                  type={show[field.showKey] ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                  value={form[field.key]}
                  onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                />
                <button
                  type="button"
                  onClick={() => setShow(p => ({ ...p, [field.showKey]: !p[field.showKey] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show[field.showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <div className="p-3 sm:p-4 rounded-xl bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Password Requirements:</p>
            {[
              "Minimum 8 characters",
              "At least one uppercase letter",
              "At least one number",
              "At least one special character",
            ].map(req => (
              <div key={req} className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {req}
              </div>
            ))}
          </div>

          <Button className="w-full" id="change-password-btn" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
