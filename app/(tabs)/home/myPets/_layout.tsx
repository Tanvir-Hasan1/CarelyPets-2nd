import { Stack } from "expo-router";

export default function MyPetsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
            <Stack.Screen name="all-pets" options={{ headerShown: false }} />
            <Stack.Screen name="add-pet" options={{ headerShown: false }} />
            <Stack.Screen name="edit-pet/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="health-records-list" options={{ headerShown: false }} />
            <Stack.Screen name="add-health-record" options={{ headerShown: false }} />
            <Stack.Screen name="record-details" options={{ headerShown: false }} />
        </Stack>
    );
}
