import { Stack } from 'expo-router';
import React from 'react';

export default function BookingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="confirm" />
            <Stack.Screen name="success" />
            <Stack.Screen name="[id]" />
        </Stack>
    );
}
