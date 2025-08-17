export interface Cargaison {
    id: string;
    type: string;
    origine: string;
    destination: string;
    statut: string;
    dateCreation: string;
    datePrevue?: string;
    dateModification?: string;
    poidsMax: number;
    prixParKg: number;
    description?: string;
    fermee: boolean;
    notes?: Array<{
        date: string;
        statut: string;
        note: string;
    }>;
}
export declare class CargaisonModel {
    private static instance;
    private cargaisons;
    private constructor();
    static getInstance(): CargaisonModel;
    validateCargaison(data: Partial<Cargaison>): {
        isValid: boolean;
        errors: string[];
    };
    calculateProgressPercentage(statut: string): number;
    filterCargaisons(cargaisons: Cargaison[], filters: {
        type?: string;
        statut?: string;
        origine?: string;
        destination?: string;
        code?: string;
    }): Cargaison[];
    sortCargaisons(cargaisons: Cargaison[], sortBy: 'date' | 'id' | 'statut' | 'type', direction?: 'asc' | 'desc'): Cargaison[];
    generateCargaisonId(): string;
    getStatistics(cargaisons: Cargaison[]): {
        total: number;
        enCours: number;
        arrivees: number;
        enAttente: number;
        recuperees: number;
        totalPoids: number;
        revenueEstime: number;
    };
    canUpdateStatus(cargaison: Cargaison, newStatus: string): boolean;
    setCargaisons(cargaisons: Cargaison[]): void;
    getCargaisons(): Cargaison[];
    getCargaisonById(id: string): Cargaison | undefined;
    addCargaison(cargaison: Cargaison): void;
    updateCargaison(id: string, updates: Partial<Cargaison>): boolean;
    deleteCargaison(id: string): boolean;
}
//# sourceMappingURL=Cargaison.d.ts.map