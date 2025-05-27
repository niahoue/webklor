# Test de validation finale de WebKlor
# Encodage: UTF-8

Write-Host "========================================" -ForegroundColor Green
Write-Host "  TESTS DE VALIDATION WEBKLOR FINAL   " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$baseUrl = "https://webklor-livraison-95tni6v12-niahoues-projects.vercel.app"
$testResults = @()

function Test-Endpoint {
    param(
        [string]$url,
        [string]$description,
        [string]$method = "GET"
    )
    
    try {
        Write-Host "Test: $description" -ForegroundColor Cyan
        Write-Host "URL: $url" -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri $url -Method $method -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] Status: $($response.StatusCode)" -ForegroundColor Green
            $testResults += @{ Test = $description; Status = "PASS"; Details = "Status $($response.StatusCode)" }
            return $true
        } else {
            Write-Host "[WARN] Status: $($response.StatusCode)" -ForegroundColor Yellow
            $testResults += @{ Test = $description; Status = "WARN"; Details = "Status $($response.StatusCode)" }
            return $false
        }
    }
    catch {
        Write-Host "[FAIL] Erreur: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += @{ Test = $description; Status = "FAIL"; Details = $_.Exception.Message }
        return $false
    }
    
    Write-Host ""
}

function Test-FileExists {
    param(
        [string]$url,
        [string]$description
    )
    
    try {
        Write-Host "Test: $description" -ForegroundColor Cyan
        Write-Host "URL: $url" -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri $url -Method HEAD -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] Fichier accessible" -ForegroundColor Green
            $testResults += @{ Test = $description; Status = "PASS"; Details = "Fichier accessible" }
            return $true
        }
    }
    catch {
        Write-Host "[FAIL] Fichier inaccessible: $($_.Exception.Message)" -ForegroundColor Red
        $testResults += @{ Test = $description; Status = "FAIL"; Details = "Fichier inaccessible" }
        return $false
    }
    
    Write-Host ""
}

# Tests des pages principales
Write-Host "=== TESTS DES PAGES PRINCIPALES ===" -ForegroundColor Yellow
Test-Endpoint "$baseUrl" "Page d'accueil"
Test-Endpoint "$baseUrl/blog" "Page du blog"
Test-Endpoint "$baseUrl/contact" "Page de contact"
Test-Endpoint "$baseUrl/about" "Page a propos"

# Tests des fichiers SEO
Write-Host "=== TESTS SEO ===" -ForegroundColor Yellow
Test-FileExists "$baseUrl/sitemap.xml" "Sitemap XML"
Test-FileExists "$baseUrl/robots.txt" "Robots.txt"

# Tests des API endpoints (si accessibles)
Write-Host "=== TESTS API ===" -ForegroundColor Yellow
Test-Endpoint "$baseUrl/api/health" "API Health Check"

# Test des assets statiques
Write-Host "=== TESTS ASSETS ===" -ForegroundColor Yellow
Test-FileExists "$baseUrl/favicon.ico" "Favicon"

# Résumé des résultats
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "           RESUME DES TESTS            " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$warnCount = ($testResults | Where-Object { $_.Status -eq "WARN" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalTests = $testResults.Count

Write-Host ""
Write-Host "Total des tests: $totalTests" -ForegroundColor White
Write-Host "Reussis: $passCount" -ForegroundColor Green
Write-Host "Avertissements: $warnCount" -ForegroundColor Yellow
Write-Host "Echecs: $failCount" -ForegroundColor Red

$successRate = [math]::Round(($passCount / $totalTests) * 100, 1)
Write-Host "Taux de reussite: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

Write-Host ""
if ($successRate -ge 80) {
    Write-Host "Excellent! L'application est prete pour la production" -ForegroundColor Green
} elseif ($successRate -ge 60) {
    Write-Host "Bien. Quelques corrections mineures recommandees" -ForegroundColor Yellow
} else {
    Write-Host "Attention! L'application necessite des corrections" -ForegroundColor Red
}

Write-Host ""
Write-Host "Tests termines le: $(Get-Date)" -ForegroundColor Gray
