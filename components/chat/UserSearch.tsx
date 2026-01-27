import SearchIcon from "@/assets/images/icons/search.svg"; // Matching ChatScreen usage
import { Colors } from "@/constants/colors"; // Assuming these exist, matching ChatScreen usage
import chatService, { UserResult } from "@/services/chatService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UserSearchProps {
  onSelect?: (user: UserResult) => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

const UserSearch = ({ onSelect, value, onChangeText }: UserSearchProps) => {
  const [internalQuery, setInternalQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  const query = value !== undefined ? value : internalQuery;

  const handleSearch = async (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setInternalQuery(text);
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (text.length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      // Only show results if we have text
      if (text.length > 0) setShowResults(true);

      try {
        const response = await chatService.searchUsers(text);
        console.log("[UserSearch] Component received response:", response);
        if (response.success) {
          console.log(
            "[UserSearch] Setting results:",
            response.data ? response.data.length : "No data",
          );
          // Filter out current user from results
          const filtered = response.data.filter((u) => u.id !== user?.id);
          setResults(filtered);
        } else {
          console.warn("[UserSearch] Response success is false", response);
        }
      } catch (error) {
        console.error("[UserSearch] Search failed with detailed error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce
  };

  const handleSelectUser = (selectedUser: UserResult) => {
    if (onSelect) {
      onSelect(selectedUser);
    } else {
      // Default navigation logic
      // Convert UserResult to params expected by chat flow
      router.push({
        pathname: "/chat/[id]",
        params: {
          id: selectedUser.id,
          name: selectedUser.name,
          avatar: selectedUser.avatarUrl,
          type: "user", // Indicate this is a user ID, not conversation ID
        },
      });
    }
    setShowResults(false);
    if (!onChangeText) {
      setInternalQuery("");
    }
  };

  // Close dropdown if clicked outside?
  // Hard to do in React Native without a global touch handler.
  // We'll rely on user interaction or explicit close.

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <SearchIcon width={24} height={24} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search users..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={handleSearch}
          onFocus={() => query.length > 0 && setShowResults(true)}
          //   onBlur={() => setTimeout(() => setShowResults(false), 200)} // Delay to allow click
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={Colors.primary || "#000"}
            style={{ marginRight: 10 }}
          />
        )}
      </View>

      {showResults && (
        <View style={styles.dropdown}>
          {results.length === 0 && !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => handleSelectUser(item)}
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{
                        uri: item.avatarUrl || "https://via.placeholder.com/50",
                      }}
                      style={styles.avatar}
                    />
                    {item.isOnline && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.role}>{item.role}</Text>
                  </View>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    width: "100%",
    position: "relative",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#EDEFF2",
  },
  icon: {
    marginRight: 10,
    color: "#9CA3AF",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    height: "100%",
  },
  dropdown: {
    position: "absolute",
    top: 55, // Height of input + margin
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#EDEFF2",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
    overflow: "hidden",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981", // Green
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  role: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },
});

export default UserSearch;
