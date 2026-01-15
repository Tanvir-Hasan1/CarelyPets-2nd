import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MapLegend() {
  const [isExpanded, setIsExpanded] = useState(true);
  const animatedHeight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust based on content height
  });

  return (
    <TouchableOpacity
      style={[styles.container, !isExpanded && styles.containerCollapsed]}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        {isExpanded && <Text style={styles.title}>Map Legend</Text>}
        <Text style={styles.toggle}>{isExpanded ? "▼" : "▶"}</Text>
      </View>

      <Animated.View style={{ maxHeight, overflow: "hidden" }}>
        <View style={styles.content}>
          <View style={styles.item}>
            <View style={[styles.pin, { backgroundColor: "#EF4444" }]} />
            <Text style={styles.text}>Veterinary Hospital</Text>
          </View>

          <View style={styles.item}>
            <View style={[styles.pin, { backgroundColor: "#F59E0B" }]} />
            <Text style={styles.text}>Pet Store/Service</Text>
          </View>

          <View style={styles.item}>
            <View style={styles.parkBox} />
            <Text style={styles.text}>Walk with Pet</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  containerCollapsed: {
    width: 40,
    height: 40,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  toggle: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
  content: {
    marginTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  pin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#fff",
  },
  parkBox: {
    width: 12,
    height: 12,
    backgroundColor: "rgba(34, 197, 94, 0.3)",
    borderWidth: 2,
    borderColor: "#22C55E",
    marginRight: 8,
  },
  text: {
    fontSize: 11,
    color: "#374151",
  },
});
