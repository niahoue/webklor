#!/usr/bin/env pwsh

# Script de test d'intégration finale pour WebKlor
# Teste les fonctionnalités critiques avant déploiement
# Auteur: WebKlor Team

Write-Host "🧪 TESTS D'INTÉGRATION FINALE - WEBKLOR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$projectRoot = Get-Location
$testResults = @()

# Fonction pour enregistrer les résultats de test
function Add-TestResult {
    param(
        [string]$testName,
        [bool]$passed,
        [string]$details = ""
    )
    
    $script:testResults += [PSCustomObject]@{
        Test = $testName
        Passed = $passed
        Details = $details
    }
    
    $status = if ($passed) { "✅" } else { "❌" }
    Write-Host "$status $testName" -ForegroundColor $(if ($passed) { "Green" } else { "Red" })
    if ($details -and -not $passed) {
        Write-Host "   └─ $details" -ForegroundColor Yellow
    }
}

Write-Host "`n🔧 1. TESTS DE CONFIGURATION" -ForegroundColor Yellow

# Test 1: Vérification des ports
Write-Host "Test des ports disponibles..." -ForegroundColor Gray
try {
    $frontendPort = netstat -an | findstr ":4174"
    $backendPort = netstat -an | findstr ":5000"
    
    Add-TestResult "Port frontend (4174) disponible" ($frontendPort -eq $null) "Port peut être utilisé"
    Add-TestResult "Port backend (5000) disponible" ($backendPort -eq $null) "Port peut être utilisé"
}
catch {
    Add-TestResult "Vérification des ports" $false "Erreur lors de la vérification"
}

# Test 2: Vérification des variables d'environnement exemple
if (Test-Path ".env.example") {
    $envContent = Get-Content ".env.example" -Raw
    $requiredVars = @("MONGODB_URI", "JWT_SECRET", "EMAIL_SERVICE", "PORT", "NODE_ENV")
    
    foreach ($var in $requiredVars) {
        $found = $envContent -match $var
        Add-TestResult "Variable $var dans .env.example" $found
    }
} else {
    Add-TestResult "Fichier .env.example" $false "Fichier manquant"
}

Write-Host "`n📦 2. TESTS DE BUILD ET ASSETS" -ForegroundColor Yellow

# Test 3: Vérification du build
if (Test-Path "dist") {
    # Vérifier les fichiers essentiels
    $indexHtml = Test-Path "dist/index.html"
    Add-TestResult "index.html généré" $indexHtml
    
    # Vérifier les assets
    $cssFiles = Get-ChildItem "dist/assets/*.css" -ErrorAction SilentlyContinue
    $jsFiles = Get-ChildItem "dist/assets/*.js" -ErrorAction SilentlyContinue
    
    Add-TestResult "Fichiers CSS présents" ($cssFiles.Count -gt 0) "$($cssFiles.Count) fichiers trouvés"
    Add-TestResult "Fichiers JS présents" ($jsFiles.Count -gt 0) "$($jsFiles.Count) fichiers trouvés"
    
    # Vérifier les images
    $imageFiles = Get-ChildItem "dist/assets/images/*" -ErrorAction SilentlyContinue
    Add-TestResult "Images copiées" ($imageFiles.Count -gt 0) "$($imageFiles.Count) images trouvées"
    
    # Vérifier la taille du bundle principal
    $mainJsFile = Get-ChildItem "dist/assets/index-*.js" | Sort-Object Length -Descending | Select-Object -First 1
    if ($mainJsFile) {
        $sizeKB = [math]::Round($mainJsFile.Length / 1KB, 2)
        $sizeOK = $sizeKB -lt 1000  # Moins de 1MB
        Add-TestResult "Taille du bundle principal acceptable" $sizeOK "$sizeKB KB"
    }
} else {
    Add-TestResult "Dossier dist existant" $false "Lancez 'npm run build' d'abord"
}

Write-Host "`n🌐 3. TESTS DE SERVEUR" -ForegroundColor Yellow

# Test 4: Tester le serveur de preview
Write-Host "Démarrage du serveur de preview..." -ForegroundColor Gray
try {
    # Démarrer le serveur en arrière-plan
    $previewJob = Start-Job -ScriptBlock {
        Set-Location $args[0]
        npm run preview
    } -ArgumentList $projectRoot
    
    Start-Sleep -Seconds 5
    
    # Tester la connexion
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4174" -TimeoutSec 10 -ErrorAction Stop
        Add-TestResult "Serveur de preview répond" ($response.StatusCode -eq 200) "Code: $($response.StatusCode)"
        
        # Vérifier le contenu HTML
        $hasReactRoot = $response.Content -match 'id="root"'
        Add-TestResult "Élément root React présent" $hasReactRoot
        
        $hasTitle = $response.Content -match "WebKlor"
        Add-TestResult "Titre de page correct" $hasTitle
    }
    catch {
        Add-TestResult "Connexion au serveur" $false "Impossible de se connecter"
    }
    finally {
        # Arrêter le serveur
        Stop-Job $previewJob -ErrorAction SilentlyContinue
        Remove-Job $previewJob -ErrorAction SilentlyContinue
    }
}
catch {
    Add-TestResult "Démarrage serveur preview" $false "Erreur: $($_.Exception.Message)"
}

Write-Host "`n📱 4. TESTS DE ROUTES PRINCIPALES" -ForegroundColor Yellow

# Test 5: Vérifier les routes dans App.jsx
if (Test-Path "src/App.jsx") {
    $appContent = Get-Content "src/App.jsx" -Raw
    
    $mainRoutes = @(
        '/a-propos',
        '/services',
        '/portfolio',
        '/blog',
        '/contact',
        '/mentions-legales',
        '/politique-confidentialite'
    )
    
    foreach ($route in $mainRoutes) {
        $routeExists = $appContent -match [regex]::Escape($route)
        Add-TestResult "Route $route configurée" $routeExists
    }
    
    # Vérifier les routes admin
    $adminRoutes = @('/admin', '/admin/blog', '/admin/users')
    foreach ($route in $adminRoutes) {
        $routeExists = $appContent -match [regex]::Escape($route)
        Add-TestResult "Route admin $route configurée" $routeExists
    }
}

Write-Host "`n🔒 5. TESTS DE SÉCURITÉ" -ForegroundColor Yellow

# Test 6: Vérifier les fichiers sensibles
$sensitiveFiles = @('.env', 'server/.env', '.env.local', '.env.production')
foreach ($file in $sensitiveFiles) {
    $exists = Test-Path $file
    if ($exists) {
        # Vérifier si dans .gitignore
        if (Test-Path '.gitignore') {
            $gitignore = Get-Content '.gitignore' -Raw
            $ignored = $gitignore -match [regex]::Escape((Split-Path $file -Leaf))
            Add-TestResult "Fichier $file ignoré par Git" $ignored "Présent mais dans .gitignore"
        } else {
            Add-TestResult "Fichier sensible $file" $false "Présent et .gitignore manquant"
        }
    }
}

# Test 7: Vérifier les dépendances de sécurité
Write-Host "Audit de sécurité npm..." -ForegroundColor Gray
try {
    $auditOutput = npm audit --audit-level=high --json 2>$null | ConvertFrom-Json
    if ($auditOutput.metadata.vulnerabilities.high -eq 0) {
        Add-TestResult "Audit sécurité npm (high)" $true "Aucune vulnérabilité critique"
    } else {
        Add-TestResult "Audit sécurité npm (high)" $false "$($auditOutput.metadata.vulnerabilities.high) vulnérabilités critiques"
    }
}
catch {
    Add-TestResult "Audit npm" $false "Impossible d'exécuter l'audit"
}

Write-Host "`n📋 6. TESTS DE DÉPLOIEMENT" -ForegroundColor Yellow

# Test 8: Vérifier les fichiers de configuration de déploiement
$deployFiles = @(
    'DEPLOYMENT.md',
    'docker-compose.yml',
    'Dockerfile',
    'vercel.json',
    'public/_redirects'
)

foreach ($file in $deployFiles) {
    $exists = Test-Path $file
    Add-TestResult "Fichier de déploiement $file" $exists
}

# Test 9: Vérifier le package.json pour les scripts
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $scripts = $packageJson.scripts
    
    $requiredScripts = @('dev', 'build', 'preview')
    foreach ($script in $requiredScripts) {
        $exists = $scripts.$script -ne $null
        Add-TestResult "Script npm '$script'" $exists
    }
}

Write-Host "`n📊 RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Passed }).Count
$failedTests = $totalTests - $passedTests

Write-Host "Total des tests: $totalTests" -ForegroundColor White
Write-Host "Réussis: $passedTests" -ForegroundColor Green
Write-Host "Échecs: $failedTests" -ForegroundColor Red
Write-Host "Taux de réussite: $([math]::Round(($passedTests / $totalTests) * 100, 1))%" -ForegroundColor $(if ($failedTests -eq 0) { "Green" } else { "Yellow" })

if ($failedTests -eq 0) {
    Write-Host "`n🎉 TOUS LES TESTS SONT RÉUSSIS!" -ForegroundColor Green
    Write-Host "L'application est prête pour le déploiement en production." -ForegroundColor Green
    Write-Host "`nProchaines étapes recommandées:" -ForegroundColor Cyan
    Write-Host "1. Configurer les variables d'environnement de production" -ForegroundColor White
    Write-Host "2. Déployer sur la plateforme choisie (Vercel, Netlify, etc.)" -ForegroundColor White
    Write-Host "3. Configurer le domaine personnalisé" -ForegroundColor White
    Write-Host "4. Mettre en place le monitoring" -ForegroundColor White
    exit 0
} else {
    Write-Host "`n⚠️  CERTAINS TESTS ONT ÉCHOUÉ" -ForegroundColor Yellow
    Write-Host "Corrigez les problèmes avant de déployer en production." -ForegroundColor Yellow
    
    Write-Host "`nTests échoués:" -ForegroundColor Red
    $testResults | Where-Object { -not $_.Passed } | ForEach-Object {
        Write-Host "❌ $($_.Test)" -ForegroundColor Red
        if ($_.Details) {
            Write-Host "   └─ $($_.Details)" -ForegroundColor Yellow
        }
    }
    exit 1
}
