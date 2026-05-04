import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TransactionForm } from "@/components/transaction-form";
import { insertTransaction } from "@/lib/database";
import { useAuth } from "@/contexts/auth-context";
import type { TransactionType } from "@/lib/types";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ type?: string; amount?: string }>();

  const initialType = (params.type as TransactionType) || "expense";
  const initialAmount = params.amount || "";

  const handleSubmit = async (
    type: TransactionType,
    amount: number,
    description: string | null
  ) => {
    if (!user) throw new Error("Not authenticated");
    await insertTransaction(type, amount, description, user.id);
    router.back();
  };

  return (
    <View className="flex-1 bg-neutral-950">
      <TransactionForm
        initialType={initialType}
        initialAmount={initialAmount}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
