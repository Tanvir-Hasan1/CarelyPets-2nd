import { Spacing } from "@/constants/colors";
import { ArrowLeft02Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  onBackPress: () => void;
  onMenuPress: () => void;
  paddingTop: number;
}

export default function ChatHeader({
  name,
  avatar,
  onBackPress,
  onMenuPress,
  paddingTop,
}: ChatHeaderProps) {
  return (
    <View style={[styles.header, { paddingTop }]}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="#4B5563" />
      </TouchableOpacity>

      <View style={styles.headerInfo}>
        <Image
          source={{
            uri: avatar || "https://i.pravatar.cc/150",
          }}
          style={styles.headerAvatar}
        />
        <View>
          <Text style={styles.headerName}>{name || "User"}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <HugeiconsIcon icon={MoreVerticalIcon} size={24} color="#006064" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  headerStatus: {
    fontSize: 12,
    color: "#6B7280",
  },
  menuButton: {
    padding: Spacing.xs,
  },
});
