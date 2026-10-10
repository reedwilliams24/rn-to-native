function TodoListWithTop({ todos }: { todos: Todo[] }) {
  const listRef = useRef<FlatList<Todo>>(null);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={listRef}
        data={todos}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TodoRow todo={item} />}
      />
      <Fab
        icon="arrow-up"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
      />
    </View>
  );
}
