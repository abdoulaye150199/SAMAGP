// src/ts/utils/SuccessMessageHandler.ts

import { notifications } from './NotificationSystem.js';

export interface SuccessMessage {
    type: string;
    title: string;
    message: string;
    icon: string;
}

export class SuccessMessageHandler {
    private static instance: SuccessMessageHandler;

    private constructor() {}

    public static getInstance(): SuccessMessageHandler {
        if (!SuccessMessageHandler.instance) {
            SuccessMessageHandler.instance = new SuccessMessageHandler();
        }
        return SuccessMessageHandler.instance;
    }

    // Initialiser et traiter les messages de succès
    public initialize(): void {
        this.processSuccessMessage();
    }

    // Traiter les messages de succès depuis le serveur
    private processSuccessMessage(): void {
        const successDataScript = document.getElementById('successMessageData');
        
        if (successDataScript) {
            try {
                const successData: SuccessMessage = JSON.parse(successDataScript.textContent || '{}');
                
                if (successData.title && successData.message) {
                    notifications.show({
                        type: this.mapTypeToNotificationType(successData.type),
                        title: successData.title,
                        message: successData.message,
                        icon: successData.icon
                    });
                }
                
                // Supprimer le script après traitement
                successDataScript.remove();
            } catch (error) {
                console.error('Erreur traitement message de succès:', error);
            }
        }
    }

    // Mapper les types de messages aux types de notifications
    private mapTypeToNotificationType(type: string): 'success' | 'error' | 'warning' | 'info' {
        const typeMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
            'success': 'success',
            'error': 'error',
            'warning': 'warning',
            'info': 'info',
            'cargaison_created': 'success',
            'cargaison_updated': 'success',
            'colis_created': 'success'
        };
        
        return typeMap[type] || 'info';
    }
}

// Export de l'instance globale
export const successMessageHandler = SuccessMessageHandler.getInstance();
