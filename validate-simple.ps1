# Script de validation simple pour WebKlor
# Version Windows PowerShell compatible

Write-Host "VALIDATION PRE-DEPLOIEMENT WEBKLOR" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

$errors = @()

Write-Host "`n1. Verification des fichiers essentiels..." -ForegroundColor Yellow

$files = @("package.json", "index.html", "src/main.jsx", "src/App.jsx", "server/server.js")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "OK - $file" -ForegroundColor Green
    } else {
        Write-Host "ERREUR - $file manquant" -ForegroundColor Red
        $errors += $file
    }
}

Write-Host "`n2. Test du build de production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Build reussi" -ForegroundColor Green
} else {
    Write-Host "ERREUR - Build echoue" -ForegroundColor Red
    $errors += "build"
}

Write-Host "`n3. Verification du dossier dist..." -ForegroundColor Yellow
if (Test-Path "dist/index.html") {
    Write-Host "OK - dist/index.html present" -ForegroundColor Green
} else {
    Write-Host "ERREUR - dist/index.html manquant" -ForegroundColor Red
    $errors += "dist"
}

Write-Host "`nRESULTAT:" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "VALIDATION REUSSIE - Pret pour production!" -ForegroundColor Green
} else {
    Write-Host "VALIDATION ECHOUEE - $($errors.Count) erreurs" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "- $error" -ForegroundColor Red
    }
}
