import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import {
  Add01Icon,
  Calendar03Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ActionButton = ({
  icon: Icon,
  label,
  color,
  bgColor,
  onPress,
}: {
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
      <HugeiconsIcon icon={Icon} size={24} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <ActionButton
          icon={FavouriteIcon}
          label="Adopt a Pet"
          color="#009688"
          bgColor="#E0F2F1"
        />
        <ActionButton
          icon={Calendar03Icon}
          label="Book a Service"
          color="#FF9800"
          bgColor="#FFF3E0"
        />
        <ActionButton
          icon={Add01Icon}
          label="Add a Pet"
          color="#2196F3"
          bgColor="#E3F2FD"
          onPress={() => router.push("/add-pet")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  actionItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: FontSizes.xs,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
});
