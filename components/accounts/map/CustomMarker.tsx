import { Colors } from "@/constants/colors";
import { PawPrint, Stethoscope } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface CustomMarkerProps {
  title: string;
  category: "vet" | "store" | "search";
  isSelected?: boolean;
}

export default function CustomMarker({
  title,
  category,
  isSelected = false,
}: CustomMarkerProps) {
  const markerColor = isSelected ? Colors.primary : "#EF4444";
  const iconSize = isSelected ? 26 : 22;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={[styles.marker, { backgroundColor: markerColor }]}>
        {category === "vet" ? (
          <Stethoscope size={iconSize} color="#fff" strokeWidth={2.5} />
        ) : (
          <PawPrint size={iconSize} color="#fff" strokeWidth={2.5} />
        )}
      </View>
      <View style={styles.pointer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 120,
    height: 80,
  },
  labelContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 4,
    maxWidth: 120,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  marker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    marginTop: -4,
  },
});
