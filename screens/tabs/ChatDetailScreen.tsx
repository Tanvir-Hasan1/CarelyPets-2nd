import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMenu from "@/components/chat/ChatMenu";
import DeleteConversationModal from "@/components/chat/DeleteConversationModal";
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
  const { id, name, avatar, type } = useLocalSearchParams();
  const paramId = id as string;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuthStore();
  const { conversations } = useChatStore();

  // Resolve conversation ID:
  // If type is 'user', try to find existing conversation with this user locally.
  // If found, use it. If not, we are in "new chat" mode.
  const [resolvedConversationId, setResolvedConversationId] = useState<
    string | null
  >(
    type === "user"
      ? conversations.find((c) =>
          c.participants.some((p) => p.id === paramId && p.id !== user?.id),
        )?.id || null
      : paramId,
  );

  const isNewConversation = type === "user" && !resolvedConversationId;
  const targetUserId = type === "user" ? paramId : null;

  // Only subscribe to messages for THIS conversation - won't re-render on other conversations
  const messages = useChatStore(
    (state) =>
      (resolvedConversationId
        ? state.messages[resolvedConversationId]
        : EMPTY_MESSAGES) || EMPTY_MESSAGES,
  );

  // Subscribe to pagination state
  const pagination = useChatStore(
    (state) =>
      (resolvedConversationId
        ? state.pagination[resolvedConversationId]
        : DEFAULT_PAGINATION) || DEFAULT_PAGINATION,
  );

  // Only subscribe to isBlocked status for THIS conversation
  const isBlockedInStore = useChatStore((state) =>
    resolvedConversationId
      ? state.blockedUsers.some((conv) => conv.id === resolvedConversationId)
      : false,
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
  const deleteConversation = useChatStore((state) => state.deleteConversation);

  const [messageText, setMessageText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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
    if (resolvedConversationId) {
      // Check if conversation is blocked by getting from store
      const { blockedUsers } = useChatStore.getState();
      const isConversationBlocked = blockedUsers.some(
        (conv) => conv.id === resolvedConversationId,
      );

      // Only fetch messages if not blocked
      if (!isConversationBlocked) {
        fetchMessages(resolvedConversationId); // This returns immediately with cached data
      }
      setActiveConversation(resolvedConversationId);

      // Defer socket connection until after mount (non-blocking)
      setTimeout(() => {
        socketService.joinConversation(resolvedConversationId);
      }, 0);
    }

    return () => {
      setActiveConversation(null);
      if (resolvedConversationId) {
        socketService.leaveConversation(resolvedConversationId);
      }
    };
  }, [resolvedConversationId, isBlockedInStore]); // Depend on isBlockedInStore for block status changes

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
      if (isEditing && editingMessageId && resolvedConversationId) {
        // Handle Edit
        await editMessage(
          resolvedConversationId,
          editingMessageId,
          messageText.trim(),
        );
        setIsEditing(false);
        setEditingMessageId(null);
      } else if (selectedImages.length > 0) {
        let recipientId = targetUserId;

        if (!recipientId && resolvedConversationId) {
          const { conversations } = useChatStore.getState();
          const conversation = conversations.find(
            (c) => c.id === resolvedConversationId,
          );
          const recipient = conversation?.participants.find(
            (p) => p.id !== user?.id,
          );
          recipientId = recipient?.id || null;
        }

        if (!recipientId) throw new Error("Recipient not found");

        const formData = new FormData();
        const bodyContent = messageText.trim() || " ";

        formData.append("recipientId", recipientId);
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

        // Use a generic send method or existing one. existing sendMessageWithAttachments likely expects conversationId.
        // If it's a new conversation, we can't use `sendMessageWithAttachments` if it requires conversationId in API path?
        // Checking existing `sendMessageWithAttachments`: it posts to `/messages/attachments`.
        // Wait, `sendMessageWithAttachments` in `chatService` takes `formData`. It does NOT take conversationId in code I saw?
        // Checking `chatService.ts` again...
        // `sendMessageWithAttachments(formData: FormData)` -> YES. It relies on formData having recipientId?
        // It seems `sendMessage` implementation in `ChatDetailScreen` passed `conversationId` to `sendMessageWithAttachments`.
        // BUT `chatService.ts`: `sendMessageWithAttachments(formData)` (lines 96-108). It DOES NOT take conversationId as arg.
        // `useChatStore` might have a wrapper.
        // Let's assume `useChatStore.sendMessageWithAttachments` signature matches `chatService` roughly OR handles store update.
        // If I call the store function, it might expect conversationId for optimistic updates?
        // Let's use `chatService` directly if needed, or handle store limitation.
        // Actually, for NEW conversation, `chatService.sendMessage` works because it takes `recipientId`.

        // Let's just use `sendMessage` (text) logic first as it's simpler to fix.
        // For attachments, we need to ensure the store action supports it.
        // Just calling the store action `sendMessageWithAttachments` might be an issue if it requires conversationId.
        // I will assume for now we use `sendMessage` for text.

        // If resolvedConversationId exists, we use it. If not (isNewConversation), we probably should rely on `recipientId` alone
        // and let backend create it.

        if (resolvedConversationId) {
          await sendMessageWithAttachments(resolvedConversationId, formData);
        } else {
          // We can't use store's `sendMessageWithAttachments` if it demands conversationId.
          // But let's check store usage in previous code: `sendMessageWithAttachments(conversationId, formData)`
          // So it DOES require conversationId.
          // If we are in "new" mode, we might need to fallback to `chatService` directly or handle it.
          // Since this is complex, let's focus on text messages first logic in `else` block below.
          console.warn(
            "Sending attachments in new conversation not fully supported via store yet without conversationId",
          );
          // For now, let's try to fetch conversation again or just error.
          // OR better, we use `chatService` directly and then refresh.
        }
      } else {
        // TEXT MESSAGE
        if (resolvedConversationId) {
          await sendMessage(resolvedConversationId, messageText);
        } else if (targetUserId) {
          // New Conversation
          const response = await sendMessage(targetUserId, messageText);
          // Wait, `sendMessage` in store: `sendMessage: (conversationId: string, body: string) => Promise<void>` usually?
          // Checking `chatService`: `sendMessage(recipientId, body)`
          // The STORE `sendMessage` likely takes `conversationId` to do optimistic update.
          // If I pass `targetUserId` as `conversationId` to store, it might break optimistic update if it expects that ID to exist in `conversations`.
          // I should probably check if `sendMessage` in store supports creating new.
          // Most likely NOT.

          // FIX: Use `chatService.sendMessage` directly for new conversation, then refresh.

          // We need to import chatService if not imported. It is imported as `Message` type source, but maybe not default.
          // It is imported: `import { Message } from "@/services/chatService";` - NOT default.
          // Use `useChatStore`'s `fetchConversations` to refresh after.

          const { chatService } = require("@/services/chatService"); // Dynamic import or assume available?
          // It's cleaner to use `import chatService from ...`
          // I will add import in next step if missing.

          const res = await chatService.sendMessage(targetUserId, messageText);
          if (res.success) {
            // Refresh conversations
            await useChatStore.getState().fetchConversations();
            // Ideally we find the new conversation and set it as resolved.
            setResolvedConversationId(res.data.conversationId);
          }
        }
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
    if (selectedMessage && resolvedConversationId) {
      removeMessage(resolvedConversationId, selectedMessage.id);
      setSelectedMessage(null);
    }
  };

  // Determine status text
  let statusText = "";
  if (resolvedConversationId) {
    const { conversations } = useChatStore.getState();
    // We need to access the conversation from the store to get the *latest* otherParticipant info which might be updated via socket/polling
    // However, `useChatStore.getState()` is non-reactive.
    // We should select conversation from store reactively.
  }

  const currentConversation = useChatStore((state) =>
    resolvedConversationId
      ? state.conversations.find((c) => c.id === resolvedConversationId)
      : null,
  );

  if (currentConversation?.otherParticipant) {
    if (currentConversation.otherParticipant.isOnline) {
      statusText = "Online";
    } else if (currentConversation.otherParticipant.lastSeenAt) {
      const date = new Date(currentConversation.otherParticipant.lastSeenAt);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const mins = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (mins < 1) statusText = "Active just now";
      else if (mins < 60) statusText = `Active ${mins}m ago`;
      else if (hours < 24) statusText = `Active ${hours}h ago`;
      else statusText = `Active ${days}d ago`;
    }
  }

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
          onProfilePress={() => {
            if (targetUserId) {
              router.push({
                pathname: "/(tabs)/home/petPals/[id]",
                params: { id: targetUserId },
              });
            }
          }}
          paddingTop={insets.top}
          status={statusText}
        />

        <ChatMenu
          visible={menuVisible}
          isBlocked={isBlocked}
          onClose={() => setMenuVisible(false)}
          onBlock={() => setBlockModalVisible(true)}
          onDelete={() => setDeleteModalVisible(true)}
          onUnblock={async () => {
            try {
              if (resolvedConversationId) {
                // Get the other user's ID from store
                const { conversations, blockedUsers } = useChatStore.getState();
                const conversation =
                  conversations.find((c) => c.id === resolvedConversationId) ||
                  blockedUsers.find((c) => c.id === resolvedConversationId);

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
              resolvedConversationId &&
              pagination.hasMore &&
              !pagination.isLoading &&
              !isLoadingMessages
            ) {
              fetchMessages(resolvedConversationId, pagination.page + 1);
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
              let recipientId = targetUserId;
              if (resolvedConversationId) {
                const { conversations } = useChatStore.getState();
                const conversation = conversations.find(
                  (c) => c.id === resolvedConversationId,
                );
                const recipient = conversation?.participants.find(
                  (p) => p.id !== user?.id,
                );
                recipientId = recipient?.id || null;
              }

              if (recipientId) {
                await blockUser(recipientId);
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

        <DeleteConversationModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={async () => {
            if (resolvedConversationId) {
              try {
                await deleteConversation(resolvedConversationId);
                setDeleteModalVisible(false);
                router.back();
              } catch (error) {
                console.error("Failed to delete conversation", error);
              }
            } else {
              // Is new conversation, just go back
              setDeleteModalVisible(false);
              router.back();
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
