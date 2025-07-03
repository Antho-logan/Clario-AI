import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { PatternScreen } from './components/PatternScreen';
import { AnimatedButton } from './components/AnimatedButton';
import { AnimatedIcon } from './components/AnimatedIcon';
import { PageTransition } from './components/PageTransition';
import { SPRING_CONFIG, TIMING } from './utils/motion.config';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'patterns'>('login');

  // Animation values for hero section
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const mottoOpacity = useSharedValue(0);
  const mottoTranslateY = useSharedValue(50);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);

  useEffect(() => {
    // Orchestrated entrance animation sequence
    const startAnimation = () => {
      // Logo animation with dramatic entrance
      logoOpacity.value = withDelay(200, withTiming(1, { duration: TIMING.medium }));
      logoScale.value = withDelay(
        200, 
        withSequence(
          withSpring(1.1, SPRING_CONFIG.bouncy),
          withSpring(1, SPRING_CONFIG.gentle)
        )
      );

      // Motto with elegant fade up
      mottoOpacity.value = withDelay(600, withTiming(1, { duration: TIMING.slow }));
      mottoTranslateY.value = withDelay(600, withSpring(0, SPRING_CONFIG.gentle));

      // Subtitle follows with shorter delay
      subtitleOpacity.value = withDelay(900, withTiming(1, { duration: TIMING.medium }));
      subtitleTranslateY.value = withDelay(900, withSpring(0, SPRING_CONFIG.gentle));
    };

    startAnimation();
  }, []);

  const handleLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    setCurrentScreen('patterns');
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const mottoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: mottoOpacity.value,
    transform: [{ translateY: mottoTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  if (currentScreen === 'patterns') {
    return (
      <PageTransition direction="right">
        <PatternScreen />
      </PageTransition>
    );
  }

  return (
    <PageTransition direction="fade">
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Hero Section with Animated Logo and Motto */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Animated.View style={[styles.logoIcon, logoAnimatedStyle]}>
              <AnimatedIcon
                icon="~"
                size={32}
                color="white"
                delayAnimation={400}
                pulseOnMount={true}
              />
            </Animated.View>
          </View>
          
          <Animated.Text style={[styles.bigMotto, mottoAnimatedStyle]}>
            Clear your mind,{'\n'}build your dreams
          </Animated.Text>
          
          <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
            Welcome to Clario
          </Animated.Text>
        </View>

        {/* Enhanced Login Buttons with Staggered Animation */}
        <View style={styles.loginSection}>
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Continue with Apple"
              icon="􀣺"
              onPress={() => handleLogin('Apple')}
              variant="primary"
              style={[styles.loginButton, styles.appleButton]}
              textStyle={styles.whiteText}
              delayAnimation={1200}
            />

            <AnimatedButton
              title="Continue with Google"
              icon="G"
              onPress={() => handleLogin('Google')}
              variant="outline"
              style={[styles.loginButton, styles.googleButton]}
              delayAnimation={1350}
            />

            <AnimatedButton
              title="Continue with Phone"
              icon="􀌾"
              onPress={() => handleLogin('Phone')}
              variant="outline"
              style={[styles.loginButton, styles.phoneButton]}
              delayAnimation={1500}
            />

            <AnimatedButton
              title="Continue with Facebook"
              icon="f"
              onPress={() => handleLogin('Facebook')}
              variant="secondary"
              style={[styles.loginButton, styles.facebookButton]}
              textStyle={styles.whiteText}
              delayAnimation={1650}
            />
          </View>
        </View>

        {/* Footer with Fade Animation */}
        <Animated.View 
          style={[
            styles.footer, 
            {
              opacity: subtitleOpacity, // Reuse subtitle timing
              transform: [{ translateY: subtitleTranslateY }]
            }
          ]}
        >
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </SafeAreaView>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  heroSection: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bigMotto: {
    fontSize: 42,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -0.8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '500',
    color: '#86868B',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  loginSection: {
    flex: 2,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  loginButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  appleButton: {
    backgroundColor: '#000',
    shadowColor: '#000',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    shadowColor: '#000',
  },
  phoneButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    shadowColor: '#007AFF',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    shadowColor: '#1877F2',
  },
  whiteText: {
    color: 'white',
  },
  footer: {
    flex: 0.5,
    justifyContent: 'flex-end',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 13,
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '500',
  },
}); 