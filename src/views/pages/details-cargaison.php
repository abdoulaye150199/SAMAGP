<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <?php include_once __DIR__ . '/../includes/leaflet.php'; ?>
    <title>Détails Cargaison</title>
</head>

<body class="bg-dark text-white font-sans">
    <!-- Navigation -->
    <nav class="bg-dark-light shadow-sm border-b border-aqua/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <i class="fas fa-ship text-aqua text-2xl mr-3"></i>
                        <h1 class="text-xl font-bold text-white" id="pageTitle">Détails Cargaison</h1>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/dashboard" class="text-aqua hover:text-aqua-light px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-arrow-left mr-2"></i>Retour au Dashboard
                    </a>
                    <button onclick="toggleFullscreen()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-expand" id="fullscreenIcon"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- En-tête de la cargaison -->
        <div class="bg-dark-light rounded-xl shadow-lg border border-aqua/20 p-6 mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-white" id="cargaisonTitle">Chargement...</h2>
                    <p class="text-gray-400 mt-1" id="cargaisonRoute">Chargement de la route...</p>
                </div>
                <div class="flex items-center space-x-3">
                    <span id="cargaisonStatus" class="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">Chargement...</span>
                    <a href="/suivi-carte" id="suivreCarte" class="bg-gradient-to-r from-aqua to-aqua-light text-dark px-4 py-2 rounded-lg text-sm font-semibold hover:from-aqua-dark hover:to-aqua transition-all">
                        <i class="fas fa-map-marked-alt mr-2"></i>Suivre sur Carte
                    </a>
                </div>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
            <!-- Informations Générales -->
            <div class="bg-dark-light rounded-xl shadow-lg border border-aqua/20 p-6">
                <h3 class="text-lg font-semibold text-aqua mb-4">
                    <i class="fas fa-info-circle mr-2"></i>Informations Générales
                </h3>
                <div class="space-y-4">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Type :</span>
                        <span class="text-white" id="detailType">Chargement...</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Date Création :</span>
                        <span class="text-white" id="detailDateCreation">Chargement...</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Date Départ :</span>
                        <span class="text-white" id="detailDateDepart">Chargement...</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Transporteur :</span>
                        <span class="text-white" id="detailTransporteur">Chargement...</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Poids Max :</span>
                        <span class="text-white" id="detailPoidsMax">Chargement...</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Prix par Kg :</span>
                        <span class="text-white" id="detailPrixKg">Chargement...</span>
                    </div>
                </div>
            </div>
            
            <!-- Carte Interactive -->
            <div class="bg-dark-light rounded-xl shadow-lg border border-aqua/20 p-6">
                <h3 class="text-lg font-semibold text-aqua mb-4">
                    <i class="fas fa-map-marked-alt mr-2"></i>Suivi en Temps Réel
                </h3>
                <div class="bg-dark rounded-lg border border-gray-600 overflow-hidden">
                    <div id="shipMap" style="height: 300px; width: 100%;"></div>
                </div>
                
                <!-- Informations de position -->
                <div class="grid grid-cols-2 gap-3 mt-4">
                    <div class="bg-dark rounded-lg p-3 border border-gray-600">
                        <div class="flex items-center">
                            <i class="fas fa-map-marker-alt text-green-400 mr-2"></i>
                            <div>
                                <p class="text-xs text-gray-400">Position</p>
                                <p class="text-sm font-bold text-white" id="currentPosition">35°N, 20°W</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-dark rounded-lg p-3 border border-gray-600">
                        <div class="flex items-center">
                            <i class="fas fa-tachometer-alt text-blue-400 mr-2"></i>
                            <div>
                                <p class="text-xs text-gray-400">Vitesse</p>
                                <p class="text-sm font-bold text-white" id="currentSpeed">18 nœuds</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Statistiques Avancées -->
            <div class="bg-dark-light rounded-xl shadow-lg border border-aqua/20 p-6">
                <h3 class="text-lg font-semibold text-aqua mb-4">
                    <i class="fas fa-chart-bar mr-2"></i>Statistiques
                </h3>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-dark rounded-lg p-3 border border-gray-600">
                        <div class="text-center">
                            <i class="fas fa-box text-aqua text-lg mb-1"></i>
                            <p class="text-xs text-gray-400">Colis</p>
                            <p class="text-lg font-bold text-white" id="statColis">0</p>
                        </div>
                    </div>
                    <div class="bg-dark rounded-lg p-3 border border-gray-600">
                        <div class="text-center">
                            <i class="fas fa-weight-hanging text-aqua text-lg mb-1"></i>
                            <p class="text-xs text-gray-400">Poids</p>
                            <p class="text-lg font-bold text-white" id="statPoids">0kg</p>
                        </div>
                    </div>
                    <div class="bg-dark rounded-lg p-3 border border-gray-600">
                        <div class="text-center">
                            <i class="fas fa-route text-green-400 text-lg mb-1"></i>
                            <p class="text-xs text-gray-400">Distance</p>
                            <p class="text-lg font-bold text-white" id="statDistance">0km</p>
                        </div>
                    </div>
                    <div class="bg-dark rounded-lg p-3 border border-gray-600">
                        <div class="text-center">
                            <i class="fas fa-percentage text-yellow-400 text-lg mb-1"></i>
                            <p class="text-xs text-gray-400">Progression</p>
                            <p class="text-lg font-bold text-white" id="statProgression">0%</p>
                        </div>
                    </div>
                </div>
                
                <!-- Barre de progression -->
                <div class="mt-4">
                    <div class="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Progression du voyage</span>
                        <span id="progressionText">0%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="bg-gradient-to-r from-aqua to-aqua-light h-2 rounded-full transition-all duration-500" style="width: 0%" id="progressionBar"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Description de la cargaison -->
        <div class="bg-dark-light rounded-xl shadow-lg border border-aqua/20 p-6 mt-6" id="descriptionSection">
            <h3 class="text-lg font-semibold text-aqua mb-4">
                <i class="fas fa-file-alt mr-2"></i>Description
            </h3>
            <p class="text-gray-300" id="cargaisonDescription">Aucune description disponible.</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-center space-x-4 mt-6">
            <a href="/dashboard" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                <i class="fas fa-arrow-left mr-2"></i>Retour au Dashboard
            </a>
            <button onclick="printDetails()" class="border border-aqua text-aqua px-6 py-3 rounded-lg font-semibold hover:bg-aqua/10 transition-all">
                <i class="fas fa-print mr-2"></i>Imprimer
            </button>
        </div>
    </main>

    <script type="module" src="/dist/ts/app.js"></script>


</body>
</html>
