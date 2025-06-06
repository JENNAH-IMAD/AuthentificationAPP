@echo off
echo.
echo 🧪 Lancement des tests BackendAuth API
echo =====================================
echo.

REM Vérifier si l'application fonctionne
echo 🔍 Vérification que l'application fonctionne...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:5232/api/auth/test' -TimeoutSec 5 | Out-Null; Write-Host '✅ API détectée sur http://localhost:5232' -ForegroundColor Green } catch { Write-Host '❌ API non détectée. Assurez-vous que l'application fonctionne sur http://localhost:5232' -ForegroundColor Red; exit 1 }"

echo.
echo 🚀 Démarrage des tests complets...
echo.

REM Exécuter le script PowerShell de test
powershell -ExecutionPolicy Bypass -File "./test_all_functions.ps1"

echo.
echo 📊 Tests terminés !
echo.
pause 