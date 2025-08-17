// src/ts/services/CargaisonService.ts
import { ApiService } from './ApiService.js';
import { CargaisonModel } from '../models/Cargaison.js';
export class CargaisonService {
    constructor() {
        // Gestion des événements
        this.eventListeners = new Map();
        this.apiService = ApiService.getInstance();
        this.model = CargaisonModel.getInstance();
    }
    static getInstance() {
        if (!CargaisonService.instance) {
            CargaisonService.instance = new CargaisonService();
        }
        return CargaisonService.instance;
    }
    // CRUD Operations
    async getAllCargaisons() {
        const response = await this.apiService.get('/api/cargaisons');
        if (response.success && response.data) {
            this.model.setCargaisons(response.data);
        }
        return response;
    }
    async getCargaisonById(id) {
        // Vérifier d'abord dans le cache local
        const cachedCargaison = this.model.getCargaisonById(id);
        if (cachedCargaison) {
            return {
                success: true,
                data: cachedCargaison
            };
        }
        const response = await this.apiService.get(`/api/cargaisons/${id}`);
        return response;
    }
    async createCargaison(cargaisonData) {
        // Validation côté client
        const validation = this.model.validateCargaison(cargaisonData);
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.errors.join(', ')
            };
        }
        // Préparer les données
        const cargaison = {
            ...cargaisonData,
            id: this.model.generateCargaisonId(),
            dateCreation: new Date().toISOString().split('T')[0],
            fermee: false
        };
        const response = await this.apiService.post('/api/cargaisons', cargaison);
        if (response.success && response.data) {
            this.model.addCargaison(response.data);
        }
        return response;
    }
    async updateCargaison(id, updates) {
        const response = await this.apiService.put(`/api/cargaisons/${id}`, updates);
        if (response.success && response.data) {
            this.model.updateCargaison(id, updates);
        }
        return response;
    }
    async updateCargaisonStatus(id, newStatus, note) {
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
            this.model.updateCargaison(id, { statut: newStatus });
        }
        return response;
    }
    async deleteCargaison(id) {
        const response = await this.apiService.delete(`/api/cargaisons/${id}`);
        if (response.success) {
            this.model.deleteCargaison(id);
        }
        return response;
    }
    // Opérations de recherche et filtrage
    async searchCargaisons(filters) {
        const allCargaisons = this.model.getCargaisons();
        return this.model.filterCargaisons(allCargaisons, filters);
    }
    async getCargaisonsWithCache(forceRefresh = false) {
        if (forceRefresh) {
            this.apiService.clearCache();
        }
        return await this.apiService.getCached('/api/cargaisons');
    }
    // Statistiques et analytics
    async getStatistics() {
        const allCargaisons = this.model.getCargaisons();
        const stats = this.model.getStatistics(allCargaisons);
        return {
            success: true,
            data: stats
        };
    }
    async getDashboardData() {
        try {
            // Récupérer les cargaisons
            const cargaisonsResponse = await this.getAllCargaisons();
            if (!cargaisonsResponse.success) {
                return {
                    success: false,
                    error: cargaisonsResponse.error || 'Failed to load cargaisons'
                };
            }
            const cargaisons = cargaisonsResponse.data;
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
                .sort((a, b) => new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime())
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Dashboard data fetch failed'
            };
        }
    }
    // Opérations avancées
    async getActiveCargaisons() {
        const allCargaisons = this.model.getCargaisons();
        if (!Array.isArray(allCargaisons)) {
            console.warn('getActiveCargaisons: allCargaisons n\'est pas un tableau, retour tableau vide');
            return [];
        }
        return allCargaisons.filter(c => ['En attente', 'En cours'].includes(c.statut));
    }
    async getLastActiveCargaison() {
        const activeCargaisons = await this.getActiveCargaisons();
        if (activeCargaisons.length === 0) {
            return null;
        }
        // Trier par date de création (plus récente en premier)
        return this.model.sortCargaisons(activeCargaisons.filter(c => c.statut === 'En cours'), 'date', 'desc')[0] || null;
    }
    async bulkUpdateStatus(ids, newStatus) {
        const requests = ids.map(id => () => this.updateCargaisonStatus(id, newStatus));
        return await this.apiService.batchRequests(requests);
    }
    // Export et rapports
    async exportCargaisons(format = 'csv') {
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
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    emit(event, data) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }
    off(event, callback) {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
}
//# sourceMappingURL=CargaisonService.js.map