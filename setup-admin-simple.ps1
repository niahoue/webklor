# Script simple pour créer un utilisateur administrateur en production
Write-Host "=== Configuration Administrateur WebKlor - Production ===" -ForegroundColor Cyan

$API_URL = "https://webklor-livraison-6jwfnrs45-niahoues-projects.vercel.app/api"

$adminData = @{
    email = "admin@webklor.com"
    username = "admin"
    password = "WebKlor2025!"
    isAdmin = $true
} | ConvertTo-Json

Write-Host "Creation de l'administrateur..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$API_URL/auth/register" -Method POST -Body $adminData -ContentType "application/json"
    Write-Host "✅ Administrateur cree avec succes !" -ForegroundColor Green
    Write-Host "Email: admin@webklor.com" -ForegroundColor White
    Write-Host "Mot de passe: WebKlor2025!" -ForegroundColor White
} catch {
    Write-Host "Info: L'administrateur existe peut-etre deja" -ForegroundColor Blue
}

Write-Host "`nTest de connexion..." -ForegroundColor Yellow

$loginData = @{
    email = "admin@webklor.com"
    password = "WebKlor2025!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Connexion administrateur reussie !" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur de connexion" -ForegroundColor Red
}

Write-Host "`n=== URLs ===" -ForegroundColor Cyan
Write-Host "Application: https://webklor-livraison-6jwfnrs45-niahoues-projects.vercel.app" -ForegroundColor White
Write-Host "Admin: https://webklor-livraison-6jwfnrs45-niahoues-projects.vercel.app/login" -ForegroundColor White
