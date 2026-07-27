import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Wand2,
  Copy,
  Building2,
  Briefcase,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAnalysisReports, useJobMatches, useSaveJobMatch } from "@/hooks/use-resumes";
import { compareResumeWithJob } from "@/lib/ai-analyzer";
import type { JobMatchReport } from "@/types/resume";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/job-match")({
  head: () => ({
    meta: [
      { title: "Job Description Matcher — ResuMind AI" },
      { name: "description", content: "Compare your resume against any job description to get match percentage and missing skills." },
    ],
  }),
  component: JobMatchPage,
});

const PRESET_JOBS = [
  {
    title: "Senior React Developer",
    company: "Stripe",
    jd: `Stripe is looking for a Senior React Developer to join our Dashboard Infrastructure team.
Requirements:
- 5+ years experience with React, TypeScript, and modern state management.
- Expertise in Web Vitals, performance tuning, and WCAG accessibility.
- Experience with GraphQL, TanStack Query, Jest, and Cypress testing.
- Track record of building scalable Design Systems.`,
  },
  {
    title: "Full Stack Engineer",
    company: "Meta",
    jd: `Meta is hiring a Full Stack Engineer for our Messaging Core team.
Requirements:
- Strong proficiency in Node.js, Express, React, TypeScript, and MongoDB.
- Experience building RESTful microservices with high throughput.
- Familiarity with CI/CD deployment pipelines, Docker, and Kubernetes.`,
  },
];

function JobMatchPage() {
  const navigate = useNavigate();
  const { data: savedReports = [] } = useAnalysisReports();
  const { data: savedJobMatches = [] } = useJobMatches();
  const saveJobMatchMutation = useSaveJobMatch();

  const [selectedResumeId, setSelectedResumeId] = useState(savedReports[0]?.id || "");
  const [jobTitle, setJobTitle] = useState("Senior React Developer");
  const [companyName, setCompanyName] = useState("Stripe");
  const [jobDescription, setJobDescription] = useState(PRESET_JOBS[0].jd);
  const [matching, setMatching] = useState(false);
  const [activeMatchReport, setActiveMatchReport] = useState<JobMatchReport | null>(null);

  const matchReport = activeMatchReport || (savedJobMatches.length > 0 ? savedJobMatches[0] : null);

  const handlePresetSelect = (preset: (typeof PRESET_JOBS)[0]) => {
    setJobTitle(preset.title);
    setCompanyName(preset.company);
    setJobDescription(preset.jd);
    toast.info(`Loaded preset for ${preset.company} - ${preset.title}`);
  };

  const handleCompare = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }
    setMatching(true);
    try {
      const activeReport = savedReports.find((r) => r.id === selectedResumeId) || savedReports[0];
      const resumeText = activeReport ? activeReport.parsedText : "Senior Engineer with React and Node.js experience.";

      const res = await compareResumeWithJob(resumeText, jobDescription, jobTitle, companyName);
      await saveJobMatchMutation.mutateAsync(res);
      setActiveMatchReport(res);
      toast.success("Job match comparison complete and saved to database!");
    } catch {
      toast.error("Failed to compare job description.");
    } finally {
      setMatching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-500 mb-1">
              <Sparkles className="h-4 w-4 text-purple-500" /> Skill Gap & Keyword Comparator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Job Description Matcher
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Paste a target job posting to find missing technical skills and get AI improvement suggestions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {PRESET_JOBS.map((p) => (
              <Button key={p.company} variant="outline" size="sm" onClick={() => handlePresetSelect(p)} className="text-xs">
                {p.company} Sample
              </Button>
            ))}
          </div>
        </div>

        {/* Input Dual Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Job Posting Details */}
          <Card className="border-border bg-card p-6 space-y-4">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Target Job Posting Details
              </CardTitle>
              <CardDescription className="text-xs">
                Enter company name, job title, and full description text.
              </CardDescription>
            </CardHeader>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Job Title</label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior React Developer" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Company Name</label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Stripe" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Job Description Text</label>
              <textarea
                className="w-full h-44 rounded-xl border border-input bg-background/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Paste the full job description requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </Card>

          {/* Right: Selected Resume */}
          <Card className="border-border bg-card p-6 space-y-4 flex flex-col justify-between">
            <div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-purple-500" /> Select Resume For Comparison
                </CardTitle>
                <CardDescription className="text-xs">
                  Choose which uploaded resume to evaluate against this job.
                </CardDescription>
              </CardHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Active Resume Document</label>
                  <select
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                  >
                    {savedReports.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.fileName} (ATS Score: {r.atsScore})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">AI Matcher Capabilities</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Calculates exact semantic keyword overlap, identifies missing framework competencies, and rewrites bullet points tailored to pass ATS filters.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCompare}
              disabled={matching}
              size="lg"
              className="w-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white font-bold shadow-lg"
            >
              {matching ? "Analyzing Job Match..." : "Compare & Calculate Match %"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>

        {/* Comparison Results */}
        {matchReport && (
          <div className="space-y-6 animate-fadeIn">
            {/* Match Percentage Banner */}
            <Card className="border-primary/40 bg-gradient-to-r from-card via-primary/5 to-purple-500/10 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <Badge className="bg-purple-500/10 text-purple-500 border-none font-bold text-xs">
                    Target: {matchReport.companyName} • {matchReport.jobTitle}
                  </Badge>
                  <h2 className="text-2xl font-bold">Overall Job Match Compatibility</h2>
                  <p className="text-xs text-muted-foreground">
                    Based on technical skill overlap and section keyword density.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-4xl font-extrabold text-purple-500 block">{matchReport.matchPercentage}%</span>
                    <span className="text-xs text-muted-foreground font-semibold">Match Score</span>
                  </div>
                  <Progress value={matchReport.matchPercentage} className="w-24 h-3 bg-muted" />
                </div>
              </div>
            </Card>

            {/* Matched vs Missing Skills Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <Card className="border-border bg-card p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Matched Skills ({matchReport.matchingSkills.length})
                  </CardTitle>
                  <CardDescription className="text-xs">Skills found in both your resume and job posting.</CardDescription>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  {matchReport.matchingSkills.map((sk) => (
                    <Badge key={sk} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 text-xs">
                      ✓ {sk}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Missing Skills */}
              <Card className="border-border bg-card p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-sm font-bold text-rose-500 flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> Missing Required Skills ({matchReport.missingSkills.length})
                  </CardTitle>
                  <CardDescription className="text-xs">Key skills requested in job posting missing from resume.</CardDescription>
                </CardHeader>
                <div className="flex flex-wrap gap-2">
                  {matchReport.missingSkills.map((sk) => (
                    <Badge key={sk} className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 px-3 py-1 text-xs">
                      ✕ {sk}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* AI Bullet Improvement Suggestions & Tailored Summary */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card p-6 space-y-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-amber-500" /> AI-Generated Resume Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {matchReport.improvementSuggestions.map((sug, i) => (
                    <li key={i} className="bg-muted/30 p-3 rounded-lg border border-border text-foreground flex items-start gap-2">
                      <span className="font-bold text-primary">#{i + 1}</span> {sug}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="border-border bg-card p-6 space-y-4">
                <CardHeader className="p-0 mb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> AI-Generated Tailored Professional Summary
                  </CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(matchReport.tailoredSummary)}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </CardHeader>
                <div className="bg-muted/40 p-4 rounded-xl border border-border text-xs leading-relaxed italic text-foreground">
                  "{matchReport.tailoredSummary}"
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
