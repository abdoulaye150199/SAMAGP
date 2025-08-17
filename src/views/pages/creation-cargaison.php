<?php
// src/views/pages/creation-cargaison.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = $_SESSION['user'] ?? null;

if (!$user) {
    header('Location: /login');
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YONIMA - Nouvelle Cargaison</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-slate-900">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg border-r border-emerald-500/20">
        <div class="flex flex-col h-full">
            <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400">
                <h1 class="text-xl font-bold text-white">YONI MA</h1>
            </div>

            <nav class="flex-1 px-4 py-6 space-y-2">
                <a href="/dashboard" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-tachometer-alt mr-3"></i>Dashboard
                </a>
                <a href="/cargaisons" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-ship mr-3"></i>Cargaisons
                </a>
                <a href="/produits" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-box mr-3"></i>Produits
                </a>
                <a href="/creation-cargaison" class="flex items-center px-4 py-2 text-emerald-400 bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-plus mr-3"></i>Nouvelle Cargaison
                </a>
                <a href="/enregistrement-colis" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-package mr-3"></i>Enregistrer Colis
                </a>
                <a href="/suivi-colis" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-search mr-3"></i>Suivi Colis
                </a>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64 h-screen overflow-hidden">
        <header class="bg-slate-800 shadow-sm border-b border-emerald-400/30">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-plus-circle text-emerald-400 text-2xl mr-3"></i>
                        <h2 class="text-2xl font-bold text-white">Créer une Nouvelle Cargaison</h2>
                    </div>
                    <a href="/cargaisons" class="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center">
                        <i class="fas fa-arrow-left mr-2"></i>Retour aux cargaisons
                    </a>
                </div>
            </div>
        </header>

        <main class="h-[calc(100vh-80px)] overflow-y-auto p-4">
            <div class="max-w-4xl mx-auto space-y-4">
                <!-- Zone de notification -->
                <div id="message-container"></div>

                <!-- Formulaire principal -->
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-400/20 p-4">
                    <form id="form-cargaison" class="space-y-6">
                        <!-- Section 1: Informations de base -->
                        <div class="space-y-4">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-info-circle text-emerald-400 mr-2"></i>
                                <h3 class="text-base font-semibold text-white">Informations de Base</h3>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Type de Cargaison *</label>
                                    <select name="type" id="type-cargaison" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all">
                                        <option value="">Sélectionner un type</option>
                                        <option value="Maritime">🚢 Maritime</option>
                                        <option value="Aérien">✈️ Aérien</option>
                                        <option value="Routier">🚛 Routier</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Transporteur *</label>
                                    <input type="text" name="transporteur" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="Nom de la compagnie">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Ville d'Origine *</label>
                                    <input type="text" name="origine" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="Ex: Dakar, Senegal">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Ville de Destination *</label>
                                    <input type="text" name="destination" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="Ex: Paris, France">
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Détails du transport -->
                        <div class="border-t border-slate-600 pt-4">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-route text-emerald-400 mr-2"></i>
                                <h3 class="text-base font-semibold text-white">Détails du Transport</h3>
                            </div>

                            <!-- Champs spécifiques au type de transport -->
                            <div id="numero-vol-div" class="hidden mb-6">
                                <label class="block text-sm font-medium text-emerald-400 mb-2">Numéro de Vol</label>
                                <input type="text" name="numeroVol" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="Ex: AF123, BA456">
                            </div>

                            <div id="numero-navire-div" class="hidden mb-6">
                                <label class="block text-sm font-medium text-emerald-400 mb-2">Numéro de Navire</label>
                                <input type="text" name="numeroNavire" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="Ex: MSC-OSCAR, EVER-GIVEN">
                            </div>

                            <div id="numero-camion-div" class="hidden mb-6">
                                <label class="block text-sm font-medium text-emerald-400 mb-2">Numéro de Camion</label>
                                <input type="text" name="numeroCamion" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="Ex: TRK-001, CAM-456">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Date de Départ Prévue</label>
                                    <input type="text" name="dateDepart" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="JJ/MM/AAAA">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Durée Estimée (jours)</label>
                                    <input type="number" name="dureeEstimee" min="1" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="Ex: 15">
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: Tarification -->
                        <div class="border-t border-slate-600 pt-4">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-money-bill-wave text-emerald-400 mr-2"></i>
                                <h3 class="text-base font-semibold text-white">Tarification</h3>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Poids Maximum (kg) *</label>
                                    <input type="number" name="poidsMax" id="poids-max" step="0.1" min="0" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="1000">
                                    <p class="text-xs text-slate-400 mt-1">Capacité maximale de la cargaison</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Prix par Kg (FCFA) *</label>
                                    <input type="number" name="prixParKg" id="prix-par-kg" step="0.01" min="0" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all" placeholder="2500">
                                    <p class="text-xs text-slate-400 mt-1">Tarif par kilogramme</p>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-emerald-400 mb-2">Prix Total Estimé</label>
                                    <div class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg">
                                        <span id="prix-total" class="font-bold text-emerald-400 text-lg">0 FCFA</span>
                                    </div>
                                    <p class="text-xs text-slate-400 mt-1">Calculé automatiquement</p>
                                </div>
                            </div>
                        </div>

                        <!-- Section 4: Gestion des Produits -->
                        <div class="border-t border-slate-600 pt-4">
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center">
                                    <i class="fas fa-boxes text-emerald-400 mr-2"></i>
                                    <h3 class="text-base font-semibold text-white">Produits dans cette Cargaison</h3>
                                </div>
                                <button type="button" onclick="ajouterProduit()" class="bg-gradient-to-r from-emerald-400 to-emerald-400 text-white px-4 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-400 transition-all shadow-lg text-sm">
                                    <i class="fas fa-plus mr-2"></i>Ajouter un Produit
                                </button>
                            </div>
                            
                            <div class="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                                <div id="produits-list" class="space-y-2">
                                    <div class="text-center py-4">
                                        <i class="fas fa-cube text-slate-500 text-2xl mb-2"></i>
                                        <p class="text-slate-400 text-sm">Aucun produit ajouté</p>
                                    </div>
                                </div>
                                
                                <!-- Résumé des produits (affiché quand il y a des produits) -->
                                <div id="resume-produits" class="hidden mt-4 p-4 bg-slate-800 rounded-lg border border-aqua/20">
                                    <div class="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p class="text-xs text-slate-400 uppercase tracking-wide">Total Produits</p>
                                            <p class="text-xl font-bold text-aqua" id="total-produits">0</p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-400 uppercase tracking-wide">Poids Total</p>
                                            <p class="text-xl font-bold text-aqua" id="poids-total-produits">0 kg</p>
                                        </div>
                                        <div>
                                            <p class="text-xs text-slate-400 uppercase tracking-wide">Valeur Totale</p>
                                            <p class="text-xl font-bold text-aqua" id="valeur-total-produits">0 FCFA</p>
                                        </div>
                                    </div>
                                    
                                    <!-- Indicateur de capacité -->
                                    <div class="mt-4">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-sm text-slate-400">Utilisation de la capacité</span>
                                            <span id="capacite-pourcentage" class="text-sm font-medium text-aqua">0%</span>
                                        </div>
                                        <div class="w-full bg-slate-600 rounded-full h-2">
                                            <div id="capacite-barre" class="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-aqua to-aqua" style="width: 0%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 5: Informations supplémentaires -->
                        <div class="border-t border-slate-600 pt-4">
                            <div class="flex items-center mb-3">
                                <i class="fas fa-clipboard-list text-aqua mr-2"></i>
                                <h3 class="text-base font-semibold text-white">Informations Supplémentaires</h3>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-aqua mb-2">Description de la Cargaison</label>
                                    <textarea name="description" rows="3" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-aqua focus:border-aqua transition-all resize-none" placeholder="Décrivez la nature de cette cargaison, les conditions spéciales, etc."></textarea>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-aqua mb-2">Conditions Spéciales</label>
                                    <select name="conditions" class="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-aqua focus:border-aqua transition-all">
                                        <option value="">Aucune condition spéciale</option>
                                        <option value="fragile">Fragile</option>
                                        <option value="refrigere">Réfrigéré</option>
                                        <option value="dangereux">Matières dangereuses</option>
                                        <option value="precieux">Objets précieux</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Boutons d'action -->
                        <div class="border-t border-slate-600 pt-4">
                            <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                <button type="button" onclick="window.location.href='/cargaisons'" class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all text-sm">
                                    <i class="fas fa-times mr-2"></i>Annuler
                                </button>
                                <button type="button" id="btn-brouillon" class="px-4 py-2 border border-aqua/50 text-aqua rounded-lg hover:bg-aqua/10 transition-all text-sm">
                                    <i class="fas fa-save mr-2"></i>Brouillon
                                </button>
                                <button type="submit" id="btn-submit" class="px-6 py-2 bg-gradient-to-r from-aqua to-aqua text-white rounded-lg hover:from-aqua-dark hover:to-aqua transition-all shadow-lg font-semibold text-sm">
                                    <span id="loading-spinner" class="hidden inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    <i class="fas fa-rocket mr-2"></i>Créer la Cargaison
                                </button>
                            </div>
                        </div>
                    </form>
                </div>


            </div>
        </main>
    </div>

    <!-- Load Application -->
    <script type="module" src="/dist/ts/app.js"></script>
</body>
</html>
