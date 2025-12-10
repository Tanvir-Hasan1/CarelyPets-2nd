// app/screens/PasswordChangedSuccessScreen.tsx

import Tick from "@/assets/images/icons/tick.svg";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PasswordChangedSuccessScreen() {
  const router = useRouter();

  const handleBackToLogin = () => {
    // Navigate back to login screen
    router.replace("../login");
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Tick width={70} height={70} />
      </View>

      {/* Text Container */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Successfully Changed</Text>
        <Text style={styles.subtitle}>
          Return to the login page to enter your account with your{"\n"}
          new password
        </Text>
      </View>

      {/* Back to Login Button */}
      <TouchableOpacity
        style={styles.backToLoginContainer}
        onPress={() => {
          router.dismissTo("../login");
        }}
      >
        <Text style={styles.backToLoginText}>&lt; Back to Login</Text>
      </TouchableOpacity>
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
  backToLoginContainer: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.primary,
  },
});
