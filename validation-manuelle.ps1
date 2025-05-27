# Validation manuelle de WebKlor en production
# Ce script fournit les instructions pour tester manuellement le site

Write-Host "========================================" -ForegroundColor Green
Write-Host "  VALIDATION MANUELLE WEBKLOR         " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "URL DE PRODUCTION:" -ForegroundColor Yellow
Write-Host "https://webklor-livraison-9hu4fa7us-niahoues-projects.vercel.app" -ForegroundColor Cyan
Write-Host ""

Write-Host "TESTS A EFFECTUER MANUELLEMENT:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. PAGES PRINCIPALES:" -ForegroundColor White
Write-Host "   - Page d'accueil: /" -ForegroundColor Gray
Write-Host "   - Blog: /blog" -ForegroundColor Gray
Write-Host "   - Contact: /contact" -ForegroundColor Gray
Write-Host "   - A propos: /about" -ForegroundColor Gray
Write-Host "   - Connexion admin: /login" -ForegroundColor Gray
Write-Host ""

Write-Host "2. FICHIERS SEO:" -ForegroundColor White
Write-Host "   - Sitemap: /sitemap.xml" -ForegroundColor Gray
Write-Host "   - Robots: /robots.txt" -ForegroundColor Gray
Write-Host "   - Favicon: /favicon.ico" -ForegroundColor Gray
Write-Host ""

Write-Host "3. API ENDPOINTS:" -ForegroundColor White
Write-Host "   - Health: /api/health" -ForegroundColor Gray
Write-Host "   - Posts: /api/posts" -ForegroundColor Gray
Write-Host "   - Contact: /api/contact (POST)" -ForegroundColor Gray
Write-Host "   - Newsletter: /api/newsletter/subscribe (POST)" -ForegroundColor Gray
Write-Host ""

Write-Host "4. VERIFICATION SEO:" -ForegroundColor White
Write-Host "   - Balises <title> presentes" -ForegroundColor Gray
Write-Host "   - Meta description" -ForegroundColor Gray
Write-Host "   - Open Graph tags" -ForegroundColor Gray
Write-Host "   - JSON-LD structured data" -ForegroundColor Gray
Write-Host ""

Write-Host "5. FONCTIONNALITES:" -ForegroundColor White
Write-Host "   - Navigation entre pages" -ForegroundColor Gray
Write-Host "   - Formulaire de contact" -ForegroundColor Gray
Write-Host "   - Inscription newsletter" -ForegroundColor Gray
Write-Host "   - Interface admin (connexion)" -ForegroundColor Gray
Write-Host ""

Write-Host "CHECKLIST DE VALIDATION:" -ForegroundColor Yellow
Write-Host ""

$checkList = @(
    "[ ] Page d'accueil se charge correctement",
    "[ ] Navigation fonctionne",
    "[ ] Page blog affiche les articles",
    "[ ] Formulaire de contact accessible",
    "[ ] Newsletter fonctionne",
    "[ ] Page admin/login accessible",
    "[ ] Sitemap.xml existe et est valide",
    "[ ] Robots.txt configure correctement",
    "[ ] Favicon s'affiche",
    "[ ] SEO tags presents (title, description)",
    "[ ] Performance acceptable (< 3s)",
    "[ ] Design responsive",
    "[ ] Aucune erreur console"
)

foreach ($item in $checkList) {
    Write-Host $item -ForegroundColor Cyan
}

Write-Host ""
Write-Host "TESTS AUTOMATIQUES ALTERNATIFS:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Pour tester depuis le navigateur, ouvrez la console (F12) et executez:" -ForegroundColor White
Write-Host ""

$jsTest = @"
// Test API Health
fetch('/api/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))
  .catch(e => console.log('Health Error:', e));

// Test API Posts
fetch('/api/posts')
  .then(r => r.json())
  .then(d => console.log('Posts:', d))
  .catch(e => console.log('Posts Error:', e));

// Test de performance
const start = performance.now();
fetch('/')
  .then(() => {
    const loadTime = performance.now() - start;
    console.log(`Load time: ${loadTime.toFixed(2)}ms`);
  });
"@

Write-Host $jsTest -ForegroundColor Gray

Write-Host ""
Write-Host "VERIFICATION DU CONTENU HTML:" -ForegroundColor Yellow
Write-Host "Verifiez la presence de ces elements dans le source de la page:" -ForegroundColor White
Write-Host ""

$htmlChecks = @(
    '<title>WebKlor',
    'name="description"',
    'property="og:title"',
    'application/ld+json',
    'Google Analytics',
    'Bootstrap CSS',
    'React components'
)

foreach ($check in $htmlChecks) {
    Write-Host "  - $check" -ForegroundColor Gray
}

Write-Host ""
Write-Host "RESULTATS ATTENDUS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Site accessible sans erreur 401" -ForegroundColor Green
Write-Host "✅ Toutes les pages se chargent" -ForegroundColor Green
Write-Host "✅ API repond correctement" -ForegroundColor Green
Write-Host "✅ SEO elements presents" -ForegroundColor Green
Write-Host "✅ Performance acceptable" -ForegroundColor Green

Write-Host ""
Write-Host "PROBLEMES POSSIBLES ET SOLUTIONS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Erreur 401 (Non autorise):" -ForegroundColor Red
Write-Host "  - Vercel protection activee" -ForegroundColor Gray
Write-Host "  - Solution: Configurer domaine personnalise" -ForegroundColor Gray
Write-Host "  - Ou: Desactiver protection dans Vercel dashboard" -ForegroundColor Gray
Write-Host ""
Write-Host "API ne repond pas:" -ForegroundColor Red
Write-Host "  - Variables d'environnement manquantes" -ForegroundColor Gray
Write-Host "  - Probleme de routing" -ForegroundColor Gray
Write-Host "  - Base de donnees inaccessible" -ForegroundColor Gray
Write-Host ""
Write-Host "Pages ne se chargent pas:" -ForegroundColor Red
Write-Host "  - Erreur de build" -ForegroundColor Gray
Write-Host "  - Probleme de SPA routing" -ForegroundColor Gray
Write-Host "  - Assets manquants" -ForegroundColor Gray

Write-Host ""
Write-Host "PROCHAINES ETAPES:" -ForegroundColor Green
Write-Host "1. Ouvrir l'URL dans le navigateur" -ForegroundColor Cyan
Write-Host "2. Effectuer les tests manuels" -ForegroundColor Cyan
Write-Host "3. Verifier les elements de la checklist" -ForegroundColor Cyan
Write-Host "4. Noter les problemes rencontres" -ForegroundColor Cyan
Write-Host "5. Configurer le domaine personnalise si necessaire" -ForegroundColor Cyan

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Guide de validation genere le: $(Get-Date)" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Green
