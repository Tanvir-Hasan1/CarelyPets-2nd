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
      <Stack.Screen name="forgetPassword/index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="signup/index" />
    </Stack>
  );
}
