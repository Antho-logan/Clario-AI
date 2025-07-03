import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LoopCard } from './LoopCard';
import { SolutionPathFlow } from './SolutionPathFlow';
import { AnimatedButton } from './AnimatedButton';
import { PageTransition } from './PageTransition';
import { behaviorLoops, BehaviorLoop } from '../utils/patternData';
import { SPRING_CONFIG, TIMING } from '../utils/motion.config';

export const PatternScreen: React.FC = () => {
  const [currentView, setCurrentView] = useState<'patterns' | 'solution'>('patterns');
  const [selectedPattern, setSelectedPattern] = useState<BehaviorLoop | null>(null);

  // Animation values for header
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const sectionOpacity = useSharedValue(0);
  const sectionTranslateY = useSharedValue(40);

  useEffect(() => {
    // Header entrance animation
    headerOpacity.value = withDelay(100, withTiming(1, { duration: TIMING.medium }));
    headerTranslateY.value = withDelay(100, withSpring(0, SPRING_CONFIG.gentle));

    // Section content follows
    sectionOpacity.value = withDelay(300, withTiming(1, { duration: TIMING.medium }));
    sectionTranslateY.value = withDelay(300, withSpring(0, SPRING_CONFIG.gentle));
  }, []);

  const handleCreateSolution = (pattern: BehaviorLoop) => {
    setSelectedPattern(pattern);
    setCurrentView('solution');
  };

  const handleBackToPatterns = () => {
    setCurrentView('patterns');
    setSelectedPattern(null);
  };

  const handleSolutionComplete = () => {
    setCurrentView('patterns');
    setSelectedPattern(null);
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const sectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sectionOpacity.value,
    transform: [{ translateY: sectionTranslateY.value }],
  }));

  if (currentView === 'solution' && selectedPattern) {
    return (
      <PageTransition direction="right">
        <SolutionPathFlow
          patternTitle={selectedPattern.title}
          onBack={handleBackToPatterns}
          onComplete={handleSolutionComplete}
        />
      </PageTransition>
    );
  }

  const renderEmptyState = () => (
    <Animated.View style={[styles.emptyStateContainer, sectionAnimatedStyle]}>
      <Text style={styles.emptyStateIcon}>🌱</Text>
      <Text style={styles.emptyStateTitle}>No Patterns Yet</Text>
      <Text style={styles.emptyStateMessage}>
        You haven't added any stuck patterns yet — want to explore a few?
      </Text>
      <AnimatedButton
        title="Explore Common Patterns"
        onPress={() => {}}
        variant="secondary"
        style={styles.exploreButton}
        delayAnimation={800}
      />
    </Animated.View>
  );

  const renderPatternsList = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.patternsContainer, sectionAnimatedStyle]}>
        <Text style={styles.sectionTitle}>Your Stuck Patterns</Text>
        <Text style={styles.sectionSubtitle}>
          Recognize the loops that hold you back, and create gentle paths forward.
        </Text>
        
        {behaviorLoops.map((pattern, index) => (
          <LoopCard
            key={pattern.id}
            icon={pattern.icon}
            title={pattern.title}
            summary={pattern.summary}
            onCreateSolution={() => handleCreateSolution(pattern)}
            delayAnimation={500 + (index * 150)} // Staggered animation
          />
        ))}
      </Animated.View>
    </ScrollView>
  );

  return (
    <PageTransition direction="left">
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Text style={styles.headerTitle}>Stuck Patterns</Text>
          <Text style={styles.headerSubtitle}>Break free from behavior loops</Text>
        </Animated.View>
        
        {behaviorLoops.length === 0 ? renderEmptyState() : renderPatternsList()}
      </SafeAreaView>
    </PageTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1D1D1F',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#86868B',
    letterSpacing: 0.2,
  },
  scrollContainer: {
    flex: 1,
  },
  patternsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#86868B',
    lineHeight: 24,
    marginBottom: 32,
    letterSpacing: 0.1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 72,
    marginBottom: 32,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyStateMessage: {
    fontSize: 17,
    fontWeight: '400',
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    letterSpacing: 0.1,
  },
  exploreButton: {
    shadowColor: '#FFB6B6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});