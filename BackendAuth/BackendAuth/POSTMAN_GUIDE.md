# 🚀 Guide Postman - BackendAuth API

## 📥 **Étape 1: Importer la Collection**

1. **Ouvrez Postman**
2. **Cliquez sur "Import"** (bouton en haut à gauche)
3. **Glissez-déposez** le fichier `BackendAuth_Postman_Collection.json`
4. **Ou cliquez "Choose Files"** et sélectionnez le fichier
5. **Cliquez "Import"**

✅ **Vous verrez maintenant la collection "BackendAuth API - Collection Complète"**

## 🎯 **Étape 2: Configuration Automatique**

La collection est **pré-configurée** avec :
- ✅ **URL de base** : `http://localhost:5232`
- ✅ **Variables automatiques** pour le token JWT
- ✅ **Scripts automatiques** pour sauvegarder les tokens
- ✅ **12 tests complets** dans l'ordre

## 🧪 **Étape 3: Exécuter TOUS les Tests (Recommandé)**

### **Option A: Runner Postman (Automatique)**
1. **Cliquez droit** sur la collection "BackendAuth API"
2. **Sélectionnez "Run collection"**
3. **Cliquez "Run BackendAuth API"**
4. 🎉 **Tous les tests s'exécutent automatiquement !**

### **Option B: Test Manuel (Étape par étape)**

#### **🔧 1. Test API de Base**
- **Cliquez** sur "🔧 1. Test API de Base"
- **Cliquez** "Send"
- ✅ **Résultat attendu** : Status 200, message "API BackendAuth fonctionne correctement!"

#### **🔐 2. Login Admin (IMPORTANT - À faire en premier)**
- **Cliquez** sur "🔐 2. Login Admin (Obtenir Token)"
- **Cliquez** "Send"
- ✅ **Le token JWT est automatiquement sauvegardé** dans les variables
- 🔍 **Vérifiez** : Onglet "Tests" → Console → Vous verrez "🔑 Token JWT sauvegardé automatiquement"

#### **✅ 3. Valider Token JWT**
- **Cliquez** "Send"
- ✅ **Résultat** : "Token valide"

#### **👥 4. Récupérer Tous les Utilisateurs**
- **Cliquez** "Send"  
- ✅ **Résultat** : Liste avec au minimum l'utilisateur "admin"

#### **🎭 5. Récupérer les Rôles Disponibles**
- **Cliquez** "Send"
- ✅ **Résultat** : `["Admin", "Manager", "Employé"]`

#### **🆕 6. Créer Nouvel Utilisateur**
- **Cliquez** "Send"
- ✅ **L'ID utilisateur est automatiquement sauvegardé** pour les tests suivants
- 🔍 **Vérifiez** : Console → "👤 ID utilisateur sauvegardé: [ID]"

#### **🔍 7. Récupérer Utilisateur par ID**
- **Cliquez** "Send"
- ✅ **Résultat** : Détails de l'utilisateur créé

#### **✏️ 8. Modifier Utilisateur**
- **Cliquez** "Send"
- ✅ **Résultat** : Utilisateur modifié (nom changé, rôle promu à "Manager")

#### **🔐 9. Test Login Nouvel Utilisateur**
- **Cliquez** "Send"
- ✅ **Résultat** : Connexion réussie avec le nouvel utilisateur

#### **🚫 10. Test Accès Sans Token (Doit Échouer)**
- **Cliquez** "Send"
- ✅ **Résultat attendu** : Status 401 Unauthorized

#### **🗑️ 11. Supprimer Utilisateur de Test**
- **Cliquez** "Send"
- ✅ **Résultat** : Status 204 No Content

#### **✅ 12. Vérifier Suppression (Doit Échouer)**
- **Cliquez** "Send"
- ✅ **Résultat attendu** : Status 404 Not Found

## 🔧 **Variables Automatiques**

La collection utilise ces variables **automatiquement** :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `baseUrl` | `http://localhost:5232` | URL de base de l'API |
| `jwt_token` | *Auto-sauvegardé* | Token JWT après login |
| `admin_username` | `admin` | Nom d'utilisateur admin |
| `admin_password` | `Admin123*` | Mot de passe admin |
| `created_user_id` | *Auto-sauvegardé* | ID de l'utilisateur créé |

## 🎨 **Personnalisation**

### **Changer l'URL de base :**
1. **Cliquez droit** sur la collection
2. **"Edit"** → **"Variables"**
3. **Modifiez** `baseUrl` si nécessaire

### **Créer vos propres utilisateurs :**
Modifiez le body de "🆕 6. Créer Nouvel Utilisateur" :
```json
{
  "username": "monuser",
  "email": "monuser@exemple.com", 
  "password": "MonPassword123*",
  "firstName": "Mon",
  "lastName": "User",
  "roles": ["Admin"]  // ou "Manager" ou "Employé"
}
```

## 🐛 **Dépannage**

### ❌ **Erreur "Connection refused"**
- ✅ **Vérifiez** que l'application fonctionne : `dotnet run`
- ✅ **Vérifiez** l'URL : `http://localhost:5232`

### ❌ **401 Unauthorized sur les endpoints /users**
- ✅ **Exécutez d'abord** "🔐 2. Login Admin" 
- ✅ **Vérifiez** que le token est sauvegardé dans les variables

### ❌ **Token expiré**
- ✅ **Re-exécutez** "🔐 2. Login Admin" pour obtenir un nouveau token

## 📊 **Résultats Attendus - Résumé**

| Test | Status | Description |
|------|--------|-------------|
| 1. Test API | ✅ 200 | API fonctionne |
| 2. Login Admin | ✅ 200 | Token obtenu et sauvegardé |
| 3. Valider Token | ✅ 200 | Token valide |
| 4. Liste Utilisateurs | ✅ 200 | Liste récupérée |
| 5. Liste Rôles | ✅ 200 | Rôles récupérés |
| 6. Créer Utilisateur | ✅ 201 | Utilisateur créé |
| 7. Utilisateur par ID | ✅ 200 | Détails récupérés |
| 8. Modifier Utilisateur | ✅ 200 | Utilisateur modifié |
| 9. Login Nouvel User | ✅ 200 | Connexion réussie |
| 10. Accès Sans Token | ❌ 401 | Accès refusé (normal) |
| 11. Supprimer User | ✅ 204 | Suppression réussie |
| 12. Vérif Suppression | ❌ 404 | Non trouvé (normal) |

## 🎉 **Test Complet Réussi !**

Si tous les tests passent, votre API BackendAuth fonctionne parfaitement ! 🚀

## 💡 **Conseils Pro**

1. **Utilisez le Runner** pour exécuter tous les tests d'un coup
2. **Consultez la Console** pour voir les logs automatiques
3. **Sauvegardez** vos propres variables pour des tests personnalisés
4. **Dupliquez** les requêtes pour créer vos propres variations 