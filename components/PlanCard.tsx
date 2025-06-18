import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { PlanData } from '../utils/localStorage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PlanCardProps {
  plan: PlanData;
  onDelete?: (planId: string) => void;
  showDeleteButton?: boolean;
}

export default function PlanCard({ plan, onDelete, showDeleteButton = false }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    if (onDelete) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onDelete(plan.id);
      });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      marginHorizontal: 16,
      marginVertical: 8,
    }}>
      <TouchableOpacity
        onPress={toggleExpanded}
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1C2B3A',
              marginBottom: 4,
            }}>
              {plan.title}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
            }}>
              {formatDate(plan.createdAt)}
            </Text>
          </View>
          
          {showDeleteButton && (
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                backgroundColor: '#FEE2E2',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                marginLeft: 12,
              }}
            >
              <Text style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#DC2626',
              }}>
                Delete
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Focus */}
        <View style={{
          backgroundColor: '#F0F9FF',
          padding: 16,
          borderRadius: 12,
          marginBottom: 16,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>🌱</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1C2B3A',
            }}>
              Your focus today
            </Text>
          </View>
          <Text style={{
            fontSize: 15,
            color: '#374151',
            lineHeight: 22,
          }}>
            {plan.focus}
          </Text>
        </View>

        {/* Small Wins */}
        <View style={{
          backgroundColor: '#F0FDF4',
          padding: 16,
          borderRadius: 12,
          marginBottom: expanded ? 16 : 0,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 20, marginRight: 8 }}>✅</Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#1C2B3A',
            }}>
              3 small wins
            </Text>
          </View>
          {plan.wins.map((win, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: index === plan.wins.length - 1 ? 0 : 8,
              }}
            >
              <Text style={{
                fontSize: 14,
                color: '#16A34A',
                marginRight: 8,
                marginTop: 2,
              }}>
                •
              </Text>
              <Text style={{
                fontSize: 15,
                color: '#374151',
                lineHeight: 22,
                flex: 1,
              }}>
                {win}
              </Text>
            </View>
          ))}
        </View>

        {/* Insight (shown when expanded) */}
        {expanded && (
          <View style={{
            backgroundColor: '#FEF7FF',
            padding: 16,
            borderRadius: 12,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>🧠</Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#1C2B3A',
              }}>
                Emotional insight
              </Text>
            </View>
            <Text style={{
              fontSize: 15,
              color: '#374151',
              lineHeight: 22,
              fontStyle: 'italic',
            }}>
              {plan.insight}
            </Text>
          </View>
        )}

        {/* Expand/Collapse indicator */}
        <View style={{
          alignItems: 'center',
          marginTop: 12,
        }}>
          <View style={{
            width: 32,
            height: 4,
            backgroundColor: expanded ? '#AFCBFF' : '#E5E7EB',
            borderRadius: 2,
          }} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}