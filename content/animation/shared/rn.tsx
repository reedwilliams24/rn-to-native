// Reanimated shared element transitions (experimental) work across
// React Navigation screens that use the same sharedTransitionTag.
function TodoThumb({ todo }: { todo: Todo }) { // @link:small
  return (
    <Animated.Image // @link:small
      sharedTransitionTag={`photo-${todo.id}`} // @link:tag
      source={{ uri: todo.photoUrl }}
      style={{ width: 64, height: 64, borderRadius: 12 }} // @link:small
    />
  );
}

function TodoDetail({ todo }: { todo: Todo }) { // @link:large
  return (
    <Animated.Image // @link:large
      sharedTransitionTag={`photo-${todo.id}`} // @link:tag
      source={{ uri: todo.photoUrl }}
      style={{ width: '100%', aspectRatio: 1 }} // @link:large
    />
  );
}
