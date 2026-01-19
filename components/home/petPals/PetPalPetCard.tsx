import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Spacing } from "@/constants/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.lg * 2 - 15) / 2; // Spacing.lg * 2 is total horizontal padding, 15 is total gap

interface PetPalPetCardProps {
  pet: {
    id: string;
    name: string;
    gender: "Male" | "Female";
    breed: string;
    age: string;
    image: string;
  };
  onPress?: () => void;
}

const PetPalPetCard = ({ pet, onPress }: PetPalPetCardProps) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400&auto=format&fit=crop";
  const imageUri = pet.image || (pet as any).avatarUrl || fallbackImage;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{pet.name}</Text>
          <View
            style={[
              styles.genderBadge,
              pet.gender?.toLowerCase() === "female"
                ? styles.femaleBadge
                : styles.maleBadge,
            ]}
          >
            <Text
              style={[
                styles.genderText,
                pet.gender?.toLowerCase() === "female"
                  ? styles.femaleText
                  : styles.maleText,
              ]}
            >
              {pet.gender?.charAt(0).toUpperCase() +
                pet.gender?.slice(1).toLowerCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.info}>
          {pet.breed} •{" "}
          {typeof pet.age === "number" ? `${pet.age} years old` : pet.age}
        </Text>

        <TouchableOpacity style={styles.factsButton} onPress={onPress}>
          <Text style={styles.factsButtonText}>Pet Facts</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 12,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  genderBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  femaleBadge: {
    backgroundColor: "#FCE4EC",
  },
  maleBadge: {
    backgroundColor: "#E3F2FD",
  },
  genderText: {
    fontSize: 10,
    fontWeight: "600",
  },
  femaleText: {
    color: "#D81B60",
  },
  maleText: {
    color: "#1976D2",
  },
  info: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  factsButton: {
    backgroundColor: "#00BCD4",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  factsButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default PetPalPetCard;
