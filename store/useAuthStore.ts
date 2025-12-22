/**
 * Auth Store
 * Global authentication state management using Zustand.
 */

import authService, { CompleteProfileData, User } from '@/services/authService';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setupToken: string | null;

    // Actions
    login: (email: string, password: string) => Promise<{ success: boolean; needsProfileSetup?: boolean }>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; needsProfileSetup: boolean }>;
    completeProfile: (data: CompleteProfileData) => Promise<boolean>;
    logout: () => Promise<void>;
    initializeAuth: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<boolean>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    setupToken: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authService.login({ email, password });

            if (response.success && response.data) {
                const needsProfileSetup = response.data.needsProfileSetup || false;
                const setupToken = response.data.setupToken || null;

                if ((needsProfileSetup || response.message === "Profile setup required") && setupToken) {
                    set({
                        setupToken,
                        isLoading: false,
                        error: null,
                    });
                    return { success: true, needsProfileSetup: true };
                }

                set({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                return { success: true, needsProfileSetup: false };
            } else {
                set({
                    isLoading: false,
                    error: response.message || 'Login failed',
                });
                return { success: false };
            }
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'An error occurred during login',
            });
            return { success: false };
        }
    },

    register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.register(name, email, password);
            set({ isLoading: false });
            return response.success;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Registration failed',
            });
            return false;
        }
    },

    verifyEmail: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.verifyEmail(email, otp);
            set({
                isLoading: false,
                setupToken: response.data?.setupToken || null
            });
            return {
                success: response.success,
                needsProfileSetup: response.data?.needsProfileSetup || false
            };
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Verification failed',
            });
            return { success: false, needsProfileSetup: false };
        }
    },

    completeProfile: async (data: CompleteProfileData) => {
        const { setupToken } = get();
        if (!setupToken) {
            set({ error: 'Session expired. Please start over.' });
            return false;
        }

        set({ isLoading: true, error: null });
        try {
            const response = await authService.completeProfile(data, setupToken);
            if (response.success) {
                set({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    setupToken: null, // Clear setup token after completion
                });
                return true;
            } else {
                set({
                    isLoading: false,
                    error: response.message || 'Profile completion failed',
                });
                return false;
            }
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'An error occurred during profile completion',
            });
            return false;
        }
    },

    logout: async () => {
        set({ isLoading: true });

        try {
            await authService.logout();
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    initializeAuth: async () => {
        set({ isLoading: true });

        try {
            const user = await authService.initializeAuth();

            set({
                user,
                isAuthenticated: !!user,
                isLoading: false,
            });
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

    updateUser: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.updateProfile(data);
            if (response.success && response.data) {
                set({
                    user: response.data,
                    isLoading: false,
                    error: null,
                });
                return true;
            } else {
                set({
                    isLoading: false,
                    error: response.message || 'Failed to update profile',
                });
                return false;
            }
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'An error occurred during profile update',
            });
            return false;
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
