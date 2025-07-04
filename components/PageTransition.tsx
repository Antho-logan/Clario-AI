import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { SPRING_CONFIG, TIMING } from '../utils/motion.config';

const { width: screenWidth } = Dimensions.get('window');

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down' | 'fade';
  duration?: number;
  delay?: number;
  onAnimationComplete?: () => void;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = 'right',
  duration = TIMING.page,
  delay = 0,
  onAnimationComplete,
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(getInitialTranslateX(direction));
  const translateY = useSharedValue(getInitialTranslateY(direction));
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const animateIn = () => {
      opacity.value = withDelay(delay, withTiming(1, { duration }));
      translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG.gentle));
      translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIG.gentle));
      scale.value = withDelay(
        delay,
        withSpring(1, SPRING_CONFIG.gentle, (finished) => {
          if (finished && onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        })
      );
    };

    animateIn();
  }, [delay, duration, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Exit animation for when component unmounts
export const useExitAnimation = (
  direction: 'left' | 'right' | 'up' | 'down' | 'fade' = 'left'
) => {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animateOut = (onComplete?: () => void) => {
    const exitTranslateX = getExitTranslateX(direction);
    const exitTranslateY = getExitTranslateY(direction);

    opacity.value = withTiming(0, { duration: TIMING.fast });
    translateX.value = withTiming(exitTranslateX, { duration: TIMING.fast });
    translateY.value = withTiming(exitTranslateY, { duration: TIMING.fast });
    scale.value = withTiming(0.95, { duration: TIMING.fast }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return { animateOut, animatedStyle };
};

function getInitialTranslateX(direction: string): number {
  switch (direction) {
    case 'left':
      return -screenWidth;
    case 'right':
      return screenWidth;
    default:
      return 0;
  }
}

function getInitialTranslateY(direction: string): number {
  switch (direction) {
    case 'up':
      return -100;
    case 'down':
      return 100;
    default:
      return 0;
  }
}

function getExitTranslateX(direction: string): number {
  switch (direction) {
    case 'left':
      return -screenWidth;
    case 'right':
      return screenWidth;
    default:
      return 0;
  }
}

function getExitTranslateY(direction: string): number {
  switch (direction) {
    case 'up':
      return -100;
    case 'down':
      return 100;
    default:
      return 0;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});