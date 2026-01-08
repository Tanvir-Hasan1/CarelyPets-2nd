import FilterModal, { FilterState } from "@/components/home/adopt-a-pet/FilterModal";
import PetCard from "@/components/home/adopt-a-pet/PetCard";
import SearchComponent from "@/components/home/adopt-a-pet/SearchComponent";
import Header from "@/components/ui/Header";
import { Spacing } from "@/constants/colors/index";
import { Pet, usePetStore } from "@/store/usePetStore";
import { useRouter, useSegments } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

export const MOCK_PETS: (Partial<Pet> & { id: string; name: string; breed: string; age: number; gender: "Male" | "Female"; status: string; type: string; image: string; })[] = [
    {
        id: "1",
        name: "Midu",
        breed: "Persian Cat",
        age: 2,
        gender: "Female",
        status: "Available",
        type: "Cat",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop",
        traits: [],
        snaps: [],
        trained: true,
        vaccinated: true,
        neutered: false,
        healthRecords: []
    },
    {
        id: "2",
        name: "Bob",
        breed: "Persian Cat",
        age: 2,
        gender: "Male",
        status: "Adopted",
        type: "Cat",
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=500&auto=format&fit=crop",
        traits: [],
        snaps: [],
        trained: true,
        vaccinated: true,
        neutered: false,
        healthRecords: []
    },
    {
        id: "3",
        name: "Bubby",
        breed: "Persian Cat",
        age: 2,
        gender: "Female",
        status: "Available",
        type: "Cat",
        image: "https://images.unsplash.com/photo-1543466835-00a7907e9ef1?q=80&w=500&auto=format&fit=crop",
        traits: [],
        snaps: [],
        trained: true,
        vaccinated: true,
        neutered: false,
        healthRecords: []
    },
    {
        id: "4",
        name: "Muku",
        breed: "Golden Retriever",
        age: 5,
        gender: "Male",
        status: "Available",
        type: "Dog",
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=500&auto=format&fit=crop",
        traits: [],
        snaps: [],
        trained: true,
        vaccinated: true,
        neutered: false,
        healthRecords: []
    },
];

export default function Index() {
    const router = useRouter();
    const segments = useSegments();
    const storePets = usePetStore((state) => state.pets);
    const pets = storePets.length > 0 ? storePets : MOCK_PETS as unknown as Pet[];

    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterState>({
        query: "",
        gender: "",
        petType: [],
        ageRange: [0, 250], // Default to max age
        availability: "",
    });

    // Handle search query change from main search bar
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        setActiveFilters(prev => ({ ...prev, query: text }));
    };

    // Filter pets based on both search query and active filters
    const filteredPets = pets.filter((pet) => {
        const matchesQuery = !activeFilters.query ||
            pet.name.toLowerCase().includes(activeFilters.query.toLowerCase()) ||
            pet.breed.toLowerCase().includes(activeFilters.query.toLowerCase());

        const matchesGender = !activeFilters.gender || pet.gender === activeFilters.gender;

        const matchesType = activeFilters.petType.length === 0 ||
            activeFilters.petType.includes(pet.type || "");

        const petAge = Number(pet.age) || 0;
        const matchesAge = petAge >= activeFilters.ageRange[0] && petAge <= activeFilters.ageRange[1];

        const matchesAvailability = !activeFilters.availability ||
            (activeFilters.availability === "Available" ? pet.status === "Available" : pet.status === "Adopted");

        return matchesQuery && matchesGender && matchesType && matchesAge && matchesAvailability;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header title="Adopt Pet" showActions />

            <SearchComponent
                value={searchQuery}
                onChangeText={handleSearchChange}
                onFilterPress={() => setIsFilterVisible(true)}
            />

            <FilterModal
                visible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                initialFilters={activeFilters}
                onReset={() => {
                    const defaultFilters: FilterState = {
                        query: "",
                        gender: "",
                        petType: [],
                        ageRange: [0, 250],
                        availability: "",
                    };
                    setActiveFilters(defaultFilters);
                    setSearchQuery("");
                }}
                onApply={(filters) => {
                    setActiveFilters(filters);
                    setSearchQuery(filters.query);
                }}
            />

            <ScrollView
                contentContainerStyle={styles.gridContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredPets.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No pets match your filters</Text>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {filteredPets.map((pet) => (
                            <PetCard
                                key={pet.id}
                                pet={{
                                    ...pet,
                                    image: pet.image || "https://via.placeholder.com/150",
                                    gender: pet.gender as "Male" | "Female",
                                    status: (pet.status as "Available" | "Adopted") || "Available"
                                }}
                                onPress={() => {
                                    // Remove the (tabs) part if present to form a clean path
                                    const pathSegments = segments.filter(s => s !== '(tabs)');
                                    const basePath = `/${pathSegments.join('/')}`;
                                    router.push(`${basePath}/${pet.id}` as any);
                                }}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    gridContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#6B7280",
    },
});
