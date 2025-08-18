<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$errors = $_SESSION['login_errors'] ?? [];
$generalError = $_SESSION['login_error'] ?? '';
$oldEmail = $_SESSION['old_email'] ?? '';
$logoutMessage = $_SESSION['logout_message'] ?? null;
$loginRequired = $_SESSION['login_required'] ?? '';

unset($_SESSION['login_errors'], $_SESSION['login_error'], $_SESSION['old_email'], $_SESSION['logout_message'], $_SESSION['login_required']);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <?php include_once __DIR__ . '/../includes/head.php'; ?>
    <title>YONIMA - Connexion</title>
    <style>
        .bg-image {
            background-image: url('/images/cargo.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        
        .bg-overlay {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(2px);
        }
    </style>
</head>
<body class="bg-image min-h-screen">
    <div class="bg-overlay min-h-screen flex items-center justify-center">
                <div class="notification-container" id="notificationContainer"></div>

        <header class="bg-slate-800/90 backdrop-blur-sm shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-emerald-500/20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <h1 class="text-2xl font-bold text-emerald-400">YONI MA</h1>
                            <p class="text-xs text-emerald-300">Gestion de Cargaisons</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/login" class="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <i class="fas fa-sign-in-alt mr-2"></i>Connexion
                        </a>
                    </div>
                </div>
            </div>
        </header>

        <div class="max-w-md w-full space-y-8 p-8 mt-16 login-form">
            <div class="text-center">
                <div class="mb-6">
                    <div class="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <i class="fas fa-ship text-3xl text-white"></i>
                    </div>
                </div>

                <div class="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-500/20">
                    
                    <?php if (!empty($loginRequired)): ?>
                        <div class="mb-6 bg-amber-50 border-l-4 border-amber-400 text-amber-700 px-4 py-3 rounded-r-lg shadow-sm">
                            <div class="flex items-center">
                                <i class="fas fa-info-circle mr-3 text-amber-500"></i>
                                <span class="font-medium"><?= htmlspecialchars($loginRequired) ?></span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($generalError)): ?>
                        <div class="mb-6 bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-lg shadow-sm">
                            <div class="flex items-center">
                                <i class="fas fa-exclamation-circle mr-3 text-red-500"></i>
                                <span class="font-medium"><?= htmlspecialchars($generalError) ?></span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <form method="POST" action="/login" class="space-y-6">
                        
                        <div>
                            <label for="email" class="block text-sm font-semibold text-white mb-2">
                                <i class="fas fa-envelope mr-2 text-emerald-400"></i>
                                Email <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input id="email" name="email" type="email"  autocomplete="username"
                                       class="w-full px-4 py-3 pl-12 border <?= isset($errors['email']) ? 'border-red-400 bg-red-50' : 'border-slate-600 bg-slate-700 text-white' ?> rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm"
                                       placeholder="votre@email.com"
                                       value="<?= htmlspecialchars($oldEmail) ?>">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fas fa-envelope text-emerald-300"></i>
                                </div>
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <?php if (isset($errors['email'])): ?>
                                        <i class="fas fa-exclamation-circle text-red-500"></i>
                                    <?php else: ?>
                                        <i class="fas fa-check-circle text-green-500 opacity-0" id="email-check"></i>
                                    <?php endif; ?>
                                </div>
                            </div>
                            <?php if (isset($errors['email'])): ?>
                                <div class="text-red-600 text-sm mt-2 flex items-center animate-pulse">
                                    <i class="fas fa-exclamation-triangle mr-2"></i>
                                    <?= htmlspecialchars($errors['email']) ?>
                                </div>
                            <?php endif; ?>
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-semibold text-white mb-2">
                                <i class="fas fa-lock mr-2 text-emerald-400"></i>
                                Mot de passe <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input id="password" name="password" type="password"
                                       class="w-full px-4 py-3 pl-12 pr-16 border <?= isset($errors['password']) ? 'border-red-400 bg-red-50' : 'border-slate-600 bg-slate-700 text-white' ?> rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm"
                                       placeholder="••••••••" autocomplete="new-password">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i class="fas fa-lock text-emerald-300"></i>
                                </div>
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                                    <?php if (isset($errors['password'])): ?>
                                        <i class="fas fa-exclamation-circle text-red-500"></i>
                                    <?php else: ?>
                                        <i class="fas fa-check-circle text-green-500 opacity-0" id="password-check"></i>
                                    <?php endif; ?>
                                    <button type="button" onclick="togglePassword()" class="text-emerald-300 hover:text-emerald-400 transition-colors">
                                        <i class="fas fa-eye" id="eye-icon"></i>
                                    </button>
                                </div>
                            </div>
                            <?php if (isset($errors['password'])): ?>
                                <div class="text-red-600 text-sm mt-2 flex items-center animate-pulse">
                                    <i class="fas fa-exclamation-triangle mr-2"></i>
                                    <?= htmlspecialchars($errors['password']) ?>
                                </div>
                            <?php endif; ?>
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox"
                                       class="h-4 w-4 text-emerald-400 focus:ring-emerald-500 border-slate-600 rounded transition-colors">
                                <label for="remember-me" class="ml-2 block text-sm text-white font-medium">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <!-- <div class="text-sm">
                                <a href="#" class="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Mot de passe oublié ?
                                </a>
                            </div> -->
                        </div>

                        <button type="submit"
                                class="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-500 transition-all duration-300 font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <i class="fas fa-sign-in-alt mr-2"></i>
                            Se connecter
                        </button>
                    </form>

                    <div class="mt-8 text-center">
                        <a href="/" class="text-sm text-emerald-300 hover:text-emerald-400 transition-colors font-medium">
                            <i class="fas fa-arrow-left mr-2"></i>Retour à l'accueil
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="/dist/ts/app.js"></script>
</body>
</html>
