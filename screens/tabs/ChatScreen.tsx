import SearchIcon from "@/assets/images/icons/search.svg";
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
  Image,
  StyleSheet,
  Text,
  TextInput,
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
  onPress,
}: {
  item: Conversation;
  currentUserId: string | undefined;
  onPress: () => void;
}) => {
  const otherParticipant =
    item.participants.find((p) => p.id !== currentUserId) ||
    item.participants[0];
  const lastMsg = item.lastMessage;

  const renderStatus = () => {
    if (item.unreadCount) {
      return (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      );
    }
    if (item.status === "blocked") {
      return (
        <View style={styles.blockedIcon}>
          <Text style={{ color: "#E53935" }}>🚫</Text>
        </View>
      );
    }
    if (lastMsg && lastMsg.sender === currentUserId) {
      if (lastMsg.status === "sent")
        return <Text style={styles.statusCheck}>✓</Text>;
      if (lastMsg.status === "delivered")
        return <Text style={styles.statusCheck}>✓✓</Text>;
      if (lastMsg.status === "read")
        return (
          <Text style={[styles.statusCheck, { color: "#1DAFB6" }]}>✓✓</Text>
        );
    }
    return null;
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    } catch (e) {
      return "";
    }
  };

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <Image
        source={{
          uri: otherParticipant?.avatarUrl || "https://i.pravatar.cc/150",
        }}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{otherParticipant?.name || "Unknown"}</Text>
          <Text
            style={[
              styles.time,
              item.unreadCount
                ? styles.timeUnread
                : item.status === "blocked"
                  ? styles.timeBlocked
                  : null,
            ]}
          >
            {lastMsg ? formatTime(lastMsg.createdAt) : ""}
          </Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMsg ? lastMsg.body || lastMsg.content : "No messages yet"}
          </Text>
          {renderStatus()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuthStore();
  const { conversations, isLoadingConversations, fetchConversations } =
    useChatStore();

  useEffect(() => {
    fetchConversations(searchQuery);
  }, [searchQuery]);

  const filteredConversations = conversations.filter((conv) => {
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
            ? conv.status === "blocked"
            : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <Header title="Chat" showBackButton={false} />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <SearchIcon width={25} height={25} style={styles.searchIcon} />
          <TextInput
            placeholder="Search or start new chat"
            style={styles.searchInput}
            placeholderTextColor="#000000"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
              onPress={() =>
                router.push({
                  pathname: "/chat/[id]",
                  params: {
                    id: item.id,
                    name: otherParticipant?.name,
                    avatar: otherParticipant?.avatarUrl,
                  },
                })
              }
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
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: Spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: "#EDEFF2",
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
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
});
