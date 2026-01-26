import FeedItem from "@/components/accounts/profile/FeedItem";
import PetPalBlockModal from "@/components/home/petPals/PetPalBlockModal";
import PetPalReportModal from "@/components/home/petPals/PetPalReportModal";
import PetPalWriteReportModal from "@/components/home/petPals/PetPalWriteReportModal";
import ShareThoughtsCard from "@/components/pethub/ShareThoughtsCard";
import CommentModal from "@/components/ui/CommentModal";
import DeleteModal from "@/components/ui/DeleteModal";
import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import { Colors, Spacing } from "@/constants/colors";
import communityService, { Post } from "@/services/communityService";
import { useAuthStore } from "@/store/useAuthStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PetHubScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [dropdownPostId, setDropdownPostId] = useState<string | number | null>(
    null,
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(
    null,
  );

  const [showReportModal, setShowReportModal] = useState(false);
  const [showWriteReportModal, setShowWriteReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await communityService.getAllPosts();
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await communityService.getAllPosts();
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error refreshing posts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLikePost = async (postId: string | number) => {
    // Optimistic update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const currentlyLiked = post.isLikedByMe ?? post.isLiked;
          const newIsLiked = !currentlyLiked;
          return {
            ...post,
            isLiked: newIsLiked,
            isLikedByMe: newIsLiked,
            likesCount: newIsLiked
              ? post.likesCount + 1
              : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      }),
    );

    try {
      const response = await communityService.likePost(postId);
      if (response.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? response.data : post)),
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
      onRefresh();
    }
  };

  const handleDeletePost = (postId: string | number) => {
    setSelectedPostId(postId);
    setDropdownPostId(null);
    setDeleteModalVisible(true);
  };

  const confirmDeletePost = async () => {
    if (!selectedPostId) return;
    try {
      setDeleteModalVisible(false);
      setIsDeleting(true);
      const response = await communityService.deletePost(selectedPostId);
      if (response.success) {
        setDeleteSuccess(true);
        setTimeout(() => {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== selectedPostId),
          );
          setIsDeleting(false);
          setDeleteSuccess(false);
          setSelectedPostId(null);
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
    if (!selectedPostId) return;
    try {
      setShowReportModal(false);
      setShowWriteReportModal(false);
      setIsReporting(true);

      const response = await communityService.reportPost(
        selectedPostId,
        reason,
      );
      console.log("Report response data:", response.data);

      if (response.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setIsReporting(false);
          setReportSuccess(false);
          setSelectedPostId(null);
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

  const handleEditPost = (postId: string | number) => {
    setDropdownPostId(null);
    router.push({
      pathname: "/(tabs)/account/profile/edit-post",
      params: { id: postId },
    });
  };

  const handleCommentPress = (post: any) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      router.push({
        pathname: "/(tabs)/pethub/create-post",
        params: { initialImages: JSON.stringify(selectedImages) },
      });
    }
  };

  const handleCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = [result.assets[0].uri];
      router.push({
        pathname: "/(tabs)/pethub/create-post",
        params: { initialImages: JSON.stringify(selectedImages) },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="PetHub" showBackButton={false} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <ShareThoughtsCard
            avatarUrl={user?.avatarUrl as string}
            onPress={() => router.push("/(tabs)/pethub/create-post")}
            onGallery={handleGallery}
            onCamera={handleCamera}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet.</Text>
            </View>
          ) : (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{ marginTop: 20 }}
            />
          )
        }
        renderItem={({ item }) => (
          <FeedItem
            postId={item.id}
            userAvatar={
              item.author.avatarUrl ||
              "https://i.pravatar.cc/150?u=" + item.author.username
            }
            userName={item.author.name}
            actionText={
              item.postType === "profile_update"
                ? "updated their profile"
                : "posted an update"
            }
            timeAgo={item.timeAgo}
            contentImage={
              item.media && item.media.length > 0
                ? item.media[0].url
                : undefined
            }
            caption={item.text}
            likesCount={item.likesCount.toString()}
            commentsCount={item.commentsCount.toString()}
            sharesCount={item.sharesCount?.toString() || "0"}
            isLiked={item.isLikedByMe ?? item.isLiked}
            onLike={() => handleLikePost(item.id)}
            isOwnPost={item.author.id === user?.id}
            isDropdownVisible={dropdownPostId === item.id}
            onToggleDropdown={() =>
              setDropdownPostId(dropdownPostId === item.id ? null : item.id)
            }
            onCloseDropdown={() => setDropdownPostId(null)}
            onEditPost={() => handleEditPost(item.id)}
            onDeletePost={() => handleDeletePost(item.id)}
            onReport={() => {
              setSelectedPostId(item.id);
              setDropdownPostId(null);
              setShowReportModal(true);
            }}
            onBlock={() => {
              setSelectedPostId(item.id);
              setDropdownPostId(null);
              setShowBlockModal(true);
            }}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/pethub/view-post",
                params: { id: item.id },
              })
            }
            onCommentPress={() => handleCommentPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedPost && (
        <CommentModal
          visible={commentModalVisible}
          onClose={() => setCommentModalVisible(false)}
          postId={selectedPost.id}
          likesCount={selectedPost.likesCount}
          sharesCount={selectedPost.sharesCount}
        />
      )}

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100, // Extra space for tab bar
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
    fontStyle: "italic",
  },
});
