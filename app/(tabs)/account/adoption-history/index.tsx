import Header from "@/components/ui/Header";
import { useRouter } from "expo-router";
import { Package } from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MOCK_ADOPTIONS = [
    {
        id: "1",
        orderId: "5559599",
        price: 250.0,
        date: "Jul 4, 2025",
        status: "Processing",
    },
    {
        id: "2",
        orderId: "5559599",
        price: 250.0,
        date: "Jul 4, 2025",
        status: "Delivered",
    },
];

const FILTER_TABS = ["All", "Processing", "Delivered"];

export default function AdoptionHistoryScreen() {
    const [activeTab, setActiveTab] = useState("All");
    const router = useRouter();

    const filteredAdoptions = MOCK_ADOPTIONS.filter((a) =>
        activeTab === "All" ? true : a.status === activeTab
    );

    const renderAdoptionItem = ({ item }: { item: typeof MOCK_ADOPTIONS[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.leftCardSection}>
                    <View style={styles.iconCircle}>
                        <Package size={24} color="#111827" />
                    </View>
                    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                </View>

                <View style={styles.adoptionInfo}>
                    <Text style={styles.label}>ORDER ID</Text>
                    <Text style={styles.idValue}>{item.orderId}</Text>
                    <Text style={[styles.label, { marginTop: 4 }]}>ORDER DATE</Text>
                    <Text style={styles.dateValue}>{item.date}</Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor:
                                item.status === "Processing" ? "#FEF3C7" : "#DCFCE7",
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: item.status === "Processing" ? "#92400E" : "#166534" },
                        ]}
                    >
                        {item.status}
                    </Text>
                    <View
                        style={[
                            styles.statusDot,
                            {
                                backgroundColor:
                                    item.status === "Processing" ? "#B45309" : "#15803D",
                            },
                        ]}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={styles.viewButton}
                onPress={() => router.push(`/(tabs)/account/adoption-history/${item.id}`)}
            >
                <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="Adoption History" />

            <View style={styles.tabContainer}>
                {FILTER_TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab,
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredAdoptions}
                renderItem={renderAdoptionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    tabContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    activeTab: {
        backgroundColor: "#A5F3FC",
        borderColor: "#A5F3FC",
    },
    tabText: {
        fontSize: 14,
        color: "#4B5563",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#006064",
        fontWeight: "600",
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 80, // Matching user preference
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        position: "relative",
        marginBottom: 12,
    },
    leftCardSection: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    adoptionInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 10,
        color: "#6B7280",
        letterSpacing: 0.5,
        fontWeight: "500",
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    idValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    dateValue: {
        fontSize: 14,
        color: "#4B5563",
        fontWeight: "500",
    },
    statusBadge: {
        position: "absolute",
        right: 0,
        top: 4,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    viewButton: {
        backgroundColor: "#B2EBF2",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
    },
    viewButtonText: {
        color: "#006064",
        fontSize: 16,
        fontWeight: "bold",
    },
});
