import FeedItem from "@/components/accounts/profile/FeedItem";
import ShareThoughtsCard from "@/components/pethub/ShareThoughtsCard";
import CommentModal from "@/components/ui/CommentModal";
import Header from "@/components/ui/Header";
import { Spacing } from "@/constants/colors";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const MOCK_POSTS = [
  {
    id: 1,
    userAvatar: 'https://i.pravatar.cc/150?u=johnwick',
    userName: 'John Wick',
    actionText: '',
    timeAgo: 'Just now',
    contentImage: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?auto=format&fit=crop&q=80&w=800',
    likesCount: '1.2 K',
    commentsCount: '1.2 K',
    sharesCount: '33',
  },
  {
    id: 2,
    userAvatar: 'https://i.pravatar.cc/150?u=devon',
    userName: 'Devon Lane',
    actionText: '',
    timeAgo: 'Yesterday',
    contentImage: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
    likesCount: '800',
    commentsCount: '150',
    sharesCount: '12',
  }
];

export default function PetHubScreen() {
  const router = useRouter();
  const [dropdownPostId, setDropdownPostId] = useState<number | null>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

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
      const selectedImages = result.assets.map(asset => asset.uri);
      router.push({
        pathname: "/(tabs)/pethub/create-post",
        params: { initialImages: JSON.stringify(selectedImages) }
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
        params: { initialImages: JSON.stringify(selectedImages) }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="PetHub" showBackButton={false} />

      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <ShareThoughtsCard
            onPress={() => router.push("/(tabs)/pethub/create-post")}
            onGallery={handleGallery}
            onCamera={handleCamera}
          />
        }
        renderItem={({ item }) => (
          <FeedItem
            postId={item.id}
            userAvatar={item.userAvatar}
            userName={item.userName}
            actionText={item.actionText}
            timeAgo={item.timeAgo}
            contentImage={item.contentImage}
            likesCount={item.likesCount}
            commentsCount={item.commentsCount}
            sharesCount={item.sharesCount}
            isDropdownVisible={dropdownPostId === item.id}
            onToggleDropdown={() => setDropdownPostId(dropdownPostId === item.id ? null : item.id)}
            onCloseDropdown={() => setDropdownPostId(null)}
            onEditPost={() => { }}
            onDeletePost={() => { }}
            onPress={() => router.push("/(tabs)/pethub/view-post")}
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
});
