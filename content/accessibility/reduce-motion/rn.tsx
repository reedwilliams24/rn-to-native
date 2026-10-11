import Animated, { FadeIn, SlideInUp, useReducedMotion } from 'react-native-reanimated';

function Banner({ children }: { children: React.ReactNode }) { // @link:fn
  const reduceMotion = useReducedMotion(); // @link:reduce

  return (
    <Animated.View entering={reduceMotion ? FadeIn : SlideInUp}>{/* @link:enter */}
      {children}{/* @link:content */}
    </Animated.View>
  );
}
