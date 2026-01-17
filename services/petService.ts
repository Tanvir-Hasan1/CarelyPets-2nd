/**
 * Pet Service
 * API endpoints for pet and health record operations.
 */

import { HealthRecord, Pet } from '@/store/usePetStore';
import api from './api';

// API Response types
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Pet Service Functions
export const petService = {
    /**
     * Get all pets for the current user
     */
    async getPets(): Promise<Pet[]> {
        const response = await api.get<ApiResponse<Pet[]>>('/pets');
        return response.data;
    },

    /**
     * Get a single pet by ID
     */
    async getPetById(petId: string): Promise<Pet> {
        const response = await api.get<ApiResponse<Pet>>(`/pets/${petId}`);
        return response.data;
    },

    /**
     * Create a new pet
     */
    async createPet(petData: FormData): Promise<Pet> {
        const response = await api.post<ApiResponse<Pet>>('/pets', petData);
        return response.data;
    },

    /**
     * Update an existing pet
     */
    async updatePet(petId: string, pet: FormData | Partial<Pet>): Promise<Pet> {
        // Use a longer timeout for file uploads (60 seconds instead of default 30)
        const isFormData = pet instanceof FormData;
        const options = isFormData ? { timeout: 60000 } : undefined;
        
        const response = await api.patch<ApiResponse<Pet>>(`/pets/${petId}`, pet, options);
        return response.data;
    },

    /**
     * Delete a pet
     */
    async deletePet(petId: string): Promise<void> {
        await api.delete<ApiResponse<null>>(`/pets/${petId}`);
    },

    // Health Record Operations

    /**
     * Get all health records for a pet
     */
    async getHealthRecords(petId: string): Promise<HealthRecord[]> {
        const response = await api.get<ApiResponse<HealthRecord[]>>(`/pets/${petId}/health-records`);
        return response.data;
    },

    /**
     * Get health records by type
     */
    async getHealthRecordsByType(petId: string, type: string): Promise<HealthRecord[]> {
        const response = await api.get<ApiResponse<HealthRecord[]>>(`/pets/${petId}/health-records?type=${type}`);
        return response.data;
    },

    /**
     * Get a single health record
     */
    async getHealthRecordById(petId: string, recordId: string): Promise<HealthRecord> {
        const response = await api.get<ApiResponse<HealthRecord>>(`/pets/${petId}/health-records/${recordId}`);
        return response.data;
    },

    /**
     * Create a new health record
     */
    /**
     * Create a new health record
     */
    async createHealthRecord(petId: string, type: string, recordData: FormData): Promise<HealthRecord> {
        const response = await api.post<ApiResponse<HealthRecord>>(`/pets/${petId}/health-records/${type}`, recordData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // Increase timeout for file uploads
        });
        return response.data;
    },

    /**
     * Update an existing health record
     */
    async updateHealthRecord(petId: string, recordId: string, record: Partial<HealthRecord>): Promise<HealthRecord> {
        const response = await api.put<ApiResponse<HealthRecord>>(`/pets/${petId}/health-records/${recordId}`, record);
        return response.data;
    },

    /**
     * Delete a health record
     */
    async deleteHealthRecord(petId: string, recordId: string): Promise<void> {
        await api.delete<ApiResponse<null>>(`/pets/${petId}/health-records/${recordId}`);
    },
};

export default petService;
