const TodoRow = memo(function TodoRow({ todo, onToggle }: RowProps) { // @link:row,memo
  return (
    <Pressable onPress={() => onToggle(todo.id)}>{/* @link:tap */}
      <Text>{todo.done ? '☑' : '☐'} {todo.title}</Text>{/* @link:label */}
    </Pressable>
  );
});

function TodoList({ todos, toggle }: { todos: Todo[]; toggle: (id: string) => void }) { // @link:list
  // Without useCallback, every row re-renders when TodoList does
  const onToggle = useCallback((id: string) => toggle(id), [toggle]); // @link:callback
  return (
    <FlatList // @link:lazy
      data={todos}
      keyExtractor={(t) => t.id} // @link:lazy
      renderItem={({ item }) => <TodoRow todo={item} onToggle={onToggle} />} // @link:call
    />
  );
}
