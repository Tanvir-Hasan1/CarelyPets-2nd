// app/screens/EmailVerificationErrorScreen.tsx

import ErrorIcon from "@/assets/images/icons/cross.svg"; // You'll need an error icon
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

export default function EmailVerificationErrorScreen() {
  const router = useRouter();

  const handleRetry = () => {
    // Go back to OTP screen to retry
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("../verifyEmailOTP");
    }
  };

  return (
    <View style={styles.container}>
      {/* Error Icon - replace with your actual error icon */}
      <View style={styles.iconContainer}>
        <ErrorIcon width={70} height={70} />
      </View>

      {/* Text Container */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.subtitle}>
          Your code is incorrect please try again.
        </Text>
      </View>

      {/* Retry Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
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
  errorIconPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  errorIconText: {
    fontSize: 48,
    fontWeight: FontWeights.bold,
    color: Colors.background,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.error,
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
  retryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    width: "100%",
  },
  retryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
});
