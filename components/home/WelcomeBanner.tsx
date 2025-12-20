import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function WelcomeBanner() {
  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Welcome back, Sara!</Text>
          <Text style={styles.subtext}>
            Transform pet parenting to Care smarter, bond deeper.
          </Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=32" }} // Mock avatar
          style={styles.avatar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    backgroundColor: "#C6F2F6", // Outer light cyan strip
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E0F7FA", // Inner card lighter cyan
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  greeting: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: "#006064",
    marginBottom: Spacing.xs,
  },
  subtext: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    lineHeight: 18,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.background,
  },
});
