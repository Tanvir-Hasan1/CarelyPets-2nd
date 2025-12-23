import DeleteModal from '@/components/ui/DeleteModal';
import Header from '@/components/ui/Header';
import RecoverAccountModal from '@/components/ui/RecoverAccountModal';
import { Colors, FontSizes, FontWeights, Spacing } from '@/constants/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// SVG Icons
import ArrowRightIcon from "@/assets/images/icons/arrow-right.svg";
import EditIcon from "@/assets/images/icons/edit-black.svg";
import LockIcon from "@/assets/images/icons/lock-black.svg";
import NotesIcon from "@/assets/images/icons/notes.svg";
import PrivacyIcon from "@/assets/images/icons/privacy.svg";
import UserIcon from "@/assets/images/icons/user.svg";

interface SettingsItemProps {
    icon?: any;
    label: string;
    onPress?: () => void;
    labelColor?: string;
    showChevron?: boolean;
}

const SettingsItem = ({ icon: Icon, label, onPress, labelColor = Colors.text, showChevron = true }: SettingsItemProps) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardContent}>
            {Icon && (
                <View style={styles.iconContainer}>
                    <Icon width={22} height={22} color={Colors.textSecondary} />
                </View>
            )}
            <Text style={[styles.label, { color: labelColor, textAlign: Icon ? 'left' : 'center', flex: 1 }]}>
                {label}
            </Text>
            {showChevron && (
                <ArrowRightIcon width={18} height={18} color="#9CA3AF" />
            )}
        </View>
    </TouchableOpacity>
);

export default function SettingsAndPolicyScreen() {
    const router = useRouter();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [recoverModalVisible, setRecoverModalVisible] = useState(false);

    const handleDeleteAccount = () => {
        setDeleteModalVisible(false);
        // Implementation for account deletion would go here
        console.log("Account deleted");
    };

    const handleRecoverAccount = () => {
        setRecoverModalVisible(false);
        // Implementation for account recovery would go here
        console.log("Account recovered");
    };

    return (
        <View style={styles.container}>
            <Header title="Settings & Policy" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <SettingsItem
                        icon={UserIcon}
                        label="Personal Information"
                        onPress={() => router.push("/account/settings-and-policy/personal-information")}
                    />
                    <SettingsItem
                        icon={EditIcon}
                        label="Edit Profile"
                        onPress={() => { router.push("/account/settings-and-policy/edit-profile") }}
                    />
                    <SettingsItem
                        icon={LockIcon}
                        label="Change Password"
                        onPress={() => { router.push("/account/settings-and-policy/changepassword") }}
                    />
                    <SettingsItem
                        icon={NotesIcon}
                        label="Terms & Conditions"
                        onPress={() => { router.push("/account/settings-and-policy/terms-and-conditions") }}
                    />
                    <SettingsItem
                        icon={PrivacyIcon}
                        label="Privacy & Policy"
                        onPress={() => { router.push("/account/settings-and-policy/privacy-policy") }}
                    />
                </View>

                <View style={styles.footerSection}>
                    <SettingsItem
                        label="Delete Account"
                        labelColor={Colors.error}
                        showChevron={false}
                        onPress={() => setDeleteModalVisible(true)}
                    />
                    <SettingsItem
                        label="Recover Account"
                        labelColor={Colors.primary}
                        showChevron={false}
                        onPress={() => setRecoverModalVisible(true)}
                    />
                </View>
            </ScrollView>

            <DeleteModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={handleDeleteAccount}
                title="Are you sure you want to delete your account?"
                description="By deleting your account you won't be able to access your pets and services again. If you still want to continue press 'Delete'."
            />

            <RecoverAccountModal
                visible={recoverModalVisible}
                onClose={() => setRecoverModalVisible(false)}
                onConfirm={handleRecoverAccount}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    footerSection: {
        gap: Spacing.sm,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 10,
    },
    label: {
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
    },
});