import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

// Import screens
import IntroQuestionnaire from './components/IntroQuestionnaire';
import OnboardingScreen from './components/OnboardingScreen';
import ChatScreen from './components/ChatScreen';
import SavedPlansScreen from './components/SavedPlansScreen';

export type RootStackParamList = {
  IntroQuestionnaire: undefined;
  OnboardingScreen: undefined;
  ChatScreen: undefined;
  SavedPlansScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="IntroQuestionnaire"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          <Stack.Screen 
            name="IntroQuestionnaire" 
            component={IntroQuestionnaire} 
          />
          <Stack.Screen 
            name="OnboardingScreen" 
            component={OnboardingScreen} 
          />
          <Stack.Screen 
            name="ChatScreen" 
            component={ChatScreen} 
          />
          <Stack.Screen 
            name="SavedPlansScreen" 
            component={SavedPlansScreen} 
          />
        </Stack.Navigator>
        <StatusBar style="auto" backgroundColor="#F5F7FA" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}