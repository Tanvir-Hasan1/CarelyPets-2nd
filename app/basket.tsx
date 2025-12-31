import Header from "@/components/ui/Header";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
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

const MOCK_BASKET_PETS = [
    {
        id: "1",
        name: "Pet name",
        breed: "Pet breed",
        price: 250.0,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "2",
        name: "Pet name",
        breed: "Pet breed",
        price: 250.0,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=100&q=80",
    },
];

export default function BasketScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Header title="Basket" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* List of pets for adoption */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>List of pets for adoption</Text>
                    <View style={styles.petList}>
                        {MOCK_BASKET_PETS.map((pet) => (
                            <View key={pet.id} style={styles.petItem}>
                                <Image source={{ uri: pet.image }} style={styles.petImage} />
                                <View style={styles.petInfo}>
                                    <Text style={styles.petName}>{pet.name}</Text>
                                    <Text style={styles.petBreed}>{pet.breed}</Text>
                                </View>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.label}>Price</Text>
                                    <Text style={styles.price}>${pet.price.toFixed(2)}</Text>
                                </View>
                                <TouchableOpacity style={styles.removeButton}>
                                    <X size={20} color="#4B5563" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Customer Information */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Customer Information</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>NAME</Text>
                        <TextInput style={styles.input} value="John Doe" editable={false} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ADDRESS</Text>
                        <TextInput style={styles.input} value="43, John Hopkins Road, NYC" editable={false} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>PHONE NO.</Text>
                        <TextInput style={styles.input} value="555 656 5656" editable={false} />
                    </View>

                    <Text style={styles.hintText}>
                        <Text style={{ color: "#EF4444" }}>*</Text>Pet will be delivered to your home
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => router.push("/checkout")}
                >
                    <Text style={styles.checkoutText}>Checkout</Text>
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
    petList: {
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
    priceContainer: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    label: {
        fontSize: 10,
        color: "#6B7280",
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    removeButton: {
        padding: 4,
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
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: "#4B5563",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    hintText: {
        fontSize: 14,
        color: "#111827",
        fontWeight: '500',
        marginTop: 4,
    },
    checkoutButton: {
        backgroundColor: "#00BCD4", // Specific cyan from screenshot
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        alignItems: 'center',
    },
    checkoutText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    }
});
