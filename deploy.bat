@echo off
echo ==========================================
echo       SCRIPT DE DEPLOIEMENT WEBKLOR
echo ==========================================
echo.

:: Vérifier si Node.js est installé
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installé ou pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

:: Vérifier si npm est installé
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] npm n'est pas installé
    pause
    exit /b 1
)

echo [INFO] Node.js et npm détectés
echo.

:: Nettoyer les builds précédents
echo [ETAPE 1/6] Nettoyage des builds précédents...
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo [OK] Nettoyage terminé
echo.

:: Installation des dépendances frontend
echo [ETAPE 2/6] Installation des dépendances frontend...
npm ci
if %errorlevel% neq 0 (
    echo [ERREUR] Échec de l'installation des dépendances frontend
    pause
    exit /b 1
)
echo [OK] Dépendances frontend installées
echo.

:: Installation des dépendances backend
echo [ETAPE 3/6] Installation des dépendances backend...
cd server
npm ci
if %errorlevel% neq 0 (
    echo [ERREUR] Échec de l'installation des dépendances backend
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Dépendances backend installées
echo.

:: Build de production
echo [ETAPE 4/6] Build de production du frontend...
npm run build
if %errorlevel% neq 0 (
    echo [ERREUR] Échec du build de production
    pause
    exit /b 1
)
echo [OK] Build de production terminé
echo.

:: Vérification des fichiers de production
echo [ETAPE 5/6] Vérification des fichiers de production...
if not exist dist (
    echo [ERREUR] Le dossier dist n'a pas été créé
    pause
    exit /b 1
)
if not exist dist\index.html (
    echo [ERREUR] Le fichier index.html n'a pas été généré
    pause
    exit /b 1
)
echo [OK] Fichiers de production vérifiés
echo.

:: Affichage du résumé
echo [ETAPE 6/6] Résumé du déploiement...
echo.
echo ==========================================
echo         DEPLOIEMENT TERMINÉ AVEC SUCCÈS
echo ==========================================
echo.
echo Fichiers de production générés dans : dist/
echo.
echo Pour démarrer l'application :
echo   1. Backend  : cd server && npm start
echo   2. Frontend : Servir le dossier dist/
echo.
echo Options de déploiement :
echo   - Netlify/Vercel : Connecter le repo GitHub
echo   - VPS : Copier dist/ vers /var/www/
echo   - Docker : Utiliser les Dockerfiles fournis
echo.
echo Pour plus d'informations, consultez DEPLOYMENT.md
echo ==========================================

pause