import Header from "@/components/ui/Header";
import { useRouter } from "expo-router";
import { Scissors } from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MOCK_SERVICES = [
    {
        id: "1",
        service: "Grooming",
        price: 250.0,
        date: "Tuesday, Oct 25, 2026",
        status: "Processing",
    },
    {
        id: "2",
        service: "Grooming",
        price: 250.0,
        date: "Tuesday, Oct 25, 2026",
        status: "Completed",
    },
];

const FILTER_TABS = ["All", "Processing", "Completed"];

export default function ServiceHistoryScreen() {
    const [activeTab, setActiveTab] = useState("All");
    const router = useRouter();

    const filteredServices = MOCK_SERVICES.filter((s) =>
        activeTab === "All" ? true : s.status === activeTab
    );

    const renderServiceItem = ({ item }: { item: typeof MOCK_SERVICES[0] }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Scissors size={20} color="#006D77" />
                    </View>
                </View>
                <View style={styles.serviceInfo}>
                    <Text style={styles.label}>SERVICE</Text>
                    <Text style={styles.serviceName}>{item.service}</Text>
                    <Text style={styles.label}>DATA & TIME</Text>
                    <Text style={styles.dateTime}>{item.date}</Text>
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

            <Text style={styles.price}>${item.price.toFixed(2)}</Text>

            <TouchableOpacity
                style={styles.viewButton}
                onPress={() => router.push(`/(tabs)/account/service-history/${item.id}`)}
            >
                <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="Service History" />

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
                data={filteredServices}
                renderItem={renderServiceItem}
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
        backgroundColor: "#A5F3FC", // Light cyan from screenshot
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
        paddingBottom: 80,
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
    },
    iconContainer: {
        marginRight: 12,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    serviceInfo: {
        flex: 1,
    },
    label: {
        fontSize: 10,
        color: "#6B7280",
        letterSpacing: 0.5,
        fontWeight: "500",
        marginBottom: 2,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
    },
    dateTime: {
        fontSize: 14,
        color: "#4B5563",
        fontWeight: "500",
    },
    statusBadge: {
        position: "absolute",
        right: 0,
        top: 0,
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
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginVertical: 12,
    },
    viewButton: {
        backgroundColor: "#B2EBF2", // Cyan color per screenshot
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
