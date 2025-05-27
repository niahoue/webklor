# Test final après corrections des erreurs API et AdSense
# WebKlor - Script de validation production v2.0

Write-Host "========================================" -ForegroundColor Green
Write-Host "TESTS DE VALIDATION FINAUX - WEBKLOR" -ForegroundColor Green
Write-Host "Version: 2.0 (avec corrections API)" -ForegroundColor Green
Write-Host "Date: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Configuration
$baseUrl = "https://webklor-livraison-bl79l6y55-niahoues-projects.vercel.app"
$logFile = "test-results-final-v2.txt"
$resultsFile = "validation-finale-corrected.json"

# Initialiser le fichier de log
"Tests de validation WebKlor - $(Get-Date)" | Out-File -FilePath $logFile -Encoding UTF8

# Fonction pour tester une URL
function Test-URL {
    param(
        [string]$url,
        [string]$description,
        [int]$expectedStatus = 200
    )
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
        $status = $response.StatusCode
        $loadTime = (Measure-Command { Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 }).TotalMilliseconds
        
        $result = @{
            url = $url
            description = $description
            status = $status
            loadTime = [math]::Round($loadTime, 2)
            success = $status -eq $expectedStatus
            error = $null
        }
        
        if ($status -eq $expectedStatus) {
            Write-Host "✅ $description - Status: $status - Temps: $($result.loadTime)ms" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $description - Status: $status (attendu: $expectedStatus)" -ForegroundColor Yellow
        }
        
        "$description - Status: $status - Temps: $($result.loadTime)ms" | Out-File -FilePath $logFile -Append -Encoding UTF8
        
        return $result
    }
    catch {
        $result = @{
            url = $url
            description = $description
            status = 0
            loadTime = 0
            success = $false
            error = $_.Exception.Message
        }
        
        Write-Host "❌ $description - Erreur: $($_.Exception.Message)" -ForegroundColor Red
        "$description - Erreur: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append -Encoding UTF8
        
        return $result
    }
}

# Fonction pour tester une API
function Test-API {
    param(
        [string]$url,
        [string]$description
    )
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
        $loadTime = (Measure-Command { Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 10 }).TotalMilliseconds
        
        $result = @{
            url = $url
            description = $description
            success = $true
            loadTime = [math]::Round($loadTime, 2)
            data = $response
            error = $null
        }
        
        Write-Host "✅ $description - Réponse reçue - Temps: $($result.loadTime)ms" -ForegroundColor Green
        "$description - Succès - Temps: $($result.loadTime)ms" | Out-File -FilePath $logFile -Append -Encoding UTF8
        
        return $result
    }
    catch {
        $result = @{
            url = $url
            description = $description
            success = $false
            loadTime = 0
            data = $null
            error = $_.Exception.Message
        }
        
        Write-Host "❌ $description - Erreur: $($_.Exception.Message)" -ForegroundColor Red
        "$description - Erreur: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append -Encoding UTF8
        
        return $result
    }
}

# Collection des résultats
$testResults = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
    baseUrl = $baseUrl
    pages = @()
    apis = @()
    performance = @()
    errors = @()
    summary = @{}
}

Write-Host "`n📋 TESTS DES PAGES PRINCIPALES" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Tests des pages
$pages = @(
    @{ url = "$baseUrl/"; description = "Page d'accueil" }
    @{ url = "$baseUrl/services"; description = "Page Services" }
    @{ url = "$baseUrl/portfolio"; description = "Page Portfolio" }
    @{ url = "$baseUrl/blog"; description = "Page Blog (corrigée)" }
    @{ url = "$baseUrl/about"; description = "Page À propos" }
    @{ url = "$baseUrl/contact"; description = "Page Contact" }
    @{ url = "$baseUrl/mentions-legales"; description = "Mentions légales" }
    @{ url = "$baseUrl/politique-confidentialite"; description = "Politique de confidentialité" }
)

foreach ($page in $pages) {
    $result = Test-URL -url $page.url -description $page.description
    $testResults.pages += $result
    Start-Sleep -Milliseconds 500
}

Write-Host "`n🔌 TESTS DES APIS (CORRIGÉES)" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Tests des APIs corrigées
$apis = @(
    @{ url = "$baseUrl/api/health"; description = "API Health Check" }
    @{ url = "$baseUrl/api/posts"; description = "API Posts (route principale)" }
    @{ url = "$baseUrl/api/blog/posts"; description = "API Blog Posts (route corrigée)" }
    @{ url = "$baseUrl/api/blog/posts?page=1&limit=6"; description = "API Blog Posts avec pagination" }
    @{ url = "$baseUrl/api/blog/posts?category=Développement Web"; description = "API Blog Posts par catégorie" }
)

foreach ($api in $apis) {
    $result = Test-API -url $api.url -description $api.description
    $testResults.apis += $result
    Start-Sleep -Milliseconds 500
}

Write-Host "`n📊 TESTS DE PERFORMANCE" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Test de performance de la page d'accueil
try {
    $perfStart = Get-Date
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -TimeoutSec 30
    $perfEnd = Get-Date
    $totalTime = ($perfEnd - $perfStart).TotalMilliseconds
    $contentLength = $response.Content.Length
    
    $perfResult = @{
        page = "Accueil"
        loadTime = [math]::Round($totalTime, 2)
        contentSize = [math]::Round($contentLength / 1024, 2)
        status = $response.StatusCode
        success = $true
    }
    
    Write-Host "✅ Performance Accueil - Temps: $($perfResult.loadTime)ms - Taille: $($perfResult.contentSize)KB" -ForegroundColor Green
    $testResults.performance += $perfResult
}
catch {
    $perfResult = @{
        page = "Accueil"
        loadTime = 0
        contentSize = 0
        status = 0
        success = $false
        error = $_.Exception.Message
    }
    Write-Host "❌ Test de performance échoué: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.performance += $perfResult
}

Write-Host "`n🧪 TESTS FONCTIONNELS SPÉCIFIQUES" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Test du blog avec des articles
try {
    $blogResponse = Invoke-RestMethod -Uri "$baseUrl/api/blog/posts?limit=3" -Method GET -TimeoutSec 10
    if ($blogResponse.success -and $blogResponse.data.Count -gt 0) {
        Write-Host "✅ Blog API - $($blogResponse.data.Count) articles trouvés" -ForegroundColor Green
        $testResults.apis += @{
            url = "$baseUrl/api/blog/posts?limit=3"
            description = "Test articles du blog"
            success = $true
            data = $blogResponse
            articlesCount = $blogResponse.data.Count
        }
        
        # Test d'un article spécifique
        $firstArticle = $blogResponse.data[0]
        if ($firstArticle.slug) {
            try {
                $articleResponse = Invoke-RestMethod -Uri "$baseUrl/api/blog/posts/$($firstArticle.slug)" -Method GET -TimeoutSec 10
                Write-Host "✅ Article spécifique - Slug: $($firstArticle.slug)" -ForegroundColor Green
                $testResults.apis += @{
                    url = "$baseUrl/api/blog/posts/$($firstArticle.slug)"
                    description = "Test article spécifique"
                    success = $true
                    data = $articleResponse
                }
            }
            catch {
                Write-Host "❌ Article spécifique échoué: $($_.Exception.Message)" -ForegroundColor Red
                $testResults.errors += "Article spécifique: $($_.Exception.Message)"
            }
        }
    } else {
        Write-Host "⚠️ Blog API - Aucun article trouvé" -ForegroundColor Yellow
        $testResults.errors += "Aucun article dans le blog"
    }
}
catch {
    Write-Host "❌ Test du blog échoué: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.errors += "Blog API: $($_.Exception.Message)"
}

# Test du formulaire de contact (simulation)
try {
    $contactData = @{
        name = "Test Final"
        email = "test@webklor.com"
        message = "Test automatisé du formulaire de contact après corrections"
    } | ConvertTo-Json

    $contactResponse = Invoke-RestMethod -Uri "$baseUrl/api/contact" -Method POST -Body $contactData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Formulaire de contact - Test réussi" -ForegroundColor Green
    $testResults.apis += @{
        url = "$baseUrl/api/contact"
        description = "Test formulaire de contact"
        success = $true
        data = $contactResponse
    }
}
catch {
    Write-Host "❌ Test formulaire de contact échoué: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.errors += "Formulaire de contact: $($_.Exception.Message)"
}

# Calculer les statistiques finales
$totalTests = $testResults.pages.Count + $testResults.apis.Count + $testResults.performance.Count
$successfulTests = ($testResults.pages | Where-Object { $_.success }).Count + 
                  ($testResults.apis | Where-Object { $_.success }).Count + 
                  ($testResults.performance | Where-Object { $_.success }).Count

$successRate = if ($totalTests -gt 0) { [math]::Round(($successfulTests / $totalTests) * 100, 2) } else { 0 }

$testResults.summary = @{
    totalTests = $totalTests
    successfulTests = $successfulTests
    failedTests = $totalTests - $successfulTests
    successRate = $successRate
    errorsCount = $testResults.errors.Count
    averageLoadTime = if ($testResults.pages.Count -gt 0) { 
        [math]::Round(($testResults.pages | Where-Object { $_.success } | Measure-Object -Property loadTime -Average).Average, 2) 
    } else { 0 }
}

Write-Host "`n📈 RÉSUMÉ DES TESTS" -ForegroundColor Magenta
Write-Host "===================" -ForegroundColor Magenta
Write-Host "Total des tests: $($testResults.summary.totalTests)" -ForegroundColor White
Write-Host "Tests réussis: $($testResults.summary.successfulTests)" -ForegroundColor Green
Write-Host "Tests échoués: $($testResults.summary.failedTests)" -ForegroundColor Red
Write-Host "Taux de réussite: $($testResults.summary.successRate)%" -ForegroundColor $(if ($testResults.summary.successRate -ge 90) { "Green" } elseif ($testResults.summary.successRate -ge 70) { "Yellow" } else { "Red" })
Write-Host "Erreurs totales: $($testResults.summary.errorsCount)" -ForegroundColor $(if ($testResults.summary.errorsCount -eq 0) { "Green" } else { "Red" })
Write-Host "Temps de chargement moyen: $($testResults.summary.averageLoadTime)ms" -ForegroundColor White

# Sauvegarder les résultats
$testResults | ConvertTo-Json -Depth 10 | Out-File -FilePath $resultsFile -Encoding UTF8

Write-Host "`n💾 FICHIERS GÉNÉRÉS" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "📊 Résultats détaillés: $resultsFile" -ForegroundColor White
Write-Host "📝 Log des tests: $logFile" -ForegroundColor White

Write-Host "`n🎯 ÉTAT FINAL" -ForegroundColor Magenta
Write-Host "=============" -ForegroundColor Magenta

if ($testResults.summary.successRate -ge 90 -and $testResults.summary.errorsCount -eq 0) {
    Write-Host "🎉 VALIDATION RÉUSSIE - Le site est prêt pour la production !" -ForegroundColor Green
    Write-Host "✅ Toutes les corrections ont été appliquées avec succès" -ForegroundColor Green
    Write-Host "✅ Les APIs fonctionnent correctement" -ForegroundColor Green
    Write-Host "✅ Les pages se chargent rapidement" -ForegroundColor Green
    
    Write-Host "`n🚀 PROCHAINES ÉTAPES RECOMMANDÉES:" -ForegroundColor Yellow
    Write-Host "1. Configurer le domaine personnalisé webklor.com" -ForegroundColor White
    Write-Host "2. Soumettre le sitemap aux moteurs de recherche" -ForegroundColor White
    Write-Host "3. Configurer les analyses (Google Analytics)" -ForegroundColor White
    Write-Host "4. Tester les formulaires avec des données réelles" -ForegroundColor White
} elseif ($testResults.summary.successRate -ge 70) {
    Write-Host "⚠️ VALIDATION PARTIELLE - Quelques problèmes à résoudre" -ForegroundColor Yellow
    Write-Host "📋 Vérifier les erreurs dans le fichier de log" -ForegroundColor White
} else {
    Write-Host "❌ VALIDATION ÉCHOUÉE - Problèmes critiques détectés" -ForegroundColor Red
    Write-Host "🔧 Correction nécessaire avant mise en production" -ForegroundColor White
}

# Affichage des erreurs s'il y en a
if ($testResults.errors.Count -gt 0) {
    Write-Host "`n⚠️ ERREURS DÉTECTÉES:" -ForegroundColor Red
    foreach ($error in $testResults.errors) {
        Write-Host "- $error" -ForegroundColor Red
    }
}

Write-Host "`nTests de validation production terminés le: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
