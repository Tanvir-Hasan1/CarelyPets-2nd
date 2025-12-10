import Eye from "@/assets/images/icons/Verify-OTP-sucsess.svg";
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

export default function OtpVerifySuccessScreen() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to reset password screen
    router.push("../newPassword");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Eye width={200} height={200} />

        {/* Text container */}
        <View style={styles.TextContainer}>
          <Text style={styles.title}>Successfully Verified</Text>
          <Text style={styles.subtitle}>
            Please set a new password. To set a new{"\n"}
            password press on continue...
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleContinue} style={styles.Button}>
              <Text style={styles.ButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  TextContainer: {
    marginTop: Spacing.xl,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: Spacing.md,
  },
  Button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  ButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
});
