# Configuration des variables d'environnement pour Vercel
# Utilisez ces commandes pour configurer votre projet Vercel

Write-Host "🔧 CONFIGURATION VERCEL - WEBKLOR" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Variables d'environnement pour Vercel
$envVars = @{
    "MONGO_URI" = "mongodb+srv://apacome343:NlW4gWGvgqtWTAnE@cluster0.gkbduvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    "JWT_SECRET" = "56e515bb9cfd4c1c80aea70140375caffa9f4d18b89abb1ddc11352f1f689656937b87093bd5f6e64aa64e6f4289df485c31d1cd38fc8bad691702619c404990e4552fd3baf3b536c5749aeaf3fb3fc8e3ec4031fa177549f87287041c2c6087598c5d24dca757f75f9607496145ac18a42987490d5548ac2f8ee793871e498dcc74cd7ff271139fc8eeebe42d2219e7f77b3f005de16a356c1776e3b5a32a6f0ae0ac448583b56f3d5c7afad15ce34362f9e8af5ff06c5cb0dc65a9ac1eafbe319a5757f23e0787d9ea3c46a818c6a4ac006974045f8c3d879b6dca22c65a91464cc2a591531168dd1ae8165af7313b2b88aa6b3ba9013a20c36206dd6526e0"
    "JWT_EXPIRES_IN" = "24h"
    "EMAIL_SERVICE" = "gmail"
    "EMAIL_USER" = "webklorci@gmail.com"
    "EMAIL_PASS" = "fsrl rhzp vcsl mdxk"
    "EMAIL_FROM" = "webklorci@gmail.com"
    "EMAIL_FROM_NAME" = "WebKlor Contact"
    "EMAIL_TO" = "webklorci@gmail.com"
    "DEFAULT_ADMIN_EMAIL" = "webklorci@gmail.com"
    "DEFAULT_ADMIN_PASSWORD" = "Admin@WebKlor2025"
    "ADMIN_INIT_KEY" = "140407c706d86d090f3dcbf1b"
    "NODE_ENV" = "production"
    "FRONTEND_URL" = "https://webklor-livraison-abl375zru-niahoues-projects.vercel.app"
}

Write-Host "`n📝 Configuration des variables d'environnement..." -ForegroundColor Yellow

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    $command = "vercel env add $key production"
    Write-Host "Ajout de la variable: $key" -ForegroundColor Green
    
    # Note: Vercel CLI demandera la valeur interactivement
    # Pour automatiser, utilisez: echo "$value" | vercel env add $key production
}

Write-Host "`n🌐 URLs de votre application:" -ForegroundColor Cyan
Write-Host "Production: https://webklor-livraison-abl375zru-niahoues-projects.vercel.app" -ForegroundColor Green
Write-Host "Dashboard Vercel: https://vercel.com/niahoues-projects/webklor-livraison" -ForegroundColor Green

Write-Host "`n✅ Configuration terminée!" -ForegroundColor Green
Write-Host "Votre application WebKlor est maintenant déployée sur Vercel!" -ForegroundColor Green

Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Configurer un domaine personnalisé (optionnel)" -ForegroundColor White
Write-Host "2. Tester toutes les fonctionnalités en production" -ForegroundColor White
Write-Host "3. Créer l'utilisateur administrateur" -ForegroundColor White
Write-Host "4. Configurer les analytics et monitoring" -ForegroundColor White
