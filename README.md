# 🔐 AuthFullStackApp – Système Complet d’Authentification et de Gestion des Utilisateurs

Application complète d’authentification full-stack incluant une **API sécurisée ASP.NET Core 9** et une **interface web moderne en Next.js 13**, avec **gestion des rôles**, **JWT**, **dashboard interactif**, et **CRUD utilisateurs**.
![App Screenshot](https://github.com/JENNAH-IMAD/AuthentificationAPP/raw/main/app%20screen.png)

---

## 🧩 Architecture du Projet

```
AuthFullStackApp/
├── BackendAuth/       # API sécurisée ASP.NET Core 9 + PostgreSQL
└── FrontendAuth/      # Interface Next.js 13 + TypeScript + Tailwind CSS
```

---

## 🚀 Fonctionnalités Principales

✅ Authentification JWT sécurisée  
✅ Gestion des rôles : **Admin**, **Manager**, **Employé**  
✅ Interface responsive avec dashboard et UI moderne  
✅ CRUD complet des utilisateurs (par Admin)  
✅ Connexion frontend-backend sécurisée  
✅ Thème sombre/clair + Navigation sécurisée  
✅ Tokens JWT + refresh automatique + protection CORS  

---

## 📦 Technologies

### Backend
- ASP.NET Core 9
- Entity Framework Core + PostgreSQL
- JWT + BCrypt
- Swagger / OpenAPI

### Frontend
- Next.js 13 (App Router)
- TypeScript, Tailwind CSS
- React Hook Form + Zod
- shadcn/ui + Radix UI + Lucide Icons
- AuthContext + Middleware de protection

---

## 🛠️ Installation & Démarrage

### 1. 🗄 Backend

#### 📋 Prérequis :
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- PostgreSQL (par défaut : `authAPP` sur `localhost:5432`)

#### 🚀 Étapes :
```bash
cd BackendAuth
dotnet restore
dotnet run --launch-profile https
```

> Swagger s’ouvre automatiquement : https://localhost:7232  
> ⚠️ Assurez-vous que la base `authAPP` existe et que l’utilisateur PostgreSQL est configuré.

### 2. 🌐 Frontend

#### 📋 Prérequis :
- Node.js >= 18
- npm

#### 🚀 Étapes :
```bash
cd FrontendAuth
npm install
cp .env.local.example .env.local  # ou créez un .env.local
```

`.env.local` :
```
NEXT_PUBLIC_API_URL=https://localhost:7232/api
NODE_ENV=development
```

```bash
npm run dev
```

> L'interface est disponible sur : http://localhost:3000

---

## 👤 Identifiants de Connexion

- **Email** : `admin@backend.com`  
- **Mot de passe** : `Admin123*`  
> Généré automatiquement à l'initialisation du backend

---

## 📑 Principales Pages de l’Interface

| Page | Description |
|------|-------------|
| `/login` | Connexion sécurisée avec validation |
| `/home` | Dashboard + activités & stats |
| `/users` | 🔐 Gestion des utilisateurs (Admin uniquement) |
| `/settings` | Préférences de l’utilisateur |

---

## 🔐 Sécurité

- Tokens JWT avec expiration
- Hachage Bcrypt des mots de passe
- Middleware Next.js protégeant les routes sensibles
- Autorisation côté client **et** serveur
- Stockage sécurisé dans cookies + localStorage

---

## 🧰 Structure des Dossiers

### 🔙 Backend
```
BackendAuth/
├── Controllers/         # AuthController, UsersController
├── Data/                # ApplicationDbContext
├── Dtos/                # LoginRequestDto, CreateUserDto...
├── Models/              # User, Role, UserRole
├── Security/            # JWT services et configuration
├── Services/            # AuthService, UserService
└── Migrations/          # EF Core migrations
```

### 🔜 Frontend
```
FrontendAuth/
├── app/                 # Routes avec App Router
│   ├── login/           # Connexion
│   ├── (protected)/     # Pages sécurisées : home, users, settings
│   └── middleware.ts    # Middleware de sécurité
├── components/          # UI, Header, Sidebar, Theme Toggle
├── context/             # AuthContext (état utilisateur)
├── lib/                 # API client, cookies utils
├── types/               # Types TypeScript
└── hooks/               # useAuth, useFetch...
```

---

## 🔗 Communication Frontend ⇄ Backend

- API URL configurée via `NEXT_PUBLIC_API_URL`
- CORS activé dans ASP.NET pour `http://localhost:3000`
- Tous les appels API incluent le JWT dans les headers

---

## 🧪 Tester via Swagger

1. POST `/api/auth/login` avec :
```json
{
  "username": "admin",
  "password": "Admin123*"
}
```

2. Copier le token reçu  
3. Autoriser dans Swagger (`Authorize` → `Bearer VOTRE_TOKEN`)  
4. Accéder aux endpoints `/api/users`, `/api/users/{id}` etc.

---

## ⚙️ Configuration & Personnalisation

### Base PostgreSQL
Dans `appsettings.json` du backend :
```json
"DefaultConnection": "Host=localhost;Port=5432;Database=authAPP;Username=postgres;Password=admin"
```

### JWT
```json
"JwtSettings": {
  "SecretKey": "votre_clé_secrète_super_longue_et_complexe",
  "Issuer": "BackendAuthAPI",
  "Audience": "FrontendAuthApp",
  "ExpiryInMinutes": 60
}
```

---

## 🐛 Dépannage

| Problème | Solution |
|---------|----------|
| ⚠️ Erreur connexion API | Vérifie que le backend tourne + bonne URL dans `.env.local` |
| ❌ Token invalide | Vider localStorage + cookies |
| 🌐 Problème CORS | CORS doit autoriser `http://localhost:3000` |
| 🚫 HTTP 403 | Vérifie que le token est bien envoyé + autorisations (rôles) |

---

## 📄 Licence

Ce projet est sous licence **MIT**.  
Tu peux l'utiliser, le modifier et le partager librement.

---

## 🤝 Contributions

Les PR et suggestions sont les bienvenues !  
N'hésite pas à ouvrir une issue.

---

🎉 **Ton système d’authentification full-stack est prêt à l’emploi !**

> Assure-toi que le backend est bien lancé avant d’ouvrir le frontend.
