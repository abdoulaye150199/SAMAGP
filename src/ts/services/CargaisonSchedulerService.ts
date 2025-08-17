// src/ts/services/CargaisonSchedulerService.ts

import { ColisModel, type Colis } from '../models/Colis.js';
import { CargaisonModel, type Cargaison } from '../models/Cargaison.js';
import { emailService } from '../config/EmailConfig.js';
import { ApiService } from './ApiService.js';

interface ScheduledArrival {
    cargaisonId: string;
    arrivalTime: Date;
    timerId: number;
    intervalHours: number;
}

export class CargaisonSchedulerService {
    private static instance: CargaisonSchedulerService;
    private scheduledArrivals: Map<string, ScheduledArrival> = new Map();
    private colisModel: ColisModel;
    private cargaisonModel: CargaisonModel;
    private apiService: ApiService;

    private constructor() {
        this.colisModel = ColisModel.getInstance();
        this.cargaisonModel = CargaisonModel.getInstance();
        this.apiService = ApiService.getInstance();
        
        // Restaurer les timers depuis le localStorage au démarrage
        this.restoreScheduledArrivals();
    }

    public static getInstance(): CargaisonSchedulerService {
        if (!CargaisonSchedulerService.instance) {
            CargaisonSchedulerService.instance = new CargaisonSchedulerService();
        }
        return CargaisonSchedulerService.instance;
    }

    /**
     * Programmer l'arrivée d'une cargaison avec un délai en heures
     */
    public scheduleArrival(cargaisonId: string, intervalHours: number): boolean {
        try {
            // Vérifier si la cargaison existe
            const cargaison = this.cargaisonModel.getCargaisonById(cargaisonId);
            if (!cargaison) {
                console.error('Cargaison non trouvée:', cargaisonId);
                return false;
            }

            // Annuler le timer existant s'il y en a un
            this.cancelScheduledArrival(cargaisonId);

            const arrivalTime = new Date(Date.now() + intervalHours * 60 * 60 * 1000);
            const timeoutMs = intervalHours * 60 * 60 * 1000;

            console.log(`⏰ Programmation arrivée cargaison ${cargaisonId} dans ${intervalHours}h (${arrivalTime.toLocaleString()})`);

            const timerId = window.setTimeout(() => {
                this.handleCargaisonArrival(cargaisonId);
            }, timeoutMs);

            const scheduledArrival: ScheduledArrival = {
                cargaisonId,
                arrivalTime,
                timerId,
                intervalHours
            };

            this.scheduledArrivals.set(cargaisonId, scheduledArrival);
            this.saveScheduledArrivals();

            return true;
        } catch (error) {
            console.error('Erreur lors de la programmation:', error);
            return false;
        }
    }

    /**
     * Annuler l'arrivée programmée d'une cargaison
     */
    public cancelScheduledArrival(cargaisonId: string): boolean {
        const scheduled = this.scheduledArrivals.get(cargaisonId);
        if (scheduled) {
            clearTimeout(scheduled.timerId);
            this.scheduledArrivals.delete(cargaisonId);
            this.saveScheduledArrivals();
            console.log(`❌ Arrivée programmée annulée pour ${cargaisonId}`);
            return true;
        }
        return false;
    }

    /**
     * Gérer l'arrivée automatique d'une cargaison
     */
    private async handleCargaisonArrival(cargaisonId: string): Promise<void> {
        try {
            console.log(`🚢 Arrivée automatique de la cargaison ${cargaisonId}`);

            // Mettre à jour le statut de la cargaison
            const updateResult = await this.updateCargaisonStatus(cargaisonId, 'Arrivé');
            if (!updateResult.success) {
                console.error('Erreur mise à jour statut cargaison:', updateResult.error);
                return;
            }

            // Récupérer tous les colis de cette cargaison
            const allColis = this.colisModel.getColis();
            const cargaisonColis = allColis.filter(c => c.cargaisonId === cargaisonId);

            if (cargaisonColis.length > 0) {
                // Mettre à jour le statut des colis
                await this.updateColisStatuses(cargaisonColis);
                
                // Envoyer les emails d'arrivée
                await this.sendArrivalEmails(cargaisonColis);
            }

            // Nettoyer le planning
            this.scheduledArrivals.delete(cargaisonId);
            this.saveScheduledArrivals();

            console.log(`✅ Arrivée automatique terminée pour ${cargaisonId}`);
        } catch (error) {
            console.error('Erreur lors de l\'arrivée automatique:', error);
        }
    }

    /**
     * Mettre à jour le statut de la cargaison via API
     */
    private async updateCargaisonStatus(cargaisonId: string, newStatus: string): Promise<{success: boolean; error?: string}> {
        try {
            const response = await fetch('/api/cargaisons/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: cargaisonId,
                    statut: newStatus,
                    note: `Arrivée automatique programmée le ${new Date().toLocaleString()}`
                })
            });

            const result = await response.json();
            return { success: result.success, error: result.error };
        } catch (error) {
            return { success: false, error: `Erreur API: ${error}` };
        }
    }

    /**
     * Mettre à jour le statut des colis
     */
    private async updateColisStatuses(colis: Colis[]): Promise<void> {
        for (const col of colis) {
            try {
                // Mettre à jour le statut en local
                this.colisModel.updateStatus(col.trackingCode, 'arrive');
                
                // Vous pourriez aussi mettre à jour via API si nécessaire
                console.log(`📦 Statut mis à jour pour ${col.trackingCode}: arrive`);
            } catch (error) {
                console.error(`Erreur mise à jour colis ${col.trackingCode}:`, error);
            }
        }
    }

    /**
     * Envoyer les emails d'arrivée aux expéditeurs
     */
    private async sendArrivalEmails(colis: Colis[]): Promise<void> {
        console.log(`📧 Envoi de ${colis.length} emails d'arrivée...`);

        for (const col of colis) {
            try {
                // Envoyer à l'expéditeur (client)
                if (col.client.email) {
                    await this.sendArrivalEmail(col, col.client.email, col.client.nom + ' ' + col.client.prenom, 'expediteur');
                }
                
                // Envoyer aussi au destinataire
                if (col.destinataire.email) {
                    await this.sendArrivalEmail(col, col.destinataire.email, col.destinataire.nom + ' ' + col.destinataire.prenom, 'destinataire');
                }
            } catch (error) {
                console.error(`Erreur envoi email pour ${col.trackingCode}:`, error);
            }
        }
    }

    /**
     * Envoyer un email d'arrivée individuel
     */
    private async sendArrivalEmail(colis: Colis, email: string, name: string, type: 'expediteur' | 'destinataire'): Promise<void> {
        try {
            const result = await emailService.sendPackageArrival({
                recipientEmail: email,
                recipientName: name,
                trackingCode: colis.trackingCode,
                packageDetails: colis,
                recipientType: type
            });

            if (result.success) {
                console.log(`✅ Email d'arrivée envoyé à ${name} (${type})`);
            } else {
                console.error(`❌ Échec envoi email à ${name}:`, result.message);
            }
        } catch (error) {
            console.error(`Erreur envoi email à ${name}:`, error);
        }
    }

    /**
     * Obtenir les arrivées programmées
     */
    public getScheduledArrivals(): ScheduledArrival[] {
        return Array.from(this.scheduledArrivals.values());
    }

    /**
     * Vérifier le temps restant pour une cargaison
     */
    public getTimeRemaining(cargaisonId: string): { hours: number; minutes: number; seconds: number } | null {
        const scheduled = this.scheduledArrivals.get(cargaisonId);
        if (!scheduled) return null;

        const now = new Date().getTime();
        const arrival = scheduled.arrivalTime.getTime();
        const remaining = Math.max(0, arrival - now);

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    }

    /**
     * Sauvegarder les timers dans le localStorage
     */
    private saveScheduledArrivals(): void {
        try {
            const data = Array.from(this.scheduledArrivals.entries()).map(([id, scheduled]) => ({
                cargaisonId: scheduled.cargaisonId,
                arrivalTime: scheduled.arrivalTime.toISOString(),
                intervalHours: scheduled.intervalHours
            }));
            
            localStorage.setItem('scheduledArrivals', JSON.stringify(data));
        } catch (error) {
            console.error('Erreur sauvegarde timers:', error);
        }
    }

    /**
     * Restaurer les timers depuis le localStorage
     */
    private restoreScheduledArrivals(): void {
        try {
            const saved = localStorage.getItem('scheduledArrivals');
            if (!saved) return;

            const data = JSON.parse(saved);
            const now = new Date().getTime();

            for (const item of data) {
                const arrivalTime = new Date(item.arrivalTime).getTime();
                
                if (arrivalTime > now) {
                    // Le timer n'est pas encore écoulé, le reprogrammer
                    const remainingMs = arrivalTime - now;
                    const timerId = window.setTimeout(() => {
                        this.handleCargaisonArrival(item.cargaisonId);
                    }, remainingMs);

                    this.scheduledArrivals.set(item.cargaisonId, {
                        cargaisonId: item.cargaisonId,
                        arrivalTime: new Date(item.arrivalTime),
                        timerId,
                        intervalHours: item.intervalHours
                    });

                    console.log(`🔄 Timer restauré pour ${item.cargaisonId}, arrivée dans ${Math.round(remainingMs / (1000 * 60))} minutes`);
                } else {
                    // Le timer est déjà écoulé, déclencher l'arrivée immédiatement
                    console.log(`⚡ Timer écoulé pour ${item.cargaisonId}, déclenchement immédiat`);
                    this.handleCargaisonArrival(item.cargaisonId);
                }
            }
        } catch (error) {
            console.error('Erreur restauration timers:', error);
        }
    }

    /**
     * Nettoyer tous les timers (utile pour les tests)
     */
    public clearAllTimers(): void {
        for (const [id, scheduled] of this.scheduledArrivals) {
            clearTimeout(scheduled.timerId);
        }
        this.scheduledArrivals.clear();
        localStorage.removeItem('scheduledArrivals');
        console.log('🗑️ Tous les timers ont été nettoyés');
    }

    /**
     * Afficher le statut des timers (pour debugging)
     */
    public getTimersStatus(): void {
        console.log('📊 Status des timers:');
        for (const [id, scheduled] of this.scheduledArrivals) {
            const remaining = this.getTimeRemaining(id);
            console.log(`  ${id}: ${remaining?.hours}h ${remaining?.minutes}m ${remaining?.seconds}s restantes`);
        }
    }
}

// Export de l'instance globale
export const cargaisonScheduler = CargaisonSchedulerService.getInstance();
