import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { 
  getOnboardingAnswers, 
  OnboardingAnswers, 
  getCurrentMood,
  savePlan,
  PlanData 
} from '../utils/localStorage';
import { 
  WELCOME_MESSAGES, 
  MOOD_BASED_RESPONSES,
  generatePersonalizedPrompt,
  CLARIO_SYSTEM_PROMPT 
} from '../utils/clarioPromptTemplates';
import PlanCard from './PlanCard';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isPlan?: boolean;
  planData?: PlanData;
}

export default function ChatScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userAnswers, setUserAnswers] = useState<OnboardingAnswers | null>(null);
  const [currentMood, setCurrentMood] = useState<number>(5);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (isTyping) {
      startTypingAnimation();
    }
  }, [isTyping]);

  const loadUserData = async () => {
    const answers = await getOnboardingAnswers();
    const mood = await getCurrentMood();
    
    setUserAnswers(answers);
    setCurrentMood(mood?.mood || 5);

    if (answers) {
      // Send welcome message
      const welcomeMessage = WELCOME_MESSAGES[0].replace('{name}', answers.name);
      setTimeout(() => {
        addMessage(welcomeMessage, false);
      }, 1000);
    }
  };

  const startTypingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingDots, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(typingDots, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  };

  const addMessage = (text: string, isUser: boolean, isPlan = false, planData?: PlanData) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      isPlan,
      planData,
    };

    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const getMoodBasedResponse = (mood: number): string => {
    if (mood <= 3) return MOOD_BASED_RESPONSES.low[Math.floor(Math.random() * MOOD_BASED_RESPONSES.low.length)];
    if (mood <= 7) return MOOD_BASED_RESPONSES.medium[Math.floor(Math.random() * MOOD_BASED_RESPONSES.medium.length)];
    return MOOD_BASED_RESPONSES.high[Math.floor(Math.random() * MOOD_BASED_RESPONSES.high.length)];
  };

  const generateClarioResponse = async (userMessage: string): Promise<string> => {
    // In a real app, this would call an LLM API
    // For now, we'll simulate with predefined responses
    
    if (!userAnswers) return "I'm still getting to know you. How are you feeling today?";

    const moodResponse = getMoodBasedResponse(currentMood);
    
    // Simple keyword-based responses for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return `${moodResponse} I can see you're looking for some clarity. Let me help you break this down into manageable steps. What feels most overwhelming right now?`;
    }
    
    if (lowerMessage.includes('plan') || lowerMessage.includes('strategy')) {
      return "I'd love to help you create a plan. Tell me more about what you're working on, and I'll help you organize your thoughts into clear, actionable steps.";
    }
    
    if (lowerMessage.includes('feeling') || lowerMessage.includes('emotion')) {
      return `Thank you for sharing that with me. Your feelings are completely valid. Based on what you've told me about ${userAnswers.yearGoal}, how can we channel these emotions into forward movement?`;
    }

    return `I hear you, ${userAnswers.name}. ${moodResponse} Let's explore this together - what would taking just one small step forward look like?`;
  };

  const generatePlan = async (userMessage: string): Promise<PlanData> => {
    // In a real app, this would use the LLM to generate a personalized plan
    const planId = Date.now().toString();
    
    return {
      id: planId,
      title: "Your Clarity Plan",
      focus: `Focus on ${userAnswers?.yearGoal || 'your main goal'} with gentle intention`,
      wins: [
        "Take 5 minutes to write down your thoughts",
        "Choose one small action you can take today",
        "Practice self-compassion when things get difficult"
      ],
      insight: `Remember, ${userAnswers?.name}, progress isn't about perfection. It's about showing up consistently, even in small ways.`,
      createdAt: new Date().toISOString(),
    };
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message
    addMessage(userMessage, true);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate response delay
    setTimeout(async () => {
      setIsTyping(false);
      
      // Check if user wants a plan
      if (userMessage.toLowerCase().includes('plan') || 
          userMessage.toLowerCase().includes('organize') ||
          userMessage.toLowerCase().includes('strategy')) {
        
        const clarioResponse = await generateClarioResponse(userMessage);
        addMessage(clarioResponse, false);
        
        setTimeout(async () => {
          const plan = await generatePlan(userMessage);
          await savePlan(plan);
          addMessage("Here's a gentle plan to help you move forward:", false, true, plan);
        }, 1500);
      } else {
        const clarioResponse = await generateClarioResponse(userMessage);
        addMessage(clarioResponse, false);
      }
    }, 1500 + Math.random() * 1000);
  };

  const renderMessage = (message: Message) => {
    if (message.isPlan && message.planData) {
      return (
        <View key={message.id} style={{ marginVertical: 8 }}>
          <PlanCard plan={message.planData} />
        </View>
      );
    }

    return (
      <View
        key={message.id}
        style={{
          flexDirection: message.isUser ? 'row-reverse' : 'row',
          marginVertical: 8,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            maxWidth: '80%',
            backgroundColor: message.isUser ? '#1C2B3A' : 'white',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            borderBottomLeftRadius: message.isUser ? 20 : 4,
            borderBottomRightRadius: message.isUser ? 4 : 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: message.isUser ? 'white' : '#1C2B3A',
              lineHeight: 22,
            }}
          >
            {message.text}
          </Text>
        </View>
      </View>
    );
  };

  const TypingIndicator = () => (
    <View style={{
      flexDirection: 'row',
      marginVertical: 8,
      paddingHorizontal: 16,
    }}>
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <Animated.View style={{
          flexDirection: 'row',
          alignItems: 'center',
          opacity: typingDots,
        }}>
          <Text style={{ fontSize: 16, color: '#1C2B3A' }}>Clario is typing</Text>
          <View style={{ flexDirection: 'row', marginLeft: 8 }}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: '#AFCBFF',
                  borderRadius: 2,
                  marginHorizontal: 1,
                }}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          backgroundColor: 'white',
        }}>
          <View>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1C2B3A',
            }}>
              Clario
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
            }}>
              Your clarity coach
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('SavedPlansScreen')}
            style={{
              backgroundColor: '#AFCBFF',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1C2B3A',
            }}>
              Plans
            </Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          alignItems: 'flex-end',
        }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
              maxHeight: 100,
              fontSize: 16,
            }}
            placeholder="Share what's on your mind..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={handleSend}
          />
          
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={{
              backgroundColor: inputText.trim() ? '#1C2B3A' : '#E5E7EB',
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 18,
              color: inputText.trim() ? 'white' : '#9CA3AF',
            }}>
              →
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}