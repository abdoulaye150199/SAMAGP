// src/ts/services/CargaisonService.ts

import { ApiService, type ApiResponse } from './ApiService.js';
import { CargaisonModel, type Cargaison } from '../models/Cargaison.js';

export class CargaisonService {
    private static instance: CargaisonService;
    private apiService: ApiService;
    private model: CargaisonModel;

    private constructor() {
        this.apiService = ApiService.getInstance();
        this.model = CargaisonModel.getInstance();
    }

    public static getInstance(): CargaisonService {
        if (!CargaisonService.instance) {
            CargaisonService.instance = new CargaisonService();
        }
        return CargaisonService.instance;
    }

    // CRUD Operations
    public async getAllCargaisons(): Promise<ApiResponse<Cargaison[]>> {
        const response = await this.apiService.get<Cargaison[]>('/api/cargaisons');
        
        if (response.success && response.data) {
            this.model.setCargaisons(response.data);
        }
        
        return response;
    }

    public async getCargaisonById(id: string): Promise<ApiResponse<Cargaison>> {
        // Vérifier d'abord dans le cache local
        const cachedCargaison = this.model.getCargaisonById(id);
        if (cachedCargaison) {
            return {
                success: true,
                data: cachedCargaison
            };
        }

        const response = await this.apiService.get<Cargaison>(`/api/cargaisons/${id}`);
        return response;
    }

    public async createCargaison(cargaisonData: Omit<Cargaison, 'id' | 'dateCreation'>): Promise<ApiResponse<Cargaison>> {
        // Validation côté client
        const validation = this.model.validateCargaison(cargaisonData);
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.errors.join(', ')
            };
        }

        // Préparer les données
        const cargaison: Cargaison = {
            ...cargaisonData,
            id: this.model.generateCargaisonId(),
            dateCreation: new Date().toISOString().split('T')[0],
            fermee: false
        };

        const response = await this.apiService.post<Cargaison>('/api/cargaisons', cargaison);
        
        if (response.success && response.data) {
            this.model.addCargaison(response.data);
        }
        
        return response;
    }

    public async updateCargaison(id: string, updates: Partial<Cargaison>): Promise<ApiResponse<Cargaison>> {
        const response = await this.apiService.put<Cargaison>(`/api/cargaisons/${id}`, updates);
        
        if (response.success && response.data) {
            this.model.updateCargaison(id, updates);
        }
        
        return response;
    }

    public async updateCargaisonStatus(id: string, newStatus: string, note?: string): Promise<ApiResponse<any>> {
        const cargaison = this.model.getCargaisonById(id);
        
        if (cargaison && !this.model.canUpdateStatus(cargaison, newStatus)) {
            return {
                success: false,
                error: `Impossible de changer le statut de "${cargaison.statut}" vers "${newStatus}"`
            };
        }

        const response = await this.apiService.post(`/api/cargaisons/update-status`, {
            id,
            statut: newStatus,
            note
        });

        if (response.success) {
            this.model.updateCargaison(id, { statut: newStatus as any });
        }

        return response;
    }

    public async deleteCargaison(id: string): Promise<ApiResponse<any>> {
        const response = await this.apiService.delete(`/api/cargaisons/${id}`);
        
        if (response.success) {
            this.model.deleteCargaison(id);
        }
        
        return response;
    }

    // Opérations de recherche et filtrage
    public async searchCargaisons(filters: {
        type?: string;
        statut?: string;
        origine?: string;
        destination?: string;
        code?: string;
    }): Promise<Cargaison[]> {
        const allCargaisons = this.model.getCargaisons();
        return this.model.filterCargaisons(allCargaisons, filters);
    }

    public async getCargaisonsWithCache(forceRefresh: boolean = false): Promise<ApiResponse<Cargaison[]>> {
        if (forceRefresh) {
            this.apiService.clearCache();
        }
        
        return await this.apiService.getCached<Cargaison[]>('/api/cargaisons');
    }

    // Statistiques et analytics
    public async getStatistics(): Promise<ApiResponse<any>> {
        const allCargaisons = this.model.getCargaisons();
        const stats = this.model.getStatistics(allCargaisons);
        
        return {
            success: true,
            data: stats
        };
    }

    public async getDashboardData(): Promise<ApiResponse<{
        cargaisons: Cargaison[];
        statistics: any;
        recentActivity: any[];
    }>> {
        try {
            // Récupérer les cargaisons
            const cargaisonsResponse = await this.getAllCargaisons();
            if (!cargaisonsResponse.success) {
                return {
                    success: false,
                    error: cargaisonsResponse.error || 'Failed to load cargaisons'
                };
            }

            const cargaisons = cargaisonsResponse.data!;
            
            // Vérifier si cargaisons est un tableau
            if (!Array.isArray(cargaisons)) {
                console.warn('getDashboardData: cargaisons n\'est pas un tableau');
                return {
                    success: false,
                    error: 'Format de données invalide'
                };
            }
            
            // Calculer les statistiques
            const statistics = this.model.getStatistics(cargaisons);
            
            // Activité récente (dernières modifications)
            const recentActivity = cargaisons
                .filter(c => c.dateModification)
                .sort((a, b) => new Date(b.dateModification!).getTime() - new Date(a.dateModification!).getTime())
                .slice(0, 10)
                .map(c => ({
                    id: c.id,
                    type: 'status_change',
                    message: `Cargaison ${c.id} - ${c.statut}`,
                    date: c.dateModification
                }));

            return {
                success: true,
                data: {
                    cargaisons,
                    statistics,
                    recentActivity
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Dashboard data fetch failed'
            };
        }
    }

    // Opérations avancées
    public async getActiveCargaisons(): Promise<Cargaison[]> {
        const allCargaisons = this.model.getCargaisons();
        if (!Array.isArray(allCargaisons)) {
            console.warn('getActiveCargaisons: allCargaisons n\'est pas un tableau, retour tableau vide');
            return [];
        }
        return allCargaisons.filter(c => ['En attente', 'En cours'].includes(c.statut));
    }

    public async getLastActiveCargaison(): Promise<Cargaison | null> {
        const activeCargaisons = await this.getActiveCargaisons();
        
        if (activeCargaisons.length === 0) {
            return null;
        }
        
        // Trier par date de création (plus récente en premier)
        return this.model.sortCargaisons(
            activeCargaisons.filter(c => c.statut === 'En cours'),
            'date',
            'desc'
        )[0] || null;
    }

    public async bulkUpdateStatus(ids: string[], newStatus: string): Promise<ApiResponse<any>> {
        const requests = ids.map(id => 
            () => this.updateCargaisonStatus(id, newStatus)
        );
        
        return await this.apiService.batchRequests(requests);
    }

    // Export et rapports
    public async exportCargaisons(format: 'csv' | 'json' = 'csv'): Promise<string> {
        const cargaisons = this.model.getCargaisons();
        
        if (format === 'json') {
            return JSON.stringify(cargaisons, null, 2);
        }
        
        // Export CSV
        const headers = [
            'ID', 'Type', 'Origine', 'Destination', 'Statut', 
            'Date création', 'Poids max (kg)', 'Prix/kg (FCFA)', 'Fermée'
        ];
        
        const rows = cargaisons.map(c => [
            c.id, c.type, c.origine, c.destination, c.statut,
            c.dateCreation, c.poidsMax.toString(), c.prixParKg.toString(), c.fermee ? 'Oui' : 'Non'
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    // Gestion des événements
    private eventListeners: Map<string, Function[]> = new Map();

    public on(event: string, callback: Function): void {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event)!.push(callback);
    }

    public emit(event: string, data?: any): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }

    public off(event: string, callback: Function): void {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
}
