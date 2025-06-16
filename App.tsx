import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Modal 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AIActionReportView } from './src/components/AIActionReportView';
import { useAIActionReporter } from './src/hooks/useAIActionReporter';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [showReports, setShowReports] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [currentUser] = useState('user_' + Math.random().toString(36).substr(2, 9));
  
  // Initialize AI Action Reporter
  const aiReporter = useAIActionReporter(currentUser);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setScannedData(data);

    // Track the QR/Barcode scan with AI Action Reporter
    let tracker;
    try {
      if (type === BarCodeScanner.Constants.BarCodeType.qr) {
        tracker = await aiReporter.trackQRCodeScan(data);
      } else {
        tracker = await aiReporter.trackBarcodeScan(data, type);
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Complete the action successfully
      await aiReporter.completeAction(tracker, true, undefined, {
        confidenceScore: 0.95 + Math.random() * 0.05, // Simulate confidence
      });
      
      console.log('Successfully tracked scan:', { type, data });
    } catch (error) {
      console.error('Error tracking scan:', error);
      if (tracker) {
        await aiReporter.completeAction(tracker, false, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  };

  const handleLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement actual login logic
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedData('');
  };

  // Show camera scanner if permission granted and not scanned
  if (hasPermission === true && !scanned) {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <Text style={styles.scannerText}>Point camera at QR code or barcode</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setHasPermission(null)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Show scanned result
  if (scanned && scannedData) {
    return (
      <SafeAreaView style={styles.resultContainer}>
        <StatusBar style="dark" />
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>Scanned Successfully!</Text>
          <View style={styles.resultDataContainer}>
            <Text style={styles.resultData}>{scannedData}</Text>
          </View>
          <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
            <Text style={styles.scanAgainButtonText}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => setHasPermission(null)}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        
        {/* AI Analytics Display */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsTitle}>AI Activity Today</Text>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticNumber}>{aiReporter.todayActionsCount}</Text>
              <Text style={styles.analyticLabel}>Actions</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticNumber}>{aiReporter.activeActions}</Text>
              <Text style={styles.analyticLabel}>Active</Text>
            </View>
            <View style={styles.analyticItem}>
              <Text style={styles.analyticNumber}>{aiReporter.averageResponseTime.toFixed(0)}ms</Text>
              <Text style={styles.analyticLabel}>Avg Time</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons Section */}
      <View style={styles.actionSection}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.scanButton]} 
            onPress={requestCameraPermission}
          >
            <Text style={styles.scanIcon}>📱</Text>
            <Text style={[styles.buttonText, styles.whiteText]}>Scan QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.reportsButton]} 
            onPress={() => setShowReports(true)}
          >
            <Text style={styles.reportsIcon}>📊</Text>
            <Text style={styles.buttonText}>View AI Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Buttons Section */}
      <View style={styles.loginSection}>
        <Text style={styles.loginTitle}>Continue with</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.loginButton, styles.appleButton]} 
            onPress={() => handleLogin('Apple')}
          >
            <Text style={styles.appleIcon}>􀣺</Text>
            <Text style={[styles.buttonText, styles.whiteText]}>Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, styles.googleButton]} 
            onPress={() => handleLogin('Google')}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.buttonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, styles.phoneButton]} 
            onPress={() => handleLogin('Phone')}
          >
            <Text style={styles.phoneIcon}>􀌾</Text>
            <Text style={styles.buttonText}>Phone</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, styles.facebookButton]} 
            onPress={() => handleLogin('Facebook')}
          >
            <Text style={styles.facebookIcon}>f</Text>
            <Text style={[styles.buttonText, styles.whiteText]}>Facebook</Text>
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

      {/* AI Reports Modal */}
      <Modal
        visible={showReports}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <AIActionReportView
          onClose={() => setShowReports(false)}
          reportDays={7}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  cameraContainer: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  resultContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 30,
  },
  resultDataContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultData: {
    fontSize: 16,
    color: '#1D1D1F',
    textAlign: 'center',
    lineHeight: 24,
  },
  scanAgainButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  heroSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 30,
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
    fontSize: 32,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#86868B',
    textAlign: 'center',
    marginBottom: 30,
  },
  analyticsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#86868B',
    textAlign: 'center',
    marginBottom: 12,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analyticItem: {
    alignItems: 'center',
  },
  analyticNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  analyticLabel: {
    fontSize: 12,
    color: '#86868B',
    marginTop: 4,
  },
  actionSection: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    marginBottom: 12,
  },
  reportsButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2D2D7',
  },
  scanIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  reportsIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  loginSection: {
    flex: 1.5,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#86868B',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  actionButton: {
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
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
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