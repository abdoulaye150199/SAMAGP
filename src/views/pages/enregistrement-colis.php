<?php
// src/views/pages/enregistrement-colis.php
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>YONIMA - Enregistrement Colis</title>
</head>
<body class="bg-slate-900">
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg">
        <div class="flex flex-col h-full">
            <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400">
                <h1 class="text-xl font-bold text-white">YONI MA</h1>
            </div>

            <!-- Navigation -->
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
                <a href="/creation-cargaison" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-plus mr-3"></i>Nouvelle Cargaison
                </a>
                <a href="/enregistrement-colis" class="flex items-center px-4 py-2 text-emerald-400 bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-package mr-3"></i>Enregistrer Colis
                </a>

                <a href="/suivi-colis" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-search mr-3"></i>Suivi Colis
                </a>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
        <!-- Header -->
        <header class="bg-slate-800 shadow-sm border-b border-emerald-500/30">
            <div class="px-6 py-3">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-bold text-white">Enregistrement de Colis</h2>
                    <a href="/dashboard" class="text-emerald-400 hover:text-emerald-300 transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>Retour au dashboard
                    </a>
                </div>
            </div>
        </header>

        <!-- Content -->
        <main class="p-4">
            <div class="max-w-6xl mx-auto">
                <!-- Zone de notification -->
                <div id="notification-zone"></div>

                <!-- Formulaire avec data-colis-form pour TypeScript -->
                <form class="space-y-4" data-colis-form>
                    <!-- Informations Client & Destinataire en 2 colonnes -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <!-- Informations Client -->
                        <div class="bg-slate-800 rounded-lg shadow-sm p-4 border border-emerald-500/20">
                            <h3 class="text-base font-semibold text-white mb-3">Informations du Client</h3>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Nom</label>
                                    <input type="text" id="client-nom" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Nom du client">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Prénom</label>
                                    <input type="text" id="client-prenom" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Prénom du client">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Téléphone</label>
                                    <input type="tel" id="client-telephone" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="+221 XX XXX XX XX">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Email</label>
                                    <input type="email" id="client-email" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="email@exemple.com">
                                </div>
                                <div class="col-span-2">
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Adresse</label>
                                    <textarea id="client-adresse" rows="2" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Adresse complète du client"></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Informations Destinataire -->
                        <div class="bg-slate-800 rounded-lg shadow-sm p-4 border border-emerald-500/20">
                            <h3 class="text-base font-semibold text-white mb-3">Informations du Destinataire</h3>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Nom</label>
                                    <input type="text" id="dest-nom" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Nom du destinataire">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Prénom</label>
                                    <input type="text" id="dest-prenom" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Prénom du destinataire">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Téléphone</label>
                                    <input type="tel" id="dest-telephone" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="+33 X XX XX XX XX">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Email</label>
                                    <input type="email" id="dest-email" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="email@exemple.com">
                                </div>
                                <div class="col-span-2">
                                    <label class="block text-xs font-medium text-emerald-400 mb-1">Adresse</label>
                                    <textarea id="dest-adresse" rows="2" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Adresse complète du destinataire"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Informations Colis -->
                    <div class="bg-slate-800 rounded-lg shadow-sm p-4 border border-emerald-500/20">
                        <h3 class="text-base font-semibold text-white mb-3">Informations du Colis</h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
                            <div>
                                <label class="block text-xs font-medium text-emerald-400 mb-1">Nb Colis</label>
                                <input type="number" id="nombre-colis" min="1" value="1" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="1">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-emerald-400 mb-1">Poids (kg)</label>
                                <input type="number" step="0.1" id="poids-colis" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="2.5">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-emerald-400 mb-1">Type Produit</label>
                                <select id="type-produit" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                                    <option value="">Sélectionner</option>
                                    <option value="vetements">Vêtements</option>
                                    <option value="electronique">Électronique</option>
                                    <option value="alimentaire">Alimentaire</option>
                                    <option value="documents">Documents</option>
                                    <option value="medicaments">Médicaments</option>
                                    <option value="autres">Autres</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-emerald-400 mb-1">Type Transport</label>
                                <select id="type-cargaison" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                                    <option value="">Sélectionner</option>
                                    <option value="maritime">Maritime</option>
                                    <option value="aerien">Aérien</option>
                                    <option value="routier">Routier</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-emerald-400 mb-1">Valeur (FCFA)</label>
                                <input type="number" id="valeur-declaree" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="50000">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-emerald-400 mb-1">Prix (FCFA)</label>
                                <input type="number" id="prix-calcule" class="w-full px-2 py-1.5 text-sm border border-slate-600 rounded bg-slate-900 text-emerald-400" readonly>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-emerald-400 mb-1">Description du Contenu</label>
                            <textarea id="description-contenu" rows="2" class="w-full px-2 py-1.5 text-sm border border-slate-600 bg-slate-700 text-white rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="Description détaillée du contenu du colis"></textarea>
                        </div>
                    </div>

                    <!-- Boutons d'action -->
                    <div class="flex justify-end space-x-3">
                        <button type="button" data-btn-calculer class="px-4 py-2 text-sm border border-emerald-500 text-emerald-400 rounded hover:bg-emerald-500 hover:text-white transition-colors">
                            <i class="fas fa-calculator mr-1"></i>Calculer Prix
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded hover:from-emerald-600 hover:to-emerald-500 transition-colors">
                            <i class="fas fa-save mr-1"></i>Enregistrer Colis
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>

    <!-- Chargement du script TypeScript compilé avec le bon chemin -->
    <script type="module" src="/dist/ts/components/ColisForm.js"></script>
</body>
</html>