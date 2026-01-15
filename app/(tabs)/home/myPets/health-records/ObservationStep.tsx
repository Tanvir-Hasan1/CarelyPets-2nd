import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/colors";
import {
  Add01Icon,
  Cancel01Icon,
  PointingLeft01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ObservationStepProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

export default function ObservationStep({
  data,
  updateData,
}: ObservationStepProps) {
  const [newObservation, setNewObservation] = useState("");
  const observations = data.observations || [];

  const handleAddObservation = () => {
    if (newObservation.trim()) {
      const updatedObservations = [...observations, newObservation.trim()];
      updateData("observations", updatedObservations);
      setNewObservation("");
    }
  };

  const handleRemoveObservation = (index: number) => {
    const updatedObservations = observations.filter(
      (_: string, i: number) => i !== index
    );
    updateData("observations", updatedObservations);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Observation</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>LOOKUP/OBSERVATIONS</Text>
        <View style={styles.addHandlerContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Write symptom and press add"
            placeholderTextColor="#999"
            value={newObservation}
            onChangeText={setNewObservation}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddObservation}
          >
            <HugeiconsIcon icon={Add01Icon} size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.observationsList}>
        {observations.map((obs: string, index: number) => (
          <View key={index} style={styles.observationItem}>
            <View style={styles.observationLeft}>
              <View style={styles.iconCircle}>
                <HugeiconsIcon
                  icon={PointingLeft01Icon}
                  size={16}
                  color={Colors.textSecondary}
                />
              </View>
              <Text style={styles.observationText}>{obs}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveObservation(index)}>
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CLINICAL NOTES</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Add any additional notes or observations..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={data.clinicalNotes}
          onChangeText={(text) => updateData("clinicalNotes", text)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  addHandlerContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  addButton: {
    backgroundColor: "#B2EBF2", // Light cyan
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  observationsList: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  observationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: Spacing.sm,
    borderRadius: BorderRadius.full, // Pill shape
    paddingHorizontal: Spacing.md,
  },
  observationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  observationText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  textArea: {
    backgroundColor: "#F5F5F5",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: FontSizes.sm,
    color: Colors.text,
    minHeight: 120,
  },
});
