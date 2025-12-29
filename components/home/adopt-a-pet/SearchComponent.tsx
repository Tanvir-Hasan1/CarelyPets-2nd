import { Colors, Spacing } from "@/constants/colors";
import { FilterHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchComponentProps {
    value: string;
    onChangeText: (text: string) => void;
    onFilterPress?: () => void;
}

export default function SearchComponent({
    value,
    onChangeText,
    onFilterPress,
}: SearchComponentProps) {
    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <HugeiconsIcon icon={Search01Icon} size={20} color={Colors.textSecondary} />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    placeholderTextColor={Colors.textSecondary}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <HugeiconsIcon icon={FilterHorizontalIcon} size={20} color={Colors.text} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        gap: Spacing.sm,
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: Spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    input: {
        flex: 1,
        marginLeft: Spacing.xs,
        fontSize: 14,
        color: Colors.text,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
});
