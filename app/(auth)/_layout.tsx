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
      <Stack.Screen name="forgetScreen" />
      <Stack.Screen name="newPassword" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verifyCode" />
      <Stack.Screen name="otpVerify" />
      <Stack.Screen name="PC-Successful" />
    </Stack>
  );
}
