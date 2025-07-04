# 🚀 CLARIO AI - QUICK START GUIDE

> Get your Clario AI app running in under 2 minutes!

## 📱 WHAT IS CLARIO AI?

Clario AI is your AI-powered entrepreneurship companion. The app provides:
- **Personalized onboarding** with 8 strategic questions
- **AI-driven insights** for your business journey
- **Three focus areas** for entrepreneurial success
- **Beautiful, iOS-inspired** user interface

---

## ⚡ FASTEST METHOD (30 seconds)

### Step 1: Open Terminal in Project
```bash
cd AwesomeQRApp
```

### Step 2: Start Expo Development Server
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

## 🎯 APP FLOW PREVIEW

Once you scan the QR code, you'll experience:

1. **🏠 Home Screen** - Welcome with beautiful animations and login options
2. **📝 Onboarding** - 8 personalized questions covering:
   - Your name and location
   - Preferred language
   - Business goals and experience
   - Industry interests and challenges
3. **⏳ Loading Screen** - Animated progress bar with status updates
4. **🎯 Focus Areas** - Three key recommendations:
   - Market Research & Validation 🎯
   - Strategic Planning & Execution 🚀
   - Financial Management & Growth 💰
5. **🚀 Continue to App** - Ready for the full experience

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
npx expo start --tunnel --port 8150
```

### Problem: Global Expo CLI Deprecated Warning
**Solution:** Ignore the warning, use `npx expo` (already correct)

### Problem: Tunnel Connection Issues
**Solutions:**
1. Try without tunnel first: `npx expo start`
2. Install ngrok globally: `npm install -g @expo/ngrok`
3. Use specific port: `npx expo start --tunnel --port 8150`

---

## 📋 COMPLETE COMMAND REFERENCE

### Basic Commands
```bash
# Standard start (local network only)
npx expo start

# Tunnel mode (works anywhere) - RECOMMENDED
npx expo start --tunnel

# Specific port
npx expo start --tunnel --port 8150

# Web version (test in browser)
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
- [ ] Experience the Clario AI onboarding flow ✅

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

## 🎨 DESIGN FEATURES YOU'LL SEE

- **🎯 Clario AI Branding** - Beautiful logo and consistent blue theme (#007AFF)
- **✨ Smooth Animations** - 60fps transitions and micro-interactions
- **📱 iOS-Inspired Design** - Following Human Interface Guidelines
- **🎴 Card-Based Layout** - Clean, modern interface
- **🌊 Floating Elements** - Animated background components

---

## 💡 PRO TIPS

1. **Keep Terminal Open:** Don't close the terminal while developing
2. **Auto-Reload:** Changes to code automatically reload on device
3. **Shake Device:** Shake phone to open developer menu
4. **Network Issues:** Use `--tunnel` for remote access, skip for local only
5. **Multiple Devices:** Same QR code works on multiple devices
6. **Web Testing:** Press `w` in terminal to test in browser

---

## 🔄 RECOMMENDED CONFIGURATION

- **Port:** 8150 (or auto-assigned)
- **Mode:** Tunnel (for best connectivity)
- **Command:** `npx expo start --tunnel --port 8150`
- **Target:** Under 2 minutes from terminal to app launch

---

## 🌟 WHAT'S NEXT?

After testing the app:
1. **Explore the onboarding flow** - Answer the 8 questions
2. **Watch the loading animations** - Beautiful progress indicators
3. **Review your focus areas** - Personalized recommendations
4. **Continue development** - Ready to build more features!

---

**⏱️ Target Time: Under 2 minutes from opening terminal to experiencing Clario AI!**

---

Built with ❤️ by the Clario AI Team 