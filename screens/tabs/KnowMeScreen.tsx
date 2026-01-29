import FemaleIcon from "@/assets/images/icons/female.svg";
import MaleIcon from "@/assets/images/icons/male.svg";
import {
  PersonalityTag,
  ShelterInfoCard,
} from "@/components/home/adopt-a-pet/KnowMeComponents";
import Header from "@/components/ui/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors/index";
import adoptionService, { AdoptionDetail } from "@/services/adoptionService";
import { useBasketStore } from "@/store/useBasketStore";
import {
  Calendar03Icon,
  Note01Icon,
  Notification02Icon,
  WeightScale01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface HealthRecordItem {
  id: string;
  title: string;
  date: string;
  count: number;
  icon: any;
  color: string;
  bg: string;
}

export default function KnowMeScreen({ id }: { id: string }) {
  const router = useRouter();
  const { addToBasket } = useBasketStore();
  const [pet, setPet] = useState<AdoptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        const response = await adoptionService.getAdoptionDetails(id);
        if (response.success) {
          setPet(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch pet details", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: Colors.text }}>Pet not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
        >
          <Text style={{ color: "#00BCD4", fontWeight: "bold" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images =
    pet.photos && pet.photos.length > 0
      ? pet.photos
      : [
          pet.avatarUrl ||
            "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
        ];

  // Dynamic Health Records from API
  const healthRecords: HealthRecordItem[] = [];
  if (pet.healthSummary) {
    Object.entries(pet.healthSummary).forEach(([key, value]) => {
      let icon = Note01Icon;
      let color = "#757575";
      let bg = "#FAFAFA";

      const type = key.toLowerCase();
      if (type === "vaccination") {
        icon = Note01Icon;
        color = "#4CAF50";
        bg = "#E8F5E9";
      } else if (type === "medication") {
        icon = Notification02Icon;
        color = "#F44336";
        bg = "#FFEBEE";
      } else if (type === "checkup" || type === "check-up") {
        icon = Calendar03Icon;
        color = "#2196F3";
        bg = "#E3F2FD";
      } else if (type.includes("tick")) {
        // icon = BugIcon if available
        color = "#9C27B0";
        bg = "#F3E5F5";
      }

      healthRecords.push({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
        date: `Last updated ${value.lastUpdated}`,
        count: value.count,
        icon,
        color,
        bg,
      });
    });
  }

  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.sliderImage} />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Know Me" style={{ backgroundColor: "#FFFFFF" }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
      >
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            renderItem={renderImage}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveSlide(index);
            }}
            keyExtractor={(_, index: number) => index.toString()}
          />
          <View style={styles.paginationBadge}>
            <Text style={styles.paginationText}>
              {activeSlide + 1}/{images.length}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              (pet.status.toLowerCase() === "adopted" ||
                pet.status.toLowerCase() === "pending") &&
                styles.statusBadgeAdopted,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                (pet.status.toLowerCase() === "adopted" ||
                  pet.status.toLowerCase() === "pending") &&
                  styles.statusTextAdopted,
              ]}
            >
              {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
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
          <View style={styles.petHeader}>
            <Text style={styles.petName}>{pet.petName}</Text>
            <Text style={styles.petBreed}>{pet.petBreed}</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
                {pet.petGender.toLowerCase() === "female" ? (
                  <FemaleIcon width={36} height={36} color="#1976D2" />
                ) : (
                  <MaleIcon width={36} height={34} color="#1976D2" />
                )}
              </View>
              <View>
                <Text style={styles.statLabel}>Gender</Text>
                <Text style={styles.statValue}>
                  {pet.petGender.charAt(0).toUpperCase() +
                    pet.petGender.slice(1)}
                </Text>
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
                <Text style={styles.statValue}>
                  {pet.petAge} year{pet.petAge !== 1 ? "s" : ""}
                </Text>
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
                  {pet.weightLbs || "--"} lbs
                </Text>
              </View>
            </View>
          </View>

          {/* Simple Tags */}
          <View style={styles.tagRow}>
            {pet.vaccinated && (
              <View style={[styles.tag, { backgroundColor: "#E8F5E9" }]}>
                <Text style={[styles.tagText, { color: "#2E7D32" }]}>
                  Vaccinated
                </Text>
              </View>
            )}
            {pet.neutered && (
              <View style={[styles.tag, { backgroundColor: "#F3E5F5" }]}>
                <Text style={[styles.tagText, { color: "#7B1FA2" }]}>
                  Neutered
                </Text>
              </View>
            )}
            {pet.trained && (
              <View style={[styles.tag, { backgroundColor: "#E0F7FA" }]}>
                <Text style={[styles.tagText, { color: "#006064" }]}>
                  Trained
                </Text>
              </View>
            )}
            {!pet.vaccinated && !pet.neutered && !pet.trained && (
              <View style={[styles.tag, { backgroundColor: "#F5F5F5" }]}>
                <Text style={[styles.tagText, { color: "#757575" }]}>
                  No specific traits
                </Text>
              </View>
            )}
          </View>

          {/* Shelter Info */}
          <ShelterInfoCard
            name={pet.shelterName || "Carely Shelter"}
            phone={pet.shelterPhone || "N/A"}
            price={pet.price ? `${pet.price.toFixed(2)}` : "Free"}
          />

          {/* About section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {pet.petName}</Text>
            <Text style={styles.aboutText}>
              {pet.aboutPet || `A lovely ${pet.petBreed} looking for a home.`}
            </Text>
          </View>

          {/* Personality section */}
          {pet.personality && pet.personality.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personality</Text>
              <View style={styles.personalityRow}>
                {pet.personality.map((trait, index) => (
                  <PersonalityTag
                    key={index}
                    label={trait}
                    color={
                      ["#2196F3", "#FF9800", "#4CAF50", "#9C27B0", "#00BCD4"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </View>
            </View>
          )}

          {/* Health Records section */}
          {healthRecords.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Records</Text>
              {healthRecords.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  style={styles.healthItem}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/home/adopt-pet/health-records",
                      params: { id: pet.id, type: record.title.toLowerCase() },
                    })
                  }
                >
                  <View
                    style={[styles.healthIcon, { backgroundColor: record.bg }]}
                  >
                    <HugeiconsIcon
                      icon={record.icon}
                      size={20}
                      color={record.color}
                    />
                  </View>
                  <View style={styles.healthInfo}>
                    <Text style={styles.healthTitle}>{record.title}</Text>
                    <Text style={styles.healthDate}>{record.date}</Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{record.count} Records</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Adopt Button */}
          <View style={styles.adoptButtonContainer}>
            <TouchableOpacity
              style={[
                styles.adoptButton,
                (pet.status.toLowerCase() === "adopted" ||
                  pet.status.toLowerCase() === "pending") &&
                  styles.adoptButtonDisabled,
              ]}
              disabled={
                pet.status.toLowerCase() === "adopted" ||
                pet.status.toLowerCase() === "pending"
              }
              onPress={async () => {
                const success = await addToBasket(pet.id);
                if (success) {
                  Alert.alert(
                    "Added to Basket",
                    `${pet.petName} has been added to your adoption basket.`,
                  );
                } else {
                  Alert.alert(
                    "Error",
                    "Failed to add to basket. It might already be there.",
                  );
                }
              }}
            >
              <Text style={styles.adoptButtonText}>
                {pet.status.toLowerCase() === "adopted" ||
                pet.status.toLowerCase() === "pending"
                  ? "Unavailable"
                  : "Adopt Me"}
              </Text>
            </TouchableOpacity>
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
    height: 380,
    position: "relative",
  },
  sliderImage: {
    width: width,
    height: 380,
    resizeMode: "cover",
  },
  paginationBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paginationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  statusBadge: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeAdopted: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextAdopted: {
    color: "#F44336",
  },
  paginationDots: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginBottom: 2,
  },
  activeDot: {
    backgroundColor: "#00BCD4",
    width: 16,
  },
  body: {
    marginTop: -30,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: Spacing.lg,
  },
  petHeader: {
    marginBottom: Spacing.md,
  },
  petName: {
    fontSize: 28,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  petBreed: {
    fontSize: 14,
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
    gap: 8,
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
    fontSize: 12,
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
    fontWeight: "600",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  aboutText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  seeMore: {
    color: "#00BCD4",
    fontWeight: "bold",
    marginLeft: 4,
  },
  personalityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  adoptButtonContainer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  adoptButton: {
    backgroundColor: "#00BCD4",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  adoptButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  adoptButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  healthItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  healthIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  healthInfo: {
    flex: 1,
  },
  healthTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  healthDate: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  countBadge: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
});
