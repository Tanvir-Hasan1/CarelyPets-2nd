import chatService, { Conversation, Message } from "@/services/chatService";
import { useAuthStore } from "@/store/useAuthStore";
import { create } from "zustand";

interface ChatState {
  conversations: Conversation[];
  blockedUsers: Conversation[];
  messages: Record<string, Message[]>;
  pagination: Record<
    string,
    { page: number; hasMore: boolean; isLoading: boolean }
  >;
  activeConversationId: string | null;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  error: string | null;

  // Actions
  fetchConversations: (search?: string) => Promise<void>;
  fetchBlockedUsers: () => Promise<void>;
  fetchMessages: (conversationId: string, page?: number) => void;
  sendMessage: (
    conversationId: string,
    content: string,
    attachments?: any[],
  ) => Promise<void>;
  sendMessageWithAttachments: (
    conversationId: string,
    formData: FormData,
  ) => Promise<void>;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, message: Message) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  editMessage: (
    conversationId: string,
    messageId: string,
    newBody: string,
  ) => Promise<void>;
  removeMessage: (conversationId: string, messageId: string) => Promise<void>;
  updateConversation: (
    conversation: Partial<Conversation> & { id: string },
  ) => void;
  setActiveConversation: (id: string | null) => void;
  markAsRead: (conversationId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;

  // Selectors for notifications
  getTotalUnreadCount: () => number;
  getUnreadConversations: () => Conversation[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  blockedUsers: [],
  messages: {},
  pagination: {},
  activeConversationId: null,
  isLoadingConversations: false,
  isLoadingMessages: false,
  error: null,

  fetchConversations: async (search: string = "") => {
    set({ isLoadingConversations: true, error: null });
    try {
      const response = await chatService.getConversations(search);
      if (response.success) {
        set({ conversations: response.data, isLoadingConversations: false });
      } else {
        set({
          error: "Failed to fetch conversations",
          isLoadingConversations: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Error fetching conversations",
        isLoadingConversations: false,
      });
    }
  },

  fetchMessages: (conversationId: string, page: number = 1) => {
    // If loading next page, set per-conversation loading state
    if (page > 1) {
      set((state) => ({
        pagination: {
          ...state.pagination,
          [conversationId]: {
            ...state.pagination[conversationId],
            isLoading: true,
          },
        },
      }));
    } else {
      // First page: set global loading state
      const cachedMessages = get().messages[conversationId];
      if (!cachedMessages || cachedMessages.length === 0) {
        set({ isLoadingMessages: true, error: null });
      }
    }

    // ASYNCHRONOUS: Fetch messages
    (async () => {
      try {
        const response = await chatService.getMessages(conversationId, page);
        if (response.success && response.data) {
          const apiMessages = response.data.data || [];
          const meta = response.data.pagination;

          // API returns Newest -> Oldest (Index 0 is newest)
          // For Inverted FlatList, we want this EXACT order.
          // Page 1 matches. Page 2 needs to be appended to the END (bottom of array = top of visual list).

          set((state) => {
            const currentMessages = state.messages[conversationId] || [];
            const finalMessages =
              page === 1
                ? [...apiMessages]
                : [...currentMessages, ...apiMessages]; // Append older messages to end

            return {
              messages: {
                ...state.messages,
                [conversationId]: finalMessages,
              },
              pagination: {
                ...state.pagination,
                [conversationId]: {
                  page: meta.page,
                  hasMore: meta.page * meta.limit < meta.total,
                  isLoading: false,
                },
              },
              isLoadingMessages: false,
            };
          });

          console.log(
            `[Store] Fetched page ${page} (${apiMessages.length} msgs) for ${conversationId}`,
          );
        } else {
          set({ error: "Failed to fetch messages", isLoadingMessages: false });
        }
      } catch (error: any) {
        set({
          error: error.message || "Error fetching messages",
          isLoadingMessages: false,
        });
      }
    })();
  },

  sendMessage: async (
    conversationId: string,
    content: string,
    attachments: any[] = [],
  ) => {
    try {
      const state = get();
      const conversation = state.conversations.find(
        (c) => c.id === conversationId,
      );
      if (!conversation) throw new Error("Conversation not found");

      const currentUserId = useAuthStore.getState().user?.id;
      const recipient = conversation.participants.find(
        (p) => p.id !== currentUserId,
      );

      if (!recipient) throw new Error("Recipient not found");

      const response = await chatService.sendMessage(
        recipient.id,
        content,
        attachments,
      );
      if (response.success) {
        const newMessage = response.data;
        get().addMessage(conversationId, newMessage);
      }
    } catch (error: any) {
      set({ error: error.message || "Error sending message" });
    }
  },

  sendMessageWithAttachments: async (
    conversationId: string,
    formData: FormData,
  ) => {
    try {
      const response = await chatService.sendMessageWithAttachments(formData);
      if (response.success) {
        const newMessage = response.data;
        get().addMessage(conversationId, newMessage);
      }
    } catch (error: any) {
      set({
        error: error.message || "Error sending message with attachments",
      });
    }
  },

  // Action: Edit message via API
  editMessage: async (
    conversationId: string,
    messageId: string,
    newBody: string,
  ) => {
    try {
      const response = await chatService.updateMessage(messageId, newBody);
      if (response.success) {
        get().updateMessage(conversationId, response.data);
      }
    } catch (error: any) {
      console.error("Failed to edit message:", error);
    }
  },

  // Action: Delete message via API
  removeMessage: async (conversationId: string, messageId: string) => {
    // Optimistically delete from store
    get().deleteMessage(conversationId, messageId);

    try {
      await chatService.deleteMessage(messageId);
    } catch (error: any) {
      console.error("Failed to delete message:", error);
      // Ideally revert if failed, but for now log error
    }
  },

  addMessage: (conversationId: string, message: Message) => {
    if (!conversationId) {
      console.warn("[Store] addMessage called without conversationId", message);
      return;
    }

    console.log(`[Store] Incoming message for conv: ${conversationId}`);

    set((state) => {
      const conversationMessages = state.messages[conversationId] || [];

      // Avoid duplicate messages
      if (conversationMessages.find((m) => m.id === message.id)) {
        return state;
      }

      console.log(
        `[Store] Updating state with new message for ${conversationId}.`,
      );
      // For Inverted FlatList, Newest message must be at INDEX 0
      const updatedMessages = [message, ...conversationMessages];
      const currentUserId = useAuthStore.getState().user?.id;

      const conversationExists = state.conversations.find(
        (c) => c.id === conversationId,
      );

      if (!conversationExists) {
        // If conversation doesn't exist, fetch all to get it
        get().fetchConversations();
        return {
          messages: {
            ...state.messages,
            [conversationId]: updatedMessages,
          },
        };
      }

      const updatedConversations = state.conversations
        .map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: message,
              unreadCount:
                state.activeConversationId === conversationId
                  ? 0
                  : conv.unreadCount +
                    (message.senderId !== currentUserId ? 1 : 0),
              updatedAt: message.createdAt,
            };
          }
          return conv;
        })
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );

      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages,
        },
        conversations: updatedConversations,
      };
    });
  },

  updateMessage: (conversationId: string, message: Message) => {
    set((state) => {
      const conversationMessages = state.messages[conversationId] || [];
      const updatedMessages = conversationMessages.map((m) =>
        m.id === message.id ? { ...m, ...message } : m,
      );

      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages,
        },
      };
    });
  },

  deleteMessage: (conversationId: string, messageId: string) => {
    set((state) => {
      const conversationMessages = state.messages[conversationId] || [];
      const updatedMessages = conversationMessages.map((m) =>
        m.id === messageId ? { ...m, isDeleted: true, body: "" } : m,
      );

      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages,
        },
      };
    });
  },

  updateConversation: (
    updatedFields: Partial<Conversation> & { id: string },
  ) => {
    set((state) => {
      const exists = state.conversations.find((c) => c.id === updatedFields.id);
      if (exists) {
        return {
          conversations: state.conversations.map((conv) =>
            conv.id === updatedFields.id ? { ...conv, ...updatedFields } : conv,
          ),
        };
      } else {
        // If it doesn't exist, trigger a re-fetch to get it
        get().fetchConversations();
        return state;
      }
    });
  },

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id });
    if (id) {
      get().markAsRead(id);
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      await chatService.markAsRead(conversationId);
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      }));
    } catch (error) {
      console.error("Failed to mark conversation as read", error);
    }
  },

  fetchBlockedUsers: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const response = await chatService.getConversations("", "blocked");
      if (response.success) {
        set({ blockedUsers: response.data, isLoadingConversations: false });
      } else {
        set({
          error: "Failed to fetch blocked users",
          isLoadingConversations: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || "Error fetching blocked users",
        isLoadingConversations: false,
      });
    }
  },

  blockUser: async (userId: string) => {
    try {
      const response = await chatService.blockUser(userId);
      if (response.success) {
        // Refresh conversations and blocked users
        get().fetchConversations();
        get().fetchBlockedUsers();
      }
    } catch (error: any) {
      set({ error: error.message || "Error blocking user" });
      throw error;
    }
  },

  unblockUser: async (userId: string) => {
    try {
      const response = await chatService.unblockUser(userId);
      if (response.success) {
        // Refresh conversations and blocked users
        get().fetchConversations();
        get().fetchBlockedUsers();
      }
    } catch (error: any) {
      set({ error: error.message || "Error unblocking user" });
      throw error;
    }
  },

  // Selectors for notifications
  getTotalUnreadCount: () => {
    const { conversations } = get();
    return conversations.reduce(
      (total, conv) => total + (conv.unreadCount || 0),
      0,
    );
  },

  getUnreadConversations: () => {
    const { conversations } = get();
    return conversations.filter((conv) => conv.unreadCount > 0);
  },
}));
