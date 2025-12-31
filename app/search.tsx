import { Colors, Spacing } from "@/constants/colors";
import { ArrowLeft02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Custom Search Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.searchBarContainer}>
                    <HugeiconsIcon icon={Search01Icon} size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search @username or pet breed"
                        placeholderTextColor="#6B7280"
                        autoFocus
                    />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.searchCard}>
                    <Text style={styles.sectionTitle}>SEARCHING</Text>
                    <Text style={styles.currentSearch}>“Bull dog”</Text>

                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>RECENT SEARCH</Text>
                    <View style={styles.tagContainer}>
                        <TouchableOpacity style={styles.tag}>
                            <Text style={styles.tagText}>Persian Cat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tag}>
                            <Text style={styles.tagText}>Husky</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tag}>
                            <Text style={styles.tagText}>@tuvalyondra</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        gap: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    searchBarContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    content: {
        padding: 20,
    },
    searchCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "600",
        letterSpacing: 0.5,
        marginBottom: 8,
        textTransform: "uppercase",
    },
    currentSearch: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    tagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    tag: {
        backgroundColor: "#F3F4F6",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    tagText: {
        fontSize: 14,
        color: "#4B5563",
        fontWeight: "500",
    },
});
