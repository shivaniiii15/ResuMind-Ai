import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  hint?: string;
  tone?: "default" | "income" | "expense" | "primary" | "warning";
}

const toneMap = {
  default: "bg-muted text-foreground",
  income: "bg-income/15 text-income",
  expense: "bg-expense/15 text-expense",
  primary: "bg-primary/15 text-primary",
  warning: "bg-warning/20 text-warning-foreground",
};

export function StatCard({ label, value, icon, hint, tone = "default" }: StatCardProps) {
  return (
    <Card className="shadow-card transition-shadow hover:shadow-elegant">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 truncate font-display text-2xl font-bold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", toneMap[tone])}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
