import Header from "@/components/ui/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "@/constants/colors";
import { usePetStore } from "@/store/usePetStore";
import {
  BandageIcon,
  Bug02Icon,
  DentalToothIcon,
  InjectionIcon,
  Medicine01Icon,
  Note01Icon,
  Stethoscope02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AttachmentsStep from "./health-records/AttachmentsStep";
import ObservationStep from "./health-records/ObservationStep";
import RecordDetailsStep from "./health-records/RecordDetailsStep";
import VetInfoStep from "./health-records/VetInfoStep";
import VitalSignsStep from "./health-records/VitalSignsStep";

interface RecordType {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}

const RECORD_TYPES: RecordType[] = [
  {
    id: "vaccination",
    label: "Vaccination",
    icon: InjectionIcon,
    color: "#4CAF50",
    bgColor: "#E8F5E9",
  },
  {
    id: "checkup",
    label: "Check-up",
    icon: Stethoscope02Icon,
    color: "#2196F3",
    bgColor: "#E3F2FD",
  },
  {
    id: "medication",
    label: "Medication",
    icon: Medicine01Icon,
    color: "#F44336",
    bgColor: "#FFEBEE",
  },
  {
    id: "tick",
    label: "Tick",
    icon: Bug02Icon,
    color: "#9C27B0",
    bgColor: "#F3E5F5",
  },
  {
    id: "surgery",
    label: "Surgery",
    icon: BandageIcon,
    color: "#E91E63",
    bgColor: "#FCE4EC",
  },
  {
    id: "dental",
    label: "Dental",
    icon: DentalToothIcon,
    color: "#FF9800",
    bgColor: "#FFF3E0",
  },
  {
    id: "other",
    label: "Other",
    icon: Note01Icon,
    color: "#757575",
    bgColor: "#EEEEEE",
  },
];

const STEPS = [
  "RecordDetails",
  "VetInfo",
  "VitalSigns",
  "Observation",
  "Attachments",
];

export default function AddHealthRecordScreen() {
  const router = useRouter();
  const { petId, type, recordId } = useLocalSearchParams<{
    petId: string;
    type: string;
    recordId: string;
  }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    pets,
    addHealthRecord,
    updateHealthRecord,
    createHealthRecord,
    isLoading,
  } = usePetStore();

  // If type is passed, pre-select it and start at step 0
  const [selectedType, setSelectedType] = useState<string | null>(type || null);
  const [currentStepIndex, setCurrentStepIndex] = useState(type ? 0 : -1);

  const [formData, setFormData] = useState({
    // Record Details
    // recordType is derived from selectedType
    recordName: "",
    batchNumber: "",
    otherInfo: "",
    cost: "",
    date: "",
    nextDueDate: "",
    reminderEnabled: false,
    reminderDuration: "1 week",

    // Vet Info
    vetDesignation: "",
    vetName: "",
    clinicName: "",
    licenseNumber: "",
    vetContact: "",

    // Vital Signs
    weight: "",
    weightStatus: "Normal",
    temperature: "",
    temperatureStatus: "Normal",
    heartRate: "",
    heartRateStatus: "Normal",
    respiratoryRate: "",
    respiratoryRateStatus: "Normal",

    // Observation
    observations: [] as string[],
    clinicalNotes: "",

    // Attachments
    attachments: [] as any[],
  });

  const [deletedAttachments, setDeletedAttachments] = useState<string[]>([]);

  // Scroll to top when step changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [currentStepIndex]);

  // Helper to get label
  const getRecordTypeLabel = () => {
    const record = RECORD_TYPES.find((r) => r.id === selectedType);
    return record ? record.label : "";
  };

  const updateFormData = (key: string, value: any) => {
    if (key === "attachments" && recordId) {
      // If we are editing, track which existing attachments are being removed
      const removed = formData.attachments.filter(
        (a) => typeof a === "string" && !value.includes(a)
      );
      if (removed.length > 0) {
        console.log("[AddHealthRecord] Tracking deletions:", removed);
        setDeletedAttachments((prev) => [...prev, ...removed]);
      }
    }
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (recordId && petId) {
      const pet = pets.find((p) => p.id === petId);
      const record = pet?.healthRecords?.find(
        (r) => r._id === recordId || r.id === recordId
      );

      if (record) {
        // Pre-fill form
        setSelectedType(record.type?.toLowerCase());
        setCurrentStepIndex(0); // Go to first step directly

        setFormData({
          recordName: record.recordDetails?.recordName || "",
          batchNumber: record.recordDetails?.batchLotNo || "",
          otherInfo: record.recordDetails?.otherInfo || "",
          cost: record.recordDetails?.cost || "",
          date: record.recordDetails?.date || "",
          nextDueDate: record.recordDetails?.nextDueDate || "",
          reminderEnabled: record.recordDetails?.reminder?.enabled || false,
          reminderDuration: record.recordDetails?.reminder?.offset || "1 week",
          vetDesignation: record.veterinarian?.designation || "",
          vetName: record.veterinarian?.name || "",
          clinicName: record.veterinarian?.clinicName || "",
          licenseNumber: record.veterinarian?.licenseNo || "",
          vetContact: record.veterinarian?.contact || "",
          weight: record.vitalSigns?.weight || "",
          weightStatus: record.vitalSigns?.weightStatus || "Normal",
          temperature: record.vitalSigns?.temperature || "",
          temperatureStatus: record.vitalSigns?.temperatureStatus || "Normal",
          heartRate: record.vitalSigns?.heartRate || "",
          heartRateStatus: record.vitalSigns?.heartRateStatus || "Normal",
          respiratoryRate: record.vitalSigns?.respiratory || "", // map respiratory to respiratoryRate
          respiratoryRateStatus:
            record.vitalSigns?.respiratoryRateStatus || "Normal",
          observations: record.observation?.lookupObservations || [],
          clinicalNotes: record.observation?.clinicalNotes || "",
          attachments: record.attachments || [],
        });
      }
    }
  }, [recordId, petId, pets]);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (currentStepIndex === 0 && !type) {
      // If type wasn't passed initially, go back to selection
      setCurrentStepIndex(-1);
      setSelectedType(null);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!petId || !selectedType) return;

    // Construct nested objects
    const recordDetails = {
      recordName: formData.recordName,
      batchLotNo: formData.batchNumber,
      otherInfo: formData.otherInfo,
      cost: formData.cost,
      date: formData.date,
      nextDueDate: formData.nextDueDate,
      reminder: {
        enabled: formData.reminderEnabled,
        offset: formData.reminderDuration,
      },
    };

    const veterinarian = {
      designation: formData.vetDesignation,
      name: formData.vetName,
      clinicName: formData.clinicName,
      licenseNo: formData.licenseNumber,
      contact: formData.vetContact,
    };

    const vitalSigns = {
      weight: formData.weight,
      weightStatus: formData.weightStatus,
      temperature: formData.temperature,
      temperatureStatus: formData.temperatureStatus,
      heartRate: formData.heartRate,
      heartRateStatus: formData.heartRateStatus,
      respiratory: formData.respiratoryRate,
      respiratoryRate: formData.respiratoryRate,
      respiratoryRateStatus: formData.respiratoryRateStatus,
      status: "normal",
    };

    const observation = {
      lookupObservations: formData.observations,
      clinicalNotes: formData.clinicalNotes,
    };

    const data = new FormData();
    data.append("recordDetails", JSON.stringify(recordDetails));
    data.append("veterinarian", JSON.stringify(veterinarian));
    data.append("vitalSigns", JSON.stringify(vitalSigns));
    data.append("observation", JSON.stringify(observation));

    // Handle attachments
    formData.attachments.forEach((file: any) => {
      // Only append new files (non-string assets)
      if (file && typeof file !== "string") {
        // @ts-ignore
        data.append("files", {
          uri: file.uri,
          type: file.mimeType || "image/jpeg",
          name: file.name || "upload.jpg",
        });
      }
    });

    let result;
    if (recordId) {
      console.log(
        "[AddHealthRecord] Updating record via PATCH (FormData):",
        recordId
      );

      // Add deleteAttachments if we have any
      if (deletedAttachments.length > 0) {
        // The image shows it as a JSON string like ["url1", "url2"]
        data.append("deleteAttachments", JSON.stringify(deletedAttachments));
        console.log(
          "[AddHealthRecord] Sending deleteAttachments:",
          deletedAttachments
        );
      }

      result = await updateHealthRecord(petId, recordId, data);
    } else {
      // Determine API type (map UI "tick" to backend "tick-flea")
      const apiType = selectedType === "tick" ? "tick-flea" : selectedType;
      console.log(
        "[AddHealthRecord] Creating record via POST for type:",
        apiType
      );
      result = await createHealthRecord(petId, apiType, data);
    }

    if (result.success) {
      router.back();
    } else {
      Alert.alert("Error", result.message || "Failed to save record");
      console.error("Failed to save record:", result.message);
    }
  };

  const renderStepContent = () => {
    if (currentStepIndex === -1) {
      return (
        <>
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Add your pet's health record</Text>
            <Text style={styles.subtitle}>
              Select the type of health visit or record you'd like to log — from
              routine checkups to vaccinations, emergencies, and more.
            </Text>
          </View>

          <View style={styles.selectionCard}>
            <Text style={styles.cardTitle}>Select Record Type</Text>
            <View style={styles.grid}>
              {RECORD_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.gridItem}
                  onPress={() => setSelectedType(type.id)}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: type.bgColor },
                    ]}
                  >
                    <HugeiconsIcon
                      icon={type.icon}
                      size={24}
                      color={type.color}
                    />
                    {selectedType === type.id && (
                      <View style={styles.checkmarkContainer}>
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          size={20}
                          color="#4CAF50"
                          variant="solid"
                        />
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.gridLabel,
                      selectedType === type.id && {
                        color: type.color,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      );
    }

    const stepWrapper = (Component: React.ElementType, extraData: any = {}) => (
      <View style={styles.stepContainer}>
        <Component
          data={{ ...formData, ...extraData }}
          updateData={updateFormData}
        />
      </View>
    );

    switch (currentStepIndex) {
      case 0:
        return stepWrapper(RecordDetailsStep, {
          recordType: getRecordTypeLabel(),
        });
      case 1:
        return stepWrapper(VetInfoStep);
      case 2:
        return stepWrapper(VitalSignsStep);
      case 3:
        return stepWrapper(ObservationStep);
      case 4:
        return stepWrapper(AttachmentsStep);
      default:
        return null;
    }
  };

  const getProgressText = () => {
    if (currentStepIndex === -1) return "1 OUT OF 6"; // Including selection as step 1 logic-wise for user
    return `${currentStepIndex + 2} OUT OF 6`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["right", "left", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          {/* Header */}
          <Header title="Add Health Record" onBackPress={handleBack} />

          {/* Progress Indicator (Optional - simplistic text version) */}
          {selectedType && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{getProgressText()}</Text>
            </View>
          )}

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.content}
          >
            {renderStepContent()}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                disabled={isLoading}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.nextButton,
                  (currentStepIndex === -1 && !selectedType) || isLoading
                    ? styles.disabledButton
                    : null,
                ]}
                disabled={
                  (currentStepIndex === -1 && !selectedType) || isLoading
                }
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {isLoading
                    ? "Processing..."
                    : currentStepIndex === STEPS.length - 1
                    ? "Save"
                    : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressContainer: {
    alignItems: "flex-end",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    backgroundColor: "#F8F9FA",
  },
  progressText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  content: {
    padding: Spacing.lg,
  },
  stepContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  mainTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  selectionCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 0,
  },
  gridItem: {
    width: "25%", // 4 items per row
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
    position: "relative",
  },
  checkmarkContainer: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  gridLabel: {
    fontSize: 10,
    color: Colors.text,
    textAlign: "center",
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background, // Should match background for seamless look or stand out
  },
  footerButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  backButtonText: {
    color: Colors.text,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#00BCD4",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#B2EBF2", // Lighter cyan
  },
  nextButtonText: {
    color: "#ffffff",
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.md,
  },
});
