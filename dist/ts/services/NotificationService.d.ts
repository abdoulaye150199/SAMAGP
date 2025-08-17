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
export declare class NotificationService {
    private static instance;
    private container;
    private notifications;
    private constructor();
    static getInstance(): NotificationService;
    private createContainer;
    show(type: NotificationType, title: string, message: string, options?: {
        icon?: string;
        duration?: number;
        persistent?: boolean;
    }): string;
    success(title: string, message?: string, options?: any): string;
    error(title: string, message?: string, options?: any): string;
    warning(title: string, message?: string, options?: any): string;
    info(title: string, message?: string, options?: any): string;
    hide(id: string): void;
    clearAll(): void;
    private renderNotification;
    private getColors;
    private getDefaultIcon;
    private generateId;
    showWithAction(type: NotificationType, title: string, message: string, actionText: string, actionCallback: () => void): string;
    executeAction(id: string, callback: () => void): void;
    confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void): string;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=NotificationService.d.ts.map