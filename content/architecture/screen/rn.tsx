function TodoScreen() { // @link:screen
  // Selectors keep this component from re-rendering on unrelated changes
  const todos = useTodoStore((s) => s.todos); // @link:read
  const toggle = useTodoStore((s) => s.toggle); // @link:read

  return <TodoList todos={todos} onToggle={toggle} />; // @link:pass
}

function TodoList({ todos, onToggle }: { todos: Todo[]; onToggle: (id: string) => void }) { // @link:list
  return (
    <FlatList // @link:lazy
      data={todos}
      keyExtractor={(t) => t.id} // @link:lazy
      renderItem={({ item }) => (
        <TodoRow title={item.title} done={item.done} onToggle={() => onToggle(item.id)} /> // @link:row
      )}
    />
  );
}
