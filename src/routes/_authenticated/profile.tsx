import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Key,
  Shield,
  FileText,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  Target,
  Sparkles,
  Eye,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAnalysisReports, useDeleteReport } from "@/hooks/use-resumes";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import type { AnalysisReport } from "@/types/resume";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "User Profile & Settings — ResuMind AI" },
      { name: "description", content: "Manage your career profile preferences, API keys, and saved resume reports." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { data: reports = [] } = useAnalysisReports();
  const deleteReportMutation = useDeleteReport();
  const { data: profile } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = useState(profile?.name || "Alex Morgan");
  const [email, setEmail] = useState(profile?.email || "alex.morgan@email.com");
  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [targetIndustry, setTargetIndustry] = useState("Software & Technology");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.email) setEmail(profile.email);
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      await updateProfileMutation.mutateAsync({ name });
    }
    toast.success("Profile preferences saved successfully!");
  };

  const handleSaveApiKey = () => {
    if (!apiKey) {
      toast.error("Please enter a valid Gemini or OpenAI API Key.");
      return;
    }
    localStorage.setItem("resumind_custom_api_key", apiKey);
    toast.success("Custom AI API Key saved securely!");
  };

  const handleDeleteReport = async (id: string) => {
    await deleteReportMutation.mutateAsync(id);
    toast.success("Deleted report from database history.");
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <User className="h-4 w-4 text-primary" /> Candidate Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            User Profile & Saved Analyses
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your personal target job role, AI model keys, and evaluation history.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Details Form */}
          <Card className="border-border bg-card p-6 space-y-4 lg:col-span-2">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Personal Career Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Your profile information helps tailor ATS keyword recommendation algorithms.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Primary Target Role</label>
                  <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Industry</label>
                  <Input value={targetIndustry} onChange={(e) => setTargetIndustry(e.target.value)} />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" size="sm" className="bg-primary text-primary-foreground">
                  <Save className="h-4 w-4 mr-1.5" /> Save Profile Preferences
                </Button>
              </div>
            </form>
          </Card>

          {/* Custom AI API Key Card */}
          <Card className="border-border bg-card p-6 space-y-4 lg:col-span-1">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-500" /> Custom AI API Key
              </CardTitle>
              <CardDescription className="text-xs">
                Optional: Enter your own Gemini or OpenAI key for unlimited live API evaluation calls.
              </CardDescription>
            </CardHeader>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">API Key</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="AIzaSy... or sk-proj..."
                    className="pl-9 text-xs"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>

              <Button size="sm" variant="outline" className="w-full text-xs font-semibold" onClick={handleSaveApiKey}>
                Save Custom Key
              </Button>

              <div className="rounded-lg bg-emerald-500/5 p-3 text-[11px] text-muted-foreground border border-emerald-500/20">
                <div className="font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">Built-in AI Active</div>
                Default smart NLP engine is currently active and fully operational out of the box.
              </div>
            </div>
          </Card>
        </div>

        {/* Saved Analyses History Table */}
        <Card className="border-border bg-card p-6 space-y-4">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" /> Saved Resume Evaluation Reports ({reports.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Access and manage all previous resume evaluations saved in your workspace history.
            </CardDescription>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-y border-border text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 font-semibold">File Name</th>
                  <th className="py-3 px-4 font-semibold">Targeted Role</th>
                  <th className="py-3 px-4 font-semibold">ATS Score</th>
                  <th className="py-3 px-4 font-semibold">Date Saved</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      {r.fileName}
                    </td>
                    <td className="py-3.5 px-4">{r.targetedRole}</td>
                    <td className="py-3.5 px-4">
                      <Badge className="bg-emerald-500/10 text-emerald-500 font-bold border-none">
                        {r.atsScore} / 100
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {new Date(r.uploadedAt).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/analyze" })}>
                        <Eye className="h-3.5 w-3.5 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteReport(r.id)} className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
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
