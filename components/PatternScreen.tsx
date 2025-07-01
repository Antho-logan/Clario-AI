import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LoopCard } from './LoopCard';
import { SolutionPathFlow } from './SolutionPathFlow';
import { behaviorLoops, BehaviorLoop } from '../utils/patternData';

export const PatternScreen: React.FC = () => {
  const [currentView, setCurrentView] = useState<'patterns' | 'solution'>('patterns');
  const [selectedPattern, setSelectedPattern] = useState<BehaviorLoop | null>(null);

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

  if (currentView === 'solution' && selectedPattern) {
    return (
      <SolutionPathFlow
        patternTitle={selectedPattern.title}
        onBack={handleBackToPatterns}
        onComplete={handleSolutionComplete}
      />
    );
  }

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateIcon}>🌱</Text>
      <Text style={styles.emptyStateTitle}>No Patterns Yet</Text>
      <Text style={styles.emptyStateMessage}>
        You haven't added any stuck patterns yet — want to explore a few?
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore Common Patterns</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPatternsList = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.patternsContainer}>
        <Text style={styles.sectionTitle}>Your Stuck Patterns</Text>
        <Text style={styles.sectionSubtitle}>
          Recognize the loops that hold you back, and create gentle paths forward.
        </Text>
        
        {behaviorLoops.map((pattern) => (
          <LoopCard
            key={pattern.id}
            icon={pattern.icon}
            title={pattern.title}
            summary={pattern.summary}
            onCreateSolution={() => handleCreateSolution(pattern)}
          />
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stuck Patterns</Text>
        <Text style={styles.headerSubtitle}>Break free from behavior loops</Text>
      </View>
      
      {behaviorLoops.length === 0 ? renderEmptyState() : renderPatternsList()}
    </SafeAreaView>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#86868B',
  },
  scrollContainer: {
    flex: 1,
  },
  patternsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#86868B',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#FFB6B6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#FFB6B6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
});