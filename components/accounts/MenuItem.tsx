import { ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
    icon: any;
    label: string;
    onPress?: () => void;
    showChevron?: boolean;
    textColor?: string;
    iconColor?: string;
}

const MenuItem = ({
    icon: Icon,
    label,
    onPress,
    showChevron = false,
    textColor = "#1F2937",
    iconColor = "#006D77", // Teal-ish default
}: MenuItemProps) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <Icon size={24} color={iconColor} strokeWidth={1.5} />
            <Text style={[styles.menuItemLabel, { color: textColor }]}>{label}</Text>
        </View>
        {showChevron && <ChevronRight size={20} color="#9CA3AF" />}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
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

export default MenuItem;
