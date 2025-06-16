@echo off
REM 🚀 AwesomeQRApp Quick Start Script for Windows
REM Double-click this file to get your QR code in seconds!

echo 🚀 Starting AwesomeQRApp...
echo 📱 QR Code will appear shortly!
echo.

REM Navigate to the script directory
cd /d "%~dp0"

REM Kill any existing expo processes
echo 🧹 Cleaning up existing processes...
taskkill /f /im node.exe 2>nul >nul

REM Start Expo with tunnel mode
echo 🌐 Starting Expo with tunnel mode...
echo ✅ Accept any port changes (press Y)
echo ✅ Install ngrok if prompted (press Y)
echo.

REM Use port 8085 as it was working last time
npx expo start --tunnel --port 8085

echo.
echo 🎉 Expo server started!
echo 📱 Scan the QR code above with:
echo    • Android: Expo Go app
echo    • iOS: Camera app

pause 