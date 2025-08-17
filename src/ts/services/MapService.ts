// src/ts/services/MapService.ts

import type { Cargaison } from '../models/Cargaison.js';

export interface MapPosition {
    lat: number;
    lng: number;
}

export interface MapConfig {
    containerId: string;
    center?: MapPosition;
    zoom?: number;
    zoomControl?: boolean;
    scrollWheelZoom?: boolean;
    dragging?: boolean;
    doubleClickZoom?: boolean;
}

export class MapService {
    private static instance: MapService;
    private maps: Map<string, any> = new Map();
    private shipmentMarkers: Map<string, any[]> = new Map();

    private constructor() {}

    public static getInstance(): MapService {
        if (!MapService.instance) {
            MapService.instance = new MapService();
        }
        return MapService.instance;
    }

    // Vérifier si Leaflet est disponible
    private isLeafletAvailable(): boolean {
        return typeof (window as any).L !== 'undefined';
    }

    // Initialiser une carte
    public initMap(config: MapConfig): any {
        if (!this.isLeafletAvailable()) {
            console.error('Leaflet n\'est pas chargé');
            return null;
        }

        const container = document.getElementById(config.containerId);
        if (!container) {
            console.error(`Container ${config.containerId} non trouvé`);
            return null;
        }

        // Supprimer l'ancienne carte si elle existe
        if (this.maps.has(config.containerId)) {
            this.maps.get(config.containerId).remove();
        }

        const L = (window as any).L;
        const map = L.map(config.containerId, {
            zoomControl: config.zoomControl ?? true,
            scrollWheelZoom: config.scrollWheelZoom ?? true,
            dragging: config.dragging ?? true,
            doubleClickZoom: config.doubleClickZoom ?? true
        }).setView([config.center?.lat ?? 20, config.center?.lng ?? -20], config.zoom ?? 3);

        // Thème sombre par défaut
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap contributors'
        }).addTo(map);

        this.maps.set(config.containerId, map);
        this.shipmentMarkers.set(config.containerId, []);

        return map;
    }

    // Obtenir une carte existante
    public getMap(containerId: string): any {
        return this.maps.get(containerId);
    }

    // Supprimer une carte
    public removeMap(containerId: string): void {
        const map = this.maps.get(containerId);
        if (map) {
            map.remove();
            this.maps.delete(containerId);
            this.shipmentMarkers.delete(containerId);
        }
    }

    // Ajouter des marqueurs de cargaisons
    public addShipmentMarkers(containerId: string, cargaisons: Cargaison[]): void {
        const map = this.maps.get(containerId);
        if (!map || !this.isLeafletAvailable()) return;

        // Nettoyer les anciens marqueurs
        this.clearShipmentMarkers(containerId);

        const L = (window as any).L;
        const markers: any[] = [];

        cargaisons.forEach(cargaison => {
            const position = this.generateShipmentPosition(cargaison);
            const typeIcon = this.getTypeIcon(cargaison.type);
            const typeColor = this.getTypeColor(cargaison.type);

            const marker = L.marker([position.lat, position.lng], {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: `
                        <div class="relative">
                            <div class="w-6 h-6 bg-gradient-to-r ${typeColor} rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg">
                                <i class="fas fa-${typeIcon}"></i>
                            </div>
                            <div class="absolute -top-8 -left-8 bg-dark-light/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                                ${cargaison.id}
                            </div>
                        </div>
                    `,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }).addTo(map);

            marker.shipmentData = cargaison;
            marker.position = position;

            marker.on('click', () => {
                this.focusOnShipment(containerId, cargaison);
            });

            markers.push(marker);
        });

        this.shipmentMarkers.set(containerId, markers);
    }

    // Nettoyer les marqueurs
    public clearShipmentMarkers(containerId: string): void {
        const markers = this.shipmentMarkers.get(containerId) || [];
        const map = this.maps.get(containerId);

        if (map) {
            markers.forEach(marker => map.removeLayer(marker));
        }

        this.shipmentMarkers.set(containerId, []);
    }

    // Focus sur une cargaison
    public focusOnShipment(containerId: string, cargaison: Cargaison): void {
        const map = this.maps.get(containerId);
        if (!map) return;

        const markers = this.shipmentMarkers.get(containerId) || [];
        const marker = markers.find(m => m.shipmentData.id === cargaison.id);

        if (marker) {
            map.setView([marker.position.lat, marker.position.lng], 6);
            this.showInfoPanel(cargaison, marker.position);
        }
    }

    // Afficher le panneau d'informations
    private showInfoPanel(cargaison: Cargaison, position: MapPosition): void {
        const panel = document.getElementById('infoPanel');
        if (!panel) return;

        const elements = {
            title: document.getElementById('shipmentTitle'),
            type: document.getElementById('shipmentType'),
            route: document.getElementById('shipmentRoute'),
            status: document.getElementById('shipmentStatus'),
            progress: document.getElementById('shipmentProgress'),
            distance: document.getElementById('shipmentDistance'),
            coordinates: document.getElementById('coordinates'),
            speed: document.getElementById('speed')
        };

        if (elements.title) elements.title.textContent = cargaison.id;
        if (elements.type) elements.type.textContent = cargaison.type;
        if (elements.route) elements.route.textContent = `${cargaison.origine} → ${cargaison.destination}`;
        if (elements.status) elements.status.textContent = cargaison.statut;
        if (elements.progress) elements.progress.textContent = `${this.getProgressionByStatus(cargaison.statut)}%`;
        if (elements.distance) elements.distance.textContent = this.calculateDistance(cargaison.origine, cargaison.destination);
        if (elements.coordinates) elements.coordinates.textContent = `${position.lat.toFixed(1)}°N, ${Math.abs(position.lng).toFixed(1)}°W`;
        if (elements.speed) elements.speed.textContent = this.getVitesseByType(cargaison.type);

        panel.classList.remove('hidden');
    }

    // Fermer le panneau d'informations
    public closeInfoPanel(): void {
        const panel = document.getElementById('infoPanel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    // Génération de position pour les cargaisons
    private generateShipmentPosition(cargaison: Cargaison): MapPosition {
        const type = cargaison.type.toLowerCase();

        const routes: Record<string, Record<string, MapPosition>> = {
            'maritime': {
                'dakar-paris': { lat: 35.0, lng: -20.0 },
                'abidjan-lyon': { lat: 10.0, lng: -15.0 },
                'dakar-ottawa': { lat: 45.0, lng: -60.0 },
                'senegal-france': { lat: 30.0, lng: -15.0 }
            },
            'aérien': {
                'dakar-paris': { lat: 40.0, lng: -5.0 },
                'abidjan-lyon': { lat: 35.0, lng: 5.0 },
                'etat unis-senegal': { lat: 25.0, lng: -30.0 },
                'dakar-ottawa': { lat: 50.0, lng: -40.0 }
            },
            'routier': {
                'dakar-bamako': { lat: 14.0, lng: -10.0 },
                'abidjan-accra': { lat: 6.0, lng: -2.0 },
                'senegal-mali': { lat: 14.5, lng: -11.0 }
            }
        };

        const key = `${cargaison.origine.toLowerCase()}-${cargaison.destination.toLowerCase()}`;
        const typeRoutes = routes[type] || routes['maritime'];
        
        return typeRoutes[key] || typeRoutes['dakar-paris'] || { lat: 0, lng: 0 };
    }

    // Utilitaires
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

    private calculateDistance(origine: string, destination: string): string {
        const distances: Record<string, string> = {
            'dakar-paris': '4,200 km',
            'abidjan-lyon': '4,850 km',
            'dakar-ottawa': '6,800 km',
            'senegal-france': '4,100 km'
        };

        const key = `${origine.toLowerCase()}-${destination.toLowerCase()}`;
        return distances[key] || 'N/A';
    }

    // Recherche sur la carte
    public searchShipmentOnMap(containerId: string, searchTerm: string): void {
        const markers = this.shipmentMarkers.get(containerId) || [];
        const foundMarker = markers.find(marker => 
            marker.shipmentData.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (foundMarker) {
            this.focusOnShipment(containerId, foundMarker.shipmentData);
        }
    }

    // Export des positions
    public exportPositions(containerId: string): any[] {
        const markers = this.shipmentMarkers.get(containerId) || [];
        return markers.map(marker => ({
            id: marker.shipmentData.id,
            type: marker.shipmentData.type,
            position: marker.position,
            status: marker.shipmentData.statut
        }));
    }
}
