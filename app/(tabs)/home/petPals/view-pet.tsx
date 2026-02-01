import FemaleIcon from "@/assets/images/icons/female.svg";
import MaleIcon from "@/assets/images/icons/male.svg";
import Header from "@/components/ui/Header";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import { Calendar03Icon, WeightScale01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function PetPalViewPetScreen() {
  const params = useLocalSearchParams();
  const petDataVal = typeof params.petData === "string" ? params.petData : "{}";
  const pet = JSON.parse(petDataVal);

  const [activeSlide, setActiveSlide] = useState(0);

  if (!pet || !pet.name) {
    return (
      <View style={styles.center}>
        <Text>Pet data not found</Text>
      </View>
    );
  }

  const images =
    pet.photos && pet.photos.length > 0
      ? pet.photos
      : pet.snaps && pet.snaps.length > 0
        ? pet.snaps
        : [
            pet.avatarUrl ||
              pet.image ||
              "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
          ];

  const renderItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.sliderImage} />
  );

  return (
    <View style={styles.container}>
      <Header title="Pet Facts" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 70 }}
      >
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveSlide(index);
            }}
            keyExtractor={(_: string, index: number) => index.toString()}
          />
          <View style={styles.paginationBadge}>
            <Text style={styles.paginationText}>
              {activeSlide + 1}/{images.length}
            </Text>
          </View>
          <View style={styles.paginationDots}>
            {images.map((_: string, i: number) => (
              <View
                key={i}
                style={[styles.dot, activeSlide === i && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <View>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed}</Text>
              </View>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
                {pet.gender === "Female" ? (
                  <FemaleIcon width={36} height={36} color="#1976D2" />
                ) : (
                  <MaleIcon width={36} height={34} color="#1976D2" />
                )}
              </View>
              <View>
                <Text style={styles.statLabel}>Gender</Text>
                <Text style={styles.statValue}>{pet.gender}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#FFF3E0" }]}>
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={20}
                  color="#F57C00"
                />
              </View>
              <View>
                <Text style={styles.statLabel}>Age</Text>
                <Text style={styles.statValue}>{pet.age} years</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#F3E5F5" }]}>
                <HugeiconsIcon
                  icon={WeightScale01Icon}
                  size={20}
                  color="#7B1FA2"
                />
              </View>
              <View>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>
                  {pet.weightLbs || pet.weight || "?"} lbs
                </Text>
              </View>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: "#E8F5E9" }]}>
              <Text style={[styles.tagText, { color: "#2E7D32" }]}>
                {pet.vaccinated ? "Vaccinated" : "Not Vaccinated"}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: "#F3E5F5" }]}>
              <Text style={[styles.tagText, { color: "#7B1FA2" }]}>
                {pet.neutered ? "Neutered" : "Not Neutered"}
              </Text>
            </View>
            <View style={[styles.tag, { backgroundColor: "#E0F7FA" }]}>
              <Text style={[styles.tagText, { color: "#006064" }]}>
                {pet.trained ? "Trained" : "Not Trained"}
              </Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {pet.name}</Text>
            <Text style={styles.aboutText}>
              {pet.about || "No description provided."}{" "}
            </Text>
          </View>

          {/* Personality */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personality</Text>
            <View style={styles.personalityRow}>
              {pet.personality && pet.personality.length > 0 ? (
                pet.personality.map((trait: string, i: number) => (
                  <View
                    key={i}
                    style={[
                      styles.personalityTag,
                      { backgroundColor: i % 2 === 0 ? "#E3F2FD" : "#FFF3E0" },
                    ]}
                  >
                    <Text style={styles.personalityText}>{trait}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.aboutText}>No traits added.</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    height: 350,
    position: "relative",
  },
  sliderImage: {
    width: width,
    height: 350,
    resizeMode: "cover",
  },
  paginationBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.lg,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paginationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  paginationDots: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    backgroundColor: "#00BCD4",
    width: 16,
  },
  body: {
    marginTop: -30,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Spacing.lg,
    minHeight: 500,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  petName: {
    fontSize: 28,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  petBreed: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  tagRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: FontWeights.medium,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  aboutText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  personalityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  personalityTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  personalityText: {
    fontSize: 12,
    color: Colors.text,
  },
});
