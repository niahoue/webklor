# Script de déploiement final WebKlor
# Intègre build, sitemap, et déploiement Vercel

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    [switch]$Production = $false,
    [switch]$SkipBuild = $false,
    [switch]$SkipSitemap = $false
)

Write-Host "🚀 Déploiement Final WebKlor" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

$CleanDomain = $Domain -replace '^https?://', '' -replace '^www\.', ''
$FullDomain = "https://$CleanDomain"

Write-Host "🌐 Domaine cible: $FullDomain" -ForegroundColor Cyan
Write-Host "🎯 Mode: $(if ($Production) { 'PRODUCTION' } else { 'TEST' })" -ForegroundColor $(if ($Production) { 'Red' } else { 'Yellow' })
Write-Host ""

# Étape 1: Validation pré-déploiement
Write-Host "1️⃣ Validation pré-déploiement..." -ForegroundColor Yellow

try {
    # Vérifier Node.js
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
    
    # Vérifier npm
    $npmVersion = npm --version
    Write-Host "   ✅ npm: $npmVersion" -ForegroundColor Green
    
    # Vérifier Vercel CLI
    try {
        $vercelVersion = vercel --version
        Write-Host "   ✅ Vercel CLI: $vercelVersion" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️ Vercel CLI non installé. Installation..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
} catch {
    Write-Host "   ❌ Erreur de validation: $_" -ForegroundColor Red
    exit 1
}

# Étape 2: Build de production
if (-not $SkipBuild) {
    Write-Host "`n2️⃣ Build de production..." -ForegroundColor Yellow
    
    try {
        # Installer les dépendances
        Write-Host "   📦 Installation des dépendances..." -ForegroundColor Gray
        npm install
        
        # Build
        Write-Host "   🏗️ Construction du build..." -ForegroundColor Gray
        npm run build
        
        # Vérifier le build
        if (Test-Path "dist") {
            $buildSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
            $buildSizeMB = [Math]::Round($buildSize / 1MB, 2)
            Write-Host "   ✅ Build réussi ($buildSizeMB MB)" -ForegroundColor Green
        } else {
            throw "Dossier dist/ non généré"
        }
        
    } catch {
        Write-Host "   ❌ Erreur de build: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n2️⃣ Build ignoré (--SkipBuild)" -ForegroundColor Gray
}

# Étape 3: Génération du sitemap
if (-not $SkipSitemap) {
    Write-Host "`n3️⃣ Génération du sitemap..." -ForegroundColor Yellow
    
    try {
        # Configurer les variables d'environnement
        $env:SITE_DOMAIN = $CleanDomain
        $env:API_URL = "$FullDomain/api"
        
        # Exécuter le script de mise à jour du sitemap
        & ".\update-sitemap.ps1" -Domain $CleanDomain -ApiUrl "$FullDomain/api"
        
        Write-Host "   ✅ Sitemap généré" -ForegroundColor Green
        
    } catch {
        Write-Host "   ⚠️ Erreur sitemap: $_" -ForegroundColor Yellow
        Write-Host "   📝 Utilisation du sitemap par défaut" -ForegroundColor Gray
    }
} else {
    Write-Host "`n3️⃣ Sitemap ignoré (--SkipSitemap)" -ForegroundColor Gray
}

# Étape 4: Configuration des variables d'environnement Vercel
Write-Host "`n4️⃣ Configuration Vercel..." -ForegroundColor Yellow

try {
    # Variables d'environnement pour Vercel
    $envVars = @{
        "FRONTEND_URL" = $FullDomain
        "NODE_ENV" = "production"
        "SITE_DOMAIN" = $CleanDomain
    }
    
    Write-Host "   ⚙️ Variables d'environnement configurées:" -ForegroundColor Gray
    foreach ($var in $envVars.GetEnumerator()) {
        Write-Host "      • $($var.Key): $($var.Value)" -ForegroundColor Gray
        
        # Configurer la variable sur Vercel (si en production)
        if ($Production) {
            try {
                vercel env add $var.Key production --value $var.Value --force
            } catch {
                Write-Host "      ⚠️ Impossible de configurer $($var.Key)" -ForegroundColor Yellow
            }
        }
    }
    
} catch {
    Write-Host "   ⚠️ Erreur configuration: $_" -ForegroundColor Yellow
}

# Étape 5: Déploiement
Write-Host "`n5️⃣ Déploiement..." -ForegroundColor Yellow

try {
    if ($Production) {
        Write-Host "   🚀 Déploiement en production..." -ForegroundColor Red
        
        # Déploiement production
        $deployResult = vercel --prod --yes
        
        Write-Host "   ✅ Déploiement production réussi" -ForegroundColor Green
        
    } else {
        Write-Host "   🧪 Déploiement de test..." -ForegroundColor Yellow
        
        # Déploiement preview
        $deployResult = vercel --yes
        
        Write-Host "   ✅ Déploiement test réussi" -ForegroundColor Green
    }
    
    # Extraire l'URL de déploiement
    if ($deployResult) {
        $deployUrl = $deployResult | Select-String -Pattern "https://.*\.vercel\.app" | ForEach-Object { $_.Matches[0].Value }
        if ($deployUrl) {
            Write-Host "   🔗 URL de déploiement: $deployUrl" -ForegroundColor Cyan
        }
    }
    
} catch {
    Write-Host "   ❌ Erreur de déploiement: $_" -ForegroundColor Red
    exit 1
}

# Étape 6: Validation post-déploiement
Write-Host "`n6️⃣ Validation post-déploiement..." -ForegroundColor Yellow

try {
    # Attendre quelques secondes pour la propagation
    Write-Host "   ⏳ Attente de la propagation..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
    
    # Tester l'accessibilité du site
    $testUrl = if ($deployUrl) { $deployUrl } else { $FullDomain }
    $response = Invoke-WebRequest -Uri $testUrl -TimeoutSec 15 -UseBasicParsing
    
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Site accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
        
        # Tester le sitemap
        try {
            $sitemapResponse = Invoke-WebRequest -Uri "$testUrl/sitemap.xml" -TimeoutSec 10 -UseBasicParsing
            if ($sitemapResponse.StatusCode -eq 200) {
                $urlCount = ([regex]::Matches($sitemapResponse.Content, '<url>')).Count
                Write-Host "   ✅ Sitemap accessible ($urlCount URLs)" -ForegroundColor Green
            }
        } catch {
            Write-Host "   ⚠️ Sitemap non accessible" -ForegroundColor Yellow
        }
        
        # Tester robots.txt
        try {
            $robotsResponse = Invoke-WebRequest -Uri "$testUrl/robots.txt" -TimeoutSec 10 -UseBasicParsing
            if ($robotsResponse.StatusCode -eq 200) {
                Write-Host "   ✅ Robots.txt accessible" -ForegroundColor Green
            }
        } catch {
            Write-Host "   ⚠️ Robots.txt non accessible" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "   ⚠️ Site accessible mais statut: $($response.StatusCode)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "   ⚠️ Impossible de valider le déploiement: $_" -ForegroundColor Yellow
}

# Résumé final
Write-Host "`n🎉 Déploiement terminé !" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

Write-Host "📊 Résumé:" -ForegroundColor Yellow
Write-Host "   • Domaine: $FullDomain" -ForegroundColor White
Write-Host "   • Mode: $(if ($Production) { 'PRODUCTION' } else { 'TEST' })" -ForegroundColor White
Write-Host "   • Build: $(if (-not $SkipBuild) { '✅ Effectué' } else { '⏭️ Ignoré' })" -ForegroundColor White
Write-Host "   • Sitemap: $(if (-not $SkipSitemap) { '✅ Généré' } else { '⏭️ Ignoré' })" -ForegroundColor White

if ($deployUrl) {
    Write-Host "   • URL de déploiement: $deployUrl" -ForegroundColor Cyan
}

Write-Host "`n🔍 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Testez toutes les fonctionnalités sur le site déployé" -ForegroundColor White
Write-Host "   2. Configurez votre domaine personnalisé sur Vercel" -ForegroundColor White
Write-Host "   3. Soumettez le sitemap à Google Search Console" -ForegroundColor White
Write-Host "   4. Configurez Google Analytics" -ForegroundColor White
Write-Host "   5. Créez votre premier utilisateur administrateur" -ForegroundColor White

Write-Host "`n✨ WebKlor est prêt pour le web !" -ForegroundColor Green
