function TodoListWithTop({ todos }: { todos: Todo[] }) { // @link:fn
  const listRef = useRef<FlatList<Todo>>(null); // @link:ref

  return (
    <View style={{ flex: 1 }}>{/* @link:container */}
      <FlatList // @link:list
        ref={listRef} // @link:ref,list
        data={todos} // @link:items
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TodoRow todo={item} />} // @link:items
      />
      <Fab // @link:button
        icon="arrow-up" // @link:icon
        style={{ position: 'absolute', right: 16, bottom: 16 }} // @link:pos
        onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })} // @link:scroll
      />
    </View>
  );
}
