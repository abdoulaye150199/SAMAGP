export interface SuccessMessage {
    type: string;
    title: string;
    message: string;
    icon: string;
}
export declare class SuccessMessageHandler {
    private static instance;
    private constructor();
    static getInstance(): SuccessMessageHandler;
    initialize(): void;
    private processSuccessMessage;
    private mapTypeToNotificationType;
}
export declare const successMessageHandler: SuccessMessageHandler;
//# sourceMappingURL=SuccessMessageHandler.d.ts.map