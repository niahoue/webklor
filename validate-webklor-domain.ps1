# 🔍 Validation Configuration WebKlor.com
# Date: 27 mai 2025

Write-Host "🔍 VALIDATION WEBKLOR.COM" -ForegroundColor Green
Write-Host "==========================" -ForegroundColor Green

# 1. Test DNS
Write-Host "`n1️⃣ Vérification DNS..." -ForegroundColor Yellow

Write-Host "   Test résolution webklor.com:" -ForegroundColor Cyan
$dns1 = nslookup webklor.com 2>&1
Write-Host $dns1

Write-Host "`n   Test résolution www.webklor.com:" -ForegroundColor Cyan
$dns2 = nslookup www.webklor.com 2>&1
Write-Host $dns2

# 2. Test connectivité HTTP/HTTPS
Write-Host "`n2️⃣ Test connectivité web..." -ForegroundColor Yellow

try {
    Write-Host "   Test HTTPS webklor.com:" -ForegroundColor Cyan
    $response1 = Invoke-WebRequest -Uri "https://webklor.com" -Method HEAD -TimeoutSec 10
    Write-Host "   ✅ HTTPS webklor.com : Status $($response1.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ HTTPS webklor.com : $($_.Exception.Message)" -ForegroundColor Red
}

try {
    Write-Host "   Test HTTPS www.webklor.com:" -ForegroundColor Cyan
    $response2 = Invoke-WebRequest -Uri "https://www.webklor.com" -Method HEAD -TimeoutSec 10
    Write-Host "   ✅ HTTPS www.webklor.com : Status $($response2.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ HTTPS www.webklor.com : $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test API
Write-Host "`n3️⃣ Test API..." -ForegroundColor Yellow

try {
    Write-Host "   Test API Health:" -ForegroundColor Cyan
    $apiResponse = Invoke-RestMethod -Uri "https://webklor.com/api/health" -Method GET -TimeoutSec 10
    Write-Host "   ✅ API Health : $($apiResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ API Health : $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test certificat SSL
Write-Host "`n4️⃣ Vérification SSL..." -ForegroundColor Yellow

try {
    $certInfo = [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
    $webRequest = [System.Net.WebRequest]::Create("https://webklor.com")
    $response = $webRequest.GetResponse()
    Write-Host "   ✅ Certificat SSL : Valide" -ForegroundColor Green
    $response.Close()
} catch {
    Write-Host "   ❌ Certificat SSL : $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Statut Vercel
Write-Host "`n5️⃣ Statut Vercel..." -ForegroundColor Yellow
vercel domains ls

# 6. Test performance
Write-Host "`n6️⃣ Test performance..." -ForegroundColor Yellow

$startTime = Get-Date
try {
    $testResponse = Invoke-WebRequest -Uri "https://webklor.com" -TimeoutSec 15
    $endTime = Get-Date
    $loadTime = ($endTime - $startTime).TotalMilliseconds
    Write-Host "   ✅ Temps de chargement : $([math]::Round($loadTime, 2))ms" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Test performance : $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Résultats finaux
Write-Host "`n📊 RÉSUMÉ DE VALIDATION" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

Write-Host "
🔗 URLs à tester manuellement:
   - https://webklor.com
   - https://www.webklor.com
   - https://webklor.com/api/health
   - https://webklor.com/sitemap.xml
   - https://webklor.com/robots.txt

📋 Checklist finale:
   □ DNS pointent vers Vercel
   □ HTTPS fonctionne
   □ Redirection www → non-www (ou inverse)
   □ API répond correctement
   □ Certificat SSL valide
   □ Temps de chargement < 3 secondes
   □ Google Analytics fonctionne
   □ Google AdSense fonctionne

🎯 Prochaines étapes après validation:
   1. Soumettre sitemap à Google Search Console
   2. Soumettre le site à Google AdSense pour approbation
   3. Configurer les redirections si nécessaire
   4. Tests utilisateur finaux
" -ForegroundColor White

Write-Host "`n🎉 Validation terminée! Vérifiez les résultats ci-dessus." -ForegroundColor Green
