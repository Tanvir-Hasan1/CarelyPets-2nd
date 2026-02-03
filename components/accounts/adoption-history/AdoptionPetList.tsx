import { AdoptionOrder } from "@/services/adoptionService";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface AdoptionPetListProps {
  items: AdoptionOrder["items"];
}

export default function AdoptionPetList({ items }: AdoptionPetListProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>List of pets for adoption</Text>
      <View style={styles.petList}>
        {items.map((pet, index) => (
          <View key={index} style={styles.petItem}>
            <Image
              source={{ uri: pet.avatarUrl }}
              style={styles.petImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.petName}</Text>
              <Text style={styles.petBreed}>{pet.petBreed}</Text>
            </View>
            <View style={styles.petPriceContainer}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.petPrice}>${pet.price.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  petList: {
    marginTop: 16,
    gap: 12,
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
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
    fontWeight: "bold",
    color: "#111827",
  },
  petBreed: {
    fontSize: 14,
    color: "#6B7280",
  },
  petPriceContainer: {
    alignItems: "flex-end",
  },
  petPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  infoLabel: {
    fontSize: 10,
    color: "#6B7280",
    letterSpacing: 0.5,
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
  },
});
