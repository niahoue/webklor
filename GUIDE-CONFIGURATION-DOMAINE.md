# 🎯 GUIDE CONFIGURATION DOMAINE WEBKLOR.COM
**Date**: 27 mai 2025
**Status**: Configuration requise via dashboard Vercel

## 📋 SITUATION ACTUELLE

✅ **Application déployée**: https://webklor-livraison-niahoues-projects.vercel.app  
✅ **Variables d'environnement configurées**: MongoDB, JWT, Email  
✅ **Google Analytics intégré**: G-FWGHPFWF0T  
✅ **Google AdSense intégré**: ca-pub-1157924148207745  
✅ **SEO optimisé**: Sitemap, robots.txt, métadonnées complètes  

🔄 **À faire**: Configuration domaine webklor.com

## 🌐 ÉTAPES CONFIGURATION DOMAINE

### 1️⃣ Configuration via Dashboard Vercel

**URL**: https://vercel.com/niahoues-projects/webklor-livraison

**Étapes**:
1. Aller sur le dashboard Vercel
2. Sélectionner le projet `webklor-livraison`
3. Aller dans **Settings** → **Domains**
4. Cliquer sur **Add Domain**
5. Entrer `webklor.com`
6. Cliquer sur **Add**
7. Répéter pour `www.webklor.com`

### 2️⃣ Configuration DNS chez votre Registrar

**Enregistrements à configurer**:

```dns
# Enregistrement A (domaine principal)
Type: A
Name: @ (ou laisser vide)
Value: 76.76.19.61
TTL: 3600

# Enregistrement CNAME (sous-domaine www)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Providers courants**:
- **OVH**: Aller dans Web Cloud → Noms de domaine → Votre domaine → Zone DNS
- **Cloudflare**: Dashboard → DNS → Records
- **GoDaddy**: Gestionnaire de domaines → DNS → Enregistrements
- **Namecheap**: Dashboard → Manage → Advanced DNS

### 3️⃣ Validation de la Configuration

**Commandes de test**:
```bash
# Test résolution DNS
nslookup webklor.com
nslookup www.webklor.com

# Test HTTPS
curl -I https://webklor.com
curl -I https://www.webklor.com

# Test API
curl https://webklor.com/api/health
```

**URLs à tester**:
- https://webklor.com
- https://www.webklor.com
- https://webklor.com/api/health
- https://webklor.com/sitemap.xml
- https://webklor.com/robots.txt

## 🔧 COMMANDES VERCEL UTILES

```bash
# Voir les domaines configurés
vercel domains list

# Voir les projets
vercel project ls

# Voir les déploiements
vercel ls

# Redéployer en production
vercel --prod

# Voir les logs d'un déploiement
vercel logs https://webklor.com
```

## ⚠️ DÉPANNAGE COURANT

### Erreur "Domain already assigned"
**Solution**: Le domaine peut être assigné à un autre projet dans votre compte. Vérifiez tous vos projets Vercel.

### DNS ne se propage pas
**Solution**: 
- Vérifiez les enregistrements DNS chez votre registrar
- Attendez 15-30 minutes pour la propagation
- Utilisez `nslookup` pour tester

### Certificat SSL ne s'active pas
**Solution**:
- Attendez que les DNS se propagent complètement
- Le certificat Let's Encrypt s'active automatiquement
- Peut prendre jusqu'à 24h dans certains cas

## 📊 CHECKLIST FINALE

### Configuration Domaine
- [ ] Domaine ajouté sur Vercel dashboard
- [ ] Enregistrement A configuré: @ → 76.76.19.61
- [ ] Enregistrement CNAME configuré: www → cname.vercel-dns.com
- [ ] DNS propagés (test nslookup)
- [ ] HTTPS accessible sur webklor.com
- [ ] HTTPS accessible sur www.webklor.com
- [ ] Redirection www configurée (si nécessaire)

### Tests Fonctionnels
- [ ] Page d'accueil charge correctement
- [ ] API fonctionne: /api/health
- [ ] Newsletter fonctionne: /api/newsletter/subscribe
- [ ] Contact fonctionne: /api/contact
- [ ] Google Analytics track les visites
- [ ] Google AdSense affiche (après approbation)

### SEO et Performance
- [ ] Sitemap accessible: webklor.com/sitemap.xml
- [ ] Robots.txt accessible: webklor.com/robots.txt
- [ ] Métadonnées Open Graph fonctionnent
- [ ] Temps de chargement < 3 secondes
- [ ] Score PageSpeed > 90

## 🎯 PROCHAINES ÉTAPES APRÈS DOMAINE

### 1. Soumission SEO
```bash
# Google Search Console
https://search.google.com/search-console/
# Ajouter la propriété webklor.com
# Soumettre le sitemap: webklor.com/sitemap.xml

# Bing Webmaster Tools  
https://www.bing.com/webmasters/
# Ajouter le site webklor.com
# Soumettre le sitemap
```

### 2. Validation Google AdSense
```bash
# Dashboard AdSense
https://www.google.com/adsense/
# Ajouter le site webklor.com
# Attendre l'approbation (1-7 jours)
# Configurer les emplacements publicitaires
```

### 3. Monitoring et Analytics
```bash
# Google Analytics
https://analytics.google.com/
# Vérifier les données du site webklor.com
# Configurer les objectifs de conversion

# Vercel Analytics
# Dashboard Vercel → Analytics
# Surveiller les performances et erreurs
```

## 🚀 STATUT FINAL ATTENDU

✅ **Application Production**: https://webklor.com  
✅ **API Fonctionnelle**: https://webklor.com/api/health  
✅ **SEO Optimisé**: Sitemap soumis à Google  
✅ **Monétisation Active**: Google AdSense approuvé  
✅ **Analytics Tracking**: Google Analytics fonctionnel  
✅ **Performance**: Score PageSpeed > 90  
✅ **Sécurité**: HTTPS avec certificat valide  

---

**PROCHAIN SCRIPT À EXÉCUTER**: `validate-webklor-domain.ps1` (après configuration DNS)
