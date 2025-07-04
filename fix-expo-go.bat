@echo off
echo 🔧 Expo Go Troubleshooting Script
echo ================================

echo 📱 Step 1: Stopping all Expo processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM expo.exe /T 2>nul

echo 🧹 Step 2: Clearing caches...
if exist node_modules rmdir /s /q node_modules
del /f /s /q "%LOCALAPPDATA%\Temp\haste-map-*" 2>nul
del /f /s /q "%LOCALAPPDATA%\Temp\metro-cache" 2>nul

echo 📦 Step 3: Reinstalling dependencies...
npm cache clean --force
npm install

echo 🔥 Step 4: Configuring Windows Firewall...
netsh advfirewall firewall add rule name="Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Expo Metro 19000" dir=in action=allow protocol=TCP localport=19000
netsh advfirewall firewall add rule name="Expo Metro 19001" dir=in action=allow protocol=TCP localport=19001

echo 🔄 Step 5: Starting Expo with cleared cache...
npx expo start --clear

echo ✅ If this doesn't work, try: npx expo start --tunnel
echo 📱 Remember to clear Expo Go cache on your device!
pause 