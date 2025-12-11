import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(
          "hasSeenOnboarding"
        );
        setIsOnboardingComplete(hasSeenOnboarding === "true");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnboardingComplete(false);
      }
    };

    checkOnboarding();
  }, []);

  if (isOnboardingComplete === null) {
    return null; // Loading state
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {!isOnboardingComplete ? (
          <Stack.Screen
            name="onboarding"
            options={{
              gestureEnabled: false,
            }}
          />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
