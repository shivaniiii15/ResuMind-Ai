import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  Minus,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTransactions, useBudget, useProfile } from "@/hooks/use-finance";
import { computeTotals, inMonth, expensesByCategory, monthlySeries } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";
import { CHART_COLORS, CATEGORY_ICONS } from "@/lib/constants";
import { StatCard } from "@/components/stat-card";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Smart Expense Tracker" }] }),
  component: Dashboard,
});

function Dashboard() {
  const now = new Date();
  const { data: txns, isLoading } = useTransactions();
  const { data: budget } = useBudget(now.getMonth() + 1, now.getFullYear());
  const { data: profile } = useProfile();
  const currency = profile?.currency;

  const [dialogType, setDialogType] = useState<"income" | "expense">("expense");
  const [open, setOpen] = useState(false);

  const all = txns ?? [];
  const monthTx = useMemo(() => inMonth(all, now.getMonth() + 1, now.getFullYear()), [all]);
  const totals = useMemo(() => computeTotals(monthTx), [monthTx]);
  const pieData = useMemo(() => expensesByCategory(monthTx), [monthTx]);
  const series = useMemo(() => monthlySeries(all, now.getFullYear()), [all]);
  const recent = all.slice(0, 6);

  const budgetAmount = budget?.monthly_budget ?? 0;
  const budgetUsed = budgetAmount > 0 ? (totals.expense / budgetAmount) * 100 : 0;

  const openDialog = (type: "income" | "expense") => {
    setDialogType(type);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Welcome back{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's your financial snapshot for{" "}
            {now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openDialog("income")} variant="outline">
            <Plus className="mr-1 h-4 w-4" /> Income
          </Button>
          <Button onClick={() => openDialog("expense")}>
            <Minus className="mr-1 h-4 w-4" /> Expense
          </Button>
        </div>
      </div>

      {/* Budget alerts */}
      {budgetAmount > 0 && budgetUsed >= 100 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Budget exceeded</AlertTitle>
          <AlertDescription>
            You've spent {formatCurrency(totals.expense, currency)} of your{" "}
            {formatCurrency(budgetAmount, currency)} budget this month.
          </AlertDescription>
        </Alert>
      )}
      {budgetAmount > 0 && budgetUsed >= 80 && budgetUsed < 100 && (
        <Alert className="border-warning/40 bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning-foreground" />
          <AlertTitle>Approaching your budget</AlertTitle>
          <AlertDescription>
            You've used {budgetUsed.toFixed(0)}% of your monthly budget.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Income" value={formatCurrency(totals.income, currency)} tone="income" icon={<TrendingUp className="h-5 w-5" />} hint="This month" />
        <StatCard label="Total Expenses" value={formatCurrency(totals.expense, currency)} tone="expense" icon={<TrendingDown className="h-5 w-5" />} hint="This month" />
        <StatCard label="Current Balance" value={formatCurrency(totals.balance, currency)} tone="primary" icon={<Wallet className="h-5 w-5" />} hint="Income − Expenses" />
        <StatCard label="Savings Rate" value={`${totals.savingsRate.toFixed(0)}%`} tone="warning" icon={<PiggyBank className="h-5 w-5" />} hint="Of income saved" />
      </div>

      {/* Budget progress */}
      {budgetAmount > 0 && (
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Monthly budget usage</span>
              <span className="text-muted-foreground">
                {formatCurrency(totals.expense, currency)} / {formatCurrency(budgetAmount, currency)}
              </span>
            </div>
            <Progress value={Math.min(budgetUsed, 100)} className="h-2.5" />
            <p className="mt-2 text-xs text-muted-foreground">
              {budgetUsed >= 100
                ? "You're over budget."
                : `${formatCurrency(budgetAmount - totals.expense, currency)} remaining`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="shadow-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Income vs Expenses ({now.getFullYear()})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ left: -20, right: 8 }}>
                  <defs>
                    <linearGradient id="incFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-income)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-income)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-expense)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-expense)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-popover-foreground)",
                    }}
                    formatter={(v: number) => formatCurrency(v, currency)}
                  />
                  <Area type="monotone" dataKey="income" stroke="var(--color-income)" fill="url(#incFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="var(--color-expense)" fill="url(#expFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No expenses this month yet.</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-popover)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        color: "var(--color-popover-foreground)",
                      }}
                      formatter={(v: number) => formatCurrency(v, currency)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/transactions">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No transactions yet. Add your first one above.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((t) => {
                const Icon = CATEGORY_ICONS[t.category] ?? Wallet;
                return (
                  <li key={t.id} className="flex items-center gap-3 py-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.type === "income" ? "bg-income/15 text-income" : "bg-expense/15 text-expense"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.description || t.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.category} · {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount, currency)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <TransactionDialog open={open} onOpenChange={setOpen} type={dialogType} />
    </div>
  );
}
