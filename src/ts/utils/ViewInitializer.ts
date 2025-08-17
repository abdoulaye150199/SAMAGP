// src/ts/utils/ViewInitializer.ts

import { initializeTailwindConfig } from '../config/TailwindConfig.js';
import { successMessageHandler } from './SuccessMessageHandler.js';

export class ViewInitializer {
    private static instance: ViewInitializer;

    private constructor() {}

    public static getInstance(): ViewInitializer {
        if (!ViewInitializer.instance) {
            ViewInitializer.instance = new ViewInitializer();
        }
        return ViewInitializer.instance;
    }

    // Initialisation commune à toutes les vues
    public initializeCommon(): void {
        // Configuration Tailwind
        initializeTailwindConfig();
        
        // Gestion des messages de succès
        successMessageHandler.initialize();
        
        // Styles CSS globaux
        this.injectGlobalStyles();
    }

    // Injection des styles CSS globaux
    private injectGlobalStyles(): void {
        const styleId = 'global-notification-styles';
        
        // Éviter la duplication
        if (document.getElementById(styleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .notification {
                min-width: 350px;
                max-width: 450px;
                transform: translateX(100%);
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #10b981, #059669);
                animation: progress 3s linear;
            }

            @keyframes progress {
                from { width: 100%; }
                to { width: 0%; }
            }

            @keyframes pulse {
                0% { box-shadow: 0 0 10px rgba(0, 212, 170, 0.6); }
                50% { box-shadow: 0 0 20px rgba(0, 212, 170, 0.8), 0 0 30px rgba(0, 212, 170, 0.4); }
                100% { box-shadow: 0 0 10px rgba(0, 212, 170, 0.6); }
            }
            
            .leaflet-popup-content-wrapper {
                background-color: white !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
            }
            
            .leaflet-popup-tip {
                background-color: white !important;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Export de l'instance globale
export const viewInitializer = ViewInitializer.getInstance();
