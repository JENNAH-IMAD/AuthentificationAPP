# BackendAuth + FrontendAuth

Ce projet est une solution complète d'authentification et de gestion des utilisateurs, composée d'un backend ASP.NET Core (BackendAuth) et d'un frontend Next.js/React (FrontendAuth).

## Structure du projet

```
V1/
├── BackendAuth/      # API .NET Core (C#)
│   └── BackendAuth/  # Code source backend
├── FrontendAuth/     # Application Next.js (React, TypeScript)
```

## 1. BackendAuth (API .NET Core)
- Fournit l'API REST pour l'authentification, la gestion des utilisateurs et des rôles.
- Utilise JWT pour la sécurité.
- Stocke les utilisateurs, rôles, permissions, etc.

### Lancer le backend
```bash
cd BackendAuth/BackendAuth
# Pour Windows
# Ouvrir dans Visual Studio OU
# En ligne de commande :
dotnet run
```
L'API sera disponible sur http://localhost:5232 par défaut.

## 2. FrontendAuth (Next.js)
- Interface utilisateur moderne pour se connecter, gérer les utilisateurs, rôles, etc.
- Utilise React, Next.js, Tailwind CSS.
- Communique avec l'API BackendAuth.

### Lancer le frontend
```bash
cd FrontendAuth
npm install
npm run dev
```
L'application sera disponible sur http://localhost:3000

## 3. Déploiement sur GitHub
- Initialisez un dépôt Git à la racine (`/V1`)
- Ajoutez tous les fichiers, puis poussez sur GitHub :
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-utilisateur/votre-repo.git
git push -u origin main
```

## 4. Documentation
- Chaque dossier (`FrontendAuth`, `BackendAuth`) contient son propre README pour plus de détails techniques.

## 5. Auteurs
- Projet réalisé par [Votre Nom] (remplacez ici)

---
Pour toute question, ouvrez une issue sur GitHub ! 