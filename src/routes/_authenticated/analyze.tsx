import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Target,
  Wand2,
  RefreshCw,
  Info,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseResumeFile } from "@/lib/resume-parser";
import { analyzeResumeText } from "@/lib/ai-analyzer";
import { useAnalysisReports, useSaveReport } from "@/hooks/use-resumes";
import type { AnalysisReport } from "@/types/resume";
import { toast } from "sonner";
import jsPDF from "jspdf";

export const Route = createFileRoute("/_authenticated/analyze")({
  head: () => ({
    meta: [
      { title: "AI Resume Analyzer & ATS Checker — ResuMind AI" },
      { name: "description", content: "Upload PDF or DOCX resume to get an instant ATS score and keyword gap analysis." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: savedReports = [] } = useAnalysisReports();
  const saveReportMutation = useSaveReport();

  const [targetRole, setTargetRole] = useState("Senior Frontend Engineer");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);

  const report = activeReport || (savedReports.length > 0 ? savedReports[0] : null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setLoading(true);
    setProgress(15);
    setCurrentStep("Reading file binary stream...");

    try {
      const { text, fileName } = await parseResumeFile(file);
      setProgress(50);
      setCurrentStep("Extracting keywords & parsing section headers...");

      const evalReport = await analyzeResumeText(text, fileName, targetRole);
      setProgress(85);
      setCurrentStep("Running AI Evaluation model...");

      await saveReportMutation.mutateAsync(evalReport);
      setActiveReport(evalReport);
      setProgress(100);
      toast.success("Resume evaluation completed and saved to database!");
    } catch (err) {
      toast.error("Error parsing resume file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("ResuMind AI — ATS Resume Evaluation Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`File: ${report.fileName}`, 14, 32);
    doc.text(`Targeted Role: ${report.targetedRole}`, 14, 40);
    doc.text(`ATS Score: ${report.atsScore} / 100`, 14, 48);
    doc.text(`Resume Score: ${report.resumeScore} / 100`, 14, 56);

    doc.text("Detected Technical Skills:", 14, 70);
    doc.text(report.skillsDetected.technical.join(", "), 14, 78);

    doc.text("Missing Recommended Keywords:", 14, 90);
    doc.text(report.missingKeywords.join(", "), 14, 98);

    doc.text("Key Strengths:", 14, 110);
    report.strengths.forEach((s, idx) => {
      doc.text(`• ${s}`, 14, 118 + idx * 8);
    });

    doc.save(`ResuMind_ATS_Report_${report.fileName}.pdf`);
    toast.success("Report downloaded as PDF!");
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <Sparkles className="h-4 w-4 text-amber-500" /> AI Resume Evaluation Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ATS Resume Analyzer
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Upload your PDF or DOCX resume for real-time ATS scoring and keyword recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {report && (
              <>
                <Button variant="outline" size="sm" onClick={exportPDF}>
                  <Download className="h-4 w-4 mr-1.5" /> Download Report
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: "/job-match" })}
                  className="bg-gradient-to-r from-primary to-purple-600 text-white"
                >
                  <Target className="h-4 w-4 mr-1.5" /> Compare With Job
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Upload Zone & Config Header */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Target Role Selector */}
          <Card className="border-border bg-card p-5 lg:col-span-1">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Target Role Configuration
              </CardTitle>
              <CardDescription className="text-xs">
                Tailors keyword recommendations to your desired position.
              </CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Target Job Title
                </label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="text-sm"
                />
              </div>

              <div className="rounded-lg bg-muted/40 p-3 text-xs space-y-1 text-muted-foreground">
                <div className="font-semibold text-foreground">ATS Scanner Tip</div>
                <p>
                  Targeting specific titles ensures our AI compares your resume against the correct industry skill database.
                </p>
              </div>
            </div>
          </Card>

          {/* Drag & Drop File Upload Card */}
          <Card className="border-border bg-card p-5 lg:col-span-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 hover:border-primary/70 bg-primary/5 hover:bg-primary/10 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px]"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold">Drag and drop your resume here</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, DOCX, and TXT files up to 10MB
              </p>
              <Button size="sm" variant="outline" className="mt-4 text-xs font-semibold">
                Browse File
              </Button>
            </div>

            {loading && (
              <div className="mt-4 space-y-2 animate-fadeIn">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-primary">{currentStep}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-muted" />
              </div>
            )}
          </Card>
        </div>

        {/* Detailed Evaluation Report Display */}
        {report && (
          <div className="space-y-6 animate-fadeIn">
            {/* Score Overview Row */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-6 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground block">ATS Score</span>
                    <span className="text-4xl font-extrabold text-emerald-500 mt-1 block">
                      {report.atsScore}
                      <span className="text-sm text-muted-foreground font-normal"> / 100</span>
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold">Passing</Badge>
                </div>
                <Progress value={report.atsScore} className="mt-4 h-2 bg-muted" />
                <p className="text-[11px] text-muted-foreground mt-2">
                  Top 15% compatibility with modern Applicant Tracking Systems.
                </p>
              </Card>

              <Card className="border-border bg-card p-6">
                <span className="text-xs font-semibold text-muted-foreground block">Overall Quality Score</span>
                <span className="text-4xl font-extrabold text-indigo-500 mt-1 block">
                  {report.resumeScore}
                  <span className="text-sm text-muted-foreground font-normal"> / 100</span>
                </span>
                <Progress value={report.resumeScore} className="mt-4 h-2 bg-muted" />
                <p className="text-[11px] text-muted-foreground mt-2">Evaluates readability, action verbs & impact.</p>
              </Card>

              <Card className="border-border bg-card p-6">
                <span className="text-xs font-semibold text-muted-foreground block">Skills Detected</span>
                <span className="text-4xl font-extrabold text-purple-500 mt-1 block">
                  {report.skillsDetected.technical.length + report.skillsDetected.soft.length}
                </span>
                <p className="text-[11px] text-muted-foreground mt-4">
                  {report.skillsDetected.technical.length} Technical & {report.skillsDetected.soft.length} Soft skills identified.
                </p>
              </Card>

              <Card className="border-border bg-card p-6">
                <span className="text-xs font-semibold text-muted-foreground block">Missing Keywords</span>
                <span className="text-4xl font-extrabold text-amber-500 mt-1 block">
                  {report.missingKeywords.length}
                </span>
                <p className="text-[11px] text-muted-foreground mt-4">Recommended keywords for {report.targetedRole}.</p>
              </Card>
            </div>

            {/* Comprehensive Report Tabs */}
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="skills">Detected Skills</TabsTrigger>
                <TabsTrigger value="keywords">Missing Keywords</TabsTrigger>
                <TabsTrigger value="grammar">Grammar & Impact</TabsTrigger>
                <TabsTrigger value="strengths">Strengths & Audit</TabsTrigger>
              </TabsList>

              {/* Detected Skills Tab */}
              <TabsContent value="skills">
                <Card className="border-border bg-card p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> Technical & Framework Skills ({report.skillsDetected.technical.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {report.skillsDetected.technical.map((sk) => (
                        <Badge key={sk} variant="secondary" className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-purple-500" /> Soft Skills & Leadership ({report.skillsDetected.soft.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {report.skillsDetected.soft.map((sk) => (
                        <Badge key={sk} variant="outline" className="px-3 py-1 text-xs font-semibold border-purple-500/30 text-purple-600 dark:text-purple-400">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold mb-3">Tools & Developer Ecosystem</h3>
                    <div className="flex flex-wrap gap-2">
                      {report.skillsDetected.tools.map((sk) => (
                        <Badge key={sk} variant="outline" className="px-3 py-1 text-xs text-muted-foreground">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Missing Keywords Tab */}
              <TabsContent value="keywords">
                <Card className="border-border bg-card p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold mb-1">High-Value Missing Keywords</h3>
                    <p className="text-xs text-muted-foreground">
                      Adding these keywords to your work experience bullets will boost your ATS match score for {report.targetedRole} positions.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {report.missingKeywords.map((kw) => (
                      <div key={kw} className="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                        <span className="text-xs font-semibold text-foreground">+{kw}</span>
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none text-[10px]">High Impact</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Grammar & Impact Tab */}
              <TabsContent value="grammar">
                <Card className="border-border bg-card p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold mb-1">Phrasing & Action Verb Audit</h3>
                    <p className="text-xs text-muted-foreground">Line-by-line recommendations to strengthen bullet impact.</p>
                  </div>

                  <div className="space-y-3">
                    {report.grammarSuggestions.map((g) => (
                      <div key={g.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500">
                          <AlertTriangle className="h-4 w-4" /> {g.original}
                        </div>
                        <p className="text-xs font-medium text-foreground bg-card p-2.5 rounded-lg border border-border">
                          💡 <span className="font-bold text-primary">Recommendation:</span> {g.suggestion}
                        </p>
                        <span className="text-[11px] text-muted-foreground block">{g.reason}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Strengths & Weaknesses Tab */}
              <TabsContent value="strengths">
                <Card className="border-border bg-card p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-emerald-500 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Major Strengths
                    </h3>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {report.strengths.map((st, i) => (
                        <li key={i} className="flex items-start gap-2 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-rose-500 mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4" /> Areas For Improvement
                    </h3>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {report.weaknesses.map((wk, i) => (
                        <li key={i} className="flex items-start gap-2 bg-rose-500/5 p-3 rounded-lg border border-rose-500/20 text-foreground">
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          {wk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </AppShell>
  );
}
