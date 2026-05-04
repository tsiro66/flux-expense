import { TransactionForm } from "@/components/transaction-form";
import { useAuth } from "@/contexts/auth-context";
import {
  deleteTransaction,
  insertTransaction,
  updateTransaction,
} from "@/lib/database";
import type { TransactionType } from "@/lib/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";

export default function AddTransactionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    type?: string;
    amount?: string;
    transactionId?: string;
    description?: string;
  }>();

  const isEditing = !!params.transactionId;
  const initialType = (params.type as TransactionType) || "expense";
  const initialAmount = params.amount || "";

  const handleSubmit = async (
    type: TransactionType,
    amount: number,
    description: string | null,
  ) => {
    if (!user) throw new Error("Not authenticated");

    if (isEditing) {
      await updateTransaction(params.transactionId!, {
        type,
        amount,
        description,
      });
    } else {
      await insertTransaction(type, amount, description, user.id);
    }

    router.back();
  };

  const handleDelete = async () => {
    await deleteTransaction(params.transactionId!);
    router.back();
  };

  return (
    <View className="flex-1 bg-neutral-950">
      <Stack.Screen
        options={{
          headerTitle: isEditing ? "Edit Transaction" : "New Transaction",
        }}
      />
      <TransactionForm
        initialType={initialType}
        initialAmount={initialAmount}
        initialDescription={isEditing ? (params.description ?? "") : ""}
        submitLabel={isEditing ? "Save Changes" : undefined}
        onSubmit={handleSubmit}
        onDelete={isEditing ? handleDelete : undefined}
      />
    </View>
  );
}
