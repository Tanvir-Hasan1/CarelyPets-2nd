import BookingCalendar from "@/components/booking/BookingCalendar";
import Header from "@/components/ui/Header";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import { usePetStore } from "@/store/usePetStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import SVG icons
import GroomingIcon from "@/assets/images/icons/grooming.svg";
import TrainingIcon from "@/assets/images/icons/training.svg";
import VetIcon from "@/assets/images/icons/vet.svg";
import WalkingIcon from "@/assets/images/icons/walking.svg";
import { Bell, ChevronDown } from "lucide-react-native";

const SERVICES = [
  {
    id: "vet",
    name: "Vet",
    icon: VetIcon,
    color: "#4DD0E1",
    bgColor: "#E0F7FA",
  },
  {
    id: "grooming",
    name: "Grooming",
    icon: GroomingIcon,
    color: "#4DB6AC",
    bgColor: "#E0F2F1",
  },
  {
    id: "training",
    name: "Training",
    icon: TrainingIcon,
    color: "#4FC3F7",
    bgColor: "#E1F5FE",
  },
  {
    id: "walking",
    name: "Walking",
    icon: WalkingIcon,
    color: "#81C784",
    bgColor: "#E8F5E9",
  },
];

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "11:00 AM",
  "11:30 AM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
];

export default function BookServiceScreen() {
  const router = useRouter();
  // @ts-ignore
  const { petId } = useLocalSearchParams();
  const { pets } = usePetStore();

  // Use passed petId as default if available, otherwise first pet
  const [selectedPetId, setSelectedPetId] = useState(
    (petId as string) || pets[0]?.id || ""
  );
  const [selectedServiceId, setSelectedServiceId] = useState("grooming");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("11:30 AM");

  // Update selectedPetId if pets change or params change logic if needed,
  // but initial state usually suffices for navigation entry.

  // ... rest of logic

  const handleNext = () => {
    router.push({
      pathname: "/(tabs)/home/booking/confirm",
      params: {
        petId: selectedPetId,
        serviceId: selectedServiceId,
        date: selectedDate.toISOString(),
        time: selectedTime,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Book a Service" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* My Pets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Pets</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petsList}
          >
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petItem}
                onPress={() => setSelectedPetId(pet.id)}
              >
                <View
                  style={[
                    styles.petImageContainer,
                    selectedPetId === pet.id && styles.selectedPetImage,
                  ]}
                >
                  {pet.avatarUrl || pet.image ? (
                    <Image
                      source={{ uri: pet.avatarUrl || pet.image }}
                      style={styles.petImage}
                    />
                  ) : (
                    <View
                      style={[styles.petImage, { backgroundColor: "#EEE" }]}
                    />
                  )}
                  {selectedPetId === pet.id && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.petName}>{pet.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Choose Service */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Service</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceItem}
                onPress={() => setSelectedServiceId(service.id)}
              >
                <View
                  style={[
                    styles.serviceIconContainer,
                    { backgroundColor: service.bgColor },
                    selectedServiceId === service.id &&
                      styles.selectedServiceIcon,
                  ]}
                >
                  <service.icon width={60} height={60} />
                  {selectedServiceId === service.id && (
                    <View style={styles.checkBadgeService}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Select Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date & Time</Text>
          <BookingCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>
            Available Times
          </Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Remind me */}
        <View style={styles.reminderRow}>
          <View style={styles.reminderToggle}>
            <Bell size={18} color={Colors.primary} />
            <Text style={styles.reminderText}>Remind me before due time</Text>
          </View>
          <TouchableOpacity style={styles.timeDropdown}>
            <Text style={styles.dropdownText}>1 week</Text>
            <ChevronDown size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  petsList: {
    gap: Spacing.md,
  },
  petItem: {
    alignItems: "center",
    width: 60,
  },
  petImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  selectedPetImage: {
    borderColor: Colors.primary,
  },
  petImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  checkBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  checkBadgeService: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#4CAF50",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  checkText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  petName: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  servicesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  selectedServiceIcon: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  serviceName: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeights.medium,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    minWidth: 80,
    alignItems: "center",
  },
  selectedTimeSlot: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  selectedTimeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  reminderToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "#F3F4F6",
    padding: Spacing.md,
    borderRadius: 12,
    flex: 1,
    marginRight: Spacing.md,
  },
  reminderText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  timeDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "#F3F4F6",
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  nextButton: {
    backgroundColor: "#00BCD4",
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
});
