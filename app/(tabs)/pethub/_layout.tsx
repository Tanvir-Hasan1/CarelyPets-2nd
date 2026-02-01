import { Stack } from "expo-router";

export default function PetHubLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create-post" />
      <Stack.Screen name="view-post" />
      <Stack.Screen name="petPal" />
    </Stack>
  );
}
