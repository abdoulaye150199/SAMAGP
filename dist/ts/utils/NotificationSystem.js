// src/ts/utils/NotificationSystem.ts
export class NotificationSystem {
    constructor() { }
    static getInstance() {
        if (!NotificationSystem.instance) {
            NotificationSystem.instance = new NotificationSystem();
        }
        return NotificationSystem.instance;
    }
    // Créer une notification
    show(notification) {
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
    getOrCreateContainer() {
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
    createNotificationElement(notification) {
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
    remove(element) {
        element.classList.add('hide');
        setTimeout(() => {
            element.remove();
        }, 400);
    }
    // Utilitaires
    getColorClass(type) {
        const colors = {
            'success': 'green',
            'error': 'red',
            'warning': 'yellow',
            'info': 'blue'
        };
        return colors[type] || 'blue';
    }
    getDefaultIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    // Méthodes de convenance
    success(title, message) {
        this.show({ type: 'success', title, message });
    }
    error(title, message) {
        this.show({ type: 'error', title, message });
    }
    warning(title, message) {
        this.show({ type: 'warning', title, message });
    }
    info(title, message) {
        this.show({ type: 'info', title, message });
    }
}
// Export de l'instance globale
export const notifications = NotificationSystem.getInstance();
//# sourceMappingURL=NotificationSystem.js.map