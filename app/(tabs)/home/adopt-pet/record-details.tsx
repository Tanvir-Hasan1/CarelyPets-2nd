import HealthRecordDetailsScreen from "@/app/(tabs)/home/myPets/HealthRecordDetailsScreen";
import { Colors } from "@/constants/colors";
import adoptionService, { AdoptionDetail } from "@/services/adoptionService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AdoptionRecordDetailsRoute() {
  const { id, recordId } = useLocalSearchParams<{
    id: string; // listing/pet ID
    recordId: string;
  }>();

  const [pet, setPet] = useState<AdoptionDetail | null>(null);
  const [record, setRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !recordId) return;

      try {
        setLoading(true);
        // Fetch pet details for the header info
        const petResponse = await adoptionService.getAdoptionDetails(id);

        // Fetch specific record details
        const recordResponse = await adoptionService.getHealthRecordDetails(
          id,
          recordId,
        );

        if (petResponse.success && recordResponse.success) {
          setPet(petResponse.data);

          // Map to match HealthRecord interface if needed, or pass as is if compatible
          // The backend response for getHealthRecordDetails needs to match what HealthRecordDetailsScreen expects
          setRecord(recordResponse.data);
        } else {
          setError("Failed to load details");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, recordId]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error || !pet || !record) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{error || "Record not found"}</Text>
      </View>
    );
  }

  // Adapter to convert AdoptionDetail (which has petName, petBreed) to Pet interface (name, breed)
  const petAdapter = {
    id: pet.id,
    name: pet.petName,
    breed: pet.petBreed,
    image: pet.photos?.[0] || pet.avatarUrl,
    avatarUrl: pet.avatarUrl,
    // Map other fields as necessary to silence TS errors if HealthRecordDetailsScreen is strict
    // Assuming minimal needed for header: name, breed, image.
    gender: pet.petGender, // casing might differ
    age: pet.petAge,
  } as any;

  return (
    <HealthRecordDetailsScreen
      pet={petAdapter}
      record={record}
      isReadOnly={true}
    />
  );
}
