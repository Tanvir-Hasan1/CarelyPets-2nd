import Header from "@/components/ui/Header";
import { useLocalSearchParams } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const MOCK_PETS = [
    {
        id: "1",
        name: "Bubby",
        breed: "Persian Cat",
        price: 250.0,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "2",
        name: "Chubby",
        breed: "Stray Cat",
        price: 150.0,
        image: "https://images.unsplash.com/photo-1511275539165-cc46b1ee8960?auto=format&fit=crop&w=100&q=80",
    },
];

export default function AdoptionDetailScreen() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Header title="Adoption View" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Customer Information */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Customer Information</Text>
                        <View style={[styles.statusBadge, { backgroundColor: "#FEF3C7" }]}>
                            <Text style={[styles.statusText, { color: "#92400E" }]}>Pending</Text>
                            <View style={[styles.statusDot, { backgroundColor: "#B45309" }]} />
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ORDER ID</Text>
                        <Text style={styles.infoValue}>5559599</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ORDER DATE</Text>
                        <Text style={styles.infoValue}>Jul 4, 2025</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>NAME</Text>
                        <Text style={styles.infoValue}>John Doe</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ADDRESS</Text>
                        <Text style={styles.infoValue}>43, John Hopkins, NYC</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>PHONE</Text>
                        <Text style={styles.infoValue}>555 666 8898</Text>
                    </View>
                </View>

                {/* List of pets for adoption */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>List of pets for adoption</Text>
                    <View style={styles.petList}>
                        {MOCK_PETS.map((pet) => (
                            <View key={pet.id} style={styles.petItem}>
                                <Image source={{ uri: pet.image }} style={styles.petImage} />
                                <View style={styles.petInfo}>
                                    <Text style={styles.petName}>{pet.name}</Text>
                                    <Text style={styles.petBreed}>{pet.breed}</Text>
                                </View>
                                <View style={styles.petPriceContainer}>
                                    <Text style={styles.infoLabel}>Price</Text>
                                    <Text style={styles.petPrice}>${pet.price.toFixed(2)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Summary</Text>

                    <View style={styles.summaryList}>
                        {MOCK_PETS.map((pet) => (
                            <View key={pet.id} style={styles.summaryItem}>
                                <View>
                                    <Text style={styles.summaryLabel}>{pet.name}</Text>
                                    <Text style={styles.subtitleLabel}>{pet.breed}</Text>
                                </View>
                                <Text style={styles.summaryValue}>$ {pet.price.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={[styles.summaryItem, { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 }]}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>$ 400.00</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={styles.summaryLabel}>Tax</Text>
                            <Text style={[styles.infoLabel, { fontSize: 11 }]}>(5%)</Text>
                        </View>
                        <Text style={styles.summaryValue}>$ 20.00</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Processing fee</Text>
                        <Text style={styles.summaryValue}>$ 40.00</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Shipping cost</Text>
                        <Text style={styles.summaryValue}>$ 40.00</Text>
                    </View>

                    <View style={[styles.summaryItem, { marginTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 }]}>
                        <Text style={[styles.summaryLabel, { fontWeight: 'bold', fontSize: 18, color: '#111827' }]}>Total</Text>
                        <Text style={[styles.summaryValue, { fontWeight: 'bold', fontSize: 18, color: '#111827' }]}>$ 460.00</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footerCard}>
                    <Text style={styles.footerText}>Paid</Text>
                    <CheckCircle2 size={24} color="#10B981" />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 80, // High to clear bar
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    infoRow: {
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 10,
        color: "#6B7280",
        letterSpacing: 0.5,
        fontWeight: "500",
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 16,
        color: "#111827",
        fontWeight: "500",
    },
    petList: {
        marginTop: 16,
        gap: 12,
    },
    petItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        gap: 12,
    },
    petImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    petBreed: {
        fontSize: 14,
        color: '#6B7280',
    },
    petPriceContainer: {
        alignItems: 'flex-end',
    },
    petPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    summaryList: {
        gap: 12,
        marginTop: 12,
    },
    summaryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: "#4B5563",
        fontWeight: "500",
    },
    subtitleLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 14,
        color: "#111827",
        fontWeight: "bold",
    },
    statusBadge: {
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
    footerCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    footerText: {
        fontSize: 16,
        color: "#4B5563",
        fontWeight: "600",
    },
});
