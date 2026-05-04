import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BalanceCircle } from "@/components/balance-circle";
import { TransactionItem } from "@/components/transaction-item";
import { useAuth } from "@/contexts/auth-context";
import { useNetBalance } from "@/hooks/use-net-balance";
import { useTransactions } from "@/hooks/use-transactions";
import type { Transaction } from "@/lib/types";

const ACTION_BUTTONS = [
  { type: "expense" as const, label: "Expense", icon: "−" },
  { type: "income" as const, label: "Income", icon: "+" },
  { type: "payment" as const, label: "Payment", icon: "⇄" },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, partner } = useAuth();
  const { balance, loading: balanceLoading } = useNetBalance();
  const { transactions, loading: txLoading } = useTransactions(5);

  const partnerName = partner?.display_name ?? "Partner";

  const handleEdit = (tx: Transaction) => {
    router.push({
      pathname: "/add-transaction",
      params: {
        transactionId: tx.id,
        type: tx.type,
        amount: String(tx.amount),
        description: tx.description ?? "",
      },
    });
  };

  const handleAction = (type: string) => {
    const params: Record<string, string> = { type };
    // Pre-fill payment amount if user owes money
    if (type === "payment" && balance < 0) {
      params.amount = Math.abs(balance).toFixed(2);
    }
    router.push({ pathname: "/add-transaction", params });
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center pt-12 pb-8 px-4"
      >
        {/* Balance circle */}
        <BalanceCircle
          balance={balance}
          loading={balanceLoading}
          partnerName={partnerName}
        />

        {/* Action buttons */}
        <View className="flex-row gap-6 mt-10">
          {ACTION_BUTTONS.map((btn) => (
            <Pressable
              key={btn.type}
              onPress={() => handleAction(btn.type)}
              className="items-center active:opacity-70"
            >
              <View className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 items-center justify-center mb-2">
                <Text className="text-neutral-300 text-xl">{btn.icon}</Text>
              </View>
              <Text className="text-neutral-400 text-xs font-medium tracking-wide">
                {btn.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Recent transactions */}
        {transactions.length > 0 && (
          <View className="w-full mt-10">
            <Text className="text-neutral-500 text-xs font-semibold tracking-widest px-4 mb-3">
              RECENT
            </Text>
            <View className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              {transactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  currentUserId={user?.id ?? ""}
                  onEdit={handleEdit}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
