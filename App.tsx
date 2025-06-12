import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
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
      
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoWave}>~</Text>
          </View>
          <Text style={styles.logoText}>clario</Text>
        </View>
        <Text style={styles.motto}>clear your mind, build your dreams</Text>
      </View>

      {/* Login Buttons Section */}
      <View style={styles.loginSection}>
        <Text style={styles.welcomeText}>Welcome to Clario</Text>
        <Text style={styles.subtitleText}>Choose your preferred login method</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.loginButton, styles.phoneButton]} 
            onPress={() => handleLogin('Phone')}
          >
            <Text style={styles.phoneIcon}>📱</Text>
            <Text style={styles.buttonText}>Continue with Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, styles.appleButton]} 
            onPress={() => handleLogin('Apple')}
          >
            <Text style={styles.appleIcon}>🍎</Text>
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
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
  },
  logoSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  logoWave: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#1A1A2E',
    letterSpacing: -1,
  },
  motto: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  loginSection: {
    flex: 3,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  phoneButton: {
    backgroundColor: 'white',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  googleButton: {
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  appleIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  facebookIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  whiteText: {
    color: 'white',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
}); 