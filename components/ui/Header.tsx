import BasketIcon from "@/assets/images/icons/basket.svg";
import NotificationIcon from "@/assets/images/icons/notification.svg";
import SearchIcon from "@/assets/images/icons/search.svg";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import { useChatStore } from "@/store/useChatStore";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ClawHeader from "./ClawHeader";

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  showActions?: boolean;
  showBackButton?: boolean;
  isHome?: boolean;
  style?: ViewStyle;
  rightAction?: React.ReactNode;
  showSearch?: boolean;
  showBasket?: boolean;
  showNotifications?: boolean;
  onSearchPress?: () => void;
}

export default function Header({
  title,
  onBackPress,
  showActions = true,
  showBackButton = true,
  isHome = false,
  style,
  rightAction,
  showSearch = false,
  showBasket = true,
  showNotifications = true,
  onSearchPress,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Subscribe to conversations array to get reactive unread count updates
  const conversations = useChatStore((state) => state.conversations);
  const unreadCount = conversations.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0,
  );

  const handleNotificationPress = () => {
    router.push("/notifications");
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }, style]}>
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          {isHome ? (
            <ClawHeader size={32} />
          ) : (
            showBackButton && (
              <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={24}
                  color={Colors.text}
                />
              </TouchableOpacity>
            )
          )}
        </View>

        {!isHome && (
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>
        )}

        <View style={styles.rightContainer}>
          {rightAction ? (
            rightAction
          ) : showActions ? (
            <View style={styles.headerActions}>
              {(isHome || showSearch) && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onSearchPress || (() => router.push("/search"))}
                >
                  <SearchIcon width={36} height={36} />
                </TouchableOpacity>
              )}
              {showBasket && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => router.push("/basket")}
                >
                  <BasketIcon width={36} height={36} />
                </TouchableOpacity>
              )}
              {showNotifications && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleNotificationPress}
                >
                  <View style={styles.notificationContainer}>
                    <NotificationIcon width={36} height={36} />
                    {unreadCount > 0 && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    height: 56,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 20,
    minWidth: 44,
  },
  rightContainer: {
    zIndex: 20,
    alignItems: "center",
    minWidth: 44,
  },
  titleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#006064",
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#E53935",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
