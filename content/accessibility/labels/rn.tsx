function DeleteButton({ onDelete }: { onDelete: () => void }) { // @link:fn
  return (
    <Pressable // @link:button
      onPress={onDelete} // @link:click
      accessibilityRole="button" // @link:role
      accessibilityLabel="Delete todo" // @link:label
      accessibilityHint="Removes it from your list" // @link:hint
      hitSlop={12} // @link:target
    >
      <TrashIcon />{/* @link:icon */}
    </Pressable>
  );
}
