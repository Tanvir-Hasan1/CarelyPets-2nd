import { Stack } from "expo-router";

const ChatLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="view-post" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChatLayout;
