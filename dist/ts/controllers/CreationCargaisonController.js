// src/ts/controllers/CreationCargaisonController.ts
import { viewInitializer } from '../utils/ViewInitializer.js';
import { CargaisonService } from '../services/CargaisonService.js';
export class CreationCargaisonController {
    constructor() {
        this.produits = [];
        this.produitCounter = 0;
        this.cargaisonService = CargaisonService.getInstance();
    }
    static getInstance() {
        if (!CreationCargaisonController.instance) {
            CreationCargaisonController.instance = new CreationCargaisonController();
        }
        return CreationCargaisonController.instance;
    }
    // Initialisation
    async initialize() {
        viewInitializer.initializeCommon();
        this.initializeEventListeners();
        this.updateProduitsDisplay();
        this.setupPriceCalculation();
        this.exposeGlobalFunctions();
    }
    // Événements
    initializeEventListeners() {
        // Formulaire principal
        const mainForm = document.getElementById('form-cargaison');
        if (mainForm) {
            mainForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }
    // Configuration du calcul automatique des prix
    setupPriceCalculation() {
        const poidsInput = document.getElementById('poids-max');
        const prixInput = document.getElementById('prix-par-kg');
        if (poidsInput && prixInput) {
            const calculateTotal = () => {
                const poids = parseFloat(poidsInput.value) || 0;
                const prix = parseFloat(prixInput.value) || 0;
                const total = poids * prix;
                const totalElement = document.getElementById('prix-total');
                if (totalElement) {
                    totalElement.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
                }
                this.updateCapacityIndicator();
            };
            poidsInput.addEventListener('input', calculateTotal);
            prixInput.addEventListener('input', calculateTotal);
        }
        // Gestion du changement de type de transport
        const typeSelect = document.getElementById('type-cargaison');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.handleTypeChange());
        }
    }
    // Gérer le changement de type de transport
    handleTypeChange() {
        const typeSelect = document.getElementById('type-cargaison');
        const type = typeSelect.value;
        // Masquer tous les champs spécifiques
        document.getElementById('numero-vol-div')?.classList.add('hidden');
        document.getElementById('numero-navire-div')?.classList.add('hidden');
        document.getElementById('numero-camion-div')?.classList.add('hidden');
        // Afficher le champ approprié
        if (type === 'Aérien')
            document.getElementById('numero-vol-div')?.classList.remove('hidden');
        if (type === 'Maritime')
            document.getElementById('numero-navire-div')?.classList.remove('hidden');
        if (type === 'Routier')
            document.getElementById('numero-camion-div')?.classList.remove('hidden');
    }
    // Mettre à jour l'indicateur de capacité
    updateCapacityIndicator() {
        const poidsMaxInput = document.getElementById('poids-max');
        const poidsMax = parseFloat(poidsMaxInput.value) || 0;
        const poidsTotalProduits = this.produits.reduce((sum, p) => sum + p.poids, 0);
        const pourcentageElement = document.getElementById('capacite-pourcentage');
        const barreElement = document.getElementById('capacite-barre');
        if (poidsMax > 0 && (pourcentageElement && barreElement)) {
            const pourcentage = (poidsTotalProduits / poidsMax) * 100;
            pourcentageElement.textContent = `${pourcentage.toFixed(1)}%`;
            barreElement.style.width = `${Math.min(pourcentage, 100)}%`;
            // Changer la couleur selon le pourcentage
            if (pourcentage > 100) {
                barreElement.className = 'h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-red-500 to-red-400';
            }
            else if (pourcentage > 80) {
                barreElement.className = 'h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-amber-500 to-amber-400';
            }
            else {
                barreElement.className = 'h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 to-emerald-400';
            }
        }
    }
    // Exposer les fonctions globalement
    exposeGlobalFunctions() {
        window.ajouterProduit = () => this.ajouterProduit();
        window.supprimerProduit = (id) => this.supprimerProduit(id);
    }
    // Ajouter un produit
    ajouterProduit() {
        const modal = this.creerModalProduit();
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        // Focus sur le premier champ
        setTimeout(() => {
            const firstInput = modal.querySelector('input[name="nom-produit"]');
            if (firstInput)
                firstInput.focus();
        }, 100);
    }
    // Créer le modal d'ajout de produit
    creerModalProduit() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-emerald-500/20 shadow-xl">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-semibold text-white">Ajouter un Produit</h4>
                    <button type="button" class="close-modal text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form class="space-y-4" id="productForm">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-emerald-400 mb-1">Nom du produit</label>
                            <input type="text" name="nom-produit" required
                                   class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-emerald-500 transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-emerald-400 mb-1">Type</label>
                            <select name="type-produit" required
                                    class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-emerald-500 transition-all">
                                <option value="">Sélectionner...</option>
                                <option value="electronique">Électronique</option>
                                <option value="vetements">Vêtements</option>
                                <option value="alimentaire">Alimentaire</option>
                                <option value="documents">Documents</option>
                                <option value="medicaments">Médicaments</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-emerald-400 mb-1">Poids (kg)</label>
                            <input type="number" name="poids-produit" step="0.1" min="0" required
                                   class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-emerald-500 transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-emerald-400 mb-1">Valeur déclarée (FCFA)</label>
                            <input type="number" name="valeur-produit" min="0"
                                   class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-emerald-500 transition-all">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-emerald-400 mb-1">Description</label>
                        <textarea name="description-produit" rows="2"
                                  class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-emerald-500 transition-all resize-none"
                                  placeholder="Description du produit..."></textarea>
                    </div>
                    
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" class="close-modal px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-500 transition-all">
                            <i class="fas fa-plus mr-2"></i>Ajouter
                        </button>
                    </div>
                </form>
            </div>
        `;
        // Event listeners pour le modal
        this.setupModalEvents(modal);
        return modal;
    }
    // Configuration des événements du modal
    setupModalEvents(modal) {
        // Boutons de fermeture
        const closeButtons = modal.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.fermerModal(modal));
        });
        // Soumission du formulaire produit
        const productForm = modal.querySelector('#productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.confirmerAjoutProduit(modal, productForm);
            });
        }
        // Fermeture en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.fermerModal(modal);
            }
        });
    }
    // Confirmer l'ajout du produit
    confirmerAjoutProduit(modal, form) {
        const formData = new FormData(form);
        const produit = {
            id: ++this.produitCounter,
            nom: formData.get('nom-produit'),
            type: formData.get('type-produit'),
            poids: parseFloat(formData.get('poids-produit')),
            valeur: parseFloat(formData.get('valeur-produit')) || 0,
            description: formData.get('description-produit') || ''
        };
        this.produits.push(produit);
        this.updateProduitsDisplay();
        this.fermerModal(modal);
        console.log('✅ Produit ajouté:', produit);
    }
    // Fermer le modal
    fermerModal(modal) {
        modal.classList.add('hidden');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    // Supprimer un produit
    supprimerProduit(id) {
        this.produits = this.produits.filter(p => p.id !== id);
        this.updateProduitsDisplay();
        console.log('🗑️ Produit supprimé, ID:', id);
    }
    // Mise à jour de l'affichage des produits
    updateProduitsDisplay() {
        const container = document.getElementById('produits-list');
        if (!container)
            return;
        if (this.produits.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-cube text-slate-500 text-2xl mb-2"></i>
                    <p class="text-slate-400 text-sm">Aucun produit ajouté</p>
                </div>
            `;
            // Masquer le résumé
            const resumeDiv = document.getElementById('resume-produits');
            if (resumeDiv)
                resumeDiv.classList.add('hidden');
        }
        else {
            const produitsHtml = this.produits.map(produit => `
                <div class="bg-slate-800 rounded-lg p-3 border border-slate-600 hover:border-emerald-500/40 transition-all">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-white">${produit.nom}</h4>
                        <button onclick="supprimerProduit(${produit.id})" 
                                class="text-red-400 hover:text-red-300 transition-colors">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    <div class="text-sm text-slate-400 space-y-1">
                        <div><span class="text-emerald-400">Type:</span> ${produit.type}</div>
                        <div><span class="text-emerald-400">Poids:</span> ${produit.poids}kg</div>
                        ${produit.valeur > 0 ? `<div><span class="text-emerald-400">Valeur:</span> ${produit.valeur.toLocaleString()} FCFA</div>` : ''}
                        ${produit.description ? `<div><span class="text-emerald-400">Description:</span> ${produit.description}</div>` : ''}
                    </div>
                </div>
            `).join('');
            container.innerHTML = produitsHtml;
            // Afficher et mettre à jour le résumé
            this.updateResumeDisplay();
        }
        this.updateCapacityIndicator();
    }
    // Mettre à jour le résumé des produits
    updateResumeDisplay() {
        const resumeDiv = document.getElementById('resume-produits');
        if (!resumeDiv)
            return;
        const totalProduits = this.produits.length;
        const totalPoids = this.produits.reduce((sum, p) => sum + p.poids, 0);
        const totalValeur = this.produits.reduce((sum, p) => sum + p.valeur, 0);
        document.getElementById('total-produits').textContent = totalProduits.toString();
        document.getElementById('poids-total-produits').textContent = `${totalPoids.toFixed(1)} kg`;
        document.getElementById('valeur-total-produits').textContent = `${totalValeur.toLocaleString('fr-FR')} FCFA`;
        resumeDiv.classList.remove('hidden');
    }
    // Calcul du poids total
    updatePoidsTotal() {
        const totalPoids = this.produits.reduce((sum, p) => sum + p.poids, 0);
        const poidsElement = document.getElementById('poidsTotal');
        if (poidsElement) {
            poidsElement.textContent = totalPoids.toFixed(1);
        }
    }
    // Gestion de la soumission du formulaire principal
    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        // Validation des champs obligatoires
        const validation = this.validateForm(formData);
        if (!validation.isValid) {
            this.showMessage('error', validation.errors[0]);
            return;
        }
        // Afficher le loading
        const submitBtn = document.getElementById('btn-submit');
        const spinner = document.getElementById('loading-spinner');
        if (submitBtn && spinner) {
            submitBtn.disabled = true;
            spinner.classList.remove('hidden');
        }
        try {
            // Préparer les données
            const cargaisonData = {
                type: formData.get('type'),
                transporteur: formData.get('transporteur'),
                origine: formData.get('origine'),
                destination: formData.get('destination'),
                numeroVol: formData.get('numeroVol') || '',
                numeroNavire: formData.get('numeroNavire') || '',
                numeroCamion: formData.get('numeroCamion') || '',
                poidsMax: parseFloat(formData.get('poidsMax')),
                prixParKg: parseFloat(formData.get('prixParKg')),
                description: formData.get('description') || '',
                dateDepart: formData.get('dateDepart') || '',
                dureeEstimee: formData.get('dureeEstimee') || '',
                conditions: formData.get('conditions') || '',
                produits: this.produits,
                statut: 'En attente',
                fermee: false
            };
            // Créer la cargaison via API directe pour debug
            const response = await fetch('/api/cargaisons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cargaisonData)
            });
            if (response.ok) {
                const result = await response.json();
                this.showMessage('success', 'Cargaison créée avec succès !');
                console.log('✅ Cargaison créée:', result);
                setTimeout(() => {
                    window.location.href = '/cargaisons';
                }, 1500);
            }
            else {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || `Erreur HTTP ${response.status}`;
                this.showMessage('error', errorMessage);
                console.error('❌ Erreur création:', response.status, errorData);
            }
        }
        catch (error) {
            this.showMessage('error', 'Erreur de connexion au serveur');
            console.error('Erreur création cargaison:', error);
        }
        finally {
            if (submitBtn && spinner) {
                submitBtn.disabled = false;
                spinner.classList.add('hidden');
            }
        }
    }
    // Validation du formulaire
    validateForm(formData) {
        const errors = [];
        // Champs obligatoires
        const requiredFields = [
            { name: 'type', label: 'Type de cargaison' },
            { name: 'origine', label: 'Ville d\'origine' },
            { name: 'destination', label: 'Ville de destination' },
            { name: 'transporteur', label: 'Transporteur' },
            { name: 'poidsMax', label: 'Poids maximum' },
            { name: 'prixParKg', label: 'Prix par kg' }
        ];
        for (const field of requiredFields) {
            const value = formData.get(field.name);
            if (!value || value.trim() === '') {
                errors.push(`Le champ "${field.label}" est obligatoire`);
                // Focus sur le champ manquant
                const fieldElement = document.querySelector(`[name="${field.name}"]`);
                if (fieldElement)
                    fieldElement.focus();
                break;
            }
        }
        // Validation numérique
        const poidsMax = parseFloat(formData.get('poidsMax'));
        const prixParKg = parseFloat(formData.get('prixParKg'));
        if (isNaN(poidsMax) || poidsMax <= 0) {
            errors.push('Le poids maximum doit être supérieur à 0');
        }
        if (isNaN(prixParKg) || prixParKg <= 0) {
            errors.push('Le prix par kg doit être supérieur à 0');
        }
        // Validation des produits vs capacité
        const poidsTotalProduits = this.produits.reduce((sum, p) => sum + p.poids, 0);
        if (poidsTotalProduits > poidsMax && poidsMax > 0) {
            errors.push(`Le poids total des produits (${poidsTotalProduits.toFixed(1)}kg) dépasse la capacité (${poidsMax}kg)`);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Afficher un message
    showMessage(type, message) {
        const container = document.getElementById('message-container');
        if (!container)
            return;
        const bgColor = type === 'success'
            ? 'bg-green-500/20 text-green-400 border-green-500/30'
            : 'bg-red-500/20 text-red-400 border-red-500/30';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        container.innerHTML = `
            <div class="${bgColor} border rounded-lg p-4 mb-4">
                <div class="flex items-center">
                    <i class="fas ${icon} mr-2"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;
        setTimeout(() => {
            if (container)
                container.innerHTML = '';
        }, 5000);
    }
    // Méthodes utilitaires
    getProduits() {
        return this.produits;
    }
    clearProduits() {
        this.produits = [];
        this.updateProduitsDisplay();
    }
}
// Export pour l'usage global
export const creationController = CreationCargaisonController.getInstance();
//# sourceMappingURL=CreationCargaisonController.js.map