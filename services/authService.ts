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
        tokens: AuthTokens;
    };
}

export interface RefreshTokenResponse {
    success: boolean;
    data: {
        accessToken: string;
    };
}

// Auth Service
export const authService = {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', credentials);

        if (response.success && response.data) {
            // Store tokens and user data
            await this.saveAuthData(response.data.tokens, response.data.user);

            // Set access token for subsequent API calls
            api.setAuthToken(response.data.tokens.accessToken);
        }

        return response;
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

export default authService;
