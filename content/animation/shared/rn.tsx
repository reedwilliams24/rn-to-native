// Reanimated shared element transitions (experimental) work across
// React Navigation screens that use the same sharedTransitionTag.
function TodoThumb({ todo }: { todo: Todo }) {
  return (
    <Animated.Image
      sharedTransitionTag={`photo-${todo.id}`}
      source={{ uri: todo.photoUrl }}
      style={{ width: 64, height: 64, borderRadius: 12 }}
    />
  );
}

function TodoDetail({ todo }: { todo: Todo }) {
  return (
    <Animated.Image
      sharedTransitionTag={`photo-${todo.id}`}
      source={{ uri: todo.photoUrl }}
      style={{ width: '100%', aspectRatio: 1 }}
    />
  );
}
