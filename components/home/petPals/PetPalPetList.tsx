import { StyleSheet, View } from "react-native";
import PetPalPetCard from "./PetPalPetCard";

interface Pet {
  id: string;
  name: string;
  gender: "Male" | "Female";
  breed: string;
  age: string;
  image: string;
}

interface PetPalPetListProps {
  pets: Pet[];
  onPetPress?: (petId: string) => void;
}

const PetPalPetList = ({ pets, onPetPress }: PetPalPetListProps) => {
  return (
    <View style={styles.container}>
      {pets.map((pet) => (
        <PetPalPetCard
          key={pet.id}
          pet={pet}
          onPress={() => onPetPress?.(pet.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default PetPalPetList;
