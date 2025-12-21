import { useAuthStore } from "@/store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const checkInitialRoute = async () => {
      try {
        await initializeAuth();
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        const { isAuthenticated } = useAuthStore.getState();

        if (isAuthenticated) {
          router.replace("/(tabs)/home");
        } else if (hasSeenOnboarding === "true") {
          router.replace("/login");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Error during initial routing check:", error);
        router.replace("/onboarding");
      } finally {
        setIsReady(true);
      }
    };

    checkInitialRoute();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <ActivityIndicator size="large" color="#1DAFB6" />
    </View>
  );
}
