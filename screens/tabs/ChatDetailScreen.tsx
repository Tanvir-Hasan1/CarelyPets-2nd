import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMenu from "@/components/chat/ChatMenu";
import MessageBubble from "@/components/chat/MessageBubble";
import PetPalBlockModal from "@/components/home/petPals/PetPalBlockModal";
import ImageViewingModal from "@/components/ui/ImageViewingModal";
import { Spacing } from "@/constants/colors";
import socketService from "@/services/socketService";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMPTY_MESSAGES: any[] = [];

function ChatDetailScreen() {
  console.log("[ChatDetailScreen] Component rendering started");

  const { id, name, avatar } = useLocalSearchParams();
  const conversationId = id as string;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuthStore();
  const messages = useChatStore(
    (state) => state.messages[conversationId] || EMPTY_MESSAGES,
  );
  const conversations = useChatStore((state) => state.conversations);
  const blockedUsers = useChatStore((state) => state.blockedUsers);
  const isLoadingMessages = useChatStore((state) => state.isLoadingMessages);
  const fetchMessages = useChatStore((state) => state.fetchMessages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const sendMessageWithAttachments = useChatStore(
    (state) => state.sendMessageWithAttachments,
  );
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation,
  );
  const blockUser = useChatStore((state) => state.blockUser);
  const unblockUser = useChatStore((state) => state.unblockUser);

  const [messageText, setMessageText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Detect if conversation is blocked
  useEffect(() => {
    const blocked = blockedUsers.some((conv) => conv.id === conversationId);
    setIsBlocked(blocked);
  }, [conversationId, blockedUsers]);

  useEffect(() => {
    if (conversationId) {
      // Fire and forget - don't wait for fetchMessages
      fetchMessages(conversationId); // This returns immediately with cached data
      setActiveConversation(conversationId);
      socketService.joinConversation(conversationId);
    }

    return () => {
      setActiveConversation(null);
      if (conversationId) {
        socketService.leaveConversation(conversationId);
      }
    };
  }, [conversationId]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages.length]);

  const handleBack = () => router.back();

  const handleAttachment = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!messageText.trim() && selectedImages.length === 0) return;
    if (isSending) return;

    setIsSending(true);
    try {
      if (selectedImages.length > 0) {
        const { conversations } = useChatStore.getState();
        const conversation = conversations.find((c) => c.id === conversationId);
        const recipient = conversation?.participants.find(
          (p) => p.id !== user?.id,
        );

        if (!recipient) throw new Error("Recipient not found");

        const formData = new FormData();
        const bodyContent = messageText.trim() || " ";

        formData.append("recipientId", recipient.id);
        formData.append("body", bodyContent);

        selectedImages.forEach((uri, index) => {
          const fileName = uri.split("/").pop() || "image.jpg";
          const match = /\.(\w+)$/.exec(fileName);
          const type = match ? `image/${match[1]}` : "image/jpeg";

          // @ts-ignore
          formData.append("files", {
            uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
            name: fileName,
            type,
          });
        });

        await sendMessageWithAttachments(conversationId, formData);
      } else {
        await sendMessage(conversationId, messageText);
      }

      setMessageText("");
      setSelectedImages([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ChatHeader
          name={name as string}
          avatar={avatar as string}
          onBackPress={handleBack}
          onMenuPress={() => setMenuVisible(!menuVisible)}
          paddingTop={insets.top}
        />

        <ChatMenu
          visible={menuVisible}
          isBlocked={isBlocked}
          onClose={() => setMenuVisible(false)}
          onBlock={() => setBlockModalVisible(true)}
          onUnblock={async () => {
            try {
              // Get the other user's ID from the conversation
              const conversation = conversations.find(
                (c) => c.id === conversationId,
              );
              const recipient = conversation?.participants.find(
                (p) => p.id !== user?.id,
              );

              if (recipient) {
                await unblockUser(recipient.id);
                setIsBlocked(false); // Update UI immediately
                console.log("User unblocked successfully");
              }
            } catch (error) {
              console.error("Failed to unblock user:", error);
            }
          }}
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              onImagePress={(uri) => setViewingImage(uri)}
            />
          )}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area or Blocked Message */}
        {isBlocked ? (
          <View
            style={[
              styles.blockedContainer,
              { paddingBottom: insets.bottom || Spacing.sm },
            ]}
          >
            <Text style={styles.blockedText}>🚫 User is blocked</Text>
            <Text style={styles.blockedSubtext}>
              Unblock this user to send messages
            </Text>
          </View>
        ) : (
          <ChatInput
            messageText={messageText}
            selectedImages={selectedImages}
            isSending={isSending}
            onMessageChange={setMessageText}
            onAttachmentPress={handleAttachment}
            onSendPress={handleSend}
            onRemoveImage={removeImage}
            paddingBottom={insets.bottom || Spacing.sm}
          />
        )}

        <PetPalBlockModal
          visible={blockModalVisible}
          onClose={() => setBlockModalVisible(false)}
          onConfirm={async () => {
            try {
              // Get the other user's ID from the conversation
              const { conversations } = useChatStore.getState();
              const conversation = conversations.find(
                (c) => c.id === conversationId,
              );
              const recipient = conversation?.participants.find(
                (p) => p.id !== user?.id,
              );

              if (recipient) {
                await blockUser(recipient.id);
                setIsBlocked(true); // Update UI immediately
                console.log("User blocked successfully");
                setBlockModalVisible(false);
                // Don't go back - stay in conversation with blocked UI
              }
            } catch (error) {
              console.error("Failed to block user:", error);
            }
          }}
        />

        <ImageViewingModal
          visible={!!viewingImage}
          imageUri={viewingImage}
          onClose={() => setViewingImage(null)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messageList: {
    padding: Spacing.md,
  },
  blockedContainer: {
    backgroundColor: "#FFF3E0",
    borderTopWidth: 1,
    borderTopColor: "#FFB74D",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  blockedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E65100",
    marginBottom: Spacing.xs,
  },
  blockedSubtext: {
    fontSize: 14,
    color: "#F57C00",
    textAlign: "center",
  },
});

// Memoize component to prevent unnecessary re-renders and speed up navigation
export default React.memo(ChatDetailScreen);
