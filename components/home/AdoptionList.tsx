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

const MOCK_ADOPTION = [
  {
    id: "1",
    name: "Buddy",
    breed: "Persian Cat",
    age: "2 years old",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&auto=format&fit=crop&q=60",
    bgColor: "#E3F2FD",
    genderColor: "#BBDEFB",
  },
  {
    id: "2",
    name: "Cookie", 
    breed: "Doggo",
    age: "1 years old",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&auto=format&fit=crop&q=60",
    bgColor: "#FCE4EC",
    genderColor: "#F8BBD0",
  },
  {
    id: "3",
    name: "Max",
    breed: "Golden Ret",
    age: "3 years old",
    gender: "Male",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=60",
    bgColor: "#E3F2FD",
    genderColor: "#BBDEFB",
  },
  {
    id: "4",
    name: "Luna",
    breed: "Siamese",
    age: "1.5 years old",
    gender: "Female",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&auto=format&fit=crop&q=60",
    bgColor: "#FCE4EC",
    genderColor: "#F8BBD0",
  }
];

export default function AdoptionList() {
  return (
    <FlatList
      data={MOCK_ADOPTION}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={[styles.genderTag, { backgroundColor: item.genderColor }]}>
                    <Text style={styles.genderText}>{item.gender}</Text>
                </View>
            </View>
            <Text style={styles.details}>
              {item.breed} • {item.age}
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Know Me!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  card: {
    width: 160, // Fixed width for horizontal scrolling
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.lightGray,
  },
  infoContainer: {
    padding: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  genderTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  genderText: {
    fontSize: 8,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  details: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  button: {
    backgroundColor: "#00BCD4", // Cyan
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
});
