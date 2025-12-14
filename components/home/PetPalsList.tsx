import {
    BorderRadius,
    Colors,
    FontSizes,
    FontWeights,
    Spacing,
} from "@/constants/colors";
import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MOCK_PALS = [
  { id: "1", name: "Kesha", surname: "Saha", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60" },
  { id: "2", name: "Darrell", surname: "Steward", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=60" }, // Updated: Male portrait
  { id: "3", name: "Courtney", surname: "Henry", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop&q=60" },
  { id: "4", name: "Theresa", surname: "Webb", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60" },
];

export default function PetPalsList() {
  return (
    <FlatList
      data={MOCK_PALS}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.name}>{item.surname}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.md, // Add bottom padding for shadow visibility if needed
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: "center",
    width: 100,
    // Add subtle shadow or border if needed, similar to design cards
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.sm,
    backgroundColor: "#B2EBF2", // Light teal
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 10,
    color: "#006064",
    fontWeight: FontWeights.medium,
  },
});
