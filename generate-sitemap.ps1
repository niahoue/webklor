# Générateur de Sitemap pour WebKlor
# Ce script génère automatiquement le sitemap.xml et robots.txt

param(
    [string]$Domain = $null
)

Write-Host "🗺️  Générateur de Sitemap WebKlor" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Vérification du domaine
if (-not $Domain) {
    $Domain = Read-Host "🌐 Entrez votre nom de domaine (ex: monsite.com)"
    
    if (-not $Domain) {
        Write-Host "❌ Le domaine est requis pour générer le sitemap" -ForegroundColor Red
        exit 1
    }
}

# Nettoyer le domaine (supprimer http/https et www)
$CleanDomain = $Domain -replace '^https?://', '' -replace '^www\.', ''

Write-Host "🔍 Domaine configuré: $CleanDomain" -ForegroundColor Cyan

# Définir la variable d'environnement
$env:SITE_DOMAIN = $CleanDomain

# Créer le dossier scripts s'il n'existe pas
$ScriptsDir = Join-Path $PSScriptRoot "scripts"
if (-not (Test-Path $ScriptsDir)) {
    New-Item -ItemType Directory -Path $ScriptsDir -Force
    Write-Host "📁 Dossier scripts créé" -ForegroundColor Yellow
}

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "   Veuillez installer Node.js depuis https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Exécuter le générateur de sitemap
Write-Host "🚀 Génération du sitemap en cours..." -ForegroundColor Yellow

try {
    $ScriptPath = Join-Path $PSScriptRoot "scripts\generate-sitemap.js"
    
    if (-not (Test-Path $ScriptPath)) {
        Write-Host "❌ Le script generate-sitemap.js n'est pas trouvé" -ForegroundColor Red
        exit 1
    }
    
    # Exécuter le script Node.js
    node $ScriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 Sitemap généré avec succès !" -ForegroundColor Green
        
        # Vérifier les fichiers générés
        $SitemapPath = Join-Path $PSScriptRoot "public\sitemap.xml"
        $RobotsPath = Join-Path $PSScriptRoot "public\robots.txt"
        
        if (Test-Path $SitemapPath) {
            $SitemapSize = (Get-Item $SitemapPath).Length
            Write-Host "📄 Sitemap: public/sitemap.xml ($SitemapSize octets)" -ForegroundColor Cyan
        }
        
        if (Test-Path $RobotsPath) {
            $RobotsSize = (Get-Item $RobotsPath).Length
            Write-Host "🤖 Robots.txt: public/robots.txt ($RobotsSize octets)" -ForegroundColor Cyan
        }
        
        Write-Host "`n📋 URLs du sitemap :" -ForegroundColor Yellow
        Write-Host "   • https://$CleanDomain/sitemap.xml" -ForegroundColor White
        Write-Host "   • https://$CleanDomain/robots.txt" -ForegroundColor White
        
        Write-Host "`n🔍 Prochaines étapes SEO :" -ForegroundColor Yellow
        Write-Host "   1. Déployez votre site avec les nouveaux fichiers" -ForegroundColor White
        Write-Host "   2. Soumettez le sitemap à Google Search Console" -ForegroundColor White
        Write-Host "   3. Ajoutez le sitemap à Bing Webmaster Tools" -ForegroundColor White
        Write-Host "   4. Vérifiez que robots.txt est accessible" -ForegroundColor White
        
    } else {
        Write-Host "❌ Erreur lors de la génération du sitemap" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✨ Génération terminée avec succès !" -ForegroundColor Green
