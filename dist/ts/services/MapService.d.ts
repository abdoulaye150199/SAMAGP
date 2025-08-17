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
export declare class MapService {
    private static instance;
    private maps;
    private shipmentMarkers;
    private constructor();
    static getInstance(): MapService;
    private isLeafletAvailable;
    initMap(config: MapConfig): any;
    getMap(containerId: string): any;
    removeMap(containerId: string): void;
    addShipmentMarkers(containerId: string, cargaisons: Cargaison[]): void;
    clearShipmentMarkers(containerId: string): void;
    focusOnShipment(containerId: string, cargaison: Cargaison): void;
    private showInfoPanel;
    closeInfoPanel(): void;
    private generateShipmentPosition;
    private getTypeIcon;
    private getTypeColor;
    private getVitesseByType;
    private getProgressionByStatus;
    private calculateDistance;
    searchShipmentOnMap(containerId: string, searchTerm: string): void;
    exportPositions(containerId: string): any[];
}
//# sourceMappingURL=MapService.d.ts.map