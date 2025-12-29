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
    status?: "Available" | "Adopted";
    healthRecords: HealthRecord[];
}

interface PetState {
    pets: Pet[];
    addPet: (pet: Pet) => void;
    deletePet: (id: string) => void;
    updatePet: (pet: Pet) => void;
    addHealthRecord: (petId: string, record: HealthRecord) => void;
    deleteHealthRecord: (petId: string, recordId: string) => void;
    updateHealthRecord: (petId: string, record: HealthRecord) => void;
}

export const usePetStore = create<PetState>((set) => ({
    pets: [],
    addPet: (pet) => set((state) => ({ pets: [...state.pets, { ...pet, healthRecords: [] }] })),
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
                    healthRecords: p.healthRecords.map((r) =>
                        r.id === updatedRecord.id ? updatedRecord : r
                    )
                }
                : p
        )
    })),
    deleteHealthRecord: (petId, recordId) => set((state) => ({
        pets: state.pets.map((p) =>
            p.id === petId
                ? { ...p, healthRecords: p.healthRecords.filter((r) => r.id !== recordId) }
                : p
        )
    })),
}));
