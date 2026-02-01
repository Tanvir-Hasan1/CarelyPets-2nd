import { Colors, FontSizes, Spacing } from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { setStringAsync } from "expo-clipboard";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import { Copy } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Removed static SHARE_WITH_USERS

interface PetPalShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: (text: string) => void;
  postId: string | number;
}

const PetPalShareModal = ({
  visible,
  onClose,
  onShare,
  postId,
}: PetPalShareModalProps) => {
  const [message, setMessage] = useState("");
  const insets = useSafeAreaInsets();
  const { conversations, fetchConversations } = useChatStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, []);

  // Get recent users from conversations
  const recentUsers = conversations
    .slice(0, 10)
    .map((conv) => {
      const otherParticipant = conv.participants.find((p) => p.id !== user?.id);
      return {
        id: otherParticipant?.id || "unknown",
        name: otherParticipant?.name || "Unknown",
        surname: "", // Surname handling might strictly require splitting name if needed
        image: otherParticipant?.avatarUrl || "https://i.pravatar.cc/150",
      };
    })
    .filter((u) => u.id !== "unknown" && u.id !== user?.id);

  const handleShare = () => {
    onShare(message);
    setMessage("");
    onClose();
  };

  const handleUserPress = (userId: string) => {
    // Generate deep link
    const deepLink = createURL(`(tabs)/pethub/view-post`, {
      queryParams: { id: postId.toString() },
    });

    const userToChatWith = recentUsers.find((u) => u.id === userId);

    onClose();

    // Navigate to chat
    router.push({
      pathname: "/(tabs)/pethub/inbox/[id]",
      params: {
        id: userId,
        type: "user",
        initialMessage: deepLink,
        name: userToChatWith?.name || "User",
        avatar: userToChatWith?.image,
      },
    });
  };

  const handleCopyLink = async () => {
    try {
      // Create deep link for the specific post
      const deepLink = createURL(`(tabs)/pethub/view-post`, {
        queryParams: { id: postId.toString() },
      });
      console.log("Generated Deep Link:", deepLink);
      await setStringAsync(deepLink);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Error copying link:", error);
      alert("Failed to copy link");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} />
        <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />

          <View style={styles.mainBox}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri:
                    user?.avatarUrl ||
                    "https://i.pravatar.cc/150?u=" + user?.username,
                }}
                style={styles.currentUserAvatar}
              />
              <View>
                <Text style={styles.currentUserName}>
                  {user?.name || "User"}
                </Text>
                <Text style={styles.currentUserHandle}>
                  @{user?.username || "user"}
                </Text>
              </View>
            </View>

            <TextInput
              style={styles.messageInput}
              placeholder="Say something"
              placeholderTextColor="#9CA3AF"
              multiline
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>Share now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.shareWithSection}>
            <Text style={styles.sectionTitle}>Recent Chats</Text>
            <FlatList
              data={recentUsers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.usersList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userCard}
                  onPress={() => handleUserPress(item.id)}
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.userAvatar}
                    />
                  </View>
                  <Text style={styles.userName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity style={styles.copyLinkRow} onPress={handleCopyLink}>
            <Text style={styles.copyLinkText}>Copy Link</Text>
            <Copy size={20} color="#006064" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: Spacing.md,
  },
  handle: {
    width: 60,
    height: 4,
    backgroundColor: "#4B5563",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  mainBox: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  currentUserAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  currentUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  currentUserHandle: {
    fontSize: 14,
    color: "#6B7280",
  },
  messageInput: {
    height: 120,
    backgroundColor: Colors.lightGray,
    borderRadius: Spacing.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    textAlignVertical: "top",
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  shareWithSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
  },
  usersList: {
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.md,
    backgroundColor: Colors.background,
  },
  userCard: {
    alignItems: "center",
    width: 70,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  userAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 26,
  },
  userName: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
  },
  copyLinkRow: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    borderTopColor: "transparent",
  },
  copyLinkText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
});

export default PetPalShareModal;
