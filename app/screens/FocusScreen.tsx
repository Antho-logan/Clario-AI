import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import NextButton from '../../components/NextButton';

const { width, height } = Dimensions.get('window');

type FocusScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Focus'>;

interface Props {
  navigation: FocusScreenNavigationProp;
  route?: {
    params?: {
      answers?: any;
    };
  };
}

// Three focus points with "jibber-jabber" descriptions
const FOCUS_POINTS = [
  {
    id: 1,
    title: "Market Research & Validation",
    description: "Understanding your target audience is crucial for success. We'll help you identify market gaps, validate your business ideas, and ensure there's real demand for your product or service.",
    icon: "🎯"
  },
  {
    id: 2,
    title: "Strategic Planning & Execution",
    description: "Transform your vision into actionable steps. We'll guide you through creating a solid business plan, setting achievable milestones, and developing systems that scale with your growth.",
    icon: "🚀"
  },
  {
    id: 3,
    title: "Financial Management & Growth",
    description: "Master the numbers that matter. Learn essential financial planning, cash flow management, and investment strategies to build a sustainable and profitable business foundation.",
    icon: "💰"
  }
];

export default function FocusScreen({ navigation, route }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pointAnims = useRef(
    FOCUS_POINTS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Start entrance animation
    setIsVisible(true);
    
    Animated.sequence([
      // Slide in the screen
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Fade in the header
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Stagger the focus points animation
      Animated.stagger(200, 
        pointAnims.map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  const handleContinue = () => {
    // Navigate to the main Dashboard after focus presentation
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <Animated.View 
        style={[
          styles.content,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoWave}>~</Text>
              </View>
            </View>
            <Text style={styles.title}>Your Focus Areas</Text>
            <Text style={styles.subtitle}>
              Based on your responses, here's what we'll help you master
            </Text>
          </Animated.View>

          {/* Focus Points - "Three Points Bottle of Water" */}
          <View style={styles.focusContainer}>
            {FOCUS_POINTS.map((point, index) => (
              <Animated.View
                key={point.id}
                style={[
                  styles.focusPoint,
                  {
                    opacity: pointAnims[index],
                    transform: [{
                      translateY: pointAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.pointHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.pointIcon}>{point.icon}</Text>
                  </View>
                  <View style={styles.pointNumber}>
                    <Text style={styles.numberText}>{point.id}</Text>
                  </View>
                </View>
                
                <Text style={styles.pointTitle}>{point.title}</Text>
                <Text style={styles.pointDescription}>{point.description}</Text>
              </Animated.View>
            ))}
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.pricingButton}
            onPress={() => navigation.navigate('Pricing')}
          >
            <Text style={styles.pricingButtonText}>🚀 Unlock Premium Features</Text>
          </TouchableOpacity>
          
          <NextButton
            title="Continue to App"
            onPress={handleContinue}
          />
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for button
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 22,
  },
  focusContainer: {
    gap: 24,
  },
  focusPoint: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pointIcon: {
    fontSize: 24,
  },
  pointNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  numberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pointTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  pointDescription: {
    fontSize: 15,
    color: '#86868B',
    lineHeight: 22,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  pricingButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pricingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 