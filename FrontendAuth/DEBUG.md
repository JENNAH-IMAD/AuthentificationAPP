# 🔧 Guide de Débogage - Frontend Authentication

## 🚀 **CORRECTIONS APPORTÉES**

### **1. Validation des Rôles**
- ✅ Ajout de validation pour s'assurer qu'au moins un rôle est sélectionné lors de la création/modification d'utilisateur
- ✅ Messages d'erreur plus explicites

### **2. Logs de Débogage**
- ✅ Ajout de logs détaillés dans toutes les fonctions critiques :
  - `fetchUsers()` - Récupération des utilisateurs
  - `handleCreateUser()` - Création d'utilisateur
  - `handleUpdateUser()` - Modification d'utilisateur
  - `openEditDialog()` - Ouverture du modal de modification

### **3. Gestion des États**
- ✅ Amélioration de la logique des checkbox pour les rôles
- ✅ Meilleure gestion des states dans les modals
- ✅ Conversion automatique des rôles (string → number)

### **4. Page de Test**
- ✅ Nouvelle page `/test` accessible aux admins uniquement
- ✅ Tests complets de l'API utilisateur
- ✅ Interface visuelle pour les résultats de test

## 🧪 **UTILISATION DE LA PAGE DE TEST**

### **Accès**
1. Connectez-vous en tant qu'admin (`admin@backend.com` / `Admin123*`)
2. Naviguez vers "🧪 Test API" dans la sidebar
3. Utilisez les boutons pour tester différentes opérations

### **Tests Disponibles**
- **📋 GET /users** : Récupère tous les utilisateurs
- **➕ POST /users** : Crée un nouvel utilisateur de test
- **✏️ PUT /users/:id** : Modifie un utilisateur existant

### **Debugging**
- Les logs sont visibles dans la console du navigateur (F12)
- Les résultats s'affichent directement dans l'interface
- Chaque test montre la réponse complète de l'API

## 🔍 **COMMENT DÉBUGGER LES PROBLÈMES**

### **1. Vérifier la Console**
```javascript
// Ouvrir les DevTools (F12) et regarder :
console.log('🔍 Test: Récupération des utilisateurs');
console.log('📊 Réponse API:', response);
```

### **2. Vérifier l'Authentification**
```javascript
// Dans la console du navigateur :
localStorage.getItem('auth_token')
// Doit retourner un token JWT valide
```

### **3. Vérifier l'URL de l'API**
- URL par défaut : `http://localhost:5232/api`
- Vérifier que le backend est en cours d'exécution
- Tester l'endpoint manuel dans Postman

### **4. Erreurs Courantes**

#### **❌ "Veuillez sélectionner au moins un rôle"**
- **Cause** : Aucun rôle sélectionné dans le formulaire
- **Solution** : Sélectionner au moins une checkbox de rôle

#### **❌ "Erreur de connexion au serveur"**
- **Cause** : Backend non démarré ou URL incorrecte
- **Solution** : Vérifier que le backend tourne sur le port 5232

#### **❌ "HTTP 401: Unauthorized"**
- **Cause** : Token expiré ou invalide
- **Solution** : Se reconnecter ou vérifier la validité du token

#### **❌ "HTTP 403: Forbidden"**
- **Cause** : Permissions insuffisantes
- **Solution** : Utiliser un compte admin

## 📊 **STRUCTURE DES DONNÉES**

### **CreateUserDto**
```typescript
{
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roleIds: number[]; // [1=Admin, 2=Manager, 3=Employé]
  isActive?: boolean;
}
```

### **UpdateUserDto**
```typescript
{
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleIds?: number[]; // [1=Admin, 2=Manager, 3=Employé]
}
```

### **Mapping des Rôles**
- `Admin` = ID 1
- `Manager` = ID 2
- `Employé` = ID 3

## 🎯 **PROCHAINES ÉTAPES**

Si les problèmes persistent :

1. **Utiliser la page de test** pour identifier l'étape qui échoue
2. **Vérifier les logs** dans la console du navigateur
3. **Tester l'API directement** avec Postman
4. **Vérifier la base de données** pour s'assurer que les données sont correctes

## 💡 **CONSEILS**

- Toujours vérifier les logs dans la console avant de signaler un bug
- Utiliser la page de test pour reproduire les problèmes
- Garder les DevTools ouverts pendant les tests
- Vérifier que les tokens ne sont pas expirés (60 minutes par défaut) 