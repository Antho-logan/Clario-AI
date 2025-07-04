import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { SPRING_CONFIG, TIMING, INITIAL_STATES } from '../utils/motion.config';

interface AnimatedButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  delayAnimation?: number;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  children,
  delayAnimation = 0,
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);
  const pressed = useSharedValue(false);
  const shimmerX = useSharedValue(-200);

  // Entrance animation
  useEffect(() => {
    opacity.value = withDelay(delayAnimation, withTiming(1, { duration: TIMING.medium }));
    scale.value = withDelay(delayAnimation, withSpring(1, SPRING_CONFIG.bouncy));
    translateY.value = withDelay(delayAnimation, withSpring(0, SPRING_CONFIG.gentle));
  }, []);

  // Loading shimmer effect
  useEffect(() => {
    if (loading) {
      shimmerX.value = withSequence(
        withTiming(-200, { duration: 0 }),
        withTiming(400, { duration: 1500 }),
        withTiming(-200, { duration: 0 })
      );
    }
  }, [loading]);

  const handlePressIn = () => {
    pressed.value = true;
  };

  const handlePressOut = () => {
    pressed.value = false;
  };

  const animatedStyle = useAnimatedStyle(() => {
    const pressScale = pressed.value ? 0.96 : 1;
    
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value * pressScale },
        { translateY: translateY.value },
      ],
    };
  });

  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmerX.value }],
      opacity: loading ? 0.3 : 0,
    };
  });

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryButton];
      case 'secondary':
        return [...baseStyle, styles.secondaryButton];
      case 'outline':
        return [...baseStyle, styles.outlineButton];
      case 'ghost':
        return [...baseStyle, styles.ghostButton];
      default:
        return [...baseStyle, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryText];
      case 'secondary':
        return [...baseStyle, styles.secondaryText];
      case 'outline':
        return [...baseStyle, styles.outlineText];
      case 'ghost':
        return [...baseStyle, styles.ghostText];
      default:
        return [...baseStyle, styles.primaryText];
    }
  };

  return (
    <AnimatedTouchable
      style={[getButtonStyle(), style, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {/* Shimmer overlay for loading */}
      <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
      
      <View style={styles.buttonContent}>
        {icon && (
          <Text style={[styles.icon, disabled && styles.disabledIcon]}>
            {icon}
          </Text>
        )}
        {children || (
          <Text style={[getTextStyle(), textStyle, disabled && styles.disabledText]}>
            {loading ? 'Loading...' : title}
          </Text>
        )}
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  
  // Size variants
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 30,
  },

  // Button variants
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#FFB6B6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },

  // Text styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Text color variants
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#1D1D1F',
  },
  outlineText: {
    color: '#007AFF',
  },
  ghostText: {
    color: '#007AFF',
  },

  // Button content
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 16,
    marginRight: 8,
    color: '#FFFFFF',
  },

  // Disabled states
  disabledText: {
    color: '#86868B',
  },
  disabledIcon: {
    color: '#86868B',
  },

  // Shimmer effect
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    width: 200,
  },
});