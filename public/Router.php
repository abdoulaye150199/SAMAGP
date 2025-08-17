<?php

class Router {
    private $routes = [];
    private $beforeRoutes = [];
    private $errorHandler;

    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }

    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }

    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }

    public function before($method, $path, $handler) {
        if (!isset($this->beforeRoutes[$method])) {
            $this->beforeRoutes[$method] = [];
        }
        $this->beforeRoutes[$method][] = [
            'pattern' => $this->convertPathToRegex($path),
            'handler' => $handler
        ];
    }

    private function addRoute($method, $path, $handler) {
        if (!isset($this->routes[$method])) {
            $this->routes[$method] = [];
        }
        $this->routes[$method][] = [
            'pattern' => $this->convertPathToRegex($path),
            'handler' => $handler
        ];
    }

    private function convertPathToRegex($path) {
        if (strpos($path, '*') !== false) {
            return '#^' . str_replace('*', '.*', $path) . '$#';
        }
        return '#^' . $path . '$#';
    }

    public function setErrorHandler($handler) {
        $this->errorHandler = $handler;
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Exécuter les middlewares before correspondants
        if (isset($this->beforeRoutes[$method])) {
            foreach ($this->beforeRoutes[$method] as $beforeRoute) {
                if (preg_match($beforeRoute['pattern'], $path)) {
                    if (is_callable($beforeRoute['handler'])) {
                        call_user_func($beforeRoute['handler']);
                    } else if (is_string($beforeRoute['handler']) && function_exists($beforeRoute['handler'])) {
                        call_user_func($beforeRoute['handler']);
                    }
                }
            }
        }

        // Chercher une route correspondante
        if (isset($this->routes[$method])) {
            foreach ($this->routes[$method] as $route) {
                if (preg_match($route['pattern'], $path)) {
                    if (is_callable($route['handler'])) {
                        call_user_func($route['handler']);
                        return;
                    } else if (is_string($route['handler'])) {
                        $viewPath = __DIR__ . '/../src/views/pages/' . $route['handler'] . '.php';
                        if (file_exists($viewPath)) {
                            include $viewPath;
                            return;
                        }
                    }
                }
            }
        }

        // Si aucune route ne correspond, appeler le gestionnaire d'erreur
        if ($this->errorHandler) {
            call_user_func($this->errorHandler, $this);
        } else {
            header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
            echo '404 Not Found';
        }
    }
}

?>
