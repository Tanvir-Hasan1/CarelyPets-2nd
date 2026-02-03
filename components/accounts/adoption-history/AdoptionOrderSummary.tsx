import { AdoptionOrder } from "@/services/adoptionService";
import { StyleSheet, Text, View } from "react-native";

interface AdoptionOrderSummaryProps {
  order: AdoptionOrder;
}

export default function AdoptionOrderSummary({
  order,
}: AdoptionOrderSummaryProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Order Summary</Text>

      <View style={styles.summaryList}>
        {order.items.map((pet, index) => (
          <View key={index} style={styles.summaryItem}>
            <View>
              <Text style={styles.summaryLabel}>{pet.petName}</Text>
              <Text style={styles.subtitleLabel}>{pet.petBreed}</Text>
            </View>
            <Text style={styles.summaryValue}>$ {pet.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.summaryItem,
          {
            marginTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
            paddingTop: 12,
          },
        ]}
      >
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>$ {order.subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryItem}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={[styles.infoLabel, { fontSize: 11 }]}>
            ({order.taxPercent > 0 ? `${order.taxPercent}%` : "0%"})
          </Text>
        </View>
        <Text style={styles.summaryValue}>$ {order.taxAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Processing fee</Text>
        <Text style={styles.summaryValue}>
          $ {order.processingFee.toFixed(2)}
        </Text>
      </View>

      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>Shipping cost</Text>
        <Text style={styles.summaryValue}>
          $ {order.shippingFee.toFixed(2)}
        </Text>
      </View>

      <View
        style={[
          styles.summaryItem,
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
          $ {order.total.toFixed(2)}
        </Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryList: {
    gap: 12,
    marginTop: 12,
  },
  summaryItem: {
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
  subtitleLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "bold",
  },
  infoLabel: {
    fontSize: 10,
    color: "#6B7280",
    letterSpacing: 0.5,
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
  },
});
