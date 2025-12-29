import KnowMeScreen from "@/screens/tabs/KnowMeScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function PetAdoptionDetailRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <KnowMeScreen id={id} />;
}
