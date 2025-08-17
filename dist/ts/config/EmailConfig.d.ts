export interface EmailConfiguration {
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    from: {
        name: string;
        email: string;
    };
    templates: {
        baseUrl: string;
        trackingUrl: string;
    };
    settings: {
        enableEmailSending: boolean;
        logEmails: boolean;
        retryAttempts: number;
    };
}
export declare const emailConfig: EmailConfiguration;
export interface EmailData {
    to: string;
    name: string;
    subject: string;
    template: 'confirmation' | 'arrival';
    data: {
        trackingCode: string;
        shipmentData?: any;
        packageData?: any;
    };
}
export declare class EmailService {
    private config;
    constructor(config?: Partial<EmailConfiguration>);
    /**
     * Envoyer un email de confirmation de colis
     */
    sendPackageConfirmation(emailData: {
        recipientEmail: string;
        recipientName: string;
        trackingCode: string;
        packageDetails: any;
        senderName: string;
    }): Promise<{
        success: boolean;
        message: string;
        emailSent: boolean;
    }>;
    /**
     * Envoyer un email d'arrivée de colis individuel
     */
    sendPackageArrival(emailData: {
        recipientEmail: string;
        recipientName: string;
        trackingCode: string;
        packageDetails: any;
        recipientType: 'expediteur' | 'destinataire';
    }): Promise<{
        success: boolean;
        message: string;
        emailSent: boolean;
    }>;
    /**
     * Envoyer des emails d'arrivée de cargaison
     */
    sendShipmentArrivalNotifications(shipmentData: any, packages: any[]): Promise<{
        success: boolean;
        totalSent: number;
        totalPackages: number;
        errors: string[];
    }>;
    /**
     * Méthode principale d'envoi d'email
     */
    private sendEmail;
    /**
     * Logger l'email (pour les logs locaux)
     */
    private logEmail;
    /**
     * Tester la configuration email
     */
    testEmailConfiguration(): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Mettre à jour la configuration
     */
    updateConfig(newConfig: Partial<EmailConfiguration>): void;
    /**
     * Obtenir la configuration actuelle
     */
    getConfig(): EmailConfiguration;
}
export declare const emailService: EmailService;
export interface FormEmailData {
    client: {
        nom: string;
        prenom: string;
        email?: string;
    };
    destinataire: {
        nom: string;
        prenom: string;
        email?: string;
    };
    trackingCode: string;
    packageDetails: any;
}
/**
 * Fonction utilitaire pour envoyer l'email de confirmation depuis les formulaires
 */
export declare function sendPackageConfirmationEmail(formData: FormEmailData): Promise<{
    success: boolean;
    message: string;
    emailSent: boolean;
}>;
//# sourceMappingURL=EmailConfig.d.ts.map