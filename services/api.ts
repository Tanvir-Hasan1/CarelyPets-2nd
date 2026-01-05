/**
 * Core API Client
 * Provides a configured fetch wrapper with error handling, timeouts, and auth support.
 */

import config from '@/config';

interface RequestOptions extends RequestInit {
    timeout?: number;
}

interface ApiError {
    message: string;
    status?: number;
    data?: any;
}

class ApiClient {
    private baseUrl: string;
    private defaultTimeout: number;
    private authToken: string | null = null;

    constructor() {
        this.baseUrl = config.api.baseUrl;
        this.defaultTimeout = config.api.timeout;
        console.log('[API] Base URL:', this.baseUrl);
    }

    /**
     * Set the auth token for subsequent requests
     */
    setAuthToken(token: string | null) {
        this.authToken = token;
    }

    /**
     * Get the current auth token
     */
    getAuthToken(): string | null {
        return this.authToken;
    }

    /**
     * Build full URL with normalized slashes
     */
    private buildUrl(endpoint: string): string {
        const base = this.baseUrl.replace(/\/$/, '');
        const path = endpoint.replace(/^\//, '');
        return `${base}/${path}`;
    }

    /**
     * Build headers for requests
     */
    private buildHeaders(customHeaders?: HeadersInit): Headers {
        const headers = new Headers(customHeaders);

        // Only set application/json if no Content-Type is specified
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        if (this.authToken) {
            headers.set('Authorization', `Bearer ${this.authToken}`);
        }

        return headers;
    }

    /**
     * Fetch with timeout support
     */
    private async fetchWithTimeout(
        url: string,
        options: RequestOptions = {}
    ): Promise<Response> {
        const { timeout = this.defaultTimeout, ...fetchOptions } = options;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal,
            });
            return response;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Handle API response
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        // Read the body as text first to avoid "Unexpected end of input" errors on empty JSON responses
        const text = await response.text();
        let data: any;

        if (isJson && text) {
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('[API] JSON Parse Error:', e);
                data = text; // Fallback to raw text if parsing fails
            }
        } else {
            data = text;
        }

        console.log(`[API] ${response.status} ${response.url}`);
        if (isJson && typeof data === 'object') {
            console.log('[API] Response Data:', JSON.stringify(data, null, 2));
        } else if (text) {
            console.log('[API] Response Data:', data);
        }

        if (!response.ok) {
            const error: ApiError = {
                message: (data as any)?.message || `Request failed with status ${response.status}`,
                status: response.status,
                data,
            };
            throw error;
        }

        return data as T;
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(endpoint);
        const response = await this.fetchWithTimeout(url, {
            ...options,
            method: 'GET',
            headers: this.buildHeaders(options?.headers),
        });
        return this.handleResponse<T>(response);
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(endpoint);
        const isFormData = body instanceof FormData;
        const headers = this.buildHeaders(options?.headers);

        if (isFormData) {
            headers.delete('Content-Type');
        }

        console.log('[API] POST Request:', url);
        if (!isFormData) {
            console.log('[API] POST Body:', JSON.stringify(body));
        } else {
            console.log('[API] POST Body: [FormData]');
        }

        try {
            const response = await this.fetchWithTimeout(url, {
                ...options,
                method: 'POST',
                headers,
                body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            });
            console.log('[API] Response status:', response.status);
            return this.handleResponse<T>(response);
        } catch (error: any) {
            console.error('[API] Request failed:', error?.message || error);
            throw error;
        }
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(endpoint);
        const isFormData = body instanceof FormData;
        const headers = this.buildHeaders(options?.headers);

        if (isFormData) {
            headers.delete('Content-Type');
        }

        const response = await this.fetchWithTimeout(url, {
            ...options,
            method: 'PUT',
            headers,
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
        });
        return this.handleResponse<T>(response);
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(endpoint);
        const isFormData = body instanceof FormData;
        const headers = this.buildHeaders(options?.headers);

        if (isFormData) {
            headers.delete('Content-Type');
        }

        const response = await this.fetchWithTimeout(url, {
            ...options,
            method: 'PATCH',
            headers,
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
        });
        return this.handleResponse<T>(response);
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        const url = this.buildUrl(endpoint);
        const response = await this.fetchWithTimeout(url, {
            ...options,
            method: 'DELETE',
            headers: this.buildHeaders(options?.headers),
        });
        return this.handleResponse<T>(response);
    }
}

// Export singleton instance
const api = new ApiClient();
export default api;
