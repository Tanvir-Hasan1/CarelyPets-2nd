import ConversationCard from "@/components/chat/ConversationCard";
import Header from "@/components/ui/Header";
import { Spacing } from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const getUnreadConversations = useChatStore(
    (state) => state.getUnreadConversations,
  );
  const markAsRead = useChatStore((state) => state.markAsRead);
  const unreadConversations = getUnreadConversations();

  const handleConversationPress = async (conversationId: string) => {
    const conversation = unreadConversations.find(
      (c) => c.id === conversationId,
    );
    if (!conversation) return;

    const otherParticipant = conversation.participants.find(
      (p) => p.id !== user?.id,
    );

    // Mark as read
    await markAsRead(conversationId);

    // Navigate to chat
    router.dismissTo({
      pathname: "/chat/[id]",
      params: {
        id: conversationId,
        name: otherParticipant?.name || "Chat",
        avatar: otherParticipant?.avatarUrl || "",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Notifications" />

      {unreadConversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>No unread messages</Text>
          <Text style={styles.emptySubtext}>
            When you have new messages, they'll appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={unreadConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationCard
              conversation={item}
              currentUserId={user?.id}
              onPress={() => handleConversationPress(item.id)}
              showUnreadBadge={true}
              showStatus={false}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
});
