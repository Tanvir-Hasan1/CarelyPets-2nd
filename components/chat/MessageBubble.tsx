import { Message } from "@/services/chatService";
import { useAuthStore } from "@/store/useAuthStore";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import VideoThumbnail from "./VideoThumbnail";

interface MessageBubbleProps {
  message: Message & { text?: string; time?: string };
  onImagePress: (uri: string) => void;
  onVideoPress: (uri: string) => void;
  onLongPress: (message: Message) => void;
}

export default function MessageBubble({
  message,
  onImagePress,
  onVideoPress,
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
        {/* Pending upload: show local thumbnails with progress overlay */}
        {message.isPending &&
          message.localUris &&
          message.localUris.length > 0 && (
            <View style={styles.imageGrid}>
              {message.localUris.map((uri, idx) => {
                const progress = message.uploadProgress ?? 0;
                return (
                  <View key={idx} style={styles.attachmentItem}>
                    <Image source={{ uri }} style={styles.messageImage} />
                    <View style={styles.pendingOverlay}>
                      {progress < 100 ? (
                        <>
                          <View style={styles.progressRing}>
                            <Text style={styles.progressRingText}>
                              {progress}%
                            </Text>
                          </View>
                        </>
                      ) : (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        {/* Uploaded attachments from server */}
        {!message.isPending &&
          message.attachments &&
          message.attachments.length > 0 && (
            <View style={styles.imageGrid}>
              {message.attachments.map((at, idx) => {
                const isVideo = at.mimeType?.startsWith("video/");
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() =>
                      isVideo ? onVideoPress(at.url) : onImagePress(at.url)
                    }
                    onLongPress={() => onLongPress(message)}
                    delayLongPress={200}
                    style={styles.attachmentItem}
                  >
                    {isVideo ? (
                      <VideoThumbnail
                        videoUri={at.url}
                        style={styles.messageImage}
                      />
                    ) : (
                      <Image
                        source={{ uri: at.url }}
                        style={styles.messageImage}
                      />
                    )}
                    {isVideo && (
                      <View style={styles.playOverlay}>
                        <HugeiconsIcon
                          icon={PlayIcon}
                          size={24}
                          color="#FFFFFF"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        {(message.body || message.content) &&
          // Hide placeholder text (space or emoji) when there are attachments or pending files
          !(
            (message.body === " " || message.body === "📎") &&
            (message.attachments?.length > 0 ||
              (message.isPending && (message.localUris?.length ?? 0) > 0))
          ) && (
            <Text style={[styles.messageText, isMe && styles.myMessageText]}>
              {(() => {
                const text = message.body || message.content || "";
                // Regex to match generic URLs (scheme://...) or www.
                // Matches any scheme (e.g. https, http, carelypets, mailto)
                const urlRegex =
                  /([a-z][a-z0-9+.-]*:\/\/[^\s]+)|(www\.[^\s]+)/gi;

                const parts = text.split(urlRegex);

                return parts.map((part, index) => {
                  if (!part) return null;
                  if (part.match(urlRegex)) {
                    return (
                      <Text
                        key={index}
                        style={{
                          textDecorationLine: "underline",
                          color: isMe ? "#FFFFFF" : "#006064",
                        }}
                        onPress={() => {
                          const url = part.startsWith("www.")
                            ? `https://${part}`
                            : part;
                          Linking.openURL(url).catch((err) =>
                            console.error("Failed to open URL:", err),
                          );
                        }}
                      >
                        {part}
                      </Text>
                    );
                  }
                  return <Text key={index}>{part}</Text>;
                });
              })()}
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
  attachmentItem: {
    position: "relative",
  },
  messageImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
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
  pendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  progressRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  progressRingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
