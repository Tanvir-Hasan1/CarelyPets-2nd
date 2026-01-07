import petService from '@/services/petService';
import { create } from 'zustand';

export interface HealthRecord {
    id: string;
    recordType: string;
    recordName: string;
    batchNumber: string;
    otherInfo: string;
    cost: string;
    date: string;
    nextDueDate: string;
    reminderEnabled: boolean;
    reminderDuration: string;
    vetDesignation: string;
    vetName: string;
    clinicName: string;
    licenseNumber: string;
    vetContact: string;
    weight: string;
    weightStatus: string;
    temperature: string;
    temperatureStatus: string;
    heartRate: string;
    heartRateStatus: string;
    respiratoryRate: string;
    respiratoryRateStatus: string;
    observations: string[];
    clinicalNotes: string;
    attachments: any[];
}

export interface Pet {
    id: string;
    owner?: string;
    name: string;
    type: string;
    species?: string;
    breed: string;
    age: string | number;
    weight?: string;
    weightLbs?: number;
    gender: 'Male' | 'Female' | 'male' | 'female';
    traits?: string[];
    personality?: string[];
    image?: string;
    avatarUrl?: string;
    about?: string;
    bio?: string;
    snaps?: string[];
    photos?: string[];
    trained: string | boolean;
    vaccinated: string | boolean;
    neutered: string | boolean;
    status?: "Available" | "Adopted";
    healthRecords?: HealthRecord[];
    createdAt?: string;
    updatedAt?: string;
}

interface PetState {
    pets: Pet[];
    isLoading: boolean;
    error: string | null;
    fetchPets: () => Promise<void>;
    createPet: (formData: FormData) => Promise<{ success: boolean; message: string; data?: Pet }>;
    addPet: (pet: Pet) => void;
    deletePet: (id: string) => void;
    updatePet: (pet: Pet) => void;
    addHealthRecord: (petId: string, record: HealthRecord) => void;
    deleteHealthRecord: (petId: string, recordId: string) => void;
    updateHealthRecord: (petId: string, record: HealthRecord) => void;
    setError: (error: string | null) => void;
}

export const usePetStore = create<PetState>((set, get) => ({
    pets: [],
    isLoading: false,
    error: null,

    fetchPets: async () => {
        set({ isLoading: true, error: null });
        try {
            const pets = await petService.getPets();
            set({ pets, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch pets', isLoading: false });
        }
    },

    createPet: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const pet = await petService.createPet(formData);
            set((state) => ({
                pets: [...state.pets, pet],
                isLoading: false
            }));
            return { success: true, message: 'Pet created successfully', data: pet };
        } catch (error: any) {
            const message = error.message || 'Failed to create pet';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    addPet: (pet) => set((state) => ({ pets: [...state.pets, { ...pet, healthRecords: pet.healthRecords || [] }] })),
    deletePet: (id) => set((state) => ({ pets: state.pets.filter((p) => p.id !== id) })),
    updatePet: (pet) => set((state) => ({
        pets: state.pets.map((p) => p.id === pet.id ? { ...pet, healthRecords: p.healthRecords } : p)
    })),
    addHealthRecord: (petId, record) => set((state) => ({
        pets: state.pets.map((p) =>
            p.id === petId
                ? { ...p, healthRecords: [...(p.healthRecords || []), record] }
                : p
        )
    })),
    updateHealthRecord: (petId, updatedRecord) => set((state) => ({
        pets: state.pets.map((p) =>
            p.id === petId
                ? {
                    ...p,
                    healthRecords: (p.healthRecords || []).map((r) =>
                        r.id === updatedRecord.id ? updatedRecord : r
                    )
                }
                : p
        )
    })),
    deleteHealthRecord: (petId, recordId) => set((state) => ({
        pets: state.pets.map((p) =>
            p.id === petId
                ? { ...p, healthRecords: (p.healthRecords || []).filter((r) => r.id !== recordId) }
                : p
        )
    })),
    setError: (error) => set({ error }),
}));
