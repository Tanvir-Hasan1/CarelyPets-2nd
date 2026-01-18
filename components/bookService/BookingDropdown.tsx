import { Colors, FontSizes, Spacing } from "@/constants/colors";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BookingDropdownProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (value: string) => void;
}

export default function BookingDropdown({
  label,
  options,
  selectedOption,
  onSelect,
}: BookingDropdownProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.dropdownContainer}
      >
        <Text style={styles.dropdownText}>{selectedOption || label}</Text>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={18}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionItem}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
                {selectedOption === option && (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={20}
                    color={Colors.primary}
                    variant="solid"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: Spacing.lg,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    marginBottom: Spacing.lg,
    textAlign: "center",
    color: Colors.text,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  optionText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});
