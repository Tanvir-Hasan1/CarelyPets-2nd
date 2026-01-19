import { FontSizes, Spacing } from "@/constants/colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ShareThoughtsCardProps {
  avatarUrl?: string;
  onCamera?: () => void;
  onGallery?: () => void;
  onPress?: () => void;
}

const ShareThoughtsCard = ({
  avatarUrl,
  onCamera,
  onGallery,
  onPress,
}: ShareThoughtsCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={
          avatarUrl
            ? { uri: avatarUrl }
            : require("@/assets/images/logos/placeholder.png")
        }
        style={styles.avatar}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.inputOuter}
        onPress={onPress}
      >
        <Text style={styles.placeholderText}>Share your pet thoughts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  inputOuter: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FAFBFC",
  },
  placeholderText: {
    fontSize: FontSizes.sm,
    color: "#9CA3AF",
  },
});

export default ShareThoughtsCard;
