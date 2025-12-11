import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="onboarding/index"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="forgetScreen/index" />
      <Stack.Screen name="newPassword" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verifyCode" />
      <Stack.Screen name="otpVerify" />
      <Stack.Screen name="PC-Successful" />
      <Stack.Screen name="changePassword" />
      <Stack.Screen name="verifyEmailOTP" />
      <Stack.Screen name="emailVerify" />
      <Stack.Screen name="emailVerifyError" />
      <Stack.Screen name="setupProfile" />
    </Stack>
  );
}
