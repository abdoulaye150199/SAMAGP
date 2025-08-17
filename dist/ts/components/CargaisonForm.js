// src/ts/components/CargaisonForm.ts
export class CargaisonForm {
    constructor() {
        this.form = document.getElementById("form-cargaison");
        this.typeSelect = document.getElementById("type-cargaison");
        this.poidsInput = document.getElementById("poids-max");
        this.prixInput = document.getElementById("prix-par-kg");
        this.prixTotalSpan = document.getElementById("prix-total");
        this.init();
    }
    init() {
        this.typeSelect.addEventListener("change", () => this.handleTypeChange());
        // Calcul automatique du prix total
        this.poidsInput.addEventListener("input", () => this.calculateTotal());
        this.prixInput.addEventListener("input", () => this.calculateTotal());
        // Soumission du formulaire
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
    handleTypeChange() {
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
    calculateTotal() {
        const poids = parseFloat(this.poidsInput.value) || 0;
        const prix = parseFloat(this.prixInput.value) || 0;
        const total = poids * prix;
        this.prixTotalSpan.textContent = `${total.toLocaleString("fr-FR")} FCFA`;
    }
    async handleSubmit(e) {
        e.preventDefault();
        const submitBtn = document.getElementById("btn-submit");
        const spinner = document.getElementById("loading-spinner");
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
            }
            else {
                this.showMessage("error", "Erreur lors de la création de la cargaison");
            }
        }
        catch (error) {
            this.showMessage("error", "Erreur de connexion au serveur");
            console.error("Erreur:", error);
        }
        finally {
            spinner.style.display = "none";
            submitBtn.disabled = false;
        }
    }
    buildCargaisonObject(formData) {
        return {
            type: formData.get("type"),
            origine: formData.get("origine"),
            destination: formData.get("destination"),
            transporteur: formData.get("transporteur") || undefined,
            numeroVol: formData.get("numeroVol") || undefined,
            numeroNavire: formData.get("numeroNavire") || undefined,
            numeroCamion: formData.get("numeroCamion") || undefined,
            poidsMax: parseFloat(formData.get("poidsMax")),
            prixParKg: parseFloat(formData.get("prixParKg")),
            dateDepart: formData.get("dateDepart") || undefined,
            description: formData.get("description") || undefined,
        };
    }
    async saveCargaison(cargaison) {
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
        }
        catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            return false;
        }
    }
    showElement(id) {
        const element = document.getElementById(id);
        if (element)
            element.style.display = "block";
    }
    hideElement(id) {
        const element = document.getElementById(id);
        if (element)
            element.style.display = "none";
    }
    showMessage(type, message) {
        const container = document.getElementById("message-container");
        if (!container)
            return;
        const alertClass = type === "success"
            ? "bg-green-50 text-green-800 border-green-200"
            : "bg-red-50 text-red-800 border-red-200";
        const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
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
//# sourceMappingURL=CargaisonForm.js.map