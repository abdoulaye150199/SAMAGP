// src/ts/utils/NotificationSystem.ts

export interface NotificationData {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    icon?: string;
}

export class NotificationSystem {
    private static instance: NotificationSystem;

    private constructor() {}

    public static getInstance(): NotificationSystem {
        if (!NotificationSystem.instance) {
            NotificationSystem.instance = new NotificationSystem();
        }
        return NotificationSystem.instance;
    }

    // Créer une notification
    public show(notification: NotificationData): void {
        const container = this.getOrCreateContainer();
        const notificationElement = this.createNotificationElement(notification);
        
        container.appendChild(notificationElement);
        
        // Animation d'entrée
        setTimeout(() => {
            notificationElement.classList.add('show');
        }, 100);
        
        // Auto-suppression après 3 secondes
        setTimeout(() => {
            this.remove(notificationElement);
        }, 3000);
    }

    // Créer le conteneur de notifications
    private getOrCreateContainer(): HTMLElement {
        let container = document.getElementById('notificationContainer');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            `;
            document.body.appendChild(container);
        }
        
        return container;
    }

    // Créer l'élément de notification
    private createNotificationElement(notification: NotificationData): HTMLElement {
        const element = document.createElement('div');
        element.className = `notification bg-${this.getColorClass(notification.type)}-900/90 border border-${this.getColorClass(notification.type)}-500/30 backdrop-blur-sm rounded-xl p-4 mb-3 text-white shadow-2xl`;
        
        const iconClass = notification.icon || this.getDefaultIcon(notification.type);
        
        element.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="fas fa-${iconClass} text-${this.getColorClass(notification.type)}-400 text-lg"></i>
                </div>
                <div class="ml-3 flex-1">
                    <div class="text-sm font-medium">${notification.title}</div>
                    <div class="text-sm text-gray-300 mt-1">${notification.message}</div>
                </div>
                <button class="ml-3 text-gray-400 hover:text-white transition-colors" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="progress-bar"></div>
        `;
        
        return element;
    }

    // Supprimer une notification
    private remove(element: HTMLElement): void {
        element.classList.add('hide');
        setTimeout(() => {
            element.remove();
        }, 400);
    }

    // Utilitaires
    private getColorClass(type: string): string {
        const colors: Record<string, string> = {
            'success': 'green',
            'error': 'red',
            'warning': 'yellow',
            'info': 'blue'
        };
        return colors[type] || 'blue';
    }

    private getDefaultIcon(type: string): string {
        const icons: Record<string, string> = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Méthodes de convenance
    public success(title: string, message: string): void {
        this.show({ type: 'success', title, message });
    }

    public error(title: string, message: string): void {
        this.show({ type: 'error', title, message });
    }

    public warning(title: string, message: string): void {
        this.show({ type: 'warning', title, message });
    }

    public info(title: string, message: string): void {
        this.show({ type: 'info', title, message });
    }
}

// Export de l'instance globale
export const notifications = NotificationSystem.getInstance();
