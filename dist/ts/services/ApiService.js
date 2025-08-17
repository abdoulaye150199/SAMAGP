// src/ts/services/ApiService.ts
export class ApiService {
    constructor() {
        this.baseUrl = '';
        // Cache simple
        this.cache = new Map();
    }
    static getInstance() {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }
    // Configuration
    setBaseUrl(url) {
        this.baseUrl = url;
    }
    // Méthodes HTTP génériques
    async request(endpoint, options = {}) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    // Gestion des erreurs et retry
    async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
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
    async getCached(endpoint, ttl = 300000 // 5 minutes par défaut
    ) {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return {
                success: true,
                data: cached.data
            };
        }
        const response = await this.get(endpoint);
        if (response.success) {
            this.cache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now(),
                ttl
            });
        }
        return response;
    }
    clearCache() {
        this.cache.clear();
    }
    // Upload de fichiers
    async uploadFile(endpoint, file, additionalData) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Upload error'
            };
        }
    }
    // Batch requests
    async batchRequests(requests) {
        try {
            const results = await Promise.all(requests.map(req => req()));
            const successful = results.filter(r => r.success).map(r => r.data);
            const errors = results.filter(r => !r.success).map(r => r.error);
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Batch request failed'
            };
        }
    }
    // Monitoring et logs
    async logRequest(endpoint, method, success, duration) {
        console.log(`[API] ${method} ${endpoint} - ${success ? 'SUCCESS' : 'FAILED'} (${duration}ms)`);
        // Ici on pourrait envoyer les logs vers un service de monitoring
        if (!success) {
            this.post('/api/logs', {
                endpoint,
                method,
                success,
                duration,
                timestamp: new Date().toISOString()
            }).catch(() => { }); // Silent fail pour les logs
        }
    }
}
//# sourceMappingURL=ApiService.js.map