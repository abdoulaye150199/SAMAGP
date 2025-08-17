// src/ts/models/Colis.ts

export interface Colis {
    id: string;
    trackingCode: string;
    client: {
        nom: string;
        prenom: string;
        telephone: string;
        email?: string;
        adresse: string;
    };
    destinataire: {
        nom: string;
        prenom: string;
        telephone: string;
        email?: string;
        adresse: string;
    };
    nombreColis: number;
    poids: number;
    typeProduit: string;
    typeCargaison: string;
    valeurDeclaree?: number;
    prix: number;
    description?: string;
    statut: string;
    dateCreation: string;
    cargaisonId?: string;
}

export class ColisModel {
    private static instance: ColisModel;
    private colis: Colis[] = [];

    private constructor() {}

    public static getInstance(): ColisModel {
        if (!ColisModel.instance) {
            ColisModel.instance = new ColisModel();
        }
        return ColisModel.instance;
    }

    // Validation des données
    public validateColis(data: Partial<Colis>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Validation client
        if (!data.client?.nom) errors.push('Le nom du client est requis');
        if (!data.client?.prenom) errors.push('Le prénom du client est requis');
        if (!data.client?.telephone) errors.push('Le téléphone du client est requis');
        if (!data.client?.adresse) errors.push('L\'adresse du client est requise');

        // Validation destinataire
        if (!data.destinataire?.nom) errors.push('Le nom du destinataire est requis');
        if (!data.destinataire?.prenom) errors.push('Le prénom du destinataire est requis');
        if (!data.destinataire?.telephone) errors.push('Le téléphone du destinataire est requis');
        if (!data.destinataire?.adresse) errors.push('L\'adresse du destinataire est requise');

        // Validation email si fourni
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.client?.email && !emailRegex.test(data.client.email)) {
            errors.push('L\'email du client n\'est pas valide');
        }
        if (data.destinataire?.email && !emailRegex.test(data.destinataire.email)) {
            errors.push('L\'email du destinataire n\'est pas valide');
        }

        // Validation colis
        if (!data.nombreColis || data.nombreColis <= 0) errors.push('Le nombre de colis doit être supérieur à 0');
        if (!data.poids || data.poids <= 0) errors.push('Le poids doit être supérieur à 0');
        if (!data.typeProduit) errors.push('Le type de produit est requis');
        if (!data.typeCargaison) errors.push('Le type de cargaison est requis');
        if (!data.prix || data.prix <= 0) errors.push('Le prix doit être supérieur à 0');

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Génération de code de suivi
    public generateTrackingCode(): string {
        const timestamp = Date.now().toString();
        return `YONIMA${timestamp.slice(-6)}`;
    }

    // Calcul du prix
    public calculatePrice(poids: number, typeCargaison: string): number {
        const tarifs: Record<string, number> = {
            'Maritime': 2000,
            'Aérien': 5000,
            'Routier': 3000
        };

        const tarifParKg = tarifs[typeCargaison] || 2000;
        return poids * tarifParKg;
    }

    // Recherche et filtrage
    public searchColis(colis: Colis[], searchTerm: string): Colis[] {
        const term = searchTerm.toLowerCase();
        return colis.filter(c => 
            c.trackingCode.toLowerCase().includes(term) ||
            c.client.nom.toLowerCase().includes(term) ||
            c.client.prenom.toLowerCase().includes(term) ||
            c.destinataire.nom.toLowerCase().includes(term) ||
            c.destinataire.prenom.toLowerCase().includes(term) ||
            c.description?.toLowerCase().includes(term)
        );
    }

    public filterColis(colis: Colis[], filters: {
        statut?: string;
        typeProduit?: string;
        typeCargaison?: string;
        dateCreation?: string;
        cargaisonId?: string;
    }): Colis[] {
        return colis.filter(c => {
            if (filters.statut && c.statut !== filters.statut) return false;
            if (filters.typeProduit && c.typeProduit !== filters.typeProduit) return false;
            if (filters.typeCargaison && c.typeCargaison !== filters.typeCargaison) return false;
            if (filters.dateCreation && !c.dateCreation.startsWith(filters.dateCreation)) return false;
            if (filters.cargaisonId && c.cargaisonId !== filters.cargaisonId) return false;
            return true;
        });
    }

    // Statistiques
    public getStatistics(colis: Colis[]): {
        total: number;
        enAttente: number;
        enCours: number;
        recuperes: number;
        perdus: number;
        poidsTotal: number;
        valeurTotale: number;
        revenus: number;
    } {
        return {
            total: colis.length,
            enAttente: colis.filter(c => c.statut === 'en-attente').length,
            enCours: colis.filter(c => c.statut === 'en-cours').length,
            recuperes: colis.filter(c => c.statut === 'recupere').length,
            perdus: colis.filter(c => c.statut === 'perdu').length,
            poidsTotal: colis.reduce((sum, c) => sum + c.poids, 0),
            valeurTotale: colis.reduce((sum, c) => sum + (c.valeurDeclaree || 0), 0),
            revenus: colis.reduce((sum, c) => sum + c.prix, 0)
        };
    }

    // Gestion des colis par cargaison
    public getColisByCargaison(cargaisonId: string): Colis[] {
        return this.colis.filter(c => c.cargaisonId === cargaisonId);
    }

    public updateColisStatusByCargaison(cargaisonId: string, newStatus: string): boolean {
        let updated = false;
        this.colis.forEach(c => {
            if (c.cargaisonId === cargaisonId) {
                c.statut = newStatus;
                updated = true;
            }
        });
        return updated;
    }

    public assignToCaraigaison(trackingCodes: string[], cargaisonId: string): boolean {
        let updated = false;
        this.colis.forEach(c => {
            if (trackingCodes.includes(c.trackingCode)) {
                c.cargaisonId = cargaisonId;
                updated = true;
            }
        });
        return updated;
    }

    // Mise à jour des statuts
    public updateStatus(trackingCode: string, newStatus: string, note?: string): boolean {
        const index = this.colis.findIndex(c => c.trackingCode === trackingCode);
        if (index !== -1) {
            this.colis[index].statut = newStatus;
            return true;
        }
        return false;
    }

    // Gestion du cache local
    public setColis(colis: Colis[]): void {
        this.colis = colis;
    }

    public getColis(): Colis[] {
        return this.colis;
    }

    public getColisByTrackingCode(trackingCode: string): Colis | undefined {
        return this.colis.find(c => c.trackingCode === trackingCode);
    }

    public addColis(colis: Colis): void {
        this.colis.push(colis);
    }

    public deleteColis(trackingCode: string): boolean {
        const index = this.colis.findIndex(c => c.trackingCode === trackingCode);
        if (index !== -1) {
            this.colis.splice(index, 1);
            return true;
        }
        return false;
    }

    // Export vers différents formats
    public exportToCsv(colis: Colis[]): string {
        const headers = [
            'Code de suivi', 'Client', 'Destinataire', 'Poids (kg)', 
            'Type produit', 'Prix (FCFA)', 'Statut', 'Date création'
        ];

        const rows = colis.map(c => [
            c.trackingCode,
            `${c.client.nom} ${c.client.prenom}`,
            `${c.destinataire.nom} ${c.destinataire.prenom}`,
            c.poids.toString(),
            c.typeProduit,
            c.prix.toString(),
            c.statut,
            c.dateCreation
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }
}
