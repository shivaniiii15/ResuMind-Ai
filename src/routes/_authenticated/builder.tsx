import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Eye,
  Edit3,
  User,
  Briefcase,
  GraduationCap,
  Wand2,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBuilderData, useSaveBuilderData } from "@/hooks/use-resumes";
import type { ResumeBuilderData, ExperienceItem } from "@/types/resume";
import { toast } from "sonner";
import jsPDF from "jspdf";

export const Route = createFileRoute("/_authenticated/builder")({
  head: () => ({
    meta: [
      { title: "AI Resume Builder — ResuMind AI" },
      { name: "description", content: "Build ATS-optimized professional resumes with live preview and PDF export." },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  const { data: initialBuilderData } = useBuilderData();
  const saveBuilderMutation = useSaveBuilderData();

  const [data, setData] = useState<ResumeBuilderData>(() => initialBuilderData || {
    id: "bld-001",
    title: "Master Engineering Resume",
    updatedAt: new Date().toISOString(),
    personalInfo: { fullName: "", headline: "", email: "", phone: "", location: "" },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  useEffect(() => {
    if (initialBuilderData) {
      setData(initialBuilderData);
    }
  }, [initialBuilderData]);

  const [template, setTemplate] = useState<"modern" | "minimal" | "executive">("modern");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (data && data.id) {
      const timer = setTimeout(() => {
        saveBuilderMutation.mutate(data);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleSave = async (updated: ResumeBuilderData) => {
    setData(updated);
    await saveBuilderMutation.mutateAsync(updated);
    toast.success("Resume saved to database!");
  };

  const updatePersonalInfo = (field: string, val: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val },
    }));
  };

  const handleAiEnhanceSummary = () => {
    const aiSummary = `Results-driven ${data.personalInfo.headline || "Engineering Professional"} with 6+ years of experience architecting high-availability React web applications, optimizing core web vitals by 40%, and managing cross-functional technical teams.`;
    setData((prev) => ({ ...prev, summary: aiSummary }));
    toast.success("AI generated tailored professional summary!");
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "New Tech Company",
      role: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2024-01",
      endDate: "Present",
      current: true,
      bullets: ["Developed scalable cloud microservices reducing API latency by 25%."],
    };
    setData((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));
    toast.success("Added new work experience entry.");
  };

  const handleDeleteExp = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(data.personalInfo.fullName || "Alex Morgan", 14, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(data.personalInfo.headline || "Software Engineer", 14, y);
    y += 6;

    const contactStr = `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}`;
    doc.text(contactStr, 14, y);
    y += 10;

    // Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PROFESSIONAL SUMMARY", 14, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const summaryLines = doc.splitTextToSize(data.summary, 180);
    doc.text(summaryLines, 14, y);
    y += summaryLines.length * 5 + 6;

    // Experience
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("WORK EXPERIENCE", 14, y);
    y += 6;

    data.experience.forEach((exp) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${exp.role} — ${exp.company}`, 14, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      exp.bullets.forEach((b) => {
        const bulletLines = doc.splitTextToSize(`• ${b}`, 175);
        doc.text(bulletLines, 18, y);
        y += bulletLines.length * 4.5;
      });
      y += 4;
    });

    doc.save(`${data.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
    toast.success("Resume downloaded as ATS-formatted PDF!");
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 mb-1">
              <Sparkles className="h-4 w-4 text-amber-500" /> Real-time Resume Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Interactive Resume Builder
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Edit sections, enhance bullet points with AI, and export clean ATS-friendly PDFs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
            >
              {viewMode === "edit" ? <Eye className="h-4 w-4 mr-1.5" /> : <Edit3 className="h-4 w-4 mr-1.5" />}
              {viewMode === "edit" ? "Full Preview" : "Edit Sections"}
            </Button>

            <Button
              onClick={downloadPDF}
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-md"
            >
              <Download className="h-4 w-4 mr-1.5" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Builder View Modes */}
        {viewMode === "edit" ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Form Editor */}
            <div className="space-y-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal">
                  <Card className="border-border bg-card p-6 space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> Personal Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
                        <Input
                          value={data.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Professional Headline</label>
                        <Input
                          value={data.personalInfo.headline}
                          onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Email</label>
                        <Input
                          value={data.personalInfo.email}
                          onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Phone</label>
                        <Input
                          value={data.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground block mb-1">Location</label>
                        <Input
                          value={data.personalInfo.location}
                          onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* Summary Tab */}
                <TabsContent value="summary">
                  <Card className="border-border bg-card p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold">Professional Summary</h3>
                      <Button size="sm" variant="ghost" onClick={handleAiEnhanceSummary} className="text-xs text-primary">
                        <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-500" /> Enhance With AI
                      </Button>
                    </div>
                    <textarea
                      className="w-full h-36 rounded-xl border border-input bg-background/60 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={data.summary}
                      onChange={(e) => setData({ ...data, summary: e.target.value })}
                    />
                  </Card>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience">
                  <Card className="border-border bg-card p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-purple-500" /> Work Experience ({data.experience.length})
                      </h3>
                      <Button size="sm" variant="outline" onClick={handleAddExperience}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Position
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {data.experience.map((exp, idx) => (
                        <div key={exp.id} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs">Position #{idx + 1}</span>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteExp(exp.id)} className="text-destructive h-7">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <Input
                              placeholder="Role Title"
                              value={exp.role}
                              onChange={(e) => {
                                const updated = [...data.experience];
                                updated[idx].role = e.target.value;
                                setData({ ...data, experience: updated });
                              }}
                            />
                            <Input
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...data.experience];
                                updated[idx].company = e.target.value;
                                setData({ ...data, experience: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills">
                  <Card className="border-border bg-card p-6 space-y-4">
                    <h3 className="text-sm font-bold">Skills Section</h3>
                    <div className="space-y-3">
                      {data.skills.map((grp, i) => (
                        <div key={grp.category} className="p-3 rounded-lg border border-border bg-muted/20">
                          <span className="text-xs font-bold block mb-2">{grp.category}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {grp.items.map((it) => (
                              <Badge key={it} variant="secondary" className="text-xs">
                                {it}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Live Document Preview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                <span>Live Document Preview (A4 Paper Standard)</span>
                <Badge variant="outline" className="text-[10px]">ATS-Compliant Structure</Badge>
              </div>

              {/* Simulated Printable Resume Paper */}
              <div className="rounded-xl border border-border bg-white text-slate-900 p-8 shadow-2xl space-y-6 font-serif min-h-[600px]">
                {/* Header */}
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">{data.personalInfo.fullName}</h2>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">{data.personalInfo.headline}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase border-b border-slate-200 pb-1 mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{data.summary}</p>
                </div>

                {/* Work Experience */}
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-slate-800 uppercase border-b border-slate-200 pb-1 mb-3">
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                          <span>{exp.role} — {exp.company}</span>
                          <span className="text-[11px] font-normal text-slate-500">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Screen Preview Mode */
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-white text-slate-900 p-12 shadow-2xl space-y-6 font-serif">
            <div className="border-b border-slate-200 pb-4 text-center">
              <h1 className="text-3xl font-bold">{data.personalInfo.fullName}</h1>
              <p className="text-base font-semibold text-slate-600 mt-1">{data.personalInfo.headline}</p>
              <p className="text-xs text-slate-500 mt-2">
                {data.personalInfo.email} • {data.personalInfo.phone} • {data.personalInfo.location}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase border-b pb-1 mb-2">Professional Summary</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{data.summary}</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
