// app/screens/ChangePasswordScreen.tsx

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

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePasswordChange = async () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password should be at least 6 characters");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for password change
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success - show success message briefly
      setSuccess("Password has been changed successfully!");

      // Navigate to PC-Successful screen after a brief delay
      setTimeout(() => {
        router.replace("../PC-Successful");
      }, 1500);
    } catch (err) {
      setError("Failed to change password. Please try again.");
      console.error("Password change error:", err);
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
              <Text style={styles.title}>Change Password</Text>
              <Text style={styles.subtitle}>
                Set a new password and secure your privacy
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

            {/* Current Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>CURRENT PASSWORD</Text>
              <View style={styles.passwordInputContainer}>
                <Lock width={24} height={24} style={styles.inputIcon} />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor={Colors.placeholder}
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    setError(""); // Clear error when user types
                  }}
                  secureTextEntry={!showCurrentPassword}
                  editable={!loading}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    newPasswordRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showCurrentPassword ? (
                    <EyeOff width={24} height={24} />
                  ) : (
                    <Eye width={24} height={24} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>NEW PASSWORD</Text>
              <View style={styles.passwordInputContainer}>
                <Lock width={24} height={24} style={styles.inputIcon} />
                <TextInput
                  ref={newPasswordRef}
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
                  onSubmitEditing={handlePasswordChange}
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
                onPress={handlePasswordChange}
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
    marginTop: Spacing.xl,
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
