import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FileText,
  Sparkles,
  Upload,
  Target,
  FileCheck,
  Layers,
  ArrowUpRight,
  Trash2,
  Eye,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAnalysisReports, useDeleteReport, useJobMatches } from "@/hooks/use-resumes";
import type { AnalysisReport } from "@/types/resume";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ResuMind AI" },
      { name: "description", content: "Overview of your analyzed resumes, ATS scores, and job matches." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { data: reports = [] } = useAnalysisReports();
  const { data: jobMatches = [] } = useJobMatches();
  const deleteReportMutation = useDeleteReport();

  const jobMatchesCount = jobMatches.length;

  const handleDelete = async (id: string) => {
    await deleteReportMutation.mutateAsync(id);
    toast.success("Resume report deleted from database.");
  };

  const avgAtsScore =
    reports.length > 0
      ? Math.round(reports.reduce((acc, r) => acc + r.atsScore, 0) / reports.length)
      : 82;

  // Chart data formatting
  const chartData = reports
    .slice()
    .reverse()
    .map((r, i) => ({
      name: `Analysis #${i + 1}`,
      ATS: r.atsScore,
      Quality: r.resumeScore,
      date: new Date(r.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

  const skillDistData = [
    { category: "Technical", count: reports[0]?.skillsDetected.technical.length || 10, color: "#6366f1" },
    { category: "Soft Skills", count: reports[0]?.skillsDetected.soft.length || 4, color: "#a855f7" },
    { category: "Tools", count: reports[0]?.skillsDetected.tools.length || 7, color: "#ec4899" },
    { category: "Languages", count: 2, color: "#10b981" },
  ];

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <Sparkles className="h-4 w-4 text-amber-500" /> Career Intelligence Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Alex
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Targeting: <span className="font-semibold text-foreground">Senior Frontend Engineer</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate({ to: "/analyze" })}
              className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-md hover:opacity-90"
            >
              <Upload className="h-4 w-4 mr-2" /> Upload New Resume
            </Button>
          </div>
        </div>

        {/* Action Shortcuts Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            onClick={() => navigate({ to: "/analyze" })}
            className="cursor-pointer border-border hover:border-primary/50 transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm group"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">ATS Resume Analyzer</h3>
                <p className="text-[11px] text-muted-foreground">Scan score & skills</p>
              </div>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate({ to: "/job-match" })}
            className="cursor-pointer border-border hover:border-purple-500/50 transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm group"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">Job Match Comparator</h3>
                <p className="text-[11px] text-muted-foreground">Compare with job description</p>
              </div>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate({ to: "/cover-letter" })}
            className="cursor-pointer border-border hover:border-emerald-500/50 transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm group"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">Cover Letter AI</h3>
                <p className="text-[11px] text-muted-foreground">Tailored letter generator</p>
              </div>
            </CardContent>
          </Card>

          <Card
            onClick={() => navigate({ to: "/builder" })}
            className="cursor-pointer border-border hover:border-amber-500/50 transition-all hover:shadow-lg bg-card/60 backdrop-blur-sm group"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">Interactive Builder</h3>
                <p className="text-[11px] text-muted-foreground">Create & export PDF</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Average ATS Score</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-xs">+14% vs avg</Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">{avgAtsScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <Progress value={avgAtsScore} className="mt-3 h-1.5 bg-muted" />
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Resumes Evaluated</span>
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold">{reports.length}</span>
              <p className="text-[11px] text-muted-foreground mt-1">Saved in your history</p>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Job Description Matches</span>
              <Target className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold">{jobMatchesCount}</span>
              <p className="text-[11px] text-muted-foreground mt-1">Average Match Rate: 86%</p>
            </div>
          </Card>

          <Card className="border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Keywords Detected</span>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold">24</span>
              <p className="text-[11px] text-muted-foreground mt-1">Industry tech keywords</p>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ATS Score Trend Chart */}
          <Card className="lg:col-span-2 border-border bg-card p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>ATS Score Optimization Trend</span>
                <Badge variant="outline" className="text-xs font-normal">Score Progress</Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Tracking your ATS & Quality score progression over recent uploads.
              </CardDescription>
            </CardHeader>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: "8px", border: "none" }}
                  />
                  <Area type="monotone" dataKey="ATS" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Skill Distribution */}
          <Card className="border-border bg-card p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-bold">Detected Skills Breakdown</CardTitle>
              <CardDescription className="text-xs">Skills categorized by domain</CardDescription>
            </CardHeader>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillDistData} layout="vertical">
                  <XAxis type="number" stroke="#888888" fontSize={11} />
                  <YAxis dataKey="category" type="category" stroke="#888888" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderRadius: "8px", border: "none" }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {skillDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Resume History Table */}
        <Card className="border-border bg-card">
          <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Resume History & Reports</CardTitle>
              <CardDescription className="text-xs">
                Manage your previous uploaded resumes and view detailed AI evaluations.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/analyze" })}>
              + Upload File
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-y border-border text-muted-foreground">
                  <tr>
                    <th className="py-3 px-6 font-semibold">Resume Document</th>
                    <th className="py-3 px-6 font-semibold">Targeted Role</th>
                    <th className="py-3 px-6 font-semibold">ATS Score</th>
                    <th className="py-3 px-6 font-semibold">Upload Date</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-semibold block">{r.fileName}</span>
                          <span className="text-[11px] text-muted-foreground">{r.wordCount} words • {r.pageCount} page</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className="font-medium text-xs">
                          {r.targetedRole || "Software Developer"}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`font-bold text-xs ${
                            r.atsScore >= 85
                              ? "bg-emerald-500/10 text-emerald-500"
                              : r.atsScore >= 70
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {r.atsScore} / 100
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {new Date(r.uploadedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate({ to: "/analyze" })}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View Report
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate({ to: "/job-match" })}
                          className="text-purple-500 hover:text-purple-600"
                        >
                          <Target className="h-3.5 w-3.5 mr-1" /> Match JD
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(r.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
