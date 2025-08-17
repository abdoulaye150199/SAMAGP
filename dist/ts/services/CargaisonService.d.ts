import { type ApiResponse } from './ApiService.js';
import { type Cargaison } from '../models/Cargaison.js';
export declare class CargaisonService {
    private static instance;
    private apiService;
    private model;
    private constructor();
    static getInstance(): CargaisonService;
    getAllCargaisons(): Promise<ApiResponse<Cargaison[]>>;
    getCargaisonById(id: string): Promise<ApiResponse<Cargaison>>;
    createCargaison(cargaisonData: Omit<Cargaison, 'id' | 'dateCreation'>): Promise<ApiResponse<Cargaison>>;
    updateCargaison(id: string, updates: Partial<Cargaison>): Promise<ApiResponse<Cargaison>>;
    updateCargaisonStatus(id: string, newStatus: string, note?: string): Promise<ApiResponse<any>>;
    deleteCargaison(id: string): Promise<ApiResponse<any>>;
    searchCargaisons(filters: {
        type?: string;
        statut?: string;
        origine?: string;
        destination?: string;
        code?: string;
    }): Promise<Cargaison[]>;
    getCargaisonsWithCache(forceRefresh?: boolean): Promise<ApiResponse<Cargaison[]>>;
    getStatistics(): Promise<ApiResponse<any>>;
    getDashboardData(): Promise<ApiResponse<{
        cargaisons: Cargaison[];
        statistics: any;
        recentActivity: any[];
    }>>;
    getActiveCargaisons(): Promise<Cargaison[]>;
    getLastActiveCargaison(): Promise<Cargaison | null>;
    bulkUpdateStatus(ids: string[], newStatus: string): Promise<ApiResponse<any>>;
    exportCargaisons(format?: 'csv' | 'json'): Promise<string>;
    private eventListeners;
    on(event: string, callback: Function): void;
    emit(event: string, data?: any): void;
    off(event: string, callback: Function): void;
}
//# sourceMappingURL=CargaisonService.d.ts.map