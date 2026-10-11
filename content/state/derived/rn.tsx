function TodoSummary({ todos, query }: { todos: Todo[]; query: string }) { // @link:fn,props
  const visible = useMemo( // @link:memo
    () => todos.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())), // @link:filter
    [todos, query], // @link:memo
  );
  const remaining = todos.filter((t) => !t.done).length; // cheap: no memo needed // @link:remaining

  return ( // @link:body
    <Text>{/* @link:text */}
      {visible.length} shown · {remaining} left{/* @link:text */}
    </Text>
  );
}
