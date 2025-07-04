import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import NextButton from '../../components/NextButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  type: 'multiple_choice' | 'text_input' | 'rating';
  options?: string[];
  placeholder?: string;
}

// Sample questions - you can replace these with your actual questions
const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What's your name?",
    subtitle: "Let's get to know you better",
    type: 'text_input',
    placeholder: 'Enter your name...'
  },
  {
    id: 2,
    title: "Which country are you from?",
    subtitle: "This helps us provide location-relevant insights",
    type: 'multiple_choice',
    options: [
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'France',
      'Netherlands',
      'Belgium',
      'Spain',
      'Italy',
      'Portugal',
      'Sweden',
      'Norway',
      'Denmark',
      'Finland',
      'Switzerland',
      'Austria',
      'Poland',
      'Czech Republic',
      'Hungary',
      'Romania',
      'Bulgaria',
      'Greece',
      'Turkey',
      'Russia',
      'Ukraine',
      'India',
      'China',
      'Japan',
      'South Korea',
      'Singapore',
      'Malaysia',
      'Thailand',
      'Philippines',
      'Indonesia',
      'Vietnam',
      'Brazil',
      'Mexico',
      'Argentina',
      'Colombia',
      'Chile',
      'Peru',
      'South Africa',
      'Nigeria',
      'Kenya',
      'Egypt',
      'Morocco',
      'Israel',
      'United Arab Emirates',
      'Saudi Arabia',
      'Other'
    ]
  },
  {
    id: 3,
    title: "What language would you want to use it in?",
    subtitle: "Choose your preferred language for the app",
    type: 'multiple_choice',
    options: [
      'English',
      'Spanish',
      'French',
      'German',
      'Italian',
      'Portuguese',
      'Dutch',
      'Russian',
      'Chinese (Simplified)',
      'Chinese (Traditional)',
      'Japanese',
      'Korean',
      'Arabic',
      'Hindi',
      'Other'
    ]
  },
  {
    id: 4,
    title: "What's your main goal?",
    subtitle: "Help us understand what you're looking to achieve",
    type: 'multiple_choice',
    options: [
      'Start a new business',
      'Grow existing business',
      'Learn entrepreneurship',
      'Find business ideas',
      'Other'
    ]
  },
  {
    id: 5,
    title: "What industry interests you most?",
    subtitle: "This helps us provide relevant insights",
    type: 'multiple_choice',
    options: [
      'Technology',
      'E-commerce',
      'Consulting',
      'Health & Wellness',
      'Creative Services',
      'Not sure yet'
    ]
  },
  {
    id: 6,
    title: "What's your biggest challenge?",
    subtitle: "Tell us what you're struggling with most",
    type: 'text_input',
    placeholder: 'Describe your main challenge or concern...'
  },
  {
    id: 7,
    title: "How experienced are you?",
    subtitle: "Rate your entrepreneurial experience",
    type: 'multiple_choice',
    options: [
      'Complete beginner',
      'Some experience',
      'Experienced',
      'Very experienced',
      'Expert level'
    ]
  },
  {
    id: 8,
    title: "What type of help do you need most?",
    subtitle: "Select all that apply to you",
    type: 'multiple_choice',
    options: [
      'Business planning',
      'Marketing strategies',
      'Financial guidance',
      'Technical development',
      'Networking opportunities'
    ]
  }
];

export default function OnboardingScreen({ navigation }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string | string[]}>({});
  const [textInput, setTextInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation values
  const cardAnimatedValue = useRef(new Animated.Value(0)).current;
  const progressAnimatedValue = useRef(new Animated.Value(0)).current;
  const fadeAnimatedValue = useRef(new Animated.Value(1)).current;

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / QUESTIONS.length;
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnimatedValue, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const handleAnswer = (answer: string) => {
    if (currentQuestion.type === 'multiple_choice') {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }));
      
      // Auto-advance for multiple choice
      setTimeout(() => {
        goToNextQuestion();
      }, 300);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: textInput.trim()
      }));
      setTextInput('');
      goToNextQuestion();
    }
  };

  const goToNextQuestion = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);

    // For text input questions, use simple fade instead of flip animation
    if (currentQuestion.type === 'text_input') {
      Animated.timing(fadeAnimatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (isLastQuestion) {
          completeOnboarding();
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          
          // Simple fade back in for text questions
          Animated.timing(fadeAnimatedValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setIsAnimating(false);
          });
        }
      });
    } else {
      // Flip card animation for multiple choice questions
      Animated.sequence([
        Animated.timing(fadeAnimatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimatedValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isLastQuestion) {
          completeOnboarding();
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          
          // Reset animations for next question
          cardAnimatedValue.setValue(0);
          Animated.timing(fadeAnimatedValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setIsAnimating(false);
          });
        }
      });
    }
  };

  const completeOnboarding = async () => {
    // Save user data to AsyncStorage for Dashboard
    try {
      const userName = answers[1] as string; // First question is "What's your name?"
      if (userName) {
        await AsyncStorage.setItem('userName', userName);
      }
      
      // Here you would typically save the answers to your backend
      console.log('Onboarding completed with answers:', answers);
    } catch (error) {
      console.log('Error saving user data:', error);
    }
    
    // Navigate to loading screen with answers
    navigation.navigate('Loading', { answers });
  };

  const skipQuestion = () => {
    goToNextQuestion();
  };

  // Card flip animation
  const cardRotateY = cardAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const cardScale = cardAnimatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.9, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: progressAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} of {QUESTIONS.length}
        </Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Question Card */}
        <Animated.View 
          style={[
            styles.questionCard,
            {
              opacity: fadeAnimatedValue,
              transform: currentQuestion.type === 'text_input' ? [] : [
                { rotateY: cardRotateY },
                { scale: cardScale }
              ]
            }
          ]}
        >
          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
            <Text style={styles.questionSubtitle}>{currentQuestion.subtitle}</Text>
          </View>

          <ScrollView style={styles.answerContainer} showsVerticalScrollIndicator={false}>
            {currentQuestion.type === 'multiple_choice' && (
              <View style={styles.optionsContainer}>
                {currentQuestion.options?.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      answers[currentQuestion.id] === option && styles.selectedOption
                    ]}
                    onPress={() => handleAnswer(option)}
                  >
                    <Text style={[
                      styles.optionText,
                      answers[currentQuestion.id] === option && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {currentQuestion.type === 'text_input' && (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={textInput}
                  onChangeText={setTextInput}
                  placeholder={currentQuestion.placeholder}
                  placeholderTextColor="#86868B"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <NextButton
                  title="Continue"
                  onPress={handleTextSubmit}
                  disabled={!textInput.trim()}
                />
              </View>
            )}
          </ScrollView>
        </Animated.View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={skipQuestion}>
          <Text style={styles.skipButtonText}>Skip this question</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#86868B',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  questionHeader: {
    marginBottom: 30,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    lineHeight: 34,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#86868B',
    lineHeight: 22,
  },
  answerContainer: {
    flex: 1,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  textInputContainer: {
    gap: 20,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1D1D1F',
    minHeight: 120,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#86868B',
    fontWeight: '500',
  },
}); 