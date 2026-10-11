import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

function RemainingCount({ count }: { count: number }) { // @link:fn
  return (
    // Changing the key remounts the view, which plays entering/exiting // @link:transition
    <Animated.Text key={count} entering={FadeIn} exiting={FadeOut}>{/* @link:transition */}
      {count} left{/* @link:text */}
    </Animated.Text>
  );
}
