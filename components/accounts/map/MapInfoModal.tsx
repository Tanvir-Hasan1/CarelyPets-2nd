import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MapInfoModalProps {
  title: string;
  address?: string;
  onClose: () => void;
}

export default function MapInfoModal({
  title,
  address,
  onClose,
}: MapInfoModalProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
        {address && (
          <Text style={styles.address} numberOfLines={2}>
            {address}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Spacing.xl + Spacing.xxl + 80, // Above the FAB
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 100,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Spacing.md,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  closeButton: {
    padding: 4,
  },
  address: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary || "#666",
    lineHeight: 20,
  },
});
