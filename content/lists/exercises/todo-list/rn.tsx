type Todo = { id: string; title: string };

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <FlatList
      data={todos}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => (
        <Text style={{ padding: 16 }}>
          {item.title}
        </Text>
      )}
    />
  );
}
