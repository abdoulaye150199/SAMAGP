interface DatabaseSchema {
    gestionnaires: any[];
    cargaisons: any[];
    produits: any[];
    clients: any[];
    colis: any[];
    emailConfig?: any;
    emailLogs?: any[];
}
export declare class DatabaseService {
    private static instance;
    private readonly dbPath;
    private constructor();
    static getInstance(): DatabaseService;
    /**
     * Charger la base de données depuis le fichier JSON
     */
    loadDatabase(): Promise<DatabaseSchema>;
    /**
     * Sauvegarder la base de données dans le fichier JSON
     */
    saveDatabase(data: DatabaseSchema): Promise<boolean>;
    /**
     * Obtenir une base de données par défaut
     */
    private getDefaultDatabase;
    /**
     * Vérifier si la base de données est accessible
     */
    isAvailable(): Promise<boolean>;
    /**
     * Sauvegarder seulement une partie de la base de données
     */
    updatePartial(updates: Partial<DatabaseSchema>): Promise<boolean>;
}
export declare const databaseService: DatabaseService;
export {};
//# sourceMappingURL=DatabaseService.d.ts.map