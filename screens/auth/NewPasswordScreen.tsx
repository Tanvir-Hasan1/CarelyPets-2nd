// app/screens/NewPasswordScreen.tsx

import Lock from "@/assets/images/icons/lock.svg";
import Eye from "@/assets/images/icons/view.svg";
import EyeOff from "@/assets/images/icons/view_black.svg";
import ClawHeader from "@/components/ui/ClawHeader";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function NewPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const confirmPasswordRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePasswordReset = async () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Basic validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      setSuccess("Password has been reset successfully!");

      // Navigate to login after a delay
      setTimeout(() => {
        router.replace("../PC-Successful");
      }, 2000);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Focus handler for confirm password input
  const handleConfirmPasswordFocus = () => {
    // Scroll to make button visible when confirm password is focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <ClawHeader />
            </View>

            {/* Title Section */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>New Password</Text>
              <Text style={styles.subtitle}>
                Set a new password and continue using this app.
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Success Message */}
            {success ? (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{success}</Text>
              </View>
            ) : null}

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>NEW PASSWORD</Text>
              <View style={styles.passwordInputContainer}>
                <Lock width={24} height={24} style={styles.inputIcon} />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={Colors.placeholder}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setError(""); // Clear error when user types
                  }}
                  secureTextEntry={!showNewPassword}
                  editable={!loading}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    confirmPasswordRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showNewPassword ? (
                    <EyeOff width={24} height={24} />
                  ) : (
                    <Eye width={24} height={24} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <View style={styles.passwordInputContainer}>
                <Lock width={24} height={24} style={styles.inputIcon} />
                <TextInput
                  ref={confirmPasswordRef}
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={Colors.placeholder}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError(""); // Clear error when user types
                  }}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={handlePasswordReset}
                  onFocus={handleConfirmPasswordFocus}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff width={24} height={24} />
                  ) : (
                    <Eye width={24} height={24} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Button positioned right below input fields */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.doneButton, loading && styles.disabledButton]}
                onPress={handlePasswordReset}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.background} />
                ) : (
                  <Text style={styles.doneButtonText}>Done</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? Spacing.md : Spacing.lg,
    marginBottom: Spacing.xl,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  errorContainer: {
    backgroundColor: "#FFE0E0",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
  },
  successContainer: {
    backgroundColor: "#E0FFE0",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  successText: {
    color: "#2E7D32",
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  eyeIcon: {
    paddingHorizontal: Spacing.sm,
  },
  // Button container positioned right below input fields
  buttonContainer: {
    marginBottom: Spacing.xl,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  doneButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
});
