import Header from '@/components/ui/Header';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'expo-router';
import {
    ChevronDown,
    MapPin,
    Phone,
    User
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateUser, isLoading, error, clearError } = useAuthStore();

    const [name, setName] = useState(user?.name || "");
    const [country, setCountry] = useState(user?.country || user?.location?.country || "BD");
    const [address, setAddress] = useState(user?.address || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [selectedPets, setSelectedPets] = useState<string[]>(user?.favorites || []);

    const petTypes = ['Dog', 'Cats', 'Small Pets', 'Birds', 'Exotic Pets'];

    const togglePetSelection = (pet: string) => {
        if (selectedPets.includes(pet)) {
            setSelectedPets(selectedPets.filter(p => p !== pet));
        } else {
            setSelectedPets([...selectedPets, pet]);
        }
    };

    const handleSave = async () => {
        const success = await updateUser({
            name,
            country,
            address,
            phone,
            favorites: selectedPets
        });

        if (success) {
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Edit Profile" />

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={clearError}>
                        <Text style={styles.errorClose}>×</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.content}>
                {/* Form Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>NAME</Text>
                    <View style={styles.inputContainer}>
                        <User size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Full Name"
                        />
                    </View>
                </View>


                <View style={styles.formGroup}>
                    <Text style={styles.label}>COUNTRY</Text>
                    <View style={styles.inputContainer}>
                        {/* Placeholder for globe icon */}
                        <MapPin size={20} color={Colors.primary} style={styles.inputIcon} />
                        <Text style={[styles.input, { paddingVertical: 12 }]}>{country}</Text>
                        <ChevronDown size={20} color={Colors.primary} />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>ADDRESS</Text>
                    <View style={styles.inputContainer}>
                        <MapPin size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Address"
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>PHONE NO.</Text>
                    <View style={styles.inputContainer}>
                        <Phone size={20} color={Colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                {/* Favorite Pets */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>CHOOSE FAVORITE PETS</Text>
                    <View style={styles.chipsContainer}>
                        {petTypes.map((pet) => (
                            <TouchableOpacity
                                key={pet}
                                style={[
                                    styles.chip,
                                    selectedPets.includes(pet) && styles.chipSelected
                                ]}
                                onPress={() => togglePetSelection(pet)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    selectedPets.includes(pet) && styles.chipTextSelected
                                ]}>{pet}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        disabled={isLoading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background as per mockup
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        marginHorizontal: 20,
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        flex: 1,
    },
    errorClose: {
        color: '#DC2626',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    content: {
        padding: 20,
        paddingBottom: 100, // Space for footer
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        paddingVertical: 12,
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chipSelected: {
        backgroundColor: '#A0E7E5', // Light teal
        borderColor: '#A0E7E5',
    },
    chipText: {
        fontSize: 14,
        color: '#4B5563',
    },
    chipTextSelected: {
        color: '#004D40',
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: 20,
        gap: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    saveButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
