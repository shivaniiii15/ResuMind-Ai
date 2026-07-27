import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  FileCheck,
  Sparkles,
  Copy,
  Download,
  Building2,
  Briefcase,
  Wand2,
  Trash2,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAnalysisReports, useCoverLetters, useSaveCoverLetter } from "@/hooks/use-resumes";
import { generateCoverLetter } from "@/lib/ai-analyzer";
import type { CoverLetter } from "@/types/resume";
import { toast } from "sonner";
import jsPDF from "jspdf";

export const Route = createFileRoute("/_authenticated/cover-letter")({
  head: () => ({
    meta: [
      { title: "AI Cover Letter Generator — ResuMind AI" },
      { name: "description", content: "Generate compelling, tailored cover letters based on your resume and job posting." },
    ],
  }),
  component: CoverLetterPage,
});

function CoverLetterPage() {
  const { data: savedReports = [] } = useAnalysisReports();
  const { data: coverLetters = [] } = useCoverLetters();
  const saveCoverLetterMutation = useSaveCoverLetter();

  const [companyName, setCompanyName] = useState("Stripe");
  const [jobTitle, setJobTitle] = useState("Senior React Developer");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<CoverLetter["tone"]>("Professional");
  const [generating, setGenerating] = useState(false);
  const [activeLetterState, setActiveLetterState] = useState<CoverLetter | null>(null);

  const activeLetter = activeLetterState || (coverLetters.length > 0 ? coverLetters[0] : null);

  const handleGenerate = async () => {
    if (!companyName || !jobTitle) {
      toast.error("Please enter company name and job title.");
      return;
    }
    setGenerating(true);
    try {
      const activeReport = savedReports[0];
      const resumeText = activeReport ? activeReport.parsedText : "Alex Morgan Senior Engineer";

      const cl = await generateCoverLetter(resumeText, jobTitle, companyName, jobDescription, tone);
      await saveCoverLetterMutation.mutateAsync(cl);
      setActiveLetterState(cl);
      toast.success("AI Cover Letter generated successfully and saved to database!");
    } catch {
      toast.error("Failed to generate cover letter.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!activeLetter) return;
    navigator.clipboard.writeText(activeLetter.content);
    toast.success("Cover letter copied to clipboard!");
  };

  const downloadPDF = () => {
    if (!activeLetter) return;
    const doc = new jsPDF();
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(activeLetter.content, 180);
    doc.text(splitText, 15, 20);
    doc.save(`Cover_Letter_${activeLetter.companyName}_${activeLetter.jobTitle}.pdf`);
    toast.success("Downloaded cover letter PDF!");
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 mb-1">
              <Sparkles className="h-4 w-4 text-emerald-500" /> AI Document Writer
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Cover Letter Generator
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create high-converting, tailored cover letters matching your resume and target company.
            </p>
          </div>
        </div>

        {/* Form & Editor Dual Pane */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Input Form */}
          <Card className="border-border bg-card p-6 space-y-4 lg:col-span-1">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" /> Target Job Parameters
              </CardTitle>
            </CardHeader>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Company Name</label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Stripe" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Job Title</label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior React Developer" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Letter Tone</label>
                <select
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                >
                  <option value="Professional">Professional & Polished</option>
                  <option value="Enthusiastic">Enthusiastic & High Energy</option>
                  <option value="Executive">Executive & Leadership</option>
                  <option value="Creative">Creative & Bold</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Job Description Snippet (Optional)
                </label>
                <textarea
                  className="w-full h-28 rounded-lg border border-input bg-background/50 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Paste key responsibilities..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-md"
              >
                {generating ? "Writing Cover Letter..." : "Generate AI Cover Letter"}
              </Button>
            </div>
          </Card>

          {/* Right: Rich Preview & Editor */}
          <Card className="border-border bg-card p-6 space-y-4 lg:col-span-2 flex flex-col justify-between">
            {activeLetter ? (
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 font-bold border-none text-xs">
                      {activeLetter.companyName} • {activeLetter.jobTitle}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">Tone: {activeLetter.tone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy Text
                    </Button>
                    <Button size="sm" onClick={downloadPDF} className="bg-primary text-primary-foreground">
                      <Download className="h-3.5 w-3.5 mr-1" /> PDF Export
                    </Button>
                  </div>
                </div>

                <textarea
                  className="w-full h-[380px] rounded-xl border border-input bg-background/70 p-4 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/50 font-serif"
                  value={activeLetter.content}
                  onChange={(e) => setActiveLetter({ ...activeLetter, content: e.target.value })}
                />
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <FileCheck className="h-12 w-12 mx-auto text-muted mb-3" />
                <p className="text-sm">Click "Generate AI Cover Letter" to create your tailored letter.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
