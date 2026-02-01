import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { AdoptionPet } from "@/services/adoptionService";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdoptionList({
  pets,
  isLoading,
}: {
  pets: AdoptionPet[];
  isLoading: boolean;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <View
        style={[
          styles.listContainer,
          { height: 200, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (pets.length === 0) {
    return (
      <View
        style={[
          styles.listContainer,
          { height: 100, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.sm }}>
          No pets available for adoption at the moment.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: item.avatarUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.name} numberOfLines={1}>
                {item.petName}
              </Text>
              <View
                style={[
                  styles.genderTag,
                  {
                    backgroundColor:
                      item.petGender.toLowerCase() === "male"
                        ? "#E3F2FD" // Blue background for male
                        : "#FCE4EC", // Pink background for female
                  },
                ]}
              >
                <Text
                  style={[
                    styles.genderText,
                    {
                      color:
                        item.petGender.toLowerCase() === "male"
                          ? "#1976D2"
                          : "#C2185B",
                    },
                  ]}
                >
                  {item.petGender.charAt(0).toUpperCase() +
                    item.petGender.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.details}>
              {item.petBreed} • {item.petAge} years
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push(`/home/adopt-pet/${item.id}`)}
            >
              <Text style={styles.buttonText}>Know Me!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  card: {
    width: 160, // Fixed width for horizontal scrolling
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.lightGray,
  },
  infoContainer: {
    padding: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    flex: 1,
    marginRight: 4,
  },
  genderTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  genderText: {
    fontSize: 8,
    fontWeight: FontWeights.medium,
  },
  details: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
});
