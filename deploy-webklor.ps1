# Script de déploiement final WebKlor sur Vercel
param(
    [switch]$Production,
    [switch]$ConfigureDomain
)

Write-Host "🚀 Déploiement Final WebKlor sur Vercel" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

$DOMAIN = "webklor.com"
$PROJECT_NAME = "webklor"

Write-Host "🌐 Domaine cible: $DOMAIN" -ForegroundColor Cyan
Write-Host "📦 Projet: $PROJECT_NAME" -ForegroundColor Cyan

# Vérification des prérequis
Write-Host "`n🔍 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Vercel CLI
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI non installé" -ForegroundColor Red
    Write-Host "   Installation: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json non trouvé" -ForegroundColor Red
    Write-Host "   Exécutez ce script depuis la racine du projet" -ForegroundColor Yellow
    exit 1
}

# Vérifier les fichiers SEO
$SitemapPath = "public\sitemap.xml"
$RobotsPath = "public\robots.txt"

if (-not (Test-Path $SitemapPath)) {
    Write-Host "❌ Sitemap non trouvé: $SitemapPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $RobotsPath)) {
    Write-Host "❌ Robots.txt non trouvé: $RobotsPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichiers SEO présents" -ForegroundColor Green

# Build du projet
Write-Host "`n🏗️ Construction du projet..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed"
    }
    Write-Host "✅ Build réussi" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec du build" -ForegroundColor Red
    exit 1
}

# Déploiement
Write-Host "`n🚀 Déploiement sur Vercel..." -ForegroundColor Yellow

if ($Production) {
    Write-Host "📦 Déploiement en PRODUCTION" -ForegroundColor Magenta
    
    try {
        vercel --prod --yes
        if ($LASTEXITCODE -ne 0) {
            throw "Deployment failed"
        }
        Write-Host "✅ Déploiement en production réussi !" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Échec du déploiement en production" -ForegroundColor Red
        exit 1
    }
    
} else {
    Write-Host "🧪 Déploiement de PREVIEW" -ForegroundColor Cyan
    
    try {
        vercel --yes
        if ($LASTEXITCODE -ne 0) {
            throw "Deployment failed"
        }
        Write-Host "✅ Déploiement preview réussi !" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Échec du déploiement preview" -ForegroundColor Red
        exit 1
    }
}

# Configuration du domaine personnalisé
if ($ConfigureDomain) {
    Write-Host "`n🌐 Configuration du domaine personnalisé..." -ForegroundColor Yellow
    
    try {
        # Ajouter le domaine
        vercel domains add $DOMAIN
        
        # Lier le domaine au projet
        vercel domains ls
        
        Write-Host "✅ Domaine configuré" -ForegroundColor Green
        Write-Host "📝 Veuillez configurer les DNS de votre domaine :" -ForegroundColor Yellow
        Write-Host "   Type: CNAME" -ForegroundColor White
        Write-Host "   Name: www" -ForegroundColor White
        Write-Host "   Value: cname.vercel-dns.com" -ForegroundColor White
        Write-Host "   " -ForegroundColor White
        Write-Host "   Type: A" -ForegroundColor White
        Write-Host "   Name: @" -ForegroundColor White
        Write-Host "   Value: 76.76.19.61" -ForegroundColor White
        
    } catch {
        Write-Host "⚠️ Configuration du domaine manuelle requise" -ForegroundColor Yellow
        Write-Host "   1. Allez sur vercel.com/dashboard" -ForegroundColor White
        Write-Host "   2. Sélectionnez votre projet" -ForegroundColor White
        Write-Host "   3. Onglet 'Domains' > Add Domain" -ForegroundColor White
        Write-Host "   4. Entrez: $DOMAIN" -ForegroundColor White
    }
}

# Vérifications post-déploiement
Write-Host "`n🔍 Vérifications post-déploiement..." -ForegroundColor Yellow

$deploymentUrl = if ($Production) { "https://$DOMAIN" } else { "https://webklor-livraison-git-main-niahoues-projects.vercel.app" }

Write-Host "📍 URL de déploiement: $deploymentUrl" -ForegroundColor Cyan

# URLs importantes à tester
$importantUrls = @(
    "$deploymentUrl",
    "$deploymentUrl/sitemap.xml",
    "$deploymentUrl/robots.txt",
    "$deploymentUrl/api/health"
)

Write-Host "`n🧪 URLs importantes à vérifier :" -ForegroundColor Yellow
foreach ($url in $importantUrls) {
    Write-Host "   • $url" -ForegroundColor White
}

# Configuration des variables d'environnement
Write-Host "`n⚙️ Variables d'environnement à configurer sur Vercel :" -ForegroundColor Yellow
Write-Host "   • MONGODB_URI" -ForegroundColor White
Write-Host "   • JWT_SECRET" -ForegroundColor White
Write-Host "   • EMAIL_SERVICE" -ForegroundColor White
Write-Host "   • EMAIL_USER" -ForegroundColor White
Write-Host "   • EMAIL_PASS" -ForegroundColor White
Write-Host "   • FRONTEND_URL = https://$DOMAIN" -ForegroundColor White

# Prochaines étapes SEO
Write-Host "`n📈 Prochaines étapes SEO :" -ForegroundColor Yellow
Write-Host "   1. ✅ Sitemap configuré" -ForegroundColor Green
Write-Host "   2. 🔄 Soumettre à Google Search Console" -ForegroundColor Cyan
Write-Host "   3. 🔄 Soumettre à Bing Webmaster Tools" -ForegroundColor Cyan
Write-Host "   4. 🔄 Configurer Google Analytics" -ForegroundColor Cyan
Write-Host "   5. 🔄 Configurer Facebook Pixel (optionnel)" -ForegroundColor Cyan

Write-Host "`n🎉 Déploiement terminé avec succès !" -ForegroundColor Green
Write-Host "🌐 Votre site WebKlor est maintenant en ligne !" -ForegroundColor Green

if ($Production) {
    Write-Host "`n🚀 Site en production: https://$DOMAIN" -ForegroundColor Magenta
} else {
    Write-Host "`n🧪 Site de test: $deploymentUrl" -ForegroundColor Cyan
    Write-Host "   Utilisez -Production pour déployer en production" -ForegroundColor Yellow
}
