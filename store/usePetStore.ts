import { create } from 'zustand';

export interface Pet {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: string;
    weight: string;
    gender: 'Male' | 'Female';
    traits: string[];
    image?: string;
    about?: string;
    snaps: string[];
    trained: string;
    vaccinated: string;
    neutered: string;
}

interface PetState {
    pets: Pet[];
    addPet: (pet: Pet) => void;
    deletePet: (id: string) => void;
    updatePet: (pet: Pet) => void;
}

export const usePetStore = create<PetState>((set) => ({
    pets: [],
    addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
    deletePet: (id) => set((state) => ({ pets: state.pets.filter((p) => p.id !== id) })),
    updatePet: (pet) => set((state) => ({ pets: state.pets.map((p) => p.id === pet.id ? pet : p) })),
}));
