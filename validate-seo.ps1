# Script de validation SEO complète
# Vérifie que tous les éléments SEO sont en place

param(
    [string]$Domain = $null
)

Write-Host "🔍 Validation SEO WebKlor" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

if (-not $Domain) {
    $Domain = Read-Host "🌐 Entrez votre nom de domaine pour la validation"
}

$CleanDomain = $Domain -replace '^https?://', '' -replace '^www\.', ''
$FullDomain = "https://$CleanDomain"

Write-Host "🌐 Validation pour: $FullDomain`n" -ForegroundColor Cyan

# Tests à effectuer
$tests = @()

# 1. Vérification des fichiers locaux
Write-Host "📁 Vérification des fichiers locaux..." -ForegroundColor Yellow

$sitemapPath = Join-Path $PSScriptRoot "public\sitemap.xml"
$robotsPath = Join-Path $PSScriptRoot "public\robots.txt"
$indexPath = Join-Path $PSScriptRoot "dist\index.html"

if (Test-Path $sitemapPath) {
    $sitemapContent = Get-Content $sitemapPath -Raw
    if ($sitemapContent -match $CleanDomain) {
        $tests += @{ Name = "Sitemap.xml"; Status = "✅"; Details = "Présent et configuré" }
    } else {
        $tests += @{ Name = "Sitemap.xml"; Status = "⚠️"; Details = "Présent mais domaine non configuré" }
    }
} else {
    $tests += @{ Name = "Sitemap.xml"; Status = "❌"; Details = "Fichier manquant" }
}

if (Test-Path $robotsPath) {
    $robotsContent = Get-Content $robotsPath -Raw
    if ($robotsContent -match $CleanDomain) {
        $tests += @{ Name = "Robots.txt"; Status = "✅"; Details = "Présent et configuré" }
    } else {
        $tests += @{ Name = "Robots.txt"; Status = "⚠️"; Details = "Présent mais domaine non configuré" }
    }
} else {
    $tests += @{ Name = "Robots.txt"; Status = "❌"; Details = "Fichier manquant" }
}

# 2. Vérification du build de production
Write-Host "🏗️ Vérification du build..." -ForegroundColor Yellow

if (Test-Path "dist") {
    $distFiles = Get-ChildItem "dist" -Recurse | Measure-Object
    $tests += @{ Name = "Build de production"; Status = "✅"; Details = "$($distFiles.Count) fichiers générés" }
} else {
    $tests += @{ Name = "Build de production"; Status = "❌"; Details = "Dossier dist/ manquant" }
}

# 3. Vérification des composants SEO
Write-Host "🔧 Vérification des composants SEO..." -ForegroundColor Yellow

$seoHelmetPath = Join-Path $PSScriptRoot "src\components\SEOHelmet.jsx"
if (Test-Path $seoHelmetPath) {
    $tests += @{ Name = "Composant SEOHelmet"; Status = "✅"; Details = "Composant SEO présent" }
} else {
    $tests += @{ Name = "Composant SEOHelmet"; Status = "❌"; Details = "Composant SEO manquant" }
}

# 4. Tests en ligne (si le site est déployé)
Write-Host "🌐 Tests en ligne..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $FullDomain -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $tests += @{ Name = "Site accessible"; Status = "✅"; Details = "HTTP $($response.StatusCode)" }
        
        # Vérifier le titre
        if ($response.Content -match '<title>(.+?)</title>') {
            $title = $matches[1]
            if ($title -and $title.Length -gt 10) {
                $tests += @{ Name = "Titre de page"; Status = "✅"; Details = "Titre présent: $($title.Substring(0, [Math]::Min(50, $title.Length)))..." }
            } else {
                $tests += @{ Name = "Titre de page"; Status = "⚠️"; Details = "Titre trop court ou générique" }
            }
        } else {
            $tests += @{ Name = "Titre de page"; Status = "❌"; Details = "Titre manquant" }
        }
        
        # Vérifier les méta-descriptions
        if ($response.Content -match 'name="description".*?content="(.+?)"') {
            $description = $matches[1]
            if ($description.Length -gt 120) {
                $tests += @{ Name = "Méta-description"; Status = "✅"; Details = "Description présente ($($description.Length) caractères)" }
            } else {
                $tests += @{ Name = "Méta-description"; Status = "⚠️"; Details = "Description trop courte ($($description.Length) caractères)" }
            }
        } else {
            $tests += @{ Name = "Méta-description"; Status = "❌"; Details = "Méta-description manquante" }
        }
        
    } else {
        $tests += @{ Name = "Site accessible"; Status = "❌"; Details = "HTTP $($response.StatusCode)" }
    }
} catch {
    $tests += @{ Name = "Site accessible"; Status = "⚠️"; Details = "Site non accessible ou non déployé" }
}

# Test du sitemap en ligne
try {
    $sitemapResponse = Invoke-WebRequest -Uri "$FullDomain/sitemap.xml" -TimeoutSec 10 -UseBasicParsing
    if ($sitemapResponse.StatusCode -eq 200) {
        $urlCount = ([regex]::Matches($sitemapResponse.Content, '<url>')).Count
        $tests += @{ Name = "Sitemap accessible"; Status = "✅"; Details = "$urlCount URLs dans le sitemap" }
    } else {
        $tests += @{ Name = "Sitemap accessible"; Status = "❌"; Details = "HTTP $($sitemapResponse.StatusCode)" }
    }
} catch {
    $tests += @{ Name = "Sitemap accessible"; Status = "⚠️"; Details = "Sitemap non accessible" }
}

# Test du robots.txt en ligne
try {
    $robotsResponse = Invoke-WebRequest -Uri "$FullDomain/robots.txt" -TimeoutSec 10 -UseBasicParsing
    if ($robotsResponse.StatusCode -eq 200) {
        $tests += @{ Name = "Robots.txt accessible"; Status = "✅"; Details = "Fichier robots.txt accessible" }
    } else {
        $tests += @{ Name = "Robots.txt accessible"; Status = "❌"; Details = "HTTP $($robotsResponse.StatusCode)" }
    }
} catch {
    $tests += @{ Name = "Robots.txt accessible"; Status = "⚠️"; Details = "Robots.txt non accessible" }
}

# 5. Affichage des résultats
Write-Host "`n📊 Résultats de la validation SEO:" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

$passedTests = 0
$warningTests = 0
$failedTests = 0

foreach ($test in $tests) {
    Write-Host "$($test.Status) $($test.Name): $($test.Details)" -ForegroundColor White
    
    if ($test.Status -eq "✅") { $passedTests++ }
    elseif ($test.Status -eq "⚠️") { $warningTests++ }
    else { $failedTests++ }
}

Write-Host "`n📈 Statistiques:" -ForegroundColor Yellow
Write-Host "✅ Tests réussis: $passedTests" -ForegroundColor Green
Write-Host "⚠️ Avertissements: $warningTests" -ForegroundColor Yellow
Write-Host "❌ Échecs: $failedTests" -ForegroundColor Red

# Score SEO
$totalTests = $tests.Count
$score = [Math]::Round(($passedTests / $totalTests) * 100)

Write-Host "`n🎯 Score SEO: $score%" -ForegroundColor $(if ($score -ge 80) { "Green" } elseif ($score -ge 60) { "Yellow" } else { "Red" })

# Recommandations
Write-Host "`n💡 Recommandations:" -ForegroundColor Yellow

if ($failedTests -gt 0) {
    Write-Host "   🔧 Corrigez les échecs avant le déploiement" -ForegroundColor Red
}

if ($warningTests -gt 0) {
    Write-Host "   ⚠️ Améliorez les points d'avertissement" -ForegroundColor Yellow
}

if ($score -ge 80) {
    Write-Host "   🎉 Votre site est prêt pour un bon référencement !" -ForegroundColor Green
} elseif ($score -ge 60) {
    Write-Host "   📈 Quelques améliorations nécessaires" -ForegroundColor Yellow
} else {
    Write-Host "   🚨 Plusieurs points critiques à corriger" -ForegroundColor Red
}

Write-Host "`n🚀 Prochaines étapes recommandées:" -ForegroundColor Yellow
Write-Host "   1. Configurez Google Search Console" -ForegroundColor White
Write-Host "   2. Ajoutez Google Analytics" -ForegroundColor White
Write-Host "   3. Soumettez votre sitemap aux moteurs de recherche" -ForegroundColor White
Write-Host "   4. Créez du contenu de qualité régulièrement" -ForegroundColor White
Write-Host "   5. Surveillez vos positions dans les SERP" -ForegroundColor White

Write-Host "`n✨ Validation terminée !" -ForegroundColor Green
