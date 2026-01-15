import { Colors, Spacing } from "@/constants/colors";
import { Search } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";

interface MapSearchProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

export default function MapSearch({
  placeholder = "Search",
  onChangeText,
  value,
}: MapSearchProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search
          size={20}
          color={Colors.textSecondary || "#666"}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary || "#666"}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 100,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  icon: {
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: "100%",
  },
});
