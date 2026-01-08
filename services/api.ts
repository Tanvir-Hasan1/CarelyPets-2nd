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
    private refreshHandler: (() => Promise<string | null>) | null = null;
    private isRefreshing = false;
    private failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

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
     * Set the handler for token refresh
     */
    setRefreshHandler(handler: () => Promise<string | null>) {
        this.refreshHandler = handler;
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

        if (!response.ok) {
            const error: ApiError = {
                message: (data as any)?.message || `Request failed with status ${response.status}`,
                status: response.status,
                data,
            };
            console.error(`[API] ${response.status} Error Data:`, JSON.stringify(data, null, 2));
            throw error;
        }

        return data as T;
    }

    /**
     * Internal request method with retry logic
     */
    private async request<T>(
        endpoint: string,
        method: string,
        body?: any,
        options?: RequestOptions
    ): Promise<T> {
        const url = this.buildUrl(endpoint);
        const isFormData = body instanceof FormData;
        const headers = this.buildHeaders(options?.headers);

        if (isFormData) {
            headers.delete('Content-Type');
            console.log(`[API] ${method} Request with FormData (Content-Type deleted for fetch)`);
        } else {
            console.log(`[API] ${method} Request with Headers:`, JSON.stringify(Object.fromEntries(headers as any), null, 2));
        }

        const fetchOptions: RequestOptions = {
            ...options,
            method,
            headers,
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
        };

        try {
            const response = await this.fetchWithTimeout(url, fetchOptions);

            // Handle 401 Unauthorized - trigger refresh
            if (response.status === 401 && !endpoint.includes('/auth/refresh') && this.refreshHandler) {
                if (this.isRefreshing) {
                    // Queue request to retry after refresh finishes
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({
                            resolve: async (token: string) => {
                                fetchOptions.headers = this.buildHeaders(options?.headers);
                                const retryResponse = await this.fetchWithTimeout(url, fetchOptions);
                                resolve(await this.handleResponse<T>(retryResponse));
                            },
                            reject: (err: any) => reject(err),
                        });
                    });
                }

                this.isRefreshing = true;

                try {
                    const newToken = await this.refreshHandler();
                    if (newToken) {
                        this.isRefreshing = false;
                        // Retry all queued requests
                        this.failedQueue.forEach((prom) => prom.resolve(newToken));
                        this.failedQueue = [];

                        // Retry current request
                        fetchOptions.headers = this.buildHeaders(options?.headers);
                        const retryResponse = await this.fetchWithTimeout(url, fetchOptions);
                        return await this.handleResponse<T>(retryResponse);
                    }
                } catch (refreshError) {
                    this.isRefreshing = false;
                    this.failedQueue.forEach((prom) => prom.reject(refreshError));
                    this.failedQueue = [];
                    throw refreshError;
                }
            }

            return await this.handleResponse<T>(response);
        } catch (error) {
            console.error(`[API] ${method} Request failed:`, url, error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'GET', undefined, options);
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'POST', body, options);
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PUT', body, options);
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PATCH', body, options);
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'DELETE', undefined, options);
    }
}

// Export singleton instance
const api = new ApiClient();
export default api;
