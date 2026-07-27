import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileText,
  Sparkles,
  Zap,
  Target,
  FileCheck,
  Briefcase,
  Layers,
  CheckCircle2,
  ArrowRight,
  UploadCircle,
  Star,
  Shield,
  BarChart3,
  Bot,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeResumeText } from "@/lib/ai-analyzer";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResuMind AI — Smart ATS Resume Analyzer & AI Resume Builder" },
      {
        name: "description",
        content:
          "Optimize your resume for Applicant Tracking Systems (ATS), match job descriptions, generate tailored cover letters, and build high-converting engineering resumes with AI.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: Target,
    title: "ATS Score Optimization",
    desc: "Get an instant 0–100 ATS compatibility score breakdown. Identify formatting traps, missing section headers, and parser issues.",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-500",
  },
  {
    icon: BarChart3,
    title: "Job Match & Skill Gaps",
    desc: "Paste any target job description to see your exact Match Percentage, missing technical keywords, and skill gaps.",
    color: "from-purple-500/20 to-pink-500/20 text-purple-500",
  },
  {
    icon: Bot,
    title: "AI Bullet Enhancers",
    desc: "Transform weak bullet points into high-impact, metric-driven achievement statements using cutting-edge AI.",
    color: "from-amber-500/20 to-orange-500/20 text-amber-500",
  },
  {
    icon: FileCheck,
    title: "AI Cover Letter Generator",
    desc: "Generate compelling, customized cover letters tailored specifically to your resume and target job description in seconds.",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
  },
  {
    icon: Layers,
    title: "Interactive Resume Builder",
    desc: "Create clean, professional, ATS-ready resumes with editable sections, live preview, and one-click PDF export.",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-500",
  },
  {
    icon: Shield,
    title: "Grammar & Structure Audit",
    desc: "Detect weak lead verbs, spelling errors, and formatting inconsistencies with line-by-line recommendation notes.",
    color: "from-rose-500/20 to-red-500/20 text-rose-500",
  },
];

const TESTIMONIALS = [
  {
    name: "Elena Rostova",
    role: "Senior Frontend Engineer at Stripe",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    text: "ResuMind AI increased my resume ATS score from 62 to 91. I got interview callbacks from 4 out of 5 top tech companies within a week!",
    rating: 5,
  },
  {
    name: "Marcus Vance",
    role: "Product Manager at Meta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    text: "The Job Description Matcher is a game changer. It highlighted missing keywords I didn't even realize were critical for the ATS scanner.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Full Stack Engineer at Google",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    text: "The Cover Letter Generator saved me hours of writing. It reads like it was written by an executive career coach!",
    rating: 5,
  },
];

const PRICING = [
  {
    name: "Free Starter",
    price: "$0",
    period: "forever",
    desc: "Perfect for testing your current resume ATS score.",
    features: [
      "1 Resume Analysis per month",
      "Basic ATS Score breakdown",
      "Top 5 Skill detections",
      "Standard PDF Resume Export",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro Career",
    price: "$12",
    period: "per month",
    desc: "For active job seekers targeting competitive roles.",
    features: [
      "Unlimited Resume AI Analyses",
      "Unlimited Job Description Matches",
      "AI Cover Letter Generator",
      "AI Bullet Enhancer & Re-writer",
      "Interactive Resume Builder + Templates",
      "Priority PDF Exports",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise Coaching",
    price: "$29",
    period: "per month",
    desc: "For senior leaders, recruiters, and career agencies.",
    features: [
      "Everything in Pro",
      "Admin Dashboard & Team Analytics",
      "Custom OpenAI / Gemini API Integration",
      "Multi-Resume Version Management",
      "Dedicated 1-on-1 AI Career Assistant",
    ],
    cta: "Get Enterprise",
    popular: false,
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [quickText, setQuickText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [quickResult, setQuickResult] = useState<{ score: number; skills: string[]; keywords: string[] } | null>(null);

  const handleQuickDemo = async () => {
    if (!quickText.trim()) {
      toast.error("Please paste sample resume text or click 'Load Sample'.");
      return;
    }
    setAnalyzing(true);
    try {
      const res = await analyzeResumeText(quickText);
      setQuickResult({
        score: res.atsScore,
        skills: res.skillsDetected.technical,
        keywords: res.missingKeywords,
      });
      toast.success("AI Analysis Complete!");
    } catch {
      toast.error("Failed to analyze text.");
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSample = () => {
    setQuickText(`Alex Morgan | San Francisco, CA | alex@example.com
Senior Frontend Engineer with 5+ years experience building React, TypeScript, and Node.js applications.
Spearheaded migration to Vite, reducing build time by 40%. Led team of 5 developers.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-purple-600 shadow-lg shadow-primary/20 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ResuMind AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Live ATS Demo</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Success Stories</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-md">
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/20 via-purple-500/20 to-pink-500/10 blur-[120px]" />
        
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Resume Analyzer & Builder
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
            Land 3x More Interviews With An <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ATS-Optimized Resume
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Scan your resume against real recruiter ATS filters, identify missing skills, compare with job descriptions, and generate tailored cover letters in seconds.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-primary to-purple-600 shadow-xl shadow-primary/25 hover:scale-105 transition-all" onClick={() => navigate({ to: "/auth" })}>
              Analyze My Resume <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a href="#demo">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border hover:bg-accent">
                Try Live Quick Test
              </Button>
            </a>
          </div>

          {/* Highlights Badge */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instant ATS Score Gauge
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> PDF & DOCX Drag and Drop
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Gemini & OpenAI Power
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive ATS Demo Widget */}
      <section id="demo" className="mx-auto max-w-4xl px-6 py-12">
        <Card className="border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" /> Instant AI Resume Quick Test
                </h2>
                <p className="text-sm text-muted-foreground">Paste your resume text below to run a 5-second live test.</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={loadSample}>
                Load Sample Text
              </Button>
            </div>

            <textarea
              className="w-full h-36 rounded-xl border border-input bg-background/50 p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Paste your resume text here (e.g. skills, summary, experience)..."
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
            />

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Privacy guaranteed. Text is analyzed securely.</span>
              <Button size="sm" onClick={handleQuickDemo} disabled={analyzing} className="bg-primary text-primary-foreground">
                {analyzing ? "Analyzing..." : "Check ATS Score"}
              </Button>
            </div>

            {/* Quick Result Preview */}
            {quickResult && (
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 animate-fadeIn">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Estimated ATS Compatibility Score</span>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-base px-3 py-1 font-bold">
                    {quickResult.score} / 100
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs mt-3">
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Detected Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {quickResult.skills.map((s) => (
                        <span key={s} className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground block mb-1">Recommended Keywords</span>
                    <div className="flex flex-wrap gap-1">
                      {quickResult.keywords.map((k) => (
                        <span key={k} className="rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 font-medium">
                          +{k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-3 border-primary/30 text-primary">All-In-One Career Engine</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything You Need To Pass Recruiter ATS</h2>
          <p className="mt-4 text-muted-foreground">From instant drag-and-drop parsing to AI cover letters and full resume building.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-border/60 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-xl group">
              <CardContent className="p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/30 py-20 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-3 border-purple-500/30 text-purple-500">Success Stories</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Trusted By Candidates Hired At Top Companies</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-border bg-card p-6 shadow-sm">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold">{t.name}</h4>
                    <span className="text-xs text-muted-foreground">{t.role}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-500">Flexible Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Invest In Your Next Career Upgrade</h2>
          
          {/* Monthly/Yearly Toggle */}
          <div className="mt-6 inline-flex items-center rounded-full border border-border bg-card p-1">
            <button
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${billingCycle === "monthly" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly Billing
            </button>
            <button
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${billingCycle === "yearly" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {PRICING.map((p) => (
            <Card
              key={p.name}
              className={`relative flex flex-col justify-between border ${p.popular ? "border-primary shadow-2xl ring-2 ring-primary/30" : "border-border"} bg-card p-8`}
            >
              {p.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white font-bold px-3 py-1">
                  Most Popular
                </Badge>
              )}
              <div>
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold">{billingCycle === "yearly" && p.price !== "$0" ? `$${Math.round(parseInt(p.price.replace("$", "")) * 0.8)}` : p.price}</span>
                  <span className="text-sm text-muted-foreground"> /{p.period}</span>
                </div>
                <ul className="space-y-3 text-xs text-muted-foreground mb-8">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className={`w-full ${p.popular ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg" : ""}`}
                variant={p.popular ? "default" : "outline"}
                onClick={() => navigate({ to: "/auth" })}
              >
                {p.cta}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 text-center text-sm text-muted-foreground bg-card/20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <FileText className="h-5 w-5 text-primary" /> ResuMind AI
          </div>
          <p>© {new Date().getFullYear()} ResuMind AI. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <a href="#features" className="hover:text-foreground">Privacy Policy</a>
            <a href="#features" className="hover:text-foreground">Terms of Service</a>
            <a href="#features" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
