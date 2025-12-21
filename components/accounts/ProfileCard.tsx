import { User } from "@/services/authService";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
    user: User | null;
    onPress?: () => void;
}

const ProfileCard = ({ user, onPress }: ProfileCardProps) => {
    // Generate a handle from username or name if not available
    const userHandle = user?.username
        ? `@${user.username}`
        : (user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, "")}` : "@user");

    return (
        <TouchableOpacity style={styles.profileCard} onPress={onPress}>
            <View style={styles.profileRow}>
                <Image
                    source={{
                        uri: user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                    }}
                    style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
                    <Text style={styles.profileHandle}>{userHandle}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 0.5,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        backgroundColor: "#E5E7EB",
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    profileHandle: {
        fontSize: 14,
        color: "#6B7280",
    },
});

export default ProfileCard;
