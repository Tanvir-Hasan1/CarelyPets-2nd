import PetPalBlockModal from "@/components/home/petPals/PetPalBlockModal";
import PetPalInfo from "@/components/home/petPals/PetPalInfo";
import PetPalPetList from "@/components/home/petPals/PetPalPetList";
import PetPalPhotoGrid from "@/components/home/petPals/PetPalPhotoGrid";
import PetPalProfileHeader from "@/components/home/petPals/PetPalProfileHeader";
import PetPalReportModal from "@/components/home/petPals/PetPalReportModal";
import PetPalTabSwitcher, {
  PetPalTab,
} from "@/components/home/petPals/PetPalTabSwitcher";
import PetPalWriteReportModal from "@/components/home/petPals/PetPalWriteReportModal";
import CommentModal from "@/components/ui/CommentModal";
import FeedItem from "@/components/ui/FeedItem";
import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import { Colors } from "@/constants/colors";
import communityService from "@/services/communityService";
import userService, { UserProfile } from "@/services/userService";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PetPalProfileScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PetPalTab>("Posts");
  const [activeDropdownId, setActiveDropdownId] = useState<
    number | string | null
  >(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [showWriteReportModal, setShowWriteReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | number | null>(
    null,
  );

  const [palData, setPalData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // New state for posts and photos
  const [posts, setPosts] = useState<any[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isPhotosLoading, setIsPhotosLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (id) {
      fetchUserProfile();
      fetchPosts();
      fetchPhotos();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getUserProfile(id);
      if (response.success) {
        setPalData(response.data);
      }
    } catch (error) {
      console.error("Error fetching pet pal profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsPostsLoading(true);
      const response = await communityService.getUserPosts(id);
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setIsPostsLoading(false);
    }
  };

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const fetchPhotos = async () => {
    try {
      setIsPhotosLoading(true);
      const response = await communityService.getUserPhotos(id);
      if (response.success) {
        setPhotos(response.data);
      }
    } catch (error) {
      console.error("Error fetching user photos:", error);
    } finally {
      setIsPhotosLoading(false);
    }
  };

  const handleLikePost = async (postId: string | number) => {
    // Optimistic update
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newIsLiked = !post.isLikedByMe;
          return {
            ...post,
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
        // Update with actual data if needed, but optimistic usually enough for UI
      } else {
        // Revert on failure
        fetchPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
      fetchPosts();
    }
  };

  const handleCommentPress = (post: any) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
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
      // console.log("Report response data:", response.data);

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

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!palData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>User not found</Text>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Posts":
        if (isPostsLoading && posts.length === 0) {
          return <ActivityIndicator color={Colors.primary} />;
        }
        if (posts.length === 0) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: Colors.textSecondary }}>No posts yet</Text>
            </View>
          );
        }
        return (
          <View>
            {posts.map((post) => (
              <FeedItem
                key={post.id}
                postId={post.id}
                userAvatar={post.author.avatarUrl || ""}
                userName={post.author.name}
                actionText={
                  post.postType === "shared"
                    ? "shared a post"
                    : "posted an update"
                }
                timeAgo={post.timeAgo}
                caption={post.text}
                contentImage={
                  post.media && post.media.length > 0
                    ? post.media[0].url
                    : undefined
                }
                likesCount={post.likesCount.toString()}
                commentsCount={post.commentsCount.toString()}
                sharesCount={post.sharesCount.toString()}
                isLiked={post.isLikedByMe}
                isDropdownVisible={activeDropdownId === post.id}
                onToggleDropdown={() =>
                  setActiveDropdownId(
                    activeDropdownId === post.id ? null : post.id,
                  )
                }
                onCloseDropdown={() => setActiveDropdownId(null)}
                // Implement handlers as needed, or leave empty/log for now as they are not primary task
                onEditPost={() => {}}
                onDeletePost={() => {}}
                onReport={() => {
                  setSelectedPostId(post.id);
                  setShowReportModal(true);
                }}
                onBlock={() => setShowBlockModal(true)}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/home/petPals/view-post",
                    params: { id: post.id },
                  })
                }
                onLike={() => handleLikePost(post.id)}
                onCommentPress={() => handleCommentPress(post)}
              />
            ))}
          </View>
        );
      case "Photos":
        if (isPhotosLoading && photos.length === 0) {
          return <ActivityIndicator color={Colors.primary} />;
        }
        // Map simple URL strings to PhotoData expected by grid
        const photoData = photos.map((url) => ({
          uri: url,
          userName: palData.name,
          dateText: "", // Date not available in simple list
          caption: "", // Caption not available
          likesCount: "",
          commentsCount: "",
          sharesCount: "",
        }));
        return <PetPalPhotoGrid photos={photoData} />;
      case "My Pets":
        return (
          <PetPalPetList
            pets={palData.pets || []} // Use real pets from API
            onPetPress={(petId) => {
              const pet = palData.pets.find((p) => p.id === petId);
              if (pet) {
                router.push({
                  pathname: "/(tabs)/home/petPals/view-pet",
                  params: { petData: JSON.stringify(pet) },
                });
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Pet Pals" showActions />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PetPalProfileHeader
          coverUri={palData.coverUrl || undefined}
          avatarUri={palData.avatarUrl || undefined}
        />

        <PetPalInfo
          name={palData.name}
          location={
            palData.location
              ? `${palData.location.city}, ${palData.location.country}`
              : "Unknown Location"
          }
          onMessagePress={() => {
            if (palData) {
              router.push({
                pathname: "/(tabs)/chat/[id]",
                params: {
                  id: palData.id,
                  type: "user",
                  name: palData.name,
                  avatar: palData.avatarUrl || "",
                },
              });
            }
          }}
        />

        <PetPalTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={styles.tabContent}>{renderContent()}</View>

        {/* Bottom spacing for balance */}
        <View style={{ height: 70 }} />
      </ScrollView>

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

      {selectedPost && (
        <CommentModal
          visible={commentModalVisible}
          onClose={() => setCommentModalVisible(false)}
          postId={selectedPost.id}
          likesCount={selectedPost.likesCount}
          sharesCount={selectedPost.sharesCount}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default PetPalProfileScreen;
