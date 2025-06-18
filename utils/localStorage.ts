import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingAnswers {
  name: string;
  workingOn: string[];
  currentFeeling: number;
  yearGoal: string;
  holdingBack: string;
  reactionToProblems: string;
  helpWith: string;
  clarityMeaning: string;
}

export interface PlanData {
  id: string;
  title: string;
  focus: string;
  wins: string[];
  insight: string;
  createdAt: string;
}

export interface MoodEntry {
  mood: number;
  timestamp: string;
  note?: string;
}

const KEYS = {
  ONBOARDING_ANSWERS: 'onboarding_answers',
  SAVED_PLANS: 'saved_plans',
  MOOD_HISTORY: 'mood_history',
  USER_PREFERENCES: 'user_preferences',
  CURRENT_MOOD: 'current_mood',
};

// Onboarding Functions
export const saveOnboardingAnswers = async (answers: OnboardingAnswers): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_ANSWERS, JSON.stringify(answers));
  } catch (error) {
    console.error('Error saving onboarding answers:', error);
  }
};

export const getOnboardingAnswers = async (): Promise<OnboardingAnswers | null> => {
  try {
    const answers = await AsyncStorage.getItem(KEYS.ONBOARDING_ANSWERS);
    return answers ? JSON.parse(answers) : null;
  } catch (error) {
    console.error('Error getting onboarding answers:', error);
    return null;
  }
};

// Plans Functions
export const savePlan = async (plan: PlanData): Promise<void> => {
  try {
    const existingPlans = await getSavedPlans();
    const updatedPlans = [plan, ...existingPlans];
    await AsyncStorage.setItem(KEYS.SAVED_PLANS, JSON.stringify(updatedPlans));
  } catch (error) {
    console.error('Error saving plan:', error);
  }
};

export const getSavedPlans = async (): Promise<PlanData[]> => {
  try {
    const plans = await AsyncStorage.getItem(KEYS.SAVED_PLANS);
    return plans ? JSON.parse(plans) : [];
  } catch (error) {
    console.error('Error getting saved plans:', error);
    return [];
  }
};

export const deletePlan = async (planId: string): Promise<void> => {
  try {
    const existingPlans = await getSavedPlans();
    const filteredPlans = existingPlans.filter(plan => plan.id !== planId);
    await AsyncStorage.setItem(KEYS.SAVED_PLANS, JSON.stringify(filteredPlans));
  } catch (error) {
    console.error('Error deleting plan:', error);
  }
};

// Mood Functions
export const saveMoodEntry = async (moodEntry: MoodEntry): Promise<void> => {
  try {
    const existingMoods = await getMoodHistory();
    const updatedMoods = [moodEntry, ...existingMoods.slice(0, 29)]; // Keep last 30 entries
    await AsyncStorage.setItem(KEYS.MOOD_HISTORY, JSON.stringify(updatedMoods));
    await AsyncStorage.setItem(KEYS.CURRENT_MOOD, JSON.stringify(moodEntry));
  } catch (error) {
    console.error('Error saving mood entry:', error);
  }
};

export const getMoodHistory = async (): Promise<MoodEntry[]> => {
  try {
    const moods = await AsyncStorage.getItem(KEYS.MOOD_HISTORY);
    return moods ? JSON.parse(moods) : [];
  } catch (error) {
    console.error('Error getting mood history:', error);
    return [];
  }
};

export const getCurrentMood = async (): Promise<MoodEntry | null> => {
  try {
    const mood = await AsyncStorage.getItem(KEYS.CURRENT_MOOD);
    return mood ? JSON.parse(mood) : null;
  } catch (error) {
    console.error('Error getting current mood:', error);
    return null;
  }
};

// User Preferences
export const saveUserPreferences = async (preferences: { 
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  notificationTime?: string;
}): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

export const getUserPreferences = async () => {
  try {
    const preferences = await AsyncStorage.getItem(KEYS.USER_PREFERENCES);
    return preferences ? JSON.parse(preferences) : {
      theme: 'auto',
      notificationsEnabled: true,
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {
      theme: 'auto',
      notificationsEnabled: true,
    };
  }
};

// Clear all data (for development/reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};