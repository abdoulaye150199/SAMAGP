// src/ts/models/Cargaison.ts
export class CargaisonModel {
    constructor() {
        this.cargaisons = [];
    }
    static getInstance() {
        if (!CargaisonModel.instance) {
            CargaisonModel.instance = new CargaisonModel();
        }
        return CargaisonModel.instance;
    }
    // Méthodes de validation
    validateCargaison(data) {
        const errors = [];
        if (!data.type)
            errors.push('Le type de transport est requis');
        if (!data.origine)
            errors.push('L\'origine est requise');
        if (!data.destination)
            errors.push('La destination est requise');
        if (!data.poidsMax || data.poidsMax <= 0)
            errors.push('Le poids maximum doit être supérieur à 0');
        if (!data.prixParKg || data.prixParKg <= 0)
            errors.push('Le prix par kg doit être supérieur à 0');
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Calculs de progression
    calculateProgressPercentage(statut) {
        const statusProgress = {
            'en attente': 5,
            'en cours': 35,
            'en transit': 65,
            'arrivé': 95,
            'récupéré': 100
        };
        return statusProgress[statut.toLowerCase()] || 0;
    }
    // Filtrage et recherche
    filterCargaisons(cargaisons, filters) {
        if (!Array.isArray(cargaisons)) {
            console.warn('filterCargaisons: cargaisons n\'est pas un tableau, retour tableau vide');
            return [];
        }
        return cargaisons.filter(cargaison => {
            if (filters.type && cargaison.type !== filters.type)
                return false;
            if (filters.statut && cargaison.statut !== filters.statut)
                return false;
            if (filters.origine && !cargaison.origine.toLowerCase().includes(filters.origine.toLowerCase()))
                return false;
            if (filters.destination && !cargaison.destination.toLowerCase().includes(filters.destination.toLowerCase()))
                return false;
            if (filters.code && !cargaison.id.toLowerCase().includes(filters.code.toLowerCase()))
                return false;
            return true;
        });
    }
    // Tri
    sortCargaisons(cargaisons, sortBy, direction = 'desc') {
        return [...cargaisons].sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
                    break;
                case 'id':
                    comparison = a.id.localeCompare(b.id);
                    break;
                case 'statut':
                    comparison = a.statut.localeCompare(b.statut);
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
            }
            return direction === 'asc' ? comparison : -comparison;
        });
    }
    // Génération d'ID
    generateCargaisonId() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `CARG-${year}${month}${day}${random}`;
    }
    // Calculs de statistiques
    getStatistics(cargaisons) {
        if (!Array.isArray(cargaisons)) {
            console.warn('getStatistics: cargaisons n\'est pas un tableau, retour statistiques par défaut');
            return {
                total: 0,
                enCours: 0,
                arrivees: 0,
                enAttente: 0,
                recuperees: 0,
                totalPoids: 0,
                revenueEstime: 0
            };
        }
        return {
            total: cargaisons.length,
            enCours: cargaisons.filter(c => c.statut === 'En cours').length,
            arrivees: cargaisons.filter(c => c.statut === 'Arrivé').length,
            enAttente: cargaisons.filter(c => c.statut === 'En attente').length,
            recuperees: cargaisons.filter(c => c.statut === 'Récupéré').length,
            totalPoids: cargaisons.reduce((sum, c) => sum + c.poidsMax, 0),
            revenueEstime: cargaisons.reduce((sum, c) => sum + (c.poidsMax * c.prixParKg), 0)
        };
    }
    // Gestion des états (logique assouplie pour plus de flexibilité)
    canUpdateStatus(cargaison, newStatus) {
        // Permettre plus de flexibilité dans les changements de statut
        // Empêcher seulement les changements illogiques
        const forbiddenTransitions = {
            'Récupéré': ['En attente', 'En cours'], // Une fois récupéré, on ne peut plus revenir en arrière
            'Archivé': ['En attente', 'En cours', 'Arrivé', 'Perdu'] // Une fois archivé, c'est définitif
        };
        const forbidden = forbiddenTransitions[cargaison.statut] || [];
        return !forbidden.includes(newStatus);
    }
    // Mise en cache locale
    setCargaisons(cargaisons) {
        this.cargaisons = Array.isArray(cargaisons) ? cargaisons : [];
        if (!Array.isArray(cargaisons)) {
            console.warn('setCargaisons: données reçues ne sont pas un tableau, initialisation avec tableau vide');
        }
    }
    getCargaisons() {
        return this.cargaisons;
    }
    getCargaisonById(id) {
        return this.cargaisons.find(c => c.id === id);
    }
    addCargaison(cargaison) {
        this.cargaisons.push(cargaison);
    }
    updateCargaison(id, updates) {
        const index = this.cargaisons.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cargaisons[index] = { ...this.cargaisons[index], ...updates };
            return true;
        }
        return false;
    }
    deleteCargaison(id) {
        const index = this.cargaisons.findIndex(c => c.id === id);
        if (index !== -1) {
            this.cargaisons.splice(index, 1);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=Cargaison.js.map