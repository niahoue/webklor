# Script pour créer un utilisateur administrateur en production
# WebKlor - Administration Setup

Write-Host "=== Configuration de l'administrateur WebKlor - Production ===" -ForegroundColor Cyan
Write-Host ""

# URL de l'API en production
$API_URL = "https://webklor-livraison-r7c3bacfk-niahoues-projects.vercel.app/api"

# Informations administrateur
$adminData = @{
    email = "admin@webklor.com"
    username = "admin"
    password = "WebKlor2025!"
    isAdmin = $true
} | ConvertTo-Json

Write-Host "Création de l'utilisateur administrateur..." -ForegroundColor Yellow

try {
    # Tenter de créer l'administrateur
    $response = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $adminData -ContentType "application/json"
    
    Write-Host "✅ Administrateur créé avec succès !" -ForegroundColor Green
    Write-Host "Email: admin@webklor.com" -ForegroundColor White
    Write-Host "Mot de passe: WebKlor2025!" -ForegroundColor White
    Write-Host "⚠️  Changez ce mot de passe après la première connexion !" -ForegroundColor Yellow
    
    # Test de connexion
    Write-Host "`nTest de connexion..." -ForegroundColor Yellow
    
    $loginData = @{
        email = "admin@webklor.com"
        password = "WebKlor2025!"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    
    Write-Host "✅ Connexion administrateur réussie !" -ForegroundColor Green
    Write-Host "Token généré avec succès" -ForegroundColor White
    
} catch {
    $errorMessage = $_.Exception.Message
    
    if ($errorMessage -like "*already exists*" -or $errorMessage -like "*duplicate*") {
        Write-Host "ℹ️  L'administrateur existe déjà" -ForegroundColor Blue
        
        # Test de connexion avec les identifiants existants
        Write-Host "`nTest de connexion..." -ForegroundColor Yellow
        
        try {
            $loginData = @{
                email = "admin@webklor.com"
                password = "WebKlor2025!"
            } | ConvertTo-Json
            
            $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $loginData -ContentType "application/json"
            Write-Host "✅ Connexion administrateur réussie !" -ForegroundColor Green
        } catch {
            Write-Host "❌ Erreur de connexion. Vérifiez les identifiants." -ForegroundColor Red
            Write-Host "Vous pouvez réinitialiser via l'interface web." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Erreur lors de la création: $errorMessage" -ForegroundColor Red
    }
}

Write-Host "`n=== Configuration terminée ===" -ForegroundColor Cyan
Write-Host "URL de l'application: https://webklor-livraison-r7c3bacfk-niahoues-projects.vercel.app" -ForegroundColor White
Write-Host "URL admin: https://webklor-livraison-r7c3bacfk-niahoues-projects.vercel.app/login" -ForegroundColor White