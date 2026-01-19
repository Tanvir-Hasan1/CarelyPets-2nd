import GroomingIcon from "@/assets/images/icons/grooming.svg";
import TrainingIcon from "@/assets/images/icons/training.svg";
import VetIcon from "@/assets/images/icons/vet.svg";
import WalkingIcon from "@/assets/images/icons/walking.svg";
import Header from "@/components/ui/Header";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FILTER_TABS = ["All", "Pending", "Completed"];

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

export default function ServiceHistoryScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const { bookings, isLoading, fetchBookings } = useBookingStore();
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredServices = bookings.filter((s) => {
    if (activeTab === "All") return true;
    return s.status.toLowerCase() === activeTab.toLowerCase();
  });

  const renderServiceItem = ({ item }: { item: any }) => {
    const serviceType = item.items[0]?.serviceType || "grooming";
    const ServiceIcon =
      SERVICE_ICONS[serviceType.toLowerCase()] || GroomingIcon;
    const theme =
      SERVICE_THEMES[serviceType.toLowerCase()] || SERVICE_THEMES.grooming;

    const formattedDate = new Date(item.scheduledAt).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );

    const formattedTime = new Date(item.scheduledAt).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      },
    );

    const statusObj = {
      label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      color: item.status === "completed" ? "#166534" : "#92400E",
      bgColor: item.status === "completed" ? "#DCFCE7" : "#FEF3C7",
      dotColor: item.status === "completed" ? "#15803D" : "#B45309",
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View
              style={[styles.iconCircle, { backgroundColor: theme.bgColor }]}
            >
              <ServiceIcon width={40} height={40} />
            </View>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.label}>SERVICE</Text>
            <Text style={styles.serviceName}>
              {item.items[0]?.serviceName || "N/A"}
            </Text>
            <Text style={styles.label}>DATE & TIME</Text>
            <Text style={styles.dateTime}>
              {formattedDate} at {formattedTime}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusObj.bgColor }]}
          >
            <Text style={[styles.statusText, { color: statusObj.color }]}>
              {statusObj.label}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusObj.dotColor },
              ]}
            />
          </View>
        </View>

        <Text style={styles.price}>${item.total.toFixed(2)}</Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            router.push(`/(tabs)/account/service-history/${item._id}`)
          }
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Service History" />

      <View style={styles.tabContainer}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006D77" />
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No service history found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeTab: {
    backgroundColor: "#A5F3FC", // Light cyan from screenshot
    borderColor: "#A5F3FC",
  },
  tabText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#006064",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    position: "relative",
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    letterSpacing: 0.5,
    fontWeight: "500",
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  statusBadge: {
    position: "absolute",
    right: 0,
    top: 0,
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
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginVertical: 12,
  },
  viewButton: {
    backgroundColor: "#B2EBF2", // Cyan color per screenshot
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#006064",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
