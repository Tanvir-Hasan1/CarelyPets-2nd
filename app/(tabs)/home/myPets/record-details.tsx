import { usePetStore } from "@/store/usePetStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import HealthRecordDetailsScreen from "./HealthRecordDetailsScreen";

export default function HealthRecordDetailsRoute() {
    const { petId, recordId } = useLocalSearchParams<{ petId: string, recordId: string }>();
    const { pets } = usePetStore();

    const pet = pets.find(p => p.id === petId);
    const record = pet?.healthRecords?.find(r => r.id === recordId);

    if (!pet || !record) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text>Record not found.</Text>
            </View>
        );
    }

    return <HealthRecordDetailsScreen pet={pet} record={record} />;
}
