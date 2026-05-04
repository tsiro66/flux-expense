import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/auth-context";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) return null;

  if (session) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/sign-in" />;
}
