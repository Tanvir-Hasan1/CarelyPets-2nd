import BasketIcon from "@/assets/images/icons/basket.svg";
import NotificationIcon from "@/assets/images/icons/notification.svg";
import ClawHeader from "@/components/ui/ClawHeader";
import {
  Colors,
  Spacing,
} from "@/constants/colors";
import {
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <ClawHeader size={32} />
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <HugeiconsIcon icon={Search01Icon} size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <BasketIcon width={36} height={36} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <NotificationIcon width={36} height={36} />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
