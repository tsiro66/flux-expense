import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "@/components/ui/text";
import type { TransactionType } from "@/lib/types";

interface TransactionFormProps {
  initialType?: TransactionType;
  initialAmount?: string;
  onSubmit: (
    type: TransactionType,
    amount: number,
    description: string | null
  ) => Promise<void>;
}

const TYPES: { key: TransactionType; label: string }[] = [
  { key: "expense", label: "Expense" },
  { key: "income", label: "Income" },
  { key: "payment", label: "Payment" },
];

export function TransactionForm({
  initialType = "expense",
  initialAmount = "",
  onSubmit,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState(initialAmount);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(type, num, description.trim() || null);
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const activeType = TYPES.find((t) => t.key === type)!;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 px-6 pt-8 gap-7">
        {/* Type selector */}
        <View className="flex-row bg-neutral-800/50 rounded-2xl p-1">
          {TYPES.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setType(t.key)}
              className={`flex-1 py-3 rounded-xl items-center ${
                type === t.key ? "bg-neutral-700" : ""
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  type === t.key ? "text-white" : "text-neutral-500"
                }`}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Amount input */}
        <View>
          <Text className="text-neutral-500 text-xs font-medium tracking-wide mb-2">AMOUNT (€)</Text>
          <TextInput
            className="bg-neutral-800/50 border border-neutral-700/50 text-white text-2xl font-bold px-4 py-4 rounded-2xl"
            placeholderTextColor="#404040"
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        {/* Description input */}
        <View>
          <Text className="text-neutral-500 text-xs font-medium tracking-wide mb-2">
            DESCRIPTION (OPTIONAL)
          </Text>
          <TextInput
            className="bg-neutral-800/50 border border-neutral-700/50 text-white text-base px-4 py-3.5 rounded-2xl"
            placeholderTextColor="#404040"
            placeholder="What is this for?"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Error */}
        {error && (
          <Text className="text-red-400 text-sm text-center">{error}</Text>
        )}

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          className={`py-4 rounded-2xl items-center bg-white ${
            submitting ? "opacity-50" : "active:opacity-80"
          }`}
        >
          {submitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-black text-base font-bold">
              Log {activeType.label}
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
