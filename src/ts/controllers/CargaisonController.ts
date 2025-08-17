// src/ts/controllers/CargaisonController.ts

import { CargaisonService } from '../services/CargaisonService.js';
import { CargaisonModel, type Cargaison } from '../models/Cargaison.js';
import { cargaisonScheduler } from '../services/CargaisonSchedulerService.js';
import { viewInitializer } from '../utils/ViewInitializer.js';

export class CargaisonController {
    private static instance: CargaisonController;
    private cargaisonService: CargaisonService;
    private model: CargaisonModel;
    private currentPage = 1;
    private itemsPerPage = 5;
    private allDisplayedCargaisons: Cargaison[] = [];

    private constructor() {
        this.cargaisonService = CargaisonService.getInstance();
        this.model = CargaisonModel.getInstance();
    }

    public static getInstance(): CargaisonController {
        if (!CargaisonController.instance) {
            CargaisonController.instance = new CargaisonController();
        }
        return CargaisonController.instance;
    }

    // Initialisation
    public async initialize(): Promise<void> {
        viewInitializer.initializeCommon();
        await this.loadCargaisons();
        this.initializeEventListeners();
        
        // Exposer les fonctions de debug globalement
        (window as any).testScheduler = this.testScheduler.bind(this);
        (window as any).showSchedulerStatus = () => cargaisonScheduler.getTimersStatus();
    }

    // Chargement des cargaisons
    public async loadCargaisons(): Promise<void> {
        try {
            console.log('🔄 Début du chargement des cargaisons...');
            this.showLoading(true);
            
            console.log('📞 Appel de getAllCargaisons()...');
            const response = await this.cargaisonService.getAllCargaisons();
            console.log('📦 Réponse reçue:', response);
            
            if (response.success && response.data) {
                console.log('✅ Données reçues, nombre de cargaisons:', response.data.length);
                this.displayCargaisons(response.data);
            } else {
                console.error('❌ Échec du chargement:', response.error);
                this.showError('Erreur lors du chargement des cargaisons');
            }
        } catch (error) {
            console.error('💥 Erreur chargement cargaisons:', error);
            this.showError('Erreur de connexion au serveur');
            
            // Essayer de charger directement depuis l'API comme fallback
            try {
                console.log('🔄 Tentative de fallback direct...');
                const fallbackResponse = await fetch('/api/cargaisons', {
                    credentials: 'include'
                });
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    console.log('✅ Fallback réussi, données:', fallbackData);
                    if (Array.isArray(fallbackData)) {
                        this.displayCargaisons(fallbackData);
                    } else {
                        console.warn('Fallback: données reçues ne sont pas un tableau');
                        this.displayCargaisons([]);
                    }
                }
            } catch (fallbackError) {
                console.error('💥 Fallback aussi en échec:', fallbackError);
            }
        } finally {
            this.showLoading(false);
            console.log('🏁 Fin du chargement des cargaisons');
        }
    }

    // Affichage des cargaisons avec pagination
    public displayCargaisons(cargaisons: Cargaison[]): void {
        if (!Array.isArray(cargaisons)) {
            console.error('displayCargaisons: cargaisons n\'est pas un tableau:', cargaisons);
            this.allDisplayedCargaisons = [];
            cargaisons = [];
        } else {
            this.allDisplayedCargaisons = cargaisons;
        }
        const tbody = document.getElementById('cargaisonsTableBody');
        const container = document.getElementById('cargaisonsContainer');
        const emptyState = document.getElementById('emptyState');
        const totalCount = document.getElementById('totalCount');

        if (cargaisons.length === 0) {
            if (container) container.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            this.hidePagination();
            return;
        }

        if (container) container.classList.remove('hidden');
        if (emptyState) emptyState.classList.add('hidden');
        if (totalCount) totalCount.textContent = cargaisons.length.toString();

        // Pagination
        if (cargaisons.length > this.itemsPerPage) {
            this.showPagination(cargaisons.length);
            this.displayPage(this.currentPage);
        } else {
            this.hidePagination();
            if (tbody) tbody.innerHTML = cargaisons.map(c => this.createTableRow(c)).join('');
        }
    }

    // Affichage d'une page spécifique
    private displayPage(page: number): void {
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.allDisplayedCargaisons.slice(startIndex, endIndex);

        const tbody = document.getElementById('cargaisonsTableBody');
        if (tbody) {
            tbody.innerHTML = pageItems.map(c => this.createTableRow(c)).join('');
        }

        this.updatePaginationControls(page, Math.ceil(this.allDisplayedCargaisons.length / this.itemsPerPage));
    }

    // Création d'une ligne de tableau
    private createTableRow(cargaison: Cargaison): string {
        const statusColors: Record<string, string> = {
            'En attente': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'En cours': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Arrivé': 'bg-green-500/20 text-green-400 border-green-500/30',
            'Récupéré': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'Perdu': 'bg-red-500/20 text-red-400 border-red-500/30',
            'Archivé': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };

        const statusClass = statusColors[cargaison.statut] || statusColors['En attente'];

        return `
            <tr class="hover:bg-dark transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${cargaison.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${cargaison.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${cargaison.origine} → ${cargaison.destination}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${cargaison.poidsMax} kg</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${cargaison.prixParKg} FCFA</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full border ${statusClass}">
                        ${cargaison.statut}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div class="flex space-x-2">
                        <button onclick="window.cargaisonController.changeStatus('${cargaison.id}')" 
                                class="text-aqua hover:text-aqua-light" 
                                title="Modifier le statut">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.cargaisonController.viewDetails('${cargaison.id}')" 
                                class="text-blue-400 hover:text-blue-300"
                                title="Voir les détails">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${this.getToggleFermetureButton(cargaison)}
                    </div>
                </td>
            </tr>
        `;
    }

    // Bouton de fermeture/réouverture
    private getToggleFermetureButton(cargaison: Cargaison): string {
        if (cargaison.fermee) {
            const canReopen = cargaison.statut === 'En attente';
            return canReopen ? `
                <button onclick="window.cargaisonController.toggleFermeture('${cargaison.id}', false)" 
                        class="text-blue-400 hover:text-blue-300" title="Rouvrir la cargaison">
                    <i class="fas fa-unlock"></i>
                </button>
            ` : '';
        } else {
            const canClose = ['En attente', 'En cours'].includes(cargaison.statut);
            return canClose ? `
                <button onclick="window.cargaisonController.toggleFermeture('${cargaison.id}', true)" 
                        class="text-red-400 hover:text-red-300" title="Fermer la cargaison">
                    <i class="fas fa-lock"></i>
                </button>
            ` : '';
        }
    }

    // Application des filtres
    public async applyFilters(): Promise<void> {
        console.log('🔍 Application des filtres...');
        const filters = this.collectFilters();
        console.log('📋 Filtres collectés:', filters);
        
        try {
            const filteredCargaisons = await this.cargaisonService.searchCargaisons(filters);
            console.log('✅ Résultats filtrés:', filteredCargaisons.length, 'cargaisons');
            this.displayCargaisons(filteredCargaisons);
        } catch (error) {
            console.error('❌ Erreur filtrage:', error);
            this.showError('Erreur lors du filtrage');
        }
    }

    // Collecte des filtres
    private collectFilters(): any {
        return {
            code: (document.getElementById('filterCode') as HTMLInputElement)?.value || '',
            type: (document.getElementById('filterType') as HTMLSelectElement)?.value || '',
            statut: (document.getElementById('filterStatut') as HTMLSelectElement)?.value || ''
        };
    }

    // Actions sur les cargaisons
    public editCargaison(id: string): void {
        window.location.href = `/creation-cargaison?edit=${id}`;
    }

    public viewDetails(id: string): void {
        window.location.href = `/details-cargaison?id=${id}`;
    }

    public async changeStatus(id: string): Promise<void> {
        // Ouvrir la modal de changement de statut
        const modal = document.getElementById('statusModal');
        const cargaisonIdInput = document.getElementById('cargaisonId') as HTMLInputElement;
        const cargaisonCodeSpan = document.getElementById('cargaisonCode');

        if (modal && cargaisonIdInput) {
            cargaisonIdInput.value = id;
            if (cargaisonCodeSpan) cargaisonCodeSpan.textContent = id;
            modal.classList.remove('hidden');
        }
    }

    public async toggleFermeture(id: string, fermer: boolean): Promise<void> {
        try {
            const response = await this.cargaisonService.updateCargaison(id, { fermee: fermer });
            
            if (response.success) {
                await this.loadCargaisons(); // Recharger la liste
                this.showSuccess(`Cargaison ${fermer ? 'fermée' : 'rouverte'} avec succès`);
            } else {
                this.showError(response.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Erreur toggle fermeture:', error);
            this.showError('Erreur lors de la mise à jour');
        }
    }

    // Gestion de la pagination
    private showPagination(totalItems: number): void {
        const paginationContainer = document.getElementById('paginationContainer');
        
        if (!paginationContainer) {
            this.createPaginationContainer();
        }

        const container = document.getElementById('paginationContainer');
        if (container) {
            container.classList.remove('hidden');
        }
    }

    private hidePagination(): void {
        const paginationContainer = document.getElementById('paginationContainer');
        if (paginationContainer) {
            paginationContainer.classList.add('hidden');
        }
    }

    private createPaginationContainer(): void {
        const container = document.getElementById('cargaisonsContainer');
        if (!container) return;

        const paginationHTML = `
            <div id="paginationContainer" class="mt-6 flex items-center justify-between px-6 py-3 bg-dark-light border border-aqua/20 rounded-b-lg">
                <div class="text-sm text-gray-400">
                    Affichage de <span id="startItem">1</span> à <span id="endItem">5</span> sur <span id="totalItems">0</span> éléments
                </div>
                <div class="flex items-center space-x-2">
                    <button id="prevPage" onclick="window.cargaisonController.changePage(window.cargaisonController.getCurrentPage() - 1)" 
                            class="px-3 py-1 text-sm bg-dark border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Précédent
                    </button>
                    <div id="pageNumbers" class="flex space-x-1"></div>
                    <button id="nextPage" onclick="window.cargaisonController.changePage(window.cargaisonController.getCurrentPage() + 1)" 
                            class="px-3 py-1 text-sm bg-dark border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Suivant
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('afterend', paginationHTML);
    }

    private updatePaginationControls(currentPage: number, totalPages: number): void {
        const startItem = (currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(currentPage * this.itemsPerPage, this.allDisplayedCargaisons.length);

        const elements = {
            startItem: document.getElementById('startItem'),
            endItem: document.getElementById('endItem'),
            totalItems: document.getElementById('totalItems'),
            prevBtn: document.getElementById('prevPage') as HTMLButtonElement,
            nextBtn: document.getElementById('nextPage') as HTMLButtonElement,
            pageNumbers: document.getElementById('pageNumbers')
        };

        if (elements.startItem) elements.startItem.textContent = startItem.toString();
        if (elements.endItem) elements.endItem.textContent = endItem.toString();
        if (elements.totalItems) elements.totalItems.textContent = this.allDisplayedCargaisons.length.toString();

        if (elements.prevBtn) elements.prevBtn.disabled = currentPage === 1;
        if (elements.nextBtn) elements.nextBtn.disabled = currentPage === totalPages;

        // Numéros de page
        if (elements.pageNumbers) {
            elements.pageNumbers.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `px-3 py-1 text-sm rounded transition-colors ${
                        i === currentPage 
                            ? 'bg-aqua text-dark font-semibold' 
                            : 'bg-dark border border-gray-600 text-white hover:bg-gray-700'
                    }`;
                    pageBtn.textContent = i.toString();
                    pageBtn.onclick = () => this.changePage(i);
                    elements.pageNumbers.appendChild(pageBtn);
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    const dots = document.createElement('span');
                    dots.textContent = '...';
                    dots.className = 'px-2 text-gray-400';
                    elements.pageNumbers.appendChild(dots);
                }
            }
        }
    }

    public changePage(page: number): void {
        const totalPages = Math.ceil(this.allDisplayedCargaisons.length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;

        this.currentPage = page;
        this.displayPage(page);
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    // Fonction de test pour le scheduler
    public testScheduler(cargaisonId: string, delayMinutes: number = 1): void {
        const delayHours = delayMinutes / 60;
        const success = cargaisonScheduler.scheduleArrival(cargaisonId, delayHours);
        if (success) {
            console.log(`🧪 Test programmer: ${cargaisonId} arrivera dans ${delayMinutes} minute(s)`);
            this.showSuccess(`Test: arrivée programmée dans ${delayMinutes} minute(s)`);
        } else {
            console.error('❌ Échec du test de programmation');
            this.showError('Échec du test de programmation');
        }
    }

    // Changement de statut
    public async submitStatusChange(): Promise<void> {
        const form = document.getElementById('statusForm') as HTMLFormElement;
        if (!form) return;

        const formData = new FormData(form);
        const cargaisonId = formData.get('cargaisonId') as string;
        const newStatus = formData.get('newStatus') as string;
        const note = formData.get('note') as string;
        const enCoursType = formData.get('enCoursType') as string;
        const timeValue = formData.get('timeValue') as string;
        const timeUnit = formData.get('timeUnit') as string;

        try {
            // Gérer la programmation d'arrivée pour "En cours"
            if (newStatus === 'En cours' && enCoursType === 'arrive' && timeValue) {
                const intervalHours = timeUnit === 'jours' ? parseInt(timeValue) * 24 : parseInt(timeValue);
                
                // Programmer l'arrivée automatique
                const scheduledSuccess = cargaisonScheduler.scheduleArrival(cargaisonId, intervalHours);
                if (scheduledSuccess) {
                    console.log(`⏰ Arrivée programmée dans ${intervalHours}h pour ${cargaisonId}`);
                    
                    // Mettre à jour le statut avec indication du délai
                    const updatedNote = `${note ? note + ' - ' : ''}Arrivée programmée dans ${timeValue} ${timeUnit}`;
                    const response = await this.cargaisonService.updateCargaisonStatus(cargaisonId, `${newStatus} - Arrive dans ${timeValue} ${timeUnit}`, updatedNote);
                    
                    if (response.success) {
                        this.showSuccess(`Statut mis à jour. Arrivée programmée dans ${timeValue} ${timeUnit}`);
                        await this.loadCargaisons();
                    } else {
                        this.showError(response.error || 'Erreur lors de la mise à jour');
                    }
                } else {
                    this.showError('Erreur lors de la programmation de l\'arrivée');
                }
            } else {
                // Mise à jour normale du statut
                const response = await this.cargaisonService.updateCargaisonStatus(cargaisonId, newStatus, note);
                
                if (response.success) {
                    // Annuler les timers existants si on change vers un autre statut
                    if (newStatus !== 'En cours') {
                        cargaisonScheduler.cancelScheduledArrival(cargaisonId);
                    }
                    
                    this.showSuccess('Statut mis à jour avec succès');
                    await this.loadCargaisons();
                } else {
                    this.showError(response.error || 'Erreur lors de la mise à jour');
                }
            }
        } catch (error) {
            console.error('Erreur changement statut:', error);
            this.showError('Erreur lors de la mise à jour du statut');
        } finally {
            this.closeStatusModal();
        }
    }

    // Gestion des modals
    public closeStatusModal(): void {
        const modal = document.getElementById('statusModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Gestion des événements
    private initializeEventListeners(): void {
        // Filtres - Formulaire de recherche
        const filtersForm = document.getElementById('filtersForm');
        if (filtersForm) {
            filtersForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }

        // Bouton de recherche spécifique
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }

        // Form de changement de statut
        const statusForm = document.getElementById('statusForm');
        if (statusForm) {
            statusForm.onsubmit = (e) => {
                e.preventDefault();
                this.submitStatusChange();
            };
        }

        // Boutons de fermeture de modal
        const closeStatusBtn = document.getElementById('closeStatusModalBtn');
        if (closeStatusBtn) {
            closeStatusBtn.addEventListener('click', () => this.closeStatusModal());
        }

        const cancelStatusBtn = document.getElementById('cancelStatusBtn');
        if (cancelStatusBtn) {
            cancelStatusBtn.addEventListener('click', () => this.closeStatusModal());
        }

        // Gestion des options "En cours"
        const newStatusSelect = document.getElementById('newStatus');
        const enCoursOptions = document.getElementById('enCoursOptions');
        const enCoursTypeSelect = document.getElementById('enCoursType');
        const timeInputs = document.getElementById('timeInputs');

        if (newStatusSelect && enCoursOptions) {
            newStatusSelect.addEventListener('change', (e) => {
                const target = e.target as HTMLSelectElement;
                if (target.value === 'En cours') {
                    enCoursOptions.classList.remove('hidden');
                } else {
                    enCoursOptions.classList.add('hidden');
                    if (timeInputs) timeInputs.classList.add('hidden');
                }
            });
        }

        if (enCoursTypeSelect && timeInputs) {
            enCoursTypeSelect.addEventListener('change', (e) => {
                const target = e.target as HTMLSelectElement;
                if (target.value === 'arrive' || target.value === 'retard') {
                    timeInputs.classList.remove('hidden');
                } else {
                    timeInputs.classList.add('hidden');
                }
            });
        }
    }

    // Utilitaires d'affichage
    private showLoading(show: boolean): void {
        const loading = document.getElementById('loading');
        if (loading) {
            if (show) {
                loading.classList.remove('hidden');
            } else {
                loading.classList.add('hidden');
            }
        }
    }

    private showError(message: string): void {
        console.error(message);
        const errorDiv = document.getElementById('error');
        if (errorDiv) {
            errorDiv.classList.remove('hidden');
            const errorText = errorDiv.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
        }
    }

    private showSuccess(message: string): void {
        console.log(message);
        // Ici on pourrait afficher une notification de succès
    }
}

// Initialisation automatique supprimée - maintenant gérée par App.ts
