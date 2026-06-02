"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Lock, Mail, TrendingUp, ShieldCheck, Users, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const res = await api.post<{ token: string; user: { id: number; name: string; email: string; role: string } }>(
        "/auth/login",
        { email, password }
      );
      setAuth(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(262 83% 10%) 0%, hsl(222 47% 5%) 50%, hsl(199 89% 8%) 100%)" }} />
        {/* Animated orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(262 83% 58%), transparent)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(199 89% 48%), transparent)", filter: "blur(60px)" }} />
        <div className="absolute top-[40%] right-[20%] w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(142 71% 45%), transparent)", filter: "blur(80px)" }} />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-xl shadow-purple-500/40">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-white tracking-wide">guardianx</p>
              <p className="text-[11px] text-white/50 uppercase tracking-widest">CRM Platform</p>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Investment<br />
            <span className="gradient-text">Intelligence</span><br />
            Platform
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-md">
            A unified platform for managing investors, pipeline, research, companies, and documents — built for investment professionals.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { icon: Building2, label: "Companies Portfolio", desc: "Track & manage companies" },
            { icon: Users, label: "Investor CRM", desc: "Full relationship management" },
            { icon: TrendingUp, label: "Pipeline Tracking", desc: "End-to-end deal lifecycle" },
            { icon: ShieldCheck, label: "Secure & Private", desc: "RBAC + audit logs" },
          ].map(f => (
            <div key={f.label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <f.icon className="w-4 h-4 text-purple-400" />
                <span className="text-white text-xs font-semibold">{f.label}</span>
              </div>
              <p className="text-white/50 text-[11px]">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-8 pt-6 border-t border-white/10">
          {[
            { value: "500+", label: "Companies Tracked" },
            { value: "1,200+", label: "Investor Profiles" },
            { value: "50+", label: "PE/VC Funds" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6 fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/30">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm gradient-text">guardianx CRM</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-1.5">Sign in to your CRM account</p>
          </div>

          <Card className="border-border/50 shadow-2xl shadow-purple-500/5">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@guardianx.com"
                      className="pl-9"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                  id="login-submit-btn"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-5 p-3 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Credentials</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Email:</span>
                    <code className="font-mono text-foreground">admin@guardianx.com</code>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password:</span>
                    <code className="font-mono text-foreground">Admin@1234</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role badges */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">Available roles in this system</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Super Admin", "Admin", "Research Analyst", "CRM Executive", "Viewer"].map(role => (
                <Badge key={role} variant="outline" className="text-[10px]">{role}</Badge>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            guardianx CRM · © 2026 · All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
