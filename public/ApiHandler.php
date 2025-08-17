<?php

class ApiHandler {
    /**
     * Gère les requêtes API pour les colis
     */
    public static function handleColis() {
        header('Content-Type: application/json');
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $db = json_decode(file_get_contents(__DIR__ . '/../db.json'), true);
            
            switch($method) {
                case 'GET':
                    echo json_encode([
                        'success' => true,
                        'data' => $db['colis'] ?? []
                    ]);
                    break;
                    
                case 'POST':
                    $data = json_decode(file_get_contents('php://input'), true);
                    // Ajout logique création colis
                    break;
                    
                case 'PUT':
                    $data = json_decode(file_get_contents('php://input'), true);
                    // Ajout logique mise à jour colis
                    break;
                    
                case 'DELETE':
                    $data = json_decode(file_get_contents('php://input'), true);
                    // Ajout logique suppression colis
                    break;
                    
                default:
                    http_response_code(405);
                    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Gère les requêtes API pour les cargaisons
     */
    public static function handleCargaisons() {
        header('Content-Type: application/json');
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $dbPath = __DIR__ . '/../db.json';
            
            if (!file_exists($dbPath)) {
                throw new Exception('Database file not found');
            }
            
            $db = json_decode(file_get_contents($dbPath), true);
            $cargaisons = $db['cargaisons'] ?? [];
            
            switch($method) {
                case 'GET':
                    // Filtrage des cargaisons
                    $code = $_GET['code'] ?? '';
                    $type = $_GET['type'] ?? '';
                    $statut = $_GET['statut'] ?? '';
                    
                    $filtered = array_filter($cargaisons, function($cargaison) use ($code, $type, $statut) {
                        $matchCode = empty($code) || stripos($cargaison['code'], $code) !== false;
                        $matchType = empty($type) || $type === 'all' || $cargaison['type'] === $type;
                        $matchStatut = empty($statut) || $statut === 'all' || $cargaison['statut'] === $statut;
                        return $matchCode && $matchType && $matchStatut;
                    });
                    
                    echo json_encode(array_values($filtered));
                    break;
                    
                case 'POST':
                    // Générer le code de cargaison au format CARG-XXX
                    $data = json_decode(file_get_contents('php://input'), true);
                    
                    // Trouver le dernier numéro utilisé
                    $lastNumber = 0;
                    foreach ($cargaisons as $cargaison) {
                        if (preg_match('/CARG-(\d+)/', $cargaison['code'], $matches)) {
                            $number = intval($matches[1]);
                            if ($number > $lastNumber) {
                                $lastNumber = $number;
                            }
                        }
                    }
                    
                    // Générer le nouveau code
                    $nextNumber = $lastNumber + 1;
                    $data['code'] = sprintf('CARG-%03d', $nextNumber); // Format avec 3 chiffres
                    $data['dateCreation'] = date('Y-m-d H:i:s');
                    
                    $cargaisons[] = $data;
                    $db['cargaisons'] = $cargaisons;
                    file_put_contents($dbPath, json_encode($db, JSON_PRETTY_PRINT));
                    echo json_encode(['success' => true, 'data' => $data]);
                    break;
                    
                case 'PUT':
                    $data = json_decode(file_get_contents('php://input'), true);
                    $code = $data['code'] ?? null;
                    if (!$code) throw new Exception('Code required');
                    
                    $index = array_search($code, array_column($cargaisons, 'code'));
                    if ($index === false) throw new Exception('Cargaison not found');
                    
                    $cargaisons[$index] = array_merge($cargaisons[$index], $data);
                    $db['cargaisons'] = $cargaisons;
                    file_put_contents($dbPath, json_encode($db, JSON_PRETTY_PRINT));
                    echo json_encode(['success' => true, 'data' => $cargaisons[$index]]);
                    break;
                    
                default:
                    throw new Exception('Method not allowed');
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    /**
     * Gère les requêtes API pour les emails
     */
    public static function handleEmail() {
        header('Content-Type: application/json');
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            
            switch($method) {
                case 'POST':
                    $data = json_decode(file_get_contents('php://input'), true);
                    // Ajout logique envoi email
                    break;
                    
                default:
                    http_response_code(405);
                    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    }
}