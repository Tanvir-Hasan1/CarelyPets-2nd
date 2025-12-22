import React from 'react';
import { StyleSheet, View } from 'react-native';
import PetPalPetCard from './PetPalPetCard';

interface Pet {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
    breed: string;
    age: string;
    image: string;
}

interface PetPalPetListProps {
    pets: Pet[];
}

const PetPalPetList = ({ pets }: PetPalPetListProps) => {
    return (
        <View style={styles.container}>
            {pets.map((pet) => (
                <PetPalPetCard key={pet.id} pet={pet} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});

export default PetPalPetList;
