<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = $_SESSION['user'] ?? null;
$successMessage = $_SESSION['success_message'] ?? null;

unset($_SESSION['success_message']);

// Si pas d'utilisateur en session, rediriger vers login (sécurité supplémentaire)
if (!$user) {
    header('Location: /login');
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>YONIMA - Dashboard</title>
    <?php include_once __DIR__ . '/../includes/leaflet.php'; ?>

</head>
<body class="bg-slate-900">

    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg border-r border-emerald-500/20">
        <div class="flex flex-col h-full">
           
            <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-emerald-500 to-emerald-400">
                <h1 class="text-xl font-bold text-white">YONI MA</h1>
            </div>
            
           
            <nav class="flex-1 px-4 py-6 space-y-2">
                <a href="/dashboard" class="flex items-center px-4 py-2 text-emerald-400 bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-tachometer-alt mr-3"></i>Dashboard
                </a>
                <a href="/cargaisons" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-ship mr-3"></i>Cargaisons
                </a>
                <a href="/produits" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-box mr-3"></i>Produits
                </a>
                <!-- <a href="/creation-cargaison" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-plus mr-3"></i>Nouvelle Cargaison
                </a> -->
                <a href="/enregistrement-colis" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-package mr-3"></i>Enregistrer Colis
                </a>

                <a href="/suivi-colis" class="flex items-center px-4 py-2 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg transition-all">
                    <i class="fas fa-search mr-3"></i>Suivi Colis
                </a>

            </nav>
            
         
            <div class="px-4 py-4 border-t border-emerald-500/20">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-sm"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-white"><?= htmlspecialchars(($user['prenom'] ?? '') . ' ' . ($user['nom'] ?? '')) ?></p>
                        <p class="text-xs text-slate-400"><?= htmlspecialchars($user['email'] ?? '') ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

   
    <div class="ml-64">   
        <header class="fixed top-0 left-64 right-0 z-40 bg-slate-800 shadow-sm border-b border-emerald-500/30">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-white">Dashboard</h2>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-slate-300">Bienvenue, <?= htmlspecialchars($user['prenom'] ?? 'Utilisateur') ?></span>
                        <button id="notificationBtn" class="p-2 text-slate-400 hover:text-emerald-400 transition-colors">
                            <i class="fas fa-bell"></i>
                        </button>
                        <a href="/logout" class="text-sm text-slate-300 hover:text-emerald-400 transition-colors">
                            <i class="fas fa-sign-out-alt mr-1"></i>Déconnexion
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <main class="pt-20 p-6">
            <!-- Barre de recherche de cargaisons -->
            <div class="mb-6">
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">
                        <i class="fas fa-search text-emerald-400 mr-2"></i>Rechercher une Cargaison
                    </h3>
                    <div class="flex gap-4">
                    <div class="flex-1">
                    <div class="relative">
                    <input type="text" id="cargaisonSearch" 
                    class="w-full px-4 py-3 pl-12 bg-slate-700 border border-slate-600 text-white rounded-lg focus:border-emerald-400 focus:outline-none transition-all"
                    placeholder="Entrez l'ID de la cargaison (ex: CARG-001)">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <i class="fas fa-search text-emerald-400"></i>
                    </div>
                    </div>
                    </div>
                        <button id="searchCargaisonBtn" 
                                class="bg-gradient-to-r from-emerald-500 to-emerald-400 text-dark px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-500 transition-all">
                            <i class="fas fa-eye mr-2"></i>Voir Détails
                        </button>
                    </div>
                    
                    <!-- Suggestions de cargaisons -->
                    <div id="cargaisonSuggestions" class="mt-4 hidden">
                        <p class="text-sm text-slate-400 mb-3">Cargaisons disponibles :</p>
                        <div class="bg-slate-800 rounded-lg p-4 border border-emerald-500/20">
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="suggestionsList">
                                <!-- Les suggestions seront ajoutées ici par le contrôleur -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistiques -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-emerald-400/20 rounded-lg">
                            <i class="fas fa-ship text-emerald-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">Cargaisons Actives</p>
                            <p id="totalCargaisons" class="text-2xl font-bold text-white">-</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-green-500/20 rounded-lg">
                            <i class="fas fa-box text-green-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">Colis en Transit</p>
                            <p id="cargaisonsEnCours" class="text-2xl font-bold text-white">-</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-blue-500/20 rounded-lg">
                            <i class="fas fa-check-circle text-blue-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">Colis Livrés</p>
                            <p id="cargaisonsArrivees" class="text-2xl font-bold text-white">-</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-6">
                    <div class="flex items-center">
                        <div class="p-2 bg-yellow-500/20 rounded-lg">
                            <i class="fas fa-euro-sign text-yellow-400 text-xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm text-slate-400">Revenus Estimés</p>
                            <p id="revenueEstime" class="text-2xl font-bold text-white">-</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Activité Récente -->
            <div class="mb-6">
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20 p-6">
                    <h3 class="text-lg font-semibold text-white mb-4">
                        <i class="fas fa-clock text-emerald-400 mr-2"></i>Activité Récente
                    </h3>
                    <div id="recentActivityContainer" class="space-y-2">
                        <p class="text-slate-400 text-center py-4">Chargement...</p>
                    </div>
                </div>
            </div>
            
            <!-- Carte de Cargaison Détaillée -->
            <div class="mt-6">
                <div class="bg-slate-800 rounded-xl shadow-lg border border-emerald-500/20">
                    <div class="p-6 border-b border-emerald-500/20">
                        <div class="flex items-center justify-between">
                            <h3 id="cargaisonTitle" class="text-lg font-semibold text-white">Détails Cargaison</h3>
                            <div class="flex items-center space-x-2">
                                <span id="cargaisonStatus" class="px-3 py-1 bg-emerald-400/20 text-emerald-400 text-sm rounded-full border border-emerald-500/30">-</span>
                                <button id="expandMapBtn" class="text-slate-400 hover:text-emerald-400 transition-colors">
                                    <i class="fas fa-expand-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="p-6">
                        <div class="grid lg:grid-cols-3 gap-6">
                            <!-- Informations Générales -->
                            <div class="space-y-4">
                                <h4 class="text-md font-semibold text-emerald-400 mb-3">Informations Générales</h4>
                                <div class="space-y-3">
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Type :</span>
                                        <span id="cargaisonType" class="text-white">-</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Date Création :</span>
                                        <span id="cargaisonDateCreation" class="text-white">-</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Date Prévue :</span>
                                        <span id="cargaisonDatePrevue" class="text-white">-</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Origine → Destination :</span>
                                        <span id="cargaisonRoute" class="text-white">-</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Carte Interactive -->
                            <div class="space-y-4">
                                <h4 class="text-md font-semibold text-emerald-400 mb-3">Suivi en Temps Réel</h4>
                                <div class="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
                                    <!-- Carte Leaflet -->
                                    <div id="shipMap" style="height: 300px; width: 100%;"></div>
                                </div>
                                
                                <!-- Informations de position -->
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="bg-slate-700 rounded-lg p-3 border border-slate-600">
                                        <div class="flex items-center">
                                            <i class="fas fa-map-marker-alt text-green-400 mr-2"></i>
                                            <div>
                                                <p class="text-xs text-slate-400">Position</p>
                                                <p id="cargaisonPosition" class="text-sm font-bold text-white">-</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-slate-700 rounded-lg p-3 border border-slate-600">
                                        <div class="flex items-center">
                                            <i class="fas fa-tachometer-alt text-blue-400 mr-2"></i>
                                            <div>
                                                <p class="text-xs text-slate-400">Vitesse</p>
                                                <p id="cargaisonVitesse" class="text-sm font-bold text-white">-</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Statistiques Avancées -->
                            <div class="space-y-4">
                                <h4 class="text-md font-semibold text-emerald-400 mb-3">Statistiques</h4>
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="bg-slate-700 rounded-lg p-3 border border-slate-600">
                                        <div class="text-center">
                                            <i class="fas fa-box text-emerald-400 text-lg mb-1"></i>
                                            <p class="text-xs text-slate-400">Colis</p>
                                            <p id="cargaisonColis" class="text-lg font-bold text-white">-</p>
                                        </div>
                                    </div>
                                    <div class="bg-slate-700 rounded-lg p-3 border border-slate-600">
                                        <div class="text-center">
                                            <i class="fas fa-weight-hanging text-emerald-400 text-lg mb-1"></i>
                                            <p class="text-xs text-slate-400">Poids Max</p>
                                            <p id="cargaisonPoids" class="text-lg font-bold text-white">-</p>
                                        </div>
                                    </div>
                                    <div class="bg-slate-700 rounded-lg p-3 border border-slate-600">
                                        <div class="text-center">
                                            <i class="fas fa-route text-green-400 text-lg mb-1"></i>
                                            <p class="text-xs text-slate-400">Prix/Kg</p>
                                            <p id="cargaisonPrix" class="text-lg font-bold text-white">-</p>
                                        </div>
                                    </div>
                                    <div class="bg-slate-700 rounded-lg p-3 border border-slate-600">
                                        <div class="text-center">
                                            <i class="fas fa-percentage text-yellow-400 text-lg mb-1"></i>
                                            <p class="text-xs text-slate-400">Progression</p>
                                            <p id="cargaisonProgression" class="text-lg font-bold text-white">-</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Barre de progression -->
                                <div class="mt-4">
                                    <div class="flex justify-between text-xs text-slate-400 mb-2">
                                        <span>Progression du voyage</span>
                                        <span id="cargaisonProgressionText">0%</span>
                                    </div>
                                    <div class="w-full bg-slate-700 rounded-full h-2">
                                        <div id="cargaisonProgressionBar" class="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full" style="width: 0%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Actions en bas -->
                        <div class="mt-6 pt-4 border-t border-slate-600">
                            <div class="flex flex-wrap gap-3">
                                <a id="cargaisonDetailsLink" href="/cargaisons" class="bg-gradient-to-r from-emerald-500 to-emerald-400 text-dark px-4 py-2 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-500 transition-all">
                                    <i class="fas fa-eye mr-2"></i>Voir Détails
                                </a>
                                <a id="cargaisonMapLink" href="/suivi-carte" class="border border-emerald-400 text-emerald-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-400/10 transition-all">
                                    <i class="fas fa-map-marked-alt mr-2"></i>Suivre sur Carte
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Success message data for TypeScript -->
    <?php if ($successMessage): ?>
    <script id="successMessageData" type="application/json">
        {
            "type": "<?= $successMessage['type'] ?>",
            "title": "<?= addslashes($successMessage['title']) ?>",
            "message": "<?= addslashes($successMessage['message']) ?>",
            "icon": "<?= $successMessage['icon'] ?>"
        }
    </script>
    <?php endif; ?>

    <!-- Load Application -->
    <script type="module" src="/dist/ts/app.js"></script>
</body>
</html>
