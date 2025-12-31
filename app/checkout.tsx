import Header from "@/components/ui/Header";
import { ChevronDown } from "lucide-react-native";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Mock logos for card types
const MASTERCARD_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png";
const VISA_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png";

export default function CheckoutScreen() {
    return (
        <View style={styles.container}>
            <Header title="Checkout" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Customer Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Customer Information</Text>

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

                {/* Order Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Order Summary</Text>

                    <View style={styles.summaryItem}>
                        <View>
                            <Text style={styles.itemName}>Bubby</Text>
                            <Text style={styles.itemBreed}>Persian Cat</Text>
                        </View>
                        <Text style={styles.itemPrice}>$ 250.00</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <View>
                            <Text style={styles.itemName}>Chubby</Text>
                            <Text style={styles.itemBreed}>Stray Cat</Text>
                        </View>
                        <Text style={styles.itemPrice}>$ 150.00</Text>
                    </View>

                    <View style={[styles.summaryRow, { marginTop: 12 }]}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>$ 400.00</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.summaryLabel}>Tax</Text>
                            <Text style={styles.taxPercentage}>(5%)</Text>
                        </View>
                        <Text style={styles.summaryValue}>$ 20.00</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Processioning fee</Text>
                        <Text style={styles.summaryValue}>$ 40.00</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping cost</Text>
                        <Text style={styles.summaryValue}>$ 40.00</Text>
                    </View>

                    <View style={[styles.summaryRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 }]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>$ 460.00</Text>
                    </View>
                </View>

                {/* Payment */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Payment</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>CARD NUMBER</Text>
                        <View style={styles.cardInputWrapper}>
                            <TextInput
                                style={styles.cardInput}
                                placeholder="1111 2222 3333 4444"
                                placeholderTextColor="#9CA3AF"
                            />
                            <View style={styles.cardLogos}>
                                <Image source={{ uri: MASTERCARD_LOGO }} style={styles.cardLogo} resizeMode="contain" />
                                <View style={{ width: 8 }} />
                                <Image source={{ uri: VISA_LOGO }} style={styles.cardLogo} resizeMode="contain" />
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
                            <Text style={styles.inputLabel}>EXPIRATION DATE</Text>
                            <TextInput style={styles.input} placeholder="11/25" placeholderTextColor="#9CA3AF" />
                        </View>
                        <View style={[styles.inputContainer, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>CVV</Text>
                            <TextInput style={styles.input} placeholder="865" placeholderTextColor="#9CA3AF" />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>NAME ON CARD</Text>
                        <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#9CA3AF" />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>COUNTRY</Text>
                        <TouchableOpacity style={styles.dropdown}>
                            <Text style={styles.dropdownText}>John Doe</Text>
                            <ChevronDown size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.payButton}>
                    <Text style={styles.payButtonText}>Confirm & Pay</Text>
                </TouchableOpacity>
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
        paddingBottom: 40,
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
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    infoRow: {
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "500",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    infoValue: {
        fontSize: 16,
        color: "#111827",
        fontWeight: "500",
    },
    summaryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    itemBreed: {
        fontSize: 14,
        color: "#6B7280",
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 15,
        color: "#4B5563",
        fontWeight: "500",
    },
    summaryValue: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "bold",
    },
    taxPercentage: {
        fontSize: 13,
        color: "#6B7280",
        marginLeft: 4,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        color: "#4B5563",
        fontWeight: "500",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    input: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#111827",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    cardInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    cardInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    cardLogos: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardLogo: {
        width: 30,
        height: 20,
    },
    row: {
        flexDirection: "row",
    },
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    dropdownText: {
        fontSize: 16,
        color: "#111827",
    },
    payButton: {
        backgroundColor: "#00BCD4",
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        alignItems: 'center',
        marginBottom: 20,
    },
    payButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});
