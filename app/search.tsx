import { Colors, Spacing } from "@/constants/colors";
import userService, { PetPal } from "@/services/userService";
import { ArrowLeft02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PetPal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (searchText: string) => {
    setLoading(true);
    try {
      const response = await userService.searchUsers(searchText);
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: PetPal }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => router.push(`/(tabs)/home/petPals/${item.id}` as any)}
    >
      <Image
        source={
          item.avatarUrl
            ? { uri: item.avatarUrl }
            : require("@/assets/images/user_placeholder.png")
        }
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        {item.username && <Text style={styles.username}>@{item.username}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Custom Search Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.searchBarContainer}>
          <HugeiconsIcon
            icon={Search01Icon}
            size={20}
            color="#6B7280"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pet pals..."
            placeholderTextColor="#6B7280"
            autoFocus
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={Colors.primary} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              query.trim() ? (
                <Text style={styles.emptyText}>
                  No results found for "{query}"
                </Text>
              ) : (
                <View style={styles.recentSearchContainer}>
                  <Text style={styles.sectionTitle}>RECENT SEARCH</Text>
                  <View style={styles.tagContainer}>
                    <TouchableOpacity
                      style={styles.tag}
                      onPress={() => setQuery("Persian Cat")}
                    >
                      <Text style={styles.tagText}>Persian Cat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.tag}
                      onPress={() => setQuery("Husky")}
                    >
                      <Text style={styles.tagText}>Husky</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  username: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.textSecondary,
  },
  recentSearchContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tagText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
});
