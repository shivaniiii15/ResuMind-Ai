import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string | null;
  source: string | null;
  notes: string | null;
  date: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  monthly_budget: number;
  month: number;
  year: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  currency: string;
}

/* -------------------- Profile -------------------- */
export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useIsAdmin() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
}

/* -------------------- Transactions -------------------- */
export function useTransactions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user!.id)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((t) => ({ ...t, amount: Number(t.amount) })) as Transaction[];
    },
  });
}

type TxInput = {
  type: "income" | "expense";
  category: string;
  amount: number;
  description?: string | null;
  source?: string | null;
  notes?: string | null;
  date: string;
};

export function useSaveTransaction() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: TxInput & { id?: string }) => {
      if (id) {
        const { error } = await supabase
          .from("transactions")
          .update(input)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("transactions")
          .insert({ ...input, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

/* -------------------- Budget -------------------- */
export function useBudget(month: number, year: number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["budget", user?.id, month, year],
    enabled: !!user,
    queryFn: async (): Promise<Budget | null> => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user!.id)
        .eq("month", month)
        .eq("year", year)
        .maybeSingle();
      if (error) throw error;
      return data ? ({ ...data, monthly_budget: Number(data.monthly_budget) } as Budget) : null;
    },
  });
}

export function useSaveBudget() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { monthly_budget: number; month: number; year: number }) => {
      const { error } = await supabase
        .from("budgets")
        .upsert(
          { ...input, user_id: user!.id },
          { onConflict: "user_id,month,year" },
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budget"] }),
  });
}

/* -------------------- Savings Goals -------------------- */
export function useGoals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["goals", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<SavingsGoal[]> => {
      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((g) => ({
        ...g,
        target_amount: Number(g.target_amount),
        current_amount: Number(g.current_amount),
      })) as SavingsGoal[];
    },
  });
}

export function useSaveGoal() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: {
      id?: string;
      name: string;
      target_amount: number;
      current_amount: number;
      deadline?: string | null;
    }) => {
      if (id) {
        const { error } = await supabase.from("savings_goals").update(input).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("savings_goals")
          .insert({ ...input, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("savings_goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}
