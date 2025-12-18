import { Colors } from "@/constants/colors";
import { Bell } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";

interface NotificationSectionProps {
    notificationsEnabled: boolean;
    setNotificationsEnabled: (value: boolean) => void;
}

const NotificationSection = ({
    notificationsEnabled,
    setNotificationsEnabled,
}: NotificationSectionProps) => {
    return (
        <View style={styles.sectionCard}>
            <View style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                    <Bell size={24} color="#006D77" strokeWidth={1.5} />
                    <Text style={styles.menuItemLabel}>Notification</Text>
                </View>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: "#E5E7EB", true: Colors.primary }}
                    thumbColor={"#FFFFFF"}
                    ios_backgroundColor="#E5E7EB"
                    style={Platform.OS === 'ios' ? { transform: [{ scale: 0.8 }] } : {}}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "transparent",
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 0.5,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    menuItemLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1F2937",
    },
});

export default NotificationSection;
