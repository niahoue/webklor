# Configuration Domaine WebKlor.com sur Vercel
# Date: 27 mai 2025

Write-Host "CONFIGURATION DOMAINE WEBKLOR.COM" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# 1. Verifier le projet actuel
Write-Host "`n1. Verification du projet Vercel..." -ForegroundColor Yellow
vercel ls

# 2. Obtenir les informations du projet
Write-Host "`n2. Informations du projet actuel:" -ForegroundColor Yellow
vercel project ls

# 3. Configuration du domaine personnalise
Write-Host "`n3. Configuration du domaine webklor.com..." -ForegroundColor Yellow
Write-Host "   Ajout du domaine au projet Vercel..." -ForegroundColor Cyan

# Ajouter le domaine webklor.com
vercel domains add webklor.com

# Ajouter aussi le sous-domaine www (recommande)
Write-Host "`n   Ajout du sous-domaine www.webklor.com..." -ForegroundColor Cyan
vercel domains add www.webklor.com

# 4. Verifier la configuration des domaines
Write-Host "`n4. Verification des domaines configures:" -ForegroundColor Yellow
vercel domains ls

# 5. Obtenir les configurations DNS requises
Write-Host "`n5. Informations DNS a configurer chez votre registrar:" -ForegroundColor Yellow
Write-Host "   Configuration DNS requise:" -ForegroundColor Cyan
Write-Host @"
   
   A Record:
   Name: @ (racine du domaine)
   Value: 76.76.19.61
   TTL: 3600

   CNAME Record:
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
"@ -ForegroundColor White

# 6. Test de connectivite
Write-Host "`n6. Test de la configuration..." -ForegroundColor Yellow

# Verifier si le domaine pointe deja vers Vercel
Write-Host "   Test DNS pour webklor.com..." -ForegroundColor Cyan
nslookup webklor.com

Write-Host "   Test DNS pour www.webklor.com..." -ForegroundColor Cyan  
nslookup www.webklor.com

# 7. Redeploiement avec le nouveau domaine
Write-Host "`n7. Redeploiement avec configuration domaine..." -ForegroundColor Yellow
vercel --prod

# 8. Instructions finales
Write-Host "`nCONFIGURATION TERMINEE" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host @"

PROCHAINES ETAPES:

1. Connectez-vous a votre panneau de gestion DNS chez votre registrar
2. Ajoutez les enregistrements DNS suivants:
   
   A Record:
   Name: @ (ou vide)
   Value: 76.76.19.61
   TTL: 3600
   
   CNAME Record:
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600

3. Attendez la propagation DNS (5-30 minutes)
4. Verifiez l'acces a https://webklor.com
5. Testez toutes les fonctionnalites

URLs de test:
   - https://webklor.com
   - https://www.webklor.com
   - https://webklor.com/api/health

Pour verifier le statut:
   vercel domains ls
   vercel ls --prod
"@ -ForegroundColor White

Write-Host "`nConfiguration du domaine webklor.com initiee avec succes!" -ForegroundColor Green
