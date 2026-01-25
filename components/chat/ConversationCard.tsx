import { Spacing } from "@/constants/colors";
import { Conversation } from "@/services/chatService";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConversationCardProps {
  conversation: Conversation;
  currentUserId?: string;
  onPress: () => void;
  showUnreadBadge?: boolean;
  showStatus?: boolean;
}

const ConversationCard = ({
  conversation,
  currentUserId,
  onPress,
  showUnreadBadge = true,
  showStatus = false,
}: ConversationCardProps) => {
  const otherParticipant =
    conversation.participants.find((p) => p.id !== currentUserId) ||
    conversation.participants[0];
  const lastMsg = conversation.lastMessage;

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

  const renderStatus = () => {
    if (!showStatus) return null;

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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: otherParticipant?.avatarUrl || "https://i.pravatar.cc/150",
          }}
          style={styles.avatar}
        />
        {conversation.otherParticipant?.isOnline && (
          <View style={styles.onlineIndicator} />
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name}>{otherParticipant?.name || "Unknown"}</Text>
          <Text style={styles.time}>
            {lastMsg ? formatTime(lastMsg.createdAt) : ""}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {lastMsg ? lastMsg.body || lastMsg.content : "No messages yet"}
          </Text>
          <View style={styles.statusContainer}>
            {showStatus && renderStatus()}
            {showUnreadBadge && conversation.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {conversation.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: Spacing.md,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  avatarContainer: {
    position: "relative",
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981", // Green
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  time: {
    fontSize: 12,
    color: "#1DAFB6",
    fontWeight: "500",
  },
  footer: {
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusCheck: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  unreadBadge: {
    backgroundColor: "#1DAFB6",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default React.memo(ConversationCard);
