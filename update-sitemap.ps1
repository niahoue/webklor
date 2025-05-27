# Script de mise à jour automatique du sitemap
# Ce script récupère les articles depuis l'API et met à jour le sitemap

param(
    [string]$Domain = $null,
    [string]$ApiUrl = $null
)

Write-Host "🔄 Mise à jour automatique du sitemap WebKlor" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Configuration par défaut
if (-not $Domain) {
    $Domain = Read-Host "🌐 Entrez votre nom de domaine (ex: monsite.com)"
}

if (-not $ApiUrl) {
    $CleanDomain = $Domain -replace '^https?://', '' -replace '^www\.', ''
    $ApiUrl = "https://$CleanDomain/api"
}

$FullDomain = "https://$($Domain -replace '^https?://', '' -replace '^www\.', '')"

Write-Host "🌐 Domaine: $FullDomain" -ForegroundColor Cyan
Write-Host "🔗 API: $ApiUrl" -ForegroundColor Cyan

# Fonction pour récupérer les articles depuis l'API
function Get-BlogPostsFromAPI {
    param($ApiUrl)
    
    try {
        Write-Host "📡 Récupération des articles depuis l'API..." -ForegroundColor Yellow
        
        $response = Invoke-RestMethod -Uri "$ApiUrl/posts" -Method GET -TimeoutSec 10
        
        if ($response -and $response.Count -gt 0) {
            Write-Host "✅ $($response.Count) articles récupérés" -ForegroundColor Green
            return $response
        } else {
            Write-Host "⚠️ Aucun article trouvé" -ForegroundColor Yellow
            return @()
        }
        
    } catch {
        Write-Host "⚠️ Impossible de récupérer les articles: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "📝 Utilisation d'articles d'exemple..." -ForegroundColor Gray
        
        # Articles d'exemple
        return @(
            @{
                slug = "comment-creer-site-web-moderne"
                title = "Comment créer un site web moderne"
                updatedAt = "2025-05-27T10:00:00Z"
            },
            @{
                slug = "optimiser-seo-site-web"
                title = "Optimiser le SEO de votre site web"
                updatedAt = "2025-05-26T15:30:00Z"
            },
            @{
                slug = "tendances-design-web-2025"
                title = "Tendances design web 2025"
                updatedAt = "2025-05-25T09:15:00Z"
            }
        )
    }
}

# Fonction pour générer le XML du sitemap
function Generate-SitemapXML {
    param($Domain, $BlogPosts)
    
    $today = Get-Date -Format "yyyy-MM-dd"
    
    # Pages statiques
    $staticPages = @(
        @{ path = ""; priority = "1.0"; changefreq = "weekly" },
        @{ path = "about"; priority = "0.8"; changefreq = "monthly" },
        @{ path = "services"; priority = "0.9"; changefreq = "monthly" },
        @{ path = "portfolio"; priority = "0.8"; changefreq = "monthly" },
        @{ path = "testimonials"; priority = "0.7"; changefreq = "monthly" },
        @{ path = "blog"; priority = "0.9"; changefreq = "weekly" },
        @{ path = "contact"; priority = "0.8"; changefreq = "monthly" },
        @{ path = "brand-kit"; priority = "0.6"; changefreq = "monthly" },
        @{ path = "legal-notices"; priority = "0.3"; changefreq = "yearly" },
        @{ path = "privacy-policy"; priority = "0.3"; changefreq = "yearly" }
    )
    
    # Début du XML
    $xml = @'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

'@

    # Ajouter les pages statiques
    foreach ($page in $staticPages) {
        $url = if ($page.path) { "$Domain/$($page.path)" } else { $Domain }
        $xml += @"
  <url>
    <loc>$url</loc>
    <lastmod>$today</lastmod>
    <changefreq>$($page.changefreq)</changefreq>
    <priority>$($page.priority)</priority>
  </url>

"@
    }
    
    # Ajouter les articles de blog
    foreach ($post in $BlogPosts) {
        $postDate = if ($post.updatedAt) {
            try {
                ([DateTime]$post.updatedAt).ToString("yyyy-MM-dd")
            } catch {
                $today
            }
        } else {
            $today
        }
        
        $xml += @"
  <url>
    <loc>$Domain/blog/$($post.slug)</loc>
    <lastmod>$postDate</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

"@
    }
    
    # Fermer le XML
    $xml += "</urlset>"
    
    return $xml
}

# Exécution principale
try {
    # Récupérer les articles
    $blogPosts = Get-BlogPostsFromAPI -ApiUrl $ApiUrl
    
    # Générer le sitemap
    Write-Host "🗺️ Génération du sitemap..." -ForegroundColor Yellow
    $sitemapXml = Generate-SitemapXML -Domain $FullDomain -BlogPosts $blogPosts
    
    # Sauvegarder le sitemap
    $sitemapPath = Join-Path $PSScriptRoot "public\sitemap.xml"
    $sitemapXml | Out-File -FilePath $sitemapPath -Encoding UTF8
    
    # Mettre à jour robots.txt
    Write-Host "🤖 Mise à jour du robots.txt..." -ForegroundColor Yellow
    $robotsContent = @"
User-agent: *
Allow: /

# Sitemap
Sitemap: $FullDomain/sitemap.xml

# Interdire l'accès aux pages admin
Disallow: /admin/
Disallow: /login

# Interdire l'accès aux API
Disallow: /api/

# Fichiers et dossiers à ignorer
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /assets/fonts/
Disallow: /assets/icons/

# Autoriser les moteurs de recherche courants
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Délai entre les requêtes (en secondes)
Crawl-delay: 1
"@

    $robotsPath = Join-Path $PSScriptRoot "public\robots.txt"
    $robotsContent | Out-File -FilePath $robotsPath -Encoding UTF8
    
    # Statistiques
    $totalUrls = 10 + $blogPosts.Count  # 10 pages statiques + articles
    
    Write-Host "✅ Sitemap mis à jour avec succès !" -ForegroundColor Green
    Write-Host "`n📊 Statistiques :" -ForegroundColor Yellow
    Write-Host "   • Total URLs: $totalUrls" -ForegroundColor White
    Write-Host "   • Pages statiques: 10" -ForegroundColor White
    Write-Host "   • Articles de blog: $($blogPosts.Count)" -ForegroundColor White
    Write-Host "   • Domaine: $FullDomain" -ForegroundColor White
    
    Write-Host "`n🔗 URLs générées :" -ForegroundColor Yellow
    Write-Host "   • Sitemap: $FullDomain/sitemap.xml" -ForegroundColor White
    Write-Host "   • Robots.txt: $FullDomain/robots.txt" -ForegroundColor White
    
    Write-Host "`n🚀 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "   1. Déployez votre site avec ces fichiers" -ForegroundColor White
    Write-Host "   2. Vérifiez l'accessibilité des URLs" -ForegroundColor White
    Write-Host "   3. Soumettez le sitemap à Google Search Console" -ForegroundColor White
    Write-Host "   4. Configurez la surveillance SEO" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors de la mise à jour: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Mise à jour terminée avec succès !" -ForegroundColor Green
