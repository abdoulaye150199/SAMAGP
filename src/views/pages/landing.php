<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>YONI MA - Suivi de Colis</title>
</head>

<body class="bg-slate-900 text-white min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-emerald-400/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-lg flex items-center justify-center">
                        <i class="fas fa-ship text-white text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-white">YONI MA</h1>
                        <p class="text-xs text-emerald-300">Logistique & Transport</p>
                    </div>
                </div>
                <a href="/login" class="bg-gradient-to-r from-emerald-400 to-emerald-300 text-white px-6 py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-400 transition-all">
                    <i class="fas fa-sign-in-alt mr-2"></i>Connexion
                </a>
            </div>
        </div>
    </nav>

    <!-- Zone de notification centrée -->
    <div id="message-container" class="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"></div>
    
    <!-- Main Content -->
    <main class="flex items-center justify-center pt-16" style="min-height: 100vh;">
        <div class="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Titre Principal Centré -->
            <div class="text-center mb-8">
                <h2 class="text-5xl lg:text-6xl font-bold text-white mb-2">
                    Suivez Votre Colis
                </h2>
                <p class="text-lg text-gray-300">
                    Entrez votre code de suivi pour obtenir des informations en temps réel
                </p>
            </div>

            <!-- Contenu Principal -->
            <div class="grid lg:grid-cols-2 gap-8 items-start">
                <!-- Formulaire de Recherche -->
                <div class="bg-slate-800 rounded-2xl p-6 border border-emerald-400/20 shadow-2xl">
                    <form onsubmit="trackPackage(event)" class="space-y-4">
                        <div>
                            <label for="tracking-code" class="block text-sm font-semibold text-white mb-3">
                                <i class="fas fa-barcode mr-2 text-emerald-400"></i>Code de Suivi
                            </label>
                            <div class="relative">
                                <input type="text" id="tracking-code" 
                                       class="w-full px-4 py-3 pl-10 bg-slate-700 border border-gray-600 text-white rounded-lg focus:border-emerald-400 focus:outline-none transition-all"
                                       placeholder="YONIMA938873">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <i class="fas fa-search text-emerald-400"></i>
                                </div>
                            </div>
                            <p class="text-xs text-emerald-400 mt-2">
                                <i class="fas fa-info-circle mr-1"></i>
                                Codes de test disponibles : YONIMA938873, YONIMA009225, YONIMA577674
                            </p>
                        </div>

                        <button type="submit" id="track-button"
                                class="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-500 transition-all font-bold shadow-lg hover:shadow-xl">
                            <span id="button-text">
                                <i class="fas fa-search mr-2"></i>Localiser Mon Colis
                            </span>
                            <div id="loading-spinner" class="hidden inline-block ml-2 w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        </button>
                    </form>

                    <!-- Section Progression (cachée par défaut) -->
                    <div id="progress-section" class="hidden mt-6">
                        <!-- Statistiques Distance & Progression -->
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="bg-slate-700 rounded-lg p-4 border border-gray-600 text-center">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="fas fa-route text-emerald-400 text-xl"></i>
                                </div>
                                <p class="text-xs text-gray-400 uppercase mb-1">Distance</p>
                                <p id="distance-value" class="text-lg font-bold text-white">4,200km</p>
                            </div>
                            <div class="bg-slate-700 rounded-lg p-4 border border-gray-600 text-center">
                                <div class="flex items-center justify-center mb-2">
                                    <i class="fas fa-bolt text-yellow-400 text-xl"></i>
                                </div>
                                <p class="text-xs text-gray-400 uppercase mb-1">Progression</p>
                                <p id="progress-value" class="text-lg font-bold text-white">35%</p>
                            </div>
                        </div>

                        <!-- Barre de Progression -->
                        <div class="mb-2">
                            <div class="flex justify-between items-center mb-2">
                                <p class="text-xs text-gray-400">Progression du voyage</p>
                                <span id="progress-percent" class="text-xs text-white">35%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div id="progress-bar" class="bg-gradient-to-r from-emerald-400 to-emerald-300 h-2 rounded-full transition-all duration-1000" style="width: 35%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Résultats -->
                <div id="tracking-result" class="hidden lg:block">
                    <div class="bg-slate-800 rounded-2xl p-6 border border-emerald-400/20 shadow-2xl">
                        <h4 class="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                            <i class="fas fa-info-circle mr-2"></i>Informations du Colis
                        </h4>
                        <div id="package-info" class="space-y-4">
                            <!-- Contenu dynamique -->
                        </div>
                        <div id="print-section" class="hidden mt-4 text-center">
                            <button onclick="printPackageInfo()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                                <i class="fas fa-print mr-2"></i>Imprimer
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Résultats Mobile -->
                <div id="tracking-result-mobile" class="hidden lg:hidden mt-6">
                    <div class="bg-slate-800 rounded-2xl p-6 border border-emerald-400/20 shadow-2xl">
                        <h4 class="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                            <i class="fas fa-info-circle mr-2"></i>Informations du Colis
                        </h4>
                        <div id="package-info-mobile" class="space-y-4">
                            <!-- Contenu dynamique mobile -->
                        </div>
                        <div id="print-section-mobile" class="hidden mt-4 text-center">
                            <button onclick="printPackageInfo()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                                <i class="fas fa-print mr-2"></i>Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Zone d'impression cachée -->
    <div id="package-info-print" style="display: none;">
        <!-- Contenu pour l'impression sera injecté ici -->
    </div>

    <script type="module" src="/dist/ts/app.js"></script>
</body>
</html>
