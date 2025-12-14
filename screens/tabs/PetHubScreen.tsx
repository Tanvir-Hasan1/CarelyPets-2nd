import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PetHubScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PetHub</Text>
      <Text style={styles.subtitle}>Discover pets and services</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1DAFB6",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
});
