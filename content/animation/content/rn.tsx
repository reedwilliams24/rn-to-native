import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

function RemainingCount({ count }: { count: number }) {
  return (
    // Changing the key remounts the view, which plays entering/exiting
    <Animated.Text key={count} entering={FadeIn} exiting={FadeOut}>
      {count} left
    </Animated.Text>
  );
}
