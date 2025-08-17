export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export declare class ApiService {
    private static instance;
    private baseUrl;
    private constructor();
    static getInstance(): ApiService;
    setBaseUrl(url: string): void;
    private request;
    get<T>(endpoint: string): Promise<ApiResponse<T>>;
    post<T>(endpoint: string, body: any): Promise<ApiResponse<T>>;
    put<T>(endpoint: string, body: any): Promise<ApiResponse<T>>;
    delete<T>(endpoint: string): Promise<ApiResponse<T>>;
    retryRequest<T>(requestFn: () => Promise<ApiResponse<T>>, maxRetries?: number, delay?: number): Promise<ApiResponse<T>>;
    private cache;
    getCached<T>(endpoint: string, ttl?: number): Promise<ApiResponse<T>>;
    clearCache(): void;
    uploadFile(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<ApiResponse>;
    batchRequests<T>(requests: Array<() => Promise<ApiResponse<T>>>): Promise<ApiResponse<T[]>>;
    logRequest(endpoint: string, method: string, success: boolean, duration: number): Promise<void>;
}
//# sourceMappingURL=ApiService.d.ts.map