import { useEffect, useState, useCallback, useRef } from "react";
import { AppState } from "react-native";
import { supabase } from "@/lib/supabase";
import { fetchTransactions } from "@/lib/database";
import type { Transaction } from "@/lib/types";

let channelCounter = 0;

export function useTransactions(limit = 50) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelId = useRef(`tx-${++channelCounter}`);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchTransactions(limit);
      setTransactions(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load transactions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Realtime subscription — unique channel per hook instance
  useEffect(() => {
    const channel = supabase
      .channel(channelId.current)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  // Refetch on app foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") load();
    });
    return () => sub.remove();
  }, [load]);

  return { transactions, loading, refreshing, error, refresh };
}
