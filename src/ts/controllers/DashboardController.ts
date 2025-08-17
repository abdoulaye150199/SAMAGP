// src/ts/controllers/DashboardController.ts

import { CargaisonService } from '../services/CargaisonService.js';
import { emailService, sendPackageConfirmationEmail } from '../config/EmailConfig.js';
import type { Cargaison } from '../models/Cargaison.js';
import { viewInitializer } from '../utils/ViewInitializer.js';

export class DashboardController {
    private static instance: DashboardController;
    private cargaisonService: CargaisonService;
    private dashboardMap: any = null;

    private constructor() {
        this.cargaisonService = CargaisonService.getInstance();
    }

    public static getInstance(): DashboardController {
        if (!DashboardController.instance) {
            DashboardController.instance = new DashboardController();
        }
        return DashboardController.instance;
    }

    // Initialisation du dashboard
    public async initialize(): Promise<void> {
        viewInitializer.initializeCommon();
        await this.loadDashboardData();
        this.initializeEventListeners();
    }

    // Chargement des données du dashboard
    private async loadDashboardData(): Promise<void> {
        try {
            console.log('Chargement des données du dashboard...');
            const response = await this.cargaisonService.getDashboardData();
            console.log('Réponse dashboard:', response);
            
            if (response.success && response.data) {
                console.log('Statistiques:', response.data.statistics);
                this.updateStatisticsDisplay(response.data.statistics);
                this.updateRecentActivity(response.data.recentActivity);
                await this.loadLastActiveCargaison();
            } else {
                console.error('Erreur response:', response.error);
                this.showError('Erreur lors du chargement des données du dashboard');
                
                // Fallback : charger des données par défaut
                this.loadFallbackData();
            }
        } catch (error) {
            console.error('Erreur dashboard:', error);
            this.showError('Erreur de connexion au serveur');
            
            // Fallback : charger des données par défaut
            this.loadFallbackData();
        }
    }

    // Chargement de données fallback
    private loadFallbackData(): void {
        console.log('Chargement des données fallback...');
        // Afficher des statistiques basiques
        const fallbackStats = {
            total: 0,
            enCours: 0,
            arrivees: 0,
            revenueEstime: 0
        };
        
        this.updateStatisticsDisplay(fallbackStats);
        this.updateRecentActivity([]);
        this.updateCargaisonDetails(null);
    }

    // Mise à jour de l'affichage des statistiques
    private updateStatisticsDisplay(statistics: any): void {
        const elements = {
            totalCargaisons: document.getElementById('totalCargaisons'),
            cargaisonsEnCours: document.getElementById('cargaisonsEnCours'),
            cargaisonsArrivees: document.getElementById('cargaisonsArrivees'),
            revenueEstime: document.getElementById('revenueEstime')
        };

        if (elements.totalCargaisons) elements.totalCargaisons.textContent = statistics.total.toString();
        if (elements.cargaisonsEnCours) elements.cargaisonsEnCours.textContent = statistics.enCours.toString();
        if (elements.cargaisonsArrivees) elements.cargaisonsArrivees.textContent = statistics.arrivees.toString();
        if (elements.revenueEstime) {
            elements.revenueEstime.textContent = this.formatCurrency(statistics.revenueEstime);
        }
    }

    // Mise à jour de l'activité récente
    private updateRecentActivity(activity: any[]): void {
        const container = document.getElementById('recentActivityContainer');
        if (!container) return;

        if (activity.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center py-4">Aucune activité récente</p>';
            return;
        }

        const activityHtml = activity.map(item => `
            <div class="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                <div class="flex items-center">
                    <i class="fas fa-circle text-aqua text-xs mr-3"></i>
                    <span class="text-sm text-white">${item.message}</span>
                </div>
                <span class="text-xs text-gray-400">${this.formatDate(item.date)}</span>
            </div>
        `).join('');

        container.innerHTML = activityHtml;
    }

    // Chargement de la dernière cargaison active
    private async loadLastActiveCargaison(): Promise<void> {
        try {
            const lastActiveCargaison = await this.cargaisonService.getLastActiveCargaison();
            
            if (lastActiveCargaison) {
                this.updateCargaisonDetails(lastActiveCargaison);
                this.initDashboardMap(lastActiveCargaison);
            } else {
                this.updateCargaisonDetails(null);
            }
        } catch (error) {
            console.error('Erreur chargement dernière cargaison:', error);
        }
    }

    // Mise à jour des détails de la cargaison
    private updateCargaisonDetails(cargaison: Cargaison | null): void {
        console.log('Mise à jour des détails cargaison:', cargaison);
        const elements = {
            title: document.getElementById('cargaisonTitle'),
            status: document.getElementById('cargaisonStatus'),
            type: document.getElementById('cargaisonType'),
            dateCreation: document.getElementById('cargaisonDateCreation'),
            datePrevue: document.getElementById('cargaisonDatePrevue'),
            route: document.getElementById('cargaisonRoute'),
            position: document.getElementById('cargaisonPosition'),
            vitesse: document.getElementById('cargaisonVitesse'),
            colis: document.getElementById('cargaisonColis'),
            poids: document.getElementById('cargaisonPoids'),
            prix: document.getElementById('cargaisonPrix'),
            progression: document.getElementById('cargaisonProgression'),
            progressionText: document.getElementById('cargaisonProgressionText'),
            progressionBar: document.getElementById('cargaisonProgressionBar'),
            detailsLink: document.getElementById('cargaisonDetailsLink'),
            mapLink: document.getElementById('cargaisonMapLink')
        };

        if (!cargaison) {
            if (elements.title) elements.title.textContent = 'Aucune cargaison en cours';
            if (elements.status) elements.status.textContent = '-';
            Object.values(elements).forEach(el => {
                if (el && el.id !== 'cargaisonTitle' && el.id !== 'cargaisonStatus') {
                    el.textContent = '-';
                }
            });
            return;
        }

        // Mettre à jour les éléments
        if (elements.title) elements.title.textContent = `Détails Cargaison ${cargaison.id}`;
        if (elements.status) elements.status.textContent = cargaison.statut;
        if (elements.type) elements.type.textContent = cargaison.type;
        if (elements.dateCreation) elements.dateCreation.textContent = this.formatDate(cargaison.dateCreation);
        if (elements.datePrevue) elements.datePrevue.textContent = cargaison.datePrevue ? this.formatDate(cargaison.datePrevue) : '-';
        if (elements.route) elements.route.textContent = `${cargaison.origine} → ${cargaison.destination}`;

        // Position simulée
        const position = this.generateShipmentPosition(cargaison);
        if (elements.position) elements.position.textContent = `${position.lat.toFixed(1)}°N, ${Math.abs(position.lng).toFixed(1)}°W`;

        // Vitesse selon le type
        const vitesse = this.getVitesseByType(cargaison.type);
        if (elements.vitesse) elements.vitesse.textContent = vitesse;

        // Statistiques simulées
        if (elements.colis) elements.colis.textContent = (Math.floor(Math.random() * 50) + 10).toString();
        if (elements.poids) elements.poids.textContent = `${cargaison.poidsMax || 0}kg`;
        if (elements.prix) elements.prix.textContent = `${cargaison.prixParKg || 0}€/kg`;

        // Progression
        const progression = this.getProgressionByStatus(cargaison.statut);
        if (elements.progression) elements.progression.textContent = `${progression}%`;
        if (elements.progressionText) elements.progressionText.textContent = `${progression}%`;
        if (elements.progressionBar) {
            (elements.progressionBar as HTMLElement).style.width = `${progression}%`;
        }

        // Liens
        if (elements.detailsLink) {
            (elements.detailsLink as HTMLAnchorElement).href = `/details-cargaison?id=${cargaison.id}`;
        }
        if (elements.mapLink) {
            (elements.mapLink as HTMLAnchorElement).href = `/suivi-carte?shipment=${cargaison.id}`;
        }
    }

    // Initialisation de la carte du dashboard
    private initDashboardMap(cargaison: Cargaison): void {
        if (this.dashboardMap) {
            this.dashboardMap.remove();
        }

        const mapContainer = document.getElementById('shipMap');
        if (!mapContainer || !(window as any).L) return;

        const position = this.generateShipmentPosition(cargaison);

        this.dashboardMap = (window as any).L.map('shipMap', {
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: false,
            doubleClickZoom: false
        }).setView([position.lat, position.lng], 4);

        // Thème sombre
        (window as any).L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; Stadia Maps'
        }).addTo(this.dashboardMap);

        // Marqueur
        const typeIcon = this.getTypeIcon(cargaison.type);
        const typeColor = this.getTypeColor(cargaison.type);

        (window as any).L.marker([position.lat, position.lng], {
            icon: (window as any).L.divIcon({
                className: 'custom-div-icon',
                html: `
                    <div class="w-6 h-6 bg-gradient-to-r ${typeColor} rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg">
                        <i class="fas fa-${typeIcon}"></i>
                    </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        }).addTo(this.dashboardMap);
    }

    // Recherche de cargaisons
    public async searchCargaisons(searchTerm: string): Promise<void> {
        if (!searchTerm.trim()) {
            await this.loadSuggestions();
            return;
        }

        try {
            const suggestions = await this.cargaisonService.searchCargaisons({
                code: searchTerm
            });

            this.displaySuggestions(suggestions);
        } catch (error) {
            console.error('Erreur recherche:', error);
            this.showError('Erreur lors de la recherche');
        }
    }

    // Chargement des suggestions
    private async loadSuggestions(): Promise<void> {
        try {
            const allCargaisons = await this.cargaisonService.getActiveCargaisons();
            this.displaySuggestions(allCargaisons);
        } catch (error) {
            console.error('Erreur suggestions:', error);
        }
    }

    // Affichage des suggestions
    private displaySuggestions(cargaisons: Cargaison[]): void {
        const container = document.getElementById('suggestionsList');
        if (!container) return;

        if (cargaisons.length === 0) {
            container.innerHTML = '<p class="text-gray-400 p-3">Aucune suggestion disponible</p>';
            return;
        }

        const suggestionsHtml = cargaisons.map(cargaison => `
            <button class="px-3 py-2 bg-dark border border-gray-600 text-gray-300 text-sm rounded-lg hover:border-aqua hover:text-aqua transition-all flex items-center space-x-2 w-full text-left"
                    onclick="window.dashboardController.selectCargaison('${cargaison.id}')">
                <i class="fas fa-ship text-aqua"></i>
                <div>
                    <div class="font-semibold">${cargaison.id}</div>
                    <div class="text-xs text-gray-400">${cargaison.origine} → ${cargaison.destination}</div>
                </div>
            </button>
        `).join('');

        container.innerHTML = suggestionsHtml;
    }

    // Sélection d'une cargaison
    public selectCargaison(cargaisonId: string): void {
        const searchInput = document.getElementById('cargaisonSearch') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = cargaisonId;
        }
        this.hideSuggestions();
    }

    // Masquer les suggestions
    private hideSuggestions(): void {
        const container = document.getElementById('cargaisonSuggestions');
        if (container) {
            container.classList.add('hidden');
        }
    }

    // Recherche par bouton "Voir Détails"
    public async searchAndDisplayCargaison(): Promise<void> {
        const searchInput = document.getElementById('cargaisonSearch') as HTMLInputElement;
        if (!searchInput || !searchInput.value.trim()) {
            this.showError('Veuillez entrer un ID de cargaison');
            return;
        }

        const cargaisonId = searchInput.value.trim();
        try {
            const response = await this.cargaisonService.getCargaisonById(cargaisonId);
            
            if (response.success && response.data) {
                this.updateCargaisonDetails(response.data);
                this.initDashboardMap(response.data);
            } else {
                this.showError('Cargaison non trouvée');
                this.updateCargaisonDetails(null);
            }
        } catch (error) {
            console.error('Erreur recherche:', error);
            this.showError('Erreur lors de la recherche');
        }
    }

    // Initialisation des événements
    private initializeEventListeners(): void {
        // Recherche de cargaisons
        const searchInput = document.getElementById('cargaisonSearch') as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                this.searchCargaisons(target.value);
            });

            searchInput.addEventListener('focus', () => {
                const suggestionsContainer = document.getElementById('cargaisonSuggestions');
                if (suggestionsContainer) {
                    suggestionsContainer.classList.remove('hidden');
                }
            });

            document.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('#cargaisonSearch') && !target.closest('#cargaisonSuggestions')) {
                    this.hideSuggestions();
                }
            });
        }

        // Bouton "Voir Détails"
        const searchBtn = document.getElementById('searchCargaisonBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchAndDisplayCargaison();
            });
        }

        // Actualisation automatique
        setInterval(() => {
            this.loadDashboardData();
        }, 60000); // Toutes les minutes
    }

    // Méthodes utilitaires
    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(amount);
    }

    private formatDate(dateString: string): string {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    private generateShipmentPosition(cargaison: Cargaison): { lat: number; lng: number } {
        const routes: Record<string, { lat: number; lng: number }> = {
            'dakar-paris': { lat: 35.0, lng: -20.0 },
            'abidjan-lyon': { lat: 10.0, lng: -15.0 },
            'dakar-ottawa': { lat: 45.0, lng: -60.0 },
            'senegal-france': { lat: 30.0, lng: -15.0 },
            'dakar-thiès': { lat: 14.7, lng: -17.4 }
        };

        const key = `${cargaison.origine?.toLowerCase() || 'dakar'}-${cargaison.destination?.toLowerCase() || 'paris'}`;
        const position = routes[key];
        return position || routes['dakar-paris'] || { lat: 35.0, lng: -20.0 };
    }

    private getTypeIcon(type: string): string {
        const icons: Record<string, string> = {
            'Maritime': 'ship',
            'Aérien': 'plane',
            'Routier': 'truck'
        };
        return icons[type] || 'box';
    }

    private getTypeColor(type: string): string {
        const colors: Record<string, string> = {
            'Maritime': 'from-blue-500 to-blue-600',
            'Aérien': 'from-purple-500 to-purple-600',
            'Routier': 'from-green-500 to-green-600'
        };
        return colors[type] || 'from-aqua to-aqua-light';
    }

    private getVitesseByType(type: string): string {
        const vitesses: Record<string, string> = {
            'Maritime': '18 nœuds',
            'Aérien': '850 km/h',
            'Routier': '80 km/h'
        };
        return vitesses[type] || '-';
    }

    private getProgressionByStatus(statut: string): number {
        const progressions: Record<string, number> = {
            'En attente': 5,
            'En cours': 35,
            'En transit': 65,
            'Arrivé': 95,
            'Récupéré': 100
        };
        return progressions[statut] || 0;
    }

    private showError(message: string): void {
        console.error(message);
        // Ici on pourrait afficher une notification d'erreur
    }
}

// Initialisation automatique supprimée - maintenant gérée par App.ts
