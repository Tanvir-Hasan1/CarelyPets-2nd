import Header from "@/components/ui/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import userService, { PetPal } from "@/services/userService";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AllPalsScreen() {
  const router = useRouter();
  const [pals, setPals] = useState<PetPal[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Initial fetch
  useEffect(() => {
    fetchPals(1, "", true);
  }, []);

  const fetchPals = async (pageNum: number, search: string, reset: boolean) => {
    if (loading && pageNum > 1) return; // Allow loading state for first page or search
    setLoading(true);
    try {
      const response = await userService.getPetPals(pageNum, 20, search);
      if (response.success) {
        if (reset) {
          setPals(response.data);
        } else {
          setPals((prev) => [...prev, ...response.data]);
        }
        // If we got fewer items than limit, no more pages
        setHasMore(
          response.data.length === 20 &&
            pageNum < response.pagination.totalPages,
        );
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching all pet pals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPals(page + 1, "", false);
    }
  };

  const renderItem = ({ item }: { item: PetPal }) => (
    <View style={styles.cardWrapper}>
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
        <Text style={styles.surname} numberOfLines={1}>
          {item.username ? `@${item.username}` : ""}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/(tabs)/home/petPals/${item.id}` as any)}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="All pet pals"
        showActions
        showSearch
        showBasket={false}
        showNotifications={false}
        // onSearchPress defaults to router.push("/search")
      />

      <FlatList
        data={pals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator
              style={{ padding: Spacing.md }}
              color={Colors.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading && pals.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={{ color: Colors.textSecondary }}>
                No pet pals found
              </Text>
            </View>
          ) : null
        }
      />
      {loading && page === 1 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.5)",
            },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  listContent: {
    padding: Spacing.lg,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circle
    marginBottom: Spacing.sm,
    backgroundColor: Colors.lightGray,
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: "center",
  },
  surname: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: "#B2EBF2", // Light teal
    paddingVertical: 6,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: FontSizes.xs,
    color: "#006064", // Dark teal
    fontWeight: FontWeights.bold,
  },
});
