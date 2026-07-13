import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Minus,
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useTransactions,
  useDeleteTransaction,
  useProfile,
  type Transaction,
} from "@/hooks/use-finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import { TransactionDialog } from "@/components/transaction-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [{ title: "Transactions · Smart Expense Tracker" }] }),
  component: TransactionsPage,
});

const PAGE_SIZE = 10;
const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

function TransactionsPage() {
  const { data: txns, isLoading } = useTransactions();
  const { data: profile } = useProfile();
  const del = useDeleteTransaction();
  const currency = profile?.currency;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"income" | "expense">("expense");
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = txns ?? [];
    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter);
    if (catFilter !== "all") list = list.filter((t) => t.category === catFilter);
    if (from) list = list.filter((t) => t.date >= from);
    if (to) list = list.filter((t) => t.date <= to);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.description ?? "").toLowerCase().includes(q) ||
          (t.source ?? "").toLowerCase().includes(q) ||
          (t.notes ?? "").toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => {
      const av = sortBy === "amount" ? a.amount : new Date(a.date).getTime();
      const bv = sortBy === "amount" ? b.amount : new Date(b.date).getTime();
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return list;
  }, [txns, typeFilter, catFilter, from, to, search, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAdd = (type: "income" | "expense") => {
    setEditing(null);
    setDialogType(type);
    setDialogOpen(true);
  };
  const openEdit = (t: Transaction) => {
    setEditing(t);
    setDialogType(t.type);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await del.mutateAsync(deleteId);
      toast.success("Transaction deleted");
    } catch {
      toast.error("Could not delete transaction");
    }
    setDeleteId(null);
  };

  const toggleSort = (field: "date" | "amount") => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">All your income and expense records.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openAdd("income")}>
            <Plus className="mr-1 h-4 w-4" /> Income
          </Button>
          <Button onClick={() => openAdd("expense")}>
            <Minus className="mr-1 h-4 w-4" /> Expense
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {ALL_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} aria-label="From date" />
            <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} aria-label="To date" />
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="flex items-center gap-4 border-b border-border px-4 py-2.5 text-xs font-medium text-muted-foreground">
            <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-foreground">
              Date <ArrowUpDown className="h-3 w-3" />
            </button>
            <span className="flex-1">Details</span>
            <button onClick={() => toggleSort("amount")} className="flex items-center gap-1 hover:text-foreground">
              Amount <ArrowUpDown className="h-3 w-3" />
            </button>
            <span className="w-16 text-right">Actions</span>
          </div>

          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : paged.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No transactions match your filters.</p>
          ) : (
            <ul className="divide-y divide-border">
              {paged.map((t) => {
                const Icon = CATEGORY_ICONS[t.category] ?? Wallet;
                return (
                  <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.type === "income" ? "bg-income/15 text-income" : "bg-expense/15 text-expense"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">{t.description || t.category}</p>
                        <Badge variant="secondary" className="hidden text-[10px] sm:inline-flex">{t.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(t.date)}{t.source ? ` · ${t.source}` : ""}
                      </p>
                    </div>
                    <span className={`shrink-0 text-sm font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                      {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount, currency)}
                    </span>
                    <div className="flex w-16 shrink-0 justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages} · {filtered.length} results
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} type={dialogType} editing={editing} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
