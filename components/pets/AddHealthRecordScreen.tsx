import {
    BorderRadius,
    Colors,
    FontSizes,
    FontWeights,
    Spacing,
} from "@/constants/colors";
import {
    ArrowLeft02Icon,
    CheckListIcon,
    CircleIcon,
    Doctor01Icon,
    Medicine02Icon,
    Notification02Icon,
    ShoppingBag02Icon,
    Square01Icon,
    Tick02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecordType {
    id: string;
    label: string;
    icon: any;
    color: string;
    bgColor: string;
}

const RECORD_TYPES: RecordType[] = [
    { id: 'vaccination', label: 'Vaccination', icon: Medicine02Icon, color: '#4CAF50', bgColor: '#E8F5E9' }, // Fallback to Medicine
    { id: 'checkup', label: 'Check-up', icon: Doctor01Icon, color: '#2196F3', bgColor: '#E3F2FD' },
    { id: 'medication', label: 'Medication', icon: Medicine02Icon, color: '#F44336', bgColor: '#FFEBEE' },
    { id: 'tick', label: 'Tick', icon: CircleIcon, color: '#9C27B0', bgColor: '#F3E5F5' }, // Fallback
    { id: 'surgery', label: 'Surgery', icon: Square01Icon, color: '#E91E63', bgColor: '#FCE4EC' }, // Fallback
    { id: 'dental', label: 'Dental', icon: Square01Icon, color: '#FF9800', bgColor: '#FFF3E0' }, // Fallback
    { id: 'other', label: 'Other', icon: CheckListIcon, color: '#757575', bgColor: '#EEEEEE' }, 
];

export default function AddHealthRecordScreen() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Health Record</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.iconButton}>
                            <HugeiconsIcon icon={ShoppingBag02Icon} size={24} color={Colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <HugeiconsIcon icon={Notification02Icon} size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.titleSection}>
                        <Text style={styles.mainTitle}>Add your pet's health record</Text>
                        <Text style={styles.subtitle}>
                            Select the type of health visit or record you'd like to log — from routine checkups to vaccinations, emergencies, and more.
                        </Text>
                    </View>

                    <View style={styles.selectionCard}>
                        <Text style={styles.cardTitle}>Select Record Type</Text>
                        <View style={styles.grid}>
                            {RECORD_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={styles.gridItem}
                                    onPress={() => setSelectedType(type.id)}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: type.bgColor }]}>
                                        <HugeiconsIcon icon={type.icon} size={24} color={type.color} />
                                        {selectedType === type.id && (
                                            <View style={styles.checkmarkContainer}>
                                                <HugeiconsIcon icon={Tick02Icon} size={20} color="#4CAF50" variant="solid" />
                                            </View>
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.gridLabel,
                                        selectedType === type.id && { color: type.color, fontWeight: 'bold' }
                                    ]}>{type.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={[styles.nextButton, !selectedType && styles.disabledButton]} 
                        disabled={!selectedType}
                        onPress={() => {
                            // TODO: Navigate to form input with selected type
                            console.log("Selected:", selectedType);
                            router.back(); // Temporary placeholder
                        }}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: "#006064",
    },
    headerActions: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    iconButton: {
        padding: Spacing.xs,
        borderRadius: 20,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    content: {
        padding: Spacing.lg,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    mainTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    selectionCard: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
        color: Colors.text,
        marginBottom: Spacing.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 0, 
    },
    gridItem: {
        width: '25%', // 4 items per row
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
        position: 'relative',
    },
    checkmarkContainer: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    gridLabel: {
        fontSize: 10,
        color: Colors.text,
        textAlign: 'center',
    },
    footer: {
        padding: Spacing.lg,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    nextButton: {
        backgroundColor: '#00BCD4',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#B2EBF2', // Lighter cyan
    },
    nextButtonText: {
        color: '#ffffff',
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.md,
    },
});
