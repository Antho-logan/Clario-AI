#!/bin/bash

# AI Action Reporting System Installation Script
# This script ensures all dependencies are properly installed

echo "🤖 AI Action Reporting System - Installation Script"
echo "=================================================="

# Check if we're in a React Native/Expo project
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from your React Native project root."
  exit 1
fi

# Check for required dependencies
echo "📦 Checking dependencies..."

# Install missing dependencies if any
MISSING_DEPS=""

# Check for expo-camera (needed for QR scanning)
if ! npm list expo-camera >/dev/null 2>&1; then
  MISSING_DEPS="$MISSING_DEPS expo-camera"
fi

# Check for react-native-svg (for charts - optional)
if ! npm list react-native-svg >/dev/null 2>&1; then
  echo "ℹ️  react-native-svg not found (optional for enhanced charts)"
fi

# Install missing dependencies
if [ ! -z "$MISSING_DEPS" ]; then
  echo "📥 Installing missing dependencies:$MISSING_DEPS"
  npm install $MISSING_DEPS
  
  if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
  else
    echo "❌ Failed to install dependencies"
    exit 1
  fi
else
  echo "✅ All required dependencies are already installed"
fi

# Create directories if they don't exist
echo "📁 Creating directory structure..."
mkdir -p src/services
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/utils

echo "✅ Directory structure created"

# Check TypeScript configuration
echo "🔧 Checking TypeScript configuration..."
if [ -f "tsconfig.json" ]; then
  echo "✅ TypeScript configuration found"
else
  echo "⚠️  TypeScript configuration not found. Creating basic tsconfig.json..."
  cat > tsconfig.json << EOF
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react-native",
    "lib": ["dom", "esnext"],
    "moduleResolution": "node",
    "noEmit": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
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
  echo "✅ Basic TypeScript configuration created"
fi

# Create a test script entry in package.json if it doesn't exist
echo "🧪 Setting up test scripts..."
if ! grep -q "ai-demo" package.json; then
  echo "Adding AI demo script to package.json..."
  # Note: This is a simplified approach. In a real scenario, you'd use a proper JSON parser
  echo "ℹ️  Add the following script to your package.json manually:"
  echo "    \"ai-demo\": \"node -e 'require(\\\"./src/utils/aiActionDemo\\\").runAIActionDemo()'\""
fi

# Create a simple demo runner
echo "🎯 Creating demo runner..."
cat > run-ai-demo.js << 'EOF'
// Simple demo runner for AI Action Reporting system
// Run with: node run-ai-demo.js

const demo = require('./src/utils/aiActionDemo');

async function main() {
  try {
    console.log('🚀 Running AI Action Reporting Demo...\n');
    
    // Run the comprehensive demo
    await demo.runAIActionDemo();
    
    console.log('\n✅ Demo completed successfully!');
    console.log('📖 Check AI_ACTION_REPORTING_GUIDE.md for detailed documentation.');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
EOF

echo "✅ Demo runner created (run-ai-demo.js)"

# Check if files were created successfully
echo "📋 Verifying installation..."
EXPECTED_FILES=(
  "src/services/AIActionReporter.ts"
  "src/components/AIActionReportView.tsx"
  "src/hooks/useAIActionReporter.ts"
  "src/utils/aiActionDemo.ts"
  "AI_ACTION_REPORTING_GUIDE.md"
)

ALL_GOOD=true
for file in "${EXPECTED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (missing)"
    ALL_GOOD=false
  fi
done

if [ "$ALL_GOOD" = true ]; then
  echo ""
  echo "🎉 AI Action Reporting System installed successfully!"
  echo ""
  echo "📚 Next steps:"
  echo "1. Review the documentation: AI_ACTION_REPORTING_GUIDE.md"
  echo "2. Run the demo: node run-ai-demo.js"
  echo "3. Integrate into your app by importing the components and hooks"
  echo ""
  echo "🔧 Integration example:"
  echo "   import { useAIActionReporter } from './src/hooks/useAIActionReporter';"
  echo "   import { AIActionReportView } from './src/components/AIActionReportView';"
  echo ""
  echo "💡 Tip: Check the console for any TypeScript errors and resolve them"
  echo "    by ensuring all React Native dependencies are properly installed."
else
  echo ""
  echo "⚠️  Some files are missing. Please ensure all files were created properly."
  echo "    Check the error messages above and resolve any issues."
fi

echo ""
echo "🏁 Installation script completed!"