import PetDetailsScreen from "@/components/pets/PetDetailsScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function PetDetailsRoute() {
  const { id } = useLocalSearchParams();
  return <PetDetailsScreen id={id as string} />;
}
