import Header from "@/components/ui/Header";
import LoadingModal from "@/components/ui/LoadingModal";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import adoptionService from "@/services/adoptionService";
import { useAuthStore } from "@/store/useAuthStore";
import { useBasketStore } from "@/store/useBasketStore";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BasketScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, loading, fetchBasket, removeFromBasket } = useBasketStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    fetchBasket();
  }, []);

  const handleRemove = async (id: string) => {
    await removeFromBasket(id);
  };

  const onRefresh = async () => {
    await fetchBasket();
    const currentItems = useBasketStore.getState().items;
    console.log("Basket Information:", JSON.stringify(currentItems, null, 2));
  };

  const handleCheckout = async () => {
    if (!user?.address || !user?.phone) {
      Alert.alert(
        "Missing Information",
        "Please add your address and phone number before checking out.",
      );
      return;
    }

    setIsProcessing(true);
    setError(undefined);

    try {
      const payload = {
        listingIds: items.map((item) => item.listingId),
        customer: {
          name: user.name || "User",
          address: user.address,
          phone: user.phone,
        },
      };

      const response = await adoptionService.createCheckoutSession(payload);

      if (response.success) {
        router.push({
          pathname: "/checkout",
          params: {
            clientSecret: response.data.clientSecret,
            orderId: response.data.orderId,
            subtotal: response.data.subtotal,
            taxAmount: response.data.taxAmount,
            processingFee: response.data.processingFee,
            shippingFee: response.data.shippingFee,
            total: response.data.total,
          },
        });
      } else {
        setError(response.message || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.avatarUrl ||
            "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
        }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.cardContent}>
        <View style={styles.detailsColumn}>
          <Text style={styles.petName}>{item.petName}</Text>
          <Text style={styles.petBreed}>{item.petBreed}</Text>
        </View>

        <View style={styles.priceColumn}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${item.price.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item.listingId)}
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="My Basket" showBasket={false} />

        {loading && items.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : items.length > 0 ? (
          <View style={{ flex: 1 }}>
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>List of pets for adoption</Text>
              <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.listingId}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={onRefresh}
                    colors={[Colors.primary]}
                  />
                }
              />
            </View>

            <View style={styles.customerInfoContainer}>
              <Text style={styles.sectionTitle}>Customer Information</Text>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>NAME</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.inputText}>
                    {user?.name || "John Doe"}
                  </Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>ADDRESS</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.inputText}>
                    {user?.address || "No address provided"}
                  </Text>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>PHONE NO.</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.inputText}>
                    {user?.phone || "No phone number"}
                  </Text>
                </View>
              </View>

              <Text style={styles.deliveryNote}>
                *Pet will be delivered to your home
              </Text>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.checkoutText}>Checkout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your basket is empty.</Text>
            <Link href="/(tabs)/home/adopt-pet" asChild>
              <TouchableOpacity style={styles.browseButton}>
                <Text style={styles.browseButtonText}>Browse Pets</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}

        <LoadingModal
          visible={isProcessing || !!error}
          message="Creating checkout session..."
          failed={!!error}
          error={error}
          onClose={() => {
            setError(undefined);
            setIsProcessing(false);
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  listTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.md,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circle as in mockup
    backgroundColor: "#F5F5F5",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    marginLeft: Spacing.md,
    justifyContent: "space-between",
  },
  detailsColumn: {
    justifyContent: "center",
    flex: 1,
  },
  petName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  petBreed: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priceColumn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "bold",
  },
  priceValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  removeButton: {
    padding: 4,
  },
  customerInfoContainer: {
    backgroundColor: "#FFFFFF",
    padding: Spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Add shadow/elevation to make it pop like a bottom sheet
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: Spacing.xs,
  },
  inputBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  inputText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  deliveryNote: {
    fontSize: 12,
    color: "#E53935",
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  checkoutButton: {
    backgroundColor: "#00BCD4",
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  browseButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontWeight: FontWeights.bold,
  },
});
