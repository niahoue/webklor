# Script de test final WebKlor - Version Simplifiée
# Date: 27/05/2025

param(
    [string]$baseUrl = "https://webklor-livraison-bl79l6y55-niahoues-projects.vercel.app"
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "TESTS DE VALIDATION WEBKLOR - V4.0" -ForegroundColor Green
Write-Host "Date: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Green
Write-Host "URL: $baseUrl" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$successCount = 0
$totalCount = 0

# Fonction de test simple
function Test-SimpleURL {
    param([string]$url, [string]$name)
    
    $global:totalCount++
    Write-Host "`nTest: $name" -ForegroundColor Cyan
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        $request = [System.Net.WebRequest]::Create($url)
        $request.Timeout = 15000
        $request.Method = "GET"
        
        $response = $request.GetResponse()
        $statusCode = [int]$response.StatusCode
        $response.Close()
        
        if ($statusCode -eq 200) {
            Write-Host "✅ SUCCÈS (Status: $statusCode)" -ForegroundColor Green
            $global:successCount++
        } else {
            Write-Host "⚠️ ATTENTION (Status: $statusCode)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ ÉCHEC: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🏠 TESTS DES PAGES PRINCIPALES" -ForegroundColor Cyan
Write-Host "==============================="

# Tests des pages
Test-SimpleURL "$baseUrl/" "Page d'accueil"
Test-SimpleURL "$baseUrl/services" "Page Services"
Test-SimpleURL "$baseUrl/portfolio" "Page Portfolio"
Test-SimpleURL "$baseUrl/blog" "Page Blog"
Test-SimpleURL "$baseUrl/about" "Page À propos"
Test-SimpleURL "$baseUrl/contact" "Page Contact"

Write-Host "`n🔌 TESTS DES APIS" -ForegroundColor Cyan
Write-Host "=================="

# Tests des APIs
Test-SimpleURL "$baseUrl/api/health" "API Health"
Test-SimpleURL "$baseUrl/api/posts" "API Posts"
Test-SimpleURL "$baseUrl/api/blog/posts" "API Blog Posts (corrigée)"
Test-SimpleURL "$baseUrl/api/blog/posts?page=1`&limit=3" "API Blog avec pagination"

Write-Host "`n📋 RÉSUMÉ FINAL" -ForegroundColor Magenta
Write-Host "==============="

$successRate = [math]::Round(($successCount / $totalCount) * 100, 1)

Write-Host "Tests réussis: $successCount/$totalCount" -ForegroundColor White
Write-Host "Taux de réussite: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } else { "Yellow" })

if ($successRate -ge 80) {
    Write-Host "`n🎉 VALIDATION RÉUSSIE !" -ForegroundColor Green
    Write-Host "Le site WebKlor est fonctionnel et prêt" -ForegroundColor Green
} elseif ($successRate -ge 60) {
    Write-Host "`n⚠️ VALIDATION PARTIELLE" -ForegroundColor Yellow
    Write-Host "Quelques problèmes détectés mais le site fonctionne" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ PROBLÈMES DÉTECTÉS" -ForegroundColor Red
    Write-Host "Des corrections sont nécessaires" -ForegroundColor Red
}

Write-Host "`n🚀 PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "1. Tests manuels dans le navigateur" -ForegroundColor White
Write-Host "2. Configuration du domaine webklor.com" -ForegroundColor White
Write-Host "3. Optimisation SEO finale" -ForegroundColor White
Write-Host "4. Tests de performance approfondie" -ForegroundColor White

Write-Host "`nTests terminés: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
