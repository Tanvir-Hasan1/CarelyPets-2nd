import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="settings-and-policy" options={{ headerShown: false }} />
            <Stack.Screen name="pet-adoption" options={{ headerShown: false }} />
            <Stack.Screen name="add-pet" options={{ headerShown: false }} />
        </Stack>
    );
}
