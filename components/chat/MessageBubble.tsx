import { Message } from "@/services/chatService";
import { useAuthStore } from "@/store/useAuthStore";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MessageBubbleProps {
  message: Message & { text?: string; time?: string };
  onImagePress: (uri: string) => void;
  onLongPress: (message: Message) => void;
}

export default function MessageBubble({
  message,
  onImagePress,
  onLongPress,
}: MessageBubbleProps) {
  const isMe =
    message.senderId === useAuthStore.getState().user?.id ||
    message.sender === "me";

  if (message.isDeleted) {
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.bubble,
            styles.deletedBubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.deletedText}>🚫 This message was deleted</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.messageContainer,
        isMe ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => {
          console.log("Bubble Long Pressed:", message.id);
          onLongPress(message);
        }}
        delayLongPress={200}
        style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
      >
        {/* API has images grid from attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <View style={styles.imageGrid}>
            {message.attachments.map((at, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => onImagePress(at.url)}
                onLongPress={() => onLongPress(message)}
                delayLongPress={200}
              >
                <Image source={{ uri: at.url }} style={styles.messageImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {(message.body || message.content) &&
          // Hide placeholder text (space or emoji) when there are attachments
          !(
            (message.body === " " || message.body === "📎") &&
            message.attachments?.length > 0
          ) && (
            <Text style={[styles.messageText, isMe && styles.myMessageText]}>
              {message.body || message.content}
            </Text>
          )}
        <View style={styles.messageFooter}>
          <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {isMe && (
            <Text
              style={[
                styles.statusCheck,
                styles.myStatusCheck,
                message.readAt && { color: "#E0F7FA" },
              ]}
            >
              {message.readAt ? "✓✓" : "✓"}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 12,
    width: "100%",
    flexDirection: "row",
  },
  myMessageContainer: {
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
  },
  myBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 2,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  myMessageTime: {
    color: "#E0E0E0",
  },
  myStatusCheck: {
    color: "#E0E0E0",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 4,
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 10,
    color: "#6B7280",
  },
  statusCheck: {
    fontSize: 12,
    color: "#6B7280",
  },
  deletedBubble: {
    backgroundColor: "#F3F4F6",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  deletedText: {
    fontStyle: "italic",
    color: "#6B7280",
    fontSize: 14,
  },
});
