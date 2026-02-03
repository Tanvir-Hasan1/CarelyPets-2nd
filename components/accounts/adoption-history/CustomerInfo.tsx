import { AdoptionOrder } from "@/services/adoptionService";
import { StyleSheet, Text, View } from "react-native";

interface CustomerInfoProps {
  order: AdoptionOrder;
  user: {
    name?: string;
    address?: string;
    phone?: string;
  } | null;
  statusInfo: {
    label: string;
    color: string;
    bgColor: string;
    dotColor: string;
  };
}

export default function CustomerInfo({
  order,
  user,
  statusInfo,
}: CustomerInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Customer Information</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}
        >
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
          <View
            style={[styles.statusDot, { backgroundColor: statusInfo.dotColor }]}
          />
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ORDER ID</Text>
        <Text style={styles.infoValue}>{order.orderId}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ORDER DATE</Text>
        <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>NAME</Text>
        <Text style={styles.infoValue}>{user?.name || "N/A"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>ADDRESS</Text>
        <Text style={styles.infoValue}>{user?.address || "N/A"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>PHONE</Text>
        <Text style={styles.infoValue}>{user?.phone || "N/A"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 10,
    color: "#6B7280",
    letterSpacing: 0.5,
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
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
});
