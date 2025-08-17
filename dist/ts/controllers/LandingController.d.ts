export declare class LandingController {
    private static instance;
    private colisModel;
    private notificationService;
    private constructor();
    static getInstance(): LandingController;
    initialize(): Promise<void>;
    private loadColis;
    trackPackage(event: Event): Promise<void>;
    private displayPackageInfo;
    private showProgressSection;
    private hideResults;
    private getStatusColor;
    private getStatusIcon;
    private preparePrintContent;
    printPackageInfo(): void;
}
export declare const landingController: LandingController;
//# sourceMappingURL=LandingController.d.ts.map