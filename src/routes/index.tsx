import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Coins,
  ArrowRight,
  PieChart,
  Wallet,
  Target,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Expense Tracker — Track Income, Budgets & Savings" },
      {
        name: "description",
        content:
          "Track income and expenses, set monthly budgets, visualize spending with charts, and reach your savings goals — all in one beautiful dashboard.",
      },
      { property: "og:title", content: "Smart Expense Tracker" },
      {
        property: "og:description",
        content: "Track income and expenses, set budgets, and reach your savings goals.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Wallet, title: "Income & Expenses", desc: "Log every transaction with categories, dates, and notes in seconds." },
  { icon: PieChart, title: "Visual Reports", desc: "Pie, bar, and line charts reveal exactly where your money goes." },
  { icon: Target, title: "Budgets & Goals", desc: "Set monthly budgets with alerts and track your savings targets." },
  { icon: Sparkles, title: "AI Insights", desc: "Get personalized, data-driven tips to spend smarter and save more." },
  { icon: TrendingUp, title: "Export Reports", desc: "Download polished PDF and Excel reports for any period." },
  { icon: ShieldCheck, title: "Private & Secure", desc: "Bank-grade auth and row-level security keep your data yours." },
];

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary">
            <Coins className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Smart Expense Tracker</span>
        </div>
        <Button asChild variant="ghost">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Personal finance, simplified
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
            Master your money,
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">grow your savings.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Track income and expenses, set smart budgets, and reach your savings goals with a
            dashboard built for clarity.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/auth">
                Get started free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elegant">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Smart Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
}
