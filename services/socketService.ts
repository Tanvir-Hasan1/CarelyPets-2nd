import config from "@/config";
import { useChatStore } from "@/store/useChatStore";
import { io, Socket } from "socket.io-client";
import api from "./api";

class SocketService {
  private socket: Socket | null = null;

  connect(providedToken?: string) {
    if (this.socket?.connected) return;

    const token = providedToken || api.getAuthToken();
    if (!token) {
      console.warn("[Socket] No auth token found, skipping connection");
      return;
    }

    const baseUrl = config.api.baseUrl.split("/api")[0];
    console.log(
      "[Socket] Attempting connection to:",
      baseUrl,
      "with token:",
      token.substring(0, 10) + "...",
    );

    this.socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("[Socket] Connected! ID:", this.socket?.id);
    });

    this.socket.on("connect_error", (error) => {
      console.error("[Socket] Connection Error:", error.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected. Reason:", reason);
    });

    this.socket.on("error", (error) => {
      console.error("[Socket] General Error:", error);
    });

    // Catch-all for debugging any incoming event
    this.socket.onAny((eventName, ...args) => {
      console.log(
        `[Socket] Event Received: "${eventName}"`,
        JSON.stringify(args, null, 2),
      );
    });

    // Listen for new messages
    this.socket.on("new_message", (data) => {
      // console.log("[Socket] Handled new_message:", data); // onAny already logs this
      const message = data?.data && data?.success ? data.data : data;
      if (message && message.id) {
        useChatStore.getState().addMessage(message);
      }
    });

    // Listen for conversation updates
    this.socket.on("conversation_update", (data) => {
      const conversation = data?.data && data?.success ? data.data : data;
      if (conversation && conversation.id) {
        useChatStore.getState().updateConversation(conversation);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string) {
    if (this.socket) {
      console.log("[Socket] Joining conversation:", conversationId);
      this.socket.emit("join_conversation", { conversationId });
    } else {
      console.warn("[Socket] Cannot join conversation: Socket not connected");
    }
  }

  leaveConversation(conversationId: string) {
    if (this.socket) {
      console.log("[Socket] Leaving conversation:", conversationId);
      this.socket.emit("leave_conversation", { conversationId });
    }
  }
}

export const socketService = new SocketService();
export default socketService;
