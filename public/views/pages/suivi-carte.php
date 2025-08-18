<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <?php include_once __DIR__ . '/../includes/leaflet.php'; ?>
    <title>Suivi sur Carte - Cargaison</title>
</head>

<body class="bg-slate-900 text-white font-sans">
    <!-- Navigation -->
    <nav class="bg-slate-800 shadow-sm border-b border-emerald-500/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <i class="fas fa-ship text-emerald-400 text-2xl mr-3"></i>
                        <h1 class="text-xl font-bold text-white">Suivi sur Carte</h1>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/dashboard" class="text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i>Retour au Dashboard
                    </a>
                    <button onclick="toggleFullscreen()" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-expand" id="fullscreenIcon"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
        <!-- Barre de recherche et Liste des cargaisons en cours -->
        <div class="bg-slate-800 border-b border-emerald-500/30 p-4">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <h2 class="text-lg font-semibold text-white">Cargaisons en Cours</h2>
                    
                    <!-- Barre de recherche -->
                    <div class="flex-1 max-w-md">
                        <div class="relative">
                            <input type="text" id="searchShipment" 
                                   class="w-full px-4 py-2 pl-10 bg-slate-700 border border-slate-600 text-white rounded-lg focus:border-emerald-500 focus:outline-none transition-all"
                                   placeholder="Rechercher une cargaison (ex: CARG-001)">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <i class="fas fa-search text-emerald-400"></i>
                            </div>
                            <button onclick="clearSearch()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="flex space-x-4 overflow-x-auto pb-2" id="shipmentsList">
                    <!-- Les cargaisons seront injectées ici -->
                </div>
            </div>
        </div>

        <!-- Map Container -->
        <div class="relative w-full h-[calc(100vh-160px)]">
            <div id="mapContainer" class="w-full h-full"></div>
            
            <!-- Panneau d'informations (caché par défaut) -->
            <div id="infoPanel" class="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-emerald-500/20 p-4 max-w-sm hidden shadow-lg">
                <div class="flex items-center justify-between mb-3">
                    <h3 id="shipmentTitle" class="text-lg font-semibold text-white">CARG-001</h3>
                    <button onclick="closeInfoPanel()" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="space-y-3">
                    <div>
                        <p class="text-xs text-slate-400">Type</p>
                        <p id="shipmentType" class="text-white font-medium">Maritime</p>
                    </div>
                    
                    <div>
                        <p class="text-xs text-slate-400">Route</p>
                        <p id="shipmentRoute" class="text-white font-medium">Dakar → Paris</p>
                    </div>
                    
                    <div>
                        <p class="text-xs text-slate-400">Statut</p>
                        <span id="shipmentStatus" class="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">En cours</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <p class="text-xs text-slate-400">Progression</p>
                            <p id="shipmentProgress" class="text-white font-bold">35%</p>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400">Distance</p>
                            <p id="shipmentDistance" class="text-white font-bold">4,200km</p>
                        </div>
                    </div>
                    
                    <div id="positionInfo" class="pt-3 border-t border-slate-600">
                        <p class="text-xs text-slate-400 mb-2">Position Actuelle</p>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <i class="fas fa-map-marker-alt text-emerald-400 mr-1"></i>
                                <span id="coordinates" class="text-white">35°N, 20°W</span>
                            </div>
                            <div>
                                <i class="fas fa-tachometer-alt text-emerald-400 mr-1"></i>
                                <span id="speed" class="text-white">18 nœuds</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script type="module" src="/dist/ts/app.js"></script>
</body>
</html>
