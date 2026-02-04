import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PetPal } from "@/services/userService";
import Skeleton from "../ui/Skeleton";

export default function PetPalsList({
  pals,
  isLoading,
}: {
  pals: PetPal[];
  isLoading: boolean;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.listContainer}>
        <View style={{ flexDirection: "row", gap: Spacing.md }}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={{ alignItems: "center", gap: 8 }}>
              <Skeleton width={48} height={48} borderRadius={24} />
              <Skeleton width={60} height={12} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={pals}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={
              item.avatarUrl
                ? { uri: item.avatarUrl }
                : require("@/assets/images/user_placeholder.png")
            }
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {/* Use username or bio as secondary text if needed, for now just name as per design */}
          {item.username && (
            <Text
              style={[
                styles.name,
                { color: Colors.textSecondary, fontSize: 10 },
              ]}
              numberOfLines={1}
            >
              @{item.username}
            </Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push(`/(tabs)/home/petPals/${item.id}` as any)
            }
          >
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.md, // Add bottom padding for shadow visibility if needed
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: "center",
    width: 100,
    // Add subtle shadow or border if needed, similar to design cards
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.text,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.sm,
    backgroundColor: "#B2EBF2", // Light teal
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 10,
    color: "#006064",
    fontWeight: FontWeights.medium,
  },
});
