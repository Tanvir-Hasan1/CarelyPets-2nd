import Header from '@/components/ui/Header';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// SVG Icons
import EditIcon from "@/assets/images/icons/edit-black.svg";

interface InfoRowProps {
    label: string;
    value: string | undefined;
    isLast?: boolean;
}

const InfoRow = ({ label, value, isLast }: InfoRowProps) => (
    <View style={[styles.infoRow, !isLast && styles.rowDivider]}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
    </View>
);

export default function PersonalInformationScreen() {
    const router = useRouter();
    const { user } = useAuthStore();

    const handleEdit = () => {
        router.push("/(tabs)/account/settings-and-policy/edit-profile");
    };

    return (
        <View style={styles.container}>
            <Header title="Personal Information" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <InfoRow label="NAME" value={user?.name} />
                    <InfoRow label="USERNAME" value={user?.username ? `@${user.username}` : undefined} />
                    <InfoRow label="EMAIL" value={user?.email} />
                    <InfoRow label="COUNTRY" value={user?.country || user?.location?.country} />
                    <InfoRow label="ADDRESS" value={user?.address} />
                    <InfoRow label="PHONE NO." value={user?.phone} />
                    <InfoRow label="FAVORITE PETS" value={user?.favorites?.join(', ')} isLast />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEdit}
                        activeOpacity={0.8}
                    >
                        <EditIcon width={20} height={20} color="#FFFFFF" />
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: Spacing.md,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: Spacing.md,
        paddingVertical: 4,
        marginBottom: Spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    infoRow: {
        paddingVertical: 14,
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: FontWeights.bold,
        color: '#9CA3AF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: FontSizes.md,
        color: '#374151',
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: Spacing.sm,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary, // Match the primary color/screenshot
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: FontWeights.bold,
    },
});