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