function TodoRow({ title, onDelete, onPin }: TodoRowProps) { // @link:fn
  return (
    <SwipeableRow onSwipeLeft={onDelete} onSwipeRight={onPin}>{/* @link:swipe */}
      <View
        accessible
        accessibilityActions={[ // @link:actions
          { name: 'delete', label: 'Delete' }, // @link:delete
          { name: 'pin', label: 'Pin' }, // @link:pin
        ]}
        onAccessibilityAction={(event) => { // @link:actions
          if (event.nativeEvent.actionName === 'delete') onDelete(); // @link:delete
          if (event.nativeEvent.actionName === 'pin') onPin(); // @link:pin
        }}
      >
        <Text>{title}</Text>{/* @link:title */}
      </View>
    </SwipeableRow>
  );
}
