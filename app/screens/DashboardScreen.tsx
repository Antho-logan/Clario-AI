import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface DashboardTile {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

const DashboardScreen = ({ navigation }: any) => {
  const [userName, setUserName] = useState('');
  const [currentMood, setCurrentMood] = useState('calm');
  const [moodHistory, setMoodHistory] = useState(['#AFCBFF', '#B3E5C2', '#F9C784', '#AFCBFF', '#D9D9D9', '#B3E5C2', '#AFCBFF']);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnims] = useState(Array(8).fill(0).map(() => new Animated.Value(1)));

  // Mood color mapping
  const moodColors = {
    angry: '#FF6B6B',
    neutral: '#D9D9D9',
    calm: '#AFCBFF',
    anxious: '#FFD166',
    overwhelmed: '#C4B5FD',
  };

  useEffect(() => {
    loadUserData();
    animateEntry();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName') || 'Friend';
      const mood = await AsyncStorage.getItem('currentMood') || 'calm';
      setUserName(name);
      setCurrentMood(mood);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const animateEntry = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const handleTilePress = (index: number, action: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(action, 200);
  };

  const dashboardTiles: DashboardTile[] = [
    {
      id: 'session',
      icon: '🧘',
      title: 'Start a Session',
      subtitle: 'Talk to Clario',
      color: '#AFCBFF',
      onPress: () => navigation.navigate('Chat'),
    },
    {
      id: 'plan',
      icon: '🧭',
      title: 'My Focus Plan',
      subtitle: "See Today's plan",
      color: '#B3E5C2',
      onPress: () => navigation.navigate('Plan'),
    },
    {
      id: 'mood',
      icon: '📊',
      title: 'Mood Tracker',
      subtitle: 'Log how you feel',
      color: moodColors[currentMood as keyof typeof moodColors] || '#AFCBFF',
      onPress: () => navigation.navigate('MoodTracker'),
    },
    {
      id: 'journal',
      icon: '📖',
      title: 'Reflection Journal',
      subtitle: 'View past thoughts',
      color: '#E0D9FF',
      onPress: () => navigation.navigate('Journal'),
    },
    {
      id: 'saved',
      icon: '🧠',
      title: 'Saved Plans',
      subtitle: "Review what you've built",
      color: '#D1DCEB',
      onPress: () => navigation.navigate('SavedPlans'),
    },
    {
      id: 'goals',
      icon: '🎯',
      title: 'Goal Setting',
      subtitle: 'Define your vision',
      color: '#F9C784',
      onPress: () => navigation.navigate('Goals'),
    },
    {
      id: 'reminders',
      icon: '🔔',
      title: 'Reminders',
      subtitle: 'Manage notifications',
      color: '#EDEDED',
      onPress: () => navigation.navigate('Reminders'),
    },
    {
      id: 'moodmap',
      icon: '🎨',
      title: 'Mood Map',
      subtitle: 'Visualize how you feel',
      color: '#AFCBFF',
      onPress: () => navigation.navigate('MoodMap'),
    },
  ];

  const renderMoodStrip = () => (
    <View style={styles.moodStrip}>
      {moodHistory.map((color, index) => (
        <View
          key={index}
          style={[styles.moodDot, { backgroundColor: color }]}
        />
      ))}
    </View>
  );

  const renderTile = (tile: DashboardTile, index: number) => (
    <Animated.View
      key={tile.id}
      style={[
        styles.tileContainer,
        { transform: [{ scale: scaleAnims[index] }] }
      ]}
    >
      <TouchableOpacity
        style={[styles.tile, { backgroundColor: tile.color }]}
        onPress={() => handleTilePress(index, tile.onPress)}
        activeOpacity={0.8}
      >
        <Text style={styles.tileIcon}>{tile.icon}</Text>
        <Text style={styles.tileTitle}>{tile.title}</Text>
        <Text style={styles.tileSubtitle}>{tile.subtitle}</Text>
        {tile.id === 'moodmap' && renderMoodStrip()}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Top-left Drawer Button */}
        <TouchableOpacity style={styles.drawerButton} activeOpacity={0.7}>
          <Text style={styles.drawerIcon}>☰</Text>
        </TouchableOpacity>

        {/* Greeting Block */}
        <View style={styles.greetingContainer}>
          <View style={[styles.accentBar, { backgroundColor: moodColors[currentMood as keyof typeof moodColors] || '#AFCBFF' }]} />
          <Text style={styles.greetingText}>
            Hi {userName}, let's clear your mind today.
          </Text>
        </View>

        {/* Dashboard Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {dashboardTiles.map((tile, index) => renderTile(tile, index))}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  drawerButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  drawerIcon: {
    fontSize: 16,
    color: '#1C2B3A',
    fontWeight: '600',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  accentBar: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C2B3A',
    flex: 1,
    lineHeight: 32,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tileContainer: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  tile: {
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tileIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2B3A',
    textAlign: 'center',
    marginBottom: 4,
  },
  tileSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  moodStrip: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 4,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default DashboardScreen; 