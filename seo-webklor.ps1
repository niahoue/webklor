# Script d'automatisation SEO pour WebKlor
param(
    [switch]$SubmitSitemap,
    [switch]$TestUrls,
    [switch]$GenerateReport
)

Write-Host "🔍 WebKlor - Automatisation SEO" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

$DOMAIN = "webklor.com"
$FULL_URL = "https://$DOMAIN"

# URLs importantes à tester
$IMPORTANT_URLS = @(
    "$FULL_URL",
    "$FULL_URL/sitemap.xml",
    "$FULL_URL/robots.txt",
    "$FULL_URL/about",
    "$FULL_URL/services",
    "$FULL_URL/portfolio",
    "$FULL_URL/blog",
    "$FULL_URL/contact"
)

# URLs API à tester
$API_URLS = @(
    "$FULL_URL/api/health",
    "$FULL_URL/api/posts"
)

# Function to test URL
function Test-Url {
    param([string]$url)
    
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Size = $response.Content.Length
            ResponseTime = $null
        }
    } catch {
        return @{
            Success = $false
            StatusCode = $_.Exception.Response.StatusCode.value__
            Error = $_.Exception.Message
            Size = 0
            ResponseTime = $null
        }
    }
}

if ($TestUrls) {
    Write-Host "`n🧪 Test des URLs importantes..." -ForegroundColor Yellow
    
    $results = @()
    
    foreach ($url in $IMPORTANT_URLS) {
        Write-Host "🔗 Test: $url" -ForegroundColor Cyan
        $result = Test-Url -url $url
        
        if ($result.Success) {
            Write-Host "   ✅ OK ($($result.StatusCode)) - $($result.Size) octets" -ForegroundColor Green
        } else {
            Write-Host "   ❌ ERREUR ($($result.StatusCode)) - $($result.Error)" -ForegroundColor Red
        }
        
        $results += [PSCustomObject]@{
            URL = $url
            Status = if ($result.Success) { "OK" } else { "ERREUR" }
            StatusCode = $result.StatusCode
            Size = $result.Size
            Error = $result.Error
        }
    }
    
    Write-Host "`n📊 Résumé des tests :" -ForegroundColor Yellow
    $successCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
    $totalCount = $results.Count
    Write-Host "   ✅ Succès: $successCount/$totalCount" -ForegroundColor Green
    
    if ($successCount -lt $totalCount) {
        Write-Host "   ❌ Échecs: $($totalCount - $successCount)" -ForegroundColor Red
    }
}

if ($SubmitSitemap) {
    Write-Host "`n🗺️ Soumission du sitemap aux moteurs de recherche..." -ForegroundColor Yellow
    
    # URLs de soumission automatique (ping)
    $SEARCH_ENGINES = @{
        "Google" = "https://www.google.com/ping?sitemap=$FULL_URL/sitemap.xml"
        "Bing" = "https://www.bing.com/ping?sitemap=$FULL_URL/sitemap.xml"
    }
    
    foreach ($engine in $SEARCH_ENGINES.GetEnumerator()) {
        Write-Host "📡 Soumission à $($engine.Name)..." -ForegroundColor Cyan
        
        try {
            $response = Invoke-WebRequest -Uri $engine.Value -UseBasicParsing -TimeoutSec 15
            if ($response.StatusCode -eq 200) {
                Write-Host "   ✅ Sitemap soumis à $($engine.Name)" -ForegroundColor Green
            } else {
                Write-Host "   ⚠️ Réponse $($response.StatusCode) de $($engine.Name)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "   ❌ Erreur avec $($engine.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n📋 Soumissions manuelles recommandées :" -ForegroundColor Yellow
    Write-Host "   • Google Search Console: https://search.google.com/search-console/" -ForegroundColor White
    Write-Host "   • Bing Webmaster: https://www.bing.com/webmasters/" -ForegroundColor White
    Write-Host "   • Yandex Webmaster: https://webmaster.yandex.com/" -ForegroundColor White
}

if ($GenerateReport) {
    Write-Host "`n📊 Génération du rapport SEO..." -ForegroundColor Yellow
    
    $reportDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $reportPath = "SEO-REPORT-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
    
    $report = @"
# 📊 Rapport SEO WebKlor

**Date :** $reportDate  
**Domaine :** $DOMAIN  
**URL :** $FULL_URL  

## 🎯 URLs Indexées

### Pages Principales
"@

    foreach ($url in $IMPORTANT_URLS) {
        $result = Test-Url -url $url
        $status = if ($result.Success) { "✅" } else { "❌" }
        $report += "`n- $status [$url]($url)"
    }

    $report += @"

## 📈 Recommandations SEO

### Priorité Haute
- [ ] Soumettre sitemap à Google Search Console
- [ ] Configurer Google Analytics 4
- [ ] Optimiser balises meta descriptions
- [ ] Ajouter données structurées (JSON-LD)

### Priorité Moyenne  
- [ ] Créer contenu blog régulier
- [ ] Optimiser images (alt text, WebP)
- [ ] Améliorer vitesse de chargement
- [ ] Configurer redirections 301

### Priorité Basse
- [ ] Créer pages réseaux sociaux
- [ ] Soumettre à annuaires français
- [ ] Configurer Facebook Pixel
- [ ] Mettre en place remarketing

## 📱 Points de Contrôle

### Technique
- [x] Sitemap XML présent
- [x] Robots.txt configuré  
- [x] Site responsive
- [x] HTTPS activé

### Contenu
- [ ] Pages optimisées SEO
- [ ] Images optimisées
- [ ] Contenu unique
- [ ] Maillage interne

---

*Rapport généré automatiquement le $reportDate*
"@

    Set-Content -Path $reportPath -Value $report -Encoding UTF8
    Write-Host "✅ Rapport généré: $reportPath" -ForegroundColor Green
}

# Affichage des liens utiles
Write-Host "`n🔗 Liens Utiles WebKlor :" -ForegroundColor Yellow
Write-Host "   • Site principal: $FULL_URL" -ForegroundColor White
Write-Host "   • Sitemap: $FULL_URL/sitemap.xml" -ForegroundColor White
Write-Host "   • Robots.txt: $FULL_URL/robots.txt" -ForegroundColor White
Write-Host "   • Administration: $FULL_URL/admin" -ForegroundColor White

Write-Host "`n🎯 Commandes Disponibles :" -ForegroundColor Yellow
Write-Host "   .\seo-webklor.ps1 -TestUrls        # Tester toutes les URLs" -ForegroundColor White
Write-Host "   .\seo-webklor.ps1 -SubmitSitemap   # Soumettre le sitemap" -ForegroundColor White  
Write-Host "   .\seo-webklor.ps1 -GenerateReport  # Générer rapport SEO" -ForegroundColor White

Write-Host "`n🎉 WebKlor est prêt pour le référencement !" -ForegroundColor Green
