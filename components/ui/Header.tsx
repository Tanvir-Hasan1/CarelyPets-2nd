import BasketIcon from "@/assets/images/icons/basket.svg";
import NotificationIcon from "@/assets/images/icons/notification.svg";
import SearchIcon from "@/assets/images/icons/search.svg";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
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
}

export default function Header({
  title,
  onBackPress,
  showActions = true,
  showBackButton = true,
  isHome = false,
  style,
  rightAction,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
              {isHome && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => router.push("/search")}
                >
                  <SearchIcon width={34} height={34} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/basket")}
              >
                <BasketIcon width={36} height={36} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/notifications")}
              >
                <NotificationIcon width={36} height={36} />
              </TouchableOpacity>
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
});
