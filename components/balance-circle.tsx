import { View, ActivityIndicator } from "react-native";
import { Text, AmountText } from "@/components/ui/text";

interface BalanceCircleProps {
  balance: number;
  loading: boolean;
  partnerName: string;
}

export function BalanceCircle({
  balance,
  loading,
  partnerName,
}: BalanceCircleProps) {
  const isPositive = balance > 0;
  const isNegative = balance < 0;

  const circleClasses = isPositive
    ? "bg-green-500/10 border border-green-500/40"
    : isNegative
      ? "bg-red-500/10 border border-red-500/40"
      : "bg-neutral-800/50 border border-neutral-700";

  const amountClasses = isPositive
    ? "text-green-400"
    : isNegative
      ? "text-red-400"
      : "text-neutral-400";

  const contextText = isPositive
    ? `${partnerName} owes you`
    : isNegative
      ? `You owe ${partnerName}`
      : "All settled!";

  const formattedAmount = `${isNegative ? "-" : ""}€${Math.abs(balance).toFixed(2)}`;

  return (
    <View className="items-center gap-3">
      <View
        className={`w-48 h-48 rounded-full items-center justify-center ${circleClasses}`}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#9E9E9E" />
        ) : (
          <AmountText className={`text-3xl ${amountClasses}`}>
            {formattedAmount}
          </AmountText>
        )}
      </View>
      {!loading && (
        <Text className="text-neutral-400 text-base">{contextText}</Text>
      )}
    </View>
  );
}
