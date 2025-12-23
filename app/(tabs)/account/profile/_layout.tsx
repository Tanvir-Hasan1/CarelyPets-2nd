import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="edit" options={{ headerShown: false }} />
            <Stack.Screen name="create-post" options={{ headerShown: false }} />
            <Stack.Screen name="edit-post" options={{ headerShown: false }} />
            <Stack.Screen name="view-post" options={{ headerShown: false }} />
        </Stack>
    );
}