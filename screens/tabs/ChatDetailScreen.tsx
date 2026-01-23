import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMenu from "@/components/chat/ChatMenu";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageOptionsModal from "@/components/chat/MessageOptionsModal";
import PetPalBlockModal from "@/components/home/petPals/PetPalBlockModal";
import ImageViewingModal from "@/components/ui/ImageViewingModal";
import { Colors, Spacing } from "@/constants/colors";
import { Message } from "@/services/chatService";
import socketService from "@/services/socketService";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMPTY_MESSAGES: any[] = [];
const DEFAULT_PAGINATION = { page: 1, hasMore: true, isLoading: false };

export default React.memo(ChatDetailScreen);

function ChatDetailScreen() {
  const { id, name, avatar } = useLocalSearchParams();
  const conversationId = id as string;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuthStore();

  // Only subscribe to messages for THIS conversation - won't re-render on other conversations
  const messages = useChatStore(
    (state) => state.messages[conversationId] || EMPTY_MESSAGES,
  );

  // Subscribe to pagination state
  const pagination = useChatStore(
    (state) => state.pagination[conversationId] || DEFAULT_PAGINATION,
  );

  // Only subscribe to isBlocked status for THIS conversation
  const isBlockedInStore = useChatStore((state) =>
    state.blockedUsers.some((conv) => conv.id === conversationId),
  );

  const isLoadingMessages = useChatStore((state) => state.isLoadingMessages);

  // Get action functions (these don't cause re-renders)
  const fetchMessages = useChatStore((state) => state.fetchMessages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const editMessage = useChatStore((state) => state.editMessage);
  const removeMessage = useChatStore((state) => state.removeMessage);
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
  const [isBlocked, setIsBlocked] = useState(isBlockedInStore);

  // State for message actions
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

  // Update isBlocked when store value changes
  useEffect(() => {
    setIsBlocked(isBlockedInStore);
  }, [isBlockedInStore]);

  useEffect(() => {
    if (conversationId) {
      // Check if conversation is blocked by getting from store
      const { blockedUsers } = useChatStore.getState();
      const isConversationBlocked = blockedUsers.some(
        (conv) => conv.id === conversationId,
      );

      // Only fetch messages if not blocked
      if (!isConversationBlocked) {
        fetchMessages(conversationId); // This returns immediately with cached data
      }
      setActiveConversation(conversationId);

      // Defer socket connection until after mount (non-blocking)
      setTimeout(() => {
        socketService.joinConversation(conversationId);
      }, 0);
    }

    return () => {
      setActiveConversation(null);
      if (conversationId) {
        socketService.leaveConversation(conversationId);
      }
    };
  }, [conversationId, isBlockedInStore]); // Depend on isBlockedInStore for block status changes

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
      if (isEditing && editingMessageId) {
        // Handle Edit
        await editMessage(conversationId, editingMessageId, messageText.trim());
        setIsEditing(false);
        setEditingMessageId(null);
      } else if (selectedImages.length > 0) {
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
      console.error("Failed to send/edit message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = async () => {
    if (selectedMessage?.body) {
      await Clipboard.setStringAsync(selectedMessage.body);
    }
    setSelectedMessage(null);
  };

  const handleEdit = () => {
    if (selectedMessage) {
      setIsEditing(true);
      setEditingMessageId(selectedMessage.id);
      setMessageText(selectedMessage.body || "");
      setSelectedMessage(null);
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      removeMessage(conversationId, selectedMessage.id);
      setSelectedMessage(null);
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
              // Get the other user's ID from store
              const { conversations, blockedUsers } = useChatStore.getState();
              const conversation =
                conversations.find((c) => c.id === conversationId) ||
                blockedUsers.find((c) => c.id === conversationId);

              const recipient = conversation?.participants.find(
                (p) => p.id !== user?.id,
              );

              if (recipient) {
                await unblockUser(recipient.id);
                setIsBlocked(false); // Update UI immediately
                console.log("User unblocked successfully");
              } else {
                console.error("Failed to find recipient for unblock");
              }
            } catch (error) {
              console.error("Failed to unblock user:", error);
            }
          }}
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              onImagePress={(uri) => setViewingImage(uri)}
              onLongPress={(m) => setSelectedMessage(m)}
            />
          )}
          // Pagination props
          onEndReached={() => {
            if (
              pagination.hasMore &&
              !pagination.isLoading &&
              !isLoadingMessages
            ) {
              fetchMessages(conversationId, pagination.page + 1);
            }
          }}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            pagination.isLoading ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
          }
          // Performance optimizations
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          contentContainerStyle={[
            styles.messageList,
            { flexGrow: 1, justifyContent: "flex-end" },
          ]}
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
            isEditing={isEditing}
            onCancelEdit={() => {
              setIsEditing(false);
              setEditingMessageId(null);
              setMessageText("");
            }}
          />
        )}

        <MessageOptionsModal
          visible={!!selectedMessage}
          isMyMessage={
            selectedMessage?.senderId === user?.id ||
            selectedMessage?.sender === "me"
          }
          onClose={() => setSelectedMessage(null)}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <PetPalBlockModal
          visible={blockModalVisible}
          onClose={() => setBlockModalVisible(false)}
          onConfirm={async () => {
            try {
              // Get the other user's ID from store
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
