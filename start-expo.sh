#!/bin/bash

# 🚀 AwesomeQRApp Quick Start Script
# Run this script to get your QR code in seconds!

echo "🚀 Starting AwesomeQRApp..."
echo "📱 QR Code will appear shortly!"
echo ""

# Navigate to project directory (if not already there)
cd "$(dirname "$0")"

# Kill any existing expo processes
echo "🧹 Cleaning up existing processes..."
pkill -f expo 2>/dev/null || true

# Start Expo with tunnel mode
echo "🌐 Starting Expo with tunnel mode..."
echo "✅ Accept any port changes (press Y)"
echo "✅ Install ngrok if prompted (press Y)"
echo ""

# Use port 8085 as it was working last time
npx expo start --tunnel --port 8085

echo ""
echo "🎉 Expo server started!"
echo "📱 Scan the QR code above with:"
echo "   • Android: Expo Go app"
echo "   • iOS: Camera app" 