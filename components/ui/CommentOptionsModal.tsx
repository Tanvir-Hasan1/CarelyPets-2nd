import { Copy, Edit2, Flag, Trash2 } from "lucide-react-native";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommentOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  isOwnComment: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
  onCopy: () => void;
}

const CommentOptionsModal = ({
  visible,
  onClose,
  isOwnComment,
  onEdit,
  onDelete,
  onReport,
  onCopy,
}: CommentOptionsModalProps) => {
  const insets = useSafeAreaInsets();

  const options = [
    ...(isOwnComment
      ? [
          {
            label: "Edit Comment",
            icon: <Edit2 size={20} color="#374151" />,
            action: onEdit,
          },
          {
            label: "Delete Comment",
            icon: <Trash2 size={20} color="#EF4444" />,
            action: onDelete,
            isDestructive: true,
          },
        ]
      : []),
    {
      label: "Report Comment",
      icon: <Flag size={20} color="#374151" />,
      action: onReport,
    },
    {
      label: "Copy Text",
      icon: <Copy size={20} color="#374151" />,
      action: onCopy,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.header}>
            <View style={styles.handle} />
            {/* Optional: Close button or title */}
          </View>

          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => {
                  onClose();
                  option.action();
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    option.isDestructive && styles.destructiveIcon,
                  ]}
                >
                  {option.icon}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    option.isDestructive && styles.destructiveText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  optionsContainer: {
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    // backgroundColor: "#F9FAFB", // Optional hover effect
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
  },
  destructiveIcon: {
    // styles for destructive icon container if needed
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  destructiveText: {
    color: "#EF4444",
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
});

export default CommentOptionsModal;
