import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { SpaceGrotesk_400Regular } from "@expo-google-fonts/space-grotesk/400Regular";
import { SpaceGrotesk_500Medium } from "@expo-google-fonts/space-grotesk/500Medium";
import { SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk/700Bold";
import { useFonts as useSpaceFonts } from "@expo-google-fonts/space-grotesk/useFonts";
import { Syne_400Regular } from "@expo-google-fonts/syne/400Regular";
import { Syne_500Medium } from "@expo-google-fonts/syne/500Medium";
import { Syne_600SemiBold } from "@expo-google-fonts/syne/600SemiBold";
import { Syne_700Bold } from "@expo-google-fonts/syne/700Bold";
import { Syne_800ExtraBold } from "@expo-google-fonts/syne/800ExtraBold";
import { useFonts as useSyneFonts } from "@expo-google-fonts/syne/useFonts";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0a0a0a",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  if (!session) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0a0a0a" },
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="(tabs)" redirect />
        <Stack.Screen name="index" redirect />
      </Stack>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0a0a0a" },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sign-in" redirect />
      <Stack.Screen name="index" redirect />
      <Stack.Screen
        name="add-transaction"
        options={{
          presentation: "modal",
          headerShown: true,
          headerTitle: "New Transaction",
          headerStyle: { backgroundColor: "#171717" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [syneFontsLoaded] = useSyneFonts({
    Syne_400Regular,
    Syne_500Medium,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
  });

  const [spaceFontsLoaded] = useSpaceFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const fontsLoaded = syneFontsLoaded && spaceFontsLoaded;

  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
