function TodoList({ todos }: { todos: Todo[] }) { // @link:fn
  return (
    <FlatList // @link:list
      data={todos} // @link:list,items
      keyExtractor={(t) => t.id} // @link:key
      renderItem={({ item }) => <TodoRow todo={item} />} // @link:row
      ItemSeparatorComponent={Divider} // @link:sep
      ListEmptyComponent={<Text>Nothing to do</Text>} // @link:empty
    />
  );
}
