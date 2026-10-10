import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

function LikeButton({ liked, onToggle }: { liked: boolean; onToggle: () => void }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(liked ? 1.3 : 1);
  }, [liked]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onToggle}>
      <Animated.Text style={[style, { color: liked ? 'red' : 'gray' }]}>♥</Animated.Text>
    </Pressable>
  );
}
