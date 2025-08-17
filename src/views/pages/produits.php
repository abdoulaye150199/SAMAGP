<?php
// src/views/pages/produits.php
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>SENGP - Produits</title>
</head>

<body class="bg-slate-900 h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg border-r border-emerald-500/20">
        <div class="flex flex-col h-full">
            <!-- Logo -->
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
                <a href="/produits" class="flex items-center px-4 py-2 text-emerald-400 bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-box mr-3"></i>Produits
                </a>
                <a href="/creation-cargaison"
                    class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-plus mr-3"></i>Nouvelle Cargaison
                </a>
                <a href="/enregistrement-colis"
                    class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-package mr-3"></i>Enregistrer Colis
                </a>

                <a href="/suivi-colis" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-search mr-3"></i>Suivi Colis
                </a>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64 h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-slate-800 shadow-sm border-b border-emerald-500/30 flex-shrink-0">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-white">Gestion des Produits</h2>
                    <a href="/enregistrement-colis"
                        class="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-500 transition-all font-semibold shadow-lg">
                        <i class="fas fa-plus mr-2"></i>Nouveau Produit
                    </a>
                </div>
            </div>
        </header>

        <!-- Content -->
        <main class="flex-1 overflow-y-auto p-4">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-4 hover:border-emerald-500/40 transition-all">
                    <div class="flex items-center">
                        <div class="p-3 bg-emerald-500/20 rounded-lg">
                            <i class="fas fa-box text-emerald-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">Total Produits</p>
                            <p class="text-2xl font-bold text-white" data-stat="total">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-4 hover:border-emerald-500/40 transition-all">
                    <div class="flex items-center">
                        <div class="p-3 bg-green-500/20 rounded-lg">
                            <i class="fas fa-check-circle text-green-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">Livrés</p>
                            <p class="text-2xl font-bold text-white" data-stat="livres">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-4 hover:border-emerald-500/40 transition-all">
                    <div class="flex items-center">
                        <div class="p-3 bg-amber-500/20 rounded-lg">
                            <i class="fas fa-clock text-amber-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">En Transit</p>
                            <p class="text-2xl font-bold text-white" data-stat="en-transit">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-4 hover:border-emerald-500/40 transition-all">
                    <div class="flex items-center">
                        <div class="p-3 bg-red-500/20 rounded-lg">
                            <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">Problèmes</p>
                            <p class="text-2xl font-bold text-white" data-stat="problemes">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-6 mb-6">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
                    <i class="fas fa-filter text-emerald-400 mr-2"></i>
                    Filtres de Recherche
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Type de Produit</label>
                        <select
                            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                            <option value="">Tous les types</option>
                            <option value="vetements">Vêtements</option>
                            <option value="electronique">Électronique</option>
                            <option value="alimentaire">Alimentaire</option>
                            <option value="documents">Documents</option>
                            <option value="medicaments">Médicaments</option>
                            <option value="autres">Autres</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">État</label>
                        <select
                            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                            <option value="">Tous les états</option>
                            <option value="en-attente">En attente</option>
                            <option value="en-cours">En cours</option>
                            <option value="arrive">Arrivé</option>
                            <option value="livre">Livré</option>
                            <option value="perdu">Perdu</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Cargaison</label>
                        <select
                            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                            <option value="">Toutes les cargaisons</option>
                            <option value="maritime">Maritime</option>
                            <option value="aerien">Aérien</option>
                            <option value="routier">Routier</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-2">Date</label>
                        <input type="text"
                            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder="JJ/MM/AAAA">
                    </div>
                    <div class="flex items-end">
                        <button
                            class="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-500 transition-all font-semibold shadow-lg">
                            <i class="fas fa-search mr-2"></i>Filtrer
                        </button>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="mt-4 flex flex-wrap gap-2">
                    <button class="px-3 py-1 bg-slate-700 text-slate-300 rounded-md text-sm hover:bg-slate-600 transition-all">
                        <i class="fas fa-eye mr-1"></i>Tout afficher
                    </button>
                    <button class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-sm hover:bg-emerald-500/30 transition-all">
                        <i class="fas fa-check mr-1"></i>Livrés uniquement
                    </button>
                    <button class="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-md text-sm hover:bg-amber-500/30 transition-all">
                        <i class="fas fa-clock mr-1"></i>En transit
                    </button>
                    <button class="px-3 py-1 bg-red-500/20 text-red-400 rounded-md text-sm hover:bg-red-500/30 transition-all">
                        <i class="fas fa-exclamation mr-1"></i>Problèmes
                    </button>
                </div>
            </div>

            <!-- Products List -->
            <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20">
                <div class="p-6 border-b border-emerald-500/20">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-white flex items-center">
                            <i class="fas fa-boxes text-emerald-400 mr-2"></i>
                            Liste des Produits
                        </h3>
                        <div class="flex items-center space-x-3">
                            <button class="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-all">
                                <i class="fas fa-download mr-1"></i>Exporter
                            </button>
                            <div class="relative">
                                <input type="text" placeholder="Rechercher un produit..." 
                                    class="w-64 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                                <i class="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-900">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    <div class="flex items-center space-x-1">
                                        <span>Code Produit</span>
                                        <i class="fas fa-sort text-slate-500"></i>
                                    </div>
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    <div class="flex items-center space-x-1">
                                        <span>Type</span>
                                        <i class="fas fa-sort text-slate-500"></i>
                                    </div>
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    <div class="flex items-center space-x-1">
                                        <span>Expéditeur</span>
                                        <i class="fas fa-sort text-slate-500"></i>
                                    </div>
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    <div class="flex items-center space-x-1">
                                        <span>Destinataire</span>
                                        <i class="fas fa-sort text-slate-500"></i>
                                    </div>
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    <div class="flex items-center space-x-1">
                                        <span>Poids</span>
                                        <i class="fas fa-sort text-slate-500"></i>
                                    </div>
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    <div class="flex items-center space-x-1">
                                        <span>État</span>
                                        <i class="fas fa-sort text-slate-500"></i>
                                    </div>
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-slate-800 divide-y divide-slate-700" id="products-tbody">
                            <!-- Example rows for demonstration -->
                            <tr class="hover:bg-slate-700/50 transition-all">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                                        <span class="text-sm font-medium text-white">PRD-001</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-400 rounded-full">
                                        Électronique
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    Jean Dupont
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    Marie Martin
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    2.5 kg
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full">
                                        Livré
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <button class="text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="text-blue-400 hover:text-blue-300 transition-colors">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="text-red-400 hover:text-red-300 transition-colors">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <tr class="hover:bg-slate-700/50 transition-all">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                        <span class="text-sm font-medium text-white">PRD-002</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold bg-purple-500/20 text-purple-400 rounded-full">
                                        Vêtements
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    Sophie Laurent
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    Ahmed Hassan
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    1.2 kg
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold bg-amber-500/20 text-amber-400 rounded-full">
                                        En Transit
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <button class="text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="text-blue-400 hover:text-blue-300 transition-colors">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="text-red-400 hover:text-red-300 transition-colors">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            
                            <tr class="hover:bg-slate-700/50 transition-all">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                                        <span class="text-sm font-medium text-white">PRD-003</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 rounded-full">
                                        Alimentaire
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    Pierre Dubois
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    Fatou Diallo
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                    5.0 kg
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
                                        Problème
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <button class="text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="text-blue-400 hover:text-blue-300 transition-colors">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="text-red-400 hover:text-red-300 transition-colors">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="p-6 border-t border-slate-700">
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-slate-400">
                            Affichage de 1 à 3 sur 3 produits
                        </div>
                        <div class="flex space-x-2">
                            <button class="px-3 py-2 bg-slate-700 text-slate-400 rounded-lg text-sm hover:bg-slate-600 transition-all disabled:opacity-50" disabled>
                                <i class="fas fa-chevron-left mr-1"></i>Précédent
                            </button>
                            <button class="px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">
                                1
                            </button>
                            <button class="px-3 py-2 bg-slate-700 text-slate-400 rounded-lg text-sm hover:bg-slate-600 transition-all disabled:opacity-50" disabled>
                                Suivant<i class="fas fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Chargement du script TypeScript compilé -->
    <script type="module" src="/dist/ts/components/ProduitsDisplay.js"></script>
</body>

</html>
