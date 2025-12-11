// app/screens/profileSetup/Step3FavoritePets.tsx

import ClawHeader from "@/components/ui/ClawHeader";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { Check } from "lucide-react-native";
import React from "react";
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
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <ClawHeader />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>3 OUT OF 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "100%" }]} />
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Favorite Pets</Text>
          <Text style={styles.subtitle}>
            Tell us about your favorite pets so we can make your experience even
            more personalized!
          </Text>
        </View>

        {/* Pet Selection Grid */}
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
              {favoritePets.includes(pet) && (
                <View style={styles.checkIcon}>
                  <Check size={16} color={Colors.background} />
                </View>
              )}
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
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  progressText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
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
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  petButton: {
    width: "48%",
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
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
  checkIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.background,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
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
