"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Building2, TrendingUp, Users, Landmark, Briefcase, GitMerge,
  CalendarDays, Clock, ArrowUpRight, ArrowDownRight, UserPlus,
  FileUp, Video, Bell, Layers
} from "lucide-react";

const kpiCards = [
  { label: "Total Companies", value: 147, icon: Building2, change: +12, color: "from-violet-500 to-purple-600", bg: "bg-violet-500/10", text: "text-violet-500" },
  { label: "Active Pipeline", value: 38, icon: GitMerge, change: +5, color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10", text: "text-blue-500" },
  { label: "Investors", value: 214, icon: Landmark, change: +18, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10", text: "text-emerald-500" },
  { label: "PE/VC Contacts", value: 89, icon: TrendingUp, change: +7, color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10", text: "text-amber-500" },
  { label: "Talent Resources", value: 63, icon: Briefcase, change: -2, color: "from-pink-500 to-rose-500", bg: "bg-pink-500/10", text: "text-pink-500" },
  { label: "Intermediaries", value: 41, icon: Users, change: +3, color: "from-indigo-500 to-blue-600", bg: "bg-indigo-500/10", text: "text-indigo-500" },
  { label: "Meetings This Month", value: 24, icon: CalendarDays, change: +8, color: "from-cyan-500 to-sky-500", bg: "bg-cyan-500/10", text: "text-cyan-500" },
  { label: "Pending Follow-ups", value: 17, icon: Clock, change: -4, color: "from-red-500 to-pink-600", bg: "bg-red-500/10", text: "text-red-500" },
];

const pipelineData = [
  { name: "New Lead", value: 12, color: "#8B5CF6" },
  { name: "Contacted", value: 8, color: "#06B6D4" },
  { name: "Meeting Sched.", value: 6, color: "#10B981" },
  { name: "Due Diligence", value: 5, color: "#F59E0B" },
  { name: "Proposal Sent", value: 4, color: "#EF4444" },
  { name: "Negotiation", value: 2, color: "#EC4899" },
  { name: "Closed Won", value: 8, color: "#22C55E" },
  { name: "Closed Lost", value: 3, color: "#6B7280" },
];

const investorClassification = [
  { name: "HNI", count: 68 },
  { name: "Family Office", count: 42 },
  { name: "Angel", count: 31 },
  { name: "VC", count: 28 },
  { name: "PE Fund", count: 19 },
  { name: "Institutional", count: 14 },
  { name: "Strategic", count: 12 },
];

const monthlyMeetings = [
  { month: "Jan", meetings: 14, followups: 8 },
  { month: "Feb", meetings: 18, followups: 11 },
  { month: "Mar", meetings: 12, followups: 9 },
  { month: "Apr", meetings: 22, followups: 14 },
  { month: "May", meetings: 19, followups: 12 },
  { month: "Jun", meetings: 24, followups: 17 },
];

const sourceLeads = [
  { source: "Referral", leads: 48 },
  { source: "LinkedIn", leads: 32 },
  { source: "Events", leads: 24 },
  { source: "Cold Outreach", leads: 18 },
  { source: "Website", leads: 12 },
  { source: "Partners", leads: 22 },
];

const recentActivities = [
  { type: "investor", icon: UserPlus, text: "New investor added: Rajan Capital (HNI)", time: "5 min ago", color: "text-emerald-500 bg-emerald-500/10" },
  { type: "company", icon: Building2, text: "ABC Pharma Ltd added to Companies Portfolio", time: "23 min ago", color: "text-violet-500 bg-violet-500/10" },
  { type: "meeting", icon: Video, text: "Meeting updated: XYZ VC – Due Diligence", time: "1 hr ago", color: "text-blue-500 bg-blue-500/10" },
  { type: "file", icon: FileUp, text: "12 files uploaded to Data Centre", time: "2 hrs ago", color: "text-amber-500 bg-amber-500/10" },
  { type: "followup", icon: Bell, text: "Follow-up reminder: GlobalTech Investors", time: "3 hrs ago", color: "text-red-500 bg-red-500/10" },
  { type: "pipeline", icon: GitMerge, text: "Pipeline status changed: TechVentures → Proposal Sent", time: "5 hrs ago", color: "text-cyan-500 bg-cyan-500/10" },
  { type: "company", icon: Building2, text: "MediCore Pvt Ltd – files updated", time: "Yesterday", color: "text-violet-500 bg-violet-500/10" },
  { type: "investor", icon: Landmark, text: "Interaction logged: Sunrise Family Office", time: "Yesterday", color: "text-emerald-500 bg-emerald-500/10" },
];

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count.toLocaleString()}</span>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card/95 backdrop-blur p-3 shadow-xl text-xs">
        <p className="font-semibold mb-1 text-foreground">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, Super Admin · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <Badge variant="success" className="gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
          System Online
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => (
          <Card key={kpi.label} className="card-hover border-border/50" style={{ animationDelay: `${idx * 60}ms` }}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.text}`} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {kpi.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(kpi.change)}
                </div>
              </div>
              <div className="mt-3">
                <p className={`text-2xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                  <AnimatedCounter value={kpi.value} />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline Status */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Pipeline Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-[200px] w-[200px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pipelineData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {pipelineData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground flex-1 truncate">{item.name}</span>
                    <span className="text-xs font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investor Classification */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Investor Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investorClassification} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Investors" radius={[6, 6, 0, 0]}>
                    {investorClassification.map((_, idx) => (
                      <Cell key={idx} fill={`hsl(${262 - idx * 15} 83% ${58 + idx * 3}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Meetings Trend */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Monthly Meetings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyMeetings}>
                  <defs>
                    <linearGradient id="meetingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="followupsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="meetings" name="Meetings" stroke="hsl(262 83% 58%)" strokeWidth={2} fill="url(#meetingsGrad)" dot={{ r: 3, fill: "hsl(262 83% 58%)" }} />
                  <Area type="monotone" dataKey="followups" name="Follow-ups" stroke="hsl(199 89% 48%)" strokeWidth={2} fill="url(#followupsGrad)" dot={{ r: 3, fill: "hsl(199 89% 48%)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Source-wise Leads */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Source-wise Lead Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceLeads.map((item, idx) => {
                const max = Math.max(...sourceLeads.map(s => s.leads));
                const pct = Math.round((item.leads / max) * 100);
                return (
                  <div key={item.source} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.source}</span>
                      <span className="font-semibold">{item.leads}</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Activities</CardTitle>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">View All</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                <div className={`p-2 rounded-lg flex-shrink-0 ${activity.color.split(" ")[1]} ${activity.color.split(" ")[0]}`}>
                  <activity.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
