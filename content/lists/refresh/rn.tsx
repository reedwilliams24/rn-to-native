function Feed({ todos, reload }: { todos: Todo[]; reload: () => Promise<void> }) { // @link:fn
  const [refreshing, setRefreshing] = useState(false); // @link:state

  const onRefresh = async () => { // @link:handler
    setRefreshing(true); // @link:start
    await reload(); // @link:reload
    setRefreshing(false); // @link:end
  };

  return (
    <FlatList // @link:list
      data={todos} // @link:items
      keyExtractor={(t) => t.id}
      renderItem={({ item }) => <TodoRow todo={item} />} // @link:items
      refreshing={refreshing} // @link:bind
      onRefresh={onRefresh} // @link:bind,handler
    />
  );
}
