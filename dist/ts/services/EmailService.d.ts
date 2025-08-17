interface EmailConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: string;
    fromEmail: string;
    fromName: string;
}
interface EmailLog {
    id: string;
    to: string;
    subject: string;
    message: string;
    dateEnvoi: string;
    statut: 'envoyé' | 'échec' | 'en_attente';
    erreur?: string;
}
interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}
export declare class EmailService {
    private static instance;
    private constructor();
    static getInstance(): EmailService;
    getConfig(): Promise<ApiResponse>;
    updateConfig(config: Partial<EmailConfig>): Promise<ApiResponse>;
    testConfig(): Promise<ApiResponse>;
    getAllLogs(): Promise<ApiResponse>;
    getLogById(id: string): Promise<ApiResponse>;
    addLog(logData: Omit<EmailLog, 'id' | 'dateEnvoi'>): Promise<ApiResponse>;
    deleteLog(id: string): Promise<ApiResponse>;
    clearAllLogs(): Promise<ApiResponse>;
    getLogStats(): Promise<ApiResponse>;
    private getDefaultConfig;
    private generateLogId;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=EmailService.d.ts.map