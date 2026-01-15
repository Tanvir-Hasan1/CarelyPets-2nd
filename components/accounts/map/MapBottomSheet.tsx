import { Colors, Spacing } from "@/constants/colors";
import { CallIcon, Share01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import MapSheetContent from "./MapSheetContent";
import MapSheetHeader from "./MapSheetHeader";
import MapSheetPhotoModal from "./MapSheetPhotoModal";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MIN_HEIGHT = 180;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.9;

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface MapBottomSheetProps {
  title: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  photos?: PlacePhoto[];
  isOpen?: boolean;
  phoneNumber?: string;
  website?: string;
  onClose: () => void;
  apiKey: string;
}

export default function MapBottomSheet({
  title,
  address,
  rating,
  userRatingsTotal,
  photos,
  isOpen,
  phoneNumber,
  website,
  onClose,
  apiKey,
}: MapBottomSheetProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const translateY = useSharedValue(MAX_HEIGHT - MIN_HEIGHT);
  const context = useSharedValue(0);
  const scrollY = useSharedValue(0);

  /* ---------------- Scroll Handler ---------------- */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  /* ---------------- Pan Gesture ---------------- */
  const panGesture = Gesture.Pan()
    .activeOffsetY([-15, 15]) // require clear vertical intent
    .failOffsetX([-10, 10]) // allow horizontal scroll
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      // Prevent dragging sheet when scrolling content
      if (translateY.value === 0 && scrollY.value > 0) return;

      let nextTranslateY = context.value + event.translationY;

      nextTranslateY = Math.max(0, nextTranslateY);
      nextTranslateY = Math.min(MAX_HEIGHT - MIN_HEIGHT, nextTranslateY);

      translateY.value = nextTranslateY;
    })
    .onEnd(() => {
      const midpoint = (MAX_HEIGHT - MIN_HEIGHT) / 2;

      translateY.value =
        translateY.value < midpoint
          ? withSpring(0, { damping: 50 })
          : withSpring(MAX_HEIGHT - MIN_HEIGHT, { damping: 50 });
    });

  /* ---------------- Animated Style ---------------- */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  /* ---------------- Actions ---------------- */
  const handleCall = () => {
    if (!phoneNumber) return;
    const sanitized = phoneNumber.replace(/[^\d+]/g, "");
    Linking.openURL(`tel:${sanitized}`).catch(() =>
      Alert.alert("Error", "Could not open phone app.")
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title,
        message: `Check out ${title}\n${address || ""}\n${website || ""}`,
      });
    } catch {}
  };

  const handleWebsite = () => {
    if (!website) return;
    const url = website.startsWith("http") ? website : `https://${website}`;
    Linking.openURL(url).catch(() => {});
  };

  /* ---------------- Render ---------------- */
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <Animated.ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* Header */}
          <MapSheetHeader
            title={title}
            rating={rating}
            userRatingsTotal={userRatingsTotal}
            isOpen={isOpen}
            onShare={handleShare}
            onClose={onClose}
          />

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <HugeiconsIcon icon={CallIcon} size={20} color={Colors.primary} />
              <Text style={styles.actionLabel}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <HugeiconsIcon
                icon={Share01Icon}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <MapSheetContent
            photos={photos}
            address={address}
            phoneNumber={phoneNumber}
            website={website}
            apiKey={apiKey}
            onPhotoPress={setSelectedPhoto}
            onCall={handleCall}
            onWebsite={handleWebsite}
          />
        </Animated.ScrollView>

        <MapSheetPhotoModal
          visible={!!selectedPhoto}
          photoUrl={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      </Animated.View>
    </GestureDetector>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: MAX_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 20,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
  },
  scrollView: { flex: 1 },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
  actionLabel: {
    marginLeft: 8,
    fontWeight: "600",
    color: Colors.primary,
  },
});
