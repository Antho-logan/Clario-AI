import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from './screens/HomeScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoadingScreen from './screens/LoadingScreen';
import FocusScreen from './screens/FocusScreen';
import DashboardScreen from './screens/DashboardScreen';
import PricingScreen from './screens/PricingScreen';

export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  Loading: { answers?: any };
  Focus: { answers?: any };
  Dashboard: undefined;
  Pricing: undefined;
  Chat: undefined;
  Plan: undefined;
  MoodTracker: undefined;
  Journal: undefined;
  SavedPlans: undefined;
  Goals: undefined;
  Reminders: undefined;
  MoodMap: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FAFAFA',
          },
          headerTintColor: '#007AFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'Clario AI',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ 
            title: 'Tell us about yourself',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="Loading" 
          component={LoadingScreen}
          options={{ 
            title: 'Loading',
            headerShown: false,
            gestureEnabled: false // Prevent swipe back during loading
          }}
        />
        <Stack.Screen 
          name="Focus" 
          component={FocusScreen}
          options={{ 
            title: 'Your Focus',
            headerShown: false,
            gestureEnabled: false // Prevent swipe back during focus presentation
          }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ 
            title: 'Dashboard',
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="Pricing" 
          component={PricingScreen}
          options={{ 
            title: 'Pricing',
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 