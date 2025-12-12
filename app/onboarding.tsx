import { Onboarding1Screen } from "@/screens/onboarding/Onboarding1Screen";
import { Onboarding2Screen } from "@/screens/onboarding/Onboarding2Screen";
import { Onboarding3Screen } from "@/screens/onboarding/Onboarding3Screen";
import { Onboarding4Screen } from "@/screens/onboarding/Onboarding4Screen";
import Onboarding5Screen from "@/screens/onboarding/Onboarding5Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function OnboardingScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const router = useRouter();

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.push("../login");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const handleNext = async () => {
    if (currentScreen === 4) {
      try {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        router.push("../login");
      } catch (error) {
        console.error("Error saving onboarding status:", error);
      }
    } else {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <Onboarding1Screen onNext={handleNext} onSkip={handleSkip} />;
      case 1:
        return (
          <Onboarding2Screen
            onNext={handleNext}
            onSkip={handleSkip}
            onPrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <Onboarding3Screen
            onNext={handleNext}
            onSkip={handleSkip}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <Onboarding4Screen onNext={handleNext} onPrevious={handlePrevious} />
        );
      case 4:
        return (
          <Onboarding5Screen onNext={handleNext} onPrevious={handlePrevious} />
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
