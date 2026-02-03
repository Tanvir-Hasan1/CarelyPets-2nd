import ShareIcon from "@/assets/images/icons/share.svg";
import PostOptionsDropdown from "@/components/accounts/profile/PostOptionsDropdown";
import PetPalPostDropdown from "@/components/home/petPals/PetPalPostDropdown";
import PetPalShareModal from "@/components/home/petPals/PetPalShareModal";
import LoadingModal from "@/components/ui/LoadingModal";
import { Colors } from "@/constants/colors";
import communityService from "@/services/communityService";
import { Image } from "expo-image";
import { Heart, MessageCircle, MoreVertical } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FeedItemProps {
  postId: string | number;
  userAvatar: string;
  userName: string;
  actionText: string;
  timeAgo: string;
  contentImage?: string;
  caption?: string;
  likesCount: string;
  commentsCount: string;
  sharesCount?: string;
  isDropdownVisible: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
  onEditPost: () => void;
  onDeletePost: () => void;
  onPress?: () => void;
  onCommentPress?: () => void;
  isLiked?: boolean;
  onLike?: () => void;
  isOwnPost?: boolean;
  onReport?: () => void;
  onBlock?: () => void;
  onProfilePress?: () => void;
  sharedPost?: any;
  onSharedPostPress?: () => void;
  priority?: "low" | "normal" | "high";
}

const FeedItem = ({
  postId,
  userAvatar,
  userName,
  actionText,
  timeAgo,
  contentImage,
  caption,
  likesCount,
  commentsCount,
  sharesCount,
  isDropdownVisible,
  onToggleDropdown,
  onCloseDropdown,
  onEditPost,
  onDeletePost,
  onPress,
  onCommentPress,
  isLiked,
  onLike,
  isOwnPost = false,
  onReport,
  onBlock,
  onProfilePress,
  sharedPost,
  onSharedPostPress,
  priority = "normal",
}: FeedItemProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShareNow = async (text: string) => {
    try {
      setShowShareModal(false);
      setIsSharing(true);
      const response = await communityService.sharePost(postId, text);
      if (response.success) {
        setShareSuccess(true);
        setTimeout(() => {
          setIsSharing(false);
          setShareSuccess(false);
        }, 1500);
      } else {
        setIsSharing(false);
        alert("Failed to share post");
      }
    } catch (error) {
      setIsSharing(false);
      console.error("Error sharing post:", error);
      alert("Error sharing post");
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.feedItem}
    >
      <View style={styles.feedHeader}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
          onPress={onProfilePress}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: userAvatar }}
            style={styles.feedAvatar}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            allowDownscaling={true}
          />
          <View style={styles.feedMeta}>
            <Text style={styles.feedUserText}>
              <Text style={styles.feedUserName}>{userName}</Text> {actionText}
            </Text>
            <Text style={styles.feedTime}>{timeAgo}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={onToggleDropdown}>
            <MoreVertical size={20} color="#6B7280" />
          </TouchableOpacity>
          {isOwnPost ? (
            <PostOptionsDropdown
              visible={isDropdownVisible}
              onClose={onCloseDropdown}
              onEdit={onEditPost}
              onDelete={onDeletePost}
            />
          ) : (
            <PetPalPostDropdown
              visible={isDropdownVisible}
              onClose={onCloseDropdown}
              onReport={onReport || (() => {})}
              onBlock={onBlock || (() => {})}
            />
          )}
        </View>
      </View>

      {caption ? <Text style={styles.feedCaption}>{caption}</Text> : null}

      {sharedPost && (
        <TouchableOpacity
          style={styles.sharedPostContainer}
          activeOpacity={0.8}
          onPress={() => {
            console.log(
              "Shared Post Data:",
              JSON.stringify(sharedPost, null, 2),
            );
            if (onSharedPostPress) onSharedPostPress();
          }}
        >
          <View style={styles.sharedHeader}>
            <Image
              source={{ uri: sharedPost.author?.avatarUrl }}
              style={styles.sharedAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              allowDownscaling={true}
            />
            <View>
              <Text style={styles.sharedUserName}>
                {sharedPost.author?.name}
              </Text>
              <Text style={styles.sharedTime}>{sharedPost.timeAgo}</Text>
            </View>
          </View>
          {sharedPost.text ? (
            <Text style={styles.sharedCaption}>{sharedPost.text}</Text>
          ) : null}
          {sharedPost.media && sharedPost.media.length > 0 ? (
            <Image
              source={{ uri: sharedPost.media[0].url }}
              style={styles.sharedImage}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              allowDownscaling={true}
            />
          ) : null}
        </TouchableOpacity>
      )}

      {contentImage && !sharedPost ? (
        <Image
          source={{ uri: contentImage }}
          style={styles.feedImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          priority={priority}
          allowDownscaling={true}
          recyclingKey={contentImage}
        />
      ) : null}

      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <Heart
            size={20}
            color={isLiked ? Colors.primary : "#666"}
            fill={isLiked ? Colors.primary : "transparent"}
          />
          <Text
            style={[styles.actionText, isLiked && { color: Colors.primary }]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
          <MessageCircle size={20} color="#666" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowShareModal(true)}
        >
          <ShareIcon width={20} height={20} color="#666" />
          <Text style={styles.actionText}>{sharesCount || "0"}</Text>
        </TouchableOpacity>
      </View>

      <PetPalShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShareNow}
        postId={postId}
      />

      <LoadingModal
        visible={isSharing}
        message="Sharing post..."
        success={shareSuccess}
        successMessage="Post shared successfully!"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  feedItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  feedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#E0E0E0",
  },
  feedMeta: {
    flex: 1,
  },
  feedUserText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  feedUserName: {
    fontWeight: "bold",
    color: "#111827",
  },
  feedTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  feedCaption: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
    lineHeight: 20,
  },
  feedImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#E0E0E0",
  },
  feedActions: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#4B5563",
  },
  // Shared Post Styles
  sharedPostContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  sharedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sharedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#E0E0E0",
  },
  sharedUserName: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
  },
  sharedTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  sharedCaption: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 8,
    lineHeight: 18,
  },
  sharedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
  },
});

export default FeedItem;
