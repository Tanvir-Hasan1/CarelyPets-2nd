import { useLocalSearchParams } from "expo-router";
import React from "react";
import PetDetailsScreen from "./PetDetailsScreen";

export default function PetDetailsRoute() {
    const { id } = useLocalSearchParams();
    return <PetDetailsScreen id={id as string} />;
}
