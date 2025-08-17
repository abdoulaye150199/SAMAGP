<?php

class LoginHandler {
    
    public static function handleLogin() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            session_start();
            
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';
            
            // Charger les gestionnaires depuis db.json
            $dbPath = __DIR__ . '/../db.json';
            if (!file_exists($dbPath)) {
                $_SESSION['login_error'] = 'Erreur de configuration système';
                header('Location: /login');
                exit;
            }

            $db = json_decode(file_get_contents($dbPath), true);
            $gestionnaires = $db['gestionnaires'] ?? [];
            
            error_log('Tentative de connexion avec: ' . $email);
            error_log('Gestionnaires trouvés: ' . print_r($gestionnaires, true));
            
            // Vérifier les identifiants
            $userFound = false;
            $user = null;
            
            foreach ($gestionnaires as $gestionnaire) {
                if ($gestionnaire['email'] === $email && 
                    $gestionnaire['motDePasse'] === $password && 
                    $gestionnaire['actif']) {
                    $userFound = true;
                    $user = $gestionnaire;
                    break;
                }
            }
            
            if ($userFound) {
                // Stocker les informations utilisateur en session
                $_SESSION['user_logged_in'] = true;
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'nom' => $user['nom'],
                    'prenom' => $user['prenom'],
                    'role' => $user['role']
                ];
                
                // Rediriger vers le dashboard
                header('Location: /dashboard');
                exit;
            } else {
                $_SESSION['login_error'] = 'Email ou mot de passe incorrect';
                header('Location: /login');
                exit;
            }
        }
    }
    
    public static function handleLogout() {
        session_start();
        session_destroy();
        header('Location: /login');
        exit;
    }
}

?>
