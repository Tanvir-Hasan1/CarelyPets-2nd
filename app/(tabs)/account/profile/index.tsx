import CameraIcon from "@/assets/images/icons/Camera.svg";
import EditIcon from "@/assets/images/icons/edit.svg";
import PetPalPetList from "@/components/home/petPals/PetPalPetList";
import PetPalPhotoGrid from "@/components/home/petPals/PetPalPhotoGrid";
import ShareThoughtsCard from "@/components/pethub/ShareThoughtsCard";
import CommentModal from "@/components/ui/CommentModal";
import DeleteModal from "@/components/ui/DeleteModal";
import FeedItem from "@/components/ui/FeedItem";
import Header from "@/components/ui/Header";
import ImageSelectionModal from "@/components/ui/ImageSelectionModal";
import LoadingModal from "@/components/ui/LoadingModal";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import communityService from "@/services/communityService";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateAvatar, updateCoverPhoto, isLoading, fetchUser } =
    useAuthStore();
  const [activeDropdown, setActiveDropdown] = useState<string | number | null>(
    null,
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(
    null,
  );
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Posts" | "Photos" | "My Pets">(
    "Posts",
  );

  const handleCommentPress = (post: any) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };
  const [imageUpdateMode, setImageUpdateMode] = useState<
    "avatar" | "cover" | null
  >(null);
  const [avatarUri, setAvatarUri] = useState(
    user?.avatarUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  );
  const [coverUri, setCoverUri] = useState(
    user?.coverUrl ||
      "https://images.unsplash.com/photo-1549488497-1502dc85c4ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  );

  // Global State Integration
  const {
    userPosts,
    userPhotos,
    userPetsList,
    isLoadingPosts,
    isLoadingPhotos,
    isLoadingPets,
    fetchUserPosts,
    fetchUserPhotos,
    fetchUserPets,
    fetchAllProfileData,
    setUserPosts,
  } = useProfileStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Initial load is now handled by HomeScreen, but we can refresh here
  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchUser(), fetchAllProfileData()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarUri(user.avatarUrl);
    }
  }, [user?.avatarUrl]);

  useEffect(() => {
    if (user?.coverUrl) {
      setCoverUri(user.coverUrl);
    }
  }, [user?.coverUrl]);

  const handleEditProfile = () => {
    router.push("/(tabs)/account/profile/edit");
  };

  const handleCreatePost = () => {
    router.push("/(tabs)/account/profile/create-post");
  };

  const handleEditPost = (postId: string | number) => {
    setActiveDropdown(null);
    router.push({
      pathname: "/(tabs)/account/profile/edit-post",
      params: { id: postId },
    });
  };

  const handleDeletePost = (postId: string | number) => {
    setSelectedPostId(postId);
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
          setUserPosts((prevPosts) =>
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

  const handleViewPost = (postId: string | number) => {
    router.push({
      pathname: "/(tabs)/account/profile/view-post",
      params: { id: postId },
    });
  };

  const toggleDropdown = (postId: string | number) => {
    setActiveDropdown(activeDropdown === postId ? null : postId);
  };

  const handleLikePost = async (postId: string | number) => {
    // Optimistic update
    setUserPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newIsLiked,
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
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? response.data : post)),
        );
      } else {
        loadPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
      loadPosts();
    }
  };

  const handleUpdateImage = (mode: "avatar" | "cover") => {
    setImageUpdateMode(mode);
    setImageModalVisible(true);
  };

  const processImageSelection = async (
    uri: string,
    base64: string | undefined | null,
  ) => {
    if (!imageUpdateMode) return;

    try {
      const base64Image = base64 ? `data:image/jpeg;base64,${base64}` : null;

      if (imageUpdateMode === "avatar") {
        if (base64Image) {
          await updateAvatar(base64Image);
        } else {
          // Fallback to URI if base64 is not available (though we prefer base64 for API)
          setAvatarUri(uri);
        }
      } else {
        if (base64Image) {
          await updateCoverPhoto(base64Image);
        } else {
          setCoverUri(uri);
        }
      }
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const pickFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: imageUpdateMode === "avatar" ? [1, 1] : [16, 9],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      await processImageSelection(
        result.assets[0].uri,
        result.assets[0].base64,
      );
    }
  };

  const pickFromCamera = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Camera permission denied");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: imageUpdateMode === "avatar" ? [1, 1] : [16, 9],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        await processImageSelection(
          result.assets[0].uri,
          result.assets[0].base64,
        );
      }
    } catch (error) {
      console.error("Error launching camera:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Header Container */}
        <View style={styles.headerContainer}>
          {/* Cover Photo Container */}
          <View style={styles.coverContainer}>
            <Image source={{ uri: coverUri }} style={styles.coverPhoto} />
            <TouchableOpacity
              style={styles.coverCameraButton}
              onPress={() => handleUpdateImage("cover")}
            >
              <CameraIcon width={28} height={28} />
            </TouchableOpacity>
            {isLoading && imageUpdateMode === "cover" && (
              <View style={styles.loadingOverlay}>
                <Text style={styles.loadingText}>...</Text>
              </View>
            )}
          </View>

          {/* Overlapping Avatar Container */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.avatarCameraButton}
              onPress={() => handleUpdateImage("avatar")}
            >
              <CameraIcon width={28} height={28} />
            </TouchableOpacity>
            {isLoading && imageUpdateMode === "avatar" && (
              <View style={[styles.loadingOverlay, { borderRadius: 60 }]}>
                <Text style={styles.loadingText}>...</Text>
              </View>
            )}
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user?.name || "User"}</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <EditIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>@{user?.username || "username"}</Text>
          <Text style={styles.location}>
            {user?.address ||
              user?.country ||
              user?.location?.country ||
              "No location set"}
          </Text>
        </View>

        {/* Tabs Section */}
        <View style={styles.profileContent}>
          <View style={styles.statsContainer}>
            {(["Posts", "Photos", "My Pets"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.statButton,
                  activeTab === tab && styles.activeStatButton,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.statText,
                    activeTab === tab && styles.activeStatText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content Section */}
          {activeTab === "Posts" ? (
            <>
              {/* Share Thoughts Card */}
              <ShareThoughtsCard
                avatarUrl={avatarUri}
                onPress={handleCreatePost}
                onGallery={async () => {
                  let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsMultipleSelection: true,
                    quality: 1,
                  });

                  if (!result.canceled) {
                    const selectedImages = result.assets.map(
                      (asset) => asset.uri,
                    );
                    router.push({
                      pathname: "/(tabs)/account/profile/create-post",
                      params: { initialImages: JSON.stringify(selectedImages) },
                    });
                  }
                }}
                onCamera={async () => {
                  let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ["images"],
                    quality: 1,
                  });

                  if (!result.canceled) {
                    const selectedImages = [result.assets[0].uri];
                    router.push({
                      pathname: "/(tabs)/account/profile/create-post",
                      params: { initialImages: JSON.stringify(selectedImages) },
                    });
                  }
                }}
              />

              {/* Dynamic Feed Items */}
              {isLoadingPosts ? (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{ marginTop: 20 }}
                />
              ) : (
                <>
                  {userPosts.map((post) => (
                    <FeedItem
                      key={post.id}
                      postId={post.id}
                      userAvatar={post.author.avatarUrl || avatarUri}
                      userName={post.author.name}
                      actionText={
                        post.sharedPost
                          ? "shared"
                          : post.postType === "profile_update"
                            ? "updated profile"
                            : "posted an update"
                      }
                      timeAgo={post.timeAgo}
                      contentImage={
                        post.media && post.media.length > 0
                          ? post.media[0].url
                          : undefined
                      }
                      caption={post.shareText || post.text}
                      likesCount={post.likesCount.toString()}
                      commentsCount={post.commentsCount.toString()}
                      sharesCount={post.sharesCount?.toString() || "0"}
                      isLiked={post.isLiked}
                      onLike={() => handleLikePost(post.id)}
                      isOwnPost={true}
                      isDropdownVisible={activeDropdown === post.id}
                      onToggleDropdown={() => toggleDropdown(post.id)}
                      onCloseDropdown={() => setActiveDropdown(null)}
                      onEditPost={() => handleEditPost(post.id)}
                      onDeletePost={() => handleDeletePost(post.id)}
                      onPress={() => handleViewPost(post.id)}
                      onCommentPress={() => handleCommentPress(post)}
                      sharedPost={post.sharedPost}
                      onSharedPostPress={() => {
                        if (post.sharedPost?.id) {
                          handleViewPost(post.sharedPost.id);
                        }
                      }}
                    />
                  ))}

                  {userPosts.length === 0 && (
                    <View style={{ padding: Spacing.xl, alignItems: "center" }}>
                      <Text
                        style={{
                          color: Colors.textSecondary,
                          fontStyle: "italic",
                        }}
                      >
                        No posts yet.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          ) : activeTab === "Photos" ? (
            isLoadingPhotos ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <PetPalPhotoGrid photos={userPhotos} />
            )
          ) : isLoadingPets ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            <PetPalPetList
              pets={userPetsList}
              onPetPress={(petId) =>
                router.push(`/(tabs)/home/myPets/${petId}`)
              }
            />
          )}
        </View>

        {selectedPost && (
          <CommentModal
            visible={commentModalVisible}
            onClose={() => setCommentModalVisible(false)}
            postId={selectedPost.id}
            likesCount={selectedPost.likesCount}
            sharesCount={selectedPost.sharesCount}
          />
        )}
      </ScrollView>

      <ImageSelectionModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        onGallery={() => {
          pickFromGallery();
          setImageModalVisible(false);
        }}
        onCamera={() => {
          pickFromCamera();
          setImageModalVisible(false);
        }}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: "relative",
    height: 260,
    backgroundColor: Colors.background,
  },
  coverContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
  },
  coverCameraButton: {
    position: "absolute",
    right: Spacing.md,
    bottom: -18,
    backgroundColor: "transparent",
    width: 35,
    height: 35,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    position: "absolute",
    bottom: 0,
    left: Spacing.lg,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.background,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  avatarCameraButton: {
    position: "absolute",
    right: -4,
    bottom: 0,
    backgroundColor: "transparent",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: 2,
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  username: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  profileContent: {
    paddingHorizontal: Spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginVertical: Spacing.lg,
  },
  statButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeStatButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  activeStatText: {
    fontSize: FontSizes.sm,
    color: Colors.background,
    fontWeight: FontWeights.semibold,
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.md,
  },
  inputPlaceholder: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  inputText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
