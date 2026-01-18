import petService from '@/services/petService';
import { create } from 'zustand';

export interface HealthRecord {
  _id: string; // Changed from id to _id
  id?: string; // keeping optional for backward compatibility if needed
  type: string;
  recordDetails: {
    recordName: string;
    batchLotNo?: string;
    otherInfo?: string;
    cost?: string;
    date: string;
    nextDueDate?: string;
    reminder: {
      enabled: boolean;
      offset: string;
    };
  };
  veterinarian: {
    designation: string;
    name: string;
    clinicName: string;
    licenseNo: string;
    contact: string;
  };
  vitalSigns: {
    respiratoryRate: string;
    weight: string;
    temperature: string;
    heartRate: string;
    respiratory: string;
    status: string;
    weightStatus?: string;
    temperatureStatus?: string;
    heartRateStatus?: string;
    respiratoryRateStatus?: string;
  };
  observation: {
    lookupObservations: string[];
    clinicalNotes: string;
  };
  attachments: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Pet {
    id: string;
    owner?: string;
    name: string;
    type: string;
    species?: string;
    breed: string;
    age: number;
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
    trained: boolean;
    vaccinated: boolean;
    neutered: boolean;
    status?: "Available" | "Adopted";
    healthRecords?: HealthRecord[];
    medicalRecords?: any[];
    createdAt?: string;
    updatedAt?: string;
}

interface PetState {
    pets: Pet[];
    isLoading: boolean;
    error: string | null;
    fetchPets: () => Promise<void>;
    fetchPetById: (id: string) => Promise<void>;
    fetchHealthRecordsByType: (petId: string, type: string) => Promise<void>;
    createPet: (formData: FormData) => Promise<{ success: boolean; message: string; data?: Pet }>;
    addPet: (pet: Pet) => void;
    deletePet: (id: string) => Promise<{ success: boolean; message: string }>;
    updatePet: (data: FormData | (Partial<Pet> & { id: string })) => Promise<{ success: boolean; message: string; data?: Pet }>;
    addHealthRecord: (petId: string, record: HealthRecord) => void;
    deleteHealthRecord: (petId: string, recordId: string) => Promise<{ success: boolean; message?: string }>;
    updateHealthRecord: (petId: string, record: HealthRecord) => void;
    createHealthRecord: (petId: string, type: string, formData: FormData) => Promise<{ success: boolean; message: string }>;
    setError: (error: string | null) => void;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export const usePetStore = create<PetState>()(
    persist(
        (set, get) => ({
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

            fetchHealthRecordsByType: async (petId: string, type: string) => {
                set({ isLoading: true, error: null });
                try {
                    const records = await petService.getHealthRecordsByType(petId, type);
                    set((state) => ({
                        pets: state.pets.map(p => 
                            p.id === petId 
                            ? { ...p, healthRecords: records }
                            : p
                        ),
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch health records', isLoading: false });
                }
            },

            fetchPetById: async (id: string) => {
                set({ isLoading: true, error: null });
                try {
                    const pet = await petService.getPetById(id);
                    set((state) => ({
                        pets: state.pets.find(p => p.id === id)
                            ? state.pets.map(p => p.id === id ? pet : p)
                            : [...state.pets, pet],
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch pet details', isLoading: false });
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

            deletePet: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await petService.deletePet(id);
                    set((state) => ({
                        pets: state.pets.filter((p) => p.id !== id),
                        isLoading: false
                    }));
                    return { success: true, message: 'Pet deleted successfully' };
                } catch (error: any) {
                    const message = error.message || 'Failed to delete pet';
                    set({ error: message, isLoading: false });
                    return { success: false, message };
                }
            },

            updatePet: async (data: FormData | (Partial<Pet> & { id: string })) => {
                set({ isLoading: true, error: null });
                try {
                    let petId: string;
                    let updateData: FormData | Partial<Pet>;

                    if (data instanceof FormData) {
                        // @ts-ignore - Access React Native FormData internal structure
                        const parts = data._parts || [];
                        
                        console.log('[usePetStore] FormData parts count:', parts.length);
                        console.log('[usePetStore] Looking for id field in FormData...');
                        
                        const idPart = parts.find(([key]: [string, any]) => key === 'id');
                        
                        if (!idPart) {
                            console.error('[usePetStore] Available FormData keys:', parts.map(([key]: [string, any]) => key));
                            throw new Error('Pet ID missing from update data. Make sure to append "id" to FormData.');
                        }
                        
                        petId = idPart[1];
                        console.log('[usePetStore] Extracted pet ID:', petId);
                        updateData = data;
                    } else {
                        petId = data.id;
                        updateData = data;
                    }

                    const updatedPet = await petService.updatePet(petId, updateData);
                    set((state) => ({
                        pets: state.pets.map((p) => p.id === petId ? updatedPet : p),
                        isLoading: false
                    }));
                    return { success: true, message: 'Pet updated successfully', data: updatedPet };
                } catch (error: any) {
                    const message = error.message || 'Failed to update pet';
                    console.error('[usePetStore] Update pet error:', error);
                    set({ error: message, isLoading: false });
                    return { success: false, message };
                }
            },
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
            deleteHealthRecord: async (petId, recordId) => {
                set({ isLoading: true, error: null });
                try {
                    await petService.deleteHealthRecord(petId, recordId);
                    set((state) => ({
                        pets: state.pets.map((p) =>
                            p.id === petId
                                ? { ...p, healthRecords: (p.healthRecords || []).filter((r) => r._id !== recordId && r.id !== recordId) }
                                : p
                        ),
                        isLoading: false
                    }));
                    return { success: true };
                } catch (error: any) {
                     const message = error.message || 'Failed to delete health record';
                     set({ error: message, isLoading: false });
                     return { success: false, message };
                }
            },
            createHealthRecord: async (petId: string, type: string, formData: FormData) => {
                set({ isLoading: true, error: null });
                try {
                    const newRecord = await petService.createHealthRecord(petId, type, formData);
                    set((state) => ({
                        pets: state.pets.map((p) =>
                            p.id === petId
                                ? { ...p, healthRecords: [...(p.healthRecords || []), newRecord] }
                                : p
                        ),
                        isLoading: false
                    }));
                    return { success: true, message: 'Health record added successfully' };
                } catch (error: any) {
                    const message = error.message || 'Failed to add health record';
                    set({ error: message, isLoading: false });
                    return { success: false, message };
                }
            },
            setError: (error) => set({ error }),
        }),
        {
            name: 'pet-storage', // unique name
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ pets: state.pets }), // only persist pets
        }
    )
);
