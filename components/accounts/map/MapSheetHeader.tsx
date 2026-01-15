import { Colors, Spacing } from "@/constants/colors";
import {
  Cancel01Icon,
  Share01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MapSheetHeaderProps {
  title: string;
  rating?: number;
  userRatingsTotal?: number;
  isOpen?: boolean;
  onShare: () => void;
  onClose: () => void;
}

export default function MapSheetHeader({
  title,
  rating,
  userRatingsTotal,
  isOpen,
  onShare,
  onClose,
}: MapSheetHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.categoryText}>Animal Service • Pet Care</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconCircle} onPress={onShare}>
            <HugeiconsIcon icon={Share01Icon} size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle} onPress={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ratingRow}>
        <Text style={styles.ratingText}>{rating?.toFixed(1) || "N/A"}</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <HugeiconsIcon
              key={star}
              icon={StarIcon}
              size={14}
              variant="solid"
              color={star <= (rating || 0) ? "#FFB800" : "#E5E7EB"}
            />
          ))}
        </View>
        <Text style={styles.reviewCount}>({userRatingsTotal || 0})</Text>
      </View>

      <Text
        style={[styles.statusText, { color: isOpen ? "#10B981" : "#EF4444" }]}
      >
        {isOpen ? "Open" : "Closed"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.lg },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
  categoryText: { color: "#666", marginTop: 2 },
  headerActions: { flexDirection: "row" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  ratingRow: { flexDirection: "row", marginTop: 6, alignItems: "center" },
  ratingText: { fontWeight: "bold", marginRight: 4 },
  stars: { flexDirection: "row" },
  reviewCount: { marginLeft: 4, color: "#666" },
  statusText: { marginTop: 6, fontWeight: "500" },
});
