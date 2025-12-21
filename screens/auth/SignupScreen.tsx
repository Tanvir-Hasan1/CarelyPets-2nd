import GoogleIcon from "@/assets/images/icons/Google.svg";
import Lock from "@/assets/images/icons/lock.svg";
import Mail from "@/assets/images/icons/mail.svg";
import User from "@/assets/images/icons/user.svg";
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
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading: authLoading, error: authError, clearError } = useAuthStore();

  // Clear error when inputs change
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [name, email, password]);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return;
    }

    if (password.length < 6) {
      // Local validation could be added here if desired, but register action also handles it
    }

    const success = await register(name, email, password);

    if (success) {
      router.push({
        pathname: "/(auth)/verifyEmailOTP",
        params: { email },
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      console.log("Google signup initiated");
      // Implement Google signup logic here
    } catch (err) {
      console.error("Google signup error:", err);
    }
  };

  const keyboardOffset = Platform.OS === "ios" ? 90 : 20;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={keyboardOffset}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={(r) => {
            scrollRef.current = r;
          }}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Spacing.xl * 2 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <ClawHeader />
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>Create an Account !</Text>
            <Text style={styles.subtitle}>
              Sign up to experience everything we have to offer.
            </Text>
          </View>

          {/* Error Message */}
          {authError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{authError}</Text>
            </View>
          ) : null}

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>NAME</Text>
            <View style={styles.inputWithIcon}>
              <User width={20} height={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.placeholder}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!authLoading}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <View style={styles.inputWithIcon}>
              <Mail width={20} height={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!authLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PASSWORD</Text>
            <View style={styles.passwordInputContainer}>
              <Lock width={24} height={24} style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={Colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!authLoading}
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOff width={24} height={24} />
                ) : (
                  <Eye width={24} height={24} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, authLoading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Signup */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignup}
            disabled={authLoading}
          >
            <GoogleIcon style={styles.googleIcon} width={28} height={28} />
            <Text style={styles.googleButtonText}>Google</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
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
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
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
  },
  eyeIcon: {
    paddingHorizontal: Spacing.md,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  googleIcon: {
    marginRight: Spacing.sm,
  },
  googleButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  loginText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
});
