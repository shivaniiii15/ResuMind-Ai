import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In / Register — ResuMind AI" },
      { name: "description", content: "Access your AI Resume Analyzer dashboard and job match reports." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "forgot">("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Successfully logged in!");
      navigate({ to: "/dashboard" });
    }, 600);
  };

  const handleDemoUser = () => {
    toast.success("Logged in as Demo User!");
    navigate({ to: "/dashboard" });
  };

  const handleDemoAdmin = () => {
    toast.success("Logged in as Admin!");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column: Brand & Features */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg text-white">
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">ResuMind AI</span>
        </div>

        <div className="max-w-md my-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Professional Career Intelligence
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight mb-4">
            Optimize your resume for any Applicant Tracking System.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Join thousands of software engineers, product managers, and executives who landed interviews at top tech companies using ResuMind AI.
          </p>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant ATS Score & Keyword Gap Audit
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Job Description Matcher & AI Summaries
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> One-Click AI Cover Letter Generator
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex justify-between items-center border-t border-white/10 pt-6">
          <span>© ResuMind AI</span>
          <span>Enterprise Grade Security</span>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight">Welcome to ResuMind AI</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to access your saved resume reports and tools.</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex.morgan@email.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgot")}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Alex Morgan"
                      className="pl-9"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="alex.morgan@email.com"
                      className="pl-9"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 8 characters"
                      className="pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600" disabled={loading}>
                  Create Free Account
                </Button>
              </form>
            </TabsContent>

            {/* Forgot Password Tab */}
            <TabsContent value="forgot">
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Enter your email address and we will send you a password reset link.</p>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="alex.morgan@email.com" />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    toast.success("Password reset link sent to your email!");
                    setActiveTab("login");
                  }}
                >
                  Send Reset Link
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Demo Login Shortcut */}
          <div className="pt-4 border-t border-border space-y-2">
            <span className="text-xs text-center block text-muted-foreground">Or test instantly without sign up:</span>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={handleDemoUser} className="text-xs font-semibold">
                Try Demo User
              </Button>
              <Button variant="outline" size="sm" onClick={handleDemoAdmin} className="text-xs font-semibold border-purple-500/30 text-purple-600 dark:text-purple-400">
                <Shield className="h-3.5 w-3.5 mr-1" /> Login as Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
