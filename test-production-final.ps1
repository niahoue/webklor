# Script de test final pour WebKlor en production
# Vérifie que tous les composants fonctionnent correctement

param(
    [string]$Domain = "webklor-livraison-e9lusondk-niahoues-projects.vercel.app",
    [switch]$UseCustomDomain
)

$baseUrl = if ($UseCustomDomain) { "https://webklor.com" } else { "https://$Domain" }

Write-Host "🧪 TESTS DE PRODUCTION WEBKLOR" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "URL testée: $baseUrl" -ForegroundColor White
Write-Host ""

# Fonction pour tester une URL
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description,
        [string]$ExpectedContent = $null
    )
    
    Write-Host "🔍 Test: $Description" -ForegroundColor Cyan
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 10 -ErrorAction Stop
          if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Status: $($response.StatusCode) OK" -ForegroundColor Green
            
            if ($ExpectedContent -and $response.Content -like "*$ExpectedContent*") {
                Write-Host "   ✅ Contenu: Trouvé '$ExpectedContent'" -ForegroundColor Green
            } elseif ($ExpectedContent) {
                Write-Host "   ⚠️  Contenu: '$ExpectedContent' non trouvé" -ForegroundColor Yellow
            }
            
            $contentLength = if ($response.Content) { $response.Content.Length } else { 0 }
            Write-Host "   📏 Taille: $contentLength caractères" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "   ❌ Status: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    Write-Host ""
}

# Fonction pour tester l'API
function Test-ApiEndpoint {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "🔍 Test API: $Description" -ForegroundColor Cyan
    Write-Host "   URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 10 -ErrorAction Stop
        Write-Host "   ✅ API: Réponse JSON reçue" -ForegroundColor Green
        
        if ($response.status) {
            Write-Host "   ✅ Status: $($response.status)" -ForegroundColor Green
        }
        if ($response.message) {
            Write-Host "   📝 Message: $($response.message)" -ForegroundColor Gray        }
        return $true
    }
    catch {
        Write-Host "   ❌ Erreur API: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    Write-Host ""
}

$testResults = @()

# Tests Frontend
Write-Host "🎨 TESTS FRONTEND" -ForegroundColor Magenta
Write-Host "=================" -ForegroundColor Cyan

$testResults += Test-Endpoint "$baseUrl" "Page d'accueil" "WebKlor"
$testResults += Test-Endpoint "$baseUrl/about" "Page À propos" "équipe"
$testResults += Test-Endpoint "$baseUrl/services" "Page Services" "développement"
$testResults += Test-Endpoint "$baseUrl/portfolio" "Page Portfolio" "projets"
$testResults += Test-Endpoint "$baseUrl/blog" "Page Blog" "articles"
$testResults += Test-Endpoint "$baseUrl/contact" "Page Contact" "contact"

# Tests SEO
Write-Host "🔍 TESTS SEO" -ForegroundColor Magenta
Write-Host "============" -ForegroundColor Cyan

$testResults += Test-Endpoint "$baseUrl/sitemap.xml" "Sitemap XML" "webklor.com"
$testResults += Test-Endpoint "$baseUrl/robots.txt" "Robots.txt" "User-agent"

# Tests API (peuvent échouer si authentification requise)
Write-Host "🚀 TESTS API" -ForegroundColor Magenta
Write-Host "============" -ForegroundColor Cyan

$testResults += Test-ApiEndpoint "$baseUrl/api" "API Root"
$testResults += Test-ApiEndpoint "$baseUrl/api/health" "Health Check"

# Résumé des tests
Write-Host "📊 RÉSUMÉ DES TESTS" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Cyan

$successCount = ($testResults | Where-Object { $_ -eq $true }).Count
$totalCount = $testResults.Count
$successRate = if ($totalCount -gt 0) { [math]::Round(($successCount / $totalCount) * 100, 1) } else { 0 }

Write-Host "Tests réussis: $successCount/$totalCount ($successRate%)" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

if ($successRate -ge 80) {
    Write-Host ""
    Write-Host "🎉 EXCELLENT ! L'application fonctionne correctement" -ForegroundColor Green
    Write-Host "✅ WebKlor est prêt pour la production" -ForegroundColor Green
} elseif ($successRate -ge 60) {
    Write-Host ""
    Write-Host "⚠️  ATTENTION : Quelques problèmes détectés" -ForegroundColor Yellow
    Write-Host "🔧 Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ PROBLEMES CRITIQUES detectes" -ForegroundColor Red
    Write-Host "🚨 L'application necessite des corrections" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔗 Liens de production:" -ForegroundColor Cyan
Write-Host "   • Site: $baseUrl" -ForegroundColor White
Write-Host "   • Sitemap: $baseUrl/sitemap.xml" -ForegroundColor White
Write-Host "   • API Health: $baseUrl/api/health" -ForegroundColor White

Write-Host ""
Write-Host "📋 Prochaines étapes si tout fonctionne:" -ForegroundColor Cyan
Write-Host "   1. Configurer le domaine webklor.com" -ForegroundColor White
Write-Host "   2. Soumettre le sitemap à Google Search Console" -ForegroundColor White
Write-Host "   3. Configurer Google Analytics" -ForegroundColor White
Write-Host "   4. Effectuer des tests utilisateur complets" -ForegroundColor White
