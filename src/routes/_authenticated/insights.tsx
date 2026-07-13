import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { getSpendingInsights } from "@/lib/insights.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({ meta: [{ title: "AI Insights · Smart Expense Tracker" }] }),
  component: InsightsPage,
});

function renderMarkdown(md: string) {
  const lines = md.split("\n").filter((l) => l.trim().length > 0);
  return lines.map((line, i) => {
    const bolded = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={j}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={j}>{part}</span>
      ),
    );
    const isBullet = /^[-*•]\s/.test(line.trim());
    if (isBullet) {
      const content = line.trim().replace(/^[-*•]\s/, "");
      const inner = content.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{part}</span>
        ),
      );
      return (
        <li key={i} className="ml-1 flex gap-2 text-sm leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{inner}</span>
        </li>
      );
    }
    return (
      <p key={i} className="text-sm leading-relaxed">
        {bolded}
      </p>
    );
  });
}

function InsightsPage() {
  const fetchInsights = useServerFn(getSpendingInsights);
  const mutation = useMutation({ mutationFn: () => fetchInsights() });
  const result = mutation.data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">AI Insights</h1>
        <p className="text-sm text-muted-foreground">
          Personalized, data-driven tips based on your spending.
        </p>
      </div>

      <Card className="overflow-hidden shadow-card">
        <div className="bg-gradient-hero p-6 text-sidebar-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold">Spending Coach</p>
              <p className="text-sm text-sidebar-foreground/60">
                Analyze your latest transactions with AI.
              </p>
            </div>
          </div>
        </div>
        <CardContent className="space-y-4 p-6">
          {mutation.isPending ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your finances...
            </div>
          ) : result?.insights ? (
            <div className="space-y-2.5">
              <ul className="space-y-2.5">{renderMarkdown(result.insights)}</ul>
            </div>
          ) : result?.error ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{result.error}</p>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Click below to generate insights from your spending patterns.
            </p>
          )}

          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : result?.insights ? (
              <RefreshCw className="mr-2 h-4 w-4" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {result?.insights ? "Regenerate" : "Generate Insights"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
