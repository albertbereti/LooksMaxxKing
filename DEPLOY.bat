@echo off
echo ========================================
echo    LOOKSMAXXKING DEPLOY SCRIPT (FIREBASE)
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/3] Building production bundle...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Deploying to Firebase Hosting and Functions...
call npx firebase-tools deploy --only hosting,functions
if %ERRORLEVEL% neq 0 (
    echo ERROR: Deploy failed. Make sure you are authenticated with 'firebase login'.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    DEPLOYMENT COMPLETE!
echo    Your app is live via Firebase Global CDN.
echo ========================================
pause
