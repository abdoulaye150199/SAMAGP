// src/ts/endpoints/EmailEndpoint.ts
import { emailService } from '../services/EmailService';
export class EmailEndpoint {
    static async handle(request) {
        try {
            const pathParts = request.url.split('/').filter(part => part);
            const action = pathParts[2]; // config, logs, etc.
            const id = pathParts[3]; // ID spécifique si présent
            switch (request.method) {
                case 'GET':
                    return await this.handleGet(action, id, request.query);
                case 'POST':
                    return await this.handlePost(action, request.body);
                case 'PUT':
                    return await this.handlePut(action, id, request.body);
                case 'DELETE':
                    return await this.handleDelete(action, id);
                default:
                    return this.errorResponse('Méthode non supportée', 405);
            }
        }
        catch (error) {
            return this.errorResponse(`Erreur serveur: ${error}`, 500);
        }
    }
    static async handleGet(action, id, query) {
        switch (action) {
            case 'config':
                const configResult = await emailService.getConfig();
                return this.successResponse(configResult);
            case 'logs':
                if (id) {
                    const logResult = await emailService.getLogById(id);
                    return this.successResponse(logResult);
                }
                else if (query?.stats === 'true') {
                    const statsResult = await emailService.getLogStats();
                    return this.successResponse(statsResult);
                }
                else {
                    const logsResult = await emailService.getAllLogs();
                    return this.successResponse(logsResult);
                }
            case 'test':
                const testResult = await emailService.testConfig();
                return this.successResponse(testResult);
            default:
                return this.errorResponse('Action non reconnue', 400);
        }
    }
    static async handlePost(action, body) {
        switch (action) {
            case 'logs':
                if (!body) {
                    return this.errorResponse('Données requises', 400);
                }
                const addResult = await emailService.addLog(body);
                return this.successResponse(addResult);
            default:
                return this.errorResponse('Action non supportée pour POST', 400);
        }
    }
    static async handlePut(action, id, body) {
        switch (action) {
            case 'config':
                if (!body) {
                    return this.errorResponse('Données de configuration requises', 400);
                }
                const updateResult = await emailService.updateConfig(body);
                return this.successResponse(updateResult);
            default:
                return this.errorResponse('Action non supportée pour PUT', 400);
        }
    }
    static async handleDelete(action, id) {
        switch (action) {
            case 'logs':
                if (id === 'all') {
                    const clearResult = await emailService.clearAllLogs();
                    return this.successResponse(clearResult);
                }
                else if (id) {
                    const deleteResult = await emailService.deleteLog(id);
                    return this.successResponse(deleteResult);
                }
                else {
                    return this.errorResponse('ID requis pour la suppression', 400);
                }
            default:
                return this.errorResponse('Action non supportée pour DELETE', 400);
        }
    }
    static successResponse(data) {
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            body: data
        };
    }
    static errorResponse(message, status = 400) {
        return {
            status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                success: false,
                error: message
            }
        };
    }
}
//# sourceMappingURL=EmailEndpoint.js.map