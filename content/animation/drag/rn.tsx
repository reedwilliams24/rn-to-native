import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

function DraggableCard() { // @link:fn
  const x = useSharedValue(0); // @link:offset
  const y = useSharedValue(0); // @link:offset

  const pan = Gesture.Pan() // @link:gesture
    .onUpdate((e) => { // @link:update
      x.value = e.translationX; // @link:update
      y.value = e.translationY; // @link:update
    })
    .onEnd(() => { // @link:end
      x.value = withSpring(0); // @link:end
      y.value = withSpring(0); // @link:end
    });

  const style = useAnimatedStyle(() => ({ // @link:apply
    transform: [{ translateX: x.value }, { translateY: y.value }], // @link:apply
  }));

  return (
    <GestureDetector gesture={pan}>{/* @link:gesture */}
      <Animated.View style={[styles.card, style]} />{/* @link:card */}
    </GestureDetector>
  );
}
