"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Building2, TrendingUp, Users, Landmark, Briefcase, GitMerge,
  CalendarDays, Clock, ArrowUpRight, ArrowDownRight, UserPlus,
  FileUp, Video, Bell, Layers
} from "lucide-react";
import api from "@/lib/api";

const COLORS = ["#8B5CF6","#06B6D4","#10B981","#F59E0B","#EF4444","#EC4899","#22C55E","#6B7280"];

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

const kpiConfig = [
  { key: "total_companies",     label: "Total Companies",       icon: Building2,    color: "from-violet-500 to-purple-600",   bg: "bg-violet-500/10",   text: "text-violet-500" },
  { key: "active_pipeline",     label: "Active Pipeline",        icon: GitMerge,     color: "from-blue-500 to-cyan-500",       bg: "bg-blue-500/10",     text: "text-blue-500" },
  { key: "investors",           label: "Investors",              icon: Landmark,     color: "from-emerald-500 to-teal-500",    bg: "bg-emerald-500/10",  text: "text-emerald-500" },
  { key: "pe_vc_contacts",      label: "PE/VC Contacts",         icon: TrendingUp,   color: "from-amber-500 to-orange-500",    bg: "bg-amber-500/10",    text: "text-amber-500" },
  { key: "talent_resources",    label: "Talent Resources",       icon: Briefcase,    color: "from-pink-500 to-rose-500",       bg: "bg-pink-500/10",     text: "text-pink-500" },
  { key: "intermediaries",      label: "Intermediaries",         icon: Users,        color: "from-indigo-500 to-blue-600",     bg: "bg-indigo-500/10",   text: "text-indigo-500" },
  { key: "meetings_this_month", label: "Meetings This Month",    icon: CalendarDays, color: "from-cyan-500 to-sky-500",        bg: "bg-cyan-500/10",     text: "text-cyan-500" },
  { key: "pending_followups",   label: "Pending Follow-ups",     icon: Clock,        color: "from-red-500 to-pink-600",        bg: "bg-red-500/10",      text: "text-red-500" },
];

function KpiSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="w-8 h-8 rounded-lg shimmer" />
          <div className="w-8 h-3 rounded shimmer" />
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="w-12 h-7 rounded shimmer" />
          <div className="w-24 h-3 rounded shimmer" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats]       = useState<Record<string, number>>({});
  const [charts, setCharts]     = useState<any>({});
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<any>("/dashboard/stats"),
      api.get<any>("/dashboard/charts"),
      api.get<any[]>("/dashboard/activities"),
    ]).then(([s, c, a]) => {
      setStats(s.data);
      setCharts(c.data);
      setActivities(a.data);
    }).catch(() => {
      // Fallback to mock data if backend not available
      setStats({ total_companies: 147, active_pipeline: 38, investors: 214, pe_vc_contacts: 89, talent_resources: 63, intermediaries: 41, meetings_this_month: 24, pending_followups: 17 });
      setCharts({
        pipeline_by_status: [
          { status: "New Lead", count: 12 }, { status: "Contacted", count: 8 },
          { status: "Due Diligence", count: 5 }, { status: "Proposal Sent", count: 4 },
          { status: "Closed Won", count: 8 }, { status: "Closed Lost", count: 3 },
        ],
        investor_by_class: [
          { classification: "HNI", count: 68 }, { classification: "Family Office", count: 42 },
          { classification: "Angel", count: 31 }, { classification: "VC", count: 28 },
          { classification: "PE Fund", count: 19 },
        ],
        monthly_meetings: [
          { month: "Jan", meetings: 14 }, { month: "Feb", meetings: 18 },
          { month: "Mar", meetings: 12 }, { month: "Apr", meetings: 22 },
          { month: "May", meetings: 19 }, { month: "Jun", meetings: 24 },
        ],
        source_leads: [
          { source: "Referral", leads: 48 }, { source: "LinkedIn", leads: 32 },
          { source: "Events", leads: 24 }, { source: "Cold Outreach", leads: 18 },
          { source: "Website", leads: 12 },
        ],
      });
      setActivities([
        { type: "investor", text: "New investor added: Rajan Capital (HNI)", time: "5 min ago" },
        { type: "company", text: "ABC Pharma Ltd added to Companies Portfolio", time: "23 min ago" },
        { type: "meeting", text: "Meeting updated: XYZ VC – Due Diligence", time: "1 hr ago" },
        { type: "file", text: "12 files uploaded to Data Centre", time: "2 hrs ago" },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const pipelineChartData = (charts.pipeline_by_status || []).map((d: any) => ({
    name: d.status, value: d.count,
  }));
  const investorChartData = (charts.investor_by_class || []).map((d: any) => ({
    name: d.classification, count: d.count,
  }));
  const monthlyData = (charts.monthly_meetings || []).map((d: any) => ({
    month: d.month, meetings: d.meetings,
  }));
  const sourceData = (charts.source_leads || []).map((d: any) => ({
    source: d.source, leads: d.leads,
  }));
  const maxLeads = Math.max(...sourceData.map((s: any) => s.leads), 1);

  return (
    <div className="space-y-4 sm:space-y-6 fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
          System Online
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <KpiSkeleton key={i} />)
          : kpiConfig.map((kpi, idx) => (
            <Card key={kpi.key} className="card-hover border-border/50" style={{ animationDelay: `${idx * 60}ms` }}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${kpi.bg}`}>
                    <kpi.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${kpi.text}`} />
                  </div>
                </div>
                <div className="mt-2 sm:mt-3">
                  <p className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                    <AnimatedCounter value={stats[kpi.key] ?? 0} />
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-tight">{kpi.label}</p>
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
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-[180px] w-[180px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pipelineChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {pipelineChartData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-1.5 w-full">
                {pipelineChartData.map((item: any, i: number) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
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
            <div className="h-[200px] sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={investorChartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Investors" radius={[6, 6, 0, 0]}>
                    {investorChartData.map((_: any, idx: number) => (
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
            <div className="h-[180px] sm:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="meetingsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="meetings" name="Meetings" stroke="hsl(262 83% 58%)" strokeWidth={2} fill="url(#meetingsGrad)" dot={{ r: 3, fill: "hsl(262 83% 58%)" }} />
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
              {sourceData.map((item: any) => (
                <div key={item.source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.source}</span>
                    <span className="font-semibold">{item.leads}</span>
                  </div>
                  <Progress value={Math.round((item.leads / maxLeads) * 100)} className="h-1.5" />
                </div>
              ))}
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
          <div className="space-y-2">
            {(activities.length > 0 ? activities : [{text: "No recent activities", time: ""}]).map((activity: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm">{activity.text}</p>
                  {activity.time && <p className="text-[11px] text-muted-foreground mt-0.5">{activity.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
