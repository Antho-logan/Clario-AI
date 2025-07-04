# 🔧 Comprehensive Expo Go Troubleshooting Guide

## 🎯 Quick Fix Checklist

If you're in a hurry, run the [Final Consolidated Script](#final-consolidated-script) at the bottom. Otherwise, use this systematic approach:

### ✅ 1. Network Connection Verification

**Check Same Network**: Ensure your phone and computer are on the **exact same Wi-Fi network**.

**Windows Network Settings**:
```powershell
# Check if "Network Discovery" is enabled
netsh advfirewall firewall show rule name="Network Discovery (UPnP-In)"
# Enable if disabled
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes
```

**macOS Network Settings**:
```bash
# Check network interfaces
ifconfig | grep "inet "
# Make sure both devices show same network range (e.g., 192.168.1.x)
```

**Linux Network Settings**:
```bash
# Check network status
ip route show default
# Ensure network discovery is enabled
sudo systemctl status avahi-daemon
```

### 🚇 2. Tunnel Mode (Universal Fallback)

When LAN fails due to router or corporate firewall restrictions:

```bash
# Use tunnel mode (works everywhere)
npx expo start --tunnel
```

**Note**: Tunnel mode is slower but bypasses all network restrictions. Essential for:
- Corporate networks
- Public Wi-Fi (libraries, cafes)
- Restrictive routers
- VPN connections

### 🔥 3. Firewall & Antivirus Configuration

#### Windows Defender Setup

**Allow Expo through Windows Firewall**:
```powershell
# Allow Node.js through firewall
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="%ProgramFiles%\nodejs\node.exe"
# Allow Expo Metro ports
netsh advfirewall firewall add rule name="Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Expo Metro 19000" dir=in action=allow protocol=TCP localport=19000
netsh advfirewall firewall add rule name="Expo Metro 19001" dir=in action=allow protocol=TCP localport=19001
```

**Windows Defender Exclusions**:
1. Open Windows Security → Virus & threat protection
2. Go to "Virus & threat protection settings" → "Manage settings"
3. Under "Exclusions", click "Add or remove exclusions"
4. Add these **Process** exclusions:
   - `C:\Program Files\nodejs\node.exe`
   - `C:\Users\[YourName]\AppData\Roaming\npm\expo.cmd`

#### macOS Firewall Setup

```bash
# Check firewall status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
# Add Node.js to firewall exceptions
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/local/bin/node
```

**macOS Security Prompts**: When prompted, click "Allow" for:
- Node.js network access
- Metro bundler connections
- Expo CLI network requests

#### Linux Firewall Setup

```bash
# Ubuntu/Debian - allow Expo ports
sudo ufw allow 8081/tcp
sudo ufw allow 19000/tcp
sudo ufw allow 19001/tcp
# CentOS/RHEL - allow Expo ports
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --permanent --add-port=19000/tcp
sudo firewall-cmd --permanent --add-port=19001/tcp
sudo firewall-cmd --reload
```

### 🧹 4. Clear Device Cache

#### Android Device

**Method 1 - Through Settings**:
1. Settings → Apps → Expo Go
2. Storage → Clear Cache
3. Storage → Clear Data (if cache doesn't work)

**Method 2 - ADB Commands**:
```bash
# Clear Expo Go cache
adb shell pm clear host.exp.exponent
# Force stop Expo Go
adb shell am force-stop host.exp.exponent
```

#### iOS Device

**Method 1 - Delete & Reinstall**:
1. Long-press Expo Go → Delete App
2. Reinstall from App Store

**Method 2 - iOS Settings**:
1. Settings → General → iPhone Storage
2. Find Expo Go → Offload App
3. Reinstall from App Store

### ♻️ 5. Complete System Restart Sequence

```bash
# 1. Stop all Expo/Metro processes
pkill -f "expo"
pkill -f "metro"

# 2. Clear all caches (see section 6 below)

# 3. Restart development server
npx expo start --clear

# 4. Restart mobile device (power off/on)
```

### 🧠 6. Clear Metro & Bundler Caches

#### Windows Cache Clear

```powershell
# Delete node_modules and caches
rmdir /s /q node_modules
del /f /s /q "%LOCALAPPDATA%\Temp\haste-map-*"
del /f /s /q "%LOCALAPPDATA%\Temp\metro-cache"
# With npm
npm cache clean --force
npm install
# With yarn
yarn cache clean
yarn install
# Clear watchman (if installed)
watchman watch-del-all
# Start with cleared cache
npx expo start --clear
```

#### macOS/Linux Cache Clear

```bash
# Delete node_modules and caches
rm -rf node_modules
rm -rf $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache
# With npm
npm cache clean --force
npm install
# With yarn
yarn cache clean
yarn install
# Clear watchman
watchman watch-del-all
# Start with cleared cache
npx expo start --clear
```

### 🔄 7. Dev Menu Access & Fast Refresh

#### Physical Device
- **Android**: Shake device vigorously
- **iOS**: Shake device vigorously

#### Simulator/Emulator
- **Android Emulator**: `Ctrl+M` (Windows/Linux) or `Cmd+M` (macOS)
- **iOS Simulator**: `Cmd+D` (macOS only)

**In Dev Menu**:
1. Enable "Fast Refresh"
2. Select "Reload" to refresh the app
3. Try "Debug" to check for errors

### ⚠️ 8. Expo Go vs Custom Dev Client

**Important**: If you have `expo-dev-client` installed, Expo Go **will not work**. You need either:

**Option A - Remove expo-dev-client**:
```bash
npm uninstall expo-dev-client
# or
yarn remove expo-dev-client
```

**Option B - Build custom dev client**:
```bash
npx expo run:android
# or
npx expo run:ios
```

### 🛠️ 9. Debugging & Logging

#### View Expo CLI Logs
```bash
# Start with verbose logging
npx expo start --clear --verbose
```

#### Android Device Logs
```bash
# View real-time Android logs
adb logcat -s "ReactNativeJS:V" "ExponentReactNativeJS:V"
# Filter for Expo-specific logs
adb logcat | grep -i expo
```

#### iOS Device Logs
```bash
# Install ios-deploy if not already installed
npm install -g ios-deploy
# View iOS device logs
ios-deploy --debug --bundle YourApp.app
```

### 🌐 10. Router-Specific Fixes (Expo Router)

If using Expo Router and experiencing routing issues:

```bash
# Clear Babel cache
rm -rf node_modules/.cache/babel-loader
# Clear Metro cache specifically for router
rm -rf $TMPDIR/metro-cache
# Reset with router-specific flags
npx expo start --clear --reset-cache
```

**Metro Config for Router** (metro.config.js):
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this for better router performance
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;
```

### 🍃 11. Beginner's Fallback Checklist

When all else fails:

1. **Check Router Mode**: Make sure router isn't blocking device communication
2. **Try Different Network**: Switch to mobile hotspot temporarily
3. **Update Everything**:
   ```bash
   npm install -g @expo/cli@latest
   npx expo install --fix
   ```
4. **Create Fresh Project**: Test if issue is project-specific
   ```bash
   npx create-expo-app TestApp
   cd TestApp
   npx expo start
   ```

## 🚨 Final Consolidated Script

Save this as `fix-expo-go.bat` (Windows) or `fix-expo-go.sh` (macOS/Linux):

### Windows Script (fix-expo-go.bat)

```batch
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
```

### macOS/Linux Script (fix-expo-go.sh)

```bash
#!/bin/bash
echo "🔧 Expo Go Troubleshooting Script"
echo "================================"

echo "📱 Step 1: Stopping all Expo processes..."
pkill -f "expo" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
pkill -f "node.*expo" 2>/dev/null || true

echo "🧹 Step 2: Clearing caches..."
rm -rf node_modules
rm -rf $TMPDIR/haste-map-* 2>/dev/null || true
rm -rf $TMPDIR/metro-cache 2>/dev/null || true

echo "📦 Step 3: Reinstalling dependencies..."
npm cache clean --force
npm install

echo "🔄 Step 4: Clearing watchman..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all
fi

echo "🔥 Step 5: Configuring firewall (macOS)..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node 2>/dev/null || true
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblock /usr/local/bin/node 2>/dev/null || true
fi

echo "🔄 Step 6: Starting Expo with cleared cache..."
npx expo start --clear

echo "✅ If this doesn't work, try: npx expo start --tunnel"
echo "📱 Remember to clear Expo Go cache on your device!"
```

## 🎯 When It's Safe to Retry

**After running the script**, it's safe to retry when you see:
- ✅ "Metro waiting on exp://192.168.x.x:19000"
- ✅ "Logs for your project will appear below"
- ✅ QR code displays properly

**On your device**:
- ✅ Expo Go can scan the QR code
- ✅ "Fetching JavaScript bundle" appears
- ✅ No "Network connection lost" errors

## 📝 Additional Tips

- **Always use tunnel mode** for public networks or corporate environments
- **Keep Expo Go updated** to the latest version
- **Check SDK compatibility** between your app and Expo Go
- **Use development builds** for production apps (more reliable than Expo Go)

Remember: If you're building a production app, consider migrating to **development builds** with `expo-dev-client` for better reliability and performance. 