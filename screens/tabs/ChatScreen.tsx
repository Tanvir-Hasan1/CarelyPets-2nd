import ConversationCard from "@/components/chat/ConversationCard";
import UserSearch from "@/components/chat/UserSearch";
import Header from "@/components/ui/Header";
import { Colors, Spacing } from "@/constants/colors";
import { Conversation } from "@/services/chatService";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.filterChip, active && styles.filterChipActive]}
    onPress={onPress}
  >
    <Text
      style={[styles.filterChipText, active && styles.filterChipTextActive]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ChatItem = ({
  item,
  currentUserId,
  isBlocked,
  onPress,
  onUnblock,
}: {
  item: Conversation;
  currentUserId: string | undefined;
  isBlocked?: boolean;
  onPress: () => void;
  onUnblock?: () => void;
}) => {
  return (
    <View style={{ position: "relative" }}>
      <ConversationCard
        conversation={item}
        currentUserId={currentUserId}
        onPress={onPress}
        showUnreadBadge={true}
        showStatus={true}
      />

      {/* Unblock button for blocked conversations */}
      {isBlocked && (
        <View style={styles.blockedMenuOverlay}>
          <TouchableOpacity onPress={onUnblock} style={styles.unblockButton}>
            <Text style={styles.unblockButtonText}>Unblock</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function ChatScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuthStore();
  const {
    conversations,
    blockedUsers,
    isLoadingConversations,
    fetchConversations,
    fetchBlockedUsers,
    fetchMessages,
    unblockUser,
  } = useChatStore();

  useEffect(() => {
    fetchConversations(searchQuery);
    fetchBlockedUsers(); // Load blocked users when screen loads
  }, [searchQuery]);

  // Choose which list to show based on active filter
  const sourceList = activeFilter === "Blocked" ? blockedUsers : conversations;

  const filteredConversations = sourceList.filter((conv) => {
    const otherParticipant =
      conv.participants.find((p) => p.id !== user?.id) || conv.participants[0];
    const matchesSearch = otherParticipant?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "All"
        ? true
        : activeFilter === "Unread"
          ? conv.unreadCount > 0
          : activeFilter === "Blocked"
            ? true // Already filtered by sourceList
            : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <Header title="Chat" showBackButton={false} />

      <View style={styles.searchContainer}>
        <UserSearch value={searchQuery} onChangeText={setSearchQuery} />
      </View>

      <View style={styles.filterContainer}>
        <FilterChip
          label="All"
          active={activeFilter === "All"}
          onPress={() => setActiveFilter("All")}
        />
        <FilterChip
          label="Unread"
          active={activeFilter === "Unread"}
          onPress={() => setActiveFilter("Unread")}
        />
        <FilterChip
          label="Blocked"
          active={activeFilter === "Blocked"}
          onPress={() => setActiveFilter("Blocked")}
        />
      </View>

      {isLoadingConversations && (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
      )}

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const otherParticipant =
            item.participants.find((p) => p.id !== user?.id) ||
            item.participants[0];
          return (
            <ChatItem
              item={item}
              currentUserId={user?.id}
              isBlocked={activeFilter === "Blocked"}
              onPress={() => {
                // PRE-FETCH: Start loading messages BEFORE navigation (skip if blocked)
                if (activeFilter !== "Blocked") {
                  fetchMessages(item.id);
                }

                // Navigate with no animation for instant transition
                router.push(
                  {
                    pathname: "/chat/[id]",
                    params: {
                      id: item.id,
                      name: otherParticipant?.name,
                      avatar: otherParticipant?.avatarUrl,
                    },
                  },
                  // { animation: "none" }, // Instant navigation!
                );
              }}
              onUnblock={async () => {
                try {
                  await unblockUser(otherParticipant.id);
                } catch (error) {
                  console.error("Failed to unblock user:", error);
                }
              }}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoadingConversations ? (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={{ color: "#9EA3AE" }}>No chats found</Text>
            </View>
          ) : null
        }
        onRefresh={fetchConversations}
        refreshing={isLoadingConversations}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    zIndex: 100, // Ensure dropdown shows above filters
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    zIndex: 1,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EDEFF2",
  },
  filterChipActive: {
    backgroundColor: "#B2EBF2",
    borderColor: "#B2EBF2",
  },
  filterChipText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#006064",
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
  },
  timeUnread: {
    color: "#1DAFB6",
  },
  timeBlocked: {
    color: "#E53935",
  },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
    marginRight: 8,
  },
  statusCheck: {
    fontSize: 12,
    color: "#6B7280",
  },
  unreadBadge: {
    backgroundColor: "#B2EBF2",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#006064",
  },
  blockedIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  blockedMenuOverlay: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    zIndex: 100,
  },
  unblockButton: {
    backgroundColor: "#1DAFB6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unblockButtonText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
