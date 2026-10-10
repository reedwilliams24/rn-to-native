function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <FlatList
      data={todos}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TodoRow todo={item} />}
      ItemSeparatorComponent={Divider}
      ListEmptyComponent={<Text>Nothing to do</Text>}
    />
  );
}
