import Header from "@/components/ui/Header";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function NotificationsScreen() {
    return (
        <View style={styles.container}>
            <Header title="Notifications" />
            {/* Content will be added when available */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
});
