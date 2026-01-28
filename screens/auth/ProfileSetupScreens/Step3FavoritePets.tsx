// app/screens/profileSetup/Step3FavoritePets.tsx

import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PetType = "Dog" | "Cat" | "Small Pet" | "Bird" | "Exotic Pet";

interface Step3FavoritePetsProps {
  favoritePets: string[];
  onPetsChange: (pets: string[]) => void;
  onBack: () => void;
  onComplete: () => void;
}

export default function Step3FavoritePets({
  favoritePets,
  onPetsChange,
  onBack,
  onComplete,
}: Step3FavoritePetsProps) {
  const petOptions: PetType[] = [
    "Dog",
    "Cat",
    "Small Pet",
    "Bird",
    "Exotic Pet",
  ];

  const togglePet = (pet: PetType) => {
    const newPets = favoritePets.includes(pet)
      ? favoritePets.filter((p) => p !== pet)
      : [...favoritePets, pet];
    onPetsChange(newPets);
  };

  const handleComplete = () => {
    if (favoritePets.length === 0) {
      alert("Please select at least one favorite pet");
      return;
    }
    onComplete();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Text at Top Left */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>3 OUT OF 3</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Favorite Pets</Text>
          <Text style={styles.subtitle}>
            Tell us about your favorite pets so we can make your experience even
            more personalized!
          </Text>
        </View>

        {/* Pet Selection Grid - Now horizontal scroll for better layout */}
        <View style={styles.petsContainer}>
          {petOptions.map((pet) => (
            <TouchableOpacity
              key={pet}
              style={[
                styles.petButton,
                favoritePets.includes(pet) && styles.petButtonSelected,
              ]}
              onPress={() => togglePet(pet)}
            >
              <Text
                style={[
                  styles.petButtonText,
                  favoritePets.includes(pet) && styles.petButtonTextSelected,
                ]}
              >
                {pet}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneButton} onPress={handleComplete}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  progressContainer: {
    alignSelf: "flex-start",
    marginBottom: Spacing.xl,
  },
  progressText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  petsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  petButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  petButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  petButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  petButtonTextSelected: {
    color: Colors.background,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
  },
  backButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.text,
  },
  doneButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  doneButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.background,
  },
});
