# Clario AI - Mobile App

> Your AI-powered entrepreneurship companion

Clario AI is a mobile application designed to help entrepreneurs at every stage of their journey. Get personalized guidance, strategic insights, and actionable plans to build and grow your business.

## 🚀 Features

- **Personalized Onboarding**: 8-question assessment to understand your entrepreneurial needs
- **AI-Powered Insights**: Customized recommendations based on your profile
- **Focus Areas**: Three key areas of business development:
  - Market Research & Validation 🎯
  - Strategic Planning & Execution 🚀
  - Financial Management & Growth 💰
- **Beautiful UI**: Modern, iOS-inspired design with smooth animations
- **Cross-Platform**: Built with React Native and Expo for iOS, Android, and Web

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Expo Linear Gradient** - Beautiful gradient effects
- **Animated API** - Smooth animations and transitions

## 📱 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Expo CLI
- Expo Go app (for testing on device)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/clario-ai/mobile-app.git
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go app or press `w` to open in web browser

### 🔧 Troubleshooting Expo Go Connection Issues

If you're having trouble connecting Expo Go to your development server, we've created comprehensive troubleshooting tools:

#### Quick Fix Scripts
- **Windows**: Double-click `fix-expo-go.bat` or run `.\fix-expo-go.bat`
- **macOS/Linux**: Run `./fix-expo-go.sh`

#### Reliable Start Script
- **All Platforms**: `./start-expo-reliable.sh` (automatically tries LAN, then tunnel mode)

#### Manual Commands
```bash
# Emergency fallback (works 99% of the time)
npx expo start --tunnel

# Clear all caches and restart
npx expo start --clear
```

#### Common Issues & Solutions
- **Network connectivity**: Ensure both devices are on the same Wi-Fi network
- **Firewall blocking**: Use tunnel mode with `--tunnel` flag
- **Cache issues**: Run the fix script or clear manually with `--clear`
- **Device cache**: Clear Expo Go cache in device settings

📖 **Full troubleshooting guide**: See [EXPO_GO_TROUBLESHOOTING.md](EXPO_GO_TROUBLESHOOTING.md)  
⚡ **Quick usage**: See [QUICK_USAGE.md](QUICK_USAGE.md)

## 🎯 App Flow

1. **Home Screen** - Welcome screen with login options
2. **Onboarding** - 8-question assessment covering:
   - Personal information (name, country, language)
   - Business goals and experience level
   - Industry interests and challenges
3. **Loading Screen** - Animated progress bar with status updates
4. **Focus Screen** - Personalized recommendations with three key focus areas
5. **Continue to App** - Ready to explore the full application

## 🎨 Design System

- **Primary Color**: #007AFF (iOS Blue)
- **Background**: #FAFAFA (Light Gray)
- **Text Colors**: #1D1D1F (Primary), #86868B (Secondary)
- **Typography**: iOS Human Interface Guidelines
- **Animations**: 60fps smooth transitions

## 📂 Project Structure

```
AwesomeQRApp/
├── app/
│   ├── navigation.tsx       # Navigation configuration
│   └── screens/
│       ├── HomeScreen.tsx   # Landing page with login
│       ├── OnboardingScreen.tsx # 8-question assessment
│       ├── LoadingScreen.tsx    # Progress animation
│       └── FocusScreen.tsx      # Three focus points
├── components/
│   └── NextButton.tsx       # Reusable animated button
├── assets/                  # Images and icons
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Deployment

### Web
```bash
npm run web
```

### iOS/Android
1. Build with EAS:
```bash
npx eas build
```

2. Submit to app stores:
```bash
npx eas submit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

- Website: [clario.ai](https://clario.ai)
- Issues: [GitHub Issues](https://github.com/clario-ai/mobile-app/issues)
- Email: support@clario.ai

---

Built with ❤️ by the Clario AI Team 