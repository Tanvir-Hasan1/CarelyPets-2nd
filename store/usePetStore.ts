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
}

export const usePetStore = create<PetState>((set) => ({
    pets: [],
    addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
}));
