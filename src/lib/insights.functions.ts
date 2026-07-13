import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

interface InsightsResult {
  insights: string | null;
  error?: string;
}

export const getSpendingInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InsightsResult> => {
    const { supabase, userId } = context;

    const { data: txns, error } = await supabase
      .from("transactions")
      .select("type, category, amount, date")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(300);

    if (error) return { insights: null, error: "Could not load your transactions." };
    if (!txns || txns.length === 0)
      return { insights: null, error: "Add some transactions first to get insights." };

    const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const byCat: Record<string, number> = {};
    txns
      .filter((t) => t.type === "expense")
      .forEach((t) => (byCat[t.category] = (byCat[t.category] ?? 0) + Number(t.amount)));

    const summary = {
      totalIncome: income.toFixed(2),
      totalExpense: expense.toFixed(2),
      balance: (income - expense).toFixed(2),
      savingsRatePct: income > 0 ? (((income - expense) / income) * 100).toFixed(1) : "0",
      expensesByCategory: byCat,
      transactionCount: txns.length,
    };

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { insights: null, error: "AI is not configured." };

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are a friendly personal finance coach. Given a JSON summary of a user's finances, give concise, actionable insights. Respond in GitHub-flavored markdown with: a one-line overall assessment, then 3-5 bullet tips referencing their actual numbers and top categories, then one encouraging closing line. Keep it under 200 words. Do not include a title heading.",
            },
            { role: "user", content: `Here is my finance summary: ${JSON.stringify(summary)}` },
          ],
        }),
      });

      if (res.status === 429)
        return { insights: null, error: "Rate limit reached. Please try again shortly." };
      if (res.status === 402)
        return { insights: null, error: "AI credits exhausted. Please add credits in Settings." };
      if (!res.ok) return { insights: null, error: "AI service is unavailable right now." };

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content ?? null;
      return { insights: content };
    } catch {
      return { insights: null, error: "AI service is unavailable right now." };
    }
  });
