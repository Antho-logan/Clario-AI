import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { AnimatedButton } from './AnimatedButton';
import { AnimatedIcon } from './AnimatedIcon';
import { SPRING_CONFIG, TIMING } from '../utils/motion.config';

interface LoopCardProps {
  icon: string;
  title: string;
  summary: string;
  onCreateSolution: () => void;
  delayAnimation?: number;
}

export const LoopCard: React.FC<LoopCardProps> = ({
  icon,
  title,
  summary,
  onCreateSolution,
  delayAnimation = 0,
}) => {
  // Animation values
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);
  const cardPressed = useSharedValue(false);

  useEffect(() => {
    // Entrance animation with elegant timing
    opacity.value = withDelay(delayAnimation, withTiming(1, { duration: TIMING.medium }));
    scale.value = withDelay(delayAnimation, withSpring(1, SPRING_CONFIG.bouncy));
    translateY.value = withDelay(delayAnimation, withSpring(0, SPRING_CONFIG.gentle));
  }, [delayAnimation]);

  const handlePressIn = () => {
    cardPressed.value = true;
  };

  const handlePressOut = () => {
    cardPressed.value = false;
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const pressScale = cardPressed.value ? 0.98 : 1;
    
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value * pressScale },
        { translateY: translateY.value },
      ],
    };
  });

  const cardShadowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: cardPressed.value ? 0.15 : 0.08,
      shadowRadius: cardPressed.value ? 16 : 12,
      elevation: cardPressed.value ? 8 : 4,
    };
  });

  return (
    <Animated.View 
      style={[
        styles.card, 
        cardAnimatedStyle,
        cardShadowStyle,
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      <View style={styles.cardContent}>
        <AnimatedIcon
          icon={icon}
          size={24}
          delayAnimation={delayAnimation + 200}
          pulseOnMount={true}
          backgroundCircle={true}
          backgroundColor="#FFB6B6"
        />
        
        <View style={styles.textContainer}>
          <Animated.Text 
            style={[
              styles.title,
              {
                opacity: opacity,
                transform: [{ translateY: translateY }],
              }
            ]}
          >
            {title}
          </Animated.Text>
          
          <Animated.Text 
            style={[
              styles.summary,
              {
                opacity: opacity,
                transform: [{ translateY: translateY }],
              }
            ]}
          >
            {summary}
          </Animated.Text>
        </View>
      </View>
      
      <AnimatedButton
        title="🧠 Create a Solution Path"
        onPress={onCreateSolution}
        variant="secondary"
        style={styles.ctaButton}
        delayAnimation={delayAnimation + 400}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  summary: {
    fontSize: 16,
    fontWeight: '400',
    color: '#86868B',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  ctaButton: {
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