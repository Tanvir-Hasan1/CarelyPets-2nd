import { Colors, FontSizes, Spacing } from "@/constants/colors";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface LoadingModalProps {
  visible: boolean;
  message: string;
  success?: boolean;
  successMessage?: string;
}

export default function LoadingModal({
  visible,
  message,
  success,
  successMessage,
}: LoadingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {success ? (
            <View style={styles.successContainer}>
              <View style={styles.iconCircle}>
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={32}
                  color={Colors.primary}
                  variant="solid"
                />
              </View>
              <Text style={styles.text}>{successMessage || "Success!"}</Text>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BCD4" />
              <Text style={styles.text}>{message}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#FFFFFF",
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: "center",
    gap: Spacing.md,
  },
  successContainer: {
    alignItems: "center",
    gap: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  text: {
    fontSize: FontSizes.md,
    color: "#4B5563",
    fontWeight: "600",
    textAlign: "center",
  },
});
