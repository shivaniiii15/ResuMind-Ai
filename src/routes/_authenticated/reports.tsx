import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FileDown, FileSpreadsheet } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTransactions, useProfile } from "@/hooks/use-finance";
import {
  computeTotals,
  expensesByCategory,
  monthlySeries,
  filterByPeriod,
  type Period,
} from "@/lib/analytics";
import { formatCurrency, currencySymbol } from "@/lib/format";
import { CHART_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports · Smart Expense Tracker" }] }),
  component: ReportsPage,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  color: "var(--color-popover-foreground)",
};

function ReportsPage() {
  const { data: txns } = useTransactions();
  const { data: profile } = useProfile();
  const currency = profile?.currency;
  const year = new Date().getFullYear();
  const [period, setPeriod] = useState<Period>("monthly");

  const all = txns ?? [];
  const scoped = useMemo(() => filterByPeriod(all, period), [all, period]);
  const totals = useMemo(() => computeTotals(scoped), [scoped]);
  const pieData = useMemo(() => expensesByCategory(scoped), [scoped]);
  const series = useMemo(() => monthlySeries(all, year), [all, year]);

  const periodLabel = { daily: "Today", weekly: "This Week", monthly: "This Month", yearly: "This Year" }[period];

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();
      const sym = currencySymbol(currency);
      doc.setFontSize(18);
      doc.text("Smart Expense Tracker — Report", 14, 18);
      doc.setFontSize(11);
      doc.setTextColor(120);
      doc.text(`Period: ${periodLabel}  ·  Generated ${new Date().toLocaleDateString()}`, 14, 26);
      doc.setTextColor(0);
      autoTable(doc, {
        startY: 34,
        head: [["Summary", "Amount"]],
        body: [
          ["Total Income", `${sym}${totals.income.toFixed(2)}`],
          ["Total Expenses", `${sym}${totals.expense.toFixed(2)}`],
          ["Net Balance", `${sym}${totals.balance.toFixed(2)}`],
          ["Savings Rate", `${totals.savingsRate.toFixed(1)}%`],
        ],
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] },
      });
      autoTable(doc, {
        head: [["Date", "Type", "Category", "Description", "Amount"]],
        body: scoped.map((t) => [
          t.date,
          t.type,
          t.category,
          t.description ?? "",
          `${sym}${t.amount.toFixed(2)}`,
        ]),
        theme: "grid",
        headStyles: { fillColor: [30, 41, 59] },
        styles: { fontSize: 8 },
      });
      doc.save(`expense-report-${period}.pdf`);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Could not generate PDF");
    }
  };

  const exportExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      const summary = [
        { Metric: "Total Income", Value: totals.income },
        { Metric: "Total Expenses", Value: totals.expense },
        { Metric: "Net Balance", Value: totals.balance },
        { Metric: "Savings Rate (%)", Value: Number(totals.savingsRate.toFixed(1)) },
      ];
      const rows = scoped.map((t) => ({
        Date: t.date,
        Type: t.type,
        Category: t.category,
        Description: t.description ?? "",
        Source: t.source ?? "",
        Amount: t.amount,
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), "Summary");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Transactions");
      XLSX.writeFile(wb, `expense-report-${period}.xlsx`);
      toast.success("Excel file downloaded");
    } catch {
      toast.error("Could not generate Excel file");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Visualize your finances and export reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPDF}>
            <FileDown className="mr-1 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" onClick={exportExcel}>
            <FileSpreadsheet className="mr-1 h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Income" value={formatCurrency(totals.income, currency)} tone="income" icon={<TrendingUp className="h-5 w-5" />} hint={periodLabel} />
        <StatCard label="Expenses" value={formatCurrency(totals.expense, currency)} tone="expense" icon={<TrendingDown className="h-5 w-5" />} hint={periodLabel} />
        <StatCard label="Balance" value={formatCurrency(totals.balance, currency)} tone="primary" icon={<Wallet className="h-5 w-5" />} hint={periodLabel} />
        <StatCard label="Savings Rate" value={`${totals.savingsRate.toFixed(0)}%`} tone="warning" icon={<PiggyBank className="h-5 w-5" />} hint={periodLabel} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Expense Categories</CardTitle></CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No expenses in this period.</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={95} label={(e) => e.name}>
                      {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v, currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Monthly Spending ({year})</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v, currency)} />
                  <Bar dataKey="expense" fill="var(--color-expense)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Income vs Expenses ({year})</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v, currency)} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="var(--color-expense)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
