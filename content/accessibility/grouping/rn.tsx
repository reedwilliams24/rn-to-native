function TodoRow({ title, due, done, onToggle }: TodoRowProps) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      style={styles.row}
    >
      <Checkbox value={done} />
      <View>
        <Text>{title}</Text>
        <Text style={styles.caption}>Due {due}</Text>
      </View>
    </Pressable>
  );
}
