param(
    [string]$WorkspaceRoot = "C:\Users\Niahoue\Documents\webklor-livraison"
)

# Script pour corriger toutes les URLs hardcodées avec localhost:5000
Write-Host "🔧 Correction des URLs hardcodées dans le projet WebKlor..." -ForegroundColor Yellow

$files = @(
    "src\pages\AdminBlog.jsx",
    "src\pages\AdminDashboard.jsx", 
    "src\pages\AdminNewsletter.jsx"
)

foreach ($file in $files) {
    $filePath = Join-Path $WorkspaceRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "📝 Traitement de $file..." -ForegroundColor Cyan
        
        $content = Get-Content $filePath -Raw
        
        # Remplacer toutes les occurrences de localhost:5000
        $content = $content -replace "http://localhost:5000", '${API_BASE_URL}'
        
        # Ajouter l'import API_BASE_URL si pas déjà présent
        if ($content -notmatch "import API_BASE_URL") {
            $content = $content -replace "(import.*from.*';)", "`$1`nimport API_BASE_URL from '../utils/apiConfig';"
        }
        
        Set-Content $filePath $content -Encoding UTF8
        Write-Host "✅ $file corrigé" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Fichier non trouvé: $file" -ForegroundColor Yellow
    }
}

Write-Host "🎯 Correction terminée!" -ForegroundColor Green
