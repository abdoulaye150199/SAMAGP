<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>Logs des Notifications - YONIMA</title>
</head>
<body class="bg-dark">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-dark-light shadow-lg">
        <div class="flex flex-col h-full">
            <!-- Logo -->
            <div class="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-aqua to-aqua-light">
                <h1 class="text-xl font-bold text-white">YONI MA</h1>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 space-y-2">
                <a href="/dashboard" class="flex items-center px-4 py-2 text-white hover:bg-dark rounded-lg">
                    <i class="fas fa-tachometer-alt mr-3"></i>Dashboard
                </a>
                <a href="/cargaisons" class="flex items-center px-4 py-2 text-white hover:bg-dark rounded-lg">
                    <i class="fas fa-ship mr-3"></i>Cargaisons
                </a>
                <a href="/produits" class="flex items-center px-4 py-2 text-white hover:bg-dark rounded-lg">
                    <i class="fas fa-box mr-3"></i>Produits
                </a>
                <a href="/creation-cargaison" class="flex items-center px-4 py-2 text-white hover:bg-dark rounded-lg">
                    <i class="fas fa-plus mr-3"></i>Nouvelle Cargaison
                </a>
                <a href="/enregistrement-colis" class="flex items-center px-4 py-2 text-white hover:bg-dark rounded-lg">
                    <i class="fas fa-package mr-3"></i>Enregistrer Colis
                </a>
                <a href="/suivi-colis" class="flex items-center px-4 py-2 text-white hover:bg-dark rounded-lg">
                    <i class="fas fa-search mr-3"></i>Suivi Colis
                </a>
                <a href="/notifications-log" class="flex items-center px-4 py-2 text-aqua bg-aqua/10 rounded-lg">
                    <i class="fas fa-envelope mr-3"></i>Logs Email
                </a>
            </nav>
        </div>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
        <!-- Header -->
        <header class="bg-dark-light shadow-sm border-b border-aqua/20">
            <div class="px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-white">Logs des Notifications Email</h2>
                        <p class="text-sm text-aqua-light mt-1">Historique des emails envoyés aux clients</p>
                    </div>
                    <button onclick="refreshLogs()" class="bg-gradient-to-r from-aqua to-aqua-light text-white px-4 py-2 rounded-lg hover:from-aqua-dark hover:to-aqua transition-colors">
                        <i class="fas fa-sync-alt mr-2"></i>Actualiser
                    </button>
                </div>
            </div>
        </header>

        <!-- Content -->
        <main class="p-6">
            <!-- Statistiques -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-dark-light rounded-xl shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-envelope text-aqua text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-400">Total Emails</p>
                            <p id="totalEmails" class="text-2xl font-bold text-white">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-dark-light rounded-xl shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-check-circle text-green-400 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-400">Confirmations</p>
                            <p id="confirmationEmails" class="text-2xl font-bold text-white">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-dark-light rounded-xl shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-bell text-yellow-400 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-400">Arrivées</p>
                            <p id="arrivalEmails" class="text-2xl font-bold text-white">0</p>
                        </div>
                    </div>
                </div>

                <div class="bg-dark-light rounded-xl shadow-sm p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-calendar text-purple-400 text-2xl"></i>
                        </div>
                        <div class="ml-4">
                            <p class="text-sm font-medium text-gray-400">Aujourd'hui</p>
                            <p id="todayEmails" class="text-2xl font-bold text-white">0</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Logs -->
            <div class="bg-dark-light rounded-xl shadow-sm">
                <div class="p-6 border-b border-aqua/20">
                    <h3 class="text-lg font-semibold text-white">Historique des Notifications</h3>
                </div>
                
                <div class="p-6">
                    <div id="logsContainer" class="space-y-4">
                        <!-- Les logs seront injectés ici -->
                        <div class="text-center py-8 text-gray-400">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <p>Chargement des logs...</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script type="module" src="/dist/ts/app.js"></script>
</body>
</html>
