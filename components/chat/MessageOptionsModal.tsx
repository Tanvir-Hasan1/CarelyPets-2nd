import { Spacing } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface MessageOptionsModalProps {
  visible: boolean;
  isMyMessage: boolean;
  onClose: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  // onReply?: () => void; // Future scope
}

export default function MessageOptionsModal({
  visible,
  isMyMessage,
  onClose,
  onCopy,
  onEdit,
  onDelete,
}: MessageOptionsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <View style={styles.actionsRow}>
              {/* Copy - For everyone */}
              <ActionItem
                icon="copy-outline"
                label="Copy"
                onPress={() => {
                  onCopy();
                  onClose();
                }}
              />

              {/* Edit - Only for my messages */}
              {isMyMessage && (
                <ActionItem
                  icon="pencil-outline"
                  label="Edit"
                  onPress={() => {
                    onEdit();
                    onClose();
                  }}
                />
              )}

              {/* Delete - Only for my messages */}
              {isMyMessage && (
                <ActionItem
                  icon="trash-outline"
                  label="Delete"
                  color="#EF4444"
                  onPress={() => {
                    onDelete();
                    onClose();
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const ActionItem = ({
  icon,
  label,
  onPress,
  color = "#4B5563",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.actionLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  actionItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
