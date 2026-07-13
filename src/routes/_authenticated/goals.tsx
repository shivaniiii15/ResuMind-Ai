import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Target, Plus, Pencil, Trash2, Loader2, Trophy } from "lucide-react";
import {
  useGoals,
  useSaveGoal,
  useDeleteGoal,
  useProfile,
  type SavingsGoal,
} from "@/hooks/use-finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({ meta: [{ title: "Savings Goals · Smart Expense Tracker" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const { data: profile } = useProfile();
  const save = useSaveGoal();
  const del = useDeleteGoal();
  const currency = profile?.currency;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SavingsGoal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? "");
      setTarget(editing ? String(editing.target_amount) : "");
      setCurrent(editing ? String(editing.current_amount) : "");
      setDeadline(editing?.deadline ?? "");
    }
  }, [open, editing]);

  const openAdd = () => { setEditing(null); setOpen(true); };
  const openEdit = (g: SavingsGoal) => { setEditing(g); setOpen(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(target);
    const c = parseFloat(current || "0");
    if (!name.trim()) return toast.error("Enter a goal name");
    if (isNaN(t) || t <= 0) return toast.error("Enter a valid target amount");
    try {
      await save.mutateAsync({
        id: editing?.id,
        name: name.trim(),
        target_amount: t,
        current_amount: isNaN(c) ? 0 : c,
        deadline: deadline || null,
      });
      toast.success(editing ? "Goal updated" : "Goal created");
      setOpen(false);
    } catch {
      toast.error("Could not save goal");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await del.mutateAsync(deleteId);
      toast.success("Goal deleted");
    } catch {
      toast.error("Could not delete goal");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Set targets and track your progress.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-1 h-4 w-4" /> New Goal
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : (goals ?? []).length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            <Target className="mx-auto mb-3 h-10 w-10 opacity-40" />
            No savings goals yet. Create your first one to start tracking.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals!.map((g) => {
            const pct = g.target_amount > 0 ? (g.current_amount / g.target_amount) * 100 : 0;
            const done = pct >= 100;
            return (
              <Card key={g.id} className="shadow-card">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {done ? <Trophy className="h-4 w-4 text-warning-foreground" /> : <Target className="h-4 w-4 text-primary" />}
                    {g.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(g)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteId(g.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={Math.min(pct, 100)} className="h-2.5" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{formatCurrency(g.current_amount, currency)}</span>
                    <span className="text-muted-foreground">of {formatCurrency(g.target_amount, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pct.toFixed(0)}% complete</span>
                    {g.deadline && <span>by {formatDate(g.deadline)}</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Goal" : "New Savings Goal"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="g-name">Goal name</Label>
              <Input id="g-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Emergency fund" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="g-target">Target amount</Label>
                <Input id="g-target" type="number" min="0" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-current">Saved so far</Label>
                <Input id="g-current" type="number" min="0" step="0.01" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="g-deadline">Target date (optional)</Label>
              <Input id="g-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete goal?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
