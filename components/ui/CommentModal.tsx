import SendIcon from "@/assets/images/icons/send.svg";
import { Colors } from "@/constants/colors";
import communityService from "@/services/communityService";
import { useAuthStore } from "@/store/useAuthStore";
import * as Clipboard from "expo-clipboard";
import { Edit2, Heart, X } from "lucide-react-native";
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
import PetPalReportModal from "../home/petPals/PetPalReportModal";
import PetPalWriteReportModal from "../home/petPals/PetPalWriteReportModal";
import CommentOptionsModal from "./CommentOptionsModal";
import LoadingModal from "./LoadingModal";

interface UIComment {
  id: string;
  userAvatar: string;
  userName: string;
  content: string;
  time: string;
  likesCount: number;
  isLiked: boolean;
  authorId?: string;
  parentId?: string;
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
      authorId: String(comment.author?.id),
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
        authorId: String(reply.author?.id),
        parentId: String(comment.id),
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
  onLongPress,
}: {
  comment: UIComment;
  isReply?: boolean;
  onReply: (comment: UIComment) => void;
  onLike: (commentId: string) => void;
  onLongPress: (comment: UIComment) => void;
}) => (
  <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
    <View style={styles.commentHeader}>
      <Image
        source={{ uri: comment.userAvatar }}
        style={isReply ? styles.replyAvatar : styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <TouchableOpacity
          activeOpacity={0.7}
          onLongPress={() => onLongPress(comment)}
          delayLongPress={500}
        >
          <View style={styles.commentBubble}>
            <Text style={styles.commentUserName}>{comment.userName}</Text>
            <Text style={styles.commentText}>{comment.content}</Text>
          </View>
        </TouchableOpacity>
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
            onLongPress={onLongPress}
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

  const { user } = useAuthStore();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<UIComment | null>(
    null,
  );

  // Edit State
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  // Delete State
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [showWriteReportModal, setShowWriteReportModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const isOwnComment = selectedComment?.userName === user?.name; // Simple check, ideally check ID if available in UIComment
  // Better check if UIComment had authorId. Current UIComment doesn't have authorId.
  // We need to map authorId in mapApiCommentsToUI or update UIComment.
  // Let's update mapApiCommentsToUI to include authorId for robust check.

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

  /* -------- Handle Comment Actions -------- */
  const handleLongPress = (comment: UIComment) => {
    setSelectedComment(comment);
    setOptionsModalVisible(true);
  };

  const handleCopy = async () => {
    if (selectedComment) {
      await Clipboard.setStringAsync(selectedComment.content);
      // Optional: Toast or feedback
    }
  };

  const handleDelete = async () => {
    if (!selectedComment) return;
    try {
      setIsDeleting(true);
      const res = await communityService.deleteComment(selectedComment.id);
      if (res.success) {
        setDeleteSuccess(true);
        setTimeout(() => {
          setIsDeleting(false);
          setDeleteSuccess(false);
          loadComments(); // Refresh list
        }, 1000);
      } else {
        alert("Failed to delete comment");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Delete failed", err);
      setIsDeleting(false);
      alert("Error deleting comment");
    }
  };

  const handleReport = async (reason: string) => {
    if (!selectedComment) return;
    try {
      setShowReportModal(false);
      setShowWriteReportModal(false);
      setIsReporting(true);
      const res = await communityService.reportComment(
        selectedComment.id,
        reason,
      );
      if (res.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setIsReporting(false);
          setReportSuccess(false);
        }, 1500);
      } else {
        setIsReporting(false);
        alert("Failed to report comment");
      }
    } catch (err) {
      setIsReporting(false);
      console.error("Report failed", err);
      alert("Error reporting comment");
    }
  };

  /* -------- Send Comment / Reply -------- */
  const handleSend = async () => {
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      // If replyingTo has a parentId, it means it's a child comment, so use its parentId.
      // If replyingTo does NOT have a parentId, it is a top-level comment, so use its id.
      const parentId = replyingTo?.parentId || replyingTo?.id || null;

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

  const handleEditInit = () => {
    if (selectedComment) {
      setNewComment(selectedComment.content);
      setEditingCommentId(selectedComment.id);
      setReplyingTo(null); // Ensure not replying
    }
  };

  const handleUpdate = async () => {
    if (!newComment.trim() || !editingCommentId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await communityService.updateComment(
        editingCommentId,
        newComment.trim(),
      );
      if (res.success) {
        setNewComment("");
        setEditingCommentId(null);
        await loadComments();
      } else {
        alert("Failed to update comment");
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Error updating comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setNewComment("");
    setEditingCommentId(null);
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
                      onLongPress={handleLongPress}
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

            {editingCommentId && (
              <View style={styles.replyingIndicator}>
                <Text style={styles.replyingToText}>Editing comment</Text>
                <TouchableOpacity onPress={cancelEdit}>
                  <X size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                placeholder={
                  editingCommentId
                    ? "Update comment..."
                    : replyingTo
                      ? "Add reply..."
                      : "Add comment..."
                }
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
                onPress={editingCommentId ? handleUpdate : handleSend}
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : editingCommentId ? (
                  <Edit2 width={20} height={20} color="#FFFFFF" />
                ) : (
                  <SendIcon width={24} height={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <CommentOptionsModal
            visible={optionsModalVisible}
            onClose={() => setOptionsModalVisible(false)}
            isOwnComment={user?.id === selectedComment?.authorId}
            onEdit={handleEditInit}
            onDelete={() => {
              setOptionsModalVisible(false);
              handleDelete();
            }} // Trigger directly for now or open confirmation? User asked specifically for LoadingModal while deleting.
            onReport={() => setShowReportModal(true)}
            onCopy={handleCopy}
          />

          <LoadingModal
            visible={isDeleting}
            message="Deleting comment..."
            success={deleteSuccess}
            successMessage="Comment deleted"
          />

          <LoadingModal
            visible={isReporting}
            message="Reporting..."
            success={reportSuccess}
            successMessage="Report submitted"
          />

          <PetPalReportModal
            visible={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSelectOther={() => {
              setShowReportModal(false);
              setShowWriteReportModal(true);
            }}
            onSelectReason={handleReport}
          />

          <PetPalWriteReportModal
            visible={showWriteReportModal}
            onClose={() => setShowWriteReportModal(false)}
            onSend={(text: string) => handleReport(text)}
          />
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
