# ⚡ Quick Usage Guide

## 🚀 One-Click Fix

### Windows
```bash
# Double-click the script file
fix-expo-go.bat

# Or run from command line
.\fix-expo-go.bat
```

### macOS/Linux
```bash
# Make executable (first time only)
chmod +x fix-expo-go.sh

# Run the script
./fix-expo-go.sh
```

## 🔧 Manual Commands

If you prefer to run commands manually:

### Quick Fix (All Platforms)
```bash
# Stop everything, clear caches, restart
npx expo start --clear --tunnel
```

### Emergency Fallback
```bash
# If nothing works, use tunnel mode
npx expo start --tunnel
```

## 📱 Device Actions

**While running the script:**

1. **Clear Expo Go cache** on your device:
   - Android: Settings → Apps → Expo Go → Storage → Clear Cache
   - iOS: Delete and reinstall Expo Go

2. **Restart your device** (power off/on)

3. **Scan QR code** again

## ✅ Success Indicators

**Look for these messages:**
- "Metro waiting on exp://..."
- "Logs for your project will appear below"
- QR code displays properly

**On your device:**
- Expo Go can scan the QR code
- "Fetching JavaScript bundle" appears
- No "Network connection lost" errors

## 🆘 Still Not Working?

Try these in order:

1. **Switch to tunnel mode**: `npx expo start --tunnel`
2. **Try mobile hotspot**: Use your phone's hotspot instead of Wi-Fi
3. **Check firewall**: Temporarily disable Windows Defender/macOS firewall
4. **Update everything**: `npm install -g @expo/cli@latest`
5. **Test fresh project**: Create a new Expo app to isolate the issue

## 📞 Getting Help

If you're still stuck, share these logs when asking for help:

```bash
# Get detailed logs
npx expo start --clear --verbose

# Android device logs
adb logcat | grep -i expo

# Check network connectivity
ping 8.8.8.8
```

Remember: **Tunnel mode works 99% of the time** when LAN fails! 