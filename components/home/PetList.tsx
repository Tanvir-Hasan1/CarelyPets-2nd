import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

import { usePetStore } from "@/store/usePetStore";
import EmptyPetList from "./EmptyPetList";

export default function PetList() {
  const router = useRouter();
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
        <TouchableOpacity 
          style={styles.itemContainer} 
          onPress={() => router.push({ pathname: "/pets/[id]", params: { id: item.id } })}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
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
