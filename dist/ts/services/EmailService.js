// src/ts/services/EmailService.ts
import { databaseService } from '../services/DatabaseService';
export class EmailService {
    constructor() { }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }
    // === GESTION CONFIGURATION EMAIL ===
    async getConfig() {
        try {
            const db = await databaseService.loadDatabase();
            return {
                success: true,
                data: db.emailConfig || this.getDefaultConfig()
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    async updateConfig(config) {
        try {
            const db = await databaseService.loadDatabase();
            db.emailConfig = {
                ...this.getDefaultConfig(),
                ...db.emailConfig,
                ...config
            };
            if (await databaseService.saveDatabase(db)) {
                return {
                    success: true,
                    data: db.emailConfig,
                    message: 'Configuration email mise à jour'
                };
            }
            else {
                return {
                    success: false,
                    error: 'Erreur lors de la sauvegarde'
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    async testConfig() {
        try {
            const configResult = await this.getConfig();
            if (!configResult.success) {
                return configResult;
            }
            const config = configResult.data;
            // Simuler un test de connexion
            if (!config.host || !config.username || !config.password) {
                return {
                    success: false,
                    error: 'Configuration incomplète'
                };
            }
            // Simulation de test réussi
            return {
                success: true,
                message: 'Configuration email valide'
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur test: ${error}`
            };
        }
    }
    // === GESTION LOGS EMAIL ===
    async getAllLogs() {
        try {
            const db = await databaseService.loadDatabase();
            const logs = db.emailLogs || [];
            // Trier par date décroissante
            logs.sort((a, b) => new Date(b.dateEnvoi).getTime() - new Date(a.dateEnvoi).getTime());
            return {
                success: true,
                data: logs
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    async getLogById(id) {
        try {
            const db = await databaseService.loadDatabase();
            const log = (db.emailLogs || []).find((l) => l.id === id);
            if (!log) {
                return {
                    success: false,
                    error: 'Log non trouvé'
                };
            }
            return {
                success: true,
                data: log
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    async addLog(logData) {
        try {
            const db = await databaseService.loadDatabase();
            if (!db.emailLogs) {
                db.emailLogs = [];
            }
            const newLog = {
                id: this.generateLogId(),
                ...logData,
                dateEnvoi: new Date().toISOString()
            };
            db.emailLogs.push(newLog);
            if (await databaseService.saveDatabase(db)) {
                return {
                    success: true,
                    data: newLog,
                    message: 'Log ajouté'
                };
            }
            else {
                return {
                    success: false,
                    error: 'Erreur lors de la sauvegarde'
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    async deleteLog(id) {
        try {
            const db = await databaseService.loadDatabase();
            if (!db.emailLogs) {
                return {
                    success: false,
                    error: 'Aucun log trouvé'
                };
            }
            const index = db.emailLogs.findIndex((l) => l.id === id);
            if (index === -1) {
                return {
                    success: false,
                    error: 'Log non trouvé'
                };
            }
            const deletedLog = db.emailLogs.splice(index, 1)[0];
            if (await databaseService.saveDatabase(db)) {
                return {
                    success: true,
                    data: deletedLog,
                    message: 'Log supprimé'
                };
            }
            else {
                return {
                    success: false,
                    error: 'Erreur lors de la sauvegarde'
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    async clearAllLogs() {
        try {
            const db = await databaseService.loadDatabase();
            const count = (db.emailLogs || []).length;
            db.emailLogs = [];
            if (await databaseService.saveDatabase(db)) {
                return {
                    success: true,
                    message: `${count} log(s) supprimé(s)`
                };
            }
            else {
                return {
                    success: false,
                    error: 'Erreur lors de la sauvegarde'
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    async getLogStats() {
        try {
            const db = await databaseService.loadDatabase();
            const logs = db.emailLogs || [];
            const stats = {
                total: logs.length,
                envoyes: logs.filter((l) => l.statut === 'envoyé').length,
                echecs: logs.filter((l) => l.statut === 'échec').length,
                enAttente: logs.filter((l) => l.statut === 'en_attente').length,
                dernierEnvoi: logs.length > 0 ? logs[0].dateEnvoi : null
            };
            return {
                success: true,
                data: stats
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Erreur: ${error}`
            };
        }
    }
    // === MÉTHODES PRIVÉES ===
    getDefaultConfig() {
        return {
            host: 'smtp.gmail.com',
            port: 587,
            username: '',
            password: '',
            encryption: 'tls',
            fromEmail: '',
            fromName: 'SENGP - Logistique'
        };
    }
    generateLogId() {
        return 'LOG-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
// Export de l'instance globale
export const emailService = EmailService.getInstance();
//# sourceMappingURL=EmailService.js.map