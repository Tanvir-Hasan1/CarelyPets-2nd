import { Octicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatMenuProps {
  visible: boolean;
  isBlocked?: boolean;
  onClose: () => void;
  onBlock: () => void;
  onUnblock?: () => void;
}

const ChatMenu = ({
  visible,
  isBlocked,
  onClose,
  onBlock,
  onUnblock,
}: ChatMenuProps) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      {isBlocked ? (
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onUnblock?.();
            onClose();
          }}
        >
          <Octicons name="check" size={20} color="#1DAFB6" />
          <Text style={[styles.optionText, { color: "#1DAFB6" }]}>Unblock</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onBlock();
            onClose();
          }}
        >
          <Octicons name="stop" size={20} color="#E53935" />
          <Text style={styles.optionText}>Block</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 45,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    zIndex: 1000,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    padding: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "500",
  },
});

export default ChatMenu;
