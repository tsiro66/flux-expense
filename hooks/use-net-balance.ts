import { useEffect, useState, useCallback, useRef } from "react";
import { AppState } from "react-native";
import { supabase } from "@/lib/supabase";
import { fetchNetBalance } from "@/lib/database";
import { useAuth } from "@/contexts/auth-context";

let channelCounter = 0;

export function useNetBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelId = useRef(`bal-${++channelCounter}`);

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const result = await fetchNetBalance();
      if (result) {
        const isRefUser = user.id === result.user_id;
        setBalance(isRefUser ? Number(result.balance) : -Number(result.balance));
      } else {
        setBalance(0);
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to load balance");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Realtime — unique channel per hook instance
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

  return { balance, loading, error, refetch: load };
}
