import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { usePetStore } from "@/store/usePetStore";
import EmptyPetList from "./EmptyPetList";

export default function PetList() {
  const pets = usePetStore((state) => state.pets);

  if (pets.length === 0) {
    return <EmptyPetList />;
  }

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  itemContainer: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGray,
  },
  name: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
});
