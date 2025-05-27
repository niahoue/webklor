#!/usr/bin/env pwsh

# Script de validation pré-déploiement pour WebKlor
# Auteur: WebKlor Team
# Date: 27 mai 2025

Write-Host "🔍 VALIDATION PRÉ-DÉPLOIEMENT WEBKLOR" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Variables
$projectRoot = Get-Location
$errors = @()
$warnings = @()

# Fonction pour afficher les résultats
function Show-Result {
    param(
        [string]$test,
        [bool]$passed,
        [string]$message = ""
    )
    
    if ($passed) {
        Write-Host "OK $test" -ForegroundColor Green
    } else {
        Write-Host "ERREUR $test" -ForegroundColor Red
        if ($message) {
            Write-Host "   --> $message" -ForegroundColor Yellow
        }
    }
}
}

Write-Host "`n📋 1. VÉRIFICATION DES FICHIERS ESSENTIELS" -ForegroundColor Yellow

# Vérifier les fichiers critiques
$criticalFiles = @(
    "package.json",
    "index.html",
    "vite.config.js",
    "src/main.jsx",
    "src/App.jsx",
    "server/server.js",
    "server/package.json"
)

foreach ($file in $criticalFiles) {
    $exists = Test-Path $file
    Show-Result "Fichier $file" $exists
    if (-not $exists) {
        $errors += "Fichier manquant: $file"
    }
}

Write-Host "`n🔧 2. VÉRIFICATION DES DÉPENDANCES" -ForegroundColor Yellow

# Vérifier package.json frontend
if (Test-Path "package.json") {
    try {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $hasReact = $packageJson.dependencies.react -ne $null
        $hasVite = $packageJson.devDependencies.vite -ne $null
        
        Show-Result "React installé" $hasReact
        Show-Result "Vite configuré" $hasVite
        
        if (-not $hasReact) { $errors += "React non trouvé dans les dépendances" }
        if (-not $hasVite) { $errors += "Vite non trouvé dans les devDependencies" }
    }
    catch {
        Show-Result "Lecture package.json" $false "Format JSON invalide"
        $errors += "package.json invalide"
    }
}

# Vérifier package.json backend
if (Test-Path "server/package.json") {
    try {
        $serverPackageJson = Get-Content "server/package.json" | ConvertFrom-Json
        $hasExpress = $serverPackageJson.dependencies.express -ne $null
        $hasMongoose = $serverPackageJson.dependencies.mongoose -ne $null
        
        Show-Result "Express installé (backend)" $hasExpress
        Show-Result "Mongoose installé (backend)" $hasMongoose
        
        if (-not $hasExpress) { $errors += "Express non trouvé dans server/package.json" }
        if (-not $hasMongoose) { $errors += "Mongoose non trouvé dans server/package.json" }
    }
    catch {
        Show-Result "Lecture server/package.json" $false "Format JSON invalide"
        $errors += "server/package.json invalide"
    }
}

Write-Host "`n🌐 3. VÉRIFICATION DE LA CONFIGURATION" -ForegroundColor Yellow

# Vérifier .env.example
$envExampleExists = Test-Path ".env.example"
Show-Result "Fichier .env.example" $envExampleExists

if ($envExampleExists) {
    $envContent = Get-Content ".env.example" -Raw
    $hasMongoUri = $envContent -match "MONGODB_URI"
    $hasJwtSecret = $envContent -match "JWT_SECRET"
    $hasEmailConfig = $envContent -match "EMAIL_SERVICE"
    
    Show-Result "Configuration MongoDB" $hasMongoUri
    Show-Result "Configuration JWT" $hasJwtSecret
    Show-Result "Configuration Email" $hasEmailConfig
} else {
    $warnings += "Fichier .env.example manquant"
}

# Vérifier vite.config.js
if (Test-Path "vite.config.js") {
    $viteConfig = Get-Content "vite.config.js" -Raw
    $hasReactPlugin = $viteConfig -match "@vitejs/plugin-react"
    Show-Result "Plugin React dans Vite" $hasReactPlugin
    
    if (-not $hasReactPlugin) {
        $warnings += "Plugin React non configuré dans Vite"
    }
}

Write-Host "`n📁 4. VÉRIFICATION DE LA STRUCTURE" -ForegroundColor Yellow

# Vérifier la structure des dossiers
$requiredDirs = @(
    "src",
    "src/components",
    "src/pages",
    "src/utils",
    "server",
    "server/models",
    "server/routes",
    "server/controllers",
    "public"
)

foreach ($dir in $requiredDirs) {
    $exists = Test-Path $dir -PathType Container
    Show-Result "Dossier $dir" $exists
    if (-not $exists) {
        $errors += "Dossier manquant: $dir"
    }
}

Write-Host "`n🔨 5. TEST DE BUILD" -ForegroundColor Yellow

# Tester le build
Write-Host "Construction du projet..." -ForegroundColor Gray
try {
    $buildOutput = npm run build 2>&1
    $buildSuccess = $LASTEXITCODE -eq 0
    Show-Result "Build de production" $buildSuccess
    
    if ($buildSuccess) {
        $distExists = Test-Path "dist"
        Show-Result "Dossier dist généré" $distExists
        
        if ($distExists) {
            $indexExists = Test-Path "dist/index.html"
            Show-Result "index.html généré" $indexExists
            
            # Vérifier la taille des fichiers
            $cssFiles = Get-ChildItem "dist/assets/*.css" -ErrorAction SilentlyContinue
            $jsFiles = Get-ChildItem "dist/assets/*.js" -ErrorAction SilentlyContinue
            
            Show-Result "Fichiers CSS générés" ($cssFiles.Count -gt 0)
            Show-Result "Fichiers JS générés" ($jsFiles.Count -gt 0)
        }
    } else {
        $errors += "Échec du build de production"
    }
}
catch {
    Show-Result "Build de production" $false "Erreur lors du build"
    $errors += "Erreur lors du build: $($_.Exception.Message)"
}

Write-Host "`n🔍 6. VÉRIFICATION DE SÉCURITÉ" -ForegroundColor Yellow

# Vérifier .gitignore
if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    $ignoresNodeModules = $gitignoreContent -match "node_modules"
    $ignoresEnv = $gitignoreContent -match "\.env"
    $ignoresDist = $gitignoreContent -match "dist"
    
    Show-Result ".gitignore ignore node_modules" $ignoresNodeModules
    Show-Result ".gitignore ignore .env" $ignoresEnv
    Show-Result ".gitignore ignore dist" $ignoresDist
} else {
    $warnings += "Fichier .gitignore manquant"
}

# Vérifier qu'aucun fichier sensible n'est committé
$sensitiveFiles = @(".env", "server/.env", ".env.local", ".env.production")
foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        $warnings += "Fichier sensible detecte: $file (verifiez qu'il est dans .gitignore)"
    }
}

Write-Host "`n📊 RÉSULTATS DE LA VALIDATION" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "VALIDATION REUSSIE!" -ForegroundColor Green
    Write-Host "Le projet est pret pour le deploiement en production." -ForegroundColor Green
    exit 0
} else {
    if ($errors.Count -gt 0) {
        Write-Host "`nERREURS CRITIQUES ($($errors.Count)):" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "   • $error" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "`nAVERTISSEMENTS ($($warnings.Count)):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   • $warning" -ForegroundColor Yellow
        }
    }
    
    if ($errors.Count -gt 0) {
        Write-Host "`nVALIDATION ECHOUEE" -ForegroundColor Red
        Write-Host "Corrigez les erreurs avant de deployer en production." -ForegroundColor Red
        exit 1
    } else {
        Write-Host "`nVALIDATION REUSSIE AVEC AVERTISSEMENTS" -ForegroundColor Yellow
        Write-Host "Le deploiement peut continuer, mais considerez les avertissements." -ForegroundColor Yellow
        exit 0
    }
}
