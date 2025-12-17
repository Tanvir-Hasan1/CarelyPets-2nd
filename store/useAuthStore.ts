/**
 * Auth Store
 * Global authentication state management using Zustand.
 */

import authService, { User } from '@/services/authService';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    initializeAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authService.login({ email, password });

            if (response.success) {
                set({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                return true;
            } else {
                set({
                    isLoading: false,
                    error: response.message || 'Login failed',
                });
                return false;
            }
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'An error occurred during login',
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

    clearError: () => {
        set({ error: null });
    },
}));
