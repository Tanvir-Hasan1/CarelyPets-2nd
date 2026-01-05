import {
    BorderRadius,
    Colors,
    FontSizes,
    FontWeights,
    Spacing,
} from "@/constants/colors";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CountrySelectModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (country: string) => void;
    selectedCountry?: string;
}

// List of countries
const COUNTRIES = [
    "USA",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "India",
    "Brazil",
    "Mexico",
    "Spain",
    "Italy",
    "Netherlands",
    "Switzerland",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "South Korea",
    "Singapore",
    "China",
    "Russia",
    "South Africa",
    "Argentina",
    "Chile",
    "New Zealand",
    "Ireland",
    "Portugal",
    "Greece",
    "Turkey",
    "Egypt",
    "Saudi Arabia",
    "United Arab Emirates",
    "Thailand",
    "Vietnam",
    "Philippines",
    "Malaysia",
    "Indonesia",
    "Pakistan",
    "Bangladesh",
];

export default function CountrySelectModal({
    visible,
    onClose,
    onSelect,
    selectedCountry,
}: CountrySelectModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCountries = COUNTRIES.filter((country) =>
        country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (country: string) => {
        onSelect(country);
        setSearchQuery("");
        onClose();
    };

    const handleClose = () => {
        setSearchQuery("");
        onClose();
    }

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Country</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country..."
                            placeholderTextColor={Colors.placeholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Country List */}
                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.countryItem}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.countryText}>{item}</Text>
                                {selectedCountry === item && (
                                    <Text style={styles.selectedIndicator}>✓</Text>
                                )}
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.countryList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        color: Colors.text,
    },
    closeButton: {
        fontSize: FontSizes.xl,
        color: Colors.text,
        padding: Spacing.xs,
    },
    searchContainer: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.lightGray,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontSize: FontSizes.md,
        color: Colors.text,
    },
    countryList: {
        paddingBottom: Spacing.xl,
    },
    countryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    countryText: {
        fontSize: FontSizes.md,
        color: Colors.text,
    },
    selectedIndicator: {
        fontSize: FontSizes.md,
        color: Colors.primary,
        fontWeight: FontWeights.bold,
    },
});
