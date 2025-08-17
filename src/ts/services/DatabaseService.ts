// src/ts/services/DatabaseService.ts

interface DatabaseSchema {
    gestionnaires: any[];
    cargaisons: any[];
    produits: any[];
    clients: any[];
    colis: any[];
    emailConfig?: any;
    emailLogs?: any[];
}

export class DatabaseService {
    private static instance: DatabaseService;
    private readonly dbPath = '/db.json';

    private constructor() {}

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    /**
     * Charger la base de données depuis le fichier JSON
     */
    public async loadDatabase(): Promise<DatabaseSchema> {
        try {
            // En environnement browser, utiliser fetch pour récupérer les données
            if (typeof window !== 'undefined') {
                const response = await fetch(this.dbPath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                return data || this.getDefaultDatabase();
            }
            
            // En environnement Node.js, utiliser fs
            const fs = await import('fs/promises');
            const path = await import('path');
            
            const fullPath = path.join(process.cwd(), 'db.json');
            
            try {
                const content = await fs.readFile(fullPath, 'utf-8');
                const data = JSON.parse(content);
                return data || this.getDefaultDatabase();
            } catch (error) {
                // Si le fichier n'existe pas, créer une base par défaut
                const defaultDb = this.getDefaultDatabase();
                await this.saveDatabase(defaultDb);
                return defaultDb;
            }
        } catch (error) {
            console.error('Erreur lors du chargement de la base de données:', error);
            return this.getDefaultDatabase();
        }
    }

    /**
     * Sauvegarder la base de données dans le fichier JSON
     */
    public async saveDatabase(data: DatabaseSchema): Promise<boolean> {
        try {
            // En environnement Node.js, utiliser fs
            if (typeof window === 'undefined') {
                const fs = await import('fs/promises');
                const path = await import('path');
                
                const fullPath = path.join(process.cwd(), 'db.json');
                const jsonData = JSON.stringify(data, null, 2);
                
                await fs.writeFile(fullPath, jsonData, 'utf-8');
                return true;
            }
            
            // En environnement browser, on ne peut pas écrire directement
            // Cette méthode devrait être appelée côté serveur
            console.warn('saveDatabase ne peut pas être appelé côté client');
            return false;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    /**
     * Obtenir une base de données par défaut
     */
    private getDefaultDatabase(): DatabaseSchema {
        return {
            gestionnaires: [],
            cargaisons: [],
            produits: [],
            clients: [],
            colis: [],
            emailConfig: {
                host: 'smtp.gmail.com',
                port: 587,
                username: '',
                password: '',
                encryption: 'tls',
                fromEmail: '',
                fromName: 'SENGP - Logistique'
            },
            emailLogs: []
        };
    }

    /**
     * Vérifier si la base de données est accessible
     */
    public async isAvailable(): Promise<boolean> {
        try {
            await this.loadDatabase();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Sauvegarder seulement une partie de la base de données
     */
    public async updatePartial(updates: Partial<DatabaseSchema>): Promise<boolean> {
        try {
            const currentDb = await this.loadDatabase();
            const updatedDb = { ...currentDb, ...updates };
            return await this.saveDatabase(updatedDb);
        } catch (error) {
            console.error('Erreur lors de la mise à jour partielle:', error);
            return false;
        }
    }
}

// Export de l'instance globale
export const databaseService = DatabaseService.getInstance();
