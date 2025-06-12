import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function App() {
  const handleLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement actual login logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
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
            style={[styles.loginButton, styles.appleButton]} 
            onPress={() => handleLogin('Apple')}
          >
            <Text style={styles.appleIcon}>􀣺</Text>
            <Text style={[styles.buttonText, styles.whiteText]}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, styles.googleButton]} 
            onPress={() => handleLogin('Google')}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, styles.phoneButton]} 
            onPress={() => handleLogin('Phone')}
          >
            <Text style={styles.phoneIcon}>􀌾</Text>
            <Text style={styles.buttonText}>Continue with Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, styles.facebookButton]} 
            onPress={() => handleLogin('Facebook')}
          >
            <Text style={styles.facebookIcon}>f</Text>
            <Text style={[styles.buttonText, styles.whiteText]}>Continue with Facebook</Text>
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
    </SafeAreaView>
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
    flex: 2,
    paddingHorizontal: 40,
    justifyContent: 'center',
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
  },
}); 