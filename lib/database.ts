import { supabase } from "@/lib/supabase";
import type { TransactionType, Transaction, NetBalance } from "@/lib/types";

export async function fetchTransactions(
  limit = 50,
  offset = 0
): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, profiles(display_name)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return (data ?? []) as unknown as Transaction[];
}

export async function insertTransaction(
  type: TransactionType,
  amount: number,
  description: string | null,
  userId: string
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      type,
      amount,
      description,
      created_by: userId,
    })
    .select("*, profiles(display_name)")
    .single();

  if (error) throw error;
  return data as unknown as Transaction;
}

export async function fetchNetBalance(): Promise<NetBalance | null> {
  const { data, error } = await supabase.rpc("get_net_balance");

  if (error) throw error;
  const results = data as unknown as NetBalance[];
  return results?.[0] ?? null;
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

export async function updateTransaction(
  id: string,
  fields: {
    type: TransactionType;
    amount: number;
    description: string | null;
  }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      type: fields.type,
      amount: fields.amount,
      description: fields.description,
    })
    .eq("id", id)
    .select("*, profiles(display_name)")
    .single();

  if (error) throw error;
  return data as unknown as Transaction;
}
