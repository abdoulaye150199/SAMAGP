export interface NotificationData {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    icon?: string;
}
export declare class NotificationSystem {
    private static instance;
    private constructor();
    static getInstance(): NotificationSystem;
    show(notification: NotificationData): void;
    private getOrCreateContainer;
    private createNotificationElement;
    private remove;
    private getColorClass;
    private getDefaultIcon;
    success(title: string, message: string): void;
    error(title: string, message: string): void;
    warning(title: string, message: string): void;
    info(title: string, message: string): void;
}
export declare const notifications: NotificationSystem;
//# sourceMappingURL=NotificationSystem.d.ts.map