// src/ts/config/EmailConfig.ts

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

export const emailConfig: EmailConfiguration = {
    smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true pour port 465, false pour autres ports
        auth: {
            user: 'laye24281@gmail.com', // Remplacez par votre email
            pass: 'Laye@150199' // Remplacez par votre mot de passe d'application Gmail
        }
    },
    from: {
        name: 'YONIMA Transport',
        email: 'noreply@yonima.com'
    },
    templates: {
        baseUrl: 'https://yonima.com',
        trackingUrl: 'https://yonima.com/suivi-colis'
    },
    settings: {
        enableEmailSending: true, // Mettre à true pour envoyer réellement les emails
        logEmails: true,
        retryAttempts: 3
    }
};

// Type pour les données d'email
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

// Service d'email TypeScript
export class EmailService {
    private config: EmailConfiguration;

    constructor(config?: Partial<EmailConfiguration>) {
        this.config = { ...emailConfig, ...config };
    }

    /**
     * Envoyer un email de confirmation de colis
     */
    async sendPackageConfirmation(emailData: {
        recipientEmail: string;
        recipientName: string;
        trackingCode: string;
        packageDetails: any;
        senderName: string;
    }): Promise<{ success: boolean; message: string; emailSent: boolean }> {
        try {
            const emailPayload = {
                to: emailData.recipientEmail,
                name: emailData.recipientName,
                subject: `Confirmation d'enregistrement - Code: ${emailData.trackingCode}`,
                template: 'confirmation' as const,
                data: {
                    trackingCode: emailData.trackingCode,
                    packageData: {
                        senderName: emailData.senderName,
                        recipientName: emailData.recipientName,
                        description: emailData.packageDetails.description || 'Non spécifiée',
                        weight: emailData.packageDetails.poids,
                        value: emailData.packageDetails.valeurDeclaree || '0',
                        trackingUrl: `${this.config.templates.trackingUrl}?code=${emailData.trackingCode}`
                    }
                }
            };

            const result = await this.sendEmail(emailPayload);
            return result;
        } catch (error) {
            console.error('Erreur envoi email confirmation:', error);
            return {
                success: false,
                message: `Erreur: ${error}`,
                emailSent: false
            };
        }
    }

    /**
     * Envoyer un email d'arrivée de colis individuel
     */
    async sendPackageArrival(emailData: {
        recipientEmail: string;
        recipientName: string;
        trackingCode: string;
        packageDetails: any;
        recipientType: 'expediteur' | 'destinataire';
    }): Promise<{ success: boolean; message: string; emailSent: boolean }> {
        try {
            const emailPayload = {
                to: emailData.recipientEmail,
                name: emailData.recipientName,
                subject: `🚢 Votre colis est arrivé ! - Code: ${emailData.trackingCode}`,
                template: 'arrival' as const,
                data: {
                    trackingCode: emailData.trackingCode,
                    packageData: {
                        ...emailData.packageDetails,
                        recipientType: emailData.recipientType,
                        arrivalDate: new Date().toLocaleDateString('fr-FR'),
                        arrivalTime: new Date().toLocaleTimeString('fr-FR'),
                        trackingUrl: `${this.config.templates.trackingUrl}?code=${emailData.trackingCode}`
                    }
                }
            };

            const result = await this.sendEmail(emailPayload);
            return result;
        } catch (error) {
            console.error('Erreur envoi email arrivée:', error);
            return {
                success: false,
                message: `Erreur: ${error}`,
                emailSent: false
            };
        }
    }

    /**
     * Envoyer des emails d'arrivée de cargaison
     */
    async sendShipmentArrivalNotifications(shipmentData: any, packages: any[]): Promise<{
        success: boolean;
        totalSent: number;
        totalPackages: number;
        errors: string[];
    }> {
        const results = {
            success: true,
            totalSent: 0,
            totalPackages: packages.length,
            errors: [] as string[]
        };

        for (const pkg of packages) {
            if (pkg.destinataire?.email) {
                try {
                    const emailPayload = {
                        to: pkg.destinataire.email,
                        name: `${pkg.destinataire.nom} ${pkg.destinataire.prenom}`,
                        subject: `Votre colis est arrivé! - Code: ${pkg.trackingCode}`,
                        template: 'arrival' as const,
                        data: {
                            trackingCode: pkg.trackingCode,
                            shipmentData: shipmentData,
                            packageData: pkg
                        }
                    };

                    const emailResult = await this.sendEmail(emailPayload);
                    if (emailResult.success) {
                        results.totalSent++;
                    } else {
                        results.errors.push(`${pkg.trackingCode}: ${emailResult.message}`);
                    }
                } catch (error) {
                    results.errors.push(`${pkg.trackingCode}: ${error}`);
                }
            }
        }

        results.success = results.errors.length === 0;
        return results;
    }

    /**
     * Méthode principale d'envoi d'email
     */
    private async sendEmail(emailData: EmailData): Promise<{ success: boolean; message: string; emailSent: boolean }> {
        try {
            // Si l'envoi réel est désactivé, juste logger
            if (!this.config.settings.enableEmailSending) {
                this.logEmail(emailData);
                return {
                    success: true,
                    message: 'Email simulé avec succès',
                    emailSent: false
                };
            }

            // Envoyer l'email via l'API PHP
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config: this.config,
                    emailData: emailData
                })
            });

            const result = await response.json();
            
            if (result.success) {
                if (this.config.settings.logEmails) {
                    this.logEmail(emailData);
                }
                return {
                    success: true,
                    message: 'Email envoyé avec succès',
                    emailSent: true
                };
            } else {
                throw new Error(result.message || 'Erreur inconnue');
            }
        } catch (error) {
            console.error('Erreur envoi email:', error);
            return {
                success: false,
                message: `Erreur: ${error}`,
                emailSent: false
            };
        }
    }

    /**
     * Logger l'email (pour les logs locaux)
     */
    private logEmail(emailData: EmailData): void {
        const logEntry = {
            timestamp: new Date().toISOString(),
            to: emailData.to,
            name: emailData.name,
            subject: emailData.subject,
            template: emailData.template,
            trackingCode: emailData.data.trackingCode
        };

        console.log('📧 Email Log:', logEntry);
        
        // Envoyer au système de logs via API
        fetch('/api/log-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logEntry)
        }).catch(err => console.error('Erreur log email:', err));
    }

    /**
     * Tester la configuration email
     */
    async testEmailConfiguration(): Promise<{ success: boolean; message: string }> {
        try {
            const testEmail = {
                to: this.config.smtp.auth.user,
                name: 'Test YONIMA',
                subject: 'Test de configuration email - YONIMA',
                template: 'confirmation' as const,
                data: {
                    trackingCode: 'TEST123',
                    packageData: {
                        senderName: 'Test Sender',
                        recipientName: 'Test Recipient',
                        description: 'Email de test',
                        weight: '1',
                        value: '100'
                    }
                }
            };

            const result = await this.sendEmail(testEmail);
            return result;
        } catch (error) {
            return {
                success: false,
                message: `Erreur test: ${error}`
            };
        }
    }

    /**
     * Mettre à jour la configuration
     */
    updateConfig(newConfig: Partial<EmailConfiguration>): void {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Obtenir la configuration actuelle
     */
    getConfig(): EmailConfiguration {
        return { ...this.config };
    }
}

// Instance globale du service email
export const emailService = new EmailService();

// Interface pour l'intégration avec les formulaires
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
export async function sendPackageConfirmationEmail(formData: FormEmailData): Promise<{
    success: boolean;
    message: string;
    emailSent: boolean;
}> {
    if (!formData.destinataire.email) {
        return {
            success: true,
            message: 'Aucun email de destinataire fourni',
            emailSent: false
        };
    }

    return await emailService.sendPackageConfirmation({
        recipientEmail: formData.destinataire.email,
        recipientName: `${formData.destinataire.nom} ${formData.destinataire.prenom}`,
        trackingCode: formData.trackingCode,
        packageDetails: formData.packageDetails,
        senderName: `${formData.client.nom} ${formData.client.prenom}`
    });
}
