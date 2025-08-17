// src/ts/controllers/SuiviCarteController.ts

import { MapService } from '../services/MapService.js';
import { CargaisonService } from '../services/CargaisonService.js';
import type { Cargaison } from '../models/Cargaison.js';

export class SuiviCarteController {
    private static instance: SuiviCarteController;
    private mapService: MapService;
    private cargaisonService: CargaisonService;
    private cargaisons: Cargaison[] = [];

    private constructor() {
        this.mapService = MapService.getInstance();
        this.cargaisonService = CargaisonService.getInstance();
    }

    public static getInstance(): SuiviCarteController {
        if (!SuiviCarteController.instance) {
            SuiviCarteController.instance = new SuiviCarteController();
        }
        return SuiviCarteController.instance;
    }

    public async initialize(): Promise<void> {
        console.log('🗺️ Initialisation SuiviCarteController');

        // Attendre que Leaflet soit chargé
        await this.waitForLeaflet();

        // Initialiser la carte
        this.initializeMap();

        // Charger les cargaisons
        await this.loadCargaisons();

        // Initialiser les événements
        this.initializeEvents();

        // Afficher les cargaisons sur la carte
        this.displayShipments();

        console.log('✅ SuiviCarteController initialisé');
    }

    private async waitForLeaflet(): Promise<void> {
        return new Promise((resolve) => {
            if (typeof (window as any).L !== 'undefined') {
                resolve();
                return;
            }

            const checkLeaflet = setInterval(() => {
                if (typeof (window as any).L !== 'undefined') {
                    clearInterval(checkLeaflet);
                    resolve();
                }
            }, 100);

            // Timeout après 10 secondes
            setTimeout(() => {
                clearInterval(checkLeaflet);
                console.error('Leaflet non chargé après 10 secondes');
                resolve();
            }, 10000);
        });
    }

    private initializeMap(): void {
        this.mapService.initMap({
            containerId: 'mapContainer',
            center: { lat: 20, lng: -20 },
            zoom: 3,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            doubleClickZoom: true
        });
    }

    private async loadCargaisons(): Promise<void> {
        try {
            const response = await this.cargaisonService.getAllCargaisons();
            if (response.success && response.data) {
                this.cargaisons = response.data;
            } else {
                console.warn('API non disponible, utilisation de données de test');
                this.cargaisons = this.getMockCargaisons();
            }
            this.displayShipmentsList();
        } catch (error) {
            console.error('Erreur lors du chargement des cargaisons:', error);
            this.cargaisons = this.getMockCargaisons();
            this.displayShipmentsList();
        }
    }

    private displayShipments(): void {
        if (this.cargaisons.length > 0) {
            this.mapService.addShipmentMarkers('mapContainer', this.cargaisons);
        }
    }

    private displayShipmentsList(): void {
        const container = document.getElementById('shipmentsList');
        if (!container) return;

        if (this.cargaisons.length === 0) {
            container.innerHTML = '<p class="text-gray-400">Aucune cargaison en cours</p>';
            return;
        }

        container.innerHTML = this.cargaisons.map(cargaison => `
            <div class="flex-shrink-0 bg-slate-800 border border-emerald-500/20 rounded-lg p-4 min-w-[250px] cursor-pointer hover:border-emerald-500/40 transition-all"
                 onclick="focusShipment('${cargaison.id}')">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-emerald-400 font-bold text-sm">${cargaison.id}</span>
                    <span class="px-2 py-1 bg-${this.getStatusColor(cargaison.statut)}/20 text-${this.getStatusColor(cargaison.statut)}-400 text-xs rounded-full">
                        ${cargaison.statut}
                    </span>
                </div>
                <div class="text-white text-sm">
                    <div class="flex items-center mb-1">
                        <i class="fas fa-${this.getTypeIcon(cargaison.type)} text-emerald-400 mr-2"></i>
                        <span>${cargaison.type}</span>
                    </div>
                    <div class="text-slate-300 text-xs">
                        ${cargaison.origine} → ${cargaison.destination}
                    </div>
                </div>
            </div>
        `).join('');
    }

    private initializeEvents(): void {
        // Recherche
        const searchInput = document.getElementById('searchShipment');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const target = e.target as HTMLInputElement;
                this.handleSearch(target.value);
            });
        }

        // Exposer les fonctions globalement pour les onclick
        (window as any).focusShipment = (id: string) => {
            const cargaison = this.cargaisons.find(c => c.id === id);
            if (cargaison) {
                this.mapService.focusOnShipment('mapContainer', cargaison);
            }
        };

        (window as any).clearSearch = () => {
            const searchInput = document.getElementById('searchShipment') as HTMLInputElement;
            if (searchInput) {
                searchInput.value = '';
                this.handleSearch('');
            }
        };

        (window as any).toggleFullscreen = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                const icon = document.getElementById('fullscreenIcon');
                if (icon) icon.className = 'fas fa-compress';
            } else {
                document.exitFullscreen();
                const icon = document.getElementById('fullscreenIcon');
                if (icon) icon.className = 'fas fa-expand';
            }
        };

        (window as any).closeInfoPanel = () => {
            this.mapService.closeInfoPanel();
        };
    }

    private handleSearch(searchTerm: string): void {
        if (searchTerm.trim() === '') {
            this.displayShipmentsList();
            return;
        }

        const filteredCargaisons = this.cargaisons.filter(c =>
            c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.origine.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.destination.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const container = document.getElementById('shipmentsList');
        if (container) {
            if (filteredCargaisons.length === 0) {
                container.innerHTML = '<p class="text-gray-400">Aucune cargaison trouvée</p>';
            } else {
                container.innerHTML = filteredCargaisons.map(cargaison => `
                    <div class="flex-shrink-0 bg-slate-800 border border-emerald-500/20 rounded-lg p-4 min-w-[250px] cursor-pointer hover:border-emerald-500/40 transition-all"
                         onclick="focusShipment('${cargaison.id}')">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-emerald-400 font-bold text-sm">${cargaison.id}</span>
                            <span class="px-2 py-1 bg-${this.getStatusColor(cargaison.statut)}/20 text-${this.getStatusColor(cargaison.statut)}-400 text-xs rounded-full">
                                ${cargaison.statut}
                            </span>
                        </div>
                        <div class="text-white text-sm">
                            <div class="flex items-center mb-1">
                                <i class="fas fa-${this.getTypeIcon(cargaison.type)} text-emerald-400 mr-2"></i>
                                <span>${cargaison.type}</span>
                            </div>
                            <div class="text-slate-300 text-xs">
                                ${cargaison.origine} → ${cargaison.destination}
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Focus sur la première cargaison trouvée
        if (filteredCargaisons.length > 0) {
            this.mapService.searchShipmentOnMap('mapContainer', searchTerm);
        }
    }

    private getMockCargaisons(): Cargaison[] {
        return [
            {
                id: 'CARG-001',
                type: 'Maritime',
                origine: 'Dakar',
                destination: 'Paris',
                statut: 'En cours',
                poidsMax: 1000,
                prixParKg: 2500,
                dateCreation: new Date().toISOString(),
                description: 'Cargaison maritime test',
                fermee: false
            },
            {
                id: 'CARG-002',
                type: 'Aérien',
                origine: 'Abidjan',
                destination: 'Lyon',
                statut: 'En transit',
                poidsMax: 500,
                prixParKg: 5000,
                dateCreation: new Date().toISOString(),
                description: 'Cargaison aérienne test',
                fermee: false
            },
            {
                id: 'CARG-003',
                type: 'Routier',
                origine: 'Dakar',
                destination: 'Bamako',
                statut: 'Arrivé',
                poidsMax: 2000,
                prixParKg: 1500,
                dateCreation: new Date().toISOString(),
                description: 'Cargaison routière test',
                fermee: false
            }
        ];
    }

    private getStatusColor(statut: string): string {
        const colors: Record<string, string> = {
            'En attente': 'yellow',
            'En cours': 'blue',
            'En transit': 'amber',
            'Arrivé': 'green',
            'Récupéré': 'emerald',
            'Perdu': 'red'
        };
        return colors[statut] || 'gray';
    }

    private getTypeIcon(type: string): string {
        const icons: Record<string, string> = {
            'Maritime': 'ship',
            'Aérien': 'plane',
            'Routier': 'truck'
        };
        return icons[type] || 'box';
    }
}
