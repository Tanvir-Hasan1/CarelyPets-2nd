import { usePetStore } from "@/store/usePetStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import EditPetScreen from "../EditPetScreen";

export default function EditPetRoute() {
    const { id } = useLocalSearchParams();
    const petId = Array.isArray(id) ? id[0] : id;
    const pet = usePetStore((state) => state.pets.find((p) => p.id === petId));

    if (!pet) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Pet not found (ID: {petId})</Text>
            </View>
        );
    }

    return <EditPetScreen initialData={pet} />;
}
