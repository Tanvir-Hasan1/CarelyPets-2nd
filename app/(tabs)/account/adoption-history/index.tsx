import Header from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import adoptionService, { AdoptionOrder } from "@/services/adoptionService";
import { useRouter } from "expo-router";
import { Package } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FILTER_TABS = ["All", "Processing", "Delivered"];

export default function AdoptionHistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdoptionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adoptionService.getAdoptionOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching adoption history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return { color: "#166534", bgColor: "#DCFCE7", dotColor: "#15803D" }; // Green
      case "pending":
      case "processing":
        return { color: "#92400E", bgColor: "#FEF3C7", dotColor: "#B45309" }; // Amber
      case "failed":
        return { color: "#991B1B", bgColor: "#FEE2E2", dotColor: "#B91C1C" }; // Red
      default:
        return { color: "#1F2937", bgColor: "#F3F4F6", dotColor: "#374151" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit", // Added time to match "DATE & TIME" label semantic
      minute: "2-digit",
    });
  };

  const renderOrderItem = ({ item }: { item: AdoptionOrder }) => {
    // Determine status label
    const statusLabel = item.status === "paid" ? "Delivered" : "Processing";
    const statusStyle = getStatusColor(statusLabel);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Package size={24} color="#4B5563" />
            </View>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.label}>ORDER ID</Text>
            <Text style={styles.serviceName} numberOfLines={1}>
              {item.orderId}
            </Text>
            <Text style={styles.label}>ORDER DATE</Text>
            <Text style={styles.dateTime}>{formatDate(item.createdAt)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bgColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusLabel}
            </Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusStyle.dotColor },
              ]}
            />
          </View>
        </View>

        <Text style={styles.price}>${item.total.toFixed(2)}</Text>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => {
            router.push({
              pathname: `/(tabs)/account/adoption-history/${item.orderId}`,
              params: { orderData: JSON.stringify(item) },
            });
          }}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Adoption History" />

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
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No adoption history found.</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#A5F3FC",
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
    paddingBottom: 40,
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
    backgroundColor: "#B2EBF2",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#006064",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
