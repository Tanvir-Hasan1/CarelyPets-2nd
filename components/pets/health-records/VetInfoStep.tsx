import { BorderRadius, Colors, FontSizes, Spacing } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface VetInfoStepProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

export default function VetInfoStep({ data, updateData }: VetInfoStepProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Veterinarian Information</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>DESIGNATION</Text>
                <TextInput
                    style={styles.input}
                    placeholder="DVM, Vetriniary Surgeon"
                    value={data.vetDesignation}
                    onChangeText={(text) => updateData('vetDesignation', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>NAME</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Veterinarian name"
                    value={data.vetName}
                    onChangeText={(text) => updateData('vetName', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>CLINIC NAME</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Clinic Name"
                    value={data.clinicName}
                    onChangeText={(text) => updateData('clinicName', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>LICENSE NO.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="License Number"
                    value={data.licenseNumber}
                    onChangeText={(text) => updateData('licenseNumber', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>CONTACT</Text>
                <TextInput
                    style={styles.input}
                    placeholder="5551234567"
                    keyboardType="phone-pad"
                    value={data.vetContact}
                    onChangeText={(text) => updateData('vetContact', text)}
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
        fontWeight: 'bold',
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
    }
});
