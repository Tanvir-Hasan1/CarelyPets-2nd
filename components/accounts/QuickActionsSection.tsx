import {
    Calendar,
    Heart,
    PawPrint,
    Settings
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MenuItem from "./MenuItem";

const QuickActionsSection = () => {
    return (
        <>
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            <View style={styles.sectionCard}>
                <MenuItem
                    icon={PawPrint}
                    label="Add a Pet"
                    iconColor="#006D77"
                    onPress={() => { }}
                />
                <View style={styles.divider} />
                <MenuItem
                    icon={Heart}
                    label="Adopt a Pet"
                    iconColor="#006D77"
                    onPress={() => { }}
                />
                <View style={styles.divider} />
                <MenuItem
                    icon={Calendar}
                    label="Book a Service"
                    iconColor="#006D77"
                    onPress={() => { }}
                />
                <View style={styles.divider} />
                <MenuItem
                    icon={Settings}
                    label="Settings & Policy"
                    iconColor="#006D77"
                    onPress={() => { }}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 8,
        marginTop: 4,
        marginLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    sectionCard: {
        backgroundColor: "#FFFFFF",
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
    divider: {
        height: 1,
        backgroundColor: "#cccdcfff",
        marginLeft: 38, // Indent to align with text
    },
});

export default QuickActionsSection;
