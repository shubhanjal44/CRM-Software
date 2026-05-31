"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const handleSave = () => toast.success("Password changed successfully!");

  return (
    <div className="space-y-6 fade-in max-w-lg">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Change Password</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Update your account password</p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />Password Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "current", label: "Current Password", id: "current-password" },
            { key: "new", label: "New Password", id: "new-password" },
            { key: "confirm", label: "Confirm New Password", id: "confirm-password" },
          ].map(field => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              <div className="relative">
                <Input
                  id={field.id}
                  type={show[field.key as keyof typeof show] ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(p => ({ ...p, [field.key]: !p[field.key as keyof typeof p] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show[field.key as keyof typeof show] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {/* Password requirements */}
          <div className="p-4 rounded-xl bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Password Requirements:</p>
            {[
              "Minimum 8 characters",
              "At least one uppercase letter",
              "At least one number",
              "At least one special character",
            ].map(req => (
              <div key={req} className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {req}
              </div>
            ))}
          </div>

          <Button className="w-full" id="change-password-btn" onClick={handleSave}>
            <Lock className="w-4 h-4" />Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
