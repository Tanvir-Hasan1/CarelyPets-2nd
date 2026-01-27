import api from "./api";

export interface Participant {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  lastSeenAt: string;
}

export interface Attachment {
  url: string;
  mimeType: string;
  fileName: string;
  size: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  body: string;
  readAt: string | null;
  editedAt: string | null;
  deletedAt: string | null;
  isDeleted: boolean;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  // For UI compatibility during transition
  content?: string;
  status?: string;
  sender?: string;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  otherParticipant?: Participant & {
    isOnline?: boolean;
    isBlocked?: boolean;
    lastSeenAt?: string;
  };
  lastMessage: Message | null;
  unreadCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
}

export interface MessagesResponse {
  success: boolean;
  data: {
    data: Message[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export interface UserResult {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  isOnline: boolean;
  lastSeenAt: string;
}

export interface UserSearchResponse {
  success: boolean;
  data: UserResult[];
}

class ChatService {
  async getConversations(
    search: string = "",
    status: string = "all",
  ): Promise<ConversationsResponse> {
    return await api.get<ConversationsResponse>(
      `/messages/conversations?search=${search}&status=${status}`,
    );
  }

  async searchUsers(query: string): Promise<UserSearchResponse> {
    console.log(`[ChatService] Searching users with query: "${query}"`);
    try {
      const response = await api.get<UserSearchResponse>(
        `/messages/users/search?query=${encodeURIComponent(query)}`,
      );
      console.log(
        `[ChatService] Search response:`,
        JSON.stringify(response, null, 2),
      );
      return response;
    } catch (error) {
      console.error(`[ChatService] Search error:`, error);
      throw error;
    }
  }

  async getMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<MessagesResponse> {
    return await api.get<MessagesResponse>(
      `/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
    );
  }

  async sendMessage(
    recipientId: string,
    body: string,
    attachments: Attachment[] = [],
  ): Promise<{ success: boolean; data: Message }> {
    return await api.post<{ success: boolean; data: Message }>("/messages", {
      recipientId,
      body,
      attachments,
    });
  }

  async sendMessageWithAttachments(
    formData: FormData,
  ): Promise<{ success: boolean; data: Message }> {
    return await api.post<{ success: boolean; data: Message }>(
      "/messages/attachments",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // Higher timeout for file uploads
      },
    );
  }

  async markAsRead(conversationId: string): Promise<{ success: boolean }> {
    return await api.post<{ success: boolean }>(
      `/messages/conversations/${conversationId}/read`,
      {},
    );
  }

  async blockUser(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    return await api.post<{ success: boolean; message: string }>(
      `/messages/block/${userId}`,
      {},
    );
  }

  async deleteConversation(
    conversationId: string,
  ): Promise<{ success: boolean; message: string }> {
    return await api.delete<{ success: boolean; message: string }>(
      `/messages/conversations/${conversationId}`,
    );
  }

  async unblockUser(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    return await api.delete<{ success: boolean; message: string }>(
      `/messages/block/${userId}`,
    );
  }

  async updateMessage(
    messageId: string,
    body: string,
  ): Promise<{ success: boolean; data: Message; message: string }> {
    return await api.patch<{
      success: boolean;
      data: Message;
      message: string;
    }>(`/messages/${messageId}`, { body });
  }

  async deleteMessage(
    messageId: string,
  ): Promise<{ success: boolean; message: string }> {
    return await api.delete<{ success: boolean; message: string }>(
      `/messages/${messageId}`,
    );
  }
}

export const chatService = new ChatService();
export default chatService;
