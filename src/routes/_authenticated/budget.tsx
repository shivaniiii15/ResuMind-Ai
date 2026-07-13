import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Wallet, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import {
  useTransactions,
  useBudget,
  useSaveBudget,
  useProfile,
} from "@/hooks/use-finance";
import { inMonth, computeTotals, expensesByCategory } from "@/lib/analytics";
import { formatCurrency, monthLabel } from "@/lib/format";
import { CHART_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/budget")({
  head: () => ({ meta: [{ title: "Budget · Smart Expense Tracker" }] }),
  component: BudgetPage,
});

function BudgetPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { data: txns } = useTransactions();
  const { data: budget } = useBudget(month, year);
  const { data: profile } = useProfile();
  const save = useSaveBudget();
  const currency = profile?.currency;

  const [amount, setAmount] = useState("");
  useEffect(() => {
    setAmount(budget ? String(budget.monthly_budget) : "");
  }, [budget]);

  const monthTx = useMemo(() => inMonth(txns ?? [], month, year), [txns, month, year]);
  const totals = computeTotals(monthTx);
  const byCat = expensesByCategory(monthTx);
  const budgetAmount = budget?.monthly_budget ?? 0;
  const used = budgetAmount > 0 ? (totals.expense / budgetAmount) * 100 : 0;
  const remaining = budgetAmount - totals.expense;

  const handleSave = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) return toast.error("Enter a valid budget amount");
    try {
      await save.mutateAsync({ monthly_budget: amt, month, year });
      toast.success("Budget saved");
    } catch {
      toast.error("Could not save budget");
    }
  };

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Budget</h1>
        <p className="text-sm text-muted-foreground">Set monthly limits and track your spending.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Set budget */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Set Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <SelectItem key={m} value={String(m)}>{monthLabel(m)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget amount</Label>
              <Input id="budget" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <Button onClick={handleSave} className="w-full" disabled={save.isPending}>
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Budget
            </Button>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              {monthLabel(month)} {year} Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {budgetAmount === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <Wallet className="mx-auto mb-2 h-8 w-8 opacity-40" />
                No budget set for this month yet.
              </div>
            ) : (
              <>
                {used >= 100 ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Budget exceeded</AlertTitle>
                    <AlertDescription>
                      You're {formatCurrency(Math.abs(remaining), currency)} over budget.
                    </AlertDescription>
                  </Alert>
                ) : used >= 80 ? (
                  <Alert className="border-warning/40 bg-warning/10">
                    <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                    <AlertTitle>Heads up</AlertTitle>
                    <AlertDescription>You've used {used.toFixed(0)}% of your budget.</AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-income/40 bg-income/10">
                    <CheckCircle2 className="h-4 w-4 text-income" />
                    <AlertTitle>On track</AlertTitle>
                    <AlertDescription>You have {formatCurrency(remaining, currency)} left to spend.</AlertDescription>
                  </Alert>
                )}

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Spent</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(totals.expense, currency)} / {formatCurrency(budgetAmount, currency)}
                    </span>
                  </div>
                  <Progress value={Math.min(used, 100)} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="mt-1 font-display font-bold">{formatCurrency(budgetAmount, currency)}</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="mt-1 font-display font-bold text-expense">{formatCurrency(totals.expense, currency)}</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className={`mt-1 font-display font-bold ${remaining < 0 ? "text-expense" : "text-income"}`}>
                      {formatCurrency(remaining, currency)}
                    </p>
                  </div>
                </div>

                {byCat.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-sm font-medium">Top categories</p>
                    {byCat.slice(0, 5).map((c, i) => (
                      <div key={c.name} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-xs text-muted-foreground">{c.name}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(c.value / byCat[0].value) * 100}%`,
                              backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                            }}
                          />
                        </div>
                        <span className="w-20 shrink-0 text-right text-xs font-medium">{formatCurrency(c.value, currency)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
