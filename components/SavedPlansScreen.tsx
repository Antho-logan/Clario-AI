import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { getSavedPlans, deletePlan, PlanData } from '../utils/localStorage';
import PlanCard from './PlanCard';
import MoodTracker from './MoodTracker';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SavedPlansScreen'>;

export default function SavedPlansScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadPlans();
    }, [])
  );

  const loadPlans = async () => {
    try {
      const savedPlans = await getSavedPlans();
      setPlans(savedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlan(planId);
              setPlans(prev => prev.filter(plan => plan.id !== planId));
            } catch (error) {
              console.error('Error deleting plan:', error);
            }
          },
        },
      ]
    );
  };

  const EmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 48,
    }}>
      <Text style={{ fontSize: 64, marginBottom: 24 }}>🌱</Text>
      
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C2B3A',
        textAlign: 'center',
        marginBottom: 16,
      }}>
        No plans yet
      </Text>
      
      <Text style={{
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
      }}>
        Start a conversation with Clario to create your first clarity plan. 
        Ask for help organizing your thoughts or creating a strategy.
      </Text>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatScreen')}
        style={{
          backgroundColor: '#1C2B3A',
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 24,
        }}
      >
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: 'white',
        }}>
          Chat with Clario
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: 'white',
      }}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: '#6B7280',
              marginRight: 8,
            }}>
              ← Back
            </Text>
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#1C2B3A',
          }}>
            Your Plans
          </Text>
          
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
          }}>
            {plans.length} {plans.length === 1 ? 'plan' : 'plans'} saved
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => setShowMoodTracker(true)}
            style={{
              backgroundColor: '#FEF7FF',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E879F9',
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#A21CAF',
            }}>
              😊 Mood
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatScreen')}
            style={{
              backgroundColor: '#AFCBFF',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#1C2B3A',
            }}>
              New Plan
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Plans List */}
      {loading ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 16,
            color: '#6B7280',
          }}>
            Loading your plans...
          </Text>
        </View>
      ) : plans.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#AFCBFF"
            />
          }
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onDelete={handleDeletePlan}
              showDeleteButton={true}
            />
          ))}
          
          {/* Bottom spacing */}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}

      {/* Mood Tracker Modal */}
      <MoodTracker
        visible={showMoodTracker}
        onClose={() => setShowMoodTracker(false)}
        onMoodSaved={(mood) => {
          console.log('Mood saved:', mood);
          // Optionally show a success message or update UI
        }}
      />
    </SafeAreaView>
  );
}