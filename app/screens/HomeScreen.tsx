import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

// Animated Background Component
const AnimatedBackground = () => {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start multiple animations with different durations
    createAnimation(animatedValue1, 3000).start();
    createAnimation(animatedValue2, 4000).start();
    createAnimation(animatedValue3, 5000).start();
  }, []);

  const translateY1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const translateY2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const translateY3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  const opacity1 = animatedValue1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  const opacity2 = animatedValue2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.6, 0.2],
  });

  const opacity3 = animatedValue3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 0.9, 0.4],
  });

  return (
    <View style={styles.animatedBackground}>
      {/* Floating Circles */}
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          {
            transform: [{ translateY: translateY1 }],
            opacity: opacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle2,
          {
            transform: [{ translateY: translateY2 }],
            opacity: opacity2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle3,
          {
            transform: [{ translateY: translateY3 }],
            opacity: opacity3,
          },
        ]}
      />
      
      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />
    </View>
  );
};

export default function HomeScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      console.log(`Login with ${provider}`);
      // Simulate API call for authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to Onboarding after successful login
      navigation.navigate('Onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section with Logo and Big Motto */}
        <View style={styles.heroSection}>
          {/* Clario Logo Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoWave}>~</Text>
            </View>
          </View>
          
          <Text style={styles.bigMotto}>Clear your mind,{'\n'}build your dreams</Text>
          <Text style={styles.subtitle}>Welcome to Clario</Text>
        </View>

        {/* Login Buttons Section */}
        <View style={styles.loginSection}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.loginButton, styles.appleButton, isLoading && styles.disabledButton]} 
              onPress={() => handleLogin('Apple')}
              disabled={isLoading}
            >
              <Text style={styles.appleIcon}>􀣺</Text>
              <Text style={[styles.buttonText, styles.whiteText]}>
                {isLoading ? 'Loading...' : 'Continue with Apple'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, styles.googleButton, isLoading && styles.disabledButton]} 
              onPress={() => handleLogin('Google')}
              disabled={isLoading}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, styles.phoneButton, isLoading && styles.disabledButton]} 
              onPress={() => handleLogin('Phone')}
              disabled={isLoading}
            >
              <Text style={styles.phoneIcon}>􀌾</Text>
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : 'Continue with Phone'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, styles.facebookButton, isLoading && styles.disabledButton]} 
              onPress={() => handleLogin('Facebook')}
              disabled={isLoading}
            >
              <Text style={styles.facebookIcon}>f</Text>
              <Text style={[styles.buttonText, styles.whiteText]}>
                {isLoading ? 'Loading...' : 'Continue with Facebook'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  // Animated Background Styles
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
  },
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    top: '20%',
    left: '10%',
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    top: '60%',
    right: '15%',
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    top: '40%',
    left: '60%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(250, 250, 250, 0.7)',
  },
  heroSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 40,
    minHeight: height * 0.5,
    zIndex: 1,
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
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoWave: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
  },
  bigMotto: {
    fontSize: 42,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '400',
    color: '#86868B',
    textAlign: 'center',
  },
  loginSection: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    zIndex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#D2D2D7',
  },
  phoneButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#D2D2D7',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  appleIcon: {
    fontSize: 16,
    color: 'white',
    marginRight: 8,
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
    marginRight: 8,
    width: 16,
    textAlign: 'center',
  },
  phoneIcon: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
  },
  facebookIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  whiteText: {
    color: 'white',
  },
  footer: {
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 20,
    zIndex: 1,
  },
  footerText: {
    fontSize: 13,
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#007AFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
}); 