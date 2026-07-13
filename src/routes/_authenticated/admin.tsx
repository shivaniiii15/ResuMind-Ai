import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Shield, Users, ArrowLeftRight, Wallet, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useProfile } from "@/hooks/use-finance";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Panel · Smart Expense Tracker" }] }),
  component: AdminPage,
});

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  txCount: number;
  income: number;
  expense: number;
}

function AdminPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { data: me } = useProfile();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    enabled: !!isAdmin,
    queryFn: async (): Promise<UserRow[]> => {
      const [{ data: profiles }, { data: txns }] = await Promise.all([
        supabase.from("profiles").select("id, name, email, avatar_url"),
        supabase.from("transactions").select("user_id, type, amount"),
      ]);
      const map = new Map<string, UserRow>();
      (profiles ?? []).forEach((p) =>
        map.set(p.id, { ...p, txCount: 0, income: 0, expense: 0 }),
      );
      (txns ?? []).forEach((t) => {
        const row = map.get(t.user_id);
        if (!row) return;
        row.txCount += 1;
        if (t.type === "income") row.income += Number(t.amount);
        else row.expense += Number(t.amount);
      });
      return [...map.values()].sort((a, b) => b.txCount - a.txCount);
    },
  });

  if (roleLoading) {
    return <Skeleton className="h-64" />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have permission to view the admin panel.
        </p>
      </div>
    );
  }

  const totalUsers = data?.length ?? 0;
  const totalTx = data?.reduce((s, u) => s + u.txCount, 0) ?? 0;
  const totalVolume = data?.reduce((s, u) => s + u.income + u.expense, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Platform overview and user statistics.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={String(totalUsers)} tone="primary" icon={<Users className="h-5 w-5" />} />
        <StatCard label="Total Transactions" value={String(totalTx)} tone="income" icon={<ArrowLeftRight className="h-5 w-5" />} />
        <StatCard label="Total Volume" value={formatCurrency(totalVolume, me?.currency)} tone="warning" icon={<Wallet className="h-5 w-5" />} />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Income</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((u) => {
                  const initials = (u.name || u.email || "U").slice(0, 2).toUpperCase();
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {u.avatar_url && <AvatarImage src={u.avatar_url} alt="" />}
                            <AvatarFallback className="bg-primary/15 text-xs text-primary">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{u.name || "—"}</p>
                            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">{u.txCount}</TableCell>
                      <TableCell className="text-right text-sm text-income">{formatCurrency(u.income, me?.currency)}</TableCell>
                      <TableCell className="text-right text-sm text-expense">{formatCurrency(u.expense, me?.currency)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
