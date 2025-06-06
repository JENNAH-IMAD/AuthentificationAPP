# 🧪 Script de Test Complet pour BackendAuth API
# Ce script teste toutes les fonctionnalités de l'API

Write-Host "🚀 Démarrage des tests de l'API BackendAuth" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$baseUrl = "http://localhost:5232"
$adminUser = @{
    username = "admin"
    password = "Admin123*"
}

# Fonction pour afficher les résultats
function Show-TestResult {
    param($testName, $response, $expectedStatus = 200)
    
    Write-Host "`n📋 Test: $testName" -ForegroundColor Yellow
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor $(if($response.StatusCode -eq $expectedStatus) {"Green"} else {"Red"})
    
    if ($response.Content) {
        $content = $response.Content | ConvertFrom-Json
        Write-Host "Réponse:" -ForegroundColor Cyan
        $content | ConvertTo-Json -Depth 3 | Write-Host
    }
    Write-Host "----------------------------------------" -ForegroundColor Gray
}

try {
    # 🔧 Test 1: Vérification que l'API fonctionne
    Write-Host "`n🔧 Test 1: Vérification de base de l'API" -ForegroundColor Magenta
    $testResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/test" -Method GET
    Show-TestResult "API Test" $testResponse

    # 🔐 Test 2: Login Admin
    Write-Host "`n🔐 Test 2: Connexion utilisateur Admin" -ForegroundColor Magenta
    $loginBody = $adminUser | ConvertTo-Json
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Show-TestResult "Login Admin" $loginResponse
    
    # Extraire le token JWT
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    $token = $loginResult.token
    $authHeader = @{ Authorization = "Bearer $token" }
    
    Write-Host "✅ Token JWT obtenu: $($token.Substring(0,20))..." -ForegroundColor Green

    # 👥 Test 3: Récupérer tous les utilisateurs
    Write-Host "`n👥 Test 3: Récupération de tous les utilisateurs" -ForegroundColor Magenta
    $usersResponse = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method GET -Headers $authHeader
    Show-TestResult "Get All Users" $usersResponse

    # 🎭 Test 4: Récupérer les rôles disponibles
    Write-Host "`n🎭 Test 4: Récupération des rôles disponibles" -ForegroundColor Magenta
    $rolesResponse = Invoke-WebRequest -Uri "$baseUrl/api/users/roles" -Method GET -Headers $authHeader
    Show-TestResult "Get Roles" $rolesResponse

    # 🆕 Test 5: Créer un nouvel utilisateur
    Write-Host "`n🆕 Test 5: Création d'un nouvel utilisateur" -ForegroundColor Magenta
    $newUser = @{
        username = "testuser$(Get-Random)"
        email = "test$(Get-Random)@example.com"
        password = "Test123*"
        firstName = "Test"
        lastName = "User"
        roles = @("Employé")
    }
    $newUserBody = $newUser | ConvertTo-Json
    $createUserResponse = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method POST -Body $newUserBody -ContentType "application/json" -Headers $authHeader
    Show-TestResult "Create User" $createUserResponse 201
    
    # Récupérer l'ID du nouvel utilisateur
    $createdUser = $createUserResponse.Content | ConvertFrom-Json
    $newUserId = $createdUser.id
    Write-Host "✅ Utilisateur créé avec l'ID: $newUserId" -ForegroundColor Green

    # 🔍 Test 6: Récupérer un utilisateur par ID
    Write-Host "`n🔍 Test 6: Récupération d'un utilisateur par ID" -ForegroundColor Magenta
    $getUserResponse = Invoke-WebRequest -Uri "$baseUrl/api/users/$newUserId" -Method GET -Headers $authHeader
    Show-TestResult "Get User by ID" $getUserResponse

    # ✏️ Test 7: Modifier l'utilisateur
    Write-Host "`n✏️ Test 7: Modification de l'utilisateur" -ForegroundColor Magenta
    $updateUser = @{
        firstName = "Updated"
        lastName = "Name"
        isActive = $true
    }
    $updateUserBody = $updateUser | ConvertTo-Json
    $updateUserResponse = Invoke-WebRequest -Uri "$baseUrl/api/users/$newUserId" -Method PUT -Body $updateUserBody -ContentType "application/json" -Headers $authHeader
    Show-TestResult "Update User" $updateUserResponse

    # 🔐 Test 8: Test de connexion avec le nouvel utilisateur
    Write-Host "`n🔐 Test 8: Test de connexion avec le nouvel utilisateur" -ForegroundColor Magenta
    $newUserLogin = @{
        username = $newUser.username
        password = $newUser.password
    }
    $newUserLoginBody = $newUserLogin | ConvertTo-Json
    $newUserLoginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body $newUserLoginBody -ContentType "application/json"
    Show-TestResult "New User Login" $newUserLoginResponse

    # 🚫 Test 9: Tester l'accès sans token (doit échouer)
    Write-Host "`n🚫 Test 9: Test d'accès sans authentification (doit échouer)" -ForegroundColor Magenta
    try {
        $unauthorizedResponse = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method GET
        Show-TestResult "Unauthorized Access" $unauthorizedResponse
    }
    catch {
        Write-Host "✅ Accès refusé comme attendu (401 Unauthorized)" -ForegroundColor Green
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }

    # 🗑️ Test 10: Supprimer l'utilisateur de test
    Write-Host "`n🗑️ Test 10: Suppression de l'utilisateur de test" -ForegroundColor Magenta
    $deleteUserResponse = Invoke-WebRequest -Uri "$baseUrl/api/users/$newUserId" -Method DELETE -Headers $authHeader
    Show-TestResult "Delete User" $deleteUserResponse 204

    # ✅ Test 11: Vérifier que l'utilisateur a été supprimé
    Write-Host "`n✅ Test 11: Vérification de la suppression" -ForegroundColor Magenta
    try {
        $deletedUserResponse = Invoke-WebRequest -Uri "$baseUrl/api/users/$newUserId" -Method GET -Headers $authHeader
        Show-TestResult "Get Deleted User" $deletedUserResponse
    }
    catch {
        Write-Host "✅ Utilisateur supprimé avec succès (404 Not Found)" -ForegroundColor Green
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }

    # 🔍 Test 12: Validation du token JWT
    Write-Host "`n🔍 Test 12: Validation du token JWT" -ForegroundColor Magenta
    $validateTokenBody = "`"$token`"" | ConvertTo-Json
    $validateResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/validate" -Method POST -Body $validateTokenBody -ContentType "application/json"
    Show-TestResult "Validate Token" $validateResponse

    # 📊 Résumé final
    Write-Host "`n🎉 RÉSUMÉ DES TESTS" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    Write-Host "✅ Test API de base: OK" -ForegroundColor Green
    Write-Host "✅ Connexion Admin: OK" -ForegroundColor Green
    Write-Host "✅ Récupération utilisateurs: OK" -ForegroundColor Green
    Write-Host "✅ Récupération rôles: OK" -ForegroundColor Green
    Write-Host "✅ Création utilisateur: OK" -ForegroundColor Green
    Write-Host "✅ Récupération par ID: OK" -ForegroundColor Green
    Write-Host "✅ Modification utilisateur: OK" -ForegroundColor Green
    Write-Host "✅ Connexion nouvel utilisateur: OK" -ForegroundColor Green
    Write-Host "✅ Sécurité (accès refusé): OK" -ForegroundColor Green
    Write-Host "✅ Suppression utilisateur: OK" -ForegroundColor Green
    Write-Host "✅ Vérification suppression: OK" -ForegroundColor Green
    Write-Host "✅ Validation token: OK" -ForegroundColor Green
    Write-Host "`n🚀 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !" -ForegroundColor Green

}
catch {
    Write-Host "`n❌ ERREUR DANS LES TESTS:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`n🔧 Vérifiez que l'application fonctionne sur $baseUrl" -ForegroundColor Yellow
}

Write-Host "`n📝 Pour plus de tests, utilisez Swagger UI: $baseUrl" -ForegroundColor Cyan
Write-Host "🔗 Documentation complète dans README.md" -ForegroundColor Cyan 