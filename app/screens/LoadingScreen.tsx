import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

interface Props {
  navigation: LoadingScreenNavigationProp;
  route?: {
    params?: {
      answers?: any;
    };
  };
}

const LOADING_STEPS = [
  { text: 'Processing your information...', duration: 1500 },
  { text: 'Analyzing your preferences...', duration: 1200 },
  { text: 'Creating your profile...', duration: 1000 },
  { text: 'Setting up your experience...', duration: 800 },
  { text: 'Almost ready...', duration: 500 },
];

export default function LoadingScreen({ navigation, route }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  
  // All animation values properly declared
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const textFadeAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize all state
    setProgressPercentage(0);
    setProgressWidth(0);
    setCurrentStep(0);
    setIsComplete(false);
    
    // Slide in animation when screen loads
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      // Start loading sequence after screen is fully visible
      setTimeout(() => {
        startLoadingSequence();
      }, 1000);
    });
  }, []);

  const startLoadingSequence = () => {
    let totalTime = 0;
    
    LOADING_STEPS.forEach((step, index) => {
      setTimeout(() => {
        // Update current step
        setCurrentStep(index);
        
        // Simple text fade
        Animated.sequence([
          Animated.timing(textFadeAnim, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // Calculate progress values
        const startPercentage = Math.round((index / LOADING_STEPS.length) * 100);
        const targetPercentage = Math.round(((index + 1) / LOADING_STEPS.length) * 100);
        const startWidth = (index / LOADING_STEPS.length) * 100;
        const targetWidth = ((index + 1) / LOADING_STEPS.length) * 100;
        
        // Animate progress with simple intervals (no Animated.Value conflicts)
        const totalSteps = step.duration / 50;
        const percentageIncrement = (targetPercentage - startPercentage) / totalSteps;
        const widthIncrement = (targetWidth - startWidth) / totalSteps;
        
        let currentPercentage = startPercentage;
        let currentWidth = startWidth;
        let stepCount = 0;
        
        const progressInterval = setInterval(() => {
          stepCount++;
          currentPercentage += percentageIncrement;
          currentWidth += widthIncrement;
          
          if (stepCount >= totalSteps) {
            currentPercentage = targetPercentage;
            currentWidth = targetWidth;
            clearInterval(progressInterval);
            
            // If this is the last step, complete loading
            if (index === LOADING_STEPS.length - 1) {
              setTimeout(() => {
                completeLoading();
              }, 300);
            }
          }
          
          setProgressPercentage(Math.round(currentPercentage));
          setProgressWidth(currentWidth);
        }, 50);
        
      }, totalTime);
      
      totalTime += step.duration + 400;
    });
  };

  const completeLoading = () => {
    setIsComplete(true);
    setProgressPercentage(100);
    
    // Animate fadeAnim for completion text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Button-style completion animation
    Animated.sequence([
      // Scale down with glow (like button press)
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]),
      // Scale back up
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),
      // Hold for completion
      Animated.delay(800),
      // Slide out and navigate
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to Focus screen instead of Home
      navigation.navigate('Focus', { answers: route?.params?.answers });
    });
  };

  // Simple interpolated values
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoWave}>~</Text>
            </View>
          </View>
          <Text style={styles.title}>Setting up your Clario AI</Text>
        </View>

        {/* Loading Content */}
        <View style={styles.loadingContainer}>
          {/* Loading Text */}
          <Animated.Text 
            style={[
              styles.loadingText,
              { opacity: textFadeAnim }
            ]}
          >
            {LOADING_STEPS[currentStep]?.text || 'Loading...'}
          </Animated.Text>

          {/* Progress Bar Container */}
          <View style={styles.progressContainer}>
            {/* Glow Effect */}
            <Animated.View
              style={[
                styles.progressGlow,
                {
                  opacity: glowOpacity,
                  shadowRadius: glowRadius,
                },
              ]}
            />
            
            {/* Progress Bar Background */}
            <View style={styles.progressBackground}>
              {/* Progress Bar Fill */}
              <View style={styles.progressFillContainer}>
                <LinearGradient
                  colors={['#007AFF', '#0056CC', '#003D99']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressFill,
                    { width: `${progressWidth}%` }
                  ]}
                />
              </View>
            </View>

            {/* Percentage Text */}
            <Text style={styles.percentageText}>
              {progressPercentage}%
            </Text>
          </View>

          {/* Completion Status */}
          {isComplete && (
            <Animated.View style={[styles.completionContainer, { opacity: fadeAnim }]}>
              <Text style={styles.completionText}>✓ Ready to go!</Text>
            </Animated.View>
          )}
        </View>

        {/* Bottom Decoration */}
        <View style={styles.bottomDecoration}>
          <View style={styles.decorationDot} />
          <View style={styles.decorationDot} />
          <View style={styles.decorationDot} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoWave: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#86868B',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    elevation: 8,
  },
  progressBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFillContainer: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  completionContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  completionText: {
    fontSize: 18,
    color: '#34C759',
    fontWeight: '600',
  },
  bottomDecoration: {
    flexDirection: 'row',
    marginTop: 60,
    gap: 8,
  },
  decorationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C7C7CC',
  },
}); 