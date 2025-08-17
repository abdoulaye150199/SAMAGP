<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/ApiHandler.php'; 
require_once __DIR__ . '/LoginHandler.php';

// Démarrer la session au début du script
session_start();

// Fonction pour vérifier si l'utilisateur est connecté
function checkAuth() {
    if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
        header('Location: /login');
        exit;
    }
}

// Gérer les fichiers statiques
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/', $requestUri)) {
    // Essayer de servir le fichier depuis dist/ ou src/
    $filePath = null;
    if (strpos($requestUri, '/dist/') === 0) {
        $filePath = __DIR__ . '/../' . $requestUri;
    } elseif (strpos($requestUri, '/src/') === 0) {
        $filePath = __DIR__ . '/../' . $requestUri;
    } elseif (strpos($requestUri, '/public/') === 0) {
        $filePath = __DIR__ . $requestUri;
    }
    
    if ($filePath && file_exists($filePath)) {
        // Définir le MIME type correct selon l'extension
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimeTypes = [
            'js' => 'application/javascript',
            'css' => 'text/css',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon'
        ];
        
        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        header('Content-Type: ' . $mimeType);
        readfile($filePath);
        exit;
    }
}

// Initialiser le router
$router = new Router();

// === ROUTES PUBLIQUES ===
$router->get('/', 'landing');
$router->get('/login', 'login');
$router->post('/login', function() {
    LoginHandler::handleLogin();
});
$router->get('/logout', function() use ($router) {
    session_start();
    session_destroy();
    header('Location: /login');
    exit;
});

// === MIDDLEWARE D'AUTHENTIFICATION ===
// Protéger toutes les routes protégées
$router->before('GET', '/dashboard', 'checkAuth');
$router->before('GET', '/cargaisons', 'checkAuth');
$router->before('GET', '/creation-cargaison', 'checkAuth');
$router->before('GET', '/details-cargaison', 'checkAuth');
$router->before('GET', '/enregistrement-colis', 'checkAuth');
$router->before('GET', '/suivi-colis', 'checkAuth');
$router->before('GET', '/suivi-carte', 'checkAuth');
$router->before('GET', '/produits', 'checkAuth');
$router->before('GET', '/notifications-log', 'checkAuth');

// === ROUTES API ===
$router->before('GET', '/api/*', 'checkAuth');
$router->before('POST', '/api/*', 'checkAuth');
$router->before('PUT', '/api/*', 'checkAuth');
$router->before('DELETE', '/api/*', 'checkAuth');

// Routes API existantes...
$router->get('/api/colis', function() {
    ApiHandler::handleColis();
});
$router->post('/api/colis', function() {
    ApiHandler::handleColis();
});
$router->put('/api/colis', function() {
    ApiHandler::handleColis();
});
$router->delete('/api/colis', function() {
    ApiHandler::handleColis();
});

$router->get('/api/cargaisons', function() {
    ApiHandler::handleCargaisons();
});
$router->post('/api/cargaisons', function() {
    ApiHandler::handleCargaisons();
});
$router->put('/api/cargaisons', function() {
    ApiHandler::handleCargaisons();
});
$router->delete('/api/cargaisons', function() {
    ApiHandler::handleCargaisons();
});

$router->get('/api/email', function() {
    ApiHandler::handleEmail();
});
$router->post('/api/email', function() {
    ApiHandler::handleEmail();
});
$router->put('/api/email', function() {
    ApiHandler::handleEmail();
});
$router->delete('/api/email', function() {
    ApiHandler::handleEmail();
});

// === ROUTES PROTÉGÉES ===
$router->get('/dashboard', 'dashboard');
$router->get('/cargaisons', 'cargaisons');
$router->get('/creation-cargaison', 'creation-cargaison');
$router->get('/details-cargaison', 'details-cargaison');
$router->get('/enregistrement-colis', 'enregistrement-colis');
$router->get('/suivi-colis', 'suivi-colis');
$router->get('/suivi-carte', 'suivi-carte');
$router->get('/produits', 'produits');
$router->get('/notifications-log', 'notifications-log');

// === GESTION DES ERREURS ===
$router->setErrorHandler(function($router) {
    header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
    include __DIR__ . '/../src/views/pages/404.php';
});

// === DISPATCH ===
$router->dispatch();

?>