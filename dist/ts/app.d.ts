export declare class App {
    private static instance;
    private constructor();
    static getInstance(): App;
    initialize(): Promise<void>;
    private initializeDashboard;
    private initializeCargaisons;
    private initializeDetailsCargaison;
    private initializeSuiviCarte;
    private initializeCreationCargaison;
    private initializeLanding;
}
export declare const app: App;
//# sourceMappingURL=app.d.ts.map