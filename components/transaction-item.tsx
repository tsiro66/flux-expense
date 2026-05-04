import { View } from "react-native";
import { Text, AmountText } from "@/components/ui/text";
import type { Transaction } from "@/lib/types";

interface TransactionItemProps {
  transaction: Transaction;
  currentUserId: string;
}

const TYPE_CONFIG = {
  expense: { label: "Expense", icon: "−" },
  income: { label: "Income", icon: "+" },
  payment: { label: "Payment", icon: "⇄" },
} as const;

export function TransactionItem({
  transaction,
  currentUserId,
}: TransactionItemProps) {
  const config = TYPE_CONFIG[transaction.type];
  const isOwn = transaction.created_by === currentUserId;
  const who = isOwn ? "You" : transaction.profiles?.display_name ?? "Partner";

  const date = new Date(transaction.created_at);
  const formatted = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;

  return (
    <View className="flex-row items-center px-4 py-3.5 border-b border-neutral-800/60">
      {/* Type icon */}
      <View className="w-10 h-10 rounded-full items-center justify-center bg-neutral-800">
        <Text className="text-lg text-neutral-400 text-center leading-5">{config.icon}</Text>
      </View>

      {/* Description + date */}
      <View className="flex-1 ml-3">
        <Text className="text-white text-sm font-medium" numberOfLines={1}>
          {transaction.description || config.label}
        </Text>
        <Text className="text-neutral-500 text-xs mt-0.5">
          {who} · {formatted}
        </Text>
      </View>

      {/* Amount */}
      <AmountText className="text-sm text-neutral-300">
        €{Number(transaction.amount).toFixed(2)}
      </AmountText>
    </View>
  );
}
