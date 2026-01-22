import { Spacing } from "@/constants/colors";
import {
  AttachmentIcon,
  Cancel01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatInputProps {
  messageText: string;
  selectedImages: string[];
  isSending: boolean;
  onMessageChange: (text: string) => void;
  onAttachmentPress: () => void;
  onSendPress: () => void;
  onRemoveImage: (index: number) => void;
  paddingBottom: number;
}

export default function ChatInput({
  messageText,
  selectedImages,
  isSending,
  onMessageChange,
  onAttachmentPress,
  onSendPress,
  onRemoveImage,
  paddingBottom,
}: ChatInputProps) {
  return (
    <View style={[styles.inputContainer, { paddingBottom }]}>
      {selectedImages.length > 0 && (
        <ScrollView
          horizontal
          style={styles.imagePreviewContainer}
          showsHorizontalScrollIndicator={false}
        >
          {selectedImages.map((uri, index) => (
            <View key={index} style={styles.previewImageWrapper}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => onRemoveImage(index)}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Message"
            style={styles.input}
            placeholderTextColor="#000000"
            value={messageText}
            onChangeText={onMessageChange}
            multiline
          />
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={onAttachmentPress}
          >
            <HugeiconsIcon icon={AttachmentIcon} size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={onSendPress}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <HugeiconsIcon icon={SentIcon} size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 10,
    maxHeight: 100,
  },
  attachmentButton: {
    marginLeft: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1DAFB6",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  previewImageWrapper: {
    marginRight: Spacing.sm,
    position: "relative",
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#000000",
    borderRadius: 10,
    padding: 2,
    opacity: 0.7,
  },
});
