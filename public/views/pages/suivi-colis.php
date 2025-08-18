<!DOCTYPE html>
<html lang="fr">

<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>SENGP - Suivi Colis</title>
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
                <a href="/dashboard" class="flex items-center px-4 py-2 text-white hover:bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-tachometer-alt mr-3"></i>Dashboard
                </a>
                <a href="/cargaisons" class="flex items-center px-4 py-2 text-white hover:bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-ship mr-3"></i>Cargaisons
                </a>
                <a href="/produits" class="flex items-center px-4 py-2 text-white hover:bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-box mr-3"></i>Produits
                </a>
                <a href="/creation-cargaison"
                    class="flex items-center px-4 py-2 text-white hover:bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-plus mr-3"></i>Nouvelle Cargaison
                </a>
                <a href="/enregistrement-colis"
                    class="flex items-center px-4 py-2 text-white hover:bg-emerald-500/20 rounded-lg">
                    <i class="fas fa-package mr-3"></i>Enregistrer Colis
                </a>

                <a href="/suivi-colis" class="flex items-center px-4 py-2 text-emerald-400 bg-emerald-500/10 rounded-lg">
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
                    <h2 class="text-2xl font-bold text-white">Suivi et Gestion des Colis</h2>
                </div>
            </div>
        </header>

        <!-- Content -->
        <main class="p-6">
            <!-- Search Section -->
            <div class="bg-slate-800 rounded-xl shadow-sm p-6 mb-6 border border-emerald-500/20">
                <h3 class="text-lg font-semibold text-white mb-4">Rechercher un Colis</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-emerald-300 mb-2">Code de Suivi</label>
                        <input type="text" id="search-code"
                            class="w-full px-3 py-2 border border-emerald-500/30 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="SENGP001">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-emerald-300 mb-2">Nom Expéditeur</label>
                        <input type="text" id="search-expediteur"
                            class="w-full px-3 py-2 border border-emerald-500/30 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Nom">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-emerald-300 mb-2">Nom Destinataire</label>
                        <input type="text" id="search-destinataire"
                            class="w-full px-3 py-2 border border-emerald-500/30 bg-slate-900 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Nom">
                    </div>
                    <div class="flex items-end">
                        <button onclick="rechercherColis()"
                            class="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-500 transition-colors">
                            <i class="fas fa-search mr-2"></i>Rechercher
                        </button>
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div id="results-section" class="hidden">
                <div class="bg-slate-800 rounded-xl shadow-sm mb-6 border border-emerald-500/20">
                    <div class="p-6 border-b border-emerald-500/20">
                        <h3 class="text-lg font-semibold text-white">Résultats de la Recherche</h3>
                    </div>
                    <div id="search-results" class="p-6">
                        <!-- Dynamic content will be inserted here -->
                    </div>
                </div>
            </div>



            <!-- Recent Packages -->
            <div class="bg-slate-800 rounded-xl shadow-sm border border-emerald-500/20">
                <div class="p-6 border-b border-emerald-500/20">
                    <h3 class="text-lg font-semibold text-white">Colis Récents</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-900">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                                    Code</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                                    Expéditeur</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                                    Destinataire</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                                    Poids</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                                    État</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-slate-800 divide-y divide-emerald-500/20">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-white">SENGP001</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-white">Jean Dupont</div>
                                    <div class="text-sm text-emerald-300">+221 77 123 45 67</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-white">Marie Martin</div>
                                    <div class="text-sm text-emerald-300">+33 6 12 34 56 78</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">2.5 kg</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        En cours
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <button class="text-emerald-400 hover:text-emerald-300"
                                            onclick="voirDetails('SENGP001')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="text-emerald-300 hover:text-emerald-400"
                                            onclick="modifierColis('SENGP001')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-white">SENGP002</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-white">Paul Durand</div>
                                    <div class="text-sm text-emerald-300">+221 76 987 65 43</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-white">Sophie Leblanc</div>
                                    <div class="text-sm text-emerald-300">+33 7 98 76 54 32</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-white">1.2 kg</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-500/20 text-emerald-400">
                                        Arrivé
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2">
                                        <button class="text-emerald-400 hover:text-emerald-300"
                                            onclick="voirDetails('SENGP002')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="text-emerald-300 hover:text-emerald-400"
                                            onclick="modifierColis('SENGP002')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <script type="module" src="/dist/ts/app.js"></script>
</body>

</html>