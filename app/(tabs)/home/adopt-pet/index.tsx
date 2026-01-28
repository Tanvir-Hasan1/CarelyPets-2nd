import FilterModal, {
  FilterState,
} from "@/components/home/adopt-a-pet/FilterModal";
import PetCard from "@/components/home/adopt-a-pet/PetCard";
import SearchComponent from "@/components/home/adopt-a-pet/SearchComponent";
import Header from "@/components/ui/Header";
import { Colors, Spacing } from "@/constants/colors/index";
import adoptionService, { AdoptionPet } from "@/services/adoptionService";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  // State for API data
  const [pets, setPets] = useState<AdoptionPet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    query: "",
    gender: "",
    petType: [],
    ageRange: [0, 250], // Default to max age
    availability: "All",
  });

  // Initial load and filter change handler
  useEffect(() => {
    fetchPets();
  }, [activeFilters]);

  const fetchPets = async () => {
    try {
      setIsLoading(true);
      const response = await adoptionService.getAdoptions({
        search: activeFilters.query,
        gender: activeFilters.gender,
        status:
          activeFilters.availability === "All"
            ? undefined
            : activeFilters.availability,
        type: activeFilters.petType,
        minAge: activeFilters.ageRange[0],
        maxAge:
          activeFilters.ageRange[1] < 250
            ? activeFilters.ageRange[1]
            : undefined,
        limit: 100, // Fetch reasonably large batch for now
      });

      if (response.success) {
        setPets(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching adoption pets:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchPets();
  };

  // Handle search query change from main search bar
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    // Debounce could be added here, but for now we update filters directly
    // waiting for user to stop typing or hit search would be better,
    // but existing logic updated filters immediately.
    // We will update filters but maybe not trigger fetch immediately if we want to debounce?
    // For simplicity reusing existing pattern:
    setActiveFilters((prev) => ({ ...prev, query: text }));
  };

  const renderPetItem = ({ item }: { item: AdoptionPet }) => (
    <PetCard
      pet={{
        id: item.id,
        name: item.petName,
        breed: item.petBreed,
        age: item.petAge,
        gender: capitalizeFirstLetter(item.petGender) as "Male" | "Female",
        image: item.avatarUrl || "https://via.placeholder.com/150",
        status: capitalizeFirstLetter(item.status) as "Available" | "Adopted",
      }}
      onPress={() => {
        // Remove the (tabs) part if present to form a clean path
        const pathSegments = segments.filter((s) => s !== "(tabs)");
        const basePath = `/${pathSegments.join("/")}`;
        router.push(`${basePath}/${item.id}` as any);
      }}
    />
  );

  // Filter pets locally as well, to handle cases where the API might not support the specific search param
  // or checks different fields. This ensures consistent UI behavior for the loaded batch.
  const displayedPets = pets.filter((pet) => {
    // 1. Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        pet.petName.toLowerCase().includes(query) ||
        pet.petBreed.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // 2. Gender
    if (
      activeFilters.gender &&
      activeFilters.gender !== "Both" &&
      pet.petGender.toLowerCase() !== activeFilters.gender.toLowerCase()
    ) {
      return false;
    }

    // 3. Pet Type
    if (
      activeFilters.petType.length > 0 &&
      !activeFilters.petType.some(
        (type) => type.toLowerCase() === pet.petType.toLowerCase(),
      )
    ) {
      return false;
    }

    // 4. Age Range
    const age = Number(pet.petAge);
    if (
      age < activeFilters.ageRange[0] ||
      (activeFilters.ageRange[1] < 250 && age > activeFilters.ageRange[1])
    ) {
      return false;
    }

    return true;
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
            availability: "All",
          };
          setActiveFilters(defaultFilters);
          setSearchQuery("");
        }}
        onApply={(filters) => {
          setActiveFilters(filters);
          setSearchQuery(filters.query);
        }}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={displayedPets}
          renderItem={renderPetItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pets match your filters</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
        />
      )}
    </View>
  );
}

// Helper to match UI expectations (Title Case) with API response (lowercase)
function capitalizeFirstLetter(string: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
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
    justifyContent: "space-between",
    gap: Spacing.md, // Add gap for spacing between columns if needed, though JustifyContent handles main axis
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xl,
  },
});
