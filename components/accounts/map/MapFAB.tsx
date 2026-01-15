import { Colors, Spacing } from "@/constants/colors";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

interface MapFABProps {
  onPress: () => void;
  style?: ViewStyle;
}

export default function MapFAB({ onPress, style }: MapFABProps) {
  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <HugeiconsIcon icon={Location01Icon} size={24} color={Colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: Spacing.xl + Spacing.xxl,
    right: Spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
