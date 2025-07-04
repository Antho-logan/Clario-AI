#!/bin/bash
echo "🚀 Reliable Expo Start Script"
echo "============================="

# Function to check if Expo is running
check_expo_running() {
    if pgrep -f "expo start" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to wait for QR code
wait_for_qr() {
    echo "⏳ Waiting for QR code to appear..."
    sleep 5
    if check_expo_running; then
        echo "✅ QR code should be visible now!"
        return 0
    else
        echo "❌ Expo seems to have failed"
        return 1
    fi
}

echo "🔄 Step 1: Starting Expo in LAN mode..."
npx expo start --clear &
EXPO_PID=$!

# Wait for QR code to appear
if wait_for_qr; then
    echo "✅ LAN mode working! You can now scan the QR code."
    echo "📱 If you have connection issues, press Ctrl+C and we'll try tunnel mode."
    wait $EXPO_PID
else
    echo "❌ LAN mode failed. Trying tunnel mode..."
    
    # Kill the previous process
    kill $EXPO_PID 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    
    echo "🚇 Step 2: Starting Expo in tunnel mode..."
    npx expo start --tunnel --clear &
    EXPO_PID=$!
    
    if wait_for_qr; then
        echo "✅ Tunnel mode working! You can now scan the QR code."
        echo "📱 Tunnel mode is slower but more reliable."
        wait $EXPO_PID
    else
        echo "❌ Both modes failed. Please check the troubleshooting guide."
        echo "🔧 Try running: ./fix-expo-go.sh"
        exit 1
    fi
fi 