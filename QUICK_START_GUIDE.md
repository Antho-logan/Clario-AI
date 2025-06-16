# 🚀 QUICK START GUIDE - Get QR Code in Under 2 Minutes!

## 📱 CURRENT QR CODE (Ready to Scan!)
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄▄ ▀ ▄██ ▀▀██ ▄▄▄▄▄ █
█ █   █ ██▄▀ █ ▄█▄▀▀▄▄█ █   █ █
█ █▄▄▄█ ██▀▄ ▄▀▄█▄▀▄▄▀█ █▄▄▄█ █
█▄▄▄▄▄▄▄█ ▀▄█ ▀▄█▄█▄█▄█▄▄▄▄▄▄▄█
█  █▄ ▀▄▀▀▄▀█▄█▄▀▄ ▄▀██▄▀▀██▀▄█
█▀▀█▀▀█▄▄▄▄██▄██▄█  █▀ ▄▄███▄▀█
██▄ ▀▄▀▄▀▀▄ █▀▄   █▄█▄▄  ▀▄█  █
█▀▀▀  ▀▄▀▄ ▀█▀▀  ▄█ ▄ ▀▀█▄█ █ █
█ ▄███▀▄▄▀█▄ ▄██▀▀█▄ ▀██▄▀▀▀ ▄█
█  █▀▄▀▄ ▄ ▄▀▄ ▄▄▄▄ ▄▄ ▄▄▀█▀▀▄█
█▄▄▄█▄█▄█ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
```

**📍 Current Tunnel URL:** `exp://[tunnel-url]-8085.exp.direct`

---

## ⚡ FASTEST METHOD (30 seconds)

### Step 1: Open Terminal in Project
```bash
cd AwesomeQRApp
```

### Step 2: Start Expo (One Command)
```bash
npx expo start --tunnel
```

### Step 3: Handle Port Conflicts
- If port 8081 is busy → Press `Y` to use suggested port
- If ngrok prompt appears → Press `Y` to install

### Step 4: Scan QR Code
- **Android:** Open Expo Go app → Scan QR Code
- **iOS:** Open Camera app → Point at QR code

---

## 🔧 TROUBLESHOOTING GUIDE

### Problem: "Unable to find expo in this project"
**Solution:**
```bash
cd AwesomeQRApp
npm install
npx expo start --tunnel
```

### Problem: Port Already in Use
**Solution:** Always say YES to alternative ports
```bash
# If 8081 is busy, use 8082, 8083, 8084, etc.
npx expo start --tunnel --port 8085
```

### Problem: Global Expo CLI Deprecated Warning
**Solution:** Ignore the warning, use `npx expo` (already correct)

### Problem: Tunnel Connection Issues
**Solutions:**
1. Try without tunnel first: `npx expo start`
2. Install ngrok globally: `npm install -g @expo/ngrok`
3. Use specific port: `npx expo start --tunnel --port 8090`

---

## 📋 COMPLETE COMMAND REFERENCE

### Basic Commands
```bash
# Standard start (local network only)
npx expo start

# Tunnel mode (works anywhere)
npx expo start --tunnel

# Specific port
npx expo start --tunnel --port 8085

# Web version
npx expo start --web
```

### Emergency Commands
```bash
# Kill all expo processes
pkill -f expo

# Fresh install
npm install

# Clear cache and restart
npx expo start --clear --tunnel
```

---

## 🎯 QUICK CHECKLIST

- [ ] Navigate to `AwesomeQRApp` directory
- [ ] Run `npx expo start --tunnel`
- [ ] Accept any port changes (press Y)
- [ ] Install ngrok if prompted (press Y)
- [ ] Wait for QR code to appear
- [ ] Scan with Expo Go (Android) or Camera (iOS)
- [ ] App loads on device ✅

---

## 📱 EXPO GO APP SETUP

### First Time Setup:
1. **Download Expo Go** from App Store/Google Play
2. **Create account** or sign in
3. **Allow camera permissions**

### Scanning:
- **Android:** Open Expo Go → "Scan QR Code" button
- **iOS:** Open Camera app → Point at QR code → Tap notification

---

## 🚨 EMERGENCY QR CODE BACKUP

If the server is down, use this backup QR code (may be outdated):
```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄▄ ▀ ▄██ ▀▀██ ▄▄▄▄▄ █
█ █   █ ██▄▀ █ ▄█▄▀▀▄▄█ █   █ █
█ █▄▄▄█ ██▀▄ ▄▀▄█▄▀▄▄▀█ █▄▄▄█ █
█▄▄▄▄▄▄▄█ ▀▄█ ▀▄█▄█▄█▄█▄▄▄▄▄▄▄█
█  █▄ ▀▄▀▀▄▀█▄█▄▀▄ ▄▀██▄▀▀██▀▄█
█▀▀█▀▀█▄▄▄▄██▄██▄█  █▀ ▄▄███▄▀█
██▄ ▀▄▀▄▀▀▄ █▀▄   █▄█▄▄  ▀▄█  █
█▀▀▀  ▀▄▀▄ ▀█▀▀  ▄█ ▄ ▀▀█▄█ █ █
█ ▄███▀▄▄▀█▄ ▄██▀▀█▄ ▀██▄▀▀▀ ▄█
█  █▀▄▀▄ ▄ ▄▀▄ ▄▄▄▄ ▄▄ ▄▄▀█▀▀▄█
█▄▄▄█▄█▄█ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
```

---

## 💡 PRO TIPS

1. **Keep Terminal Open:** Don't close the terminal while developing
2. **Auto-Reload:** Changes to code automatically reload on device
3. **Shake Device:** Shake phone to open developer menu
4. **Network Issues:** Use `--tunnel` for remote access, skip for local only
5. **Multiple Devices:** Same QR code works on multiple devices

---

## 🔄 LAST SUCCESSFUL CONFIGURATION

- **Port Used:** 8085
- **Mode:** Tunnel
- **Command:** `npx expo start --tunnel --port 8085`
- **Date:** Generated automatically
- **Status:** ✅ Working

---

**⏱️ Target Time: Under 2 minutes from opening terminal to scanning QR code!** 