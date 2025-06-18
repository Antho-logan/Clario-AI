import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { saveOnboardingAnswers, OnboardingAnswers } from '../utils/localStorage';

type NavigationProp = StackNavigationProp<RootStackParamList, 'IntroQuestionnaire'>;

const { width: screenWidth } = Dimensions.get('window');

const questions = [
  {
    id: 'name',
    title: "What's your name?",
    subtitle: "Let's start with something simple.",
    type: 'text',
    placeholder: 'Your name...',
  },
  {
    id: 'workingOn',
    title: "What are you currently working on?",
    subtitle: "Select all that apply to your life right now.",
    type: 'multiSelect',
    options: [
      'Career goals', 'Health & fitness', 'Relationships', 'Creative projects',
      'Learning new skills', 'Mental wellbeing', 'Financial planning', 'Personal growth'
    ],
  },
  {
    id: 'currentFeeling',
    title: "How do you usually feel?",
    subtitle: "No right or wrong answer - just honest.",
    type: 'slider',
    emoji: ['😔', '😐', '😊', '😄', '🤩'],
  },
  {
    id: 'yearGoal',
    title: "What's one goal for this year?",
    subtitle: "Big or small, what matters to you?",
    type: 'text',
    placeholder: 'My goal is...',
  },
  {
    id: 'holdingBack',
    title: "What's holding you back?",
    subtitle: "What gets in your way most often?",
    type: 'text',
    placeholder: 'I feel stuck because...',
  },
  {
    id: 'reactionToProblems',
    title: "How do you react when things go wrong?",
    subtitle: "Understanding your patterns helps me help you.",
    type: 'text',
    placeholder: 'When problems come up, I usually...',
  },
  {
    id: 'helpWith',
    title: "What do you want Clario to help with?",
    subtitle: "How can I best support you?",
    type: 'text',
    placeholder: 'I need help with...',
  },
  {
    id: 'clarityMeaning',
    title: 'What does "clarity" mean to you?',
    subtitle: "Your definition will guide our journey together.",
    type: 'text',
    placeholder: 'Clarity to me means...',
  },
];

export default function IntroQuestionnaire() {
  const navigation = useNavigation<NavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({
    workingOn: [],
    currentFeeling: 5,
  });
  const [fadeAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef<ScrollView>(null);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleMultiSelect = (option: string) => {
    const currentSelection = answers.workingOn || [];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter(item => item !== option)
      : [...currentSelection, option];
    
    handleAnswer('workingOn', newSelection);
  };

  const nextStep = async () => {
    if (isLastStep) {
      // Save answers and navigate to onboarding
      try {
        await saveOnboardingAnswers(answers as OnboardingAnswers);
        navigation.navigate('OnboardingScreen');
      } catch (error) {
        console.error('Error saving answers:', error);
      }
    } else {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    const answer = answers[currentQuestion.id as keyof OnboardingAnswers];
    if (currentQuestion.type === 'multiSelect') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer && answer.toString().trim().length > 0;
  };

  const renderTextInput = () => (
    <TextInput
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      placeholder={currentQuestion.placeholder}
      placeholderTextColor="#9CA3AF"
      value={answers[currentQuestion.id as keyof OnboardingAnswers] as string || ''}
      onChangeText={(text) => handleAnswer(currentQuestion.id, text)}
      multiline
      autoFocus
    />
  );

  const renderMultiSelect = () => (
    <View style={{ gap: 12 }}>
      {currentQuestion.options?.map((option, index) => {
        const isSelected = (answers.workingOn || []).includes(option);
        return (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: isSelected ? '#AFCBFF' : 'white',
              borderRadius: 16,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
            onPress={() => handleMultiSelect(option)}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: isSelected ? '600' : '400',
              color: isSelected ? '#1C2B3A' : '#374151',
            }}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderSlider = () => {
    const feeling = answers.currentFeeling || 5;
    const emojiIndex = Math.min(Math.floor((feeling - 1) / 2), 4);
    
    return (
      <View style={{ alignItems: 'center', gap: 32 }}>
        <Text style={{ fontSize: 64 }}>
          {currentQuestion.emoji?.[emojiIndex]}
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          width: '100%',
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
            <TouchableOpacity
              key={value}
              style={{
                flex: 1,
                height: 44,
                backgroundColor: feeling >= value ? '#AFCBFF' : '#F3F4F6',
                marginHorizontal: 2,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => handleAnswer('currentFeeling', value)}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: feeling >= value ? '#1C2B3A' : '#9CA3AF',
              }}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
          {feeling}/10
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        {/* Progress bar */}
        <View style={{
          height: 4,
          backgroundColor: '#E5E7EB',
          borderRadius: 2,
          marginBottom: 48,
        }}>
          <View style={{
            height: 4,
            backgroundColor: '#AFCBFF',
            borderRadius: 2,
            width: `${((currentStep + 1) / questions.length) * 100}%`,
          }} />
        </View>

        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <Text style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#1C2B3A',
            marginBottom: 12,
            lineHeight: 40,
          }}>
            {currentQuestion.title}
          </Text>
          
          <Text style={{
            fontSize: 18,
            color: '#6B7280',
            marginBottom: 48,
            lineHeight: 24,
          }}>
            {currentQuestion.subtitle}
          </Text>

          <ScrollView 
            ref={scrollViewRef}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {currentQuestion.type === 'text' && renderTextInput()}
            {currentQuestion.type === 'multiSelect' && renderMultiSelect()}
            {currentQuestion.type === 'slider' && renderSlider()}
          </ScrollView>
        </Animated.View>

        {/* Navigation buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 24,
          paddingBottom: 32,
        }}>
          <TouchableOpacity
            onPress={prevStep}
            style={{
              opacity: currentStep === 0 ? 0 : 1,
              padding: 16,
            }}
            disabled={currentStep === 0}
          >
            <Text style={{ fontSize: 16, color: '#6B7280' }}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextStep}
            disabled={!isStepValid()}
            style={{
              backgroundColor: isStepValid() ? '#1C2B3A' : '#E5E7EB',
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 24,
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: isStepValid() ? 'white' : '#9CA3AF',
            }}>
              {isLastStep ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}