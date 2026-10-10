function TodoRow({ title, onDelete, onPin }: TodoRowProps) {
  return (
    <SwipeableRow onSwipeLeft={onDelete} onSwipeRight={onPin}>
      <View
        accessible
        accessibilityActions={[
          { name: 'delete', label: 'Delete' },
          { name: 'pin', label: 'Pin' },
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'delete') onDelete();
          if (event.nativeEvent.actionName === 'pin') onPin();
        }}
      >
        <Text>{title}</Text>
      </View>
    </SwipeableRow>
  );
}
