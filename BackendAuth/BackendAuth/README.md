# 🔐 BackendAuth - API d'Authentification JWT

Une API complète d'authentification et de gestion des utilisateurs construite avec **ASP.NET Core**, **Entity Framework Core**, **PostgreSQL** et **JWT**.

## 🚀 Fonctionnalités

- ✅ **Authentification JWT** sécurisée
- ✅ **Gestion des rôles** (Admin, Manager, Employé)
- ✅ **CRUD complet des utilisateurs** (réservé aux Admins)
- ✅ **Mots de passe sécurisés** avec BCrypt
- ✅ **Base de données PostgreSQL** avec migrations automatiques
- ✅ **Documentation Swagger** avec support JWT
- ✅ **Ouverture automatique de Swagger** au démarrage

## 🛠️ Technologies Utilisées

- **ASP.NET Core 9.0**
- **Entity Framework Core** avec **PostgreSQL**
- **JWT Bearer Authentication**
- **BCrypt.Net** pour le hachage des mots de passe
- **Swagger/OpenAPI** pour la documentation

## 📋 Prérequis

- **.NET 9.0 SDK**
- **PostgreSQL** (localhost:5432)
- **Base de données** : `authAPP`
- **Utilisateur PostgreSQL** : `postgres` / `admin`

## 🚀 Installation et Démarrage

### 1. Cloner et naviguer
```bash
cd BackendAuth
```

### 2. Restaurer les packages
```bash
dotnet restore
```

### 3. Configurer la base de données
Assurez-vous que PostgreSQL fonctionne et créez la base de données :
```sql
CREATE DATABASE authAPP;
```

### 4. Lancer l'application
```bash
# Avec HTTPS (recommandé)
dotnet run --launch-profile https

# Ou avec HTTP seulement
dotnet run --launch-profile http
```

### 5. Accéder à Swagger
L'application ouvrira automatiquement Swagger UI dans votre navigateur :
- **HTTPS** : https://localhost:7232
- **HTTP** : http://localhost:5232

## 👤 Utilisateur Admin par Défaut

```json
{
  "username": "admin",
  "password": "Admin123*",
  "email": "admin@backend.com",
  "role": "Admin"
}
```

## 🔗 Endpoints API

### 🔐 Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/login` | Connexion utilisateur |
| `POST` | `/api/auth/validate` | Validation du token JWT |
| `GET` | `/api/auth/test` | Test de l'API |

### 👥 Gestion des Utilisateurs (Admin uniquement)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/users` | Liste tous les utilisateurs |
| `GET` | `/api/users/{id}` | Détails d'un utilisateur |
| `POST` | `/api/users` | Créer un utilisateur |
| `PUT` | `/api/users/{id}` | Modifier un utilisateur |
| `DELETE` | `/api/users/{id}` | Supprimer un utilisateur |
| `GET` | `/api/users/roles` | Liste des rôles disponibles |

## 🔑 Comment Tester avec Swagger

### 1. Se connecter
1. Allez sur `/api/auth/login`
2. Utilisez les credentials admin :
   ```json
   {
     "username": "admin",
     "password": "Admin123*"
   }
   ```
3. Copiez le `token` de la réponse

### 2. S'authentifier dans Swagger
1. Cliquez sur le bouton **"Authorize"** 🔒 en haut
2. Entrez : `Bearer VOTRE_TOKEN_ICI`
3. Cliquez sur **"Authorize"**

### 3. Tester les endpoints
Vous pouvez maintenant tester tous les endpoints `/api/users/*` qui nécessitent le rôle Admin.

## 🗄️ Structure du Projet

```
BackendAuth/
├── Controllers/         # Contrôleurs API
│   ├── AuthController.cs
│   └── UsersController.cs
├── Data/               # Contexte de base de données
│   └── ApplicationDbContext.cs
├── Dtos/               # Objets de transfert de données
│   ├── LoginRequestDto.cs
│   ├── CreateUserDto.cs
│   └── UserResponseDto.cs
├── Models/             # Modèles de données
│   ├── User.cs
│   ├── Role.cs
│   └── UserRole.cs
├── Services/           # Services métier
│   ├── IUserService.cs
│   ├── UserService.cs
│   └── AuthService.cs
├── Security/           # Configuration JWT
│   ├── JwtSettings.cs
│   ├── JwtService.cs
│   └── ConfigureJwt.cs
├── Extensions/         # Extensions de services
│   └── ServiceCollectionExtensions.cs
├── Migrations/         # Migrations EF Core
└── Properties/         # Configuration de lancement
```

## 🛡️ Sécurité

- **Mots de passe** hashés avec BCrypt (coût 11)
- **Tokens JWT** avec expiration (60 minutes par défaut)
- **Autorisation basée sur les rôles** avec `[Authorize(Roles = "Admin")]`
- **Validation des données** avec Data Annotations
- **HTTPS** activé par défaut en développement

## 🎯 Rôles Disponibles

1. **Admin** : Accès complet (CRUD utilisateurs)
2. **Manager** : Accès de gestion (à personnaliser)
3. **Employé** : Accès basique (à personnaliser)

## 📝 Exemple de Test avec curl

```bash
# 1. Login
curl -X POST "https://localhost:7232/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123*"}' \
  -k

# 2. Utiliser le token pour créer un utilisateur
curl -X POST "https://localhost:7232/api/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "NewUser123*",
    "firstName": "New",
    "lastName": "User",
    "roles": ["Employé"]
  }' \
  -k
```

## 🔧 Configuration

### Base de Données
Modifiez `appsettings.json` pour votre configuration PostgreSQL :
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=authAPP;Username=postgres;Password=admin"
  }
}
```

### JWT
Configuration JWT dans `appsettings.json` :
```json
{
  "JwtSettings": {
    "SecretKey": "votre_clé_secrète_super_longue_et_complexe_pour_jwt_2024",
    "Issuer": "BackendAuthAPI",
    "Audience": "BackendAuthFrontend",
    "ExpiryInMinutes": 60
  }
}
```

## 🐛 Dépannage

### Problème de connexion à PostgreSQL
Vérifiez que PostgreSQL fonctionne :
```bash
# Windows
services.msc # Rechercher PostgreSQL

# Ou tester la connexion
psql -h localhost -p 5432 -U postgres -d authAPP
```

### Problème de certificat HTTPS
Pour ignorer les erreurs de certificat en développement :
```bash
dotnet dev-certs https --trust
```

### Base de données non créée
L'application crée automatiquement la base de données et applique les migrations au démarrage.

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request. 