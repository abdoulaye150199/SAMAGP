// src/ts/services/NotificationService.ts

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    duration?: number;
    persistent?: boolean;
}

export class NotificationService {
    private static instance: NotificationService;
    private container: HTMLElement | null = null;
    private notifications: Map<string, Notification> = new Map();

    private constructor() {
        this.createContainer();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Création du container de notifications
    private createContainer(): void {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
    }

    // Affichage d'une notification
    public show(
        type: NotificationType,
        title: string,
        message: string,
        options: {
            icon?: string;
            duration?: number;
            persistent?: boolean;
        } = {}
    ): string {
        const id = this.generateId();
        const duration = options.duration ?? (type === 'error' ? 5000 : 3000);
        const icon = options.icon ?? this.getDefaultIcon(type);

        const notification: Notification = {
            id,
            type,
            title,
            message,
            icon,
            duration,
            persistent: options.persistent ?? false
        };

        this.notifications.set(id, notification);
        this.renderNotification(notification);

        // Auto-suppression sauf si persistante
        if (!notification.persistent && duration > 0) {
            setTimeout(() => {
                this.hide(id);
            }, duration);
        }

        return id;
    }

    // Méthodes raccourcies
    public success(title: string, message: string = '', options?: any): string {
        return this.show('success', title, message, options);
    }

    public error(title: string, message: string = '', options?: any): string {
        return this.show('error', title, message, { ...options, duration: 5000 });
    }

    public warning(title: string, message: string = '', options?: any): string {
        return this.show('warning', title, message, options);
    }

    public info(title: string, message: string = '', options?: any): string {
        return this.show('info', title, message, options);
    }

    // Masquage d'une notification
    public hide(id: string): void {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const element = document.getElementById(`notification-${id}`);
        if (element) {
            element.classList.add('opacity-0', 'transform', 'translate-x-full');
            setTimeout(() => {
                element.remove();
                this.notifications.delete(id);
            }, 300);
        }
    }

    // Suppression de toutes les notifications
    public clearAll(): void {
        this.notifications.forEach((_, id) => this.hide(id));
    }

    // Rendu d'une notification
    private renderNotification(notification: Notification): void {
        if (!this.container) return;

        const colors = this.getColors(notification.type);
        
        const element = document.createElement('div');
        element.id = `notification-${notification.id}`;
        element.className = `notification ${colors.bg} ${colors.border} border-l-4 rounded-lg shadow-lg max-w-sm overflow-hidden transform transition-all duration-300 ease-out translate-x-full opacity-0`;
        
        element.innerHTML = `
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="${notification.icon} ${colors.icon} text-xl"></i>
                    </div>
                    <div class="ml-3 flex-1">
                        <h3 class="text-sm font-semibold ${colors.title}">${notification.title}</h3>
                        ${notification.message ? `<p class="text-sm ${colors.text} mt-1">${notification.message}</p>` : ''}
                    </div>
                    <button onclick="window.notificationService.hide('${notification.id}')" 
                            class="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
            ${!notification.persistent ? `<div class="progress-bar ${colors.progress}"></div>` : ''}
        `;

        this.container.appendChild(element);

        // Animation d'entrée
        setTimeout(() => {
            element.classList.remove('opacity-0', 'translate-x-full');
        }, 100);
    }

    // Couleurs selon le type
    private getColors(type: NotificationType): any {
        const colorSchemes = {
            success: {
                bg: 'bg-green-900/90',
                border: 'border-green-500',
                icon: 'text-green-400',
                title: 'text-green-300',
                text: 'text-green-200',
                progress: 'bg-green-500'
            },
            error: {
                bg: 'bg-red-900/90',
                border: 'border-red-500',
                icon: 'text-red-400',
                title: 'text-red-300',
                text: 'text-red-200',
                progress: 'bg-red-500'
            },
            warning: {
                bg: 'bg-yellow-900/90',
                border: 'border-yellow-500',
                icon: 'text-yellow-400',
                title: 'text-yellow-300',
                text: 'text-yellow-200',
                progress: 'bg-yellow-500'
            },
            info: {
                bg: 'bg-blue-900/90',
                border: 'border-blue-500',
                icon: 'text-blue-400',
                title: 'text-blue-300',
                text: 'text-blue-200',
                progress: 'bg-blue-500'
            }
        };

        return colorSchemes[type] || colorSchemes.info;
    }

    // Icônes par défaut
    private getDefaultIcon(type: NotificationType): string {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        return icons[type] || icons.info;
    }

    // Génération d'ID unique
    private generateId(): string {
        return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Notifications avec actions
    public showWithAction(
        type: NotificationType,
        title: string,
        message: string,
        actionText: string,
        actionCallback: () => void
    ): string {
        const id = this.generateId();
        const colors = this.getColors(type);

        const notification: Notification = {
            id,
            type,
            title,
            message,
            persistent: true
        };

        this.notifications.set(id, notification);

        if (!this.container) return id;

        const element = document.createElement('div');
        element.id = `notification-${id}`;
        element.className = `notification ${colors.bg} ${colors.border} border-l-4 rounded-lg shadow-lg max-w-sm overflow-hidden transform transition-all duration-300 ease-out translate-x-full opacity-0`;
        
        element.innerHTML = `
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="fas fa-question-circle ${colors.icon} text-xl"></i>
                    </div>
                    <div class="ml-3 flex-1">
                        <h3 class="text-sm font-semibold ${colors.title}">${title}</h3>
                        <p class="text-sm ${colors.text} mt-1">${message}</p>
                        <div class="mt-3 flex space-x-2">
                            <button onclick="window.notificationService.executeAction('${id}', ${actionCallback})" 
                                    class="px-3 py-1 bg-aqua text-dark text-xs font-semibold rounded hover:bg-aqua-light transition-colors">
                                ${actionText}
                            </button>
                            <button onclick="window.notificationService.hide('${id}')" 
                                    class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors">
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.appendChild(element);

        setTimeout(() => {
            element.classList.remove('opacity-0', 'translate-x-full');
        }, 100);

        return id;
    }

    public executeAction(id: string, callback: () => void): void {
        try {
            callback();
            this.hide(id);
        } catch (error) {
            console.error('Erreur exécution action:', error);
        }
    }

    // Notifications de confirmation
    public confirm(
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void
    ): string {
        return this.showWithAction('warning', title, message, 'Confirmer', () => {
            onConfirm();
            if (onCancel) onCancel();
        });
    }
}

// Instance globale
export const notificationService = NotificationService.getInstance();

// Exposition globale pour les événements inline
(window as any).notificationService = notificationService;
