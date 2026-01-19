import CameraIcon from "@/assets/images/icons/camera-2.svg";
import GalleryIcon from "@/assets/images/icons/gallery.svg";
import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import { Colors, Spacing } from "@/constants/colors";
import communityService from "@/services/communityService";
import { useAuthStore } from "@/store/useAuthStore";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CreatePostViewProps {
  initialImages?: string[];
}

const CreatePostView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (params.initialImages) {
      try {
        const initial = JSON.parse(params.initialImages as string);
        if (Array.isArray(initial)) {
          setImages(initial);
        }
      } catch (e) {
        console.error("Error parsing initialImages", e);
      }
    }
  }, [params.initialImages]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (uri: string) => {
    setImages(images.filter((img) => img !== uri));
  };

  const handlePost = async () => {
    if (!postText.trim() && images.length === 0) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("text", postText);

      // Append images
      images.forEach((uri, index) => {
        const filename = uri.split("/").pop() || `post_image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("files", {
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
          name: filename,
          type,
        } as any);
      });

      const result = await communityService.createPost(formData);
      if (result.success) {
        console.log("Post creation success:", JSON.stringify(result, null, 2));
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.back();
        }, 2000);
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Post" />
      <LoadingModal
        visible={isLoading || showSuccess}
        message="Creating post..."
        success={showSuccess}
        successMessage="Post created successfully!"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentCard}>
            {/* User Profile */}
            <View style={styles.userSection}>
              <Image
                source={
                  user?.avatarUrl
                    ? { uri: user.avatarUrl }
                    : require("@/assets/images/logos/placeholder.png")
                }
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>{user?.name || "User"}</Text>
                <Text style={styles.userHandle}>
                  @{user?.username || "username"}
                </Text>
              </View>
            </View>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Say something"
                placeholderTextColor="#9CA3AF"
                multiline
                value={postText}
                onChangeText={setPostText}
                textAlignVertical="top"
              />
            </View>

            {/* Image Preview Grid */}
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(uri)}
                  >
                    <X size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
                <GalleryIcon width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto} style={styles.actionBtn}>
                <CameraIcon width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.postButton,
              !postText && images.length === 0 && styles.postButtonDisabled,
            ]}
            onPress={handlePost}
            disabled={!postText && images.length === 0}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: Spacing.xl,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  userHandle: {
    fontSize: 12,
    color: "#6B7280",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 150,
  },
  input: {
    fontSize: 16,
    color: "#111827",
    minHeight: 100,
    paddingBottom: 40,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 12,
  },
  imageWrapper: {
    width: "31%",
    aspectRatio: 1,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 10,
    padding: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
  },
  actionBtn: {
    padding: 4,
  },
  postButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreatePostView;
