#!/bin/bash

echo "🎬 Setting up AppClario Premium Animation System..."
echo "=================================================="

# Install React Native Reanimated and Gesture Handler
echo "📦 Installing animation dependencies..."
npm install react-native-reanimated@~3.15.0 react-native-gesture-handler@~2.20.2

# Install React Native Reanimated specifically for Expo
echo "📦 Installing Expo-compatible versions..."
npx expo install react-native-reanimated react-native-gesture-handler

# Create babel configuration for Reanimated
echo "⚙️ Configuring Babel for Reanimated..."
cat > babel.config.js << EOF
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOF

# Update app.json for gesture handler
echo "⚙️ Updating app.json configuration..."
cat > app.json << 'EOF'
{
  "expo": {
    "name": "AppClario",
    "slug": "app-clario",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FAFAFA"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.appclario.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FAFAFA"
      },
      "package": "com.appclario.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-barcode-scanner",
        {
          "cameraPermission": "Allow AppClario to access camera for QR scanning."
        }
      ],
      "react-native-reanimated/plugin"
    ]
  }
}
EOF

# Create gesture handler configuration for index.js
echo "⚙️ Setting up gesture handler entry point..."
cat > index.js << 'EOF'
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
EOF

# Create enhanced TypeScript configuration
echo "⚙️ Updating TypeScript configuration..."
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "noEmit": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/utils/*": ["./utils/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
EOF

# Check if pattern data exists, create if not
if [ ! -f "utils/patternData.ts" ]; then
  echo "📊 Creating pattern data..."
  mkdir -p utils
  cat > utils/patternData.ts << 'EOF'
export interface BehaviorLoop {
  id: string;
  title: string;
  summary: string;
  icon: string;
}

export const behaviorLoops: BehaviorLoop[] = [
  {
    id: '1',
    title: 'Procrastination Spiral',
    summary: 'Avoiding tasks leads to anxiety, which makes starting even harder.',
    icon: '🌀'
  },
  {
    id: '2',
    title: 'Perfectionism Trap',
    summary: 'Fear of imperfection prevents starting, leading to missed opportunities.',
    icon: '🎯'
  },
  {
    id: '3',
    title: 'Social Media Escape',
    summary: 'Using social platforms to avoid real-world challenges and responsibilities.',
    icon: '📱'
  },
  {
    id: '4',
    title: 'Decision Paralysis',
    summary: 'Overthinking choices to avoid making the "wrong" decision.',
    icon: '🤔'
  }
];
EOF
fi

echo ""
echo "✨ Premium Animation System Setup Complete!"
echo ""
echo "🎭 Features Added:"
echo "   • Cinematic entrance animations"
echo "   • Tactile button interactions"
echo "   • Staggered card animations"
echo "   • Smooth page transitions"
echo "   • Premium motion config system"
echo ""
echo "🚀 Next Steps:"
echo "   1. Run 'npm start' or 'expo start'"
echo "   2. Experience the premium motion design"
echo "   3. Enjoy the dopamine-triggering animations!"
echo ""
echo "💫 AppClario is now motion-ready with premium feel!"
EOF