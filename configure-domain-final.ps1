# Configuration du domaine webklor.com sur Vercel
# Exécuter ce script après avoir acheté et configuré le domaine

Write-Host "🚀 Configuration du domaine webklor.com pour WebKlor" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

# Vérifier si Vercel CLI est installé
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI détecté: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: Vercel CLI n'est pas installé" -ForegroundColor Red
    Write-Host "Installez avec: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 ÉTAPES DE CONFIGURATION DU DOMAINE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "1️⃣ Configuration DNS (à faire chez votre registrar)" -ForegroundColor Yellow
Write-Host "   A Record: @ → 76.76.19.61" -ForegroundColor White
Write-Host "   CNAME: www → cname.vercel-dns.com" -ForegroundColor White

Write-Host ""
Write-Host "2️⃣ Ajout du domaine sur Vercel..." -ForegroundColor Yellow

# Ajouter le domaine principal
Write-Host "Ajout de webklor.com..." -ForegroundColor Cyan
try {
    vercel domains add webklor.com
    Write-Host "✅ Domaine webklor.com ajouté avec succès" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erreur lors de l'ajout de webklor.com" -ForegroundColor Yellow
    Write-Host "Vérifiez manuellement sur https://vercel.com/dashboard" -ForegroundColor White
}

Write-Host ""

# Ajouter le sous-domaine www
Write-Host "Ajout de www.webklor.com..." -ForegroundColor Cyan
try {
    vercel domains add www.webklor.com
    Write-Host "✅ Sous-domaine www.webklor.com ajouté avec succès" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Erreur lors de l'ajout de www.webklor.com" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3️⃣ Vérification des domaines..." -ForegroundColor Yellow
vercel domains ls

Write-Host ""
Write-Host "🎉 CONFIGURATION TERMINÉE !" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Actions suivantes recommandées:" -ForegroundColor Cyan
Write-Host "   1. Vérifiez la propagation DNS (24-48h max)" -ForegroundColor White
Write-Host "   2. Testez https://webklor.com dans un navigateur" -ForegroundColor White
Write-Host "   3. Soumettez le sitemap à Google Search Console" -ForegroundColor White
Write-Host "   4. Configurez Google Analytics (optionnel)" -ForegroundColor White

Write-Host ""
Write-Host "🔗 Liens utiles:" -ForegroundColor Cyan
Write-Host "   • Dashboard Vercel: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   • Site en production: https://webklor.com" -ForegroundColor White
Write-Host "   • Sitemap: https://webklor.com/sitemap.xml" -ForegroundColor White

Write-Host ""
Write-Host "📧 Support: En cas de problème, vérifiez la documentation Vercel" -ForegroundColor Yellow
Write-Host "https://vercel.com/docs/concepts/projects/domains" -ForegroundColor White

Write-Host ""
Write-Host "🎊 Félicitations ! WebKlor est maintenant en production !" -ForegroundColor Magenta
