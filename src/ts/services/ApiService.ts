// src/ts/services/ApiService.ts

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export class ApiService {
    private static instance: ApiService;
    private baseUrl: string = '';

    private constructor() {}

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    // Configuration
    public setBaseUrl(url: string): void {
        this.baseUrl = url;
    }

    // Méthodes HTTP génériques
    private async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || `HTTP Error: ${response.status}`,
                };
            }

            return {
                success: true,
                data: data,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    public async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    public async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // Gestion des erreurs et retry
    public async retryRequest<T>(
        requestFn: () => Promise<ApiResponse<T>>,
        maxRetries: number = 3,
        delay: number = 1000
    ): Promise<ApiResponse<T>> {
        for (let i = 0; i <= maxRetries; i++) {
            const result = await requestFn();
            
            if (result.success || i === maxRetries) {
                return result;
            }
            
            // Attendre avant la prochaine tentative
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
        
        return {
            success: false,
            error: 'Max retries exceeded'
        };
    }

    // Cache simple
    private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

    public async getCached<T>(
        endpoint: string, 
        ttl: number = 300000 // 5 minutes par défaut
    ): Promise<ApiResponse<T>> {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return {
                success: true,
                data: cached.data
            };
        }
        
        const response = await this.get<T>(endpoint);
        
        if (response.success) {
            this.cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now(),
                ttl
            });
        }
        
        return response;
    }

    public clearCache(): void {
        this.cache.clear();
    }

    // Upload de fichiers
    public async uploadFile(
        endpoint: string, 
        file: File, 
        additionalData?: Record<string, string>
    ): Promise<ApiResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            if (additionalData) {
                Object.entries(additionalData).forEach(([key, value]) => {
                    formData.append(key, value);
                });
            }
            
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            
            const data = await response.json();
            
            return {
                success: response.ok,
                data: response.ok ? data : undefined,
                error: response.ok ? undefined : (data.error || 'Upload failed')
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Upload error'
            };
        }
    }

    // Batch requests
    public async batchRequests<T>(
        requests: Array<() => Promise<ApiResponse<T>>>
    ): Promise<ApiResponse<T[]>> {
        try {
            const results = await Promise.all(requests.map(req => req()));
            const successful = results.filter(r => r.success).map(r => r.data!);
            const errors = results.filter(r => !r.success).map(r => r.error!);
            
            if (errors.length > 0) {
                return {
                    success: false,
                    error: `Batch errors: ${errors.join(', ')}`,
                    data: successful
                };
            }
            
            return {
                success: true,
                data: successful
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Batch request failed'
            };
        }
    }

    // Monitoring et logs
    public async logRequest(endpoint: string, method: string, success: boolean, duration: number): Promise<void> {
        console.log(`[API] ${method} ${endpoint} - ${success ? 'SUCCESS' : 'FAILED'} (${duration}ms)`);
        
        // Ici on pourrait envoyer les logs vers un service de monitoring
        if (!success) {
            this.post('/api/logs', {
                endpoint,
                method,
                success,
                duration,
                timestamp: new Date().toISOString()
            }).catch(() => {}); // Silent fail pour les logs
        }
    }
}
