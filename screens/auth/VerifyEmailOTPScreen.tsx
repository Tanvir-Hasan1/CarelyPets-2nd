import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

export default function VerifyEmailOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || "example@gmail.com";

  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60); // 60 seconds timer for resend
  const [canResend, setCanResend] = useState(false);

  const { verifyEmail, isLoading: authLoading, error: authError, clearError } = useAuthStore();

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Clear error when code changes
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [code]);

  // Timer for resend OTP
  useEffect(() => {
    let interval: any;

    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, canResend]);

  const handleCodeChange = (text: string, index: number) => {
    // Allow only numbers
    const numericText = text.replace(/[^0-9]/g, "");

    // Update the code array
    const newCode = [...code];
    newCode[index] = numericText.slice(0, 1); // Take only first character
    setCode(newCode);

    // Auto-focus next input
    if (numericText && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    // Handle backspace to move to previous input
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 4) return;

    const result = await verifyEmail(email, verificationCode);

    if (result.success) {
      if (result.needsProfileSetup) {
        router.replace("/(auth)/setupProfile");
      } else {
        router.replace("/(tabs)/home");
      }
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;

    // Simulate resend API call
    // In a real app, you'd call a resend OTP endpoint
    setTimer(60);
    setCanResend(false);
    setCode(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {/* Text container */}
            <View style={styles.TextContainer}>
              <Text style={styles.title}>Verify Email</Text>
              <Text style={styles.subtitle}>
                We Sent OTP code to your email
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.instructionText}>
                Enter the code below to verify.
              </Text>
            </View>

            {/* Error Message */}
            {authError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{authError}</Text>
              </View>
            ) : null}

            {/* Code Input Container */}
            <View style={styles.codeContainer}>
              {[0, 1, 2, 3].map((index) => (
                <TouchableWithoutFeedback
                  key={`touch-${index}`}
                  onPress={() => inputRefs.current[index]?.focus()}
                >
                  <View style={styles.codeInputWrapper}>
                    <TextInput
                      ref={(ref) => { inputRefs.current[index] = ref; }}
                      style={styles.codeInput}
                      value={code[index]}
                      onChangeText={(text) => handleCodeChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      autoFocus={index === 0}
                      editable={!authLoading}
                      selectTextOnFocus
                      caretHidden={false}
                      contextMenuHidden={true}
                    />
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>

            {/* Next Button */}
            <TouchableOpacity
              style={[styles.nextButton, authLoading && styles.disabledButton]}
              onPress={handleVerify}
              disabled={authLoading || code.join("").length !== 4}
            >
              {authLoading ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.nextButtonText}>Next</Text>
              )}
            </TouchableOpacity>

            {/* Resend Code Section */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Don't receive OTP?</Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={!canResend || authLoading}
                style={styles.resendButton}
              >
                <Text
                  style={[
                    styles.resendButtonText,
                    (!canResend || authLoading) && styles.disabledResendText,
                  ]}
                >
                  Resend again {!canResend && `(${timer}s)`}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  errorContainer: {
    backgroundColor: "#FFE0E0",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    width: "100%",
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    textAlign: "center",
  },
  TextContainer: {
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
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  emailText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  instructionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  codeInputWrapper: {
    width: 60,
    height: 60,
  },
  codeInput: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGray,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    padding: 0,
    margin: 0,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginBottom: Spacing.lg,
    width: "100%",
  },
  disabledButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    flexWrap: "wrap",
  },
  resendText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  resendButton: {
    padding: Spacing.xs,
  },
  resendButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  disabledResendText: {
    opacity: 0.5,
  },
});
