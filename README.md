# AwesomeQRApp

A React Native iOS app built with Expo that provides QR code and barcode scanning functionality.

## Features

- 📱 iOS-optimized QR/barcode scanner
- 📷 Camera permission handling
- 🔄 Rescan functionality
- 📋 Display scanned data
- 🎯 Built for Expo Go

## Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your iOS device
- iOS device with camera

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd AwesomeQRApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Scan the QR code with Expo Go on your iOS device

## Usage

1. Launch the app through Expo Go
2. Grant camera permissions when prompted
3. Point your camera at a QR code or barcode
4. View the scanned data
5. Tap "Scan again" to scan another code

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **expo-barcode-scanner** - Camera and scanning functionality

## Project Structure

```
AwesomeQRApp/
├── App.tsx              # Main app component with scanner logic
├── index.js             # App entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── app.json             # Expo configuration
└── assets/              # Static assets
```

## Development

- `npm start` - Start Expo development server
- `npm run ios` - Start with iOS simulator
- `npm run android` - Start with Android emulator
- `npm run web` - Start web version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on iOS device
5. Submit a pull request

## License

MIT License - see LICENSE file for details 