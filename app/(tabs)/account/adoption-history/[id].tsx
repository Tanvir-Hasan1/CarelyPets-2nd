import Header from "@/components/ui/Header";
import { Colors } from "@/constants/colors";
import { AdoptionOrder } from "@/services/adoptionService";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocalSearchParams } from "expo-router";
import { CheckCircle2, Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import AdoptionOrderFooter from "@/components/accounts/adoption-history/AdoptionOrderFooter";
import AdoptionOrderSummary from "@/components/accounts/adoption-history/AdoptionOrderSummary";
import AdoptionPetList from "@/components/accounts/adoption-history/AdoptionPetList";
import CustomerInfo from "@/components/accounts/adoption-history/CustomerInfo";

export default function AdoptionDetailScreen() {
  const { id, orderData } = useLocalSearchParams<{
    id: string;
    orderData: string;
  }>();
  const [order, setOrder] = useState<AdoptionOrder | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(orderData);
        setOrder(parsedOrder);
      } catch (e) {
        console.error("Error parsing order data:", e);
      }
    }
  }, [orderData]);

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return {
          label: "Paid",
          color: "#92400E",
          bgColor: "#FEF3C7",
          dotColor: "#B45309",
          icon: <CheckCircle2 size={24} color="#10B981" />,
        };
      case "pending":
      case "processing":
        return {
          label: "Pending",
          color: "#92400E",
          bgColor: "#FEF3C7",
          dotColor: "#B45309",
          icon: <Clock size={24} color="#F59E0B" />,
        };
      case "failed":
        return {
          label: "Failed",
          color: "#991B1B",
          bgColor: "#FEE2E2",
          dotColor: "#B91C1C",
          icon: null,
        };
      default:
        return {
          label: status,
          color: "#1F2937",
          bgColor: "#F3F4F6",
          dotColor: "#374151",
          icon: null,
        };
    }
  };

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title="Adoption View" />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const { icon: footerIcon } = statusInfo;

  return (
    <View style={styles.container}>
      <Header title="Adoption View" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CustomerInfo order={order} user={user} statusInfo={statusInfo} />

        <AdoptionPetList items={order.items} />

        <AdoptionOrderSummary order={order} />

        {footerIcon && (
          <AdoptionOrderFooter
            statusLabel={statusInfo.label}
            footerIcon={footerIcon}
          />
        )}
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
    paddingBottom: 80, // High to clear bar
  },
});
