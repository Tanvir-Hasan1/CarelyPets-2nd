import FemaleIcon from "@/assets/images/icons/female.svg";
import MaleIcon from "@/assets/images/icons/male.svg";
import { BorderRadius, Colors, FontWeights, Spacing } from "@/constants/colors";
import { Image } from "expo-image";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    age: string | number;
    gender: "Male" | "Female";
    image: string;
    status: "Available" | "Adopted";
  };
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

export default function PetCard({ pet, onPress }: PetCardProps) {
  const isFemale = pet.gender === "Female";
  const isAdopted = pet.status === "Adopted";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pet.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          priority="high"
        />
        <View
          style={[
            styles.genderOverlay,
            { backgroundColor: isFemale ? "#FFD1DC" : "#BBDEFB" },
          ]}
        >
          {isFemale ? (
            <FemaleIcon width={24} height={24} />
          ) : (
            <MaleIcon width={24} height={24} />
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {pet.name}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isAdopted ? "#E0F2F1" : "#E8F5E9" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isAdopted ? "#00796B" : "#2E7D32" },
              ]}
            >
              {pet.status}
            </Text>
          </View>
        </View>

        <Text style={styles.breed} numberOfLines={1}>
          {pet.breed}
        </Text>

        <Text style={styles.details}>
          {pet.gender} • {pet.age} years old
        </Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Know Me!</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 0, // expo-image doesn't need resizeMode, handled by contentFit
  },
  genderOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  breed: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: "#00BCD4",
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: FontWeights.bold,
    color: "#FFFFFF",
  },
});
