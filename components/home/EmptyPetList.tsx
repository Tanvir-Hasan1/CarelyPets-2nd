import {
    BorderRadius,
    FontSizes,
    FontWeights,
    Spacing
} from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyPetList() {
  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>
          Currently you don't have {"\n"}any pet's, please add one.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: "#C6F2F6", // Colors.primary with opacity or specific hex from banner
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  container: {
    backgroundColor: "#E0F7FA",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: "#006064",
    textAlign: "center",
  },
});
