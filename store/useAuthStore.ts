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
    forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
    verifyResetOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
    resetPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    changePassword: (passwordData: { currentPassword: string; newPassword: string }) => Promise<{ success: boolean; message: string }>;
    updateAvatar: (avatarUrl: string) => Promise<{ success: boolean; message: string; data?: User }>;
    updateCoverPhoto: (coverUrl: string) => Promise<{ success: boolean; message: string; data?: User }>;
    fetchUser: () => Promise<void>;
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
            // First load from local storage
            let user = await authService.initializeAuth();

            if (user) {
                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });

                // Then fetch updated data in background
                try {
                    const updatedUser = await authService.getCurrentUser();
                    if (updatedUser) {
                        set({ user: updatedUser });
                    }
                } catch (error: any) {
                    if (error?.status === 401 || error?.message === 'Invalid or expired token') {
                        await get().logout();
                    }
                }
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },

    fetchUser: async () => {
        set({ isLoading: true });
        try {
            const user = await authService.getCurrentUser();
            if (user) {
                set({ user, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error: any) {
            set({ isLoading: false });
            if (error?.status === 401 || error?.message === 'Invalid or expired token') {
                await get().logout();
            }
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

    forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.forgotPassword(email);
            set({ isLoading: false });
            return response;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Failed to request password reset',
            });
            return { success: false, message: error?.message || 'Failed to request password reset' };
        }
    },

    verifyResetOtp: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.verifyResetOtp(email, otp);
            set({ isLoading: false });
            return response;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Failed to verify OTP',
            });
            return { success: false, message: error?.message || 'Failed to verify OTP' };
        }
    },

    resetPassword: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.resetPassword(email, password);
            set({ isLoading: false });
            return response;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Failed to reset password',
            });
            return { success: false, message: error?.message || 'Failed to reset password' };
        }
    },

    changePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.changePassword(passwordData);
            set({ isLoading: false });
            return response;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Failed to change password',
            });
            return { success: false, message: error?.message || 'Failed to change password' };
        }
    },

    updateAvatar: async (avatarUrl: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.updateAvatar(avatarUrl);
            if (response.success && response.data) {
                set({
                    user: response.data,
                    isLoading: false,
                    error: null,
                });
            } else {
                set({
                    isLoading: false,
                    error: response.message || 'Failed to update avatar',
                });
            }
            return response;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Failed to update avatar',
            });
            return { success: false, message: error?.message || 'Failed to update avatar' };
        }
    },

    updateCoverPhoto: async (coverUrl: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.updateCoverPhoto(coverUrl);
            if (response.success && response.data) {
                set({
                    user: response.data,
                    isLoading: false,
                    error: null,
                });
            } else {
                set({
                    isLoading: false,
                    error: response.message || 'Failed to update cover photo',
                });
            }
            return response;
        } catch (error: any) {
            set({
                isLoading: false,
                error: error?.message || 'Failed to update cover photo',
            });
            return { success: false, message: error?.message || 'Failed to update cover photo' };
        }
    },
}));
