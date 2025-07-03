import React, { useEffect } from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { SPRING_CONFIG, TIMING } from '../utils/motion.config';

interface AnimatedIconProps {
  icon: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  delayAnimation?: number;
  pulseOnMount?: boolean;
  backgroundCircle?: boolean;
  backgroundColor?: string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  size = 24,
  color = '#1D1D1F',
  style,
  textStyle,
  delayAnimation = 0,
  pulseOnMount = false,
  backgroundCircle = false,
  backgroundColor = '#FFB6B6',
}) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // Entrance animation
  useEffect(() => {
    opacity.value = withDelay(delayAnimation, withTiming(1, { duration: TIMING.medium }));
    scale.value = withDelay(delayAnimation, withSpring(1, SPRING_CONFIG.bouncy));
    
    if (pulseOnMount) {
      pulseScale.value = withDelay(
        delayAnimation + TIMING.medium,
        withSequence(
          withSpring(1.2, SPRING_CONFIG.snappy),
          withSpring(1, SPRING_CONFIG.gentle)
        )
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value * pulseScale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    if (!backgroundCircle) return {};
    
    return {
      width: size * 2,
      height: size * 2,
      borderRadius: size,
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: backgroundColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    };
  });

  const textStyles = [
    styles.icon,
    { fontSize: size, color },
    textStyle,
  ];

  if (backgroundCircle) {
    return (
      <Animated.View style={[containerStyle, style, animatedStyle]}>
        <AnimatedText style={textStyles}>
          {icon}
        </AnimatedText>
      </Animated.View>
    );
  }

  return (
    <AnimatedText style={[textStyles, style, animatedStyle]}>
      {icon}
    </AnimatedText>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    fontWeight: '600',
  },
});