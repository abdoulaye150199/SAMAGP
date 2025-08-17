interface Cargaison {
    id: string;
    type: string;
    origine: string;
    destination: string;
    statut: string;
    dateCreation: string;
}
export declare class DashboardSuggestions {
    private allCargaisons;
    private suggestionsList;
    private suggestionsContainer;
    constructor();
    loadSuggestions(cargaisons: Cargaison[]): void;
    private displayAllSuggestions;
    private showSuggestions;
    hideSuggestions(): void;
    private selectCargaison;
    private goToCargaisonDetails;
    refresh(): void;
}
export {};
//# sourceMappingURL=DashboardSuggestions.d.ts.map