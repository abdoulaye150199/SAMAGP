// src/ts/components/DashboardSuggestions.ts
export class DashboardSuggestions {
    constructor() {
        this.allCargaisons = [];
        this.suggestionsList = document.getElementById('suggestionsList');
        this.suggestionsContainer = document.getElementById('cargaisonSuggestions');
    }
    loadSuggestions(cargaisons) {
        this.allCargaisons = cargaisons;
        if (!this.suggestionsList || !this.suggestionsContainer)
            return;
        if (cargaisons.length === 0) {
            this.hideSuggestions();
            return;
        }
        this.showSuggestions();
        // Afficher toutes les suggestions sans pagination
        this.displayAllSuggestions();
    }
    displayAllSuggestions() {
        if (!this.suggestionsList)
            return;
        this.suggestionsList.innerHTML = '';
        this.allCargaisons.forEach(cargaison => {
            const suggestion = document.createElement('button');
            suggestion.className = 'px-3 py-2 bg-dark border border-gray-600 text-gray-300 text-sm rounded-lg hover:border-aqua hover:text-aqua transition-all flex items-center space-x-2';
            suggestion.innerHTML = `
        <i class="fas fa-ship text-aqua"></i>
        <div class="text-left">
          <div class="font-semibold">${cargaison.id}</div>
          <div class="text-xs text-gray-400">${cargaison.origine} → ${cargaison.destination}</div>
        </div>
      `;
            suggestion.onclick = () => this.selectCargaison(cargaison.id);
            suggestion.ondblclick = () => this.goToCargaisonDetails(cargaison.id);
            suggestion.title = 'Clic simple pour sélectionner, double-clic pour voir les détails';
            if (this.suggestionsList) {
                this.suggestionsList.appendChild(suggestion);
            }
        });
    }
    showSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.classList.remove('hidden');
        }
    }
    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.classList.add('hidden');
        }
    }
    selectCargaison(cargaisonId) {
        const searchInput = document.getElementById('cargaisonSearch');
        if (searchInput) {
            searchInput.value = cargaisonId;
        }
        this.hideSuggestions();
    }
    goToCargaisonDetails(cargaisonId) {
        // Rediriger vers la page de détails avec l'ID
        window.location.href = `/details-cargaison?id=${cargaisonId}`;
    }
    refresh() {
        // Rafraîchir l'affichage sans pagination
        this.displayAllSuggestions();
    }
}
// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    // Exporter l'instance pour utilisation dans le HTML
    window.dashboardSuggestions = new DashboardSuggestions();
});
//# sourceMappingURL=DashboardSuggestions.js.map