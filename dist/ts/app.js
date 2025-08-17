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
    constructor() { }
    static getInstance() {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }
    // Initialisation de l'application selon la page
    async initialize() {
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
    async initializeDashboard() {
        const controller = DashboardController.getInstance();
        await controller.initialize();
        // Exposer globalement
        window.dashboardController = controller;
    }
    // Initialisation des cargaisons
    async initializeCargaisons() {
        const controller = CargaisonController.getInstance();
        await controller.initialize();
        // Exposer globalement
        window.cargaisonController = controller;
    }
    // Initialisation des détails de cargaison
    async initializeDetailsCargaison() {
        console.log('📋 Initialisation page détails cargaison');
        // TODO: Créer DetailsCargaisonController si nécessaire
    }
    // Initialisation du suivi carte  
    async initializeSuiviCarte() {
        const controller = SuiviCarteController.getInstance();
        await controller.initialize();
        // Exposer globalement
        window.suiviCarteController = controller;
    }
    // Initialisation de la création de cargaison
    async initializeCreationCargaison() {
        const controller = CreationCargaisonController.getInstance();
        await controller.initialize();
        // Exposer globalement
        window.creationCargaisonController = controller;
    }
    // Initialisation de la page landing
    async initializeLanding() {
        const controller = LandingController.getInstance();
        await controller.initialize();
        // Exposer globalement
        window.landingController = controller;
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
//# sourceMappingURL=app.js.map