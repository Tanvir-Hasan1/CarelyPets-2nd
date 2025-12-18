import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="profile/index" options={{ headerShown: false }} />
            <Stack.Screen name="profile/edit" options={{ headerShown: false }} />
            <Stack.Screen name="profile/create-post" options={{ headerShown: false }} />
            <Stack.Screen name="profile/edit-post" options={{ headerShown: false }} />
        </Stack>
    );
}
