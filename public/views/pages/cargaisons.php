<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>YONIMA - Cargaisons</title>
</head>
<body class="bg-slate-900">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg">
        <div class="flex flex-col h-full">
            <!-- Logo -->
            <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400">
                <h1 class="text-xl font-bold text-white">YONI MA</h1>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 space-y-2">
                <a href="/dashboard" class="flex items-center px-4 py-2 text-white hover:bg-slate-700 rounded-lg">
                    <i class="fas fa-tachometer-alt mr-3"></i>Dashboard
                </a>
                <a href="/cargaisons" class="flex items-center px-4 py-2 text-emerald-400 bg-emerald-400/10 rounded-lg">
                    <i class="fas fa-ship mr-3"></i>Cargaisons
                </a>
                <a href="/produits" class="flex items-center px-4 py-2 text-white hover:bg-slate-700 rounded-lg">
                    <i class="fas fa-box mr-3"></i>Produits
                </a>
                <a href="/creation-cargaison" class="flex items-center px-4 py-2 text-white hover:bg-slate-700 rounded-lg">
                    <i class="fas fa-plus mr-3"></i>Nouvelle Cargaison
                </a>
                <a href="/enregistrement-colis" class="flex items-center px-4 py-2 text-white hover:bg-slate-700 rounded-lg">
                    <i class="fas fa-package mr-3"></i>Enregistrer Colis
                </a>

                <a href="/suivi-colis" class="flex items-center px-4 py-2 text-white hover:bg-slate-700 rounded-lg">
                    <i class="fas fa-search mr-3"></i>Suivi Colis
                </a>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
        <!-- Header -->
        <header class="bg-slate-800 shadow-sm border-b border-emerald-500/20">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-white">Gestion des Cargaisons</h2>
                    <a href="/creation-cargaison" class="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-400 transition-colors">
                        <i class="fas fa-plus mr-2"></i>Nouvelle Cargaison
                    </a>
                </div>
            </div>
        </header>

        <!-- Content -->
        <main class="p-6">
            <!-- Filters -->
            <div class="bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
                <h3 class="text-lg font-semibold text-white mb-4">Filtres de recherche</h3>
                <form id="filtersForm" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">Code Cargaison</label>
                        <input type="text" id="filterCode" class="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent" placeholder="CARG-001">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">Type</label>
                        <select id="filterType" class="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent">
                            <option value="">Tous les types</option>
                            <option value="Maritime">Maritime</option>
                            <option value="Aérien">Aérien</option>
                            <option value="Routier">Routier</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">Statut</label>
                        <select id="filterStatut" class="w-full px-3 py-2 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent">
                            <option value="">Tous les statuts</option>
                            <option value="En attente">En attente</option>
                            <option value="En cours">En cours</option>
                            <option value="Arrivé">Arrivé</option>
                            <option value="Récupéré">Récupéré</option>
                            <option value="Perdu">Perdu</option>
                            <option value="Archivé">Archivé</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button type="submit" id="searchBtn" class="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-400 transition-colors">
                            <i class="fas fa-search mr-2"></i>Rechercher
                        </button>
                    </div>
                </form>
            </div>

            <!-- Message de chargement -->
            <div id="loading" class="bg-slate-800 rounded-xl shadow-sm p-6 mb-6 text-center">
                <i class="fas fa-spinner fa-spin text-emerald-400 text-2xl mb-2"></i>
                <p class="text-white">Chargement des cargaisons...</p>
            </div>

            <!-- Message d'erreur -->
            <div id="error" class="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6 hidden">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle text-red-400 mr-2"></i>
                    <p class="text-red-400">Erreur lors du chargement des cargaisons.</p>
                </div>
            </div>

            <!-- Cargaisons List -->
            <div id="cargaisonsContainer" class="bg-slate-800 rounded-xl shadow-sm hidden">
                <div class="p-6 border-b border-emerald-500/20">
                    <h3 class="text-lg font-semibold text-white">Liste des Cargaisons</h3>
                    <p class="text-sm text-emerald-300 mt-1">Total: <span id="totalCount">0</span> cargaison(s)</p>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-700">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Code</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Type</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Trajet</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Poids Max</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Prix/Kg</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Statut</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="cargaisonsTableBody" class="bg-slate-800 divide-y divide-emerald-400/10">
                            <!-- Les données seront injectées ici par JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Message vide -->
            <div id="emptyState" class="bg-slate-800 rounded-xl shadow-sm p-12 text-center hidden">
                <i class="fas fa-ship text-emerald-400/30 text-6xl mb-4"></i>
                <h3 class="text-lg font-medium text-white mb-2">Aucune cargaison trouvée</h3>
                <p class="text-emerald-300 mb-4">Il n'y a pas encore de cargaisons ou aucune ne correspond aux critères de recherche.</p>
                <a href="/creation-cargaison" class="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-400 transition-colors">
                    <i class="fas fa-plus mr-2"></i>Créer une cargaison
                </a>
            </div>
        </main>
    </div>

    <!-- Modale de changement de statut -->
    <div id="statusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden z-50">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="bg-slate-800 rounded-lg max-w-md w-full border border-emerald-500/20">
                <div class="p-6 border-b border-emerald-500/20">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-white">Modifier le statut</h3>
                        <button id="closeStatusModalBtn" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <form id="statusForm" class="p-6">
                    <input type="hidden" id="cargaisonId" name="cargaisonId">
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-white mb-2">
                            Cargaison: <span id="cargaisonCode" class="text-emerald-400"></span>
                        </label>
                    </div>
                    
                    <div class="mb-4">
                        <label for="newStatus" class="block text-sm font-medium text-white mb-2">
                            Nouveau statut
                        </label>
                        <select id="newStatus" name="newStatus" class="w-full px-3 py-2 bg-slate-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-emerald-400">
                            <option value="En attente">En attente</option>
                            <option value="En cours">En cours</option>
                            <option value="Arrivé">Arrivé</option>
                            <option value="Récupéré">Récupéré</option>
                            <option value="Perdu">Perdu</option>
                            <option value="Archivé">Archivé</option>
                        </select>
                    </div>
                    
                    <!-- Options pour "En cours" -->
                    <div id="enCoursOptions" class="mb-4 hidden">
                        <label class="block text-sm font-medium text-white mb-2">
                            Options "En cours"
                        </label>
                        <select id="enCoursType" name="enCoursType" class="w-full px-3 py-2 bg-slate-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-emerald-400 mb-2">
                            <option value="normal">Progression normale</option>
                            <option value="arrive">Arrive dans...</option>
                            <option value="retard">En retard de...</option>
                        </select>
                        
                        <div id="timeInputs" class="hidden">
                            <div class="flex space-x-2">
                                <input type="number" id="timeValue" name="timeValue" placeholder="Nombre" min="1" max="168"
                                       class="flex-1 px-3 py-2 bg-slate-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-emerald-400">
                                <select id="timeUnit" name="timeUnit" class="px-3 py-2 bg-slate-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-emerald-400">
                                    <option value="heures">heure(s)</option>
                                    <option value="jours">jour(s)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <label for="statusNote" class="block text-sm font-medium text-white mb-2">
                            Note (optionnel)
                        </label>
                        <textarea id="statusNote" name="statusNote" rows="3" 
                                  class="w-full px-3 py-2 bg-slate-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-emerald-400" 
                                  placeholder="Ajouter une note..."></textarea>
                    </div>
                    
                    <div class="flex justify-end space-x-3">
                        <button type="button" id="cancelStatusBtn" 
                                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-400 transition-all">
                            Mettre à jour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Pagination Container (will be created dynamically) -->
    <div id="paginationContainer" class="mt-6 flex items-center justify-between px-6 py-3 bg-slate-800 border border-emerald-500/20 rounded-b-lg hidden">
        <div class="text-sm text-gray-400">
            Affichage de <span id="startItem">1</span> à <span id="endItem">5</span> sur <span id="totalItems">0</span> éléments
        </div>
        <div class="flex items-center space-x-2">
            <button id="prevPage" class="px-3 py-1 text-sm bg-slate-700 border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Précédent
            </button>
            <div id="pageNumbers" class="flex space-x-1"></div>
            <button id="nextPage" class="px-3 py-1 text-sm bg-slate-700 border border-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant
            </button>
        </div>
    </div>

    <!-- Message Container for notifications -->
    <div id="messageContainer" class="fixed top-4 right-4 z-50"></div>

    <!-- Load Application -->
    <script type="module" src="/dist/ts/app.js"></script>
</body>
</html>