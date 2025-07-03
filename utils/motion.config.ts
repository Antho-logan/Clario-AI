import {
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';

// Elegant easing curves for premium feel
export const EASING = {
  // Apple-style easing for smooth, organic motion
  ease: [0.25, 0.1, 0.25, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  // Custom cinematic curve for premium feel
  cinematic: [0.22, 1, 0.36, 1],
} as const;

// Timing configurations for consistent motion feel
export const TIMING = {
  fast: 200,
  medium: 300,
  slow: 500,
  page: 400,
  press: 150,
  hover: 200,
} as const;

// Spring configurations for tactile feedback
export const SPRING_CONFIG = {
  gentle: {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  },
  bouncy: {
    damping: 15,
    stiffness: 600,
    mass: 0.8,
  },
  snappy: {
    damping: 25,
    stiffness: 400,
    mass: 0.3,
  },
  tactile: {
    damping: 30,
    stiffness: 800,
    mass: 0.2,
  },
} as const;

// Reusable animation variants
export const motionVariants = {
  // Fade animations with directional movement
  fadeInUp: (delay = 0) => ({
    opacity: withDelay(delay, withTiming(1, { duration: TIMING.medium })),
    transform: [
      {
        translateY: withDelay(
          delay,
          withSpring(0, SPRING_CONFIG.gentle, (finished?: boolean) => {
            'worklet';
          })
        ),
      },
    ],
  }),

  fadeInDown: (delay = 0) => ({
    opacity: withDelay(delay, withTiming(1, { duration: TIMING.medium })),
    transform: [
      {
        translateY: withDelay(
          delay,
          withSpring(0, SPRING_CONFIG.gentle)
        ),
      },
    ],
  }),

  fadeInLeft: (delay = 0) => ({
    opacity: withDelay(delay, withTiming(1, { duration: TIMING.medium })),
    transform: [
      {
        translateX: withDelay(
          delay,
          withSpring(0, SPRING_CONFIG.gentle)
        ),
      },
    ],
  }),

  fadeInRight: (delay = 0) => ({
    opacity: withDelay(delay, withTiming(1, { duration: TIMING.medium })),
    transform: [
      {
        translateX: withDelay(
          delay,
          withSpring(0, SPRING_CONFIG.gentle)
        ),
      },
    ],
  }),

  // Scale animations
  scaleIn: (delay = 0) => ({
    opacity: withDelay(delay, withTiming(1, { duration: TIMING.medium })),
    transform: [
      {
        scale: withDelay(
          delay,
          withSpring(1, SPRING_CONFIG.bouncy)
        ),
      },
    ],
  }),

  // Press effect for tactile feedback
  pressEffect: (pressed: SharedValue<boolean>) => ({
    transform: [
      {
        scale: withSpring(pressed.value ? 0.96 : 1, SPRING_CONFIG.tactile),
      },
    ],
  }),

  // Hover effects
  hoverGlow: (hovered: SharedValue<boolean>) => ({
    shadowOpacity: withTiming(hovered.value ? 0.15 : 0.05, {
      duration: TIMING.hover,
    }),
    shadowRadius: withTiming(hovered.value ? 12 : 8, {
      duration: TIMING.hover,
    }),
    transform: [
      {
        scale: withSpring(hovered.value ? 1.02 : 1, SPRING_CONFIG.gentle),
      },
    ],
  }),

  // Icon pulse animation
  iconPulse: (active: SharedValue<boolean>) => ({
    transform: [
      {
        scale: withSequence(
          withSpring(active.value ? 1.1 : 1, SPRING_CONFIG.snappy),
          withSpring(1, SPRING_CONFIG.snappy)
        ),
      },
    ],
  }),

  // Page transition variants
  pageTransition: {
    slideInRight: {
      transform: [
        {
          translateX: withTiming(0, { duration: TIMING.page }),
        },
      ],
      opacity: withTiming(1, { duration: TIMING.page }),
    },
    slideOutLeft: {
      transform: [
        {
          translateX: withTiming(-300, { duration: TIMING.page }),
        },
      ],
      opacity: withTiming(0, { duration: TIMING.page }),
    },
    slideInLeft: {
      transform: [
        {
          translateX: withTiming(0, { duration: TIMING.page }),
        },
      ],
      opacity: withTiming(1, { duration: TIMING.page }),
    },
    slideOutRight: {
      transform: [
        {
          translateX: withTiming(300, { duration: TIMING.page }),
        },
      ],
      opacity: withTiming(0, { duration: TIMING.page }),
    },
  },
};

// Stagger animation helper
export const createStaggeredAnimation = (
  items: any[],
  animationType: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn',
  staggerDelay = 100
) => {
  return items.map((_, index) => {
    const delay = index * staggerDelay;
    const variant = motionVariants[animationType];
    if (typeof variant === 'function') {
      return variant(delay);
    }
    return variant;
  });
};

// Shimmer effect for loading states
export const createShimmerEffect = (width: number) => {
  'worklet';
  return {
    transform: [
      {
        translateX: withSequence(
          withTiming(-width, { duration: 0 }),
          withTiming(width * 2, { duration: 1500 }),
          withTiming(-width, { duration: 0 })
        ),
      },
    ],
  };
};

// Interpolation helpers
export const createScrollAnimation = (
  scrollY: SharedValue<number>,
  inputRange: number[],
  outputRange: number[],
  extrapolate = Extrapolate.CLAMP
) => {
  'worklet';
  return interpolate(scrollY.value, inputRange, outputRange, extrapolate);
};

// Default initial states for animations
export const INITIAL_STATES = {
  fadeInUp: {
    opacity: 0,
    transform: [{ translateY: 30 }],
  },
  fadeInDown: {
    opacity: 0,
    transform: [{ translateY: -30 }],
  },
  fadeInLeft: {
    opacity: 0,
    transform: [{ translateX: -30 }],
  },
  fadeInRight: {
    opacity: 0,
    transform: [{ translateX: 30 }],
  },
  scaleIn: {
    opacity: 0,
    transform: [{ scale: 0.8 }],
  },
  pageSlideInRight: {
    transform: [{ translateX: 300 }],
    opacity: 0,
  },
  pageSlideInLeft: {
    transform: [{ translateX: -300 }],
    opacity: 0,
  },
} as const;

export type MotionVariant = 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
export type InitialState = keyof typeof INITIAL_STATES;