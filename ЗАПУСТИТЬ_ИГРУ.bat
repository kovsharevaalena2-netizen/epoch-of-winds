@echo off
title EPOCH OF WINDS

REM Переходим в папку с bat-файлом
cd /d "%~dp0"

echo ========================================
echo     EPOCH OF WINDS: GAME LAUNCHER
echo ========================================
echo.

REM Проверяем Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Проверяем зависимости
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)

echo.
echo ========================================
echo         STARTING GAME SERVER
echo ========================================
echo.
echo Game will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm run dev

pause
