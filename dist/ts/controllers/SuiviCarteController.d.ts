export declare class SuiviCarteController {
    private static instance;
    private mapService;
    private cargaisonService;
    private cargaisons;
    private constructor();
    static getInstance(): SuiviCarteController;
    initialize(): Promise<void>;
    private waitForLeaflet;
    private initializeMap;
    private loadCargaisons;
    private displayShipments;
    private displayShipmentsList;
    private initializeEvents;
    private handleSearch;
    private getMockCargaisons;
    private getStatusColor;
    private getTypeIcon;
}
//# sourceMappingURL=SuiviCarteController.d.ts.map