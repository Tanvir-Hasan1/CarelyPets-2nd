import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const STRIPE_PUBLIC_KEY =
  "pk_test_51Sj2dXEuf4ZHOjkvBoYzpoqRsUNUf0f3Q9UPMEkGFBkRF50xjQ10Z8L74aeYSNbVdzXK6S9hfXYi7ztisdIDfQTu008t0JLLPZ";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </StripeProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
