import { View, FlatList, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionItem } from "@/components/transaction-item";
import { useAuth } from "@/contexts/auth-context";
import { useTransactions } from "@/hooks/use-transactions";
import type { Transaction } from "@/lib/types";

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { transactions, loading, refreshing, error, refresh } =
    useTransactions();

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

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <Text className="text-white text-2xl font-bold px-4 pt-4 pb-3">
        History
      </Text>

      {loading && transactions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      ) : error && transactions.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-red-400 text-center">{error}</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-neutral-500 text-base">
            No transactions yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              currentUserId={user?.id ?? ""}
              onEdit={handleEdit}
            />
          )}
          refreshing={refreshing}
          onRefresh={refresh}
          className="flex-1"
          contentContainerClassName="pb-4"
        />
      )}
    </SafeAreaView>
  );
}
