import PetDetailsScreen from "@/components/pets/PetDetailsScreen";
import { useLocalSearchParams } from "expo-router";

export default function PetDetailsRoute() {
  const { id } = useLocalSearchParams();
  return <PetDetailsScreen id={id as string} />;
}
