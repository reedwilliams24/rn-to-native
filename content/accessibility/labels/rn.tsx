function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <Pressable
      onPress={onDelete}
      accessibilityRole="button"
      accessibilityLabel="Delete todo"
      accessibilityHint="Removes it from your list"
      hitSlop={12}
    >
      <TrashIcon />
    </Pressable>
  );
}
