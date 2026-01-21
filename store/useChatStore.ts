import chatService, { Conversation, Message } from "@/services/chatService";
import { useAuthStore } from "@/store/useAuthStore";
import { create } from "zustand";

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  error: string | null;

  // Actions
  fetchConversations: (search?: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
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
  updateConversation: (
    conversation: Partial<Conversation> & { id: string },
  ) => void;
  setActiveConversation: (id: string | null) => void;
  markAsRead: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
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

  fetchMessages: async (conversationId: string) => {
    set({ isLoadingMessages: true, error: null });
    try {
      const response = await chatService.getMessages(conversationId);
      if (response.success && response.data) {
        // The API returns { success: true, data: { data: Message[], pagination: ... } }
        const apiMessages = response.data.data;
        console.log(
          `[Store] Fetched ${apiMessages?.length} messages for ${conversationId}`,
        );

        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: Array.isArray(apiMessages)
              ? [...apiMessages].reverse()
              : [],
          },
          isLoadingMessages: false,
        }));
      } else {
        set({ error: "Failed to fetch messages", isLoadingMessages: false });
      }
    } catch (error: any) {
      set({
        error: error.message || "Error fetching messages",
        isLoadingMessages: false,
      });
    }
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
      const updatedMessages = [...conversationMessages, message];
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
      const updatedMessages = conversationMessages.filter(
        (m) => m.id !== messageId,
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
}));
