// app/screens/EmailVerifiedSuccessScreen.tsx

import Tick from "@/assets/images/icons/tick.svg";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EmailVerifySuccessScreen() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to profile setup or home screen
    router.replace("./setupProfile"); // Or navigate to profile setup screen
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Tick width={70} height={70} />
      </View>

      {/* Text Container */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Successfully Verified</Text>
        <Text style={styles.subtitle}>
          Your email is verified. Now fill the important data to complete{"\n"}
          finishing your profile setup.
        </Text>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: Spacing.md,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    width: "100%",
  },
  nextButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
});
