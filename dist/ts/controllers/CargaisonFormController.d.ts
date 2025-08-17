export declare class CargaisonFormController {
    private static instance;
    private cargaisonService;
    private model;
    private form;
    private isEditMode;
    private editingCargaisonId;
    private constructor();
    static getInstance(): CargaisonFormController;
    initialize(): Promise<void>;
    private checkEditMode;
    private loadCargaisonForEdit;
    private populateForm;
    private updateFormTitle;
    private initializeEventListeners;
    private collectFormData;
    private handleSubmit;
    private validateField;
    private updateFieldValidation;
    private displayValidationErrors;
    private updatePrixTotal;
    private setSubmitButtonLoading;
    resetForm(): void;
    cancel(): void;
    preview(): void;
}
//# sourceMappingURL=CargaisonFormController.d.ts.map