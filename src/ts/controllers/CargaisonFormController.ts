// src/ts/controllers/CargaisonFormController.ts

import { CargaisonService } from '../services/CargaisonService.js';
import { CargaisonModel, type Cargaison } from '../models/Cargaison.js';
import { notificationService } from '../services/NotificationService.js';

interface CargaisonFormData {
    type: string;
    origine: string;
    destination: string;
    poidsMax: number;
    prixParKg: number;
    datePrevue?: string;
    description?: string;
}

export class CargaisonFormController {
    private static instance: CargaisonFormController;
    private cargaisonService: CargaisonService;
    private model: CargaisonModel;
    private form: HTMLFormElement | null = null;
    private isEditMode = false;
    private editingCargaisonId: string | null = null;

    private constructor() {
        this.cargaisonService = CargaisonService.getInstance();
        this.model = CargaisonModel.getInstance();
    }

    public static getInstance(): CargaisonFormController {
        if (!CargaisonFormController.instance) {
            CargaisonFormController.instance = new CargaisonFormController();
        }
        return CargaisonFormController.instance;
    }

    // Initialisation
    public async initialize(): Promise<void> {
        this.form = document.querySelector('form[data-cargaison-form]') as HTMLFormElement;
        
        if (!this.form) {
            console.error('Formulaire de cargaison non trouvé');
            return;
        }

        this.checkEditMode();
        this.initializeEventListeners();
        
        if (this.isEditMode && this.editingCargaisonId) {
            await this.loadCargaisonForEdit(this.editingCargaisonId);
        }
    }

    // Vérifier si on est en mode édition
    private checkEditMode(): void {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        
        if (editId) {
            this.isEditMode = true;
            this.editingCargaisonId = editId;
            this.updateFormTitle(`Modifier la Cargaison ${editId}`);
        }
    }

    // Charger une cargaison pour édition
    private async loadCargaisonForEdit(id: string): Promise<void> {
        try {
            const response = await this.cargaisonService.getCargaisonById(id);
            
            if (response.success && response.data) {
                this.populateForm(response.data);
            } else {
                notificationService.error('Erreur', 'Cargaison non trouvée');
                window.location.href = '/cargaisons';
            }
        } catch (error) {
            console.error('Erreur chargement cargaison:', error);
            notificationService.error('Erreur', 'Impossible de charger la cargaison');
        }
    }

    // Remplir le formulaire avec les données
    private populateForm(cargaison: Cargaison): void {
        if (!this.form) return;

        const elements = {
            type: this.form.querySelector('#type') as HTMLSelectElement,
            origine: this.form.querySelector('#origine') as HTMLInputElement,
            destination: this.form.querySelector('#destination') as HTMLInputElement,
            poidsMax: this.form.querySelector('#poids-max') as HTMLInputElement,
            prixParKg: this.form.querySelector('#prix-par-kg') as HTMLInputElement,
            datePrevue: this.form.querySelector('#date-prevue') as HTMLInputElement,
            description: this.form.querySelector('#description') as HTMLTextAreaElement
        };

        if (elements.type) elements.type.value = cargaison.type;
        if (elements.origine) elements.origine.value = cargaison.origine;
        if (elements.destination) elements.destination.value = cargaison.destination;
        if (elements.poidsMax) elements.poidsMax.value = cargaison.poidsMax.toString();
        if (elements.prixParKg) elements.prixParKg.value = cargaison.prixParKg.toString();
        if (elements.datePrevue && cargaison.datePrevue) elements.datePrevue.value = cargaison.datePrevue;
        if (elements.description && cargaison.description) elements.description.value = cargaison.description;
    }

    // Mise à jour du titre du formulaire
    private updateFormTitle(title: string): void {
        const titleElement = document.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    // Initialisation des événements
    private initializeEventListeners(): void {
        if (!this.form) return;

        // Soumission du formulaire
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validation en temps réel
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input as HTMLInputElement);
            });
        });

        // Calcul automatique du prix total
        const poidsInput = this.form.querySelector('#poids-max') as HTMLInputElement;
        const prixInput = this.form.querySelector('#prix-par-kg') as HTMLInputElement;
        
        if (poidsInput && prixInput) {
            [poidsInput, prixInput].forEach(input => {
                input.addEventListener('input', () => {
                    this.updatePrixTotal();
                });
            });
        }
    }

    // Collecte des données du formulaire
    private collectFormData(): CargaisonFormData | null {
        if (!this.form) return null;

        const formData = new FormData(this.form);
        
        return {
            type: formData.get('type') as string,
            origine: formData.get('origine') as string,
            destination: formData.get('destination') as string,
            poidsMax: parseFloat(formData.get('poids-max') as string),
            prixParKg: parseFloat(formData.get('prix-par-kg') as string),
            datePrevue: formData.get('date-prevue') as string || undefined,
            description: formData.get('description') as string || undefined
        };
    }

    // Soumission du formulaire
    private async handleSubmit(): Promise<void> {
        const formData = this.collectFormData();
        if (!formData) return;

        // Validation côté client
        const validation = this.model.validateCargaison(formData);
        if (!validation.isValid) {
            this.displayValidationErrors(validation.errors);
            return;
        }

        try {
            this.setSubmitButtonLoading(true);

            let response;
            if (this.isEditMode && this.editingCargaisonId) {
                response = await this.cargaisonService.updateCargaison(this.editingCargaisonId, formData);
            } else {
                response = await this.cargaisonService.createCargaison({
                    ...formData,
                    statut: 'En attente',
                    fermee: false
                } as any);
            }

            if (response.success) {
                const action = this.isEditMode ? 'modifiée' : 'créée';
                notificationService.success(
                    'Succès',
                    `Cargaison ${action} avec succès!`
                );

                // Rediriger vers la liste des cargaisons
                setTimeout(() => {
                    window.location.href = '/cargaisons';
                }, 1500);
            } else {
                notificationService.error('Erreur', response.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Erreur soumission:', error);
            notificationService.error('Erreur', 'Erreur de connexion au serveur');
        } finally {
            this.setSubmitButtonLoading(false);
        }
    }

    // Validation d'un champ
    private validateField(input: HTMLInputElement): boolean {
        const value = input.value.trim();
        const fieldName = input.name;
        let isValid = true;
        let errorMessage = '';

        // Règles de validation
        switch (fieldName) {
            case 'origine':
            case 'destination':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Ce champ est requis';
                }
                break;
            case 'poids-max':
                const poids = parseFloat(value);
                if (!value || isNaN(poids) || poids <= 0) {
                    isValid = false;
                    errorMessage = 'Le poids doit être supérieur à 0';
                }
                break;
            case 'prix-par-kg':
                const prix = parseFloat(value);
                if (!value || isNaN(prix) || prix <= 0) {
                    isValid = false;
                    errorMessage = 'Le prix doit être supérieur à 0';
                }
                break;
        }

        this.updateFieldValidation(input, isValid, errorMessage);
        return isValid;
    }

    // Mise à jour de l'affichage de validation
    private updateFieldValidation(input: HTMLInputElement, isValid: boolean, errorMessage: string): void {
        const container = input.closest('.form-group') || input.parentElement;
        if (!container) return;

        // Supprimer les anciens messages d'erreur
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Mise à jour des styles
        input.classList.remove('border-red-500', 'border-green-500');
        
        if (!isValid && errorMessage) {
            input.classList.add('border-red-500');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-400 text-xs mt-1';
            errorDiv.textContent = errorMessage;
            container.appendChild(errorDiv);
        } else if (input.value.trim()) {
            input.classList.add('border-green-500');
        }
    }

    // Affichage des erreurs de validation
    private displayValidationErrors(errors: string[]): void {
        notificationService.error(
            'Erreurs de validation',
            errors.join('\n')
        );
    }

    // Mise à jour du prix total
    private updatePrixTotal(): void {
        const poidsInput = document.getElementById('poids-max') as HTMLInputElement;
        const prixInput = document.getElementById('prix-par-kg') as HTMLInputElement;
        const totalElement = document.getElementById('prix-total');

        if (poidsInput && prixInput && totalElement) {
            const poids = parseFloat(poidsInput.value) || 0;
            const prixParKg = parseFloat(prixInput.value) || 0;
            const total = poids * prixParKg;

            totalElement.textContent = new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
            }).format(total);
        }
    }

    // Gestion du bouton de soumission
    private setSubmitButtonLoading(loading: boolean): void {
        const submitButton = this.form?.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (!submitButton) return;

        if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enregistrement...';
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = this.isEditMode 
                ? '<i class="fas fa-save mr-2"></i>Modifier la Cargaison'
                : '<i class="fas fa-plus mr-2"></i>Créer la Cargaison';
        }
    }

    // Réinitialisation du formulaire
    public resetForm(): void {
        if (this.form) {
            this.form.reset();
            
            // Nettoyer les validations visuelles
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('border-red-500', 'border-green-500');
            });

            // Supprimer les messages d'erreur
            const errorMessages = this.form.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());

            // Réinitialiser le prix total
            const totalElement = document.getElementById('prix-total');
            if (totalElement) {
                totalElement.textContent = '0 FCFA';
            }
        }
    }

    // Annulation
    public cancel(): void {
        notificationService.confirm(
            'Annuler les modifications',
            'Êtes-vous sûr de vouloir annuler? Les modifications non sauvegardées seront perdues.',
            () => {
                window.location.href = '/cargaisons';
            }
        );
    }

    // Preview avant sauvegarde
    public preview(): void {
        const formData = this.collectFormData();
        if (!formData) return;

        const validation = this.model.validateCargaison(formData);
        if (!validation.isValid) {
            this.displayValidationErrors(validation.errors);
            return;
        }

        // Afficher un aperçu de la cargaison
        const previewContent = `
            <strong>Type:</strong> ${formData.type}<br>
            <strong>Route:</strong> ${formData.origine} → ${formData.destination}<br>
            <strong>Capacité:</strong> ${formData.poidsMax} kg<br>
            <strong>Prix:</strong> ${formData.prixParKg} FCFA/kg<br>
            <strong>Revenue estimé:</strong> ${new Intl.NumberFormat('fr-FR').format(formData.poidsMax * formData.prixParKg)} FCFA
        `;

        notificationService.info('Aperçu de la cargaison', previewContent);
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    const controller = CargaisonFormController.getInstance();
    controller.initialize();
    
    // Exposer le contrôleur globalement
    (window as any).cargaisonFormController = controller;
});
