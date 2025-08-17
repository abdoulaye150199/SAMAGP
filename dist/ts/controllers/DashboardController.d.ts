export declare class DashboardController {
    private static instance;
    private cargaisonService;
    private dashboardMap;
    private constructor();
    static getInstance(): DashboardController;
    initialize(): Promise<void>;
    private loadDashboardData;
    private loadFallbackData;
    private updateStatisticsDisplay;
    private updateRecentActivity;
    private loadLastActiveCargaison;
    private updateCargaisonDetails;
    private initDashboardMap;
    searchCargaisons(searchTerm: string): Promise<void>;
    private loadSuggestions;
    private displaySuggestions;
    selectCargaison(cargaisonId: string): void;
    private hideSuggestions;
    searchAndDisplayCargaison(): Promise<void>;
    private initializeEventListeners;
    private formatCurrency;
    private formatDate;
    private generateShipmentPosition;
    private getTypeIcon;
    private getTypeColor;
    private getVitesseByType;
    private getProgressionByStatus;
    private showError;
}
//# sourceMappingURL=DashboardController.d.ts.map