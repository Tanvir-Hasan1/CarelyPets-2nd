import PostOptionsDropdown from "@/components/accounts/profile/PostOptionsDropdown";
import CommentModal from "@/components/ui/CommentModal";
import DeleteModal from "@/components/ui/DeleteModal";
import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import { Colors } from "@/constants/colors";
import communityService, { Post } from "@/services/communityService";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, MessageCircle, MoreVertical } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PetPalBlockModal from "../home/petPals/PetPalBlockModal";
import PetPalPostDropdown from "../home/petPals/PetPalPostDropdown";
import PetPalReportModal from "../home/petPals/PetPalReportModal";
import PetPalWriteReportModal from "../home/petPals/PetPalWriteReportModal";

const { width: windowWidth } = Dimensions.get("window");

const PostDetailView = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useAuthStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showWriteReportModal, setShowWriteReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const isOwnPost = post?.author?.id === user?.id;

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      setIsLoading(true);
      const response = await communityService.getPostById(id as string);
      if (response.success) {
        setPost(response.data);
        setLikesCount(response.data.likesCount);
        setIsLiked(response.data.isLiked);
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = () => {
    setDropdownVisible(false);
    router.push("/(tabs)/account/profile/edit-post");
  };

  const handleDeletePost = () => {
    setDropdownVisible(false);
    setDeleteModalVisible(true);
  };

  const confirmDeletePost = async () => {
    if (!post) return;
    try {
      setDeleteModalVisible(false);
      setIsDeleting(true);
      const response = await communityService.deletePost(post.id);
      if (response.success) {
        setDeleteSuccess(true);
        setTimeout(() => {
          setIsDeleting(false);
          router.back();
        }, 1500);
      } else {
        setIsDeleting(false);
        alert("Failed to delete post");
      }
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };

  const handleReportPost = async (reason: string) => {
    if (!post) return;
    try {
      setShowReportModal(false);
      setShowWriteReportModal(false);
      setIsReporting(true);

      const response = await communityService.reportPost(post.id, reason);
      console.log("Report response data:", response.data);

      if (response.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setIsReporting(false);
          setReportSuccess(false);
        }, 1500);
      } else {
        setIsReporting(false);
        alert("Failed to submit report");
      }
    } catch (error) {
      setIsReporting(false);
      console.error("Error reporting post:", error);
      alert("Error reporting post");
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / windowWidth);
    setCurrentImageIndex(index);
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      // Optimistic update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikesCount((prev) =>
        newLikedState ? prev + 1 : Math.max(0, prev - 1),
      );

      const response = await communityService.likePost(post.id);
      if (response.success) {
        // Update with actual data from response
        setLikesCount(response.data.likesCount);
        // The API might return if the post is liked by the current user
        // If the backend handles toggle, response.data.likesCount will be accurate
      } else {
        // Revert on failure
        setIsLiked(!newLikedState);
        setLikesCount(post.likesCount);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(post.likesCount);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="View Post" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Header title="View Post" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Post not found.</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="View Post" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.postCard}>
          {/* Header: User Info */}
          <View style={styles.postHeader}>
            <Image
              source={{
                uri:
                  post.author.avatarUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{post.author.name}</Text>
              <Text style={styles.timeAgo}>{post.timeAgo}</Text>
            </View>
            <View style={styles.moreContainer}>
              <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <MoreVertical size={20} color="#6B7280" />
              </TouchableOpacity>
              {isOwnPost ? (
                <PostOptionsDropdown
                  visible={dropdownVisible}
                  onClose={() => setDropdownVisible(false)}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                />
              ) : (
                <PetPalPostDropdown
                  visible={dropdownVisible}
                  onClose={() => setDropdownVisible(false)}
                  onReport={() => setShowReportModal(true)}
                  onBlock={() => setShowBlockModal(true)}
                />
              )}
            </View>
          </View>

          {/* Content: Text */}
          {post.text ? (
            <View style={styles.contentContainer}>
              <Text style={styles.postText}>{post.text}</Text>
            </View>
          ) : null}

          {/* Content: Image Slider */}
          {post.media && post.media.length > 0 ? (
            <View style={styles.sliderContainer}>
              <FlatList
                data={post.media}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={({ item }) => (
                  <Image source={{ uri: item.url }} style={styles.postImage} />
                )}
              />
              {post.media.length > 1 && (
                <View style={styles.dotContainer}>
                  {post.media.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        currentImageIndex === index && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : null}

          {/* Footer: Actions */}
          <View style={styles.postFooter}>
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statItem} onPress={handleLike}>
                <Heart
                  size={20}
                  color={isLiked ? Colors.primary : "#666"}
                  fill={isLiked ? Colors.primary : "transparent"}
                />
                <Text
                  style={[
                    styles.statText,
                    isLiked && { color: Colors.primary },
                  ]}
                >
                  {likesCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statItem}
                onPress={() => setCommentModalVisible(true)}
              >
                <MessageCircle size={20} color="#666" />
                <Text style={styles.statText}>{post.commentsCount}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sharesText}>
              {post.sharesCount || 0} shares
            </Text>
          </View>
        </View>
      </ScrollView>

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeletePost}
      />

      <LoadingModal
        visible={isDeleting}
        message="Deleting post..."
        success={deleteSuccess}
        successMessage="Post deleted successfully!"
      />

      <LoadingModal
        visible={isReporting}
        message="Submitting report..."
        success={reportSuccess}
        successMessage="Report submitted successfully!"
      />

      <PetPalReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSelectOther={() => {
          setShowReportModal(false);
          setShowWriteReportModal(true);
        }}
        onSelectReason={handleReportPost}
      />

      <PetPalWriteReportModal
        visible={showWriteReportModal}
        onClose={() => setShowWriteReportModal(false)}
        onSend={(text: string) => {
          handleReportPost(text);
        }}
      />

      <PetPalBlockModal
        visible={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={() => {
          console.log("User blocked");
          setShowBlockModal(false);
        }}
      />

      {post && (
        <CommentModal
          visible={commentModalVisible}
          onClose={() => setCommentModalVisible(false)}
          postId={post.id}
          likesCount={likesCount}
          sharesCount={post.sharesCount}
          onCommentAdded={() => {
            // Optimistically increment or refetch
            setPost({ ...post, commentsCount: post.commentsCount + 1 });
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  timeAgo: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  moreContainer: {
    position: "relative",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  sliderContainer: {
    width: windowWidth,
    position: "relative",
  },
  postImage: {
    width: windowWidth,
    height: 400,
    backgroundColor: "#F3F4F6",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#4B5563",
  },
  sharesText: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default PostDetailView;
