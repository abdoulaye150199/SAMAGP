// src/ts/utils/Pagination.ts
export class PaginationUtil {
    constructor(config) {
        this.currentPage = 1;
        this.totalItems = 0;
        this.containerId = config.containerId;
        this.itemsPerPage = config.itemsPerPage || 5;
        this.onPageChange = config.onPageChange;
        this.cssClasses = {
            container: config.cssClasses?.container || 'mt-6 flex items-center justify-between px-6 py-3 bg-dark-light border border-aqua/20 rounded-b-lg',
            button: config.cssClasses?.button || 'px-3 py-1 text-sm bg-dark border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            activeButton: config.cssClasses?.activeButton || 'bg-aqua text-dark font-semibold',
            disabledButton: config.cssClasses?.disabledButton || 'opacity-50 cursor-not-allowed'
        };
    }
    setup(totalItems, targetElement) {
        this.totalItems = totalItems;
        if (totalItems <= this.itemsPerPage) {
            this.hide();
            // Afficher tous les éléments
            this.onPageChange(1, 0, totalItems);
            return;
        }
        this.show(targetElement);
        this.displayPage(1);
    }
    show(targetElement) {
        let container = document.getElementById(this.containerId);
        if (!container) {
            container = this.createPaginationContainer();
            targetElement.insertAdjacentElement('afterend', container);
        }
        container.classList.remove('hidden');
        this.updateControls();
    }
    hide() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.classList.add('hidden');
        }
    }
    createPaginationContainer() {
        const container = document.createElement('div');
        container.id = this.containerId;
        container.className = this.cssClasses.container;
        container.innerHTML = `
      <div class="text-sm text-gray-400">
        Affichage de <span id="${this.containerId}-start">1</span> à 
        <span id="${this.containerId}-end">5</span> sur 
        <span id="${this.containerId}-total">0</span> éléments
      </div>
      <div class="flex items-center space-x-2">
        <button id="${this.containerId}-prev" class="${this.cssClasses.button}">
          Précédent
        </button>
        <div id="${this.containerId}-numbers" class="flex space-x-1"></div>
        <button id="${this.containerId}-next" class="${this.cssClasses.button}">
          Suivant
        </button>
      </div>
    `;
        // Ajouter les event listeners
        const prevBtn = container.querySelector(`#${this.containerId}-prev`);
        const nextBtn = container.querySelector(`#${this.containerId}-next`);
        prevBtn?.addEventListener('click', () => this.changePage(this.currentPage - 1));
        nextBtn?.addEventListener('click', () => this.changePage(this.currentPage + 1));
        return container;
    }
    displayPage(page) {
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
        this.currentPage = page;
        this.onPageChange(page, startIndex, endIndex);
        this.updateControls();
    }
    updateControls() {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        // Mettre à jour le texte d'information
        const startEl = document.getElementById(`${this.containerId}-start`);
        const endEl = document.getElementById(`${this.containerId}-end`);
        const totalEl = document.getElementById(`${this.containerId}-total`);
        if (startEl)
            startEl.textContent = startItem.toString();
        if (endEl)
            endEl.textContent = endItem.toString();
        if (totalEl)
            totalEl.textContent = this.totalItems.toString();
        // Mettre à jour les boutons
        const prevBtn = document.getElementById(`${this.containerId}-prev`);
        const nextBtn = document.getElementById(`${this.containerId}-next`);
        if (prevBtn)
            prevBtn.disabled = this.currentPage === 1;
        if (nextBtn)
            nextBtn.disabled = this.currentPage === totalPages;
        // Mettre à jour les numéros de page
        this.updatePageNumbers(totalPages);
    }
    updatePageNumbers(totalPages) {
        const numbersContainer = document.getElementById(`${this.containerId}-numbers`);
        if (!numbersContainer)
            return;
        numbersContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `px-3 py-1 text-sm rounded transition-colors ${i === this.currentPage
                    ? this.cssClasses.activeButton
                    : this.cssClasses.button}`;
                pageBtn.textContent = i.toString();
                pageBtn.onclick = () => this.changePage(i);
                numbersContainer.appendChild(pageBtn);
            }
            else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'px-2 text-gray-400';
                numbersContainer.appendChild(dots);
            }
        }
    }
    changePage(page) {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (page < 1 || page > totalPages)
            return;
        this.displayPage(page);
    }
    // Méthodes publiques pour contrôle externe
    getCurrentPage() {
        return this.currentPage;
    }
    getTotalPages() {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }
    refresh(totalItems) {
        this.totalItems = totalItems;
        if (totalItems <= this.itemsPerPage) {
            this.hide();
            this.onPageChange(1, 0, totalItems);
        }
        else {
            this.updateControls();
            // Rester sur la page actuelle si possible, sinon aller à la dernière page
            const totalPages = this.getTotalPages();
            if (this.currentPage > totalPages) {
                this.displayPage(totalPages);
            }
            else {
                this.displayPage(this.currentPage);
            }
        }
    }
}
//# sourceMappingURL=Pagination.js.map