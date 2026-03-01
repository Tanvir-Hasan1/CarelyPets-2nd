import CameraIcon from "@/assets/images/icons/camera-2.svg";
import GalleryIcon from "@/assets/images/icons/gallery.svg";
import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import { Colors, Spacing } from "@/constants/colors";
import communityService from "@/services/communityService";
import { useAuthStore } from "@/store/useAuthStore";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Play, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
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
  const [mediaItems, setMediaItems] = useState<
    { uri: string; type: "image" | "video" }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  // Ref that holds the abort function for the active XHR upload
  const abortRef = useRef<(() => void) | null>(null);

  const handleCancel = () => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }
    setIsLoading(false);
    setUploadProgress(0);
    setShowError(false);
  };

  useEffect(() => {
    if (params.initialMedia) {
      try {
        const initial = JSON.parse(params.initialMedia as string);
        if (Array.isArray(initial)) {
          setMediaItems(initial);
        }
      } catch (e) {
        console.error("Error parsing initialMedia", e);
      }
    } else if (params.initialImages) {
      // Legacy support for initialImages
      try {
        const initial = JSON.parse(params.initialImages as string);
        if (Array.isArray(initial)) {
          setMediaItems(initial.map((uri: string) => ({ uri, type: "image" })));
        }
      } catch (e) {
        console.error("Error parsing initialImages", e);
      }
    }
  }, [params.initialMedia, params.initialImages]);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      quality: 0.7,
      videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
    });

    if (!result.canceled) {
      const selectedItems = result.assets.map((asset) => {
        // Warn if file is > 20MB
        if (asset.fileSize && asset.fileSize > 20 * 1024 * 1024) {
          console.warn(
            `File ${asset.fileName} is large (${(asset.fileSize / (1024 * 1024)).toFixed(1)}MB). It might fail to upload.`,
          );
        }
        return {
          uri: asset.uri,
          type:
            asset.type === "video" ? ("video" as const) : ("image" as const),
          fileSize: asset.fileSize,
        };
      });
      setMediaItems([...mediaItems, ...selectedItems]);
    }
  };

  const takeMedia = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.7,
      videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
    });

    if (!result.canceled) {
      setMediaItems([
        ...mediaItems,
        {
          uri: result.assets[0].uri,
          type: result.assets[0].type === "video" ? "video" : "image",
        },
      ]);
    }
  };

  const removeMedia = (uri: string) => {
    setMediaItems(mediaItems.filter((item) => item.uri !== uri));
  };

  const handlePost = async () => {
    if (!postText.trim() && mediaItems.length === 0) return;

    setIsLoading(true);
    setUploadProgress(0);
    setShowError(false);

    // Pre-flight network check using XMLHttpRequest (more reliable than fetch on Android)
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // Use the same base URL from .env (via api internals) — just hit the /health route
        xhr.open("GET", `${process.env.EXPO_PUBLIC_API_URL}/health`);
        xhr.timeout = 5000;
        xhr.onload = () => resolve();
        xhr.onerror = () => reject(new Error("Network unavailable"));
        xhr.ontimeout = () => reject(new Error("Server unreachable (timeout)"));
        xhr.send();
      });
    } catch (err: any) {
      setIsLoading(false);
      setErrorDetails(
        "No internet connection or server unreachable. Please check your network and try again.",
      );
      setShowError(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", postText);

      // Append media
      mediaItems.forEach((item, index) => {
        const { uri, type } = item;
        const filename =
          uri.split("/").pop() ||
          `post_media_${index}.${type === "video" ? "mp4" : "jpg"}`;
        const match = /\.(\w+)$/.exec(filename);
        const extension = match
          ? match[1].toLowerCase()
          : type === "video"
            ? "mp4"
            : "jpg";

        let mimeType = "image/jpeg";
        if (type === "video") {
          mimeType = `video/${extension === "mov" ? "quicktime" : extension}`;
        } else {
          mimeType = `image/${extension === "png" ? "png" : "jpeg"}`;
        }

        formData.append("files", {
          uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
          name: filename,
          type: mimeType,
        } as any);
      });

      const result = await communityService.createPost(
        formData,
        (progress) => setUploadProgress(progress),
        abortRef,
      );
      if (result.success) {
        console.log("Post creation success:", JSON.stringify(result, null, 2));
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setUploadProgress(0);
          router.back();
        }, 2000);
      } else {
        setErrorDetails("Failed to create post. Please try again.");
        setShowError(true);
      }
    } catch (error: any) {
      if (error?.message === "UPLOAD_CANCELLED") {
        // User cancelled — reset silently, no error shown
        setIsLoading(false);
        setUploadProgress(0);
        return;
      }
      console.error("Error creating post:", error);
      setUploadProgress(0);
      setErrorDetails(
        error?.message || "An error occurred while creating the post.",
      );
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Post" />
      <LoadingModal
        visible={isLoading || showSuccess || showError}
        message={
          uploadProgress === 100
            ? "Processing post... Please wait"
            : uploadProgress > 0
              ? `Uploading... ${uploadProgress}%`
              : "Creating post..."
        }
        success={showSuccess}
        successMessage="Post created successfully!"
        progress={uploadProgress}
        failed={showError}
        error={errorDetails || ""}
        onClose={() => setShowError(false)}
        onCancel={
          isLoading && !showSuccess && !showError ? handleCancel : undefined
        }
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

            {/* Media Preview Grid */}
            <View style={styles.imageGrid}>
              {mediaItems.map((item, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.previewImage}
                  />
                  {item.type === "video" && (
                    <View style={styles.videoIndicator}>
                      <Play size={12} fill="#FFFFFF" color="#FFFFFF" />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMedia(item.uri)}
                  >
                    <X size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={pickMedia} style={styles.actionBtn}>
                <GalleryIcon width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={takeMedia} style={styles.actionBtn}>
                <CameraIcon width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.postButton,
              !postText && mediaItems.length === 0 && styles.postButtonDisabled,
            ]}
            onPress={handlePost}
            disabled={!postText && mediaItems.length === 0}
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
  videoIndicator: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    padding: 2,
    zIndex: 1,
  },
});

export default CreatePostView;
