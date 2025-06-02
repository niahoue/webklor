# 🔒 Guide de Sécurité WebKlor

## ⚠️ Fichiers Sensibles

### Variables d'Environnement
Le fichier `.env` contient des informations sensibles et **NE DOIT JAMAIS** être committé sur Git.

**✅ Fichiers protégés par .gitignore :**
- `.env` - Variables d'environnement avec clés secrètes
- `.env.local` - Variables locales
- `.env.production` - Variables de production
- `*.key` - Clés privées
- `*.pem` - Certificats

**✅ Fichiers sécurisés à committer :**
- `.env.example` - Template sans données sensibles
- `.gitignore` - Configuration d'exclusion

## 🔧 Configuration Initiale

### 1. Créer votre fichier .env
```bash
# Copiez le template
cp .env.example .env

# Éditez avec vos vraies valeurs
nano .env
```

### 2. Générer des clés sécurisées
```bash
# Générer JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Générer ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🛡️ Bonnes Pratiques

### Mots de passe
- ✅ Minimum 16 caractères
- ✅ Mélange majuscules/minuscules/chiffres/symboles
- ✅ Uniques pour chaque service
- ❌ Jamais de mots de dictionnaire

### Clés API
- ✅ Générer aléatoirement
- ✅ Rotation régulière
- ✅ Permissions minimales
- ❌ Réutiliser entre environnements

### Base de données
- ✅ Utilisateur dédié avec permissions limitées
- ✅ Connexion chiffrée (SSL/TLS)
- ✅ Sauvegardes régulières chiffrées

## 🚀 Déploiement Production

### Variables d'environnement
Utilisez les services secrets de votre plateforme :
- **Vercel** : Variables d'environnement dans le dashboard
- **Netlify** : Site settings → Environment variables
- **Heroku** : Config Vars
- **AWS** : AWS Secrets Manager
- **Azure** : Key Vault

### Checklist avant déploiement
- [ ] Toutes les valeurs "CHANGEZ_..." ont été modifiées
- [ ] JWT_SECRET généré aléatoirement (64+ caractères)
- [ ] ENCRYPTION_KEY généré aléatoirement (32+ caractères)
- [ ] Mots de passe forts pour tous les comptes
- [ ] URLs de production configurées
- [ ] Variables d'environnement configurées sur la plateforme
- [ ] Certificats SSL activés
- [ ] Monitoring activé

## 🔍 Vérifications Git

### Avant chaque commit
```bash
# Vérifier qu'aucun fichier sensible n'est tracké
git status

# Vérifier le contenu des fichiers à committer
git diff --cached

# S'assurer que .env n'apparaît pas
git ls-files | grep -E "\\.env$"
```

### Si .env a été accidentellement committé
```bash
# Supprimer du tracking (AVANT de pusher)
git rm --cached .env
git commit -m "Remove .env from tracking"

# Si déjà pushé : rotation immédiate de TOUTES les clés
```

## 📞 Contact Sécurité

En cas de problème de sécurité :
1. **NE PAS** publier d'issue GitHub publique
2. Contacter directement : security@webklor.com
3. Inclure : description, impact, étapes de reproduction

---

**Rappel important** : La sécurité est la responsabilité de tous. En cas de doute, demandez !
