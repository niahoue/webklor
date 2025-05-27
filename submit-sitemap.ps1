# Script de soumission automatique du sitemap aux moteurs de recherche
# Utilise les APIs publiques quand disponibles

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    [string]$GoogleSearchConsoleApiKey = $null,
    [switch]$DryRun = $false
)

Write-Host "🔍 Soumission Sitemap aux Moteurs de Recherche" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$CleanDomain = $Domain -replace '^https?://', '' -replace '^www\.', ''
$FullDomain = "https://$CleanDomain"
$SitemapUrl = "$FullDomain/sitemap.xml"

Write-Host "🌐 Domaine: $FullDomain" -ForegroundColor Cyan
Write-Host "🗺️ Sitemap: $SitemapUrl" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "🧪 Mode test activé (aucune soumission réelle)" -ForegroundColor Yellow
}

Write-Host ""

# Fonction pour tester l'accessibilité du sitemap
function Test-SitemapAccessibility {
    param($SitemapUrl)
    
    try {
        Write-Host "📡 Test d'accessibilité du sitemap..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -Uri $SitemapUrl -TimeoutSec 15 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            $urlCount = ([regex]::Matches($response.Content, '<url>')).Count
            Write-Host "   ✅ Sitemap accessible ($urlCount URLs)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ❌ Sitemap non accessible (HTTP $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "   ❌ Erreur d'accès: $_" -ForegroundColor Red
        return $false
    }
}

# Test préliminaire
if (-not (Test-SitemapAccessibility -SitemapUrl $SitemapUrl)) {
    Write-Host "🚨 Impossible de continuer sans sitemap accessible" -ForegroundColor Red
    exit 1
}

# Moteurs de recherche et leurs endpoints
$searchEngines = @{
    "Google" = @{
        "SubmissionUrl" = "https://www.google.com/ping?sitemap="
        "ConsoleUrl" = "https://search.google.com/search-console"
        "Color" = "Blue"
        "SupportsAutomation" = $true
    }
    "Bing" = @{
        "SubmissionUrl" = "https://www.bing.com/ping?sitemap="
        "ConsoleUrl" = "https://www.bing.com/webmasters"
        "Color" = "Cyan"
        "SupportsAutomation" = $true
    }
    "Yandex" = @{
        "SubmissionUrl" = "https://webmaster.yandex.com/ping?sitemap="
        "ConsoleUrl" = "https://webmaster.yandex.com"
        "Color" = "Red"
        "SupportsAutomation" = $true
    }
    "Baidu" = @{
        "SubmissionUrl" = "https://ping.baidu.com/ping/RPC2"
        "ConsoleUrl" = "https://ziyuan.baidu.com"
        "Color" = "Green"
        "SupportsAutomation" = $false
    }
}

# Soumission automatique
$results = @()

foreach ($engine in $searchEngines.GetEnumerator()) {
    $name = $engine.Key
    $config = $engine.Value
    
    Write-Host "🔍 Soumission à $name..." -ForegroundColor $config.Color
    
    if (-not $config.SupportsAutomation) {
        Write-Host "   ⚠️ Soumission manuelle requise: $($config.ConsoleUrl)" -ForegroundColor Yellow
        $results += @{
            Engine = $name
            Status = "Manual"
            Message = "Soumission manuelle requise"
            Url = $config.ConsoleUrl
        }
        continue
    }
    
    if ($DryRun) {
        Write-Host "   🧪 Test: $($config.SubmissionUrl)$SitemapUrl" -ForegroundColor Gray
        $results += @{
            Engine = $name
            Status = "Test"
            Message = "Test réussi (mode dry-run)"
            Url = $config.SubmissionUrl + $SitemapUrl
        }
        continue
    }
    
    try {
        $submissionUrl = $config.SubmissionUrl + [System.Web.HttpUtility]::UrlEncode($SitemapUrl)
        
        # Tentative de soumission
        $response = Invoke-WebRequest -Uri $submissionUrl -TimeoutSec 30 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Soumission réussie" -ForegroundColor Green
            $results += @{
                Engine = $name
                Status = "Success"
                Message = "Sitemap soumis avec succès"
                Url = $submissionUrl
            }
        } else {
            Write-Host "   ⚠️ Statut: $($response.StatusCode)" -ForegroundColor Yellow
            $results += @{
                Engine = $name
                Status = "Warning"
                Message = "Statut HTTP $($response.StatusCode)"
                Url = $submissionUrl
            }
        }
        
    } catch {
        Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{
            Engine = $name
            Status = "Error"
            Message = $_.Exception.Message
            Url = $config.ConsoleUrl
        }
    }
    
    # Pause entre les soumissions
    Start-Sleep -Seconds 2
}

# Résumé des résultats
Write-Host "`n📊 Résumé des soumissions:" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

$successCount = 0
$warningCount = 0
$errorCount = 0
$manualCount = 0

foreach ($result in $results) {
    $status = switch ($result.Status) {
        "Success" { "✅"; $successCount++; "Green" }
        "Warning" { "⚠️"; $warningCount++; "Yellow" }
        "Error" { "❌"; $errorCount++; "Red" }
        "Manual" { "📝"; $manualCount++; "Cyan" }
        "Test" { "🧪"; "Gray" }
        default { "❓"; "White" }
    }
    
    Write-Host "$($status[0]) $($result.Engine): $($result.Message)" -ForegroundColor $status[2]
}

Write-Host "`n📈 Statistiques:" -ForegroundColor Yellow
if (-not $DryRun) {
    Write-Host "   ✅ Réussies: $successCount" -ForegroundColor Green
    Write-Host "   ⚠️ Avertissements: $warningCount" -ForegroundColor Yellow
    Write-Host "   ❌ Échecs: $errorCount" -ForegroundColor Red
    Write-Host "   📝 Manuelles: $manualCount" -ForegroundColor Cyan
} else {
    Write-Host "   🧪 Tests effectués (mode dry-run)" -ForegroundColor Gray
}

# Instructions pour la soumission manuelle
if ($manualCount -gt 0 -and -not $DryRun) {
    Write-Host "`n📝 Actions manuelles requises:" -ForegroundColor Yellow
    
    foreach ($result in $results) {
        if ($result.Status -eq "Manual") {
            Write-Host "   • $($result.Engine): $($result.Url)" -ForegroundColor White
        }
    }
}

# Recommandations post-soumission
Write-Host "`n💡 Prochaines étapes recommandées:" -ForegroundColor Yellow
Write-Host "   1. Vérifiez l'indexation dans 24-48h" -ForegroundColor White
Write-Host "   2. Configurez Google Search Console si pas encore fait" -ForegroundColor White
Write-Host "   3. Surveillez les erreurs d'exploration" -ForegroundColor White
Write-Host "   4. Resoumettez après chaque mise à jour majeure" -ForegroundColor White
Write-Host "   5. Créez du contenu de qualité régulièrement" -ForegroundColor White

# Liens utiles
Write-Host "`n🔗 Liens utiles:" -ForegroundColor Yellow
Write-Host "   • Google Search Console: https://search.google.com/search-console" -ForegroundColor White
Write-Host "   • Bing Webmaster Tools: https://www.bing.com/webmasters" -ForegroundColor White
Write-Host "   • Test de validité sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html" -ForegroundColor White

if ($DryRun) {
    Write-Host "`n🧪 Pour une soumission réelle, relancez sans --DryRun" -ForegroundColor Gray
}

Write-Host "`n🎉 Process de soumission terminé !" -ForegroundColor Green
