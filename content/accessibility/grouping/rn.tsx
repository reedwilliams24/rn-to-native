function TodoRow({ title, due, done, onToggle }: TodoRowProps) { // @link:fn
  return (
    <Pressable // @link:group
      onPress={onToggle} // @link:toggle
      accessibilityRole="checkbox" // @link:role
      accessibilityState={{ checked: done }} // @link:state
      style={styles.row}
    >
      <Checkbox value={done} />{/* @link:check */}
      <View>
        <Text>{title}</Text>{/* @link:title */}
        <Text style={styles.caption}>Due {due}</Text>{/* @link:due */}
      </View>
    </Pressable>
  );
}
