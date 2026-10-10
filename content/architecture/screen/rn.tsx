function TodoScreen() {
  // Selectors keep this component from re-rendering on unrelated changes
  const todos = useTodoStore((s) => s.todos);
  const toggle = useTodoStore((s) => s.toggle);

  return <TodoList todos={todos} onToggle={toggle} />;
}

function TodoList({ todos, onToggle }: { todos: Todo[]; onToggle: (id: string) => void }) {
  return (
    <FlatList
      data={todos}
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => (
        <TodoRow title={item.title} done={item.done} onToggle={() => onToggle(item.id)} />
      )}
    />
  );
}
