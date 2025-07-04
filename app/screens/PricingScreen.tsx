import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  navigation: any;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly',
    features: [
      '3 AI consultations per month',
      'Basic business templates',
      'Community access'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'monthly',
    features: [
      'Unlimited AI consultations',
      'Advanced business templates',
      'Priority support',
      'Market research tools',
      'Financial planning assistance'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'monthly',
    features: [
      'Everything in Pro',
      'Dedicated business coach',
      'Custom integrations',
      'White-label solutions',
      'Team collaboration tools'
    ]
  }
];

export default function PricingScreen({ navigation }: Props) {
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');

  const handlePlanSelection = (plan: PricingPlan) => {
    if (plan.price === 0) {
      Alert.alert(
        'Free Plan',
        'You\'re already on the free plan! Upgrade to unlock premium features.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `Subscribe to ${plan.name}`,
      `$${plan.price}/${plan.interval}\n\nFeatures:\n${plan.features.slice(0, 3).join('\n')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Free Trial', 
          onPress: () => {
            Alert.alert('Trial Started!', `Your 7-day free trial of ${plan.name} has begun!`);
          }
        }
      ]
    );
  };

  const renderPlanCard = (plan: PricingPlan) => {
    const isPopular = plan.popular;
    const displayPrice = plan.price === 0 ? 'Free' : `$${plan.price}/${plan.interval}`;

    return (
      <View key={plan.id} style={[styles.planCard, isPopular && styles.popularCard]}>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{displayPrice}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            isPopular && styles.popularButton
          ]}
          onPress={() => handlePlanSelection(plan)}
        >
          <Text style={styles.selectButtonText}>
            {plan.price === 0 ? 'Current Plan' : 'Select Plan'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock the full power of AI-driven entrepreneurship
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {PRICING_PLANS.map(renderPlanCard)}
        </View>

        {/* Call to Action */}
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Need Help Choosing?</Text>
          <Text style={styles.ctaSubtitle}>
            Contact our team to find the perfect plan for your business needs
          </Text>
          
          <TouchableOpacity style={styles.contactButton}>
            <LinearGradient
              colors={['#007AFF', '#0056CC']}
              style={styles.contactButtonGradient}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
  },
  popularCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  popularText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 16,
    color: '#34C759',
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 15,
    color: '#1D1D1F',
    flex: 1,
    lineHeight: 20,
  },
  selectButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#007AFF',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  ctaContainer: {
    margin: 20,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 15,
    color: '#86868B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  contactButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 