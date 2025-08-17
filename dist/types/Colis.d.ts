export interface PersonneInfo {
    nom: string;
    prenom: string;
    telephone: string;
    email?: string | undefined;
    adresse: string;
}
export interface ColisFormData {
    client: PersonneInfo;
    destinataire: PersonneInfo;
    nombreColis: number;
    poids: number;
    typeProduit: string;
    typeCargaison: string;
    valeurDeclaree?: number;
    description?: string;
}
export interface Colis {
    id: string;
    trackingCode: string;
    client: PersonneInfo;
    destinataire: PersonneInfo;
    nombreColis: number;
    poids: number;
    typeProduit: string;
    typeCargaison: string;
    valeurDeclaree?: number;
    prix: number;
    description?: string;
    statut: string;
    dateCreation: string;
}
//# sourceMappingURL=Colis.d.ts.map