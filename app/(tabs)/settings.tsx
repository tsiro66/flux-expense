import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useAuth } from "@/contexts/auth-context";
import { useNetBalance } from "@/hooks/use-net-balance";

export default function SettingsScreen() {
  const { user, partner, signOut } = useAuth();
  const { balance } = useNetBalance();

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <Text className="text-white text-2xl font-bold px-4 pt-4 pb-6">
        Settings
      </Text>

      <View className="px-4 gap-4">
        {/* User info */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 gap-3">
          <View>
            <Text className="text-neutral-500 text-xs">YOU</Text>
            <Text className="text-white text-base font-medium">
              {user?.display_name ?? "—"}
            </Text>
          </View>
          <View className="h-px bg-neutral-800" />
          <View>
            <Text className="text-neutral-500 text-xs">PARTNER</Text>
            <Text className="text-white text-base font-medium">
              {partner?.display_name ?? "—"}
            </Text>
          </View>
          <View className="h-px bg-neutral-800" />
          <View>
            <Text className="text-neutral-500 text-xs">NET BALANCE</Text>
            <Text
              className={`text-base font-medium ${
                balance > 0
                  ? "text-green-400"
                  : balance < 0
                    ? "text-red-400"
                    : "text-neutral-400"
              }`}
            >
              {balance > 0
                ? `${partner?.display_name ?? "Partner"} owes you €${balance.toFixed(2)}`
                : balance < 0
                  ? `You owe ${partner?.display_name ?? "Partner"} €${Math.abs(balance).toFixed(2)}`
                  : "All settled!"}
            </Text>
          </View>
        </View>

        {/* App info */}
        <View className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <Text className="text-neutral-500 text-xs">APP VERSION</Text>
          <Text className="text-white text-base">
            {Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
        </View>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          className="bg-neutral-900 border border-neutral-800 py-4 rounded-2xl items-center active:opacity-70"
        >
          <Text className="text-neutral-400 text-base font-semibold">
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
