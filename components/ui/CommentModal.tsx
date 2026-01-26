import SendIcon from "@/assets/images/icons/send.svg";
import { Colors } from "@/constants/colors";
import communityService from "@/services/communityService";
import { Heart, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface UIComment {
  id: string;
  userAvatar: string;
  userName: string;
  content: string;
  time: string;
  likesCount: number;
  isLiked: boolean;
  replies?: UIComment[];
}

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string | number;
  likesCount: string | number;
  sharesCount: string | number;
  onCommentAdded?: () => void;
}

const mapApiCommentsToUI = (apiData: any[]): UIComment[] => {
  return apiData.map((item) => {
    // Handle both wrapped { comment, replies } and flat { id, text, ... } formats
    const comment = item.comment || item;
    const replies = item.replies || [];

    return {
      id: String(comment.id),
      userAvatar:
        comment.author?.avatarUrl ||
        `https://i.pravatar.cc/150?u=${comment.author?.username || "user"}`,
      userName: comment.author?.name || "User",
      content: comment.text,
      time: comment.timeAgo || "Just now",
      likesCount: comment.likesCount || 0,
      isLiked: comment.isLikedByMe || false,
      replies: replies.map((reply: any) => ({
        id: String(reply.id),
        userAvatar:
          reply.author?.avatarUrl ||
          `https://i.pravatar.cc/150?u=${reply.author?.username || "user"}`,
        userName: reply.author?.name || "User",
        content: reply.text,
        time: reply.timeAgo || "Just now",
        likesCount: reply.likesCount || 0,
        isLiked: reply.isLikedByMe || false,
      })),
    };
  });
};

/* ---------------- Comment Item ---------------- */
const CommentItem = ({
  comment,
  isReply = false,
  onReply,
  onLike,
}: {
  comment: UIComment;
  isReply?: boolean;
  onReply: (comment: UIComment) => void;
  onLike: (commentId: string) => void;
}) => (
  <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
    <View style={styles.commentHeader}>
      <Image
        source={{ uri: comment.userAvatar }}
        style={isReply ? styles.replyAvatar : styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentUserName}>{comment.userName}</Text>
          <Text style={styles.commentText}>{comment.content}</Text>
        </View>
        <View style={styles.commentActions}>
          <Text style={styles.actionText}>{comment.time}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onLike(comment.id)}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Text
              style={[
                styles.actionText,
                comment.isLiked && styles.highlightText,
              ]}
            >
              {comment.isLiked ? "Liked" : "Like"}
            </Text>
            {comment.likesCount > 0 && (
              <Text
                style={[
                  styles.actionText,
                  comment.isLiked && styles.highlightText,
                ]}
              >
                {comment.likesCount}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onReply(comment)}>
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>

    {!isReply && comment.replies && comment.replies.length > 0 && (
      <View style={styles.repliesList}>
        <View style={styles.replyLine} />
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            isReply
            onReply={onReply}
            onLike={onLike}
          />
        ))}
      </View>
    )}
  </View>
);

/* ---------------- Comment Modal ---------------- */
const CommentModal = ({
  visible,
  onClose,
  postId,
  likesCount,
  sharesCount,
  onCommentAdded,
}: CommentModalProps) => {
  const [comments, setComments] = useState<UIComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<UIComment | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* -------- Fetch Comments -------- */
  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await communityService.getPostComments(postId);
      if (res.success && res.data) {
        setComments(mapApiCommentsToUI(res.data));
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && postId) {
      loadComments();
    } else if (!visible) {
      setComments([]);
      setReplyingTo(null);
      setNewComment("");
    }
  }, [visible, postId]);

  /* -------- Handle Like -------- */
  const handleLike = async (commentId: string) => {
    // 1. Optimistic Update
    setComments((prevComments) => {
      const updateList = (list: UIComment[]): UIComment[] => {
        return list.map((c) => {
          if (c.id === commentId) {
            const newIsLiked = !c.isLiked;
            return {
              ...c,
              isLiked: newIsLiked,
              likesCount: newIsLiked
                ? c.likesCount + 1
                : Math.max(0, c.likesCount - 1),
            };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateList(c.replies) };
          }
          return c;
        });
      };
      return updateList(prevComments);
    });

    // 2. API Call
    try {
      const res = await communityService.likeComment(commentId);
      if (res.success && res.data) {
        setComments((prevComments) => {
          const updateList = (list: UIComment[]): UIComment[] => {
            return list.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  isLiked: res.data.isLikedByMe,
                  likesCount: res.data.likesCount,
                };
              }
              if (c.replies && c.replies.length > 0) {
                return { ...c, replies: updateList(c.replies) };
              }
              return c;
            });
          };
          return updateList(prevComments);
        });
      }
    } catch (err) {
      console.error("Failed to like comment", err);
      // Revert if error (simple revert by reloading or toggling back)
      // For simplicity/safety, we might just reload comments or let the user try again
      // But let's try to revert the toggle
      setComments((prevComments) => {
        const updateList = (list: UIComment[]): UIComment[] => {
          return list.map((c) => {
            if (c.id === commentId) {
              const newIsLiked = !c.isLiked; // Toggle back
              return {
                ...c,
                isLiked: newIsLiked,
                likesCount: newIsLiked
                  ? c.likesCount + 1
                  : Math.max(0, c.likesCount - 1),
              };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateList(c.replies) };
            }
            return c;
          });
        };
        return updateList(prevComments);
      });
    }
  };

  /* -------- Send Comment / Reply -------- */
  const handleSend = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const parentId = replyingTo?.id || null;
      const res = await communityService.createComment({
        postId,
        text: newComment.trim(),
        parentId,
      });

      if (res.success) {
        setNewComment("");
        setReplyingTo(null);
        if (onCommentAdded) onCommentAdded();
        await loadComments(); // refresh after post
      } else {
        alert("Failed to send comment");
      }
    } catch (err) {
      console.error("Failed to send comment", err);
      alert("Error sending comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            <View style={styles.headerHandle} />

            <View style={styles.statsRow}>
              <View style={styles.statGroup}>
                <Heart size={20} color={Colors.primary} fill={Colors.primary} />
                <Text style={styles.statCount}>{likesCount}</Text>
              </View>
              <Text style={styles.shareCount}>{sharesCount} shares</Text>
            </View>

            <View style={{ flex: 1 }}>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{ marginTop: 40 }}
                />
              ) : (
                <FlatList
                  data={comments}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <CommentItem
                      comment={item}
                      onReply={setReplyingTo}
                      onLike={handleLike}
                    />
                  )}
                  contentContainerStyle={styles.commentsList}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews={Platform.OS === "android"}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        No comments yet. Be the first to comment!
                      </Text>
                    </View>
                  }
                />
              )}
            </View>

            {replyingTo && (
              <View style={styles.replyingIndicator}>
                <Text style={styles.replyingToText}>
                  Replying to {replyingTo.userName}
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <X size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                placeholder={replyingTo ? "Add reply..." : "Add comment..."}
                placeholderTextColor="#9CA3AF"
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!newComment.trim() || isSubmitting) &&
                    styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <SendIcon width={24} height={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "80%",
    paddingTop: 12,
  },
  headerHandle: {
    width: 60,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  shareCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  commentsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  commentContainer: {
    marginBottom: 24,
  },
  replyContainer: {
    marginTop: 16,
  },
  commentHeader: {
    flexDirection: "row",
    gap: 12,
  },
  commentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    paddingLeft: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#6B7280",
  },
  highlightText: {
    color: Colors.secondary,
    fontWeight: "600",
  },
  repliesList: {
    paddingLeft: 22,
    position: "relative",
  },
  replyLine: {
    position: "absolute",
    left: 0,
    top: -10,
    bottom: 0,
    width: 2,
    backgroundColor: "#E5E7EB",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 14,
    color: "#111827",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  replyingIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  replyingToText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default CommentModal;
