import { type Cargaison } from '../models/Cargaison.js';
export declare class CargaisonController {
    private static instance;
    private cargaisonService;
    private model;
    private currentPage;
    private itemsPerPage;
    private allDisplayedCargaisons;
    private constructor();
    static getInstance(): CargaisonController;
    initialize(): Promise<void>;
    loadCargaisons(): Promise<void>;
    displayCargaisons(cargaisons: Cargaison[]): void;
    private displayPage;
    private createTableRow;
    private getToggleFermetureButton;
    applyFilters(): Promise<void>;
    private collectFilters;
    editCargaison(id: string): void;
    viewDetails(id: string): void;
    changeStatus(id: string): Promise<void>;
    toggleFermeture(id: string, fermer: boolean): Promise<void>;
    private showPagination;
    private hidePagination;
    private createPaginationContainer;
    private updatePaginationControls;
    changePage(page: number): void;
    getCurrentPage(): number;
    testScheduler(cargaisonId: string, delayMinutes?: number): void;
    submitStatusChange(): Promise<void>;
    closeStatusModal(): void;
    private initializeEventListeners;
    private showLoading;
    private showError;
    private showSuccess;
}
//# sourceMappingURL=CargaisonController.d.ts.map