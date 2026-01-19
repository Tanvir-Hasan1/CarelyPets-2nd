import Paw from "@/assets/images/icons/Paw-solid.svg";
import GroomingIcon from "@/assets/images/icons/grooming.svg";
import TrainingIcon from "@/assets/images/icons/training.svg";
import VetIcon from "@/assets/images/icons/vet.svg";
import WalkingIcon from "@/assets/images/icons/walking.svg";
import Header from "@/components/ui/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { usePetStore } from "@/store/usePetStore";
import { useLocalSearchParams } from "expo-router";
import { Calendar, CheckCircle2, Store } from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SERVICE_ICONS: Record<string, any> = {
  vet: VetIcon,
  grooming: GroomingIcon,
  training: TrainingIcon,
  walking: WalkingIcon,
};

const SERVICE_THEMES: Record<string, { color: string; bgColor: string }> = {
  vet: { color: "#4DD0E1", bgColor: "#E0F7FA" },
  grooming: { color: "#4DB6AC", bgColor: "#E0F2F1" },
  training: { color: "#4FC3F7", bgColor: "#E1F5FE" },
  walking: { color: "#81C784", bgColor: "#E8F5E9" },
};

import useBookingStore from "@/store/useBookingStore";

export default function ServiceHistoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuthStore();
  const { pets } = usePetStore();
  const { getBookingById, fetchBookingById, isLoading } = useBookingStore();
  const booking = getBookingById(id as string);

  useEffect(() => {
    if (id && !booking) {
      fetchBookingById(id as string);
    }
  }, [id, booking]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="View History" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006D77" />
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <Header title="View History" />
        <View style={styles.loadingContainer}>
          <Text>Booking not found</Text>
        </View>
      </View>
    );
  }

  const item = booking.items[0];
  const serviceType = item?.serviceType || "grooming";
  const ServiceIcon = SERVICE_ICONS[serviceType.toLowerCase()] || GroomingIcon;
  const theme =
    SERVICE_THEMES[serviceType.toLowerCase()] || SERVICE_THEMES.grooming;

  const dateObject = new Date(booking.scheduledAt);
  const dateString = dateObject.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeString = dateObject.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const pet = pets.find((p) => p.id === booking.pets[0]) || pets[0];

  return (
    <View style={styles.container}>
      <Header title="View History" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Customer Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Customer Information</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    booking.status === "completed" ? "#DCFCE7" : "#FEF3C7",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      booking.status === "completed" ? "#166534" : "#92400E",
                  },
                ]}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </Text>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      booking.status === "completed" ? "#15803D" : "#B45309",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NAME</Text>
            <Text style={styles.infoValue}>{user?.name || "N/A"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>{user?.phone || "N/A"}</Text>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View
              style={[styles.iconCircle, { backgroundColor: theme.bgColor }]}
            >
              <ServiceIcon width={40} height={40} />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.infoLabel}>SERVICE</Text>
              <Text style={styles.infoValue}>{item?.serviceName || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#B2EBF2" }]}>
              <Calendar size={28} color="#006D77" />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.infoLabel}>DATE & TIME</Text>
              <Text style={styles.infoValue}>
                {dateString} at {timeString}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#B2EBF2" }]}>
              <Store size={28} color="#006D77" />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.infoLabel}>WITH</Text>
              <Text style={styles.infoValue}>Carely Pets</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.iconCircle, { backgroundColor: "#B2EBF2" }]}>
              <Paw height={56} width={56} />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.infoLabel}>FOR</Text>
              <Text style={styles.infoValue}>{item?.petName || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          <Text style={[styles.infoLabel, { marginTop: 12 }]}>
            {item?.serviceName || "N/A"}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{item?.petName || "N/A"}</Text>
            <Text style={styles.summaryValue}>
              $ {item?.unitPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              $ {booking.subtotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={[styles.infoLabel, { fontSize: 11 }]}>
                ({booking.taxPercent}%)
              </Text>
            </View>
            <Text style={styles.summaryValue}>
              $ {booking.taxAmount.toFixed(2)}
            </Text>
          </View>

          <View
            style={[
              styles.summaryRow,
              {
                marginTop: 8,
                borderTopWidth: 1,
                borderTopColor: "#F3F4F6",
                paddingTop: 12,
              },
            ]}
          >
            <Text
              style={[
                styles.summaryLabel,
                { fontWeight: "bold", fontSize: 18, color: "#111827" },
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { fontWeight: "bold", fontSize: 18, color: "#111827" },
              ]}
            >
              $ {booking.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            {booking.paymentStatus === "paid" ? "Paid" : "Payment Pending"}
          </Text>
          {booking.paymentStatus === "paid" && (
            <View style={styles.checkCircle}>
              <CheckCircle2 size={24} color="#10B981" />
            </View>
          )}
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    letterSpacing: 0.5,
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  detailText: {
    flex: 1,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "bold",
  },
  footerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  footerText: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "600",
  },
  checkCircle: {
    // styles for check circle wrapper if needed
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
