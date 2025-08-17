interface ScheduledArrival {
    cargaisonId: string;
    arrivalTime: Date;
    timerId: number;
    intervalHours: number;
}
export declare class CargaisonSchedulerService {
    private static instance;
    private scheduledArrivals;
    private colisModel;
    private cargaisonModel;
    private apiService;
    private constructor();
    static getInstance(): CargaisonSchedulerService;
    /**
     * Programmer l'arrivée d'une cargaison avec un délai en heures
     */
    scheduleArrival(cargaisonId: string, intervalHours: number): boolean;
    /**
     * Annuler l'arrivée programmée d'une cargaison
     */
    cancelScheduledArrival(cargaisonId: string): boolean;
    /**
     * Gérer l'arrivée automatique d'une cargaison
     */
    private handleCargaisonArrival;
    /**
     * Mettre à jour le statut de la cargaison via API
     */
    private updateCargaisonStatus;
    /**
     * Mettre à jour le statut des colis
     */
    private updateColisStatuses;
    /**
     * Envoyer les emails d'arrivée aux expéditeurs
     */
    private sendArrivalEmails;
    /**
     * Envoyer un email d'arrivée individuel
     */
    private sendArrivalEmail;
    /**
     * Obtenir les arrivées programmées
     */
    getScheduledArrivals(): ScheduledArrival[];
    /**
     * Vérifier le temps restant pour une cargaison
     */
    getTimeRemaining(cargaisonId: string): {
        hours: number;
        minutes: number;
        seconds: number;
    } | null;
    /**
     * Sauvegarder les timers dans le localStorage
     */
    private saveScheduledArrivals;
    /**
     * Restaurer les timers depuis le localStorage
     */
    private restoreScheduledArrivals;
    /**
     * Nettoyer tous les timers (utile pour les tests)
     */
    clearAllTimers(): void;
    /**
     * Afficher le statut des timers (pour debugging)
     */
    getTimersStatus(): void;
}
export declare const cargaisonScheduler: CargaisonSchedulerService;
export {};
//# sourceMappingURL=CargaisonSchedulerService.d.ts.map