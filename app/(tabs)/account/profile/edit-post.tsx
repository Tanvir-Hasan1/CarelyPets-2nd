import PetPalImageModal from "@/components/home/petPals/PetPalImageModal";
import Header from "@/components/ui/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import communityService from "@/services/communityService";
import { useAuthStore } from "@/store/useAuthStore";
// @ts-ignore
import * as FileSystem from "expo-file-system/legacy";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, Eye, Image as ImageIcon, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FileAttachment {
  id: string;
  uri: string;
  name: string;
  type: string;
  isRemote: boolean;
}

export default function EditPostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();

  const [postText, setPostText] = useState("");
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [initialFiles, setInitialFiles] = useState<FileAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<FileAttachment | null>(null);

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
        setPostText(response.data.text);
        if (response.data.media) {
          const initialFiles = response.data.media.map((m, index) => ({
            id: `remote-${index}`,
            uri: m.url,
            name: `Image ${index + 1}`,
            type: "image/jpeg",
            isRemote: true,
          }));
          setFiles(initialFiles);
          setInitialFiles(initialFiles);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch post details");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newFiles = result.assets.map((asset) => ({
        id: `local-${Date.now()}-${Math.random()}`,
        uri: asset.uri,
        name: asset.fileName || "New Image",
        type: asset.mimeType || "image/jpeg",
        isRemote: false,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const newFile = {
        id: `local-${Date.now()}`,
        uri: asset.uri,
        name: asset.fileName || "Captured Image",
        type: asset.mimeType || "image/jpeg",
        isRemote: false,
      };
      setFiles((prev) => [...prev, newFile]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdate = async () => {
    if (!postText.trim()) {
      Alert.alert("Error", "Post text cannot be empty");
      return;
    }

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append("text", postText);

      // Check if images are altered
      const isImagesAltered =
        files.length !== initialFiles.length ||
        files.some((file, index) => file.uri !== initialFiles[index]?.uri);

      if (isImagesAltered) {
        // Process images only if altered
        for (const file of files) {
          if (file.isRemote) {
            // Download remote image to temporary local file
            try {
              const fileName =
                file.uri.split("/").pop() || `temp_${Date.now()}.jpg`;
              const fileType = file.type || "image/jpeg";
              const tempUri = FileSystem.cacheDirectory + fileName;

              const downloadResult = await FileSystem.downloadAsync(
                file.uri,
                tempUri,
              );

              // Append as file using the local URI
              // @ts-ignore
              formData.append("files", {
                uri: downloadResult.uri,
                name: fileName,
                type: fileType,
              });
            } catch (dlError) {
              console.error("Failed to download remote image:", dlError);
              throw new Error("Failed to process existing images");
            }
          } else {
            // Local file
            // @ts-ignore
            formData.append("files", {
              uri: file.uri,
              name: file.name,
              type: file.type,
            });
          }
        }
      }

      const response = await communityService.updatePost(
        id as string,
        formData,
      );

      if (response.success) {
        Alert.alert("Success", "Post updated successfully");
        router.back();
      } else {
        Alert.alert("Error", response.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update post");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Edit Post" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Post" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri:
                    user?.avatarUrl ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View>
                <Text style={styles.userName}>{user?.name || "User"}</Text>
                <Text style={styles.userHandle}>
                  @{user?.username || "username"}
                </Text>
              </View>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Say something..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={postText}
              onChangeText={setPostText}
            />

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
                <ImageIcon size={24} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
                <Camera size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filesContainer}>
            {files.map((file) => (
              <View key={file.id} style={styles.fileCard}>
                <Image
                  source={{ uri: file.uri }}
                  style={styles.thumbnail}
                  contentFit="cover"
                />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileMeta}>
                    {file.isRemote ? "Existing Image" : "New Image"}
                  </Text>
                </View>
                <View style={styles.fileActions}>
                  <TouchableOpacity
                    style={styles.fileActionBtn}
                    onPress={() => setPreviewImage(file)}
                  >
                    <Eye size={20} color="#4B5563" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.fileActionBtn}
                    onPress={() => removeFile(file.id)}
                  >
                    <X size={20} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.updateButtonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {previewImage && (
        <PetPalImageModal
          visible={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUri={previewImage.uri}
          userName={user?.name || ""}
          dateText=""
          caption=""
          likesCount="0"
          commentsCount="0"
          sharesCount="0"
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    minHeight: 200,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.lightGray,
  },
  userName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  userHandle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  textInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    flex: 1,
    fontSize: FontSizes.md,
    color: "#374151",
    minHeight: 120,
    textAlignVertical: "top",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  iconButton: {
    padding: 4,
  },
  filesContainer: {
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  fileCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: BorderRadius.md,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#E5E7EB",
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  fileMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  fileActions: {
    flexDirection: "row",
    gap: 8,
  },
  fileActionBtn: {
    padding: 6,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#F9FAFB",
  },
  updateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.background,
  },
});
