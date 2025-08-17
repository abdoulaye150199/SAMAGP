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
export declare class ColisModel {
    private static instance;
    private colis;
    private constructor();
    static getInstance(): ColisModel;
    validateColis(data: Partial<Colis>): {
        isValid: boolean;
        errors: string[];
    };
    generateTrackingCode(): string;
    calculatePrice(poids: number, typeCargaison: string): number;
    searchColis(colis: Colis[], searchTerm: string): Colis[];
    filterColis(colis: Colis[], filters: {
        statut?: string;
        typeProduit?: string;
        typeCargaison?: string;
        dateCreation?: string;
        cargaisonId?: string;
    }): Colis[];
    getStatistics(colis: Colis[]): {
        total: number;
        enAttente: number;
        enCours: number;
        recuperes: number;
        perdus: number;
        poidsTotal: number;
        valeurTotale: number;
        revenus: number;
    };
    getColisByCargaison(cargaisonId: string): Colis[];
    updateColisStatusByCargaison(cargaisonId: string, newStatus: string): boolean;
    assignToCaraigaison(trackingCodes: string[], cargaisonId: string): boolean;
    updateStatus(trackingCode: string, newStatus: string, note?: string): boolean;
    setColis(colis: Colis[]): void;
    getColis(): Colis[];
    getColisByTrackingCode(trackingCode: string): Colis | undefined;
    addColis(colis: Colis): void;
    deleteColis(trackingCode: string): boolean;
    exportToCsv(colis: Colis[]): string;
}
//# sourceMappingURL=Colis.d.ts.map