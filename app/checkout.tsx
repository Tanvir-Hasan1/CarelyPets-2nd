import CountrySelectModal from "@/components/ui/CountrySelectModal";
import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import { BasketItem } from "@/services/adoptionService";
import { useAuthStore } from "@/store/useAuthStore";
import { useBasketStore } from "@/store/useBasketStore";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuthStore();
  const { items, reset } = useBasketStore();
  const { confirmPayment } = useConfirmPayment();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [paymentError, setPaymentError] = useState<string | undefined>();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const [cardName, setCardName] = useState(user?.name || "");
  const [isCardComplete, setIsCardComplete] = useState(false);

  // Params from Basket Screen
  const clientSecret = params.clientSecret as string;
  const orderId = params.orderId as string;

  const subtotal = params.subtotal
    ? parseFloat(params.subtotal as string)
    : items.reduce((sum: number, item: BasketItem) => sum + item.price, 0);
  const taxAmount = params.taxAmount
    ? parseFloat(params.taxAmount as string)
    : 0;
  const processingFee = params.processingFee
    ? parseFloat(params.processingFee as string)
    : 0;
  const shippingFee = params.shippingFee
    ? parseFloat(params.shippingFee as string)
    : 0;
  const total = params.total
    ? parseFloat(params.total as string)
    : subtotal + taxAmount + processingFee + shippingFee;

  const handlePayment = async () => {
    // Basic validation
    if (!isCardComplete) {
      Alert.alert("Error", "Please enter complete card details");
      return;
    }

    setIsProcessing(true);
    setPaymentError(undefined);

    try {
      // 2. Confirm Payment with Stripe
      if (!clientSecret) {
        throw new Error("Missing payment information from server.");
      }

      let paymentSuccess = false;

      if (clientSecret.includes("mock") || clientSecret.includes("pi_mock")) {
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));
        paymentSuccess = true;
      } else {
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              name: cardName || user?.name || "User",
              phone: user?.phone,
              email: user?.email,
              address: {
                city: user?.location?.city || "New York",
                country: "US", // In real app, map selectedCountry to ISO code
                line1: user?.address || "123 Street",
                postalCode: "10001",
                state: "NY",
              },
            },
          },
        });

        if (paymentIntent) {
          console.log(
            "Payment Confirmed:",
            JSON.stringify(paymentIntent, null, 2),
          );
          paymentSuccess = true;
        }

        if (error) {
          setPaymentError(error.message);
          setIsProcessing(false);
          return;
        }
      }

      if (paymentSuccess) {
        setIsPaymentSuccess(true);
        setTimeout(() => {
          setIsProcessing(false);
          setIsPaymentSuccess(false);
          reset(); // Clear basket
          router.dismissAll();
          router.replace("/(tabs)/home");
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      setPaymentError(error.message || "An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Checkout" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Customer Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Information</Text>

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

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>

          {items.map((item) => (
            <View key={item.listingId} style={styles.summaryItem}>
              <View>
                <Text style={styles.itemName}>{item.petName}</Text>
                <Text style={styles.itemBreed}>{item.petBreed}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}

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
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Processing Fee</Text>
            <Text style={styles.summaryValue}>${processingFee.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.summaryValue}>${shippingFee.toFixed(2)}</Text>
          </View>

          {taxAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${taxAmount.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CARD DETAILS</Text>
            <CardField
              postalCodeEnabled={true}
              placeholders={{
                number: "1111 2222 3333 4444",
              }}
              cardStyle={{
                backgroundColor: "#F9FAFB",
                textColor: "#111827",
                placeholderColor: "#9CA3AF",
                borderRadius: 12,
              }}
              style={styles.cardField}
              onCardChange={(cardDetails) => {
                setIsCardComplete(cardDetails.complete);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>NAME ON CARD</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              value={cardName}
              onChangeText={setCardName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>COUNTRY</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setIsCountryModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedCountry}</Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <CountrySelectModal
          visible={isCountryModalVisible}
          onClose={() => setIsCountryModalVisible(false)}
          onSelect={setSelectedCountry}
          selectedCountry={selectedCountry}
        />

        <LoadingModal
          visible={isProcessing || !!paymentError}
          message="Processing your adoption..."
          success={isPaymentSuccess}
          successMessage="Payment Successful!"
          failed={!!paymentError}
          error={paymentError}
          onClose={() => {
            setPaymentError(undefined);
            setIsProcessing(false);
          }}
        />

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!isCardComplete || !cardName || !selectedCountry) &&
              styles.disabledButton,
          ]}
          onPress={handlePayment}
          disabled={
            isProcessing || !isCardComplete || !cardName || !selectedCountry
          }
        >
          <Text style={styles.confirmButtonText}>
            {isProcessing ? "Processing..." : "Confirm & Pay"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingBottom: 40,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  itemBreed: {
    fontSize: 14,
    color: "#6B7280",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownText: {
    fontSize: 16,
    color: "#111827",
  },
  confirmButton: {
    backgroundColor: "#00BCD4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardField: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabledButton: {
    backgroundColor: "#B0BEC5", // Greyed out color
    opacity: 0.7,
  },
});
