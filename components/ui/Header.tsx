import {
    Colors,
    FontSizes,
    FontWeights,
    Spacing,
} from "@/constants/colors";
import {
    ArrowLeft02Icon,
    Notification02Icon,
    ShoppingBag02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
    title: string;
    onBackPress?: () => void;
    showActions?: boolean;
    style?: ViewStyle;
}

export default function Header({ 
    title, 
    onBackPress, 
    showActions = true, 
    style 
}: HeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <View style={[styles.header, { paddingTop: insets.top }, style]}>
            <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            
            {showActions ? (
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <HugeiconsIcon icon={ShoppingBag02Icon} size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <HugeiconsIcon icon={Notification02Icon} size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ width: 44 }} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'relative',
        backgroundColor: "#F8F9FA",
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    headerTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: "#006064",
        lineHeight: 32,
        includeFontPadding: false,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
        marginLeft: Spacing.xl,
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    iconButton: {
        padding: Spacing.xs,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderWidth: 1,
        borderColor: Colors.border,
    },
});
