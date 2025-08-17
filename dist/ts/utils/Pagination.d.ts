interface PaginationConfig {
    containerId: string;
    itemsPerPage?: number;
    onPageChange: (page: number, startIndex: number, endIndex: number) => void;
    cssClasses?: {
        container?: string;
        button?: string;
        activeButton?: string;
        disabledButton?: string;
    };
}
export declare class PaginationUtil {
    private currentPage;
    private itemsPerPage;
    private totalItems;
    private containerId;
    private onPageChange;
    private cssClasses;
    constructor(config: PaginationConfig);
    setup(totalItems: number, targetElement: HTMLElement): void;
    private show;
    private hide;
    private createPaginationContainer;
    private displayPage;
    private updateControls;
    private updatePageNumbers;
    private changePage;
    getCurrentPage(): number;
    getTotalPages(): number;
    refresh(totalItems: number): void;
}
export {};
//# sourceMappingURL=Pagination.d.ts.map