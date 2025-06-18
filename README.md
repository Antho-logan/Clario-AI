# Clario AI Coach

A beautiful iOS productivity coach app built with React Native, Expo, and TypeScript. Clario helps users find clarity in their thoughts and goals through personalized AI coaching.

## ✨ Features

- **Intelligent Onboarding**: 8-step questionnaire to understand user's goals and challenges
- **AI Chat Interface**: Conversational coaching with typing animations and mood-based responses
- **Personalized Plans**: AI-generated clarity plans with focus areas, actionable wins, and emotional insights
- **Mood Tracking**: Emoji-based mood tracking with historical data
- **Beautiful UI**: Apple/OpenAI-level design with smooth animations and transitions
- **Data Persistence**: All user data stored locally with AsyncStorage

## 🎨 Design System

- **Background**: `#F5F7FA` - Calm, light gray
- **Primary**: `#1C2B3A` - Deep blue-gray for text and buttons
- **Accent**: `#AFCBFF` - Soft blue for highlights and interactions
- **Typography**: Inter/SF Rounded-inspired fonts
- **Animations**: Smooth fade-ins, slide transitions, and typing indicators

## 🏗 Architecture

### Core Components

- **App.tsx** - Main navigation container with React Navigation
- **IntroQuestionnaire.tsx** - 8-step swipe-style onboarding flow
- **OnboardingScreen.tsx** - Welcome screen with theme and notification settings
- **ChatScreen.tsx** - Main chat interface with Clario AI
- **PlanCard.tsx** - Expandable plan display component
- **MoodTracker.tsx** - Modal-based mood tracking interface
- **SavedPlansScreen.tsx** - Saved plans management screen

### Utilities

- **localStorage.ts** - AsyncStorage wrapper for data persistence
- **clarioPromptTemplates.ts** - AI prompt templates and response logic

## 📱 User Flow

1. **Onboarding**: Users complete 8 thoughtful questions about their goals and challenges
2. **Welcome Setup**: Theme preferences and notification settings
3. **Chat with Clario**: Conversational AI coaching interface
4. **Plan Generation**: AI creates personalized clarity plans based on conversations
5. **Mood Tracking**: Regular mood check-ins to personalize responses
6. **Plan Management**: Save, review, and manage generated plans

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Xcode) or physical iOS device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clario-ai-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on iOS**
   ```bash
   npm run ios
   ```

### Project Structure

```
clario-ai-coach/
├── App.tsx                    # Main app entry point
├── index.js                   # Expo entry point
├── components/                # React components
│   ├── IntroQuestionnaire.tsx
│   ├── OnboardingScreen.tsx
│   ├── ChatScreen.tsx
│   ├── PlanCard.tsx
│   ├── MoodTracker.tsx
│   └── SavedPlansScreen.tsx
├── utils/                     # Utility functions
│   ├── localStorage.ts
│   └── clarioPromptTemplates.ts
├── assets/                    # Images and icons
├── package.json
├── app.json                   # Expo configuration
├── tsconfig.json              # TypeScript configuration
├── babel.config.js            # Babel configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🧠 AI Integration

Currently uses simulated AI responses with keyword-based logic. To integrate with a real LLM:

1. **Add your AI service** (OpenAI, Anthropic, etc.)
2. **Update `generateClarioResponse`** in ChatScreen.tsx
3. **Use prompt templates** from clarioPromptTemplates.ts
4. **Implement proper error handling** for API calls

### Example Integration

```typescript
const generateClarioResponse = async (userMessage: string): Promise<string> => {
  const prompt = generatePersonalizedPrompt(userAnswers, userMessage);
  
  const response = await fetch('YOUR_AI_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: CLARIO_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
};
```

## 🎯 Key Features Implementation

### Smooth Animations
- Fade transitions between onboarding steps
- Typing indicators with animated dots
- Layout animations for expandable cards
- Smooth modal presentations

### Data Persistence
- User onboarding answers stored locally
- Mood tracking history (last 30 entries)
- Generated plans with timestamps
- User preferences (theme, notifications)

### Personalization
- AI responses tailored to user's onboarding answers
- Mood-based response selection
- Personalized plan generation
- Context-aware conversation history

## 🔧 Configuration

### Theme Customization
Edit colors in `tailwind.config.js` to customize the app's appearance.

### AI Personality
Modify prompts in `utils/clarioPromptTemplates.ts` to adjust Clario's personality and response style.

### Onboarding Questions
Update the `questions` array in `IntroQuestionnaire.tsx` to modify the onboarding flow.

## 📱 Platform Support

- **iOS**: Primary target with native iOS design patterns
- **Android**: Compatible but optimized for iOS-first experience
- **Web**: Basic support through Expo Web

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Apple's Human Interface Guidelines
- Design influenced by OpenAI's ChatGPT interface
- Built with Expo and React Native for cross-platform compatibility

---

**Clario AI Coach** - Find clarity in the beautiful chaos of life. 🌱