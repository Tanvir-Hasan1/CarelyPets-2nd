import ClawHeader from "@/components/ui/ClawHeader";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = () => {
    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      alert(
        "If an account with that email exists, a password reset link has been sent."
      );
      router.push("../login");
    }, 2000);
  };
  return (
    <KeyboardAvoidingView
      //   style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView>
        <View /* style={styles.topArea} */>
          <ClawHeader />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
