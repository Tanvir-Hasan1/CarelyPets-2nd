import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/colors";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface VitalSignsStepProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const Dropdown = ({ label, onSelect }: { label: string, onSelect: (value: string) => void }) => {
    const [visible, setVisible] = useState(false);
    const options = ['Normal', 'Abnormal'];

    return (
        <>
            <TouchableOpacity onPress={() => setVisible(true)} style={styles.dropdownContainer}>
                <Text style={styles.dropdownText}>{label}</Text>
                <HugeiconsIcon icon={ArrowDown01Icon} size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Status</Text>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.optionItem}
                                onPress={() => {
                                    onSelect(option);
                                    setVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    label === option && styles.selectedOptionText
                                ]}>{option}</Text>
                                {label === option && (
                                    <HugeiconsIcon icon={Tick02Icon} size={20} color={Colors.primary} variant="solid" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

export default function VitalSignsStep({ data, updateData }: VitalSignsStepProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Vital Signs</Text>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>WEIGHT AT TIME (lbs)</Text>
                    <TextInput
                         style={styles.input}
                         placeholder="0.0"
                         keyboardType="numeric"
                         value={data.weight}
                         onChangeText={(text) => updateData('weight', text)}
                    />
                </View>
                <View style={[styles.inputContainer, { marginTop: 24 }]}>
                     <Dropdown 
                        label={data.weightStatus || 'Normal'} 
                        onSelect={(val) => updateData('weightStatus', val)} 
                     />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>TEMPERATURE (C)</Text>
                    <TextInput
                         style={styles.input}
                         placeholder="0.0"
                         keyboardType="numeric"
                         value={data.temperature}
                         onChangeText={(text) => updateData('temperature', text)}
                    />
                </View>
                 <View style={[styles.inputContainer, { marginTop: 24 }]}>
                     <Dropdown 
                        label={data.temperatureStatus || 'Normal'} 
                        onSelect={(val) => updateData('temperatureStatus', val)} 
                     />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>HEART RATE (bpm)</Text>
                    <TextInput
                         style={styles.input}
                         placeholder="0.0"
                         keyboardType="numeric"
                         value={data.heartRate}
                         onChangeText={(text) => updateData('heartRate', text)}
                    />
                </View>
                 <View style={[styles.inputContainer, { marginTop: 24 }]}>
                     <Dropdown 
                        label={data.heartRateStatus || 'Normal'} 
                        onSelect={(val) => updateData('heartRateStatus', val)} 
                     />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>RESPIRATORY (Rpm)</Text>
                    <TextInput
                         style={styles.input}
                         placeholder="0.0"
                         keyboardType="numeric"
                         value={data.respiratoryRate}
                         onChangeText={(text) => updateData('respiratoryRate', text)}
                    />
                </View>
                 <View style={[styles.inputContainer, { marginTop: 24 }]}>
                     <Dropdown 
                        label={data.respiratoryRateStatus || 'Normal'} 
                        onSelect={(val) => updateData('respiratoryRateStatus', val)} 
                     />
                </View>
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
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    row: {
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xs,
    },
    inputContainer: {
        justifyContent: 'space-between',
        flex: 1,
    },
    label: {
        fontSize: FontSizes.xs,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
        textTransform: 'uppercase',
        fontWeight: '600'
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    dropdownContainer: {
         backgroundColor: '#F5F5F5',
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        width: '80%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: FontSizes.md,
        fontWeight: 'bold',
        marginBottom: Spacing.lg,
        textAlign: 'center',
        color: Colors.text,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    optionText: {
        fontSize: FontSizes.sm,
        color: Colors.text,
    },
    selectedOptionText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
});
