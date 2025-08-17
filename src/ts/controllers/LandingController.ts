// src/ts/controllers/LandingController.ts

import { ColisModel } from '../models/Colis.js';
import { NotificationService } from '../services/NotificationService.js';

export class LandingController {
    private static instance: LandingController;
    private colisModel: ColisModel;
    private notificationService: NotificationService;

    private constructor() {
        this.colisModel = ColisModel.getInstance();
        this.notificationService = NotificationService.getInstance();
    }

    public static getInstance(): LandingController {
        if (!LandingController.instance) {
            LandingController.instance = new LandingController();
        }
        return LandingController.instance;
    }

    public async initialize(): Promise<void> {
        console.log('🏠 Initialisation Landing Controller');
        
        // Exposer les fonctions globalement
        (window as any).trackPackage = this.trackPackage.bind(this);
        (window as any).printPackageInfo = this.printPackageInfo.bind(this);
        
        // Charger les colis depuis l'API
        await this.loadColis();
    }

    private async loadColis(): Promise<void> {
        try {
            console.log('📡 Chargement des colis depuis l\'API...');
            const response = await fetch('/api/colis');
            console.log('📡 Réponse API:', response.status, response.statusText);
            
            if (response.ok) {
                const result = await response.json();
                console.log('📡 Données reçues:', result);
                
                const colis = result.success && Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
                console.log('📦 Colis à charger:', colis);
                
                this.colisModel.setColis(colis);
                console.log('✅ Colis chargés en mémoire:', this.colisModel.getColis().length);
            } else {
                console.error('❌ Erreur API:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des colis:', error);
        }
    }

    public async trackPackage(event: Event): Promise<void> {
        event.preventDefault();
        
        console.log('🔍 trackPackage appelée');
        
        const trackingCodeInput = document.getElementById('tracking-code') as HTMLInputElement;
        const trackButton = document.getElementById('track-button') as HTMLButtonElement;
        const buttonText = document.getElementById('button-text') as HTMLElement;
        const loadingSpinner = document.getElementById('loading-spinner') as HTMLElement;
        
        console.log('Elements trouvés:', { trackingCodeInput, trackButton, buttonText, loadingSpinner });
        
        if (!trackingCodeInput || !trackingCodeInput.value.trim()) {
            this.notificationService.show('error', 'Erreur', 'Veuillez entrer un code de suivi', { icon: 'fas fa-exclamation-circle' });
            return;
        }

        const trackingCode = trackingCodeInput.value.trim().toUpperCase();
        console.log('🏷️ Code de suivi recherché:', trackingCode);
        
        // Animation du bouton
        trackButton.disabled = true;
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        try {
            // Rechercher le colis
            const colis = this.colisModel.getColisByTrackingCode(trackingCode);
            console.log('📦 Colis trouvé:', colis);
            console.log('📋 Tous les colis en mémoire:', this.colisModel.getColis());
            
            if (colis) {
                console.log('✅ Affichage des informations du colis');
                this.displayPackageInfo(colis);
                this.showProgressSection(colis);
            } else {
                console.log('❌ Aucun colis trouvé');
                this.notificationService.show('error', 'Non trouvé', 'Aucun colis trouvé avec ce code de suivi', { icon: 'fas fa-search' });
                this.hideResults();
            }
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            this.notificationService.show('error', 'Erreur', 'Erreur lors de la recherche du colis', { icon: 'fas fa-exclamation-circle' });
            this.hideResults();
        } finally {
            // Restaurer le bouton
            setTimeout(() => {
                trackButton.disabled = false;
                buttonText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            }, 500);
        }
    }

    private displayPackageInfo(colis: any): void {
        const packageInfoDesktop = document.getElementById('package-info');
        const packageInfoMobile = document.getElementById('package-info-mobile');
        const trackingResultDesktop = document.getElementById('tracking-result');
        const trackingResultMobile = document.getElementById('tracking-result-mobile');

        const statusColor = this.getStatusColor(colis.statut);
        const statusIcon = this.getStatusIcon(colis.statut);

        const infoHtml = `
            <div class="space-y-4">
                <div class="bg-slate-700 rounded-lg p-4 border border-gray-600">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm text-gray-400">Code de suivi</span>
                        <span class="font-mono text-emerald-400 font-bold">${colis.trackingCode}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-400">Statut</span>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${statusColor}">
                            <i class="fas ${statusIcon} mr-1"></i>${colis.statut}
                        </span>
                    </div>
                </div>

                <div class="bg-slate-700 rounded-lg p-4 border border-gray-600">
                    <h5 class="text-emerald-400 font-semibold mb-3">Informations Expéditeur</h5>
                    <p class="text-white"><strong>${colis.client.prenom} ${colis.client.nom}</strong></p>
                    <p class="text-gray-400 text-sm">${colis.client.telephone}</p>
                    <p class="text-gray-400 text-sm">${colis.client.adresse}</p>
                </div>

                <div class="bg-slate-700 rounded-lg p-4 border border-gray-600">
                    <h5 class="text-emerald-400 font-semibold mb-3">Informations Destinataire</h5>
                    <p class="text-white"><strong>${colis.destinataire.prenom} ${colis.destinataire.nom}</strong></p>
                    <p class="text-gray-400 text-sm">${colis.destinataire.telephone}</p>
                    <p class="text-gray-400 text-sm">${colis.destinataire.adresse}</p>
                </div>

                <div class="bg-slate-700 rounded-lg p-4 border border-gray-600">
                    <h5 class="text-emerald-400 font-semibold mb-3">Détails du Colis</h5>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-gray-400 text-sm">Poids</p>
                            <p class="text-white font-semibold">${colis.poids} kg</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-sm">Type</p>
                            <p class="text-white font-semibold">${colis.typeProduit}</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-sm">Prix</p>
                            <p class="text-white font-semibold">${colis.prix} FCFA</p>
                        </div>
                        <div>
                            <p class="text-gray-400 text-sm">Date</p>
                            <p class="text-white font-semibold">${new Date(colis.dateCreation).toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (packageInfoDesktop) packageInfoDesktop.innerHTML = infoHtml;
        if (packageInfoMobile) packageInfoMobile.innerHTML = infoHtml;
        
        if (trackingResultDesktop) trackingResultDesktop.classList.remove('hidden');
        if (trackingResultMobile) trackingResultMobile.classList.remove('hidden');
        
        // Afficher les boutons d'impression
        const printSection = document.getElementById('print-section');
        const printSectionMobile = document.getElementById('print-section-mobile');
        if (printSection) printSection.classList.remove('hidden');
        if (printSectionMobile) printSectionMobile.classList.remove('hidden');
        
        // Préparer le contenu pour l'impression
        this.preparePrintContent(colis);
    }

    private showProgressSection(colis: any): void {
        const progressSection = document.getElementById('progress-section');
        if (!progressSection) return;

        // Calculer un pourcentage basé sur le statut
        let progressPercentage = 0;
        switch (colis.statut.toLowerCase()) {
            case 'en-attente': progressPercentage = 15; break;
            case 'en-cours': progressPercentage = 65; break;
            case 'arrive': progressPercentage = 90; break;
            case 'livre': progressPercentage = 100; break;
            case 'recupere': progressPercentage = 100; break;
            default: progressPercentage = 10;
        }

        // Mettre à jour les éléments de progression
        const progressBar = document.getElementById('progress-bar');
        const progressValue = document.getElementById('progress-value');
        const progressPercentElement = document.getElementById('progress-percent');

        if (progressBar) progressBar.style.width = `${progressPercentage}%`;
        if (progressValue) progressValue.textContent = `${progressPercentage}%`;
        if (progressPercentElement) progressPercentElement.textContent = `${progressPercentage}%`;

        progressSection.classList.remove('hidden');
    }

    private hideResults(): void {
        const trackingResultDesktop = document.getElementById('tracking-result');
        const trackingResultMobile = document.getElementById('tracking-result-mobile');
        const progressSection = document.getElementById('progress-section');
        const printSection = document.getElementById('print-section');
        const printSectionMobile = document.getElementById('print-section-mobile');
        
        if (trackingResultDesktop) trackingResultDesktop.classList.add('hidden');
        if (trackingResultMobile) trackingResultMobile.classList.add('hidden');
        if (progressSection) progressSection.classList.add('hidden');
        if (printSection) printSection.classList.add('hidden');
        if (printSectionMobile) printSectionMobile.classList.add('hidden');
    }

    private getStatusColor(statut: string): string {
        switch (statut.toLowerCase()) {
            case 'en-attente': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'en-cours': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'arrive': return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'livre': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'recupere': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'perdu': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    }

    private getStatusIcon(statut: string): string {
        switch (statut.toLowerCase()) {
            case 'en-attente': return 'fa-clock';
            case 'en-cours': return 'fa-shipping-fast';
            case 'arrive': return 'fa-map-marker-alt';
            case 'livre': return 'fa-check-circle';
            case 'recupere': return 'fa-check-double';
            case 'perdu': return 'fa-exclamation-triangle';
            default: return 'fa-question-circle';
        }
    }

    private preparePrintContent(colis: any): void {
        const printContainer = document.getElementById('package-info-print');
        if (!printContainer) return;

        const statusColor = this.getStatusColor(colis.statut);
        const statusIcon = this.getStatusIcon(colis.statut);

        const printHtml = `
            <div style="padding: 20px; font-family: Arial, sans-serif; color: #000; background: #fff;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 15px;">
                    <h1 style="margin: 0; color: #10b981; font-size: 24px;">YONI MA - Informations de Suivi</h1>
                    <p style="margin: 5px 0; color: #666;">Logistique & Transport</p>
                </div>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <p style="margin: 0; font-size: 14px; color: #666;">Code de suivi</p>
                            <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #10b981;">${colis.trackingCode}</p>
                        </div>
                        <div>
                            <p style="margin: 0; font-size: 14px; color: #666;">Statut</p>
                            <p style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #333;">${colis.statut}</p>
                        </div>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; height: 100%;">
                                <h3 style="margin: 0 0 15px 0; color: #10b981; font-size: 16px;">Expéditeur</h3>
                                <p style="margin: 5px 0; font-weight: bold;">${colis.client.prenom} ${colis.client.nom}</p>
                                <p style="margin: 5px 0; color: #666;">${colis.client.telephone}</p>
                                <p style="margin: 5px 0; color: #666;">${colis.client.adresse}</p>
                                ${colis.client.email ? `<p style="margin: 5px 0; color: #666;">${colis.client.email}</p>` : ''}
                            </div>
                        </td>
                        <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; height: 100%;">
                                <h3 style="margin: 0 0 15px 0; color: #10b981; font-size: 16px;">Destinataire</h3>
                                <p style="margin: 5px 0; font-weight: bold;">${colis.destinataire.prenom} ${colis.destinataire.nom}</p>
                                <p style="margin: 5px 0; color: #666;">${colis.destinataire.telephone}</p>
                                <p style="margin: 5px 0; color: #666;">${colis.destinataire.adresse}</p>
                                ${colis.destinataire.email ? `<p style="margin: 5px 0; color: #666;">${colis.destinataire.email}</p>` : ''}
                            </div>
                        </td>
                    </tr>
                </table>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #10b981; font-size: 16px;">Détails du Colis</h3>
                    <table style="width: 100%;">
                        <tr>
                            <td style="padding: 5px 0;"><strong>Nombre de colis:</strong></td>
                            <td style="padding: 5px 0;">${colis.nombreColis}</td>
                            <td style="padding: 5px 0;"><strong>Poids:</strong></td>
                            <td style="padding: 5px 0;">${colis.poids} kg</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0;"><strong>Type de produit:</strong></td>
                            <td style="padding: 5px 0;">${colis.typeProduit}</td>
                            <td style="padding: 5px 0;"><strong>Type de cargaison:</strong></td>
                            <td style="padding: 5px 0;">${colis.typeCargaison}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0;"><strong>Prix:</strong></td>
                            <td style="padding: 5px 0;">${colis.prix} FCFA</td>
                            <td style="padding: 5px 0;"><strong>Date de création:</strong></td>
                            <td style="padding: 5px 0;">${new Date(colis.dateCreation).toLocaleDateString('fr-FR')}</td>
                        </tr>
                        ${colis.valeurDeclaree ? `
                        <tr>
                            <td style="padding: 5px 0;"><strong>Valeur déclarée:</strong></td>
                            <td style="padding: 5px 0;">${colis.valeurDeclaree} FCFA</td>
                            <td colspan="2"></td>
                        </tr>` : ''}
                    </table>
                    ${colis.description ? `<p style="margin: 15px 0 0 0;"><strong>Description:</strong> ${colis.description}</p>` : ''}
                </div>

                <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                    <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
                    <p>YONI MA - Logistique & Transport</p>
                </div>
            </div>
        `;

        printContainer.innerHTML = printHtml;
    }

    public printPackageInfo(): void {
        const printContainer = document.getElementById('package-info-print');
        if (!printContainer || !printContainer.innerHTML.trim()) {
            this.notificationService.show('error', 'Erreur', 'Aucune information à imprimer', { icon: 'fas fa-exclamation-circle' });
            return;
        }

        // Créer une nouvelle fenêtre pour l'impression
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            this.notificationService.show('error', 'Erreur', 'Impossible d\'ouvrir la fenêtre d\'impression', { icon: 'fas fa-exclamation-circle' });
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Impression - Suivi de Colis ${document.querySelector('[data-tracking-code]')?.getAttribute('data-tracking-code') || ''}</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none !important; }
                    }
                    body { font-family: Arial, sans-serif; }
                </style>
            </head>
            <body>
                ${printContainer.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        
        // Attendre que le contenu soit chargé puis imprimer
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 100);

        this.notificationService.show('success', 'Impression', 'Document envoyé à l\'imprimante', { icon: 'fas fa-print' });
    }
}

// Export de l'instance globale
export const landingController = LandingController.getInstance();
