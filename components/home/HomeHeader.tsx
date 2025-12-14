import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import {
  Notification02Icon,
  Search01Icon,
  ShoppingBag02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Assuming we might use a Paw icon for logo if no image
import PawIcon from "@/assets/images/icons/paw.svg";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <PawIcon width={24} height={24} color={Colors.primary} />
        <Text style={styles.appName}>Carely Pets</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <HugeiconsIcon icon={Search01Icon} size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
            <HugeiconsIcon icon={ShoppingBag02Icon} size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <HugeiconsIcon icon={Notification02Icon} size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  appName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
