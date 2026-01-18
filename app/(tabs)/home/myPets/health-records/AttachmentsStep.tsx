import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/colors";
import {
  Cancel01Icon,
  Download04Icon,
  File02Icon,
  Image02Icon,
  Upload02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AttachmentsStepProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

export default function AttachmentsStep({
  data,
  updateData,
}: AttachmentsStepProps) {
  const files = data.attachments || [];

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map((asset: any) => ({
          uri: asset.uri,
          name: asset.name,
          size: formatSize(asset.size),
          mimeType: asset.mimeType,
          type: getFileType(asset.mimeType, asset.name),
        }));
        updateData("attachments", [...files, ...newFiles]);
      }
    } catch (err) {
      console.log("Error picking document:", err);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_: any, i: number) => i !== index);
    updateData("attachments", updatedFiles);
  };

  const handleDownload = async (file: any) => {
    const uri = typeof file === "string" ? file : file.uri;
    if (!uri) return;

    try {
      // For now, use Linking to open the file in browser/apps
      // as it's the safest way without extra dependencies (System/Sharing).
      // This effectively "downloads" or allows saving on Android.
      const supported = await Linking.canOpenURL(uri);
      if (supported) {
        await Linking.openURL(uri);
      } else {
        Alert.alert("Error", "Cannot open this attachment URL");
      }
    } catch (error) {
      console.error("Error opening attachment:", error);
      Alert.alert("Error", "Failed to open attachment");
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileType = (mime?: string, name?: string) => {
    const str = (mime || name || "").toLowerCase();
    if (str.includes("image") || str.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      return "IMAGE";
    if (str.includes("pdf") || str.match(/\.pdf$/i)) return "PDF";
    return "DOC";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return { icon: Image02Icon, color: "#7C4DFF", bgColor: "#EDE7F6" };
      case "PDF":
        return { icon: File02Icon, color: "#FF5252", bgColor: "#FFEBEE" };
      default:
        return { icon: File02Icon, color: "#448AFF", bgColor: "#E3F2FD" };
    }
  };

  const getFileInfo = (file: any) => {
    if (typeof file === "string") {
      const fileName = file.split("/").pop()?.split("?")[0] || "Attachment";
      const type = getFileType(undefined, fileName);
      return {
        uri: file,
        name: fileName,
        type,
        size: "Cloud",
      };
    }
    return file;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Attachments</Text>
          <Text style={styles.subtitle}>
            (You can upload documents & images)
          </Text>
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <HugeiconsIcon icon={Upload02Icon} size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.fileList}>
        {files.map((item: any, index: number) => {
          const file = getFileInfo(item);
          const styleInfo = getFileIcon(file.type);
          return (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: styleInfo.bgColor },
                  ]}
                >
                  {file.type === "IMAGE" && file.uri ? (
                    <Image
                      source={{ uri: file.uri }}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={styleInfo.icon}
                      size={20}
                      color={styleInfo.color}
                    />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileInfo}>
                    {file.type} ● {file.size}
                  </Text>
                </View>
              </View>

              <View style={styles.fileActions}>
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={() => handleDownload(item)}
                >
                  <HugeiconsIcon
                    icon={Download04Icon}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={() => handleRemoveFile(index)}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // marginBottom: Spacing.md,
  },
  uploadButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B2EBF2", // Light cyan
    borderRadius: 20,
  },
  fileList: {
    gap: Spacing.sm,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  fileLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: FontSizes.sm,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  fileInfo: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  fileActions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionIcon: {
    padding: 4,
  },
});
