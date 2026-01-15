import Header from "@/components/ui/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { HealthRecord, Pet, usePetStore } from "@/store/usePetStore";
import {
  BandageIcon,
  Bug02Icon,
  Cancel01Icon,
  DentalToothIcon,
  Edit02Icon,
  InjectionIcon,
  Medicine01Icon,
  Note01Icon,
  Stethoscope02Icon, // Proxy for Resp if Lungs not available
  ViewIcon,
} from "@hugeicons/core-free-icons";

import HeartBeatIcon from "@/assets/images/icons/heart-beat.svg";
import LungIcon from "@/assets/images/icons/lung.svg";
import TemperatureIcon from "@/assets/images/icons/temperature.svg";
import WeightIcon from "@/assets/images/icons/weight.svg";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  pet: Pet;
  record: HealthRecord;
}

export default function HealthRecordDetailsScreen({ pet, record }: Props) {
  const router = useRouter();
  const { deleteHealthRecord } = usePetStore();
  const [viewedImage, setViewedImage] = useState<string | null>(null);

  const getIconForType = (type: string) => {
    switch (type?.toLowerCase()) {
      case "vaccination":
        return InjectionIcon;
      case "checkup":
        return Stethoscope02Icon;
      case "medication":
        return Medicine01Icon;
      case "tick":
        return Bug02Icon;
      case "surgery":
        return BandageIcon;
      case "dental":
        return DentalToothIcon;
      default:
        return Note01Icon;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteHealthRecord(pet.id, record.id);
            router.back();
          },
        },
      ]
    );
  };

  const SectionLabel = ({ title }: { title: string }) => (
    <Text style={styles.sectionLabel}>{title}</Text>
  );

  const DataRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
  }) => (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value || "-"}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["right", "left", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />

      {/* Header */}
      <Header title="View Records" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Info Card */}
        <View style={styles.petCard}>
          <Image
            source={{
              uri:
                pet.image ||
                "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
            }}
            style={styles.petImage}
          />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(tabs)/home/myPets/add-health-record",
                params: {
                  petId: pet.id,
                  recordId: record.id,
                },
              });
            }}
          >
            <HugeiconsIcon icon={Edit02Icon} size={20} color="#00BCD4" />
          </TouchableOpacity>
        </View>

        {/* Record Header Card */}
        <View style={styles.card}>
          <View style={styles.recordHeader}>
            <View style={styles.iconCircle}>
              <HugeiconsIcon
                icon={getIconForType(record.recordType)}
                size={24}
                color="#4CAF50"
              />
            </View>
            <View>
              <Text style={styles.recordTypeTitle}>{record.recordType}</Text>
              <Text style={styles.recordNameSubtitle}>{record.recordName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <DataRow label="RECORD NAME" value={record.recordName} />
          <View style={styles.divider} />
          <DataRow label="BATCH/LOT NO." value={record.batchNumber} />
          <View style={styles.divider} />
          <DataRow label="OTHER" value={record.otherInfo} />
          <View style={styles.divider} />
          <DataRow
            label="COST"
            value={record.cost ? `$${record.cost}` : undefined}
          />
          <View style={styles.divider} />
          <DataRow label="DATE" value={record.date} />
          <View style={styles.divider} />
          <DataRow label="DUE DATE" value={record.nextDueDate} />
          <View style={styles.divider} />

          <View style={styles.dataRow}>
            <Text style={[styles.dataLabel, { color: "#E53935" }]}>
              REMINDER
            </Text>
            <Text style={[styles.dataValue, { color: "#E53935" }]}>
              {record.reminderEnabled ? record.reminderDuration : "Off"}
            </Text>
          </View>
        </View>

        {/* Veterinarian Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Veterinarian Information</Text>
          <View style={styles.vetHeader}>
            <Text style={styles.vetName}>
              Dr. {record.vetName || "Unknown"}
            </Text>
            <Text style={styles.vetDesignation}>
              {record.vetDesignation || "Veterinarian"}
            </Text>
          </View>
          <View style={styles.vetDetailsRow}>
            <Text style={styles.vetLabel}>Clinic</Text>
            <Text style={styles.vetValue}>{record.clinicName || "-"}</Text>
          </View>
          <View style={styles.vetDetailsRow}>
            <Text style={styles.vetLabel}>License No.</Text>
            <Text style={styles.vetValue}>{record.licenseNumber || "-"}</Text>
          </View>
          <View style={styles.vetDetailsRow}>
            <Text style={styles.vetLabel}>Contact</Text>
            <Text style={styles.vetValue}>{record.vetContact || "-"}</Text>
          </View>
        </View>

        {/* Vital Signs Grid */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: Spacing.md }]}>
            Vital Signs
          </Text>
          <View style={styles.grid}>
            <View style={[styles.gridItem, { backgroundColor: "#FFEBEE" }]}>
              <TemperatureIcon width={40} height={40} color="#F44336" />
              <Text style={styles.gridLabel}>Temperature</Text>
              <Text style={styles.gridValue}>
                {record.temperature + "°C" || "-"}
              </Text>
              <Text style={[styles.gridStatus, { color: "#4CAF50" }]}>
                {record.temperatureStatus}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: "#FCE4EC" }]}>
              <HeartBeatIcon width={40} height={40} color="#E91E63" />
              <Text style={styles.gridLabel}>Heart Rate</Text>
              <Text style={styles.gridValue}>
                {record.heartRate + " bpm" || "-"}
              </Text>
              <Text style={[styles.gridStatus, { color: "#4CAF50" }]}>
                {record.heartRateStatus}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: "#E1F5FE" }]}>
              <LungIcon width={40} height={40} color="#039BE5" />
              <Text style={styles.gridLabel}>Respiratory</Text>
              <Text style={styles.gridValue}>
                {record.respiratoryRate + " rpm" || "-"}
              </Text>
              <Text style={[styles.gridStatus, { color: "#4CAF50" }]}>
                {record.respiratoryRateStatus}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: "#F3E5F5" }]}>
              <WeightIcon width={40} height={40} color="#9C27B0" />
              <Text style={styles.gridLabel}>Weight</Text>
              <Text style={styles.gridValue}>
                {record.weight + " lbs" || "-"}
              </Text>
              <Text style={[styles.gridStatus, { color: "#4CAF50" }]}>
                {record.weightStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Clinical Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clinical Notes</Text>
          <Text style={styles.notesText}>
            {record.clinicalNotes || "No notes provided."}{" "}
            <Text style={{ color: "#00BCD4", fontWeight: "bold" }}>
              ...See more
            </Text>
          </Text>
        </View>

        {/* Observations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lookup/Observations</Text>
          {record.observations && record.observations.length > 0 ? (
            record.observations.map((obs, index) => (
              <View key={index} style={styles.observationItem}>
                <HugeiconsIcon
                  icon={ViewIcon}
                  size={16}
                  color={Colors.textSecondary}
                />
                <Text style={styles.observationText}>{obs}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.notesText}>No observations recorded.</Text>
          )}
        </View>

        {/* Attachments */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attached Documents</Text>
          {record.attachments && record.attachments.length > 0 ? (
            record.attachments.map((file, index) => (
              <TouchableOpacity
                key={index}
                style={styles.fileItem}
                onPress={() => {
                  if (file.mimeType?.startsWith("image/")) {
                    setViewedImage(file.uri);
                  }
                }}
              >
                <View style={styles.fileIcon}>
                  <HugeiconsIcon icon={Note01Icon} size={20} color="#E91E63" />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>
                    {file.name || `File ${index + 1}`}
                  </Text>
                  <Text style={styles.fileSize}>
                    {file.mimeType
                      ? file.mimeType.split("/")[1].toUpperCase()
                      : "FILE"}{" "}
                    • {file.size ? (file.size / 1024).toFixed(0) + "KB" : "?"}
                  </Text>
                </View>
                <HugeiconsIcon
                  icon={ViewIcon}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.notesText}>No documents attached.</Text>
          )}
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Record</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Image Preview Modal */}
      {viewedImage && (
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.closePreview}
            onPress={() => setViewedImage(null)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={32} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: viewedImage }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      )}
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
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.md,
  },
  petInfo: {
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
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  recordTypeTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  recordNameSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: Spacing.sm,
  },
  dataRow: {
    marginBottom: Spacing.xs,
  },
  sectionLabel: {
    // unused?
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  dataLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dataValue: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  cardTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  vetHeader: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  vetName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  vetDesignation: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  vetDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  vetLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  vetValue: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: FontWeights.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  gridItem: {
    width: "47%", // Keep 47% but ensure justifyContent handles space betwen
    aspectRatio: 1, // Make squarish as per design
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  gridLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  gridValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
  },
  gridStatus: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
  },
  notesText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  observationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Light gray background
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  observationText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  fileIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#FFEBEE",
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.text,
  },
  fileSize: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  deleteButtonText: {
    color: Colors.text,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
  previewOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  closePreview: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  previewImage: {
    width: "90%",
    height: "80%",
  },
});
