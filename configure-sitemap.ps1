# Script pour configurer le sitemap avec votre domaine
param(
    [Parameter(Mandatory=$true)]
    [string]$Domain
)

Write-Host "🗺️  Configuration du sitemap WebKlor" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Nettoyer le domaine
$CleanDomain = $Domain -replace '^https?://', '' -replace '^www\.', ''
$FullDomain = "https://$CleanDomain"

Write-Host "🌐 Domaine configuré: $FullDomain" -ForegroundColor Cyan

# Chemins des fichiers
$SitemapPath = Join-Path $PSScriptRoot "public\sitemap.xml"
$RobotsPath = Join-Path $PSScriptRoot "public\robots.txt"

# Vérifier que les fichiers existent
if (-not (Test-Path $SitemapPath)) {
    Write-Host "❌ Fichier sitemap.xml non trouvé dans public/" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $RobotsPath)) {
    Write-Host "❌ Fichier robots.txt non trouvé dans public/" -ForegroundColor Red
    exit 1
}

try {
    # Mettre à jour le sitemap
    Write-Host "📝 Mise à jour du sitemap..." -ForegroundColor Yellow
    $sitemapContent = Get-Content $SitemapPath -Raw
    $updatedSitemap = $sitemapContent -replace 'https://votre-domaine\.com', $FullDomain
    Set-Content $SitemapPath -Value $updatedSitemap -Encoding UTF8
    
    # Mettre à jour robots.txt
    Write-Host "🤖 Mise à jour du robots.txt..." -ForegroundColor Yellow
    $robotsContent = Get-Content $RobotsPath -Raw
    $updatedRobots = $robotsContent -replace 'https://votre-domaine\.com', $FullDomain
    Set-Content $RobotsPath -Value $updatedRobots -Encoding UTF8
    
    Write-Host "✅ Fichiers mis à jour avec succès !" -ForegroundColor Green
    
    # Afficher les informations
    Write-Host "`n📊 Résumé de la configuration :" -ForegroundColor Yellow
    Write-Host "   • Domaine: $FullDomain" -ForegroundColor White
    Write-Host "   • Sitemap: $FullDomain/sitemap.xml" -ForegroundColor White
    Write-Host "   • Robots.txt: $FullDomain/robots.txt" -ForegroundColor White
    
    # Compter les URLs dans le sitemap
    $urlCount = ([regex]::Matches($updatedSitemap, '<url>')).Count
    Write-Host "   • URLs dans le sitemap: $urlCount" -ForegroundColor White
    
    Write-Host "`n🚀 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "   1. Déployez votre site avec ces fichiers mis à jour" -ForegroundColor White
    Write-Host "   2. Vérifiez que $FullDomain/sitemap.xml est accessible" -ForegroundColor White
    Write-Host "   3. Soumettez le sitemap à Google Search Console" -ForegroundColor White
    Write-Host "   4. Ajoutez le sitemap à Bing Webmaster Tools" -ForegroundColor White
    Write-Host "   5. Configurez Google Analytics si ce n'est pas fait" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors de la mise à jour: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Configuration terminée avec succès !" -ForegroundColor Green
