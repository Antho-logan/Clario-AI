import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveMoodEntry, getCurrentMood, MoodEntry } from '../utils/localStorage';

interface MoodTrackerProps {
  visible: boolean;
  onClose: () => void;
  onMoodSaved?: (mood: number) => void;
}

const MOOD_EMOJIS = ['😔', '😕', '😐', '🙂', '😊', '😄', '🤩', '🥳', '😍', '🤗'];
const MOOD_LABELS = [
  'Terrible', 'Bad', 'Okay', 'Good', 'Great', 
  'Amazing', 'Fantastic', 'Incredible', 'Blissful', 'Perfect'
];

export default function MoodTracker({ visible, onClose, onMoodSaved }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [note, setNote] = useState('');
  const [currentMoodData, setCurrentMoodData] = useState<MoodEntry | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      loadCurrentMood();
      startAnimation();
    }
  }, [visible]);

  const loadCurrentMood = async () => {
    const mood = await getCurrentMood();
    if (mood) {
      setCurrentMoodData(mood);
      setSelectedMood(mood.mood);
    }
  };

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  const handleSave = async () => {
    const moodEntry: MoodEntry = {
      mood: selectedMood,
      timestamp: new Date().toISOString(),
      note: note.trim() || undefined,
    };

    await saveMoodEntry(moodEntry);
    
    if (onMoodSaved) {
      onMoodSaved(selectedMood);
    }

    // Close with animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setNote('');
    });
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      }}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 24,
          width: '100%',
          maxWidth: 400,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
          elevation: 10,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1C2B3A',
            }}>
              How are you feeling?
            </Text>
            
            <TouchableOpacity
              onPress={handleClose}
              style={{
                backgroundColor: '#F3F4F6',
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: '#6B7280' }}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Current mood display */}
          {currentMoodData && (
            <View style={{
              backgroundColor: '#F0F9FF',
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                color: '#6B7280',
                marginBottom: 8,
              }}>
                Last check-in: {formatTime(currentMoodData.timestamp)}
              </Text>
              <Text style={{ fontSize: 32 }}>
                {MOOD_EMOJIS[currentMoodData.mood - 1]}
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '500',
                color: '#1C2B3A',
              }}>
                {MOOD_LABELS[currentMoodData.mood - 1]}
              </Text>
            </View>
          )}

          {/* Mood selector */}
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#1C2B3A',
            marginBottom: 20,
            textAlign: 'center',
          }}>
            How are you feeling right now?
          </Text>

          {/* Mood grid */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}>
            {MOOD_EMOJIS.map((emoji, index) => {
              const moodValue = index + 1;
              const isSelected = selectedMood === moodValue;
              
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedMood(moodValue)}
                  style={{
                    width: '18%',
                    aspectRatio: 1,
                    backgroundColor: isSelected ? '#AFCBFF' : '#F9FAFB',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? '#1C2B3A' : '#E5E7EB',
                  }}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected mood label */}
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1C2B3A',
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {MOOD_LABELS[selectedMood - 1]}
          </Text>

          {/* Note input */}
          <Text style={{
            fontSize: 16,
            fontWeight: '500',
            color: '#1C2B3A',
            marginBottom: 12,
          }}>
            What's on your mind? (optional)
          </Text>
          
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              minHeight: 80,
              textAlignVertical: 'top',
              marginBottom: 24,
            }}
            placeholder="Share what's affecting your mood..."
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            multiline
          />

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: '#1C2B3A',
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: 'white',
            }}>
              Save mood
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}