// src/ts/components/ProduitsDisplay.ts
export class ProduitsDisplay {
    constructor() {
        // Variables de pagination
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.allProduits = [];
        this.tbody = document.querySelector("tbody");
        this.statsCards = {
            total: document.querySelector('[data-stat="total"]'),
            livres: document.querySelector('[data-stat="livres"]'),
            enTransit: document.querySelector('[data-stat="en-transit"]'),
            problemes: document.querySelector('[data-stat="problemes"]'),
        };
        this.init();
    }
    init() {
        console.log("Initialisation de ProduitsDisplay...");
        this.loadProduits();
        // Actualiser toutes les 30 secondes
        setInterval(() => this.loadProduits(), 30000);
    }
    async loadProduits() {
        try {
            console.log("Chargement des produits...");
            const response = await fetch("/api/colis");
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const result = await response.json();
            console.log("Réponse de l'API:", result);
            // L'API retourne { success: true, data: [...] }
            const colis = result.success && result.data ? result.data : [];
            const produits = this.transformColisToProducts(colis);
            console.log(`${produits.length} produits transformés`);
            this.updateStats(produits);
            this.renderProduits(produits);
        }
        catch (error) {
            console.error("Erreur lors du chargement des produits:", error);
            this.showErrorMessage("Erreur lors du chargement des produits");
        }
    }
    transformColisToProducts(colis) {
        return colis.map((c) => ({
            id: c.id,
            code: c.trackingCode,
            type: c.typeProduit,
            expediteur: `${c.client.prenom} ${c.client.nom}`,
            expediteurVille: this.extractCity(c.client.adresse),
            destinataire: `${c.destinataire.prenom} ${c.destinataire.nom}`,
            destinataireVille: this.extractCity(c.destinataire.adresse),
            poids: c.poids,
            statut: this.mapStatut(c.statut),
            prix: c.prix,
            dateCreation: c.dateCreation,
            typeCargaison: c.typeCargaison,
            description: c.description,
        }));
    }
    extractCity(adresse) {
        if (!adresse)
            return "Non spécifié";
        const parts = adresse.split(",");
        const city = parts[parts.length - 1];
        return city ? city.trim() : "Non spécifié";
    }
    mapStatut(statut) {
        const mapping = {
            "en-attente": "En attente",
            "en-cours": "En cours",
            arrive: "Arrivé",
            livre: "Livré",
            perdu: "Perdu",
        };
        return mapping[statut] || "En attente";
    }
    updateStats(produits) {
        const stats = {
            total: produits.length,
            livres: produits.filter((p) => p.statut === "Livré").length,
            enTransit: produits.filter((p) => ["En cours", "En attente", "Arrivé"].includes(p.statut)).length,
            problemes: produits.filter((p) => p.statut === "Perdu").length,
        };
        if (this.statsCards.total) {
            this.statsCards.total.textContent = stats.total.toLocaleString();
        }
        if (this.statsCards.livres) {
            this.statsCards.livres.textContent = stats.livres.toLocaleString();
        }
        if (this.statsCards.enTransit) {
            this.statsCards.enTransit.textContent = stats.enTransit.toLocaleString();
        }
        if (this.statsCards.problemes) {
            this.statsCards.problemes.textContent = stats.problemes.toLocaleString();
        }
    }
    renderProduits(produits) {
        if (!this.tbody) {
            console.error("Tableau des produits non trouvé");
            return;
        }
        this.allProduits = produits;
        this.tbody.innerHTML = "";
        if (produits.length === 0) {
            this.tbody.innerHTML = `
      <tr>
      <td colspan="7" class="px-4 py-8 text-center text-gray-400">
      <i class="fas fa-box-open text-4xl mb-2"></i>
      <p>Aucun produit enregistré</p>
      </td>
      </tr>
      `;
            this.hidePagination();
            return;
        }
        // Afficher la pagination seulement si plus de 5 éléments
        if (produits.length > this.itemsPerPage) {
            this.showPagination();
            this.displayPage(this.currentPage);
        }
        else {
            this.hidePagination();
            produits.forEach((produit) => {
                const row = this.createProductRow(produit);
                this.tbody.appendChild(row);
            });
        }
    }
    displayPage(page) {
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = this.allProduits.slice(startIndex, endIndex);
        this.tbody.innerHTML = "";
        pageItems.forEach((produit) => {
            const row = this.createProductRow(produit);
            this.tbody.appendChild(row);
        });
        this.updatePaginationControls();
    }
    showPagination() {
        let paginationContainer = document.getElementById('produitsPaginationContainer');
        if (!paginationContainer) {
            this.createPaginationContainer();
            paginationContainer = document.getElementById('produitsPaginationContainer');
        }
        if (paginationContainer) {
            paginationContainer.classList.remove('hidden');
        }
    }
    hidePagination() {
        const paginationContainer = document.getElementById('produitsPaginationContainer');
        if (paginationContainer) {
            paginationContainer.classList.add('hidden');
        }
    }
    createPaginationContainer() {
        const tableContainer = this.tbody.closest('.bg-dark-light');
        if (!tableContainer)
            return;
        const paginationHTML = `
      <div id="produitsPaginationContainer" class="mt-6 flex items-center justify-between px-6 py-3 bg-dark border border-aqua/20 rounded-b-lg">
        <div class="text-sm text-gray-400">
          Affichage de <span id="produitsStartItem">1</span> à <span id="produitsEndItem">5</span> sur <span id="produitsTotalItems">0</span> éléments
        </div>
        <div class="flex items-center space-x-2">
          <button id="produitsPrevPage" 
                  class="px-3 py-1 text-sm bg-dark border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Précédent
          </button>
          <div id="produitsPageNumbers" class="flex space-x-1"></div>
          <button id="produitsNextPage" 
                  class="px-3 py-1 text-sm bg-dark border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Suivant
          </button>
        </div>
      </div>
    `;
        tableContainer.insertAdjacentHTML('afterend', paginationHTML);
        // Ajouter les event listeners
        document.getElementById('produitsPrevPage')?.addEventListener('click', () => {
            this.changePage(this.currentPage - 1);
        });
        document.getElementById('produitsNextPage')?.addEventListener('click', () => {
            this.changePage(this.currentPage + 1);
        });
    }
    updatePaginationControls() {
        const totalPages = Math.ceil(this.allProduits.length / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.allProduits.length);
        const startItemEl = document.getElementById('produitsStartItem');
        const endItemEl = document.getElementById('produitsEndItem');
        const totalItemsEl = document.getElementById('produitsTotalItems');
        if (startItemEl)
            startItemEl.textContent = startItem.toString();
        if (endItemEl)
            endItemEl.textContent = endItem.toString();
        if (totalItemsEl)
            totalItemsEl.textContent = this.allProduits.length.toString();
        // Boutons précédent/suivant
        const prevBtn = document.getElementById('produitsPrevPage');
        const nextBtn = document.getElementById('produitsNextPage');
        if (prevBtn)
            prevBtn.disabled = this.currentPage === 1;
        if (nextBtn)
            nextBtn.disabled = this.currentPage === totalPages;
        // Numéros de page
        const pageNumbers = document.getElementById('produitsPageNumbers');
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `px-3 py-1 text-sm rounded transition-colors ${i === this.currentPage
                        ? 'bg-aqua text-dark font-semibold'
                        : 'bg-dark border border-gray-600 text-white hover:bg-gray-700'}`;
                    pageBtn.textContent = i.toString();
                    pageBtn.onclick = () => this.changePage(i);
                    pageNumbers.appendChild(pageBtn);
                }
                else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                    const dots = document.createElement('span');
                    dots.textContent = '...';
                    dots.className = 'px-2 text-gray-400';
                    pageNumbers.appendChild(dots);
                }
            }
        }
    }
    changePage(page) {
        const totalPages = Math.ceil(this.allProduits.length / this.itemsPerPage);
        if (page < 1 || page > totalPages)
            return;
        this.currentPage = page;
        this.displayPage(this.currentPage);
    }
    createProductRow(produit) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="px-4 py-2 whitespace-nowrap">
                <div class="text-sm font-medium text-white">${produit.code}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex items-center">
                    <i class="fas ${this.getTypeIcon(produit.type)} text-aqua mr-2"></i>
                    <span class="text-sm text-white">${this.getTypeLabel(produit.type)}</span>
                </div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
                <div class="text-sm text-white">${produit.expediteur}</div>
                <div class="text-sm text-gray-400">${produit.expediteurVille}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap">
                <div class="text-sm text-white">${produit.destinataire}</div>
                <div class="text-sm text-gray-400">${produit.destinataireVille}</div>
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-white">${produit.poids} kg</td>
            <td class="px-4 py-2 whitespace-nowrap">
                ${this.getStatutBadge(produit.statut)}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button class="text-aqua hover:text-aqua-light" onclick="voirProduit('${produit.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-blue-400 hover:text-blue-300" onclick="modifierProduit('${produit.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${produit.statut !== "Livré"
            ? `
                    <button class="text-red-400 hover:text-red-300" onclick="supprimerProduit('${produit.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    `
            : `
                    <button class="text-gray-500" disabled>
                        <i class="fas fa-trash"></i>
                    </button>
                    `}
                </div>
            </td>
        `;
        return tr;
    }
    getTypeIcon(type) {
        const icons = {
            vetements: "fa-tshirt",
            electronique: "fa-laptop",
            alimentaire: "fa-apple-alt",
            documents: "fa-file-alt",
            medicaments: "fa-pills",
            autres: "fa-box",
        };
        return icons[type] || "fa-box";
    }
    getTypeLabel(type) {
        const labels = {
            vetements: "Vêtements",
            electronique: "Électronique",
            alimentaire: "Alimentaire",
            documents: "Documents",
            medicaments: "Médicaments",
            autres: "Autres",
        };
        return labels[type] || "Autres";
    }
    getStatutBadge(statut) {
        const badges = {
            "En attente": "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
            "En cours": "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30",
            Arrivé: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30",
            Livré: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30",
            Perdu: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30",
        };
        const className = badges[statut] || badges["En attente"];
        return `<span class="${className}">${statut}</span>`;
    }
    showErrorMessage(message) {
        if (this.tbody) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-2"></i>
                        <p>${message}</p>
                    </td>
                </tr>
            `;
        }
    }
}
// Fonctions globales pour les actions
window.voirProduit = (id) => {
    alert(`Voir détails du produit: ${id}`);
};
window.modifierProduit = (id) => {
    alert(`Modifier le produit: ${id}`);
};
window.supprimerProduit = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        alert(`Supprimer le produit: ${id}`);
    }
};
// Initialiser quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
    console.log("Initialisation de ProduitsDisplay...");
    new ProduitsDisplay();
});
//# sourceMappingURL=ProduitsDisplay.js.map