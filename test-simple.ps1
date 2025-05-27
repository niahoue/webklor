# Test simple de production WebKlor

$baseUrl = "https://webklor-livraison-e9lusondk-niahoues-projects.vercel.app"

Write-Host "🧪 TESTS DE PRODUCTION WEBKLOR" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "URL testee: $baseUrl" -ForegroundColor White
Write-Host ""

# Test de la page d'accueil
Write-Host "🔍 Test: Page d'accueil" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Status: 200 OK" -ForegroundColor Green
        Write-Host "   📏 Taille: $($response.Content.Length) caracteres" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test du sitemap
Write-Host "🔍 Test: Sitemap XML" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Status: 200 OK" -ForegroundColor Green
        if ($response.Content -like "*webklor.com*") {
            Write-Host "   ✅ Contenu: Domaine webklor.com trouve" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test du robots.txt
Write-Host "🔍 Test: Robots.txt" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/robots.txt" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Status: 200 OK" -ForegroundColor Green
        if ($response.Content -like "*User-agent*") {
            Write-Host "   ✅ Contenu: Configuration robots valide" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 TESTS TERMINES !" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Liens de production:" -ForegroundColor Cyan
Write-Host "   • Site: $baseUrl" -ForegroundColor White
Write-Host "   • Sitemap: $baseUrl/sitemap.xml" -ForegroundColor White
Write-Host "   • Robots: $baseUrl/robots.txt" -ForegroundColor White

Write-Host ""
Write-Host "📋 Prochaines etapes:" -ForegroundColor Cyan
Write-Host "   1. Configurer le domaine webklor.com sur Vercel" -ForegroundColor White
Write-Host "   2. Soumettre le sitemap a Google Search Console" -ForegroundColor White
Write-Host "   3. Tester toutes les fonctionnalites manuellement" -ForegroundColor White
