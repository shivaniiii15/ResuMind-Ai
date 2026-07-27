import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield,
  Users,
  FileText,
  TrendingUp,
  Activity,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SAMPLE_ADMIN_USERS, SAMPLE_ADMIN_ANALYTICS } from "@/lib/mock-data";
import type { AdminUser } from "@/types/resume";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console & Analytics — ResuMind AI" },
      { name: "description", content: "Admin dashboard for user management, resume volume metrics, and skill gap analytics." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>(SAMPLE_ADMIN_USERS);
  const [search, setSearch] = useState("");
  const analytics = SAMPLE_ADMIN_ANALYTICS;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
    toast.success("User status updated!");
  };

  const toggleUserRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
      )
    );
    toast.success("User role updated!");
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-500 mb-1">
              <Shield className="h-4 w-4 text-purple-500" /> Platform Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admin Console & Platform Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monitor total resume evaluations, manage registered users, and analyze aggregate skill gaps.
            </p>
          </div>

          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-bold px-3 py-1">
            System Status: Healthy 99.9% Uptime
          </Badge>
        </div>

        {/* Platform KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Users</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold">{analytics.totalUsers.toLocaleString()}</span>
              <p className="text-[11px] text-emerald-500 font-semibold mt-1">+18% this month</p>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Resumes Evaluated</span>
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold">{analytics.totalResumesParsed.toLocaleString()}</span>
              <p className="text-[11px] text-muted-foreground mt-1">Across all users</p>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Global Avg ATS Score</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold">{analytics.averageATSScore}</span>
              <p className="text-[11px] text-muted-foreground mt-1">Passing rate 78%</p>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active Users Today</span>
              <Activity className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold">{analytics.activeUsersToday}</span>
              <p className="text-[11px] text-muted-foreground mt-1">Real-time sessions</p>
            </div>
          </Card>
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Analysis Volume */}
          <Card className="border-border bg-card p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-bold">Daily Evaluation Volume</CardTitle>
              <CardDescription className="text-xs">Resumes evaluated per day over past week</CardDescription>
            </CardHeader>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyAnalyses}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: "8px", border: "none" }} />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Missing Skills Ranking */}
          <Card className="border-border bg-card p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-bold">Top Missing Skills Aggregate</CardTitle>
              <CardDescription className="text-xs">Most common missing technical keywords across candidates</CardDescription>
            </CardHeader>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.missingSkillsRank} layout="vertical">
                  <XAxis type="number" stroke="#888888" fontSize={11} />
                  <YAxis dataKey="skill" type="category" stroke="#888888" fontSize={10} width={130} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: "8px", border: "none" }} />
                  <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* User Management Table */}
        <Card className="border-border bg-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold">User Management</CardTitle>
              <CardDescription className="text-xs">View registered candidates, change roles, or toggle account status.</CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y border-border text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Resumes</th>
                  <th className="py-3 px-4 font-semibold">Avg ATS</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-semibold text-foreground">{u.name}</div>
                      <div className="text-muted-foreground text-[11px]">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`cursor-pointer ${
                          u.role === "admin"
                            ? "border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold"
                            : ""
                        }`}
                        onClick={() => toggleUserRole(u.id)}
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        className={`font-semibold text-xs border-none ${
                          u.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">{u.resumesCount}</td>
                    <td className="py-3.5 px-4 font-bold">{u.avgScore} / 100</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleUserStatus(u.id)}
                        className={u.status === "active" ? "text-rose-500" : "text-emerald-500"}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
