import Header from "@/components/ui/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { usePetStore } from "@/store/usePetStore";
import { ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HealthRecordsListScreen() {
  const router = useRouter();
  const { petId, recordType } = useLocalSearchParams<{
    petId: string;
    recordType: string;
  }>();
  const { pets } = usePetStore();

  const pet = pets.find((p) => p.id === petId);
  const records =
    pet?.healthRecords?.filter((r) => r.recordType === recordType) || [];

  // Log records on mount
  React.useEffect(() => {
    console.log(
      `[HealthRecordsList] Loaded ${recordType} records:`,
      JSON.stringify(records, null, 2)
    );
  }, [records, recordType]);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/home/myPets/record-details",
          params: { petId, recordId: item.id },
        })
      }
    >
      <View style={styles.indexCircle}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>

      <View style={styles.recordContent}>
        <Text style={styles.recordName}>{item.recordName}</Text>
        <Text style={styles.recordSubtitle}>
          Last updated {item.date}{" "}
          {item.reminderEnabled ? `, Reminder in ${item.reminderDuration}` : ""}
        </Text>
      </View>

      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={24}
        color={Colors.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["right", "left", "bottom"]}>
      <Header title={recordType || "Records"} />

      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {recordType} records found.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/home/myPets/add-health-record",
              params: {
                petId,
                type: recordType?.toLowerCase().replace(/[^a-z0-9]/g, ""),
              },
            })
          }
        >
          <HugeiconsIcon icon={PlusSignIcon} size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add new {recordType}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: "#F8F9FA",
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: "#006064",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: Colors.border,
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
  footer: {
    padding: Spacing.lg,
    marginBottom: 60,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BCD4",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
});
