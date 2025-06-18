# Clario AI Coach - Quick Start Guide

Get your Clario AI Coach app running in under 5 minutes! 🚀

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on iOS Simulator
```bash
npm run ios
```

Or scan the QR code with your iOS device using the Expo Go app.

## 📱 Testing the App Flow

### Complete Onboarding
1. **Name**: Enter any name
2. **Working On**: Select multiple options (e.g., "Career goals", "Mental wellbeing")
3. **Feeling**: Set mood slider (1-10)
4. **Year Goal**: Enter a goal like "Get promoted" or "Start a business"
5. **Holding Back**: Describe challenges like "Fear of failure"
6. **Reaction**: How you handle setbacks
7. **Help With**: What you want Clario to help with
8. **Clarity Meaning**: Your definition of clarity

### Test Features
- **Theme Toggle**: Try light/dark mode on welcome screen
- **Chat Interface**: Type messages with keywords like "help", "plan", "strategy"
- **Plan Generation**: Ask for a plan to see AI-generated clarity cards
- **Mood Tracking**: Access via "Plans" screen mood button
- **Saved Plans**: View and manage generated plans

## 🎯 Key Test Scenarios

### Generate a Plan
Type in chat: *"I need help creating a plan for my career goals"*

### Mood-Based Responses
1. Set mood to low (1-3) in mood tracker
2. Chat with Clario to see empathetic responses

### Plan Management
1. Generate multiple plans
2. Navigate to "Plans" screen
3. Expand cards to see full insights
4. Test delete functionality

## 🛠 Development Tips

### Hot Reload
- Save any file to see changes instantly
- Shake device/simulator to open developer menu

### Debugging
- Use `console.log()` statements (visible in terminal)
- React Native Debugger for advanced debugging
- Expo DevTools for network requests

### Common Issues
- **Metro bundler issues**: Restart with `npm start --clear`
- **iOS Simulator not opening**: Ensure Xcode is installed
- **TypeScript errors**: Dependencies might need installation

## 📋 Demo Data

The app includes sample responses and templates for testing without a real AI backend.

### Sample User Inputs
- **Name**: "Alex"
- **Goals**: Career advancement, better work-life balance
- **Challenges**: Time management, procrastination
- **Mood**: Varies 4-7 range

### Test Messages
Try these in the chat to see different response types:
- "I'm feeling stuck with my project"
- "Can you help me create a plan?"
- "I'm having trouble focusing"
- "What should I do when I feel overwhelmed?"

## 🚀 Ready for Production

### Add Real AI
1. Get API key from OpenAI/Anthropic
2. Update `generateClarioResponse()` in ChatScreen.tsx
3. Replace keyword-based logic with actual API calls

### Deploy
```bash
expo build:ios    # For iOS App Store
expo build:web    # For web deployment
```

### Environment Variables
Create `.env` file for API keys:
```
OPENAI_API_KEY=your_key_here
AI_MODEL=gpt-4
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#YOUR_COLOR',
  accent: '#YOUR_ACCENT',
  background: '#YOUR_BG',
}
```

### Modify AI Personality
Edit prompts in `utils/clarioPromptTemplates.ts`

### Add New Questions
Update `questions` array in `IntroQuestionnaire.tsx`

---

**You're ready to go!** 🌱 

If you encounter any issues, check the main README.md for detailed troubleshooting.