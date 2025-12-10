// app/screens/VerifyCodeScreen.tsx

import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
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

export default function VerifyCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || "example@gmail.com";

  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60); // 60 seconds timer for resend
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;

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

    // If last digit entered, automatically verify
    if (numericText && index === 3) {
      const fullCode = newCode.join("");
      if (fullCode.length === 4) {
        handleVerify();
      }
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    // Handle backspace to move to previous input
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 4) {
      alert("Please enter the 4-digit verification code");
      return;
    }

    setLoading(true);

    // Simulate API call for verification
    setTimeout(() => {
      setLoading(false);
      // For demo, assume code is valid if it's 1234
      if (verificationCode === "1234") {
        alert("Verification successful!");
        router.push("../otpVerify");
      } else {
        alert("Invalid verification code. Please try again.");
      }
    }, 1500);
  };

  const handleResendCode = () => {
    if (!canResend) return;

    setLoading(true);

    // Simulate resend API call
    setTimeout(() => {
      setLoading(false);
      setTimer(60);
      setCanResend(false);
      setCode(["", "", "", ""]);
      inputRefs.current[0]?.focus();
      alert("New verification code has been sent to your email.");
    }, 1000);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Text container */}
          <View style={styles.TextContainer}>
            <Text style={styles.title}>Verify Code</Text>
            <Text style={styles.subtitle}>We sent OTP code to your email.</Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.instructionText}>
              Enter the code below to verify.
            </Text>
          </View>

          {/* Code Input Container */}
          <View style={styles.codeContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TouchableWithoutFeedback
                key={`touch-${index}`}
                onPress={() => inputRefs.current[index]?.focus()}
              >
                <View style={styles.codeInputWrapper}>
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.codeInput}
                    value={code[index]}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    autoFocus={index === 0}
                    editable={!loading}
                    selectTextOnFocus
                    caretHidden={false}
                    contextMenuHidden={true}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.disabledButton]}
            onPress={handleVerify}
            disabled={loading || code.join("").length !== 4}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          {/* Resend Code Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Don't receive OTP?</Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={!canResend || loading}
              style={styles.resendButton}
            >
              <Text
                style={[
                  styles.resendButtonText,
                  (!canResend || loading) && styles.disabledResendText,
                ]}
              >
                Resend again {!canResend && `(${timer}s)`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLoginContainer}
            onPress={() => router.push("../login")}
            disabled={loading}
          >
            <Text style={styles.backToLoginText}>&lt; Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  verifyButton: {
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
  verifyButtonText: {
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
  backToLoginContainer: {
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.primary,
  },
});
