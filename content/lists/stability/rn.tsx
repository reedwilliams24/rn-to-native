const TodoRow = memo(function TodoRow({ todo, onToggle }: RowProps) {
  return (
    <Pressable onPress={() => onToggle(todo.id)}>
      <Text>{todo.done ? '☑' : '☐'} {todo.title}</Text>
    </Pressable>
  );
});

function TodoList({ todos, toggle }: { todos: Todo[]; toggle: (id: string) => void }) {
  // Without useCallback, every row re-renders when TodoList does
  const onToggle = useCallback((id: string) => toggle(id), [toggle]);
  return (
    <FlatList
      data={todos}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TodoRow todo={item} onToggle={onToggle} />}
    />
  );
}
