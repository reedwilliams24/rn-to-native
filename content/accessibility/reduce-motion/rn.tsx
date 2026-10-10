import Animated, { FadeIn, SlideInUp, useReducedMotion } from 'react-native-reanimated';

function Banner({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View entering={reduceMotion ? FadeIn : SlideInUp}>
      {children}
    </Animated.View>
  );
}
