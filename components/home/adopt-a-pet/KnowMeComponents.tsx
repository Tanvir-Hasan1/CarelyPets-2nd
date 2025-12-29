import { Colors, FontWeights, Spacing } from "@/constants/colors/index";
import { ArrowLeft02Icon, House01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ShelterInfoCardProps {
    name: string;
    phone: string;
    price: string;
}

export const ShelterInfoCard = ({ name, phone, price }: ShelterInfoCardProps) => (
    <View style={styles.shelterCard}>
        <View style={styles.shelterLeft}>
            <View style={styles.shelterIconContainer}>
                <HugeiconsIcon icon={House01Icon} size={24} color="#00BCD4" />
            </View>
            <View style={styles.shelterTextContainer}>
                <Text style={styles.shelterLabel}>Shelter Information</Text>
                <Text style={styles.shelterName}>{name}</Text>
                <Text style={styles.shelterPhone}>{phone}</Text>
            </View>
        </View>
        <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${price}</Text>
        </View>
    </View>
);

interface HealthRecordItemProps {
    title: string;
    date: string;
    icon: any;
    color: string;
    onPress?: () => void;
}

export const HealthRecordItem = ({ title, date, icon, color, onPress }: HealthRecordItemProps) => (
    <TouchableOpacity style={styles.healthItem} onPress={onPress}>
        <View style={[styles.healthIconContainer, { backgroundColor: color + '15' }]}>
            <HugeiconsIcon icon={icon} size={20} color={color} />
        </View>
        <View style={styles.healthTextContainer}>
            <Text style={styles.healthTitle}>{title}</Text>
            <Text style={styles.healthDate}>{date}</Text>
        </View>
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} color={Colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
    </TouchableOpacity>
);

interface PersonalityTagProps {
    label: string;
    color: string;
}

export const PersonalityTag = ({ label, color }: PersonalityTagProps) => (
    <View style={[styles.personalityTag, { backgroundColor: color + '15' }]}>
        <Text style={[styles.personalityText, { color: color }]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    shelterCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: Spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        marginVertical: Spacing.sm,
    },
    shelterLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    shelterIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E0F7FA",
        alignItems: "center",
        justifyContent: "center",
        marginRight: Spacing.sm,
    },
    shelterTextContainer: {
        flex: 1,
    },
    shelterLabel: {
        fontSize: 12,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        marginBottom: 2,
    },
    shelterName: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    shelterPhone: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    priceContainer: {
        alignItems: "flex-end",
    },
    priceLabel: {
        fontSize: 12,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 18,
        fontWeight: FontWeights.bold,
        color: "#00BCD4",
    },
    healthItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: "#F3F4F6",
    },
    healthIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Spacing.md,
    },
    healthTextContainer: {
        flex: 1,
    },
    healthTitle: {
        fontSize: 14,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    healthDate: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    arrowIcon: {
        marginLeft: Spacing.xs,
    },
    personalityTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: Spacing.xs,
        marginBottom: Spacing.xs,
    },
    personalityText: {
        fontSize: 12,
        fontWeight: FontWeights.medium,
    },
});
