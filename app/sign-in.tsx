import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Enter email and password");
      return;
    }
    setError(null);
    setLoading(true);
    const errMsg = await signIn(email.trim(), password);
    if (errMsg) setError(errMsg);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-neutral-950"
    >
      <View className="flex-1 justify-center px-8 gap-6">
        {/* Logo / Title */}
        <View className="items-center mb-8">
          <Text className="text-white text-4xl font-extrabold uppercase">
            Flux
          </Text>
          <Text className="text-neutral-400 text-base mt-1">
            Expense Tracker
          </Text>
        </View>

        {/* Email */}
        <TextInput
          className="bg-neutral-800/50 border border-neutral-700/50 text-white text-base px-4 py-4 rounded-2xl"
          placeholderTextColor="#404040"
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <View className="flex-row items-center bg-neutral-800/50 border border-neutral-700/50 rounded-2xl">
          <TextInput
            className="flex-1 text-white text-base px-4 py-4"
            placeholderTextColor="#404040"
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
            className="px-4 active:opacity-50"
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#525252"
            />
          </Pressable>
        </View>

        {/* Error */}
        {error && (
          <Text className="text-red-400 text-sm text-center">{error}</Text>
        )}

        {/* Sign In Button */}
        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          className={`bg-white py-4 rounded-2xl items-center mt-2 ${
            loading ? "opacity-50" : "active:opacity-80"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="text-black text-base font-bold">Sign In</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
