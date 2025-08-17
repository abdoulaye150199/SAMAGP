// src/ts/app.ts
// Point d'entrée principal de l'application

import { viewInitializer } from './utils/ViewInitializer.js';
import { DashboardController } from './controllers/DashboardController.js';
import { CargaisonController } from './controllers/CargaisonController.js';
import { SuiviCarteController } from './controllers/SuiviCarteController.js';
import { CreationCargaisonController } from './controllers/CreationCargaisonController.js';
import { LandingController } from './controllers/LandingController.js';
import { cargaisonScheduler } from './services/CargaisonSchedulerService.js';

// Initialisation globale de l'application
export class App {
    private static instance: App;

    private constructor() {}

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    // Initialisation de l'application selon la page
    public async initialize(): Promise<void> {
        // Initialisation commune
        viewInitializer.initializeCommon();
        
        // Initialiser le scheduler automatiquement
        console.log('⏰ Initialisation du scheduler de cargaisons');
        
        // Initialisation spécifique selon la page
        const currentPath = window.location.pathname;
        
        console.log('🚀 Initialisation de l\'app pour:', currentPath);
        
        switch (currentPath) {
            case '/':
            case '/index':
                await this.initializeLanding();
                break;
            case '/dashboard':
                await this.initializeDashboard();
                break;
            case '/cargaisons':
                await this.initializeCargaisons();
                break;
            case '/details-cargaison':
                await this.initializeDetailsCargaison();
                break;
            case '/suivi-carte':
                await this.initializeSuiviCarte();
                break;
            case '/creation-cargaison':
                await this.initializeCreationCargaison();
                break;
            default:
                console.log('📄 Page sans contrôleur spécifique');
        }
    }

    // Initialisation du dashboard
    private async initializeDashboard(): Promise<void> {
        const controller = DashboardController.getInstance();
        await controller.initialize();
        
        // Exposer globalement
        (window as any).dashboardController = controller;
    }

    // Initialisation des cargaisons
    private async initializeCargaisons(): Promise<void> {
        const controller = CargaisonController.getInstance();
        await controller.initialize();
        
        // Exposer globalement
        (window as any).cargaisonController = controller;
    }

    // Initialisation des détails de cargaison
    private async initializeDetailsCargaison(): Promise<void> {
        console.log('📋 Initialisation page détails cargaison');
        // TODO: Créer DetailsCargaisonController si nécessaire
    }

    // Initialisation du suivi carte  
    private async initializeSuiviCarte(): Promise<void> {
        const controller = SuiviCarteController.getInstance();
        await controller.initialize();
        
        // Exposer globalement
        (window as any).suiviCarteController = controller;
    }

    // Initialisation de la création de cargaison
    private async initializeCreationCargaison(): Promise<void> {
        const controller = CreationCargaisonController.getInstance();
        await controller.initialize();
        
        // Exposer globalement
        (window as any).creationCargaisonController = controller;
    }

    // Initialisation de la page landing
    private async initializeLanding(): Promise<void> {
        const controller = LandingController.getInstance();
        await controller.initialize();
        
        // Exposer globalement
        (window as any).landingController = controller;
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    const app = App.getInstance();
    app.initialize().catch(error => {
        console.error('Erreur initialisation app:', error);
    });
});

// Export de l'instance globale
export const app = App.getInstance();
