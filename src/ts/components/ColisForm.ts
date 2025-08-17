// src/ts/components/ColisForm.ts

import type { ColisFormData, Colis } from "../../types/Colis.js";
import { emailService, sendPackageConfirmationEmail, type FormEmailData } from '../config/EmailConfig.js';
export class ColisForm {
  private form: HTMLFormElement;
  private tarifConfig = {
    maritime: 2000,
    aerien: 5000,
    routier: 3000,
  };

  constructor() {
    this.form = document.querySelector(
      "form[data-colis-form]"
    ) as HTMLFormElement;
    this.init();
  }

  private init(): void {
    if (!this.form) return;


    const poidsInput = this.getElement<HTMLInputElement>("#poids-colis");
    const typeTransportSelect =
      this.getElement<HTMLSelectElement>("#type-cargaison");

    poidsInput?.addEventListener("input", () => this.calculerPrix());
    typeTransportSelect?.addEventListener("change", () => this.calculerPrix());

    // Gérer la soumission du formulaire
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Bouton calculer prix
    const btnCalculer = document.querySelector(
      "[data-btn-calculer]"
    ) as HTMLButtonElement;
    btnCalculer?.addEventListener("click", () => this.calculerPrix());
  }

  private getElement<T extends HTMLElement>(selector: string): T | null {
    return this.form.querySelector(selector) as T;
  }

  private calculerPrix(): void {
    const poidsInput = this.getElement<HTMLInputElement>("#poids-colis");
    const typeTransportSelect =
      this.getElement<HTMLSelectElement>("#type-cargaison");
    const prixInput = this.getElement<HTMLInputElement>("#prix-calcule");

    if (!poidsInput || !typeTransportSelect || !prixInput) return;

    const poids = parseFloat(poidsInput.value) || 0;
    const typeTransport =
      typeTransportSelect.value as keyof typeof this.tarifConfig;

    if (!typeTransport || poids <= 0) {
      prixInput.value = "";
      return;
    }

    const tarifParKg = this.tarifConfig[typeTransport];
    const prixBase = poids * tarifParKg;
    const fraisService = prixBase * 0.1; // 10% de frais de service
    let total = prixBase + fraisService;

    // Prix minimum
    if (total < 10000) {
      total = 10000;
    }

    prixInput.value = Math.round(total).toString();
  }

  private async collectFormData(): Promise<ColisFormData | null> {
    const getData = (id: string): string => {
      const element = this.getElement<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >(id);
      return element?.value.trim() || "";
    };

    // Validations personnalisées
    const clientNom = getData("#client-nom");
    const clientPrenom = getData("#client-prenom"); 
    const clientTel = getData("#client-telephone");
    const clientAdresse = getData("#client-adresse");
    
    const destNom = getData("#dest-nom");
    const destPrenom = getData("#dest-prenom");
    const destTel = getData("#dest-telephone");
    const destAdresse = getData("#dest-adresse");
    
    const nombreColis = parseInt(getData("#nombre-colis"));
    const poids = parseFloat(getData("#poids-colis"));
    const typeProduit = getData("#type-produit");
    const typeCargaison = getData("#type-cargaison");

    // Validation du nom du client
    if (!clientNom || clientNom.length < 2) {
      this.showError("Le nom du client doit contenir au moins 2 caractères.");
      this.getElement("#client-nom")?.focus();
      return null;
    }

    // Validation du téléphone client 
    if (!clientTel || !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(clientTel)) {
      this.showError("Veuillez entrer un numéro de téléphone valide pour le client.");
      this.getElement("#client-telephone")?.focus();
      return null;
    }

    // Validation destinataire si renseigné
    if (destNom && destNom.length < 2) {
      this.showError("Le nom du destinataire doit contenir au moins 2 caractères.");
      this.getElement("#dest-nom")?.focus();
      return null;
    }

    // Validation des colis
    if (isNaN(nombreColis) || nombreColis <= 0) {
      this.showError("Le nombre de colis doit être supérieur à 0.");
      this.getElement("#nombre-colis")?.focus();
      return null;
    }

    if (isNaN(poids) || poids <= 0) {
      this.showError("Le poids doit être supérieur à 0.");
      this.getElement("#poids-colis")?.focus();
      return null;
    }

    // Vérification si la cargaison sélectionnée est fermée
    if (typeCargaison) {
      const isCargaisonFermee = await this.checkCargaisonFermee(typeCargaison);
      if (isCargaisonFermee) {
        this.showError("Cette cargaison est fermée et ne peut plus recevoir de nouveaux colis.");
        this.getElement("#type-cargaison")?.focus();
        return null;
      }
    }

    const valeurDeclareeStr = getData("#valeur-declaree");
    const valeurDeclaree =
      valeurDeclareeStr !== "" ? parseFloat(valeurDeclareeStr) : undefined;

    return {
      client: {
        nom: getData("#client-nom"),
        prenom: getData("#client-prenom"),
        telephone: getData("#client-telephone"),
        email: getData("#client-email") || undefined,
        adresse: getData("#client-adresse"),
      },
      destinataire: {
        nom: getData("#dest-nom"),
        prenom: getData("#dest-prenom"),
        telephone: getData("#dest-telephone"),
        email: getData("#dest-email") || undefined,
        adresse: getData("#dest-adresse"),
      },
      nombreColis,
      poids,
      typeProduit: getData("#type-produit"),
      typeCargaison: getData("#type-cargaison"),
      valeurDeclaree: valeurDeclaree || 0,
      description: getData("#description-contenu") || "",
    };
  }

  private async checkCargaisonFermee(typeCargaison: string): Promise<boolean> {
    try {
      const response = await fetch('/api/cargaisons');
      if (!response.ok) return false;
      
      const cargaisons = await response.json();
      const cargaison = cargaisons.find((c: any) => c.id === typeCargaison || c.type === typeCargaison);
      
      return cargaison ? cargaison.fermee === true : false;
    } catch (error) {
      console.error('Erreur lors de la vérification de la cargaison:', error);
      return false;
    }
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const formData = await this.collectFormData();
    if (!formData) return;

    // Calculer le prix final
    this.calculerPrix();
    const prixInput = this.getElement<HTMLInputElement>("#prix-calcule");
    const prix = parseInt(prixInput?.value || "0");

    if (prix <= 0) {
      this.showError("Veuillez d'abord calculer le prix.");
      return;
    }

    try {
      const trackingCode = this.generateTrackingCode();

      const colis: Colis = {
        id: `COLIS-${Date.now()}`,
        trackingCode,
        client: formData.client,
        destinataire: formData.destinataire,
        nombreColis: formData.nombreColis,
        poids: formData.poids,
        typeProduit: formData.typeProduit as any,
        typeCargaison: formData.typeCargaison as any,
        valeurDeclaree: formData.valeurDeclaree || 0,
        prix,
        description: formData.description || "",
        statut: "en-attente",
        dateCreation: new Date().toISOString().split("T")[0] as string,
      };

      const result = await this.saveColis(colis);

      if (result.success) {
        let successMessage = `Colis enregistré avec succès !<br>Code de suivi: <strong>${trackingCode}</strong>`;
        
        // Essayer d'envoyer l'email avec le service TypeScript
        try {
          const emailData: FormEmailData = {
            client: {
              nom: formData.client.nom,
              prenom: formData.client.prenom,
              ...(formData.client.email && { email: formData.client.email })
            },
            destinataire: {
              nom: formData.destinataire.nom,
              prenom: formData.destinataire.prenom,
              ...(formData.destinataire.email && { email: formData.destinataire.email })
            },
            trackingCode: trackingCode,
            packageDetails: {
              description: formData.description,
              poids: formData.poids,
              valeurDeclaree: formData.valeurDeclaree
            }
          };

          const emailResult = await sendPackageConfirmationEmail(emailData);
          
          if (emailResult.emailSent) {
            successMessage += '<br><i class="fas fa-envelope text-green-500 mr-1"></i>Email de confirmation envoyé au destinataire';
          } else if (emailResult.success) {
            successMessage += '<br><i class="fas fa-info-circle text-yellow-500 mr-1"></i>Aucun email envoyé (adresse non fournie)';
          } else {
            successMessage += '<br><i class="fas fa-exclamation-triangle text-red-500 mr-1"></i>Erreur envoi email: ' + emailResult.message;
          }
        } catch (error) {
          console.error('Erreur service email:', error);
          successMessage += '<br><i class="fas fa-exclamation-triangle text-red-500 mr-1"></i>Erreur service email';
        }
        
        this.showSuccess(successMessage);
        this.resetForm();
      } else {
        this.showError("Erreur lors de l'enregistrement du colis.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      this.showError("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  private generateTrackingCode(): string {
    const timestamp = Date.now().toString();
    return `YONIMA${timestamp.slice(-6)}`;
  }
private async saveColis(colis: Colis): Promise<{ success: boolean; emailSent?: boolean; trackingCode?: string }> {
    try {
        const response = await fetch("/api/colis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(colis),
        });
        const result = await response.json();
        if (response.ok && result.success) {
            return {
                success: true,
                emailSent: result.emailSent,
                trackingCode: result.trackingCode
            };
        } else {
            this.showError(result.error || "Erreur lors de l'enregistrement du colis.");
            return { success: false };
        }
    } catch (error) {
        this.showError("Erreur réseau lors de l'enregistrement du colis.");
        return { success: false };
    }
}

  private resetForm(): void {
    this.form.reset();
    const prixInput = this.getElement<HTMLInputElement>("#prix-calcule");
    if (prixInput) prixInput.value = "";
  }

  private showSuccess(message: string): void {
    this.showMessage(message, "success");
  }

  private showError(message: string): void {
    this.showMessage(message, "error");
  }

  private showMessage(message: string, type: "success" | "error"): void {
    // Supprimer les anciens messages
    const existingMessage = document.querySelector(".message-notification");
    if (existingMessage) {
      existingMessage.remove();
    }

    const notification = document.createElement("div");
    notification.className = `message-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;

    notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                  type === "success"
                    ? "fa-check-circle"
                    : "fa-exclamation-triangle"
                } mr-2"></i>
                <div class="flex-1">
                    <div class="text-sm font-medium">${message}</div>
                </div>
                <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto-supprimer après 5 secondes
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialiser quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  new ColisForm();
});
