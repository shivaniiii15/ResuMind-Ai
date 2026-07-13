import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSaveTransaction, type Transaction } from "@/hooks/use-finance";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: "income" | "expense";
  editing?: Transaction | null;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export function TransactionDialog({ open, onOpenChange, type, editing }: Props) {
  const save = useSaveTransaction();
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [date, setDate] = useState(todayStr());
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setAmount(editing ? String(editing.amount) : "");
      setCategory(editing?.category ?? categories[0]);
      setDate(editing?.date ?? todayStr());
      setDescription(editing?.description ?? "");
      setSource(editing?.source ?? "");
      setNotes(editing?.notes ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return toast.error("Enter a valid amount");
    try {
      await save.mutateAsync({
        id: editing?.id,
        type,
        category,
        amount: amt,
        date,
        description: description.trim() || null,
        source: type === "income" ? source.trim() || null : null,
        notes: notes.trim() || null,
      });
      toast.success(editing ? "Transaction updated" : `${type === "income" ? "Income" : "Expense"} added`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit" : "Add"} {type === "income" ? "Income" : "Expense"}
          </DialogTitle>
          <DialogDescription>
            {type === "income"
              ? "Record money coming in."
              : "Record money going out and categorize it."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "income" && (
            <div className="space-y-2">
              <Label htmlFor="source">Income source</Label>
              <Input id="source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Employer, Client" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was this for?" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" rows={2} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Save changes" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
