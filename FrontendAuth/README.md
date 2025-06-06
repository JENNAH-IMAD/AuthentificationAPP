# FrontendAuth - Interface Web

🎨 **Interface utilisateur moderne en Next.js 13 avec TypeScript et Tailwind CSS**

Interface web complète pour interagir avec l'API BackendAuth, avec authentification JWT et gestion des rôles.

## 🎯 Fonctionnalités

✅ **Interface de connexion moderne** avec validation en temps réel  
✅ **Dashboard interactif** avec statistiques et activités  
✅ **Gestion des utilisateurs** (réservée aux Admins)  
✅ **Authentification JWT** automatique avec refresh  
✅ **Thème sombre/clair** avec persistance  
✅ **Design responsive** pour mobile et desktop  
✅ **Navigation sécurisée** avec middleware  
✅ **Notifications toast** pour le feedback utilisateur  

## 🛠 Technologies

- **Next.js 13** - Framework React avec App Router
- **TypeScript** - Type safety et IntelliSense
- **Tailwind CSS** - Styling utilitaire
- **Radix UI** - Composants accessibles
- **shadcn/ui** - Système de design
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation des schémas
- **Sonner** - Notifications toast

## 🚀 Installation et Configuration

### 1. Installation des dépendances
```bash
cd FrontendAuth
npm install
```

### 2. Configuration des variables d'environnement
Créez un fichier `.env.local` à la racine du projet :

```env
# URL de l'API Backend
NEXT_PUBLIC_API_URL=https://localhost:5232/api

# Environnement
NODE_ENV=development
```

### 3. Démarrage du serveur de développement
```bash
npm run dev
```

L'application sera disponible sur : `http://localhost:3000`

## 🔗 Connexion avec le Backend

Assurez-vous que :
1. **BackendAuth API** est démarrée sur `https://localhost:5232`
2. **PostgreSQL** est en cours d'exécution
3. **CORS** est configuré pour autoriser `http://localhost:3000`

## 👤 Connexion par défaut

Utilisez les identifiants de l'administrateur seedé :
- **Email** : `admin@backend.com`
- **Mot de passe** : `Admin123*`

## 📱 Pages et Fonctionnalités

### 🔐 Page de Connexion (`/login`)
- Formulaire de connexion avec validation
- Bouton "Utiliser les identifiants Admin" pour démo
- Gestion d'erreurs avec messages explicites
- Redirection automatique si déjà connecté

### 🏠 Dashboard (`/home`)
- Vue d'ensemble avec statistiques
- Affichage des rôles utilisateur
- Activités récentes (données fictives)
- Aperçu des permissions par rôle

### 👥 Gestion des Utilisateurs (`/users`) 🔒
*Accès réservé aux Administrateurs*

- **Liste des utilisateurs** avec informations complètes
- **Créer** un nouvel utilisateur avec rôles multiples
- **Modifier** les informations utilisateur
- **Supprimer** un utilisateur (avec protections)
- **Indicateurs visuels** pour les rôles et statuts

### ⚙️ Paramètres (`/settings`)
- Configuration du profil utilisateur
- Préférences de l'interface

## 🔒 Système de Sécurité

### Authentification
- **Tokens JWT** stockés en localStorage et cookies
- **Validation automatique** des tokens à chaque requête
- **Refresh automatique** de l'état utilisateur
- **Déconnexion automatique** en cas de token invalide

### Autorisation
- **Middleware Next.js** pour protéger les routes
- **Vérification des rôles** côté client et serveur
- **Redirection automatique** selon les permissions
- **Protection contre l'auto-suppression** et suppression admin principal

### Rôles et Permissions
| Rôle | Dashboard | Gestion Utilisateurs | Autres |
|------|-----------|---------------------|--------|
| **Admin** | ✅ | ✅ Complet | ✅ Tout |
| **Manager** | ✅ | ❌ | ✅ Lecture |
| **Employé** | ✅ | ❌ | ✅ Limité |

## 🎨 Interface Utilisateur

### Composants Principaux
- **Header** avec profil utilisateur et déconnexion
- **Sidebar** pour la navigation (mobile/desktop)
- **Theme Toggle** pour basculer sombre/clair
- **Modals** pour les actions CRUD
- **Tables** responsives avec actions

### Design System
- **Couleurs** cohérentes avec CSS variables
- **Typographie** optimisée pour la lisibilité
- **Animations** subtiles pour les transitions
- **Icônes** de Lucide React
- **Layout responsive** avec Tailwind CSS

## 🛡️ Gestion d'État

### Contexte d'Authentification (`AuthContext`)
```typescript
interface AuthContextType {
  user: User | null;           // Utilisateur connecté
  isLoading: boolean;          // État de chargement
  isAuthenticated: boolean;    // Statut de connexion
  login: (credentials) => Promise<void>;   // Connexion
  logout: () => void;          // Déconnexion
  checkAuth: () => Promise<void>;          // Vérification token
}
```

### API Client (`lib/api.ts`)
- **Client HTTP** avec gestion d'erreurs
- **Intercepteurs** pour les tokens automatiques
- **Types TypeScript** pour toutes les réponses
- **Gestion des erreurs** réseau et serveur

## 📁 Structure du Projet

```
FrontendAuth/
├── app/                     # App Router Next.js 13
│   ├── (protected)/        # Routes protégées
│   │   ├── home/           # Dashboard
│   │   ├── users/          # Gestion utilisateurs
│   │   └── settings/       # Paramètres
│   ├── login/              # Page de connexion
│   ├── layout.tsx          # Layout racine
│   ├── page.tsx            # Page d'accueil
│   └── middleware.ts       # Middleware sécurité
├── components/             # Composants réutilisables
│   ├── ui/                # Composants shadcn/ui
│   ├── header.tsx         # En-tête
│   ├── sidebar.tsx        # Navigation
│   └── theme-*.tsx        # Gestion thèmes
├── context/               # Contextes React
│   └── auth-context.tsx   # Authentification
├── lib/                   # Utilitaires
│   ├── api.ts            # Client API
│   └── cookies.ts        # Gestion cookies
├── types/                 # Types TypeScript
│   └── auth.ts           # Types authentification
└── hooks/                 # Hooks personnalisés
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Démarrer en mode développement
npm run build        # Construire pour production
npm run start        # Démarrer en mode production
npm run lint         # Vérifier le code

# Utilitaires
npm run type-check   # Vérification TypeScript
```

## 🌐 Configuration de Production

### Variables d'environnement
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NODE_ENV=production
```

### Déploiement
1. **Build** : `npm run build`
2. **Test** : `npm run start`
3. **Deploy** sur Vercel, Netlify, ou serveur

### Optimisations
- **Images** optimisées avec Next.js Image
- **Fonts** préchargées avec next/font
- **Code splitting** automatique
- **Bundle analysis** avec `@next/bundle-analyzer`

## 🐛 Dépannage

### Erreur de connexion à l'API
1. Vérifiez que BackendAuth est démarré
2. Vérifiez l'URL dans `.env.local`
3. Vérifiez les certificats HTTPS en développement

### Problème d'authentification
1. Videz le localStorage : `localStorage.clear()`
2. Supprimez les cookies d'auth
3. Rechargez la page

### Erreur de build
1. Vérifiez les types TypeScript : `npm run type-check`
2. Vérifiez le linting : `npm run lint`
3. Nettoyez le cache : `rm -rf .next`

## 📝 Développement

### Ajouter une nouvelle page protégée
1. Créer dans `app/(protected)/nouvelle-page/`
2. Le middleware protégera automatiquement
3. Utiliser `useAuth()` pour accéder à l'utilisateur

### Ajouter un nouvel endpoint API
1. Ajouter la fonction dans `lib/api.ts`
2. Créer les types dans `types/auth.ts`
3. Utiliser dans les composants

### Modifier le thème
1. Éditer les variables CSS dans `app/globals.css`
2. Utiliser les classes Tailwind existantes
3. Tester en mode sombre et clair

---

🎉 **Votre interface FrontendAuth est maintenant prête à l'emploi !**

> **Note** : Assurez-vous que BackendAuth API est démarrée avant d'utiliser l'interface. 
