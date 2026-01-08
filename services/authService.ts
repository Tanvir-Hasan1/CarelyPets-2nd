/**
 * Auth Service
 * Handles authentication API calls including login, logout, and token refresh.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Storage keys
const ACCESS_TOKEN_KEY = '@auth_access_token';
const REFRESH_TOKEN_KEY = '@auth_refresh_token';
const USER_KEY = '@auth_user';

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    username?: string;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    phone?: string;
    address?: string;
    country?: string;
    favorites?: string[];
    location?: {
        city?: string;
        country?: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        tokens?: AuthTokens;
        needsProfileSetup?: boolean;
        setupToken?: string;
    };
}

export interface RefreshTokenResponse {
    success: boolean;
    data: {
        accessToken: string;
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        email: string;
        name: string;
    };
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
    data: {
        user: User & { isVerified: boolean; profileCompleted: boolean };
        needsProfileSetup: boolean;
        setupToken: string;
    };
}

export interface CompleteProfileData {
    username: string;
    country: string;
    favorites: string[];
    profileImage?: string;
}

// Auth Service
export const authService = {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', credentials);

        if (response.success && response.data && response.data.tokens) {
            // Store tokens and user data
            await this.saveAuthData(response.data.tokens, response.data.user);

            // Set access token for subsequent API calls
            api.setAuthToken(response.data.tokens.accessToken);
        }

        return response;
    },

    /**
     * Register a new user
     */
    async register(name: string, email: string, password: string): Promise<RegisterResponse> {
        return await api.post<RegisterResponse>('/auth/register', { name, email, password });
    },

    /**
     * Verify email with OTP
     */
    async verifyEmail(email: string, otp: string): Promise<VerifyEmailResponse> {
        return await api.post<VerifyEmailResponse>('/auth/verify-email', { email, otp });
    },

    /**
     * Request password reset OTP
     */
    async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
        return await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
    },

    /**
     * Verify reset password OTP
     */
    async verifyResetOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
        return await api.post<{ success: boolean; message: string }>('/auth/verify-reset-otp', { email, otp });
    },

    /**
     * Reset password with new password
     */
    async resetPassword(email: string, password: string): Promise<{ success: boolean; message: string }> {
        return await api.post<{ success: boolean; message: string }>('/auth/reset-password', { email, password });
    },

    /**
     * Complete user profile with optional avatar
     */
    async completeProfile(data: CompleteProfileData, setupToken: string): Promise<LoginResponse> {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('country', data.country);
        formData.append('favorites', JSON.stringify(data.favorites));

        if (data.profileImage) {
            const uriParts = data.profileImage.split('.');
            const fileType = uriParts[uriParts.length - 1];

            // @ts-ignore
            formData.append('file', {
                uri: data.profileImage,
                name: `profile-image.${fileType}`,
                type: `image/${fileType}`,
            });
        }

        // Use setupToken as Bearer token for this specific request
        const response = await api.post<LoginResponse>('/auth/complete-profile', formData, {
            headers: {
                'Authorization': `Bearer ${setupToken}`,
            }
        });

        if (response.success && response.data && response.data.tokens) {
            // Store final tokens and user data
            await this.saveAuthData(response.data.tokens, response.data.user);
            api.setAuthToken(response.data.tokens.accessToken);
        }

        return response;
    },


    /**
     * Get current user data from server
     */
    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await api.get<{ success: boolean; data: User }>('/users/me');
            if (response.success && response.data) {
                // Update local storage
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
                return response.data;
            }
            return null;
        } catch (error: any) {
            console.error('Failed to fetch current user', error);
            if (error?.status === 401 || error?.message === 'Invalid or expired token') {
                throw error;
            }
            return null;
        }
    },

    /**
     * Change password
     */
    async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
        return await api.patch<{ success: boolean; message: string }>('/users/me/password', passwordData);
    },

    /**
     * Update the user profile
     */
    updateProfile: async (data: Partial<User>): Promise<{ success: boolean; message: string; data?: User }> => {
        try {
            // ... strict check ...
            const response = await api.patch<{ success: boolean; message: string; data: User }>('/users/me', data);
            if (response.success && response.data) {
                // Update local storage with the returned updated user
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
            }
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Failed to update profile',
            };
        }
    },

    /**
     * Update user avatar
     */
    async updateAvatar(avatarUrl: string): Promise<{ success: boolean; message: string; data?: User }> {
        try {
            const response = await api.patch<{ success: boolean; message: string; data: User }>('/users/me/avatar', { avatarUrl });
            if (response.success && response.data) {
                // Update local storage with the returned updated user
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
            }
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Failed to update avatar',
                data: undefined
            };
        }
    },

    /**
     * Update user cover photo
     */
    async updateCoverPhoto(coverUrl: string): Promise<{ success: boolean; message: string; data?: User }> {
        try {
            const response = await api.patch<{ success: boolean; message: string; data: User }>('/users/me/cover', { coverUrl });
            if (response.success && response.data) {
                // Update local storage with the returned updated user
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
            }
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error?.message || 'Failed to update cover photo',
                data: undefined
            };
        }
    },

    /**
     * Logout - clear all auth data
     */
    async logout(): Promise<void> {
        try {
            // Optionally call logout API endpoint
            // await api.post('/auth/logout');
        } catch (error) {
            // Ignore logout API errors
        } finally {
            // Always clear local data
            await this.clearAuthData();
            api.setAuthToken(null);
        }
    },

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(): Promise<string | null> {
        try {
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
                return null;
            }

            const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
                refreshToken,
            });

            if (response.success && response.data.accessToken) {
                await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
                api.setAuthToken(response.data.accessToken);
                return response.data.accessToken;
            }

            return null;
        } catch (error) {
            await this.clearAuthData();
            return null;
        }
    },

    /**
     * Check if user is authenticated
     */
    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        return !!token;
    },

    /**
     * Get stored user data
     */
    async getUser(): Promise<User | null> {
        try {
            const userData = await AsyncStorage.getItem(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    },

    /**
     * Get stored access token
     */
    async getAccessToken(): Promise<string | null> {
        return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    },

    /**
     * Initialize auth state (call on app start)
     * Now refreshes user data from server if token is available.
     */
    async initializeAuth(): Promise<User | null> {
        try {
            const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);

            if (accessToken) {
                api.setAuthToken(accessToken);
                return await this.getUser();
            }

            return null;
        } catch {
            return null;
        }
    },

    /**
     * Save auth data to storage
     */
    async saveAuthData(tokens: AuthTokens, user: User): Promise<void> {
        await Promise.all([
            AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
            AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
            AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
        ]);
    },

    /**
     * Clear all auth data from storage
     */
    async clearAuthData(): Promise<void> {
        await Promise.all([
            AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
            AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
            AsyncStorage.removeItem(USER_KEY),
        ]);
    },
};

// Set the refresh handler for the API client
api.setRefreshHandler(() => authService.refreshToken());

export default authService;
