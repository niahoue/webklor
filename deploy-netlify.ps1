# Script de déploiement automatique pour Netlify
# Usage: .\deploy-netlify.ps1

Write-Host "🚀 Déploiement WebKlor sur Netlify" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Vérifier si Netlify CLI est installé
$netlifyVersion = netlify --version 2>$null
if (-not $netlifyVersion) {
    Write-Host "📦 Installation de Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

Write-Host "✅ Netlify CLI détecté" -ForegroundColor Yellow

# Build de l'application
Write-Host "🔨 Construction de l'application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Erreur lors du build"
    exit 1
}

Write-Host "✅ Build terminé avec succès" -ForegroundColor Green

# Vérifier si le site Netlify existe
$siteInfo = netlify status 2>$null
if (-not $siteInfo) {
    Write-Host "🌐 Création d'un nouveau site Netlify..." -ForegroundColor Yellow
    netlify init
} else {
    Write-Host "✅ Site Netlify existant détecté" -ForegroundColor Yellow
}

# Déploiement
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Yellow
netlify deploy --prod --dir=dist

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Déploiement réussi !" -ForegroundColor Green
    Write-Host "🌐 Votre site est maintenant en ligne sur Netlify" -ForegroundColor Green
    
    # Afficher l'URL du site
    $siteUrl = netlify status --json | ConvertFrom-Json | Select-Object -ExpandProperty site_url
    if ($siteUrl) {
        Write-Host "🔗 URL du site : $siteUrl" -ForegroundColor Cyan
    }
} else {
    Write-Error "❌ Erreur lors du déploiement"
    exit 1
}
