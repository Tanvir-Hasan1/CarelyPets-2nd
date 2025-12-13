import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
      <Stack.Screen name="forgetPassword/index" />
      <Stack.Screen name="newPassword/index" />

      <Stack.Screen name="signup/index" />
      <Stack.Screen name="verifyCode/index" />
      <Stack.Screen name="otpVerify/index" />
      <Stack.Screen name="PC-Successful/index" />
      <Stack.Screen name="changePassword/index" />
      <Stack.Screen name="verifyEmailOTP/index" />
      <Stack.Screen name="emailVerify/index" />
      <Stack.Screen name="emailVerifyError/index" />
      <Stack.Screen name="setupProfile/index" />
    </Stack>
  );
}
