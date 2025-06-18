import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { getOnboardingAnswers, saveUserPreferences, OnboardingAnswers } from '../utils/localStorage';

type NavigationProp = StackNavigationProp<RootStackParamList, 'OnboardingScreen'>;

export default function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [userAnswers, setUserAnswers] = useState<OnboardingAnswers | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    loadUserData();
    startAnimation();
  }, []);

  const loadUserData = async () => {
    const answers = await getOnboardingAnswers();
    setUserAnswers(answers);
  };

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  const handleContinue = async () => {
    // Save user preferences
    await saveUserPreferences({
      theme: isDarkMode ? 'dark' : 'light',
      notificationsEnabled,
      notificationTime: selectedTime,
    });

    navigation.navigate('ChatScreen');
  };

  const timeOptions = [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: isDarkMode ? '#1C2B3A' : '#F5F7FA' 
    }}>
      <View style={{ 
        flex: 1, 
        paddingHorizontal: 24, 
        paddingTop: 64,
        justifyContent: 'center'
      }}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: 'center',
          marginBottom: 64,
        }}>
          {/* Clario Logo Placeholder */}
          <View style={{
            width: 80,
            height: 80,
            backgroundColor: '#AFCBFF',
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
          }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>C</Text>
          </View>

          <Text style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : '#1C2B3A',
            textAlign: 'center',
            marginBottom: 16,
            lineHeight: 44,
          }}>
            Hi {userAnswers?.name || 'there'}, I'm Clario.
          </Text>

          <Text style={{
            fontSize: 20,
            color: isDarkMode ? '#E5E7EB' : '#6B7280',
            textAlign: 'center',
            lineHeight: 28,
            marginBottom: 64,
          }}>
            Let's clear your mind.
          </Text>
        </Animated.View>

        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          {/* Settings Section */}
          <View style={{
            backgroundColor: isDarkMode ? '#374151' : 'white',
            borderRadius: 20,
            padding: 24,
            marginBottom: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}>
            {/* Theme Toggle */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6',
            }}>
              <View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: isDarkMode ? 'white' : '#1C2B3A',
                  marginBottom: 4,
                }}>
                  Dark Mode
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: isDarkMode ? '#D1D5DB' : '#6B7280',
                }}>
                  Easy on the eyes
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: '#E5E7EB', true: '#AFCBFF' }}
                thumbColor={isDarkMode ? '#1C2B3A' : '#F3F4F6'}
              />
            </View>

            {/* Notifications Toggle */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 16,
              borderBottomWidth: notificationsEnabled ? 1 : 0,
              borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6',
            }}>
              <View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: isDarkMode ? 'white' : '#1C2B3A',
                  marginBottom: 4,
                }}>
                  Daily Check-ins
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: isDarkMode ? '#D1D5DB' : '#6B7280',
                }}>
                  Gentle reminders
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E7EB', true: '#AFCBFF' }}
                thumbColor={notificationsEnabled ? '#1C2B3A' : '#F3F4F6'}
              />
            </View>

            {/* Time Selection */}
            {notificationsEnabled && (
              <View style={{ paddingTop: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: isDarkMode ? 'white' : '#1C2B3A',
                  marginBottom: 12,
                }}>
                  Preferred time
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  {timeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={{
                        backgroundColor: selectedTime === time 
                          ? '#AFCBFF' 
                          : (isDarkMode ? '#4B5563' : '#F3F4F6'),
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 12,
                      }}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontWeight: selectedTime === time ? '600' : '400',
                        color: selectedTime === time 
                          ? '#1C2B3A'
                          : (isDarkMode ? '#D1D5DB' : '#6B7280'),
                      }}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#1C2B3A',
              borderRadius: 24,
              paddingVertical: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
            onPress={handleContinue}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'white',
            }}>
              Let's begin
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}