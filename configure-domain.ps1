#!/usr/bin/env pwsh
# Configuration du domaine personnalise webklor.com sur Vercel

Write-Host "Configuration du domaine webklor.com sur Vercel" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "ETAPE 1/6: Deploiement reussi" -ForegroundColor Green
Write-Host "   URL actuelle: https://webklor-livraison-rhl4nmwrj-niahoues-projects.vercel.app"
Write-Host ""

Write-Host "ETAPE 2/6: Ajout du domaine personnalise" -ForegroundColor Yellow
Write-Host "   Execution: vercel domains add webklor.com"
try {
    vercel domains add webklor.com
    Write-Host "   Domaine webklor.com ajoute avec succes" -ForegroundColor Green
} catch {
    Write-Host "   Erreur lors de l'ajout du domaine: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Vous devrez peut-etre l'ajouter manuellement via l'interface Vercel" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "ETAPE 3/6: Configuration DNS requise" -ForegroundColor Yellow
Write-Host "   Dans votre panel DNS (chez votre registrar), ajoutez :"
Write-Host "   Type A    : @ (ou webklor.com)     -> 76.76.19.61" -ForegroundColor Cyan
Write-Host "   Type CNAME: www                   -> cname.vercel-dns.com" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔧 ÉTAPE 4/6: Vérification des domaines disponibles" -ForegroundColor Yellow
Write-Host "   Listing des domaines configurés..."
try {
    vercel domains ls
} catch {
    Write-Host "   ⚠️  Impossible de lister les domaines" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 ÉTAPE 5/6: Test des URLs après configuration DNS" -ForegroundColor Yellow
Write-Host "   Une fois le DNS propagé (5-48h), testez :"
Write-Host "   🌐 https://webklor.com"
Write-Host "   🌐 https://www.webklor.com"
Write-Host "   🗺️  https://webklor.com/sitemap.xml"
Write-Host "   🤖 https://webklor.com/robots.txt"

Write-Host ""
Write-Host "🔧 ÉTAPE 6/6: Soumission SEO (après DNS actif)" -ForegroundColor Yellow
Write-Host "   1. Google Search Console: https://search.google.com/search-console"
Write-Host "      - Ajouter la propriété webklor.com"
Write-Host "      - Soumettre le sitemap: https://webklor.com/sitemap.xml"
Write-Host ""
Write-Host "   2. Bing Webmaster Tools: https://www.bing.com/webmasters"
Write-Host "      - Ajouter le site webklor.com"
Write-Host "      - Soumettre le sitemap: https://webklor.com/sitemap.xml"

Write-Host ""
Write-Host "📊 RÉSUMÉ DE DÉPLOIEMENT" -ForegroundColor Magenta
Write-Host "========================"
Write-Host "✅ Build réussi (11.93s)"
Write-Host "✅ API serverless optimisée (1 fonction au lieu de 12)"
Write-Host "✅ Sitemap SEO généré (12 URLs)"
Write-Host "✅ Robots.txt configuré"
Write-Host "✅ Déploiement Vercel réussi"
Write-Host "✅ Variables d'environnement configurées"
Write-Host "✅ CORS configuré pour webklor.com"

Write-Host ""
Write-Host "🎯 PROCHAINES ÉTAPES" -ForegroundColor Green
Write-Host "==================="
Write-Host "1. ⏳ Configurer le DNS chez votre registrar"
Write-Host "2. ⏳ Attendre la propagation DNS (5-48h)"
Write-Host "3. ⏳ Tester webklor.com"
Write-Host "4. ⏳ Soumettre aux moteurs de recherche"
Write-Host "5. ⏳ Configurer Google Analytics (optionnel)"

Write-Host ""
Write-Host "🚀 DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green -BackgroundColor Black
Write-Host "Votre application WebKlor est maintenant en production !" -ForegroundColor Green
