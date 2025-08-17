// src/ts/components/CargaisonForm.ts

interface Cargaison {
  type: string;
  origine: string;
  destination: string;
  transporteur?: string | undefined;
  numeroVol?: string | undefined;
  numeroNavire?: string | undefined;
  numeroCamion?: string | undefined;
  poidsMax: number;
  prixParKg: number;
  dateDepart?: string | undefined;
  description?: string | undefined;
}

export class CargaisonForm {
  private form: HTMLFormElement;
  private typeSelect: HTMLSelectElement;
  private poidsInput: HTMLInputElement;
  private prixInput: HTMLInputElement;
  private prixTotalSpan: HTMLSpanElement;

  constructor() {
    this.form = document.getElementById("form-cargaison") as HTMLFormElement;
    this.typeSelect = document.getElementById(
      "type-cargaison"
    ) as HTMLSelectElement;
    this.poidsInput = document.getElementById("poids-max") as HTMLInputElement;
    this.prixInput = document.getElementById("prix-par-kg") as HTMLInputElement;
    this.prixTotalSpan = document.getElementById(
      "prix-total"
    ) as HTMLSpanElement;

    this.init();
  }

  private init(): void {
    this.typeSelect.addEventListener("change", () => this.handleTypeChange());

    // Calcul automatique du prix total
    this.poidsInput.addEventListener("input", () => this.calculateTotal());
    this.prixInput.addEventListener("input", () => this.calculateTotal());

    // Soumission du formulaire
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  private handleTypeChange(): void {
    const type = this.typeSelect.value;

    // Masquer tous les champs spécifiques
    this.hideElement("numero-vol-div");
    this.hideElement("numero-navire-div");
    this.hideElement("numero-camion-div");

    // Afficher le champ approprié
    switch (type) {
      case "Aérien":
        this.showElement("numero-vol-div");
        break;
      case "Maritime":
        this.showElement("numero-navire-div");
        break;
      case "Routier":
        this.showElement("numero-camion-div");
        break;
    }
  }

  private calculateTotal(): void {
    const poids = parseFloat(this.poidsInput.value) || 0;
    const prix = parseFloat(this.prixInput.value) || 0;
    const total = poids * prix;

    this.prixTotalSpan.textContent = `${total.toLocaleString("fr-FR")} FCFA`;
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const submitBtn = document.getElementById(
      "btn-submit"
    ) as HTMLButtonElement;
    const spinner = document.getElementById("loading-spinner") as HTMLElement;

    // Afficher le spinner
    spinner.style.display = "inline-block";
    submitBtn.disabled = true;

    try {
      const formData = new FormData(this.form);
      const cargaison = this.buildCargaisonObject(formData);

      const success = await this.saveCargaison(cargaison);

      if (success) {
        this.showMessage("success", "Cargaison créée avec succès !");
        setTimeout(() => {
          window.location.href = "/cargaisons";
        }, 1500);
      } else {
        this.showMessage("error", "Erreur lors de la création de la cargaison");
      }
    } catch (error) {
      this.showMessage("error", "Erreur de connexion au serveur");
      console.error("Erreur:", error);
    } finally {
      spinner.style.display = "none";
      submitBtn.disabled = false;
    }
  }

  private buildCargaisonObject(formData: FormData): Cargaison {
    return {
      type: formData.get("type") as string,
      origine: formData.get("origine") as string,
      destination: formData.get("destination") as string,
      transporteur: (formData.get("transporteur") as string) || undefined,
      numeroVol: (formData.get("numeroVol") as string) || undefined,
      numeroNavire: (formData.get("numeroNavire") as string) || undefined,
      numeroCamion: (formData.get("numeroCamion") as string) || undefined,
      poidsMax: parseFloat(formData.get("poidsMax") as string),
      prixParKg: parseFloat(formData.get("prixParKg") as string),
      dateDepart: (formData.get("dateDepart") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
    };
  }

  private async saveCargaison(cargaison: Cargaison): Promise<boolean> {
    try {
      // Générer un ID unique
      const id = `CARG-${String(Date.now()).slice(-6)}`;

      const cargaisonData = {
        id,
        ...cargaison,
        statut: "En attente",
        dateCreation: new Date().toISOString().split("T")[0],
      };

      const response = await fetch("http://localhost:3000/cargaisons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cargaisonData),
      });

      return response.ok;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      return false;
    }
  }

  private showElement(id: string): void {
    const element = document.getElementById(id);
    if (element) element.style.display = "block";
  }

  private hideElement(id: string): void {
    const element = document.getElementById(id);
    if (element) element.style.display = "none";
  }

  private showMessage(type: "success" | "error", message: string): void {
    const container = document.getElementById("message-container");
    if (!container) return;

    const alertClass =
      type === "success"
        ? "bg-green-50 text-green-800 border-green-200"
        : "bg-red-50 text-red-800 border-red-200";
    const icon =
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

    container.innerHTML = `
            <div class="${alertClass} border-l-4 p-4 mb-6 rounded">
                <div class="flex">
                    <i class="fas ${icon} mr-2"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;

    setTimeout(() => {
      container.innerHTML = "";
    }, 5000);
  }
}
