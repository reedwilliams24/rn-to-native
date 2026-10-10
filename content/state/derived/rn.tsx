function TodoSummary({ todos, query }: { todos: Todo[]; query: string }) {
  const visible = useMemo(
    () => todos.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())),
    [todos, query],
  );
  const remaining = todos.filter((t) => !t.done).length; // cheap: no memo needed

  return (
    <Text>
      {visible.length} shown · {remaining} left
    </Text>
  );
}
