@echo off
echo Déploiement de WebKlor en production...

echo.
echo 1. Installation des dépendances...
call npm install

echo.
echo 2. Installation des dépendances du serveur...
cd server
call npm install
cd ..

echo.
echo 3. Création du build de production...
call npm run build

echo.
echo 4. Vérification des fichiers de build...
if exist "dist\" (
    echo ✅ Build créé avec succès dans le dossier dist/
) else (
    echo ❌ Erreur lors de la création du build
    exit /b 1
)

echo.
echo 5. Prêt pour le déploiement !
echo.
echo Instructions suivantes :
echo - Uploadez le dossier 'dist/' sur votre serveur web
echo - Configurez votre serveur pour servir les fichiers statiques
echo - Déployez le dossier 'server/' sur votre serveur Node.js
echo - Configurez les variables d'environnement (.env)
echo - Démarrez le serveur avec 'npm start'
echo.
pause
