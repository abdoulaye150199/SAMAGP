<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page non trouvée - YONIMA</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .error-container {
            text-align: center;
            background: #2D2D2D;
            border: 1px solid rgba(0, 212, 170, 0.2);
            border-radius: 20px;
            padding: 4rem 3rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            max-width: 500px;
        }
        
        .error-code {
            font-size: 6rem;
            font-weight: bold;
            color: #00D4AA;
            margin-bottom: 1rem;
        }
        
        .error-title {
            font-size: 2rem;
            color: white;
            margin-bottom: 1rem;
        }
        
        .error-message {
            color: #4DE6CD;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .error-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            background: linear-gradient(135deg, #00D4AA 0%, #4DE6CD 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .btn:hover {
            background: linear-gradient(135deg, #00A085 0%, #00D4AA 100%);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 212, 170, 0.3);
        }
        
        .btn-secondary {
            background: transparent;
            color: #00D4AA;
            border: 2px solid #00D4AA;
        }
        
        .btn-secondary:hover {
            background: #00D4AA;
            color: white;
        }
        
        .error-icon {
            font-size: 4rem;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">🚢</div>
        <div class="error-code">404</div>
        <h1 class="error-title">Page non trouvée</h1>
        <p class="error-message">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
            Vérifiez l'URL ou retournez à l'accueil.
        </p>
        <div class="error-actions">
            <a href="/" class="btn">Retour à l'accueil</a>
            <a href="/dashboard" class="btn btn-secondary">Dashboard</a>
        </div>
    </div>
</body>
</html>
