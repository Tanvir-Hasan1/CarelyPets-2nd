import BookingDropdown from "@/components/bookService/BookingDropdown";
import BookingCalendar from "@/components/booking/BookingCalendar";
import Header from "@/components/ui/Header";
import { Colors, FontSizes, FontWeights, Spacing } from "@/constants/colors";
import bookingService from "@/services/bookingService";
import { usePetStore } from "@/store/usePetStore";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { Bell } from "lucide-react-native";

const REMINDER_OPTIONS = [
  "No reminder",
  "30 minutes before",
  "1 hour before",
  "1 day before",
  "1 week before",
];

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

export default function BookServiceScreen() {
  const router = useRouter();
  // @ts-ignore
  const { petId } = useLocalSearchParams();
  const { pets } = usePetStore();

  // Use passed petId as default if available, otherwise first pet
  const [selectedPetId, setSelectedPetId] = useState(
    (petId as string) || pets[0]?.id || "",
  );
  const [selectedServiceId, setSelectedServiceId] = useState("grooming");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedReminder, setSelectedReminder] = useState(REMINDER_OPTIONS[3]); // Default "1 week before"

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setIsLoadingSlots(true);
    try {
      // Format date to YYYY-MM-DD using local components to avoid timezone shifts
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const slots = await bookingService.getAvailability(formattedDate);
      setAvailableSlots(slots);

      // Select first slot by default if available
      if (slots.length > 0) {
        setSelectedTime(slots[0]);
      } else {
        setSelectedTime("");
      }
    } catch (error) {
      console.error("[BookService] Failed to fetch slots:", error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const formatTimeSlot = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return isoString;
    }
  };

  const handleNext = () => {
    if (!selectedTime) return;

    const selectedPet = pets.find((p) => p.id === selectedPetId);
    const { healthRecords, ...petDataToLog } = selectedPet || ({} as any);
    const selectedService = SERVICES.find((s) => s.id === selectedServiceId);

    console.log("--- Booking Application Info ---");
    console.log(
      "Selected Pet (Excl. Health Records):",
      JSON.stringify(petDataToLog, null, 2),
    );
    console.log("Selected Service:", JSON.stringify(selectedService, null, 2));
    console.log("Selected Time (Slot):", selectedTime);
    console.log("Selected Time (Formatted):", formatTimeSlot(selectedTime));
    console.log("Reminder Setting:", selectedReminder);
    console.log("--------------------------------");

    router.push({
      pathname: "/(tabs)/home/booking/confirm",
      params: {
        petId: selectedPetId,
        serviceId: selectedServiceId,
        date: selectedDate.toISOString(),
        time: formatTimeSlot(selectedTime),
        slotIso: selectedTime,
        reminder: selectedReminder,
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
            {pets.length === 0 ? (
              <Text style={styles.noPetsText}>
                No pets for service, Please add one.
              </Text>
            ) : (
              pets.map((pet) => (
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
              ))
            )}
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

          {isLoadingSlots ? (
            <View style={{ padding: Spacing.xl }}>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          ) : availableSlots.length > 0 ? (
            <View style={styles.timeGrid}>
              {availableSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlot,
                    selectedTime === slot && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === slot && styles.selectedTimeText,
                    ]}
                  >
                    {formatTimeSlot(slot)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ padding: Spacing.lg, alignItems: "center" }}>
              <Text
                style={{ color: Colors.textSecondary, fontStyle: "italic" }}
              >
                No slots available for this date.
              </Text>
            </View>
          )}
        </View>

        {/* Remind me */}
        <View style={styles.reminderRow}>
          <View style={styles.reminderToggle}>
            <Bell size={18} color={Colors.primary} />
            <Text style={styles.reminderText}>Remind me before due time</Text>
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <BookingDropdown
              label="Select Reminder"
              options={REMINDER_OPTIONS}
              selectedOption={selectedReminder}
              onSelect={setSelectedReminder}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            (!selectedPetId || !selectedTime) && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={!selectedPetId || !selectedTime}
        >
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
  noPetsText: {
    fontStyle: "italic",
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    paddingVertical: Spacing.sm,
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
  disabledButton: {
    backgroundColor: "#B0BEC5", // Greyed out color
    opacity: 0.7,
  },
});
