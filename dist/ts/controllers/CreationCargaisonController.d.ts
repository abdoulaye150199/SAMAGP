interface Produit {
    id: number;
    nom: string;
    type: string;
    poids: number;
    valeur: number;
    description: string;
}
export declare class CreationCargaisonController {
    private static instance;
    private produits;
    private produitCounter;
    private cargaisonService;
    private constructor();
    static getInstance(): CreationCargaisonController;
    initialize(): Promise<void>;
    private initializeEventListeners;
    private setupPriceCalculation;
    private handleTypeChange;
    private updateCapacityIndicator;
    private exposeGlobalFunctions;
    ajouterProduit(): void;
    private creerModalProduit;
    private setupModalEvents;
    private confirmerAjoutProduit;
    private fermerModal;
    supprimerProduit(id: number): void;
    private updateProduitsDisplay;
    private updateResumeDisplay;
    private updatePoidsTotal;
    private handleFormSubmit;
    private validateForm;
    private showMessage;
    getProduits(): Produit[];
    clearProduits(): void;
}
export declare const creationController: CreationCargaisonController;
export {};
//# sourceMappingURL=CreationCargaisonController.d.ts.map