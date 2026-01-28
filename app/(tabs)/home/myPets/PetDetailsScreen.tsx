import EditIcon from "@/assets/images/icons/edit.svg";
import FemaleIcon from "@/assets/images/icons/female.svg";
import MaleIcon from "@/assets/images/icons/male.svg";
import DeleteModal from "@/components/ui/DeleteModal";
import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { usePetStore } from "@/store/usePetStore";
import {
  ArrowLeft02Icon,
  Calendar02Icon,
  Calendar03Icon,
  Delete02Icon,
  Edit02Icon,
  Note01Icon,
  Notification02Icon,
  WeightScale01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PetDetailsScreen({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pets, deletePet, fetchPetById, isLoading } = usePetStore();
  const pet = pets.find((p) => p.id === id);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Deletion States
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();

  useEffect(() => {
    if (id) {
      fetchPetById(id);
    }
  }, [id]);

  useEffect(() => {
    if (pet) {
      console.log("[PetDetailsScreen] Pet Data:", pet);
    }
  }, [pet]);

  if (!pet) {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <View style={styles.container}>
            <Header title="Pet Facts" />
            <View style={styles.center}>
              <Text>Loading pet details...</Text>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text>Pet not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "blue", marginTop: 10 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    setIsDeleteModalVisible(false); // Close confirm modal first
    setIsDeleting(true);
    setDeleteError(undefined);

    try {
      const result = await deletePet(pet.id);
      if (result.success) {
        setDeleteSuccess(true);
        setTimeout(() => {
          setIsDeleting(false);
          setDeleteSuccess(false);
          router.back();
        }, 1500);
      } else {
        setDeleteError(result.message || "Failed to delete.");
        // Keep loading modal open but in failed state (if LoadingModal supports it)
        // or close it and show alert.
        // For this LoadingModal, we can set failed={!!deleteError} if we pass it.
      }
    } catch (error: any) {
      setDeleteError(error.message || "An unexpected error occurred.");
    } finally {
      if (deleteError) setIsDeleting(false); // Only close if error, success handled by timeout
    }
  };

  const healthRecords = [
    {
      id: "1",
      title: "Vaccination",
      date: "Last updated Jan 6, 2025",
      icon: Note01Icon,
      bg: "#E8F5E9",
      color: "#4CAF50",
    },
    {
      id: "2",
      title: "Check-up",
      date: "Last updated Jan 6, 2025",
      icon: Calendar03Icon,
      bg: "#E3F2FD",
      color: "#2196F3",
    },
    {
      id: "3",
      title: "Medication",
      date: "Last updated Jan 6, 2025",
      icon: Notification02Icon,
      bg: "#FFEBEE",
      color: "#F44336",
    },
    {
      id: "4",
      title: "Tick",
      date: "Last updated Jan 6, 2025",
      icon: Edit02Icon,
      bg: "#F3E5F5",
      color: "#9C27B0",
    },
    {
      id: "5",
      title: "Surgery",
      date: "Last updated Jan 6, 2025",
      icon: Note01Icon,
      bg: "#FFEBEE",
      color: "#E91E63",
    },
    {
      id: "6",
      title: "Dental",
      date: "Last updated Jan 6, 2025",
      icon: Note01Icon,
      bg: "#FFF3E0",
      color: "#FF9800",
    },
    {
      id: "7",
      title: "Other",
      date: "Last updated Jan 6, 2025",
      icon: Note01Icon,
      bg: "#FAFAFA",
      color: "#757575",
    },
  ];

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
            keyExtractor={(_, index) => index.toString()}
          />
          <View style={styles.paginationBadge}>
            <Text style={styles.paginationText}>
              {activeSlide + 1}/{images.length}
            </Text>
          </View>
          <View style={styles.paginationDots}>
            {images.map((_, i) => (
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
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/home/myPets/edit-pet/[id]",
                    params: { id: pet.id },
                  })
                }
              >
                <EditIcon width={24} height={24} color="#00BCD4" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }} />
            <View>
              <Text style={styles.memoryLabel}>MEMORY START</Text>
              <Text style={styles.memoryDate}>Nov 14, 2025</Text>
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
                <Text style={styles.statValue}>{pet.weightLbs} lbs</Text>
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
              <Text style={styles.seeMore}>...See more</Text>
            </Text>
          </View>

          {/* Personality */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personality</Text>
            <View style={styles.personalityRow}>
              {pet.personality && pet.personality.length > 0 ? (
                pet.personality.map((trait, i) => (
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

          {/* Health Records */}
          <View style={styles.section}>
            <View style={styles.healthHeader}>
              <Text style={styles.sectionTitle}>Health Records</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/home/myPets/add-health-record",
                    params: { petId: pet.id },
                  })
                }
              >
                <Text style={styles.addHealthText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            {healthRecords.map((record) => (
              <TouchableOpacity
                key={record.id}
                style={styles.healthItem}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/home/myPets/health-records-list",
                    params: { petId: pet.id, recordType: record.title },
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
                <HugeiconsIcon
                  icon={ArrowLeft02Icon}
                  size={16}
                  color={Colors.textSecondary}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <HugeiconsIcon icon={Delete02Icon} size={20} color="#ffffff" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/booking",
                  params: { petId: pet.id },
                })
              }
            >
              <HugeiconsIcon icon={Calendar02Icon} size={20} color="#ffffff" />
              <Text style={styles.bookText}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <DeleteModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        title="Delete Pet"
        description={`Are you sure you want to delete ${pet.name}? This action cannot be undone.`}
      />

      <LoadingModal
        visible={isDeleting || !!deleteError}
        message="Deleting pet..."
        success={deleteSuccess}
        successMessage="Pet deleted successfully!"
        failed={!!deleteError}
        error={deleteError}
        onClose={() => {
          setIsDeleting(false);
          setDeleteError(undefined);
        }}
      />
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
  header: {
    position: "relative",
    backgroundColor: "#F8F9FA",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#006064",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: Colors.border,
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
    bottom: 40, // Above the rounded body
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
  memoryLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  memoryDate: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
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
  seeMore: {
    color: "#00BCD4",
    fontWeight: FontWeights.bold,
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
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  addHealthText: {
    color: "#006064",
    fontWeight: FontWeights.bold,
  },
  healthItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    // Shadow (optional)
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
  footer: {
    flexDirection: "row",
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    flex: 1,
    gap: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
  bookButton: {
    backgroundColor: "#00BCD4",
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    flex: 1.5,
    gap: 8,
  },
  bookText: {
    color: "white",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
});
