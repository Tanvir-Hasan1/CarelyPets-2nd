import { Colors, Spacing } from "@/constants/colors";
import {
  CallIcon,
  Cancel01Icon,
  Location01Icon,
  Share01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Dimensions,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
  const [activeTab, setActiveTab] = useState("Overview");
  const translateY = useSharedValue(MAX_HEIGHT - MIN_HEIGHT);
  const context = useSharedValue(0);

  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value;
      translateY.value = Math.max(translateY.value, 0);
      translateY.value = Math.min(translateY.value, MAX_HEIGHT - MIN_HEIGHT);
    })
    .onEnd(() => {
      if (translateY.value < (MAX_HEIGHT - MIN_HEIGHT) / 2) {
        translateY.value = withSpring(0, { damping: 50 });
      } else {
        translateY.value = withSpring(MAX_HEIGHT - MIN_HEIGHT, { damping: 50 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleCall = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${title} at ${address}\n\n${website || ""}`,
        title: title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleWebsite = () => {
    if (website) {
      Linking.openURL(website);
    }
  };

  const renderPhoto = ({ item }: { item: PlacePhoto }) => (
    <Image
      source={{
        uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${apiKey}`,
      }}
      style={styles.galleryImage}
      contentFit="cover"
    />
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          stickyHeaderIndices={[2]} // Sticky Tabs
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
                <Text style={styles.categoryText}>
                  Animal Service • Pet Care
                </Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconCircle}>
                  <HugeiconsIcon
                    icon={Share01Icon}
                    size={20}
                    color={Colors.text}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconCircle} onPress={onClose}>
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={20}
                    color={Colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>
                {rating?.toFixed(1) || "N/A"}
              </Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <HugeiconsIcon
                    key={star}
                    icon={StarIcon}
                    size={14}
                    color={star <= (rating || 0) ? "#FFB800" : "#E5E7EB"}
                    variant="solid"
                  />
                ))}
              </View>
              <Text style={styles.reviewCount}>({userRatingsTotal || 0})</Text>
            </View>

            <Text
              style={[
                styles.statusText,
                { color: isOpen ? "#10B981" : "#EF4444" },
              ]}
            >
              {isOpen ? "Open" : "Closed"} •{" "}
              {isOpen ? "Closes 6 PM" : "Opens 9 AM"}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <View style={styles.btnRow}>
                <HugeiconsIcon
                  icon={CallIcon}
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.actionLabel}>Call</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <View style={styles.btnRow}>
                <HugeiconsIcon
                  icon={Share01Icon}
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.actionLabel}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {["Overview", "Reviews", "Photos"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab && styles.activeTabLabel,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content Based on Tab */}
          <View style={styles.content}>
            {activeTab === "Overview" && (
              <>
                {photos && photos.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.photoGallery}
                  >
                    {photos.map((item) => (
                      <Image
                        key={item.photo_reference}
                        source={{
                          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${apiKey}`,
                        }}
                        style={styles.galleryImage}
                        contentFit="cover"
                      />
                    ))}
                  </ScrollView>
                )}

                <View style={styles.detailItem}>
                  <View style={styles.iconSquare}>
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={20}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.detailText}>{address}</Text>
                </View>

                {phoneNumber && (
                  <View style={styles.detailItem}>
                    <View style={styles.iconSquare}>
                      <HugeiconsIcon
                        icon={CallIcon}
                        size={20}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={styles.detailText}>{phoneNumber}</Text>
                  </View>
                )}

                {website && (
                  <TouchableOpacity
                    style={styles.detailItem}
                    onPress={handleWebsite}
                  >
                    <View style={styles.iconSquare}>
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={20}
                        color={Colors.primary}
                      />
                    </View>
                    <Text
                      style={[styles.detailText, { color: Colors.primary }]}
                    >
                      {website}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {activeTab === "Reviews" && (
              <View style={styles.reviewsPlaceholder}>
                <Text style={styles.placeholderText}>
                  Reviews section coming soon...
                </Text>
              </View>
            )}

            {activeTab === "Photos" && (
              <View style={styles.photosTabContent}>
                {photos && photos.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {photos.map((item) => (
                      <Image
                        key={item.photo_reference}
                        source={{
                          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${item.photo_reference}&key=${apiKey}`,
                        }}
                        style={styles.fullGalleryImage}
                        contentFit="cover"
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.placeholderText}>
                    No photos available
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: MAX_HEIGHT,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 1000,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerActions: {
    flexDirection: "row",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
  stars: {
    flexDirection: "row",
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
  },
  categoryText: {
    fontSize: 16,
    color: "#666",
    marginTop: 2,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  actionButton: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: Spacing.sm,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: "#fff",
  },
  tab: {
    paddingVertical: Spacing.md,
    marginRight: Spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  activeTabLabel: {
    color: Colors.primary,
  },
  content: {
    padding: Spacing.lg,
  },
  photoGallery: {
    marginBottom: Spacing.lg,
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: Spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconSquare: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  detailText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    flex: 1,
  },
  reviewsPlaceholder: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  photosTabContent: {
    marginTop: Spacing.sm,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  fullGalleryImage: {
    width: 300,
    height: 400,
    borderRadius: 16,
    marginRight: Spacing.md,
  },
});
