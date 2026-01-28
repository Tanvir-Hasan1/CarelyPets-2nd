import Header from "@/components/ui/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import adoptionService, {
  AdoptionHealthRecord,
} from "@/services/adoptionService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdoptionHealthRecordsScreen() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const [records, setRecords] = useState<AdoptionHealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecords = async () => {
    if (!id || !type) return;
    try {
      const response = await adoptionService.getAdoptionHealthRecords(id, type);
      if (response.success) {
        setRecords(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch adoption health records", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [id, type]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecords();
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: AdoptionHealthRecord;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/home/adopt-pet/record-details",
          params: { id, recordId: item.id },
        })
      }
    >
      <View style={styles.indexCircle}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>

      <View style={styles.recordContent}>
        <Text style={styles.recordName}>
          {item.recordName || "Unnamed Record"}
        </Text>
        <Text style={styles.recordSubtitle}>
          Last updated {item.lastUpdated || "Unknown Date"}
          {item.reminder?.enabled && item.reminder.offset
            ? `, Reminder in ${item.reminder.offset}`
            : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const formatTitle = (str: string) => {
    if (!str) return "Records";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Header title={formatTitle(type)} />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={records}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No {type} records found.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: Spacing.lg,
  },
  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  indexCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  indexText: {
    color: "#4CAF50",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
  recordContent: {
    flex: 1,
    justifyContent: "center",
  },
  recordName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  recordSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
});
