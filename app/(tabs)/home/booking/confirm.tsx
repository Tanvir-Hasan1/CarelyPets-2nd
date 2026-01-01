import Header from '@/components/ui/Header';
import { useAuthStore } from '@/store/useAuthStore';
import { usePetStore } from '@/store/usePetStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MASTERCARD_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png";
const VISA_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png";

const SERVICES = {
    vet: { name: 'Vet Visit', price: 150.00 },
    grooming: { name: 'Grooming', price: 250.00 },
    training: { name: 'Training', price: 100.00 },
    walking: { name: 'Walking', price: 50.00 },
};

export default function ConfirmBookingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { pets } = usePetStore();
    const { user } = useAuthStore();

    const petId = params.petId as string;
    const serviceId = params.serviceId as keyof typeof SERVICES;
    const service = SERVICES[serviceId] || SERVICES.grooming;
    const pet = pets.find(p => p.id === petId) || pets[0];

    const subtotal = service.price;
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const handleConfirm = () => {
        router.push({
            pathname: '/(tabs)/home/booking/success',
            params: { ...params }
        });
    };

    return (
        <View style={styles.container}>
            <Header title="Confirm Booking" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Customer Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Customer Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>NAME</Text>
                        <Text style={styles.infoValue}>{user?.username || 'John Doe'}</Text>
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
                            <Text style={styles.itemName}>{service.name}</Text>
                            <Text style={styles.itemSub}>{pet?.name || 'Bubby'}</Text>
                        </View>
                        <Text style={styles.itemPrice}>$ {subtotal.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>$ {subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.summaryLabel}>Tax</Text>
                            <Text style={styles.taxPercentage}>(5%)</Text>
                        </View>
                        <Text style={styles.summaryValue}>$ {tax.toFixed(2)}</Text>
                    </View>
                    <View style={[styles.summaryRow, { marginTop: 8 }]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>$ {total.toFixed(2)}</Text>
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
                            <Text style={styles.dropdownText}>United States</Text>
                            <ChevronDown size={20} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
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
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    infoRow: {
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    itemSub: {
        fontSize: 14,
        color: '#6B7280',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#4B5563',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 15,
        color: '#111827',
        fontWeight: 'bold',
    },
    taxPercentage: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 4,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '500',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
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
        flexDirection: 'row',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dropdownText: {
        fontSize: 16,
        color: '#111827',
    },
    confirmButton: {
        backgroundColor: '#00BCD4',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
