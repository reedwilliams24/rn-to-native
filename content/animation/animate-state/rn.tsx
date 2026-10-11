import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

function LikeButton({ liked, onToggle }: { liked: boolean; onToggle: () => void }) { // @link:fn
  const scale = useSharedValue(1); // @link:scale

  useEffect(() => {
    scale.value = withSpring(liked ? 1.3 : 1); // @link:scale,spring
  }, [liked]);

  const style = useAnimatedStyle(() => ({ // @link:apply
    transform: [{ scale: scale.value }], // @link:apply
  }));

  return (
    <Pressable onPress={onToggle}>{/* @link:button */}
      <Animated.Text style={[style, { color: liked ? 'red' : 'gray' }]}>♥</Animated.Text>{/* @link:icon,tint */}
    </Pressable>
  );
}
