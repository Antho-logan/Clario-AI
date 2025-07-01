import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

interface SolutionPathFlowProps {
  patternTitle: string;
  onBack: () => void;
  onComplete: () => void;
}

interface SolutionPlan {
  smallAction: string;
  supportiveMindset: string;
  whenStuck: string;
}

export const SolutionPathFlow: React.FC<SolutionPathFlowProps> = ({
  patternTitle,
  onBack,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<'question' | 'solution' | 'complete'>('question');
  const [userResponse, setUserResponse] = useState('');
  const [solutionPlan, setSolutionPlan] = useState<SolutionPlan | null>(null);

  const handleUserSubmit = () => {
    // Mock LLM response - in real implementation, this would call your AI service
    const mockSolution: SolutionPlan = {
      smallAction: "Start with just 5 minutes of the task. Set a timer and commit to only that small window.",
      supportiveMindset: "Progress over perfection. Each small step is meaningful, even if it doesn't feel significant.",
      whenStuck: "Take three deep breaths and ask yourself: 'What's the smallest thing I can do right now?'"
    };
    
    setSolutionPlan(mockSolution);
    setCurrentStep('solution');
  };

  const handleSaveSolution = () => {
    // In real implementation, save the solution to user's data
    setCurrentStep('complete');
  };

  const renderQuestion = () => (
    <View style={styles.stepContainer}>
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      
      <Text style={styles.clarityMessage}>
        Let's work through this together. What part of this situation feels hardest for you right now?
      </Text>
      
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Share what feels most challenging..."
        placeholderTextColor="#86868B"
        value={userResponse}
        onChangeText={setUserResponse}
        textAlignVertical="top"
      />
      
      <TouchableOpacity
        style={[styles.continueButton, !userResponse.trim() && styles.disabledButton]}
        onPress={handleUserSubmit}
        disabled={!userResponse.trim()}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSolution = () => (
    <View style={styles.stepContainer}>
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.completedDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>
      
      <Text style={styles.solutionTitle}>Your Calming Strategy</Text>
      
      <View style={styles.solutionCard}>
        <View style={styles.solutionItem}>
          <Text style={styles.solutionIcon}>🎯</Text>
          <View style={styles.solutionContent}>
            <Text style={styles.solutionLabel}>1. Small action to begin with</Text>
            <Text style={styles.solutionText}>{solutionPlan?.smallAction}</Text>
          </View>
        </View>
        
        <View style={styles.solutionItem}>
          <Text style={styles.solutionIcon}>🧘</Text>
          <View style={styles.solutionContent}>
            <Text style={styles.solutionLabel}>2. Supportive mindset to hold onto</Text>
            <Text style={styles.solutionText}>{solutionPlan?.supportiveMindset}</Text>
          </View>
        </View>
        
        <View style={styles.solutionItem}>
          <Text style={styles.solutionIcon}>🔄</Text>
          <View style={styles.solutionContent}>
            <Text style={styles.solutionLabel}>3. What to do when you feel stuck again</Text>
            <Text style={styles.solutionText}>{solutionPlan?.whenStuck}</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveSolution}
      >
        <Text style={styles.saveButtonText}>Save This Solution</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComplete = () => (
    <View style={styles.stepContainer}>
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.completedDot]} />
        <View style={[styles.dot, styles.completedDot]} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>
      
      <View style={styles.completeContent}>
        <Text style={styles.completeIcon}>✨</Text>
        <Text style={styles.completeTitle}>Solution Saved</Text>
        <Text style={styles.reflectionQuote}>
          "Awareness is the first step to clarity."
        </Text>
        <Text style={styles.completeMessage}>
          You can return to this solution anytime you need guidance with this pattern.
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.doneButton}
        onPress={onComplete}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{patternTitle}</Text>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {currentStep === 'question' && renderQuestion()}
          {currentStep === 'solution' && renderSolution()}
          {currentStep === 'complete' && renderComplete()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 20,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 24,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D1D6',
  },
  activeDot: {
    backgroundColor: '#FFB6B6',
  },
  completedDot: {
    backgroundColor: '#34C759',
  },
  clarityMessage: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1D1D1F',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1D1D1F',
    minHeight: 120,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  continueButton: {
    backgroundColor: '#FFB6B6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D1D6',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  solutionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 24,
  },
  solutionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 20,
  },
  solutionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  solutionIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 2,
  },
  solutionContent: {
    flex: 1,
  },
  solutionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  solutionText: {
    fontSize: 15,
    color: '#86868B',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#FFB6B6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  completeContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  completeIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  reflectionQuote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#86868B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  completeMessage: {
    fontSize: 15,
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: '#FFB6B6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
});